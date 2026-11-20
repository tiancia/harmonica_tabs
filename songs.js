"use strict";

// 标准 Richter 排列；A 调对应吹音 A3 C#4 E4 A4 C#5 E5 A5 C#6 E6 A6，
// 吸音 B3 E4 G#4 B4 D5 F#5 G#5 B5 D6 F#6。
// 此处数字始终表示孔位，不是简谱音级。节拍以四分音符 = 1 拍。
// 送别音级与孔位：低音7=-3，1=4，2=-4，3=5，4=-5，5=6，6=-6，7=-7，高音1=7。
window.HARMONICA_SONGS = [
  {
    id: "farewell",
    title: "送别",
    credit: "J. P. Ordway 曲 · 入门主旋律",
    description: "熟悉的旋律，慢慢吹。先试着吹好第一句。",
    tags: ["A 调口琴", "无需压音"],
    phrases: [
      {
        // 简谱原谱：5 3̇5 i— | 6 i 5— | 5 1̇2̇3 2̇1 | 2———
        // 入门简化：第三小节高音 1̇2̇ 降为中音 1 2，避免 4↔7 大跳。
        // 简化后：5 35 i— | 6 i 5— | 5 123 21 | 2———
        // 长(5) 亭(35) 外(i—) | 古(6) 道(i) 边(5—) | 芳(5) 草(12) 碧(3) 连(2) 天(1) | (2拖音)
        label: "长亭外，古道边，芳草碧连天。",
        lyrics: [
          { char: "长", notes: [0] },
          { char: "亭", notes: [1, 2] },
          { char: "外", notes: [3] },
          { char: "，", notes: [] },
          { char: "古", notes: [4] },
          { char: "道", notes: [5] },
          { char: "边", notes: [6] },
          { char: "，", notes: [] },
          { char: "芳", notes: [7] },
          { char: "草", notes: [8, 9] },
          { char: "碧", notes: [10] },
          { char: "连", notes: [11] },
          { char: "天", notes: [12] },
          { char: "。", notes: [] },
        ],
        bars: [
          [[6, 1], [5, 0.5], [6, 0.5], [7, 2]],
          [[-6, 1], [7, 1], [6, 2]],
          [[6, 1], [4, 0.5], [-4, 0.5], [5, 1], [-4, 0.5], [4, 0.5]],
          [[-4, 4]],
        ],
      },
      {
        // 简谱：5 3̇5 i̇7 | 6 i 5— | 5 2̇3 4̇7 | 1———
        // 晚(5) 风(3̇5) 拂(i̇) 柳(7) | 笛(6) 声(i) 残(5—) | 夕(5) 阳(2̇3) 山(4̇) 外(7) | 山(1—)
        label: "晚风拂柳笛声残，夕阳山外山。",
        lyrics: [
          { char: "晚", notes: [0] },
          { char: "风", notes: [1, 2] },
          { char: "拂", notes: [3] },
          { char: "柳", notes: [4] },
          { char: "笛", notes: [5] },
          { char: "声", notes: [6] },
          { char: "残", notes: [7] },
          { char: "，", notes: [] },
          { char: "夕", notes: [8] },
          { char: "阳", notes: [9, 10] },
          { char: "山", notes: [11] },
          { char: "外", notes: [12] },
          { char: "山", notes: [13] },
          { char: "。", notes: [] },
        ],
        bars: [
          [[6, 1], [5, 0.5], [6, 0.5], [7, 1.5], [-7, 0.5]],
          [[-6, 1], [7, 1], [6, 2]],
          [[6, 1], [-4, 0.5], [5, 0.5], [-5, 1.5], [-3, 0.5]],
          [[4, 4]],
        ],
      },
      {
        // 简谱：6 i i— | 7 6̇7 i— | 6̇7 i 6̇ 6̇ 5̇ 3̇ 1 | 2———
        // 天(6) 之(i) 涯(i—) | 地(7) 之(6̇7) 角(i—) | 知(6̇7) 交(i) 半(6̇) 零(6̇5̇3̇) 落(1) | (2拖音)
        label: "天之涯，地之角，知交半零落。",
        lyrics: [
          { char: "天", notes: [0] },
          { char: "之", notes: [1] },
          { char: "涯", notes: [2] },
          { char: "，", notes: [] },
          { char: "地", notes: [3] },
          { char: "之", notes: [4, 5] },
          { char: "角", notes: [6] },
          { char: "，", notes: [] },
          { char: "知", notes: [7, 8] },
          { char: "交", notes: [9] },
          { char: "半", notes: [10] },
          { char: "零", notes: [11, 12, 13] },
          { char: "落", notes: [14] },
          { char: "。", notes: [] },
        ],
        bars: [
          [[-6, 1], [7, 1], [7, 2]],
          [[-7, 1], [-6, 0.5], [-7, 0.5], [7, 2]],
          [[-6, 0.5], [-7, 0.5], [7, 0.5], [-6, 0.5], [-6, 0.5], [6, 0.5], [5, 0.5], [4, 0.5]],
          [[-4, 4]],
        ],
      },
      {
        // 简谱：5 3̇5 i̇7 | 6 i 5— | 5 2̇3 4̇7 | 1———
        // 一(5) 壶(3̇5) 浊(i̇) 酒(7) | 尽(6) 余(i) 欢(5—) | 今(5) 宵(2̇3) 别(4̇) 梦(7) | 寒(1—)
        label: "一壶浊酒尽余欢，今宵别梦寒。",
        lyrics: [
          { char: "一", notes: [0] },
          { char: "壶", notes: [1, 2] },
          { char: "浊", notes: [3] },
          { char: "酒", notes: [4] },
          { char: "尽", notes: [5] },
          { char: "余", notes: [6] },
          { char: "欢", notes: [7] },
          { char: "，", notes: [] },
          { char: "今", notes: [8] },
          { char: "宵", notes: [9, 10] },
          { char: "别", notes: [11] },
          { char: "梦", notes: [12] },
          { char: "寒", notes: [13] },
          { char: "。", notes: [] },
        ],
        bars: [
          [[6, 1], [5, 0.5], [6, 0.5], [7, 1.5], [-7, 0.5]],
          [[-6, 1], [7, 1], [6, 2]],
          [[6, 1], [-4, 0.5], [5, 0.5], [-5, 1.5], [-3, 0.5]],
          [[4, 4]],
        ],
      },
    ],
  },
  {
    id: "auld-lang-syne",
    title: "友谊地久天长",
    credit: "苏格兰民歌 · 彭斯词 · 邓映易译配",
    description: "教材原谱为 F 大调，这份 A 调口琴谱移至 D 大调。开头的「怎」在第二拍后半拍吹第 4 孔，「能」落在下一小节第一拍，换第 5 孔吸气。",
    tags: ["A 调口琴", "无需压音", "2/4 拍"],
    // 实音 1=D5：低 5=4，低 6=-4，1=-5，2=6，3=-6，5=7，6=-8，高 1=-9。
    // 各句从半拍弱起开始，到下一次弱起之前结束。分行处的小节连续计拍。
    phrases: [
      {
        section: "主歌",
        label: "主歌 · 第一句",
        lyrics: [
          { char: "怎", notes: [0] }, { char: "能", notes: [1] },
          { char: "忘", notes: [2] }, { char: "记", notes: [3] },
          { char: "旧", notes: [4] }, { char: "日", notes: [5] },
          { char: "朋", notes: [6] }, { char: "友", notes: [7] }, { char: "，", notes: [] },
          { char: "心", notes: [8] }, { char: "中", notes: [9] },
          { char: "能", notes: [10] }, { char: "不", notes: [11] },
          { char: "怀", notes: [12] }, { char: "想", notes: [13] }, { char: "？", notes: [] },
        ],
        bars: [
          [[4, 0.5]],
          [[-5, 0.75], [-5, 0.25], [-5, 0.5], [-6, 0.5]],
          [[6, 0.75], [-5, 0.25], [6, 0.5], [-6, 0.5]],
          [[-5, 0.75], [-5, 0.25], [-6, 0.5], [7, 0.5]],
          [[-8, 1.5]],
        ],
      },
      {
        label: "主歌 · 第二句",
        lyrics: [
          { char: "旧", notes: [0, 1] }, { char: "日", notes: [2] },
          { char: "朋", notes: [3] }, { char: "友", notes: [4] },
          { char: "岂", notes: [5] }, { char: "能", notes: [6] },
          { char: "相", notes: [7] }, { char: "忘", notes: [8] }, { char: "，", notes: [] },
          { char: "友", notes: [9] }, { char: "谊", notes: [10] },
          { char: "地", notes: [11] }, { char: "久", notes: [12] },
          { char: "天", notes: [13] }, { char: "长", notes: [14] }, { char: "。", notes: [] },
        ],
        bars: [
          [[-8, 0.25], [-8, 0.25, { tie: true }]],
          [[7, 0.75], [-6, 0.25], [-6, 0.5], [-5, 0.5]],
          [[6, 0.75], [-5, 0.25], [6, 0.5], [-6, 0.5]],
          [[-5, 0.75], [-4, 0.25], [-4, 0.5], [4, 0.5]],
          [[-5, 1.5]],
        ],
      },
      {
        section: "副歌",
        label: "副歌 · 第一句",
        lyrics: [
          { char: "友", notes: [0] }, { char: "谊", notes: [1, 2] },
          { char: "永", notes: [3, 4] }, { char: "存", notes: [5] }, { char: "，", notes: [] },
          { char: "朋", notes: [6] }, { char: "友", notes: [7] }, { char: "，", notes: [] },
          { char: "友", notes: [8] }, { char: "谊", notes: [9, 10] },
          { char: "永", notes: [11, 12] }, { char: "存", notes: [13] }, { char: "！", notes: [] },
        ],
        bars: [
          [[-8, 0.5]],
          [[7, 0.75], [-6, 0.25], [-6, 0.5], [-5, 0.5]],
          [[6, 0.75], [-5, 0.25], [6, 0.5], [-8, 0.5]],
          [[7, 0.75], [-6, 0.25], [-6, 0.5], [7, 0.5]],
          [[-8, 1.5]],
        ],
      },
      {
        label: "副歌 · 第二句",
        lyrics: [
          { char: "举", notes: [0] }, { char: "杯", notes: [1] },
          { char: "痛", notes: [2] }, { char: "饮", notes: [3] }, { char: "，", notes: [] },
          { char: "同", notes: [4] }, { char: "声", notes: [5] },
          { char: "歌", notes: [6] }, { char: "唱", notes: [7] },
          { char: "友", notes: [8] }, { char: "谊", notes: [9] },
          { char: "地", notes: [10] }, { char: "久", notes: [11] },
          { char: "天", notes: [12] }, { char: "长", notes: [13] }, { char: "。", notes: [] },
        ],
        bars: [
          [[-9, 0.5]],
          [[7, 0.75], [-6, 0.25], [-6, 0.5], [-5, 0.5]],
          [[6, 0.75], [-5, 0.25], [6, 0.5], [-6, 0.5]],
          [[-5, 0.75], [-4, 0.25], [-4, 0.5], [4, 0.5]],
          [[-5, 1.5]],
        ],
      },
    ],
  },
  {
    id: "if-love-had-providence",
    title: "假如爱有天意",
    credit: "李健 填词、演唱 · Yoo Young Seok 曲",
    description: "从人声起句开始，第 5 孔先吹两拍，重新起音再吹一拍。整首用同一调练习，遇到「续」就保持气息。",
    tags: ["A 调口琴", "需要压音", "3/4 拍"],
    phrases: makeIfLoveHadProvidencePhrases(),
  },
  {
    id: "shijiazhuang",
    title: "杀死那个石家庄人",
    credit: "万能青年旅店",
    description: "",
    tags: ["A 调口琴", "需要压音"],
    phrases: [],
  },
];

