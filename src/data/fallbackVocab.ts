import type { VocabCardItem } from './vocabTypes.ts';

export const FALLBACK_VOCAB_DATA: VocabCardItem[] = [
  // ================= TIER 1: Core N4 Transitive / Intransitive Pairs & Giving/Receiving =================
  {
    id: 'n4-ageru',
    expression: 'あげる',
    reading: 'あげる',
    meaning: 'to give (to someone else), to raise',
    level: 'N4',
    tags: ['verb', 'giving-receiving', 'JLPT_N4'],
    priority: 1,
    category: 'Giving & Receiving (授受動詞)',
    pairNote: 'Used when I give to you/others (私 → 他人)',
    exampleSentence: {
      japanese: '友だちにプレゼントをあげました。',
      furigana: 'ともだちに プレゼントを あげました。',
      english: 'I gave a present to my friend.'
    }
  },
  {
    id: 'n4-kureru',
    expression: 'くれる',
    reading: 'くれる',
    meaning: 'to give (me / my in-group)',
    level: 'N4',
    tags: ['verb', 'giving-receiving', 'JLPT_N4'],
    priority: 2,
    category: 'Giving & Receiving (授受動詞)',
    pairNote: 'Used when someone gives to me/my family (他人 → 私)',
    exampleSentence: {
      japanese: '先生が本をくれました。',
      furigana: 'せんせいが ほんを くれました。',
      english: 'The teacher gave me a book.'
    }
  },
  {
    id: 'n4-morau',
    expression: 'もらう',
    reading: 'もらう',
    meaning: 'to receive, to get',
    level: 'N4',
    tags: ['verb', 'giving-receiving', 'JLPT_N4'],
    priority: 3,
    category: 'Giving & Receiving (授受動詞)',
    pairNote: 'Used from recipient perspective with に/から (私 ← 他人)',
    exampleSentence: {
      japanese: '母から手紙をもらいました。',
      furigana: 'ははから てがみを もらいました。',
      english: 'I received a letter from my mother.'
    }
  },
  {
    id: 'n4-akeru',
    expression: '開ける',
    reading: 'あける',
    meaning: 'to open (something) / to make open',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 4,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 開ける) ↔ 自動詞: 開く (あく)',
    radical: '門 (gate)',
    exampleSentence: {
      japanese: '窓を開けてください。',
      furigana: 'まどを あけて ください。',
      english: 'Please open the window (direct action on an object).'
    }
  },
  {
    id: 'n5-aku',
    expression: '開く',
    reading: 'あく',
    meaning: 'to open (on its own) / to be opened',
    level: 'N5',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N5'],
    transitivity: 'intransitive',
    priority: 5,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 開く) ↔ 他動詞: 開ける (あける)',
    radical: '門 (gate)',
    exampleSentence: {
      japanese: 'ドアが自然に開きました。',
      furigana: 'ドアが しぜんに あきました。',
      english: 'The door opened (on its own / self-occurring action).'
    }
  },
  {
    id: 'n4-shimeru',
    expression: '閉める',
    reading: 'しめる',
    meaning: 'to close (something) / to shut (an object)',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 6,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 閉める) ↔ 自動詞: 閉まる (しまる)',
    radical: '門 (gate)',
    exampleSentence: {
      japanese: '寒いですから窓を閉めてください。',
      furigana: 'さむいですから まどを しめて ください。',
      english: 'Please close the window (direct action on an object) because it is cold.'
    }
  },
  {
    id: 'n4-shimaru',
    expression: '閉まる',
    reading: 'しまる',
    meaning: 'to close (on its own) / to become shut',
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 7,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 閉まる) ↔ 他動詞: 閉める (しめる)',
    radical: '門 (gate)',
    exampleSentence: {
      japanese: '銀行のドアが閉まりました。',
      furigana: 'ぎんこうの ドアが しまりました。',
      english: 'The bank doors closed (on their own / shut on schedule).'
    }
  },
  {
    id: 'n4-tomeru',
    expression: '止める',
    reading: 'とめる',
    meaning: 'to stop (something) / to bring to a halt',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 8,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 止める) ↔ 自動詞: 止まる (とまる)',
    radical: '止 (stop)',
    exampleSentence: {
      japanese: 'ここに車を止めないでください。',
      furigana: 'ここに くるまを とめないで ください。',
      english: 'Please do not stop / park your car (direct action on an object) here.'
    }
  },
  {
    id: 'n4-tomaru',
    expression: '止まる',
    reading: 'とまる',
    meaning: 'to stop (on its own) / to come to a halt',
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 9,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 止まる) ↔ 他動詞: 止める (とめる)',
    radical: '止 (stop)',
    exampleSentence: {
      japanese: '赤信号でバスが止まりました。',
      furigana: 'あかしんごうで バスが とまりました。',
      english: 'The bus stopped (on its own / came to a halt) at the red light.'
    }
  },
  {
    id: 'n4-otosu',
    expression: '落とす',
    reading: 'おとす',
    meaning: 'to drop (something) / to let fall',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 10,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 落とす) ↔ 自動詞: 落ちる (おちる)',
    exampleSentence: {
      japanese: '道で鍵を落としてしまいました。',
      furigana: 'みちで かぎを おとして しまいました。',
      english: 'I accidentally dropped my keys (direct action on an object) on the street.'
    }
  },
  {
    id: 'n4-ochiru',
    expression: '落ちる',
    reading: 'おちる',
    meaning: 'to fall (on its own) / to drop down',
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 11,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 落ちる) ↔ 他動詞: 落とす (おとす)',
    exampleSentence: {
      japanese: '木から葉が落ちました。',
      furigana: 'きから はが おちました。',
      english: 'Leaves fell from the tree (on their own / self-occurring action).'
    }
  },
  {
    id: 'n4-kowasu',
    expression: '壊す',
    reading: 'こわす',
    meaning: 'to break (something) / to destroy (an object)',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 12,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 壊す) ↔ 自動詞: 壊れる (こわれる)',
    exampleSentence: {
      japanese: '弟が時計を壊してしまいました。',
      furigana: 'おとうとが とけいを こわして しまいました。',
      english: 'My younger brother broke the watch (direct action on an object).'
    }
  },
  {
    id: 'n4-kowareru',
    expression: '壊れる',
    reading: 'こわれる',
    meaning: 'to break (on its own) / to become broken',
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 13,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 壊れる) ↔ 他動詞: 壊す (こわす)',
    exampleSentence: {
      japanese: '急にテレビが壊れました。',
      furigana: 'きゅうに テレビが こわれました。',
      english: 'The television broke (on its own / became broken).'
    }
  },
  {
    id: 'n4-tsukeru-kanji',
    expression: '点ける',
    reading: 'つける',
    meaning: 'to turn on (lights/devices) / to switch on',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 14,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 点ける) ↔ 自動詞: 点く (つく)',
    exampleSentence: {
      japanese: '暗いので部屋の電気をつけました。',
      furigana: 'くらいので へやの でんきを つけました。',
      english: 'I turned on the lights in the room (direct action on switch).'
    }
  },
  {
    id: 'n4-tsuku-kanji',
    expression: '点く',
    reading: 'つく',
    meaning: 'to turn on (on its own) / to come on',
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 14,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 点く) ↔ 他動詞: 点ける (つける)',
    exampleSentence: {
      japanese: '電気が自然につきました。',
      furigana: 'でんきが しぜんに つきました。',
      english: 'The lights came on (on their own / self-occurring).'
    }
  },
  {
    id: 'n4-tsukeru',
    expression: 'つける',
    reading: 'つける',
    meaning: 'to turn on (something) / to switch (a device) on',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 14,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を つける) ↔ 自動詞: つく (turn on)',
    exampleSentence: {
      japanese: '暗いので部屋の電気をつけました。',
      furigana: 'くらいので へやの でんきを つけました。',
      english: 'I turned on the lights (direct action on switch) because it was dark.'
    }
  },
  {
    id: 'n4-tsuku',
    expression: 'つく',
    reading: 'つく',
    meaning: 'to turn on (on its own) / to come on',
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 15,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が つく) ↔ 他動詞: つける (turn on)',
    exampleSentence: {
      japanese: '電気が自然につきました。',
      furigana: 'でんきが しぜんに つきました。',
      english: 'The lights came on (on their own / self-occurring).'
    }
  },
  {
    id: 'n4-tsukeru-attach',
    expression: '付ける',
    reading: 'つける',
    meaning: 'to attach (something) / to apply / to stick on',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 16,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 付ける) ↔ 自動詞: 付く (つく)',
    exampleSentence: {
      japanese: '手紙に切手を付けました。',
      furigana: 'てがみに きってを つけました。',
      english: 'I attached a stamp (direct action on an object) to the letter.'
    }
  },
  {
    id: 'n4-tsuku-attach',
    expression: '付く',
    reading: 'つく',
    meaning: 'to stick (on its own) / to be attached / to adhere',
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 17,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 付く) ↔ 他動詞: 付ける (つける)',
    exampleSentence: {
      japanese: '服にゴミが付いています。',
      furigana: 'ふくに ゴミが ついています。',
      english: 'There is lint attached (on its own / adhering) to the clothes.'
    }
  },
  {
    id: 'n4-tsukeru-pickle',
    expression: '漬ける',
    reading: 'つける',
    meaning: 'to soak / to pickle',
    level: 'N4',
    tags: ['verb', 'transitive', 'core', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 28,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '塩で野菜を漬けました。',
      furigana: 'しおで やさいを つけました。',
      english: 'I pickled the vegetables with salt.'
    }
  },
  {
    id: 'n4-tsukeru-wear',
    expression: '着ける',
    reading: 'つける',
    meaning: 'to wear / to put on (accessories, seatbelt)',
    level: 'N4',
    tags: ['verb', 'transitive', 'core', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 29,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '車でシートベルトを着けました。',
      furigana: 'くるまで シートベルトを つけました。',
      english: 'I put on the seatbelt in the car.'
    }
  },
  {
    id: 'n4-tsuku-arrive',
    expression: '着く',
    reading: 'つく',
    meaning: 'to arrive / to reach',
    level: 'N4',
    tags: ['verb', 'intransitive', 'core', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 30,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '午後３時に東京駅に着きました。',
      furigana: 'ごご さんじに とうきょうえきに つきました。',
      english: 'I arrived at Tokyo Station at 3 PM.'
    }
  },
  {
    id: 'n4-kesu',
    expression: '消す',
    reading: 'けす',
    meaning: 'to turn off (something) / to extinguish / to erase',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 16,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 消す) ↔ 自動詞: 消える (きえる)',
    radical: '氵 (water)',
    exampleSentence: {
      japanese: '寝る前にエアコンを消してください。',
      furigana: 'ねる まえに エアコンを けして ください。',
      english: 'Please turn off the air conditioner (direct action on an object) before sleeping.'
    }
  },
  {
    id: 'n4-kieru',
    expression: '消える',
    reading: 'きえる',
    meaning: 'to go out (on its own) / to vanish / to be extinguished',
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 17,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 消える) ↔ 他動詞: 消す (けす)',
    radical: '氵 (water)',
    exampleSentence: {
      japanese: '風でろうそくの火が消えました。',
      furigana: 'かぜで ろうそくの ひが きえました。',
      english: 'The candle flame went out (on its own / self-occurring) in the wind.'
    }
  },
  {
    id: 'n4-dasu',
    expression: '出す',
    reading: 'だす',
    meaning: 'to take out (something) / to hand in (an object)',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 18,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 出す) ↔ 自動詞: 出る (でる)',
    radical: '凵 (container)',
    exampleSentence: {
      japanese: 'カバンから宿題を出しました。',
      furigana: 'カバンから しゅくだいを だしました。',
      english: 'I took out my homework (direct action on an object) from the bag.'
    }
  },
  {
    id: 'n4-deru',
    expression: '出る',
    reading: 'でる',
    meaning: "to exit / to come out (on one's own)",
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 19,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 出る) ↔ 他動詞: 出す (だす)',
    radical: '凵 (container)',
    exampleSentence: {
      japanese: '毎朝８時に家を出ます。',
      furigana: 'まいあさ はちじに うちを でます。',
      english: 'I leave home (self-occurring departure) at 8 every morning.'
    }
  },
  {
    id: 'n4-ireru',
    expression: '入れる',
    reading: 'いれる',
    meaning: 'to put in (something) / to insert (an object)',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 20,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 入れる) ↔ 自動詞: 入る (はいる)',
    radical: '入 (enter)',
    exampleSentence: {
      japanese: 'ポケットに鍵を入れました。',
      furigana: 'ポケットに かぎを いれました。',
      english: 'I put the keys (direct action on an object) into my pocket.'
    }
  },
  {
    id: 'n4-hairu',
    expression: '入る',
    reading: 'はいる',
    meaning: "to enter / to go in (on one's own)",
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 21,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 入る) ↔ 他動詞: 入れる (いれる)',
    radical: '入 (enter)',
    exampleSentence: {
      japanese: '静かに教室に入りました。',
      furigana: 'しずかに きょうしつに はいりました。',
      english: 'I entered the classroom (self-occurring entry) quietly.'
    }
  },
  {
    id: 'n4-hajimeru',
    expression: '始める',
    reading: 'はじめる',
    meaning: 'to start (something) / to initiate (an activity)',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 22,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 始める) ↔ 自動詞: 始まる (はじまる)',
    radical: '女 (woman)',
    exampleSentence: {
      japanese: '先生が授業を始めました。',
      furigana: 'せんせいが じゅぎょうを はじめました。',
      english: 'The teacher started the lesson (direct action initiating activity).'
    }
  },
  {
    id: 'n4-hajimaru',
    expression: '始まる',
    reading: 'はじまる',
    meaning: 'to begin (on its own) / to get started',
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 23,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 始まる) ↔ 他動詞: 始める (はじめる)',
    radical: '女 (woman)',
    exampleSentence: {
      japanese: '映画がもうすぐ始まります。',
      furigana: 'えいがが もうすぐ はじまります。',
      english: 'The movie will begin (on its own / scheduled start) soon.'
    }
  },

  // ================= TIER 2: Core N4 High-Frequency Verbs & Key Expressions =================
  {
    id: 'n4-tsutaeru',
    expression: '伝える',
    reading: 'つたえる',
    meaning: 'to convey, to report, to pass a message',
    level: 'N4',
    tags: ['verb', 'core', 'JLPT_N4'],
    priority: 25,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '先生によろしくお伝えください。',
      furigana: 'せんせいに よろしく おつたえ ください。',
      english: 'Please give my regards to the teacher.'
    }
  },
  {
    id: 'n4-kotaeru',
    expression: '答える',
    reading: 'こたえる',
    meaning: 'to answer, to reply',
    level: 'N4',
    tags: ['verb', 'core', 'JLPT_N4'],
    priority: 26,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '質問に答えてください。',
      furigana: 'しつもんに こたえて ください。',
      english: 'Please answer the question.'
    }
  },
  {
    id: 'n4-shiraberu',
    expression: '調べる',
    reading: 'しらべる',
    meaning: 'to investigate, to check, to look up',
    level: 'N4',
    tags: ['verb', 'core', 'JLPT_N4'],
    priority: 27,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '辞書で意味を調べます。',
      furigana: 'じしょで いみを しらべます。',
      english: 'I look up the meaning in the dictionary.'
    }
  },
  {
    id: 'n4-annaisuru',
    expression: '案内する',
    reading: 'あんないする',
    meaning: 'to guide, to show around',
    level: 'N4',
    tags: ['verb', 'suru-verb', 'JLPT_N4'],
    priority: 28,
    category: 'Core N4 Suru-Verb',
    exampleSentence: {
      japanese: '東京の街を案内します。',
      furigana: 'とうきょうの まちを あんない します。',
      english: 'I will show you around the streets of Tokyo.'
    }
  },
  {
    id: 'n4-renrakusuru',
    expression: '連絡する',
    reading: 'れんらくする',
    meaning: 'to contact, to get in touch',
    level: 'N4',
    tags: ['verb', 'suru-verb', 'JLPT_N4'],
    priority: 29,
    category: 'Core N4 Suru-Verb',
    exampleSentence: {
      japanese: '後で電話で連絡します。',
      furigana: 'あとで でんわで れんらく します。',
      english: 'I will contact you later by phone.'
    }
  },
  {
    id: 'n4-junbi',
    expression: '準備',
    reading: 'じゅんび',
    meaning: 'preparation, arrangements',
    level: 'N4',
    tags: ['noun', 'core', 'JLPT_N4'],
    priority: 30,
    category: 'Core N4 Noun',
    exampleSentence: {
      japanese: '旅行の準備をしています。',
      furigana: 'りょこうの じゅんびを して います。',
      english: 'I am making preparations for the trip.'
    }
  },
  {
    id: 'n4-yakusoku',
    expression: '約束',
    reading: 'やくそく',
    meaning: 'promise, appointment',
    level: 'N4',
    tags: ['noun', 'core', 'JLPT_N4'],
    priority: 31,
    category: 'Core N4 Noun',
    exampleSentence: {
      japanese: '友だちと約束があります。',
      furigana: 'ともだちと やくそくが あります。',
      english: 'I have an appointment with a friend.'
    }
  },
  {
    id: 'n4-setsumei',
    expression: '説明',
    reading: 'せつめい',
    meaning: 'explanation, exposition',
    level: 'N4',
    tags: ['noun', 'suru-verb', 'JLPT_N4'],
    priority: 32,
    category: 'Core N4 Noun',
    exampleSentence: {
      japanese: '使い方の説明を読みました。',
      furigana: 'つかいかたの せつめいを よみました。',
      english: 'I read the explanation on how to use it.'
    }
  },
  {
    id: 'n4-norikaeru',
    expression: '乗り換える',
    reading: 'のりかえる',
    meaning: 'to transfer (trains/buses), to change vehicles',
    level: 'N4',
    tags: ['verb', 'transit', 'JLPT_N4'],
    priority: 33,
    category: 'High-Frequency N4 Verb',
    exampleSentence: {
      japanese: '新宿駅で電車を乗り換えます。',
      furigana: 'しんじゅくえきで でんしゃを のりかえます。',
      english: 'I will transfer trains at Shinjuku Station.'
    }
  },
  {
    id: 'n4-isogu',
    expression: '急ぐ',
    reading: 'いそぐ',
    meaning: 'to hurry, to rush',
    level: 'N4',
    tags: ['verb', 'core', 'JLPT_N4'],
    priority: 34,
    category: 'High-Frequency N4 Verb',
    exampleSentence: {
      japanese: '時間に遅れますから急ぎましょう。',
      furigana: 'じかんに おくれますから いそぎましょう。',
      english: 'Let us hurry because we will be late.'
    }
  },

  // ================= TIER 3: High-Yield N5 Foundational Prerequisite Words =================
  {
    id: 'n5-iku',
    expression: '行く',
    reading: 'いく',
    meaning: 'to go',
    level: 'N5',
    tags: ['verb', 'core', 'JLPT_N5'],
    priority: 50,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: '明日学校へ行きます。',
      furigana: 'あした がっこうへ いきます。',
      english: 'I will go to school tomorrow.'
    }
  },
  {
    id: 'n5-kuru',
    expression: '来る',
    reading: 'くる',
    meaning: 'to come',
    level: 'N5',
    tags: ['verb', 'core', 'JLPT_N5'],
    priority: 51,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: '友だちが家に遊びに来ました。',
      furigana: 'ともだちが うちに あそびに きました。',
      english: 'My friend came over to my house to hang out.'
    }
  },
  {
    id: 'n5-taberu',
    expression: '食べる',
    reading: 'たべる',
    meaning: 'to eat',
    level: 'N5',
    tags: ['verb', 'core', 'JLPT_N5'],
    priority: 52,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: '朝ごはんを食べましたか。',
      furigana: 'あさごはんを たべましたか。',
      english: 'Did you eat breakfast?'
    }
  },
  {
    id: 'n5-nomu',
    expression: '飲む',
    reading: 'のむ',
    meaning: 'to drink',
    level: 'N5',
    tags: ['verb', 'core', 'JLPT_N5'],
    priority: 53,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: '温かいお茶を飲みます。',
      furigana: 'あたたかい おちゃを のみます。',
      english: 'I drink warm green tea.'
    }
  },
  {
    id: 'n5-miru',
    expression: '見る',
    reading: 'みる',
    meaning: 'to see, to look, to watch',
    level: 'N5',
    tags: ['verb', 'core', 'JLPT_N5'],
    priority: 54,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: '週末に映画を見ました。',
      furigana: 'しゅうまつに えいがを みました。',
      english: 'I watched a movie on the weekend.'
    }
  },
  {
    id: 'n5-kiku',
    expression: '聞く',
    reading: 'きく',
    meaning: 'to hear, to listen, to ask',
    level: 'N5',
    tags: ['verb', 'core', 'JLPT_N5'],
    priority: 55,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: '日本の音楽をよく聞きます。',
      furigana: 'にほんの おんがくを よく ききます。',
      english: 'I often listen to Japanese music.'
    }
  },
  {
    id: 'n5-kau',
    expression: '買う',
    reading: 'かう',
    meaning: 'to buy',
    level: 'N5',
    tags: ['verb', 'core', 'JLPT_N5'],
    priority: 56,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: 'デパートで新しい服を買いました。',
      furigana: 'デパートで あたらしい ふくを かいました。',
      english: 'I bought new clothes at the department store.'
    }
  },
  {
    id: 'n5-kiru-cut',
    expression: '切る',
    reading: 'きる',
    meaning: 'to cut (something) / to slice',
    level: 'N5',
    tags: ['verb', 'transitive', 'core', 'JLPT_N5'],
    transitivity: 'transitive',
    priority: 57,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: 'ハサミで紙を切ります。',
      furigana: 'ハサミで かみを きります。',
      english: 'I cut the paper with scissors.'
    }
  },
  {
    id: 'n5-kiru-wear',
    expression: '着る',
    reading: 'きる',
    meaning: 'to wear / to put on (clothes above waist)',
    level: 'N5',
    tags: ['verb', 'transitive', 'core', 'JLPT_N5'],
    transitivity: 'transitive',
    priority: 57,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: '寒いのでセーターを着ます。',
      furigana: 'さむいので セーターを きます。',
      english: 'I wear a sweater because it is cold.'
    }
  },
  {
    id: 'n4-kiru-slay',
    expression: '斬る',
    reading: 'きる',
    meaning: 'to slay / to slash / to kill with a sword',
    level: 'N4',
    tags: ['verb', 'transitive', 'core', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 75,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '侍が刀で斬りました。',
      furigana: 'さむらいが かたなで きりました。',
      english: 'The samurai slashed with his sword.'
    }
  },
  {
    id: 'n5-iru-exist',
    expression: '居る',
    reading: 'いる',
    meaning: 'to be / to exist (animate: people, animals)',
    level: 'N5',
    tags: ['verb', 'intransitive', 'core', 'JLPT_N5'],
    transitivity: 'intransitive',
    priority: 58,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: '庭に白い猫が居ます。',
      furigana: 'にわに しろい ねこが います。',
      english: 'There is a white cat in the garden.'
    }
  },
  {
    id: 'n5-iru-need',
    expression: '要る',
    reading: 'いる',
    meaning: 'to need / to require / to be necessary',
    level: 'N5',
    tags: ['verb', 'intransitive', 'core', 'JLPT_N5'],
    transitivity: 'intransitive',
    priority: 58,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: '海外旅行にはパスポートが要ります。',
      furigana: 'かいがいりょこうには パスポートが いります。',
      english: 'A passport is required for overseas travel.'
    }
  },
  {
    id: 'n4-tomaru-stay',
    expression: '泊まる',
    reading: 'とまる',
    meaning: 'to stay overnight (at a hotel / inn)',
    level: 'N4',
    tags: ['verb', 'intransitive', 'core', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 40,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '京都の古い旅館に泊まりました。',
      furigana: 'きょうとの ふるい りょかんに とまりました。',
      english: 'I stayed overnight at an old Japanese inn in Kyoto.'
    }
  },
  {
    id: 'n4-kisou-compete',
    expression: '競う',
    reading: 'きそう',
    meaning: 'to compete / to vie / to contest',
    level: 'N4',
    tags: ['verb', 'transitive', 'core', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 76,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '選手たちがタイムを競いました。',
      furigana: 'せんしゅたちが タイムを きそいました。',
      english: 'The athletes competed for the best time.'
    }
  },
  {
    id: 'n4-hakaru-measure',
    expression: '測る',
    reading: 'はかる',
    meaning: 'to measure (length, distance, depth, temperature)',
    level: 'N4',
    tags: ['verb', 'transitive', 'core', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 70,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '体温計で熱を測りました。',
      furigana: 'たいおんけいで ねつを はかりました。',
      english: 'I measured my temperature with a thermometer.'
    }
  },
  {
    id: 'n4-hakaru-time',
    expression: '計る',
    reading: 'はかる',
    meaning: 'to measure / time (time, numerical quantities)',
    level: 'N4',
    tags: ['verb', 'transitive', 'core', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 71,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: 'ストップウォッチで走る時間を計りました。',
      furigana: 'ストップウォッチで はしる じかんを はかりました。',
      english: 'I timed my running time with a stopwatch.'
    }
  },
  {
    id: 'n4-hakaru-weigh',
    expression: '量る',
    reading: 'はかる',
    meaning: 'to weigh / measure (weight, volume)',
    level: 'N4',
    tags: ['verb', 'transitive', 'core', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 72,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '荷物の重さを量りました。',
      furigana: 'にもつの おもさを はかりました。',
      english: 'I weighed the luggage.'
    }
  },
  {
    id: 'n4-hakaru-plan',
    expression: '図る',
    reading: 'はかる',
    meaning: 'to plan / to attempt / to seek (solution)',
    level: 'N4',
    tags: ['verb', 'transitive', 'core', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 73,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '問題の早期解決を図ります。',
      furigana: 'もんだいの そうきかいけつを はかります。',
      english: 'We aim for an early resolution to the problem.'
    }
  },
  {
    id: 'n4-ageru-raise',
    expression: '上げる',
    reading: 'あげる',
    meaning: 'to raise (something) / to elevate (an object) / to give',
    level: 'N4',
    tags: ['verb', 'transitive', 'pair', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 18,
    category: 'Transitive / Intransitive Pair',
    pairNote: '他動詞 (〜を 上げる) ↔ 自動詞: 上がる (あがる)',
    exampleSentence: {
      japanese: '質問がある人は手を上げてください。',
      furigana: 'しつもんが ある ひとは てを あげて ください。',
      english: 'Those who have questions, please raise your hand (direct action on an object).'
    }
  },
  {
    id: 'n4-agaru-rise',
    expression: '上がる',
    reading: 'あがる',
    meaning: 'to rise (on its own) / to go up',
    level: 'N4',
    tags: ['verb', 'intransitive', 'pair', 'JLPT_N4'],
    transitivity: 'intransitive',
    priority: 19,
    category: 'Transitive / Intransitive Pair',
    pairNote: '自動詞 (〜が 上がる) ↔ 他動詞: 上げる (あげる)',
    exampleSentence: {
      japanese: '物価が上がりました。',
      furigana: 'ぶっかが あがりました。',
      english: 'Prices rose (on their own / self-occurring increase).'
    }
  },
  {
    id: 'n4-ageru-fry',
    expression: '揚げる',
    reading: 'あげる',
    meaning: 'to deep-fry (food) / to hoist (flag)',
    level: 'N4',
    tags: ['verb', 'transitive', 'core', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 74,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '油で天ぷらを揚げました。',
      furigana: 'あぶらで てんぷらを あげました。',
      english: 'I deep-fried the tempura in oil.'
    }
  },
  {
    id: 'n4-ageru-cite',
    expression: '挙げる',
    reading: 'あげる',
    meaning: 'to cite / to give (examples) / to hold (ceremony)',
    level: 'N4',
    tags: ['verb', 'transitive', 'core', 'JLPT_N4'],
    transitivity: 'transitive',
    priority: 75,
    category: 'Core N4 Verb',
    exampleSentence: {
      japanese: '具体的な例を挙げてください。',
      furigana: 'ぐたいてきな れいを あげて ください。',
      english: 'Please cite concrete examples.'
    }
  },
  {
    id: 'n5-benkyou',
    expression: '勉強する',
    reading: 'べんきょうする',
    meaning: 'to study',
    level: 'N5',
    tags: ['verb', 'suru-verb', 'JLPT_N5'],
    priority: 57,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: '毎日２時間日本語を勉強します。',
      furigana: 'まいにち にじかん にほんごを べんきょう します。',
      english: 'I study Japanese for two hours every day.'
    }
  },
  {
    id: 'n5-wakaru',
    expression: '分かる',
    reading: 'わかる',
    meaning: 'to understand, to comprehend',
    level: 'N5',
    tags: ['verb', 'core', 'JLPT_N5'],
    priority: 58,
    category: 'N5 Essential Prerequisite',
    exampleSentence: {
      japanese: 'この文の意味が分かります。',
      furigana: 'この ぶんの いみが わかります。',
      english: 'I understand the meaning of this sentence.'
    }
  },
  {
    id: 'n5-gakusei',
    expression: '学生',
    reading: 'がくせい',
    meaning: 'student',
    level: 'N5',
    tags: ['noun', 'core', 'JLPT_N5'],
    priority: 59,
    category: 'N5 Essential Noun',
    exampleSentence: {
      japanese: '私は大学の学生です。',
      furigana: 'わたしは だいがくの がくせい です。',
      english: 'I am a university student.'
    }
  },
  {
    id: 'n5-sensei',
    expression: '先生',
    reading: 'せんせい',
    meaning: 'teacher, instructor',
    level: 'N5',
    tags: ['noun', 'core', 'JLPT_N5'],
    priority: 60,
    category: 'N5 Essential Noun',
    exampleSentence: {
      japanese: '田中先生はとても優しいです。',
      furigana: 'たなか せんせいは とても やさしい です。',
      english: 'Teacher Tanaka is very kind.'
    }
  },
  {
    id: 'n5-tomodachi',
    expression: '友だち',
    reading: 'ともだち',
    meaning: 'friend, companion',
    level: 'N5',
    tags: ['noun', 'core', 'JLPT_N5'],
    priority: 61,
    category: 'N5 Essential Noun',
    exampleSentence: {
      japanese: '友だちと一緒に晩ごはんを食べました。',
      furigana: 'ともだちと いっしょに ばんごはんを たべました。',
      english: 'I ate dinner together with a friend.'
    }
  },
  {
    id: 'n5-jikan',
    expression: '時間',
    reading: 'じかん',
    meaning: 'time, hours',
    level: 'N5',
    tags: ['noun', 'core', 'JLPT_N5'],
    priority: 62,
    category: 'N5 Essential Noun',
    exampleSentence: {
      japanese: 'まだ時間がありますから大丈夫です。',
      furigana: 'まだ じかんが ありますから だいじょうぶ です。',
      english: 'We still have time, so it is alright.'
    }
  },
  {
    id: 'n5-atarashii',
    expression: '新しい',
    reading: 'あたらしい',
    meaning: 'new, fresh',
    level: 'N5',
    tags: ['adjective', 'i-adj', 'JLPT_N5'],
    priority: 63,
    category: 'N5 Essential Adjective',
    exampleSentence: {
      japanese: '新しい靴を買いたいです。',
      furigana: 'あたらしい くつを かいたいです。',
      english: 'I want to buy new shoes.'
    }
  },
  {
    id: 'n5-takai',
    expression: '高い',
    reading: 'たかい',
    meaning: 'high, tall, expensive',
    level: 'N5',
    tags: ['adjective', 'i-adj', 'JLPT_N5'],
    priority: 64,
    category: 'N5 Essential Adjective',
    exampleSentence: {
      japanese: 'この辞書は少し高いです。',
      furigana: 'この じしょは すこし たかい です。',
      english: 'This dictionary is a little expensive.'
    }
  }
];
