export interface ExampleSentence {
  japanese: string;
  furigana: string;
  english: string;
}

export interface VocabWord {
  word: string;
  reading: string;
  meaning: string;
}

export interface KanjiCardData {
  id: string;
  kanji: string;
  hiragana: string; // Primary furigana/reading
  meaning: string;
  onyomi: string[];
  kunyomi: string[];
  strokes: number;
  radical: string;
  vocabWords: VocabWord[];
  exampleSentence: ExampleSentence;
  mnemonics?: string;
}

export const JLPT_N4_KANJI_DATA: KanjiCardData[] = [
  {
    id: "n4-01-sei",
    kanji: "生",
    hiragana: "う・まれる / い・きる / せい",
    meaning: "Life, Birth, Raw, To Live",
    onyomi: ["セイ", "ショウ"],
    kunyomi: ["い・きる", "う・まれる", "なま"],
    strokes: 5,
    radical: "生 (life)",
    vocabWords: [
      { word: "学生", reading: "がくせい", meaning: "student" },
      { word: "生活", reading: "せいかつ", meaning: "life, living" },
      { word: "生まれる", reading: "うまれる", meaning: "to be born" }
    ],
    exampleSentence: {
      japanese: "私は日本で生まれました。",
      furigana: "わたしは にほんで うまれました。",
      english: "I was born in Japan."
    },
    mnemonics: "A plant sprouting from the earth, full of life."
  },
  {
    id: "n4-02-tai",
    kanji: "待",
    hiragana: "ま・つ",
    meaning: "Wait, Depend On",
    onyomi: ["タイ"],
    kunyomi: ["ま・つ", "ま・ち"],
    strokes: 9,
    radical: "彳 (step / movement)",
    vocabWords: [
      { word: "待つ", reading: "まつ", meaning: "to wait" },
      { word: "招待", reading: "しょうたい", meaning: "invitation" },
      { word: "期待", reading: "きたい", meaning: "expectation" }
    ],
    exampleSentence: {
      japanese: "駅の前で友だちを待ちます。",
      furigana: "えきの まえで ともだちを まちます。",
      english: "I will wait for my friend in front of the station."
    },
    mnemonics: "Stepping into a temple to wait out the rain."
  },
  {
    id: "n4-03-kyou",
    kanji: "強",
    hiragana: "つよ・い",
    meaning: "Strong, Powerful",
    onyomi: ["キョウ", "ゴウ"],
    kunyomi: ["つよ・い", "つよ・まる", "し・いる"],
    strokes: 11,
    radical: "弓 (bow)",
    vocabWords: [
      { word: "強い", reading: "つよい", meaning: "strong, powerful" },
      { word: "勉強", reading: "べんきょう", meaning: "study" },
      { word: "強調", reading: "きょうちょう", meaning: "emphasis" }
    ],
    exampleSentence: {
      japanese: "昨日は風がとても強かったです。",
      furigana: "きのうは かぜが とても つよかったです。",
      english: "The wind was very strong yesterday."
    },
    mnemonics: "Drawing a bow with insects requires immense strength."
  },
  {
    id: "n4-04-saku",
    kanji: "作",
    hiragana: "つく・る",
    meaning: "Make, Produce, Create",
    onyomi: ["サク", "サ"],
    kunyomi: ["つく・る", "つく・り"],
    strokes: 7,
    radical: "亻 (person)",
    vocabWords: [
      { word: "作る", reading: "つくる", meaning: "to make, produce" },
      { word: "作文", reading: "さくぶん", meaning: "essay, composition" },
      { word: "作品", reading: "さくひん", meaning: "artwork, piece" }
    ],
    exampleSentence: {
      japanese: "母と一緒に晩ご飯を作りました。",
      furigana: "ははと いっしょに ばんごはんを つくりました。",
      english: "I made dinner together with my mother."
    },
    mnemonics: "A person using a tool to make something new."
  },
  {
    id: "n4-05-sou",
    kanji: "走",
    hiragana: "はし・る",
    meaning: "Run, Dash",
    onyomi: ["ソウ"],
    kunyomi: ["はし・る"],
    strokes: 7,
    radical: "走 (run)",
    vocabWords: [
      { word: "走る", reading: "はしる", meaning: "to run" },
      { word: "ご馳走", reading: "ごちそう", meaning: "feast, treat" },
      { word: "競走", reading: "きょうそう", meaning: "footrace, sprint" }
    ],
    exampleSentence: {
      japanese: "毎朝公園を走るのが好きです。",
      furigana: "まいあさ こうえんを はしるのが すきです。",
      english: "I like running in the park every morning."
    },
    mnemonics: "A person with waving arms and feet kicking up dirt as they run."
  },
  {
    id: "n4-06-dou",
    kanji: "働",
    hiragana: "はたら・く",
    meaning: "Work, Labor",
    onyomi: ["ドウ"],
    kunyomi: ["はたら・く"],
    strokes: 13,
    radical: "亻 (person)",
    vocabWords: [
      { word: "働く", reading: "はたらく", meaning: "to work" },
      { word: "働き者", reading: "はたらきもの", meaning: "hard worker" },
      { word: "労働", reading: "ろうどう", meaning: "manual labor" }
    ],
    exampleSentence: {
      japanese: "父は大きな病院で働いています。",
      furigana: "ちちは おおきな びょういんで はたらいています。",
      english: "My father works at a large hospital."
    },
    mnemonics: "A person moving with physical power to work."
  },
  {
    id: "n4-07-ji",
    kanji: "持",
    hiragana: "も・つ",
    meaning: "Hold, Have, Possess",
    onyomi: ["ジ"],
    kunyomi: ["も・つ", "も・てる"],
    strokes: 9,
    radical: "扌 (hand)",
    vocabWords: [
      { word: "持つ", reading: "もつ", meaning: "to hold, carry" },
      { word: "気持ち", reading: "きもち", meaning: "feeling, mood" },
      { word: "金持ち", reading: "かねもち", meaning: "wealthy person" }
    ],
    exampleSentence: {
      japanese: "雨が降るから傘を持って出かけましょう。",
      furigana: "あめが ふるから かさを もって でかけましょう。",
      english: "It's raining, so let's bring an umbrella when we go out."
    },
    mnemonics: "Your hand holding an offering at a Buddhist temple."
  },
  {
    id: "n4-08-bai",
    kanji: "買",
    hiragana: "か・う",
    meaning: "Buy, Purchase",
    onyomi: ["バイ"],
    kunyomi: ["か・う"],
    strokes: 12,
    radical: "貝 (shell / money)",
    vocabWords: [
      { word: "買う", reading: "かう", meaning: "to buy" },
      { word: "買い物", reading: "かいもの", meaning: "shopping" },
      { word: "売買", reading: "ばいばい", meaning: "buying and selling, trade" }
    ],
    exampleSentence: {
      japanese: "新しいノートとペンを買いました。",
      furigana: "あたらしい ノートと ペンを かいました。",
      english: "I bought a new notebook and pen."
    },
    mnemonics: "A net gathering shells used as currency to buy goods."
  },
  {
    id: "n4-09-setsu",
    kanji: "説",
    hiragana: "と・く / せつ",
    meaning: "Explain, Opinion, Theory",
    onyomi: ["セツ", "ゼイ"],
    kunyomi: ["と・く"],
    strokes: 14,
    radical: "言 (words / speech)",
    vocabWords: [
      { word: "説明", reading: "せつめい", meaning: "explanation" },
      { word: "小説", reading: "しょうせつ", meaning: "novel, story" },
      { word: "演説", reading: "えんぜつ", meaning: "speech, address" }
    ],
    exampleSentence: {
      japanese: "先生が文法を分かりやすく説明しました。",
      furigana: "せんせいが ぶんぽうを わかりやすく せつめいしました。",
      english: "The teacher explained the grammar clearly."
    },
    mnemonics: "Words spoken to bring light and understanding."
  },
  {
    id: "n4-10-tou",
    kanji: "答",
    hiragana: "こた・える / こたえ",
    meaning: "Answer, Solution, Reply",
    onyomi: ["トウ"],
    kunyomi: ["こた・える", "こた・え"],
    strokes: 12,
    radical: "竹 (bamboo)",
    vocabWords: [
      { word: "答える", reading: "こたえる", meaning: "to answer" },
      { word: "答え", reading: "こたえ", meaning: "answer, reply" },
      { word: "解答", reading: "かいとう", meaning: "solution, answer" }
    ],
    exampleSentence: {
      japanese: "質問に正しく答えてください。",
      furigana: "しつもんに ただしく こたえてください。",
      english: "Please answer the question correctly."
    },
    mnemonics: "Fitting bamboo tallies together to give the correct reply."
  },
  {
    id: "n4-11-ryo",
    kanji: "旅",
    hiragana: "たび / りょ",
    meaning: "Trip, Travel, Journey",
    onyomi: ["リョ"],
    kunyomi: ["たび"],
    strokes: 10,
    radical: "方 (direction)",
    vocabWords: [
      { word: "旅行", reading: "りょこう", meaning: "trip, travel" },
      { word: "旅館", reading: "りょかん", meaning: "Japanese-style inn" },
      { word: "旅", reading: "たび", meaning: "journey" }
    ],
    exampleSentence: {
      japanese: "来月友だちと北海道へ旅行に行きます。",
      furigana: "らいげつ ともだちと ほっかいどうへ りょこうに いきます。",
      english: "Next month I am going on a trip to Hokkaido with a friend."
    },
    mnemonics: "A banner waving as travelers march across the countryside."
  },
  {
    id: "n4-12-shi",
    kanji: "試",
    hiragana: "こころ・みる / ため・す / し",
    meaning: "Test, Try, Attempt",
    onyomi: ["シ"],
    kunyomi: ["こころ・みる", "ため・す"],
    strokes: 13,
    radical: "言 (words / speech)",
    vocabWords: [
      { word: "試験", reading: "しけん", meaning: "examination, test" },
      { word: "試合", reading: "しあい", meaning: "match, game" },
      { word: "試す", reading: "ためす", meaning: "to try, test out" }
    ],
    exampleSentence: {
      japanese: "明日日本語の試験があります。",
      furigana: "あした にほんごの しけんが あります。",
      english: "I have a Japanese test tomorrow."
    },
    mnemonics: "Speaking out words to test a ceremony formula."
  },
  {
    id: "n4-13-ken",
    kanji: "験",
    hiragana: "ため・す / けん",
    meaning: "Examine, Test, Experience",
    onyomi: ["ケン", "ゲン"],
    kunyomi: ["ため・す"],
    strokes: 18,
    radical: "馬 (horse)",
    vocabWords: [
      { word: "経験", reading: "けいけん", meaning: "experience" },
      { word: "実験", reading: "じっけん", meaning: "experiment" },
      { word: "受験", reading: "じゅけん", meaning: "taking an entrance exam" }
    ],
    exampleSentence: {
      japanese: "日本での留学はとても良い経験になりました。",
      furigana: "にほんでの りゅうがくは とても よい けいけんに なりました。",
      english: "Studying abroad in Japan was a very good experience."
    },
    mnemonics: "Testing horses thoroughly to prove their endurance."
  },
  {
    id: "n4-14-tai-lend",
    kanji: "貸",
    hiragana: "か・す",
    meaning: "Lend, Loan",
    onyomi: ["タイ"],
    kunyomi: ["か・す"],
    strokes: 12,
    radical: "貝 (shell / money)",
    vocabWords: [
      { word: "貸す", reading: "かす", meaning: "to lend, loan" },
      { word: "貸出", reading: "かしだし", meaning: "lending out, checkout" },
      { word: "賃貸", reading: "ちんたい", meaning: "lease, rental" }
    ],
    exampleSentence: {
      japanese: "友だちに辞書を貸してあげました。",
      furigana: "ともだちに じしょを かしてあげました。",
      english: "I lent my dictionary to my friend."
    },
    mnemonics: "Substituting money (shells) to help a companion."
  },
  {
    id: "n4-15-shaku",
    kanji: "借",
    hiragana: "か・りる",
    meaning: "Borrow, Rent",
    onyomi: ["シャク"],
    kunyomi: ["か・りる"],
    strokes: 10,
    radical: "亻 (person)",
    vocabWords: [
      { word: "借りる", reading: "かりる", meaning: "to borrow, rent" },
      { word: "借金", reading: "しゃっきん", meaning: "debt, borrowed money" },
      { word: "借用", reading: "しゃくよう", meaning: "borrowing, loan" }
    ],
    exampleSentence: {
      japanese: "図書館で本を三冊借りました。",
      furigana: "としょかんで ほんを さんさつ かりました。",
      english: "I borrowed three books from the library."
    },
    mnemonics: "A person temporarily receiving past goods from someone else."
  }
];
