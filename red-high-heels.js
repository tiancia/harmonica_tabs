"use strict";

(() => {
  // 简谱 1=A4。5、6、7 用 6、-6、-7，高音 1、2、3 用 7、-8、8。
  // 副歌从第三拍进入，跨段的小节按唱句拆开，两段合起来仍是四拍。
  const tie = (hole, beats) => [hole, beats, { tie: true }];
  const quickEntrance = [[0, 1], [8, 0.25], [8, 0.25], [8, 0.25], [8, 0.25], [-8, 0.5]];
  const verseStart = [
    [...quickEntrance, [-7, 1], [7, 0.5]],
    [tie(7, 0.5), [7, 0.5], [-6, 0.5], [7, 0.5], tie(7, 2)],
    [...quickEntrance, [9, 1], [-7, 0.5]],
    [tie(-7, 0.5), [7, 0.5], [-6, 0.5], [7, 0.5], tie(7, 0.5), [7, 1], [-6, 0.5]],
  ];
  function verseEnding(heldHole) {
    return [
      [[0, 1], [8, 0.25], [-8, 0.25], [7, 0.25], [-8, 0.25], [-8, 0.75], [6, 0.25], tie(6, 0.5), [6, 0.5]],
      [[0, 1], [8, 0.25], [-8, 0.25], [7, 0.5], [-8, 0.5], [-7, 1], [heldHole, 0.5]],
      [tie(heldHole, 2), [0, 0.5], [6, 0.5], [8, 0.5], [-8, 0.5]],
      [tie(-8, 0.5), [9, 1.5]],
    ];
  }

  const chorusResponse = [tie(-7, 0.5), [7, 1.5], [9, 0.5], [8, 0.5], [7, 0.5], [-10, 0.5]];
  const chorusStart = [
    [[9, 0.5], [8, 0.5], [7, 0.5], [-6, 0.5]],
    [tie(-6, 1), [9, 0.5], [-8, 1], [-7, 0.5], [6, 0.5], [-7, 0.5]],
    chorusResponse,
    [tie(-10, 1), [9, 0.5], [-10, 1.5], [9, 0.5], [8, 0.5]],
  ];
  const fallingTurn = [tie(8, 0.5), [-8, 0.25], [7, 0.25], [0, 0.5], [7, 0.5], [9, 0.5], [8, 0.5], [7, 0.5], [7, 0.5]];
  const quickTurn = [[9, 0.5], [8, 0.25], [8, 0.25], tie(8, 0.25), [-8, 0.25], [7, 0.5]];
  const titleBar = [tie(-8, 1), [0, 0.5], [6, 0.5], [-7, 0.5], [7, 0.5], [6, 0.5], [-7, 0.5]];
  const chorusEnding = [
    fallingTurn,
    [tie(7, 1), [9, 0.5], [-8, 0.5], [-8, 0.25], [-7, 0.25], [-7, 1], [7, 0.5]],
    [tie(7, 1), [0, 0.75], [7, 0.25], ...quickTurn],
    [[7, 3], [-8, 0.25], [8, 0.25], [-8, 0.5]],
    titleBar,
  ];
  const closingBar = [[-6, 2], [0, 2]];

  // 每行列出一句唱词逐字起音的位置，从本乐句的 0 开始。两次主歌共用同一套起音。
  const verseOpeningWords = [[1, 2, 3, 4, 5, 6, 7, 9, 10, 11], [14, 15, 16, 17, 18, 19, 20, 22, 23, 24, 26, 27]];
  const verseEndingWords = [[1, 2, 3, 4, 5, 6, 8], [10, 11, 12, 13, 14, 15, 18, 19, 20, 22]];
  const chorusFirstLine = [0, 1, 2, 3, 5, 6, 7, 8, 9, 11];
  const chorusOpeningWords = [chorusFirstLine, [12, 13, 14, 15, 17, 18, 19, 20]];
  const chorusEndingWords = [[4, 5, 6, 7, 8, 10, 11, 12, 14, 15], [18, 19, 20, 21, 23, 25, 31, 32, 33, 34, 35]];

  const phrases = [
    {
      section: "主歌一", label: "主歌一 · 起句", bars: verseStart, wordStarts: verseOpeningWords,
      previewLyrics: [{ char: "该", notes: [1] }, { char: "怎", notes: [2] }, { char: "么", notes: [3] }],
    },
    { label: "主歌一 · 收句", bars: verseEnding(-6), wordStarts: verseEndingWords },
    {
      section: "副歌一", label: "副歌一 · 第三拍进入", bars: chorusStart, wordStarts: chorusOpeningWords,
      previewLyrics: [{ char: "你", notes: [0] }, { char: "像", notes: [1] }],
    },
    { label: "副歌一 · 收句", bars: [...chorusEnding, closingBar], wordStarts: chorusEndingWords },
    { section: "主歌二", label: "主歌二 · 起句", bars: verseStart, wordStarts: verseOpeningWords },
    { label: "主歌二 · 收句", bars: verseEnding(7), wordStarts: verseEndingWords },
    { section: "副歌二", label: "副歌二 · 起句", bars: chorusStart, wordStarts: chorusOpeningWords },
    { label: "副歌二 · 接哼唱", bars: [...chorusEnding, [tie(-7, 1)]], wordStarts: chorusEndingWords },
    {
      section: "哼唱", label: "哼唱 · 第 8 孔吹气压音",
      previewLyrics: [
        { char: "咦", notes: [0] }, { char: "耶", notes: [1] }, { char: "耶", notes: [2] },
        { char: "咦", notes: [3] }, { char: "耶", notes: [4, 5] }, { char: "耶", notes: [6, 7] },
        { char: "哦", notes: [8] }, { char: "哦", notes: [9] },
        { char: "啊", notes: [11] }, { char: "啊", notes: [12, 13] },
        { char: "哦", notes: [15] }, { char: "哦", notes: [16, 17] }, { char: "哦", notes: [18, 19] },
        { char: "耶", notes: [21] }, { char: "耶", notes: [22] },
      ],
      bars: [
        [[7, 0.5], [-7, 1], [7, 0.5], [-8, 0.5], [-8, 0.5]],
        [[8, 0.5, { bend: 1 }], [-8, 0.5], [8, 2, { bend: 1 }], [8, 0.5], [-8, 0.5]],
        [[0, 3], [-8, 0.5], [7, 0.5]],
        [tie(7, 2), [0, 1], [-9, 0.5], [8, 0.5]],
        [tie(8, 0.5), [9, 0.5], tie(9, 1), [0, 1], [-9, 0.5], [8, 0.5]],
        [[0, 2]],
      ],
    },
    {
      section: "副歌再现", label: "副歌再现 · 起句变奏",
      wordStarts: [chorusFirstLine, [12, 13, 14, 15, 18, 19, 21, 22]],
      bars: [
        [[9, 0.5], [8, 0.5], [9, 0.5], [7, 0.5]],
        [tie(7, 1), [9, 0.5], [-8, 1], [-7, 0.5], [6, 0.5], [-7, 0.5]],
        chorusResponse,
        [tie(-10, 0.5), [9, 0.5], [9, 0.5], [-10, 0.5], tie(-10, 0.75), [9, 0.25], [9, 0.25], [8, 0.25], [8, 0.5]],
      ],
    },
    {
      label: "副歌再现 · 收句",
      wordStarts: [[4, 5, 6, 7, 8, 10, 11, 12, 13, 15], [17, 18, 19, 20, 22, 24]],
      bars: [
        fallingTurn,
        [tie(7, 1), [9, 0.5], [-8, 1.5], [-7, 0.5], [-7, 0.5]],
        [tie(-7, 0.5), [7, 0.5], tie(7, 0.75), [7, 0.25], ...quickTurn],
        [[7, 2], [0, 1], [7, 0.5], [-8, 0.5]],
        [tie(-8, 1)],
      ],
    },
    {
      section: "尾声", label: "尾声 · 上句",
      wordStarts: [[0, 1, 2, 3, 4, 5, 7, 8, 11, 12, 13, 15], [16, 17, 18, 19, 21, 22, 23, 25]],
      bars: [
        [[7, 0.5], [9, 0.5], [8, 0.5], [8, 0.5], [-8, 0.5], [-6, 0.5]],
        [tie(-6, 1), [9, 0.5], [-8, 0.25], [-7, 0.25], tie(-7, 0.5), [-7, 0.5], [6, 0.5], [-7, 0.5]],
        chorusResponse,
        [tie(-10, 1), [9, 0.5], [-10, 1], [10, 0.5], [8, 0.5], [8, 0.5]],
      ],
    },
    {
      label: "尾声 · 下句",
      wordStarts: [[4, 5, 6, 7, 8, 10, 11, 12, 13, 14, 16], [18, 19, 20, 21, 22, 23, 24, 25, 26]],
      bars: [
        fallingTurn,
        [tie(7, 1), [9, 0.5], [-8, 1], [-7, 0.5], [-7, 0.5], [-7, 0.5]],
        [tie(-7, 0.5), [7, 1.5], [0, 0.75], [7, 0.25], [7, 0.25], [-8, 0.25], [8, 0.5]],
        [[8, 0.5], [-8, 0.25], [-8, 0.25], [-6, 0.5], [-6, 0.25], [7, 0.25], tie(7, 1.5), [7, 0.25], [-8, 0.25]],
      ],
    },
    {
      label: "尾声 · 最后两小节", bars: [titleBar, closingBar],
      wordStarts: [[2, 3, 4, 5, 6]],
      previewLyrics: [
        { char: "红", notes: [2] }, { char: "色", notes: [3] }, { char: "高", notes: [4] },
        { char: "跟", notes: [5] }, { char: "鞋", notes: [6, 7] },
      ],
    },
  ];

  const wordCount = phrases.flatMap(phrase => phrase.wordStarts || []).flat().length;
  function applyLyrics(text) {
    if (!text || text.length !== wordCount || !/^\p{Script=Han}+$/u.test(text)) return false;
    let cursor = 0;
    let singing;
    for (const phrase of phrases) {
      if (!phrase.wordStarts) {
        phrase.lyrics = phrase.previewLyrics;
        singing = null;
        continue;
      }
      const starts = new Set(phrase.wordStarts.flat());
      const lineBreaks = new Set(phrase.wordStarts.slice(1).map(line => line[0]));
      const lyrics = [];
      let entry;
      phrase.bars.flat().forEach(([hole], index) => {
        if (!hole) {
          singing = null;
          return;
        }
        if (starts.has(index)) {
          if (lineBreaks.has(index)) lyrics.push({ char: "　", notes: [] });
          singing = text[cursor++];
          entry = null;
        }
        // 跨行的连音仍唱上一字。副歌再现末尾休止后的三个过门音留空。
        if (!singing) return;
        if (!entry) {
          entry = { char: singing, notes: [] };
          lyrics.push(entry);
        }
        entry.notes.push(index);
      });
      phrase.lyrics = lyrics;
    }
    return true;
  }

  const song = {
    id: "red-high-heels",
    title: "红色高跟鞋",
    credit: "蔡健雅 词曲、演唱",
    description: "开头先空一拍，第二拍在第 8 孔连续轻吹四下。点歌词可以从那个字起吹，孔位下的「—」表示同一个字继续唱。哼唱段的降音用第 8 孔吹气压低半音。",
    tags: ["A 调口琴", "哼唱段需压音", "4/4 拍"],
    lyricsUnderNotes: true,
    loadLyrics: makeTimedLyricsLoader(
      "ten-hole-songbook.red-high-heels.lyrics.533e9c52",
      "https://fastly.jsdelivr.net/gh/amll-dev/amll-ttml-db@533e9c52796db48f8bbde4394aee2b7d9db5d068/ncm-lyrics/208902.ttml",
      applyLyrics,
    ),
    phrases,
  };
  const songs = window.HARMONICA_SONGS;
  const nextIndex = songs.findIndex((item) => item.id === "if-love-had-providence");
  songs.splice(nextIndex < 0 ? songs.length : nextIndex, 0, song);
})();
