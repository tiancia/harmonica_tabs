"use strict";

// 来源仅为用户提供的 1.jpg、2.jpg；第二张图上半部分与第一张重叠，不能重复拼接。
// 按用户说明 1=D 整理，采用中音 1=D4（MIDI 62），低音 6=B3。
// 保留原谱音高，用标准 A 调 Richter 口琴演奏，未把 1=D 整体移成 1=A。
// 原谱记法：_ 低八度，^ 高八度，# 升半音，0 休止，: 后为拍数；~ 接续前音。
// 下划线时值已展开，弧线连接同音按延音线处理；不额外抄录网上旋律。
(() => {
  const sourceBars = [
    // 引子，1–9。原图第一行没有拍号；按可见四拍结构读取。
    "0:1 0:1 0:1 1:0.25 2:0.25 1:0.5",
    "_6:3 1:0.5 2:0.5",
    "3:3 1:0.25 2:0.25 1:0.5",
    "_6:3 _5:1",
    "_6:3 1:0.25 2:0.25 1:0.5",
    "_6:3 1:0.5 2:0.5",
    "3:3 1:0.25 2:0.25 1:0.5",
    "_6:3 1:1",
    "_6:4",
    // 较高音区的旋律，10–41。
    "0:1 6:0.5 6:0.5 7:0.5 6:0.5 7:0.5 ^1:0.5",
    "~^1:2 0:1 0:1",
    "0:1 6:0.5 6:0.5 7:0.5 6:0.5 7:0.5 ^1:0.5",
    "~^1:0.5 6:1.5 0:1 0:1",
    "0:1 0:0.5 6:0.5 7:0.5 6:0.5 7:0.5 ^1:0.5",
    "~^1:2 0:1 0:1",
    "0:1 6:0.5 6:0.5 7:0.5 6:0.5 7:0.5 ^1:0.5",
    "~^1:0.5 6:1.5 0:1 ^5:0.5 ^5:0.5",
    // 第 18 小节跨图片换行，第一张第 4 行首个 5 无高音点，保留该音高。
    "~^5:1 ^1:0.5 6:0.5 5:0.5 ^5:1 ^3:0.5",
    "~^3:2 0:1 0:0.5 ^1:0.5",
    "6:1 ^1:1 ^2:1 ^2:0.5 ^3:0.5",
    "~^3:2 0:1 ^5:0.5 ^5:0.5",
    "~^5:1 ^1:0.5 6:0.5 ^5:0.5 ^5:1 ^3:0.5",
    "~^3:0.5 ^1:1.5 0:1 6:0.5 7:0.5",
    "^1:1 ^2:0.5 6:0.5 ~6:1 5:0.5 6:0.5",
    "~6:2 0:1 0:1",
    "0:1 6:0.5 6:0.5 7:0.5 6:0.5 7:0.5 ^1:0.5",
    "~^1:2 0:1 0:1",
    "0:1 6:0.5 6:0.5 7:0.5 6:0.5 7:0.5 ^1:0.5",
    "~^1:0.5 6:1.5 0:1 0:1",
    "0:1 6:0.5 6:0.5 7:0.5 6:0.5 7:0.5 ^1:0.5",
    "~^1:2 0:1 0:1",
    "0:1 6:0.5 6:0.5 7:0.5 6:0.5 7:0.5 ^1:0.5",
    "~^1:0.5 6:1.5 0:1 ^5:0.5 ^5:0.5",
    "~^5:1 ^1:0.5 6:0.5 ^5:0.5 ^5:1 ^3:0.5",
    // 第 35 小节跨行末音 1 按原图可见的中音记录；这里未见跨小节延音弧线。
    "^3:2 0:1 0:0.5 1:0.5",
    "6:1 ^1:1 ^2:1 ^2:0.5 ^3:0.5",
    "~^3:2 0:1 ^5:0.5 ^5:0.5",
    // 原图第 7 行此小节可见时值合计 3.5，未擅自补齐半拍，界面提示核对。
    "~^5:1 ^1:0.5 6:0.5 ^5:0.5 ^5:1",
    "~^5:1 ^1:0.5 6:0.5 ^5:0.5 ^5:1 ^3:0.5",
    "~^3:0.5 ^1:1.5 0:1 6:0.5 7:0.5",
    "^1:1 ^2:0.5 6:0.5 ~6:1 5:0.5 6:0.5",
    // 衔接，42–47。
    "~6:2 6:0.5 3:0.5 1:0.5 2:0.5",
    "_6:1 1:1 _7:0.5 _7:0.5 0:0.5 1:0.5",
    "~1:2 6:0.5 3:0.5 1:0.5 3:0.5",
    "_6:1 1:1 _7:0.5 3:0.5 0:0.5 1:0.5",
    "~1:2 6:0.5 3:0.5 1:0.5 2:0.5",
    "_6:1 1:1 _7:0.5 _7:0.5 0:0.5 1:0.5",
    // 较低音区的旋律，48–66；2.jpg 顶部从第 47 小节起重复到第 78 小节。
    "~1:2 _7:2",
    "_6:1 _6:0.5 _6:0.5 _7:0.5 _6:0.5 _7:0.5 1:0.5",
    "~1:4",
    "0:1 _6:0.5 _6:0.5 _7:0.5 _6:0.5 _7:0.5 1:0.5",
    "~1:4",
    "0:1 _6:0.5 _6:0.5 _7:0.5 _6:0.5 _7:0.5 1:0.5",
    "~1:0.5 _6:1.5 ~_6:2",
    "0:1 _6:0.5 _6:0.5 _7:0.5 _6:0.5 _7:0.5 1:0.5",
    "~1:4",
    "0:1 _6:0.5 _6:0.5 _7:0.5 _6:0.5 _7:0.5 1:0.5",
    "~1:0.5 _6:1.5 ~_6:1 5:0.5 5:0.5",
    "~5:1 1:1 5:0.5 ~5:1 3:0.5",
    "~3:2 3:0.5 0:0.5 0:0.5 1:0.5",
    "_6:1 1:1 2:1 2:0.5 3:0.5",
    "~3:3 5:0.5 5:0.5",
    "~5:1 1:1 5:0.5 ~5:1 3:0.5",
    "~3:0.5 1:1.5 ~1:1 _6:0.5 _7:0.5",
    "1:1 2:0.5 _6:0.5 ~_6:1 _5:0.5 _6:0.5",
    "~_6:3 3:0.5 5:0.5",
    // 间奏，67–74。#4=G#4，是 A 琴普通三孔吸气，不是压音。
    "#4:3 3:0.5 2:0.5",
    "3:3 3:0.5 5:0.5",
    "#4:3 3:0.5 2:0.5",
    "1:3 5:1",
    "#4:3 3:0.5 2:0.5",
    "3:3 3:0.5 5:0.5",
    "#4:3 3:0.5 2:0.5",
    "1:4",
    // 快速音型，75–81。保留十六分音符、升 2、升 5，不能默默舍去。
    "1:0.5 _6:0.25 1:0.25 1:0.25 _6:0.25 1:0.5 _6:0.25 1:0.5 _6:0.25 1:0.5 _6:0.5",
    "1:0.5 _6:0.25 1:0.25 1:0.25 _6:0.25 1:0.5 _6:0.25 1:0.5 _6:0.25 1:0.5 _6:0.5",
    "3:0.5 1:0.25 3:0.25 3:0.25 1:0.25 3:0.5 1:0.25 3:0.5 1:0.25 5:0.5 3:0.5",
    "3:0.5 1:0.25 3:0.25 3:0.25 1:0.25 3:0.5 1:0.25 3:0.5 1:0.25 5:0.5 3:0.5",
    // 以下才接 2.jpg 横分隔线下方，避免重播重叠的 32 小节。
    "5:0.5 3:0.25 5:0.25 ~5:0.25 3:0.25 5:0.5 3:0.25 5:0.5 3:0.25 5:0.5 3:0.5",
    "5:0.5 3:0.25 5:0.25 ~5:0.25 3:0.25 5:0.5 3:0.25 5:0.5 3:0.25 5:0.5 3:0.5",
    "_6:0.25 1:0.25 2:0.25 #2:0.25 3:0.25 5:0.25 6:0.25 ^1:0.25 ^2:0.5 ^1:0.25 6:0.25 ^2:0.25 1:0.25 6:0.25 #5:0.25",
    // 尾段，82–98。
    "6:3 5:0.5 5:0.5",
    "~5:1 1:1 5:0.5 ~5:1 3:0.5",
    "~3:2 3:0.5 0:0.5 0:0.5 1:0.5",
    "_6:1 1:1 2:1 2:0.5 3:0.5",
    "~3:3 5:0.5 5:0.5",
    "~5:1 1:1 2:1 2:0.5 3:0.5",
    "~3:0.5 1:1.5 ~1:1 _6:0.5 _7:0.5",
    "1:1 2:0.5 _6:0.5 ~_6:1 _5:0.5 _5:0.5",
    "~_5:2 0:1 5:0.5 5:0.5",
    "~5:1 1:1 5:0.5 5:1 3:0.5",
    "~3:2 3:0.5 0:1 1:0.5",
    "_6:1 1:1 2:1 2:0.5 3:0.5",
    "~3:3 5:0.5 5:0.5",
    "~5:1 1:0.5 _6:0.5 5:0.5 5:1 3:0.5",
    "~3:0.5 1:1.5 ~1:1 _6:0.5 _7:0.5",
    "1:1 2:0.5 _6:0.5 ~_6:1 _5:0.5 _6:0.5",
    "~_6:3 0:1",
  ];

  // [孔位, 压低的半音数, MIDI]。普通吸气 2 和吹气 3 同音，此处优先用 3。
  const pitches = {
    _5: [1, 0, 57], _6: [-1, 0, 59], _7: [2, 0, 61],
    1: [-2, 2, 62], 2: [3, 0, 64], "#2": [-3, 3, 65],
    3: [-3, 2, 66], 4: [-3, 1, 67], "#4": [-3, 0, 68],
    5: [4, 0, 69], "#5": [-4, 1, 70], 6: [-4, 0, 71], 7: [5, 0, 73],
    "^1": [-5, 0, 74], "^2": [6, 0, 76], "^3": [-6, 0, 78], "^5": [7, 0, 81],
  };
  let previousPitch = null;
  const bars = sourceBars.map((bar, index) => bar.split(" ").map((token) => {
    const [symbol, duration] = token.split(":");
    const tie = symbol.startsWith("~");
    const pitch = tie ? symbol.slice(1) : symbol;
    const beats = Number(duration);
    if (tie && (pitch === "0" || pitch !== previousPitch)) throw new Error(`第 ${index + 1} 小节的延音线音高不一致`);
    previousPitch = pitch;
    if (pitch === "0") return [0, beats, { source: pitch, measure: index + 1 }];
    const mapped = pitches[pitch];
    if (!mapped) throw new Error(`未适配的原谱音：${pitch}`);
    const [hole, bend, midi] = mapped;
    return [hole, beats, { bend, tie, midi, source: pitch, measure: index + 1 }];
  }));

  const sections = [
    ["引子", 1, 9], ["高音旋律", 10, 41], ["衔接", 42, 47],
    ["低音旋律", 48, 66], ["间奏", 67, 74], ["快速音型", 75, 81], ["尾段", 82, 98],
  ];
  const phrases = sections.flatMap(([label, from, to]) => {
    const result = [];
    for (let first = from; first <= to; first += 4) {
      const last = Math.min(first + 3, to);
      result.push({
        label: `${label} · 第 ${first}–${last} 小节`,
        section: first === from ? label : undefined,
        bars: bars.slice(first - 1, last),
        ...(first <= 38 && last >= 38 ? { warning: "第 38 小节节拍待核对，当前为 3½ 拍。" } : {}),
      });
    }
    return result;
  });

  // 每行是一句唱词的两个分句。数字是分句内的字序，竖线换小节，点留空。
  // 同一数字再次出现时延唱；括号里的两个字共用谱上的一个长音。
  const vocalLayout = [
    [[10, ".123456|6"], [12, ".123456|67"]],
    [[14, "..12345|5"], [16, ".123456|67"]],
    [[17, "...12|234567|7"], [19, "...1|23456|6"]],
    [[21, "..12|234567|78"], [23, "...12|345567|7"]],
    [[26, "..12345|5"], [28, ".123456|67"]],
    [[30, "..12345|5"], [32, "..12345|55"]],
    [[33, "...12|233456|6"], [35, "...1|23456|6"]],
    // 第 38 小节的首音延续上一小节的末字，多出的音型留空，从第 39 小节接回后半句。
    [[37, "..12|2|.34567|78"], [40, "...12|345567|7"]],
    // 低音区先多奏一遍旋律，第三段的连续四个分句从 51 开始。
    [[51, ".123456|6"], [53, ".123456|677"]],
    [[55, "..12345|5"], [57, ".123456|677"]],
    [[58, "...12|23456|6"], [60, "....1|23456|6"]],
    [[62, ".12|23456|677"], [64, "...12|345567|7"]],
    [[82, ".12|2(34)567|7"], [84, "....1|23456|6"]],
    [[86, ".12|23456|677"], [88, "...12|345567|7"]],
    [[90, "..12|2(34)567|7"], [92, "...1|23456|6"]],
    [[94, ".12|234567|788"], [96, "...12|345567|7"]],
  ];
  const syllableRanges = new Map();
  let syllableCount = 0;
  for (const [firstBar, pattern] of vocalLayout.flat()) {
    pattern.split("|").forEach((mask, barOffset) => {
      const bar = bars[firstBar - 1 + barOffset];
      mask.match(/\(\d+\)|\d|\./g).forEach((mark, noteIndex) => {
        if (mark === ".") return;
        const digits = mark.match(/\d/g).map(Number);
        const from = syllableCount + digits[0] - 1;
        const to = syllableCount + digits[digits.length - 1];
        syllableRanges.set(bar[noteIndex], { from, to, startsLine: mark === "1" });
      });
    });
    syllableCount += Math.max(...pattern.match(/\d/g).map(Number));
  }

  function applyLyrics(text) {
    if (!text || text.length !== syllableCount || !/^\p{Script=Han}+$/u.test(text)) return false;
    for (const phrase of phrases) {
      const lyrics = [];
      let previous;
      phrase.bars.flat().forEach((note, index) => {
        const range = syllableRanges.get(note);
        if (range) {
          if (range.from !== previous?.from) {
            if (range.startsLine && lyrics.length) lyrics.push({ char: "　", notes: [] });
            lyrics.push({ char: text.slice(range.from, range.to), notes: [] });
          }
          lyrics[lyrics.length - 1].notes.push(index);
        }
        previous = range;
      });
      if (lyrics.length) phrase.lyrics = lyrics;
    }
    return true;
  }

  const lyricCacheKey = "ten-hole-songbook.shijiazhuang.lyrics.9fab9351";
  async function readLyrics() {
    try {
      if (applyLyrics(localStorage.getItem(lyricCacheKey))) return;
    } catch { /* 浏览器可能禁用了本地存储。 */ }
    // 固定逐字谱的版本，防止上游换行或改字后与现有孔位错位。
    const url = "https://fastly.jsdelivr.net/gh/amll-dev/amll-ttml-db@0fefa502a0d53d27770a30eed0fdf5ad5c7a2f12/ncm-lyrics/386844.ttml";
    const response = await fetch(url, { signal: AbortSignal.timeout(8000) });
    if (!response.ok) throw new Error("歌词未载入");
    const xml = new DOMParser().parseFromString(await response.text(), "application/xml");
    const text = Array.from(xml.querySelectorAll("p > span[begin]"), (word) => word.textContent.trim()).join("");
    if (!applyLyrics(text)) throw new Error("唱词与谱面不匹配");
    try { localStorage.setItem(lyricCacheKey, text); } catch { /* 当前页面仍可使用已载入的唱词。 */ }
  }
  let lyricRequest;
  function loadLyrics() {
    if (!lyricRequest) lyricRequest = readLyrics().catch((error) => {
      lyricRequest = null;
      throw error;
    });
    return lyricRequest;
  }
  const song = window.HARMONICA_SONGS.find((item) => item.id === "shijiazhuang");
  Object.assign(song, {
    credit: "万能青年旅店",
    description: "",
    tags: ["A 调口琴", "需要压音"],
    phrases,
    lyricsUnderNotes: true,
    loadLyrics,
    sourceBars,
    builtin: true,
  });
})();