function makeIfLoveHadProvidencePhrases() {
  // 1=A4，低 5=3，低 6=-3 压 2，低 7=-3。副歌的升 5 用 -6 压 1。
  // 每行一个三拍小节。重复段共用相同的孔位，另写各次演唱有变化的小节。
  function verseOpening(thirdBar = [[4, 2], [-4, 1]]) {
    return [
      [[5, 2], [5, 1]],
      [[-4, 1.5], [4, 0.5], [-3, 1]],
      thirdBar,
      [[5, 2], [5, 0.5], [6, 0.5]],
      [[-6, 2], [-6, 1]],
      [[-7, 1.5], [-6, 0.5], [6, 0.5], [-4, 0.5]],
      [[5, 3]],
    ];
  }

  const lowCadence = [
    [[4, 2], [5, 1]],
    [[-4, 1.5], [-3, 0.5], [3, 1]],
    [[-3, 3, { bend: 2 }]],
  ];
  const verseEnding = [
    [[0, 2], [5, 0.5], [6, 0.5]],
    [[-6, 2], [-6, 1]],
    [[6, 2], [5, 0.5], [-4, 0.5]],
    [[5, 1.5], [-5, 0.5], [5, 0.5], [-4, 0.5]],
    [[4, 2], [-3, 0.5, { bend: 2 }], [-3, 0.5]],
    [[4, 2], [-4, 0.5], [5, 0.5]],
    ...lowCadence.slice(1),
  ];
  const chorusRise = [
    [[0, 1], [5, 1], [6, 1]],
    [[-6, 3]],
    [[-7, 3]],
  ];
  const chorusOpening = [
    ...chorusRise,
    [[-7, 2], [-8, 1]],
    [[7, 2], [-6, 0.5], [-6, 0.5]],
  ];
  const chorusAnswer = [
    [[-6, 2], [-6, 1]],
    [[6, 1.5], [-6, 0.5], [6, 0.5], [-4, 0.5]],
    [[-5, 1], [5, 2]],
  ];
  const chorusFirstLine = [...chorusOpening, ...chorusAnswer];

  return [
    {
      section: "主歌一", label: "主歌一 · 起句", bars: verseOpening(),
      lyrics: Array.from("当天边那颗星出现", (char, index) => ({ char, notes: [index] })),
    },
    { label: "主歌一 · 收句", bars: [...verseEnding, [[0, 3]]] },
    { section: "主歌二", label: "主歌二 · 起句", bars: verseOpening() },
    { label: "主歌二 · 收句", bars: verseEnding },
    { section: "副歌一", label: "副歌一 · 上句", bars: chorusFirstLine },
    {
      label: "副歌一 · 下句",
      bars: [
        ...chorusRise,
        [[-6, 2, { bend: 1 }], [-7, 1]],
        [[7, 3]],
        ...lowCadence,
        [[0, 3]],
      ],
    },
    {
      section: "主歌三", label: "主歌三 · 起句",
      bars: verseOpening([[4, 1.5], [4, 0.5], [-4, 1]]),
    },
    { label: "主歌三 · 收句", bars: verseEnding },
    { section: "副歌二", label: "副歌二 · 上句", bars: chorusFirstLine },
    {
      label: "副歌二 · 下句",
      bars: [...chorusRise, [[-7, 2], [-8, 1]], [[7, 3]]],
    },
    {
      label: "副歌二 · 收句降八度",
      bars: [
        ...lowCadence,
        [[-3, 3, { bend: 2, tie: true }]],
        [[-3, 3, { bend: 1 }]],
        [[-3, 3, { bend: 1, tie: true }]],
      ],
    },
    {
      section: "副歌再现", label: "副歌再现 · 第三拍进入",
      bars: [[[0, 2], [-6, 0.5], [-6, 0.5]], ...chorusAnswer],
    },
    {
      label: "副歌再现 · 高音变奏",
      bars: [
        ...chorusOpening,
        [[-6, 2], [-6, 1]],
        [[-7, 1.5], [7, 0.5], [-7, 0.5], [6, 0.5]],
        [[-7, 1], [-6, 2]],
      ],
    },
    {
      label: "副歌再现 · 长音",
      bars: [
        [[-6, 1, { tie: true }], [5, 1], [6, 1]],
        [[-6, 3]],
        [[-7, 3]],
        [[-6, 2], [-7, 1]],
        [[7, 3]],
        [[7, 3, { tie: true }]],
        [[7, 3, { tie: true }]],
        [[7, 3, { tie: true }]],
        [[0, 3]],
      ],
    },
    {
      label: "副歌再现 · 收句",
      bars: [...lowCadence, [[-3, 2, { bend: 2, tie: true }], [0, 1]], [[0, 3]], [[0, 3]]],
    },
    { section: "尾声", label: "尾声 · 回到主歌", bars: verseOpening() },
    { label: "尾声 · 收句", bars: verseEnding },
    {
      label: "尾声 · 最后一句",
      lyrics: [{ char: "月", notes: [1] }, { char: "光", notes: [2] }],
      bars: [
        [[0, 2], [-3, 0.5, { bend: 2 }], [-3, 0.5]],
        [[4, 2], [5, 1]],
        [[-4, 3]],
        [[-4, 3, { tie: true }]],
        [[-4, 2, { tie: true }], [4, 1]],
        [[4, 3, { tie: true }]],
        [[-3, 3, { bend: 2 }]],
        [[-3, 3, { bend: 2, tie: true }]],
      ],
    },
  ];
}
