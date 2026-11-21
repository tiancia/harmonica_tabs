"use strict";

(() => {
  const songs = window.HARMONICA_SONGS;
  const storageKey = "ten-hole-songbook.shijiazhuang.v1";
  const $ = (id) => document.getElementById(id);
  const elements = {
    lines: $("score-lines"),
    playable: $("playable-content"),
    custom: $("custom-content"),
    input: $("tab-input"),
    error: $("import-error"),
    play: $("autoplay"),
    status: $("playback-status"),
    tempo: $("tempo"),
    harmonica: $("harmonica"),
    dialog: $("guide-dialog"),
    practicePanel: document.querySelector(".practice-panel"),
    toolbar: document.querySelector(".score-toolbar"),
  };
  let selectedSong = songs[0];
  let notes = [];
  let noteButtons = [];
  let noteToChars = [];
  let currentIndex = 0;
  let timer = null;
  let playing = false;
  let deadline = 0;
  let importedText = "";
  let storageWarning = "";
  let savedSong = null;
  let useSavedSong = false;
  const maxBends = { "-1": 1, "-2": 2, "-3": 3, "-4": 1, "-6": 1, 8: 1, 9: 1, 10: 2 };

  function makeElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) element.className = className;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  function beatsLabel(beats) {
    if (beats === 0.5) return "半拍";
    const fractions = { 0.25: "¼", 0.5: "½", 0.75: "¾" };
    const fraction = fractions[beats % 1];
    if (fraction) return `${Math.floor(beats) || ""}${fraction} 拍`;
    return `${beats} 拍`;
  }

  function noteAction(hole) {
    if (hole === 0) return "休息 · 不吹不吸";
    return `第 ${Math.abs(hole)} 孔 · ${hole > 0 ? "吹气" : "吸气"}`;
  }

  function serializeTabs(phrases) {
    return phrases.map((phrase) => phrase.bars.map((bar) => bar.map(([hole, beats, meta = {}]) =>
      `${meta.tie ? "~" : ""}${hole || "休"}${"'".repeat(meta.bend || 0)}${beats === 1 ? "" : `:${beats}`}`,
    ).join(" ")).join(" | ")).join("\n");
  }

  function makeSavedSong(phrases) {
    return {
      id: "shijiazhuang", title: "杀死那个石家庄人", credit: "万能青年旅店 · 我的练习谱",
      description: "",
      tags: ["A 调口琴", "自行保存"],
      phrases, builtin: false,
    };
  }

  function parseTabs(text) {
    if (!text.trim()) throw new Error("先粘贴一些孔位数字，再保存曲谱。");
    if (text.length > 12000) throw new Error("曲谱太长了，请控制在 12000 个字符以内。");
    const normalized = text.replace(/[−－]/g, "-").replace(/：/g, ":").replace(/｜/g, "|").replace(/[’′]/g, "'");
    let noteCount = 0;
    let previous = null;
    const phrases = normalized.split(/\r?\n/).filter((line) => line.trim()).map((line, lineIndex) => {
      const bars = line.split("|").filter((bar) => bar.trim()).map((bar) => {
        return bar.trim().split(/\s+/).map((token) => {
          const match = token.match(/^(~)?(-?(?:10|[1-9])|休|0)('{0,3})(?::(\d+(?:\.\d+)?))?$/);
          if (!match) throw new Error(`第 ${lineIndex + 1} 行的“${token.slice(0, 24)}”无法识别。请用孔号、单引号压音和 :拍数，例如 -2'':2；续音前加 ~。`);
          const hole = match[2] === "休" ? 0 : Number(match[2]);
          const beats = match[4] ? Number(match[4]) : 1;
          const bend = match[3].length;
          const tie = Boolean(match[1]);
          if (!Number.isFinite(beats) || beats < 0.25 || beats > 8 || !Number.isInteger(beats * 4)) {
            throw new Error(`第 ${lineIndex + 1} 行的时长须为 0.25～8 拍，按 0.25 递增。`);
          }
          if (bend > (maxBends[hole] || 0)) throw new Error(`第 ${lineIndex + 1} 行的“${token}”不是这个孔可用的标准压音。请核对吹吸方向与压音深度。`);
          if (tie && (!hole || !previous || previous[0] !== hole || previous[2].bend !== bend)) {
            throw new Error(`第 ${lineIndex + 1} 行的续音必须紧接同一孔、同一吹吸方向、同一压音深度的音。`);
          }
          noteCount += 1;
          previous = [hole, beats, { bend, tie }];
          return previous;
        });
      });
      if (!bars.length) throw new Error(`第 ${lineIndex + 1} 行只有分隔线，请补上孔位数字或删掉这一行。`);
      return { label: `第 ${lineIndex + 1} 句`, bars };
    });
    if (noteCount > 1000) throw new Error("一次最多保存 1000 个音，请先取一段来练习。");
    return phrases;
  }

  function loadImportedSong() {
    try {
      const saved = localStorage.getItem(storageKey);
      if (!saved) return;
      const data = JSON.parse(saved);
      if (data.version !== 1 || typeof data.tabs !== "string") throw new Error("Invalid saved tabs");
      const phrases = parseTabs(data.tabs);
      importedText = data.tabs;
      savedSong = makeSavedSong(phrases);
    } catch {
      storageWarning = "浏览器中的曲谱未能读取。可重新粘贴并保存；已有存储未被覆盖。";
    }
  }

  function updatePlayButton() {
    elements.play.replaceChildren(
      makeElement("span", "", playing ? "Ⅱ" : "▶"),
      document.createTextNode(playing ? " 暂停指谱" : " 自动指谱"),
    );
    elements.play.firstChild.setAttribute("aria-hidden", "true");
    elements.play.setAttribute("aria-pressed", String(playing));
    $("current-note").setAttribute("aria-live", playing ? "off" : "polite");
  }

  function stopPlayback(message) {
    clearTimeout(timer);
    timer = null;
    playing = false;
    updatePlayButton();
    if (message) elements.status.textContent = message;
  }

  function revealNote(element) {
    // 给吸顶孔位提示和工具栏留出空间，避免当前音被挡住。
    const top = elements.practicePanel.getBoundingClientRect().height
      + elements.toolbar.getBoundingClientRect().height + 16;
    const bottom = window.innerHeight - 30;
    const bounds = element.getBoundingClientRect();
    if (bounds.top < top || bounds.bottom > bottom) {
      const target = top + Math.max(0, (bottom - top - bounds.height) / 2);
      window.scrollBy({ top: bounds.top - target, behavior: "instant" });
    }
  }

  function selectNote(index, { automatic = false, follow = false } = {}) {
    if (!notes.length) return;
    if (!automatic) stopPlayback("已选中这个音。可以慢慢吹，或从这里开始自动指谱。");
    const previous = noteButtons[currentIndex];
    if (previous) {
      previous.classList.remove("is-current");
      previous.removeAttribute("aria-current");
    }
    // 清除上一个歌词字的高亮
    noteToChars[currentIndex]?.forEach((charEl) => charEl.classList.remove("is-current"));
    currentIndex = Math.max(0, Math.min(index, notes.length - 1));
    const [hole, beats, meta = {}] = notes[currentIndex];
    const current = noteButtons[currentIndex];
    current.classList.add("is-current");
    current.setAttribute("aria-current", "true");
    // 高亮当前音符对应的歌词字
    noteToChars[currentIndex]?.forEach((charEl) => {
      charEl.classList.add("is-current");
      if (automatic && !selectedSong.lyricsUnderNotes) revealNote(charEl);
    });
    $("current-tab").textContent = hole || "休";
    $("current-tab").className = hole > 0 ? "blow" : hole < 0 ? "draw" : "";
    $("current-action").replaceChildren(
      document.createTextNode(noteAction(hole)),
      ...(meta.bend ? [makeElement("small", "current-bend", `压低 ${meta.bend} 个半音`)] : []),
      makeElement("small", "", `${hole ? "保持" : "暂停"} ${beatsLabel(beats)}`),
    );
    $("current-note").querySelector(".current-caption").textContent = meta.tie ? "续音，不重新起音" : hole ? "当前孔位" : "这时先休息";
    $("note-position").textContent = `第 ${currentIndex + 1} / ${notes.length} 音`;
    $("previous-note").disabled = currentIndex === 0;
    $("next-note").disabled = currentIndex === notes.length - 1;
    elements.harmonica.classList.toggle("is-draw", hole < 0);
    Array.from(elements.harmonica.children).forEach((element, i) => {
      element.classList.toggle("is-active", i + 1 === Math.abs(hole));
    });
    elements.harmonica.setAttribute("aria-label", `口琴孔位示意图，${noteAction(hole)}${meta.bend ? `，压低 ${meta.bend} 个半音` : ""}`);
    if (automatic || follow) revealNote(current);
  }

  function advancePlayback() {
    if (!playing) return;
    if (currentIndex === notes.length - 1) {
      stopPlayback("这一遍练完了。再点自动指谱，可以从头练习。");
      return;
    }
    selectNote(currentIndex + 1, { automatic: true });
    deadline += notes[currentIndex][1] * 60000 / Number(elements.tempo.value);
    timer = setTimeout(advancePlayback, Math.max(0, deadline - performance.now()));
  }

  function startPlayback() {
    if (!notes.length) return;
    if (currentIndex === notes.length - 1) selectNote(0);
    playing = true;
    updatePlayButton();
    elements.status.textContent = "正在自动指谱 · 按高亮吹吸；只指谱，不播放声音。";
    selectNote(currentIndex, { automatic: true });
    deadline = performance.now() + notes[currentIndex][1] * 60000 / Number(elements.tempo.value);
    timer = setTimeout(advancePlayback, Math.max(0, deadline - performance.now()));
  }

  async function loadScoreLyrics(song, addLyrics) {
    const firstSection = elements.lines.firstElementChild;
    const description = $("song-description");
    description.textContent = "正在载入歌词…";
    description.hidden = false;
    try {
      await song.loadLyrics();
    } catch {
      if (!firstSection.isConnected) return;
      const retry = makeElement("button", "text-button", "重试歌词");
      retry.type = "button";
      retry.addEventListener("click", () => loadScoreLyrics(song, addLyrics), { once: true });
      description.replaceChildren(document.createTextNode("歌词暂未载入，仍可按孔位练习。 "), retry);
      return;
    }
    if (!firstSection.isConnected) return;
    addLyrics.forEach((add) => add());
    noteToChars[currentIndex].forEach((span) => span.classList.add("is-current"));
    description.textContent = song.description;
    description.hidden = !song.description;
  }

  function renderScore() {
    notes = [];
    noteButtons = [];
    noteToChars = [];
    currentIndex = 0;
    const fragment = document.createDocumentFragment();
    const sections = [];
    const needsLyrics = selectedSong.loadLyrics && !selectedSong.phrases.some((phrase) => phrase.lyrics);
    const pendingLyrics = [];
    selectedSong.phrases.forEach((phrase, phraseIndex) => {
      if (phrase.section) sections.push({ label: phrase.section, index: notes.length });
      const section = makeElement("section", "phrase");
      const heading = makeElement("div", "phrase-heading");
      const number = makeElement("span", "phrase-number", String(phraseIndex + 1).padStart(2, "0"));
      number.setAttribute("aria-hidden", "true");
      heading.append(number, makeElement("h2", "", phrase.label));
      const bars = makeElement("div", "bars");
      const phraseStart = notes.length;
      phrase.bars.forEach((bar) => {
        const barElement = makeElement("div", "bar");
        bar.forEach(([hole, beats, meta = {}]) => {
          const index = notes.length;
          notes.push([hole, beats, meta]);
          noteToChars.push([]);
          const button = makeElement("button", `note ${hole > 0 ? "blow" : hole < 0 ? "draw" : "rest"}`);
          button.type = "button";
          button.setAttribute("aria-label", `第 ${index + 1} 音，${noteAction(hole)}${meta.bend ? `，压低 ${meta.bend} 个半音` : ""}，${beatsLabel(beats)}${meta.tie ? "，续音，不重新起音" : ""}`);
          if (meta.measure) button.dataset.measure = meta.measure;
          button.append(makeElement("span", "note-symbol", hole || "休"));
          if (meta.bend) button.append(makeElement("span", "note-technique", `压 ${meta.bend} 半音`));
          button.append(makeElement("span", "note-beats", `${meta.tie ? "续 · " : ""}${beatsLabel(beats)}`));
          if (meta.tie) button.classList.add("is-tied");
          button.addEventListener("click", () => selectNote(index));
          noteButtons.push(button);
          barElement.append(button);
        });
        bars.append(barElement);
      });
      section.append(heading, bars);
      function addLyrics(entries = phrase.lyrics) {
        if (!entries) return;
        if (selectedSong.lyricsUnderNotes) bars.classList.add("has-note-lyrics");
        const lyricLine = makeElement("div", "lyric-line");
        entries.forEach((entry) => {
          if (!entry.notes.length) {
            lyricLine.append(makeElement("span", "lyric-punct", entry.char));
            return;
          }
          const indices = entry.notes.map((offset) => phraseStart + offset);
          const firstNote = indices[0];
          const heldLyric = notes[firstNote][2].tie
            ? noteToChars[firstNote - 1]?.find((el) => el.textContent === entry.char)
            : null;
          const span = heldLyric || makeElement("span", "lyric-char", entry.char);
          const noteList = indices.map((index) => `第${index + 1}音`).join("、");
          span.title = heldLyric ? `${span.title}、${noteList}` : `${entry.char} → ${noteList}`;
          if (!heldLyric) {
            span.addEventListener("click", () => selectNote(firstNote, { follow: true }));
            lyricLine.append(span);
          }
          indices.forEach((index) => {
            noteToChars[index].push(span);
            if (selectedSong.lyricsUnderNotes) {
              const continued = Boolean(heldLyric) || index !== firstNote;
              const button = noteButtons[index];
              button.append(makeElement("span", "note-lyric", continued ? "—" : entry.char));
              button.setAttribute("aria-label", `${button.getAttribute("aria-label")}，${continued ? "延唱" : "歌词"}「${entry.char}」`);
            }
          });
        });
        if (lyricLine.childElementCount) bars.after(lyricLine);
        return lyricLine;
      }
      if (needsLyrics && phrase.previewLyrics) {
        const previewNotes = phrase.previewLyrics.flatMap(entry => entry.notes).map(offset => {
          const index = phraseStart + offset;
          return [index, noteButtons[index].getAttribute("aria-label")];
        });
        const previewLine = addLyrics(phrase.previewLyrics);
        pendingLyrics.push(() => {
          if (phrase.lyrics === phrase.previewLyrics) return;
          previewLine.remove();
          for (const [index, label] of previewNotes) {
            noteToChars[index] = [];
            noteButtons[index].querySelector(".note-lyric")?.remove();
            noteButtons[index].setAttribute("aria-label", label);
          }
          addLyrics();
        });
      } else if (needsLyrics) pendingLyrics.push(addLyrics);
      else addLyrics();
      if (phrase.warning) section.append(makeElement("p", "score-warning", phrase.warning));
      fragment.append(section);
    });
    elements.lines.replaceChildren(fragment);
    $("section-navigation").hidden = sections.length < 2;
    $("section-jump").replaceChildren(...sections.map((section) => {
      const option = makeElement("option", "", section.label);
      option.value = section.index;
      return option;
    }));
    selectNote(0);
    elements.status.textContent = "自动指谱只移动高亮，不播放音乐。也可以按上一音、下一音慢慢练。";
    if (needsLyrics) loadScoreLyrics(selectedSong, pendingLyrics);
  }

  function renderSong(songId) {
    stopPlayback();
    selectedSong = songs.find((song) => song.id === songId) || songs[0];
    const isCustom = selectedSong.id === "shijiazhuang";
    if (isCustom && useSavedSong && savedSong) selectedSong = savedSong;
    const playable = selectedSong.phrases.length > 0;
    document.title = `${selectedSong.title} · 十孔谱本`;
    $("score-title").textContent = selectedSong.title;
    $("song-credit").textContent = selectedSong.credit;
    $("song-description").textContent = selectedSong.description;
    $("song-description").hidden = !selectedSong.description;
    const tags = selectedSong.tags;
    $("song-tags").replaceChildren(...tags.map((tag) => makeElement("span", "", tag)));
    document.querySelectorAll(".song-choice").forEach((button) => {
      const active = button.dataset.song === songId;
      button.classList.toggle("is-selected", active);
      if (active) button.setAttribute("aria-current", "true");
      else button.removeAttribute("aria-current");
    });
    $("custom-song-status").textContent = useSavedSong && savedSong ? "我的练习谱" : "进阶练习 · 需压音";
    elements.playable.hidden = !playable;
    elements.custom.hidden = playable;
    $("custom-actions").hidden = !isCustom || !playable;
    $("show-builtin").hidden = !useSavedSong;
    $("show-saved").hidden = useSavedSong || !savedSong;
    $("cancel-import").hidden = !playable;
    if (isCustom) elements.input.value = importedText || serializeTabs(selectedSong.phrases);
    elements.error.textContent = isCustom ? storageWarning : "";
    elements.input.removeAttribute("aria-invalid");
    renderScore();
    if (isCustom && storageWarning) elements.status.textContent = storageWarning;
  }

  function initSongList() {
    const list = document.querySelector(".song-list");
    const orderKey = "ten-hole-songbook.song-order.v1";
    const choices = new Map(Array.from(list.children, (button) => [button.dataset.song, button]));
    try {
      const saved = JSON.parse(localStorage.getItem(orderKey));
      if (Array.isArray(saved)) {
        const order = [...new Set(saved)].filter((id) => choices.has(id));
        let previousId = null;
        for (const [id, button] of choices) {
          if (!order.includes(id)) {
            const beforeIndex = order.indexOf(button.dataset.insertBefore);
            const position = beforeIndex >= 0 ? beforeIndex : order.indexOf(previousId) + 1;
            order.splice(position, 0, id);
          }
          previousId = id;
        }
        list.append(...order.map((id) => choices.get(id)));
      }
    } catch {
      // 无法读取偏好时使用页面中的默认顺序。
    }

    const status = $("song-order-status");
    let drag = null;
    let suppressClick = false;

    function moveSong(button, target) {
      const order = Array.from(list.children);
      const index = order.indexOf(target);
      if (index > order.indexOf(button)) target.after(button);
      else target.before(button);
      button.focus({ preventScroll: true });
      try {
        localStorage.setItem(orderKey, JSON.stringify(Array.from(list.children, (item) => item.dataset.song)));
        status.className = "sr-only";
        status.textContent = `《${button.querySelector("strong").textContent}》已移到第 ${index + 1} 首。`;
      } catch {
        status.className = "sidebar-note";
        status.textContent = "顺序已调整。当前浏览器无法保存，刷新后会恢复默认顺序。";
      }
    }

    function dropTarget(event) {
      const target = document.elementFromPoint(event.clientX, event.clientY)?.closest(".song-choice");
      return target !== drag.button && target?.parentElement === list ? target : null;
    }

    function endDrag(event) {
      if (event.pointerId !== drag?.id) return;
      const { button, target } = drag;
      const destination = event.type === "pointerup" && suppressClick && dropTarget(event);
      drag = null;
      button.classList.remove("is-dragging");
      if (target) delete target.dataset.drop;
      if (destination) moveSong(button, destination);
    }

    list.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary || event.button !== 0 || drag) return;
      suppressClick = false;
      const button = event.target.closest(".song-choice");
      if (!button || (event.pointerType === "touch" && !event.target.closest(".song-grip"))) return;
      drag = { button, id: event.pointerId, x: event.clientX, y: event.clientY, target: null };
      button.setPointerCapture(event.pointerId);
    });
    list.addEventListener("pointermove", (event) => {
      if (event.pointerId !== drag?.id) return;
      if (!suppressClick && Math.hypot(event.clientX - drag.x, event.clientY - drag.y) < 5) return;
      suppressClick = true;
      drag.button.classList.add("is-dragging");
      const target = dropTarget(event);
      if (target === drag.target) return;
      if (drag.target) delete drag.target.dataset.drop;
      drag.target = target;
      if (target) {
        const follows = drag.button.compareDocumentPosition(target) & Node.DOCUMENT_POSITION_FOLLOWING;
        target.dataset.drop = follows ? "after" : "before";
      }
    });
    list.addEventListener("pointerup", endDrag);
    list.addEventListener("pointercancel", endDrag);
    list.addEventListener("lostpointercapture", endDrag);
    // 避免浏览器把快速拖动手柄当作滑动翻页，吞掉松手后的下一次点歌。
    list.querySelectorAll(".song-grip").forEach((grip) => {
      grip.addEventListener("touchmove", (event) => event.preventDefault(), { passive: false });
    });
    list.addEventListener("click", (event) => {
      const button = event.target.closest(".song-choice");
      if (button && !(suppressClick && event.detail)) renderSong(button.dataset.song);
    });
    list.addEventListener("keydown", (event) => {
      const button = event.target.closest(".song-choice");
      if (!button || !event.altKey || !["ArrowUp", "ArrowDown"].includes(event.key)) return;
      event.preventDefault();
      const target = event.key === "ArrowUp" ? button.previousElementSibling : button.nextElementSibling;
      if (target) moveSong(button, target);
    });
  }

  for (let hole = 1; hole <= 10; hole += 1) {
    const cell = makeElement("span", "hole", hole);
    cell.setAttribute("aria-hidden", "true");
    elements.harmonica.append(cell);
  }
  loadImportedSong();
  initSongList();
  renderSong("farewell");
  const practicePanelObserver = new ResizeObserver(() => {
    elements.playable.style.setProperty("--practice-panel-height", `${elements.practicePanel.getBoundingClientRect().height}px`);
  });
  practicePanelObserver.observe(elements.practicePanel);

  $("previous-note").addEventListener("click", () => selectNote(currentIndex - 1, { follow: true }));
  $("next-note").addEventListener("click", () => selectNote(currentIndex + 1, { follow: true }));
  $("section-jump").addEventListener("change", () => {
    selectNote(Number($("section-jump").value), { follow: true });
  });
  elements.play.addEventListener("click", () => {
    if (playing) stopPlayback("已暂停。再次开始会从当前这个音的开头继续。");
    else startPlayback();
  });
  elements.tempo.addEventListener("change", () => {
    stopPlayback("速度已更新。点击自动指谱，从当前这个音重新开始。");
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden && playing) stopPlayback("离开页面后已自动暂停，准备好再继续。");
  });
  window.addEventListener("pagehide", () => stopPlayback());

  document.querySelectorAll(".guide-trigger").forEach((button) => {
    button.addEventListener("click", () => {
      if (playing) stopPlayback("查看说明时已暂停指谱。");
      elements.dialog.showModal();
    });
  });
  $("close-guide").addEventListener("click", () => elements.dialog.close());
  elements.dialog.addEventListener("click", (event) => {
    if (event.target !== elements.dialog) return;
    const bounds = elements.dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) elements.dialog.close();
  });

  $("edit-tabs").addEventListener("click", () => {
    stopPlayback();
    elements.playable.hidden = true;
    elements.custom.hidden = false;
    $("custom-actions").hidden = true;
    elements.input.value = selectedSong.builtin ? serializeTabs(selectedSong.phrases) : importedText;
    elements.input.focus();
  });
  $("show-builtin").addEventListener("click", () => {
    useSavedSong = false;
    renderSong("shijiazhuang");
  });
  $("show-saved").addEventListener("click", () => {
    useSavedSong = true;
    renderSong("shijiazhuang");
  });
  $("cancel-import").addEventListener("click", () => renderSong("shijiazhuang"));
  $("import-form").addEventListener("submit", (event) => {
    event.preventDefault();
    let phrases;
    try {
      phrases = parseTabs(elements.input.value);
    } catch (error) {
      elements.error.textContent = error.message;
      elements.input.setAttribute("aria-invalid", "true");
      elements.input.focus();
      return;
    }
    importedText = elements.input.value.trim();
    savedSong = makeSavedSong(phrases);
    useSavedSong = true;
    storageWarning = "";
    try {
      localStorage.setItem(storageKey, JSON.stringify({ version: 1, tabs: importedText }));
    } catch {
      storageWarning = "曲谱已显示，但浏览器不允许保存。关闭或刷新后会丢失，请保留原始曲谱。";
    }
    renderSong("shijiazhuang");
    elements.status.textContent = storageWarning || "曲谱已保存在当前浏览器。可以点任意一个音开始练习。";
    $("score-title").focus();
  });
})();
