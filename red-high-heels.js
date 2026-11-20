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

  const phrases = [
    {
      section: "主歌一", label: "主歌一 · 起句", bars: verseStart,
      lyrics: [{ char: "该", notes: [1] }, { char: "怎", notes: [2] }, { char: "么", notes: [3] }],
    },
    { label: "主歌一 · 收句", bars: verseEnding(-6) },
    {
      section: "副歌一", label: "副歌一 · 第三拍进入", bars: chorusStart,
      lyrics: [{ char: "你", notes: [0] }, { char: "像", notes: [1] }],
    },
    { label: "副歌一 · 收句", bars: [...chorusEnding, closingBar] },
    { section: "主歌二", label: "主歌二 · 起句", bars: verseStart },
    { label: "主歌二 · 收句", bars: verseEnding(7) },
    { section: "副歌二", label: "副歌二 · 起句", bars: chorusStart },
    { label: "副歌二 · 接哼唱", bars: [...chorusEnding, [tie(-7, 1)]] },
    {
      section: "哼唱", label: "哼唱 · 第 8 孔吹气压音",
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
      bars: [
        [[9, 0.5], [8, 0.5], [9, 0.5], [7, 0.5]],
        [tie(7, 1), [9, 0.5], [-8, 1], [-7, 0.5], [6, 0.5], [-7, 0.5]],
        chorusResponse,
        [tie(-10, 0.5), [9, 0.5], [9, 0.5], [-10, 0.5], tie(-10, 0.75), [9, 0.25], [9, 0.25], [8, 0.25], [8, 0.5]],
      ],
    },
    {
      label: "副歌再现 · 收句",
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
      bars: [
        [[7, 0.5], [9, 0.5], [8, 0.5], [8, 0.5], [-8, 0.5], [-6, 0.5]],
        [tie(-6, 1), [9, 0.5], [-8, 0.25], [-7, 0.25], tie(-7, 0.5), [-7, 0.5], [6, 0.5], [-7, 0.5]],
        chorusResponse,
        [tie(-10, 1), [9, 0.5], [-10, 1], [10, 0.5], [8, 0.5], [8, 0.5]],
      ],
    },
    {
      label: "尾声 · 下句",
      bars: [
        fallingTurn,
        [tie(7, 1), [9, 0.5], [-8, 1], [-7, 0.5], [-7, 0.5], [-7, 0.5]],
        [tie(-7, 0.5), [7, 1.5], [0, 0.75], [7, 0.25], [7, 0.25], [-8, 0.25], [8, 0.5]],
        [[8, 0.5], [-8, 0.25], [-8, 0.25], [-6, 0.5], [-6, 0.25], [7, 0.25], tie(7, 1.5), [7, 0.25], [-8, 0.25]],
      ],
    },
    {
      label: "尾声 · 最后两小节", bars: [titleBar, closingBar],
      lyrics: [
        { char: "红", notes: [2] }, { char: "色", notes: [3] }, { char: "高", notes: [4] },
        { char: "跟", notes: [5] }, { char: "鞋", notes: [6, 7] },
      ],
    },
  ];

  const song = {
    id: "red-high-heels",
    title: "红色高跟鞋",
    credit: "蔡健雅 词曲、演唱",
    description: "开头先空一拍，第二拍在第 8 孔连续轻吹四下。主歌、副歌和尾声都用普通吹吸，哼唱段的降音用第 8 孔吹气压低半音。",
    tags: ["A 调口琴", "哼唱段需压音", "4/4 拍"],
    lyricsUnderNotes: true,
    phrases,
  };
  const songs = window.HARMONICA_SONGS;
  const nextIndex = songs.findIndex((item) => item.id === "if-love-had-providence");
  songs.splice(nextIndex < 0 ? songs.length : nextIndex, 0, song);
})();
