import type { JLPTLevel, VocabCardItem, FetchResult, DataSyncStatus, ExampleSentence } from './vocabTypes.ts';
import { FALLBACK_VOCAB_DATA } from './fallbackVocab.ts';

interface VerbPairDetail {
  partner: string;
  partnerReading: string;
  type: 'transitive' | 'intransitive';
  nuancedMeaning: string;
  exampleSentence?: ExampleSentence;
}

// Complete dictionary of N4/N5 transitive and intransitive verb pairs with nuanced definitions
export const VERB_PAIRS_MAP: Record<string, VerbPairDetail> = {
  // 開ける / 開く
  '開ける': {
    partner: '開く',
    partnerReading: 'あく',
    type: 'transitive',
    nuancedMeaning: 'to open (something) / to make open',
    exampleSentence: {
      japanese: '窓を開けてください。',
      furigana: 'まどを あけて ください。',
      english: 'Please open the window (direct action on an object).'
    }
  },
  '開く': {
    partner: '開ける',
    partnerReading: 'あける',
    type: 'intransitive',
    nuancedMeaning: 'to open (on its own) / to be opened',
    exampleSentence: {
      japanese: 'ドアが自然に開きました。',
      furigana: 'ドアが しぜんに あきました。',
      english: 'The door opened (on its own / self-occurring action).'
    }
  },

  // 閉める / 閉まる
  '閉める': {
    partner: '閉まる',
    partnerReading: 'しまる',
    type: 'transitive',
    nuancedMeaning: 'to close (something) / to shut (an object)',
    exampleSentence: {
      japanese: '寒いですから窓を閉めてください。',
      furigana: 'さむいですから まどを しめて ください。',
      english: 'Please close the window (direct action on an object) because it is cold.'
    }
  },
  '閉まる': {
    partner: '閉める',
    partnerReading: 'しめる',
    type: 'intransitive',
    nuancedMeaning: 'to close (on its own) / to become shut',
    exampleSentence: {
      japanese: '銀行のドアが閉まりました。',
      furigana: 'ぎんこうの ドアが しまりました。',
      english: 'The bank doors closed (on their own / shut on schedule).'
    }
  },

  // 止める / 止まる
  '止める': {
    partner: '止まる',
    partnerReading: 'とまる',
    type: 'transitive',
    nuancedMeaning: 'to stop (something) / to bring to a halt',
    exampleSentence: {
      japanese: 'ここに車を止めないでください。',
      furigana: 'ここに くるまを とめないで ください。',
      english: 'Please do not stop / park your car (direct action on an object) here.'
    }
  },
  '止まる': {
    partner: '止める',
    partnerReading: 'とめる',
    type: 'intransitive',
    nuancedMeaning: 'to stop (on its own) / to come to a halt',
    exampleSentence: {
      japanese: '赤信号でバスが止まりました。',
      furigana: 'あかしんごうで バスが とまりました。',
      english: 'The bus stopped (on its own / came to a halt) at the red light.'
    }
  },

  // 落とす / 落ちる
  '落とす': {
    partner: '落ちる',
    partnerReading: 'おちる',
    type: 'transitive',
    nuancedMeaning: 'to drop (something) / to let fall',
    exampleSentence: {
      japanese: '道で鍵を落としてしまいました。',
      furigana: 'みちで かぎを おとして しまいました。',
      english: 'I accidentally dropped my keys (direct action on an object) on the street.'
    }
  },
  '落ちる': {
    partner: '落とす',
    partnerReading: 'おとす',
    type: 'intransitive',
    nuancedMeaning: 'to fall (on its own) / to drop down',
    exampleSentence: {
      japanese: '木から葉が落ちました。',
      furigana: 'きから はが おちました。',
      english: 'Leaves fell from the tree (on their own / self-occurring action).'
    }
  },

  // 壊す / 壊れる
  '壊す': {
    partner: '壊れる',
    partnerReading: 'こわれる',
    type: 'transitive',
    nuancedMeaning: 'to break (something) / to destroy (an object)',
    exampleSentence: {
      japanese: '弟が時計を壊してしまいました。',
      furigana: 'おとうとが とけいを こわして しまいました。',
      english: 'My younger brother broke the watch (direct action on an object).'
    }
  },
  '壊れる': {
    partner: '壊す',
    partnerReading: 'こわす',
    type: 'intransitive',
    nuancedMeaning: 'to break (on its own) / to become broken',
    exampleSentence: {
      japanese: '急にテレビが壊れました。',
      furigana: 'きゅうに テレビが こわれました。',
      english: 'The television broke (on its own / became broken).'
    }
  },

  // 点ける / 点く & つける / つく
  '点ける': {
    partner: '点く',
    partnerReading: 'つく',
    type: 'transitive',
    nuancedMeaning: 'to turn on (something) / to switch (lights/devices) on',
    exampleSentence: {
      japanese: '暗いので部屋の電気をつけました。',
      furigana: 'くらいので へやの でんきを つけました。',
      english: 'I turned on the lights in the room (direct action on switch).'
    }
  },
  '点く': {
    partner: '点ける',
    partnerReading: 'つける',
    type: 'intransitive',
    nuancedMeaning: 'to turn on (on its own) / to come on',
    exampleSentence: {
      japanese: '電気が自然につきました。',
      furigana: 'でんきが しぜんに つきました。',
      english: 'The lights came on (on their own / self-occurring).'
    }
  },
  'つける': {
    partner: 'つく',
    partnerReading: 'つく',
    type: 'transitive',
    nuancedMeaning: 'to turn on (something) / to switch (a device) on',
    exampleSentence: {
      japanese: '暗いので部屋の電気をつけました。',
      furigana: 'くらいので へやの でんきを つけました。',
      english: 'I turned on the lights (direct action on switch) because it was dark.'
    }
  },
  'つく': {
    partner: 'つける',
    partnerReading: 'つける',
    type: 'intransitive',
    nuancedMeaning: 'to turn on (on its own) / to come on',
    exampleSentence: {
      japanese: '電気が自然につきました。',
      furigana: 'でんきが しぜんに つきました。',
      english: 'The lights came on (on their own / self-occurring).'
    }
  },

  // 付ける / 付く
  '付ける': {
    partner: '付く',
    partnerReading: 'つく',
    type: 'transitive',
    nuancedMeaning: 'to attach (something) / to apply / to stick on',
    exampleSentence: {
      japanese: '手紙に切手を付けました。',
      furigana: 'てがみに きってを つけました。',
      english: 'I attached a stamp (direct action on an object) to the letter.'
    }
  },
  '付く': {
    partner: '付ける',
    partnerReading: 'つける',
    type: 'intransitive',
    nuancedMeaning: 'to stick (on its own) / to be attached / to adhere',
    exampleSentence: {
      japanese: '服にゴミが付いています。',
      furigana: 'ふくに ゴミが ついています。',
      english: 'There is lint attached (on its own / adhering) to the clothes.'
    }
  },

  // 消す / 消える
  '消す': {
    partner: '消える',
    partnerReading: 'きえる',
    type: 'transitive',
    nuancedMeaning: 'to turn off (something) / to extinguish / to erase',
    exampleSentence: {
      japanese: '寝る前にエアコンを消してください。',
      furigana: 'ねる まえに エアコンを けして ください。',
      english: 'Please turn off the air conditioner (direct action on an object) before sleeping.'
    }
  },
  '消える': {
    partner: '消す',
    partnerReading: 'けす',
    type: 'intransitive',
    nuancedMeaning: 'to go out (on its own) / to vanish / to be extinguished',
    exampleSentence: {
      japanese: '風でろうそくの火が消えました。',
      furigana: 'かぜで ろうそくの ひが きえました。',
      english: 'The candle flame went out (on its own / self-occurring) in the wind.'
    }
  },

  // 出す / 出る
  '出す': {
    partner: '出る',
    partnerReading: 'でる',
    type: 'transitive',
    nuancedMeaning: 'to take out (something) / to hand in (an object)',
    exampleSentence: {
      japanese: 'カバンから宿題を出しました。',
      furigana: 'カバンから しゅくだいを だしました。',
      english: 'I took out my homework (direct action on an object) from the bag.'
    }
  },
  '出る': {
    partner: '出す',
    partnerReading: 'だす',
    type: 'intransitive',
    nuancedMeaning: "to exit / to come out (on one's own)",
    exampleSentence: {
      japanese: '毎朝８時に家を出ます。',
      furigana: 'まいあさ はちじに うちを でます。',
      english: 'I leave home (self-occurring departure) at 8 every morning.'
    }
  },

  // 入れる / 入る
  '入れる': {
    partner: '入る',
    partnerReading: 'はいる',
    type: 'transitive',
    nuancedMeaning: 'to put in (something) / to insert (an object)',
    exampleSentence: {
      japanese: 'ポケットに鍵を入れました。',
      furigana: 'ポケットに かぎを いれました。',
      english: 'I put the keys (direct action on an object) into my pocket.'
    }
  },
  '入る': {
    partner: '入れる',
    partnerReading: 'いれる',
    type: 'intransitive',
    nuancedMeaning: "to enter / to go in (on one's own)",
    exampleSentence: {
      japanese: '静かに教室に入りました。',
      furigana: 'しずかに きょうしつに はいりました。',
      english: 'I entered the classroom (self-occurring entry) quietly.'
    }
  },

  // 始める / 始まる
  '始める': {
    partner: '始まる',
    partnerReading: 'はじまる',
    type: 'transitive',
    nuancedMeaning: 'to start (something) / to initiate (an activity)',
    exampleSentence: {
      japanese: '先生が授業を始めました。',
      furigana: 'せんせいが じゅぎょうを はじめました。',
      english: 'The teacher started the lesson (direct action initiating activity).'
    }
  },
  '始まる': {
    partner: '始める',
    partnerReading: 'はじめる',
    type: 'intransitive',
    nuancedMeaning: 'to begin (on its own) / to get started',
    exampleSentence: {
      japanese: '映画がもうすぐ始まります。',
      furigana: 'えいがが もうすぐ はじまります。',
      english: 'The movie will begin (on its own / scheduled start) soon.'
    }
  },

  // 直す / 直る
  '直す': {
    partner: '直る',
    partnerReading: 'なおる',
    type: 'transitive',
    nuancedMeaning: 'to fix (something) / to repair (an object)',
    exampleSentence: {
      japanese: '壊れた時計を直しました。',
      furigana: 'こわれた とけいを なおしました。',
      english: 'I repaired the broken watch (direct action on an object).'
    }
  },
  '直る': {
    partner: '直す',
    partnerReading: 'なおす',
    type: 'intransitive',
    nuancedMeaning: 'to be fixed (on its own) / to heal / to get repaired',
    exampleSentence: {
      japanese: 'パソコンの調子が直りました。',
      furigana: 'パソコンの ちょうしが なおりました。',
      english: 'The computer was fixed / recovered (self-occurring repair).'
    }
  },

  // 見つける / 見つかる
  '見つける': {
    partner: '見つかる',
    partnerReading: 'みつかる',
    type: 'transitive',
    nuancedMeaning: 'to find (something) / to discover (an object)',
    exampleSentence: {
      japanese: '失くした鍵を見つけました。',
      furigana: 'なくした かぎを みつけました。',
      english: 'I found the lost key (direct action of discovering).'
    }
  },
  '見つかる': {
    partner: '見つける',
    partnerReading: 'みつける',
    type: 'intransitive',
    nuancedMeaning: 'to be found (on its own) / to turn up',
    exampleSentence: {
      japanese: '失くした財布が見つかりました。',
      furigana: 'なくした さいふが みつかりました。',
      english: 'The lost wallet was found / turned up (self-occurring discovery).'
    }
  },

  // 集める / 集まる
  '集める': {
    partner: '集まる',
    partnerReading: 'あつまる',
    type: 'transitive',
    nuancedMeaning: 'to gather (things) / to collect (objects)',
    exampleSentence: {
      japanese: '日本の切手を集めています。',
      furigana: 'にほんの きってを あつめて います。',
      english: 'I collect Japanese stamps (direct action of collecting).'
    }
  },
  '集まる': {
    partner: '集める',
    partnerReading: 'あつめる',
    type: 'intransitive',
    nuancedMeaning: "to gather (on one's own) / to assemble (together)",
    exampleSentence: {
      japanese: '駅前に人がたくさん集まりました。',
      furigana: 'えきまえに ひとが たくさん あつまりました。',
      english: 'Many people gathered (on their own / assembled) in front of the station.'
    }
  },

  // 変える / 変わる
  '変える': {
    partner: '変わる',
    partnerReading: 'かわる',
    type: 'transitive',
    nuancedMeaning: 'to change (something) / to alter (an object)',
    exampleSentence: {
      japanese: '旅行の予定を変えました。',
      furigana: 'りょこうの よていを かえました。',
      english: 'I changed my travel schedule (direct alteration of an object).'
    }
  },
  '変わる': {
    partner: '変える',
    partnerReading: 'かえる',
    type: 'intransitive',
    nuancedMeaning: 'to change (on its own) / to undergo change',
    exampleSentence: {
      japanese: '信号が青に変わりました。',
      furigana: 'しんごうが あおに かわりました。',
      english: 'The traffic light changed to green (self-occurring transition).'
    }
  },

  // 起こす / 起きる
  '起こす': {
    partner: '起きる',
    partnerReading: 'おきる',
    type: 'transitive',
    nuancedMeaning: 'to wake someone up / to cause (an event)',
    exampleSentence: {
      japanese: '毎朝母が私を起こしてくれます。',
      furigana: 'まいあさ ははが わたしを おこして くれます。',
      english: 'My mother wakes me up (direct action on another person) every morning.'
    }
  },
  '起きる': {
    partner: '起こす',
    partnerReading: 'おこす',
    type: 'intransitive',
    nuancedMeaning: "to wake up (on one's own) / to occur",
    exampleSentence: {
      japanese: '毎朝６時に起きます。',
      furigana: 'まいあさ ろくじに おきます。',
      english: 'I wake up (self-occurring rising) at 6 AM every morning.'
    }
  },

  // 届ける / 届く
  '届ける': {
    partner: '届く',
    partnerReading: 'とどく',
    type: 'transitive',
    nuancedMeaning: 'to deliver (something) / to send (an object)',
    exampleSentence: {
      japanese: '手紙を友だちの家に届けました。',
      furigana: 'てがみを ともだちの うちに とどけました。',
      english: 'I delivered the letter (direct action of delivering) to my friend\'s house.'
    }
  },
  '届く': {
    partner: '届ける',
    partnerReading: 'とどける',
    type: 'intransitive',
    nuancedMeaning: 'to arrive (on its own) / to reach',
    exampleSentence: {
      japanese: '手紙が無事に届きました。',
      furigana: 'てがみが ぶじに とどきました。',
      english: 'The letter arrived safely (self-occurring arrival).'
    }
  },

  // 沸かす / 沸く
  '沸かす': {
    partner: '沸く',
    partnerReading: 'わく',
    type: 'transitive',
    nuancedMeaning: 'to boil (water) / to heat up (a liquid)',
    exampleSentence: {
      japanese: 'お湯を沸かしてお茶を淹れます。',
      furigana: 'おゆを わかして おちゃを いれます。',
      english: 'I boil water (direct heating of liquid) and brew tea.'
    }
  },
  '沸く': {
    partner: '沸かす',
    partnerReading: 'わかす',
    type: 'intransitive',
    nuancedMeaning: 'to boil (on its own) / to become heated',
    exampleSentence: {
      japanese: 'お風呂のお湯が沸きました。',
      furigana: 'おふろの おゆが わきました。',
      english: 'The bath water is ready / heated (self-occurring heating).'
    }
  },

  // 冷やす / 冷える
  '冷やす': {
    partner: '冷える',
    partnerReading: 'ひえる',
    type: 'transitive',
    nuancedMeaning: 'to chill (something) / to cool down (an object)',
    exampleSentence: {
      japanese: 'スイカを冷蔵庫で冷やします。',
      furigana: 'スイカを れいぞうこで ひやします。',
      english: 'I chill the watermelon (direct action of cooling) in the refrigerator.'
    }
  },
  '冷える': {
    partner: '冷やす',
    partnerReading: 'ひやす',
    type: 'intransitive',
    nuancedMeaning: 'to grow cold (on its own) / to chill',
    exampleSentence: {
      japanese: '今夜は足が冷えます。',
      furigana: 'こんやは あしが ひえます。',
      english: 'My feet are getting cold (self-occurring chilling) tonight.'
    }
  },

  // なくす / なくなる
  'なくす': {
    partner: 'なくなる',
    partnerReading: 'なくなる',
    type: 'transitive',
    nuancedMeaning: 'to lose (something) / to misplace (an object)',
    exampleSentence: {
      japanese: '大切なパスポートをなくしました。',
      furigana: 'たいせつな パスポートを なくしました。',
      english: 'I lost my important passport (direct action of misplacing).'
    }
  },
  'なくなる': {
    partner: 'なくす',
    partnerReading: 'なくす',
    type: 'intransitive',
    nuancedMeaning: 'to disappear (on its own) / to be lost / to run out',
    exampleSentence: {
      japanese: '部屋の鍵がなくなりました。',
      furigana: 'へやの かぎが なくなりました。',
      english: 'My room key has gone missing (self-occurring disappearance).'
    }
  },

  // 割る / 割れる
  '割る': {
    partner: '割れる',
    partnerReading: 'われる',
    type: 'transitive',
    nuancedMeaning: 'to break / to crack (something) [direct action]',
    exampleSentence: {
      japanese: 'コップを割ってしまいました。',
      furigana: 'コップを わって しまいました。',
      english: 'I accidentally broke the glass cup (direct action on an object).'
    }
  },
  '割れる': {
    partner: '割る',
    partnerReading: 'わる',
    type: 'intransitive',
    nuancedMeaning: 'to crack / to break (on its own) [self-occurring]',
    exampleSentence: {
      japanese: '窓ガラスが割れました。',
      furigana: 'まどガラスが われました。',
      english: 'The window glass cracked (on its own / self-occurring).'
    }
  },

  // 汚す / 汚れる
  '汚す': {
    partner: '汚れる',
    partnerReading: 'よごれる',
    type: 'transitive',
    nuancedMeaning: 'to dirty (something) / to soil (an object)',
    exampleSentence: {
      japanese: '新しい靴を汚してしまいました。',
      furigana: 'あたらしい くつを よごして しまいました。',
      english: 'I got my new shoes dirty (direct action soiling an object).'
    }
  },
  '汚れる': {
    partner: '汚す',
    partnerReading: 'よごす',
    type: 'intransitive',
    nuancedMeaning: 'to get dirty (on its own) / to become soiled',
    exampleSentence: {
      japanese: '雨で服が汚れました。',
      furigana: 'あめで ふくが よごれました。',
      english: 'My clothes got dirty (self-occurring soiling) from the rain.'
    }
  },

  // 倒す / 倒れる
  '倒す': {
    partner: '倒れる',
    partnerReading: 'たおれる',
    type: 'transitive',
    nuancedMeaning: 'to knock down (something) / to topple (an object)',
    exampleSentence: {
      japanese: '強風が木を倒しました。',
      furigana: 'きょうふうが きを たおしました。',
      english: 'Strong winds knocked down the tree (direct action on an object).'
    }
  },
  '倒れる': {
    partner: '倒す',
    partnerReading: 'たおす',
    type: 'intransitive',
    nuancedMeaning: 'to fall down (on its own) / to collapse',
    exampleSentence: {
      japanese: '強い風で看板が倒れました。',
      furigana: 'つよい かぜで かんばんが たおれました。',
      english: 'The sign fell down (on its own / self-occurring collapse) in strong winds.'
    }
  },

  // 戻す / 戻る
  '戻す': {
    partner: '戻る',
    partnerReading: 'もどる',
    type: 'transitive',
    nuancedMeaning: 'to return (something) / to put (an object) back',
    exampleSentence: {
      japanese: '本を元の場所に戻してください。',
      furigana: 'ほんを もとの ばしょに もどして ください。',
      english: 'Please return the books (direct action on objects) to their original spot.'
    }
  },
  '戻る': {
    partner: '戻す',
    partnerReading: 'もどす',
    type: 'intransitive',
    nuancedMeaning: 'to return (on its own) / to go back',
    exampleSentence: {
      japanese: '父は午後５時に会社に戻りました。',
      furigana: 'ちちは ごご ごじに かいしゃに もどりました。',
      english: 'My father returned (on his own / self-occurring return) to the office at 5 PM.'
    }
  },

  // 乗せる / 乗る
  '乗せる': {
    partner: '乗る',
    partnerReading: 'のる',
    type: 'transitive',
    nuancedMeaning: 'to give a ride to (someone) / to load (something)',
    exampleSentence: {
      japanese: '友だちを車に乗せました。',
      furigana: 'ともだちを くるまに のせました。',
      english: 'I gave my friend a ride (direct action transporting someone) in the car.'
    }
  },
  '乗る': {
    partner: '乗せる',
    partnerReading: 'のせる',
    type: 'intransitive',
    nuancedMeaning: "to ride / to board (on one's own)",
    exampleSentence: {
      japanese: '東京駅で新幹線に乗りました。',
      furigana: 'とうきょうえきで しんかんせんに のりました。',
      english: 'I boarded the bullet train (on my own / self-occurring boarding) at Tokyo Station.'
    }
  },

  // 降ろす / 降りる
  '降ろす': {
    partner: '降りる',
    partnerReading: 'おりる',
    type: 'transitive',
    nuancedMeaning: 'to unload (something) / to drop (someone) off',
    exampleSentence: {
      japanese: '駅の前で荷物を降ろしました。',
      furigana: 'えきの まえで にもつを おろしました。',
      english: 'I unloaded the baggage (direct action on an object) in front of the station.'
    }
  },
  '降りる': {
    partner: '降ろす',
    partnerReading: 'おろす',
    type: 'intransitive',
    nuancedMeaning: "to get off / to step down (on one's own)",
    exampleSentence: {
      japanese: '次の駅で電車を降ります。',
      furigana: 'つぎの えきで でんしゃを おります。',
      english: 'I will get off the train (on my own / self-occurring exit) at the next station.'
    }
  },

  // 立てる / 立つ
  '立てる': {
    partner: '立つ',
    partnerReading: 'たつ',
    type: 'transitive',
    nuancedMeaning: 'to stand (something) up / to erect (an object)',
    exampleSentence: {
      japanese: '玄関に傘を立てました。',
      furigana: 'げんかんに かさを たてました。',
      english: 'I stood the umbrella (direct action on an object) upright in the entryway.'
    }
  },
  '立つ': {
    partner: '立てる',
    partnerReading: 'たてる',
    type: 'intransitive',
    nuancedMeaning: "to stand up (on one's own)",
    exampleSentence: {
      japanese: '先生が教室に入ると生徒が立ちました。',
      furigana: 'せんせいが きょうしつに はいると せいとが たちました。',
      english: 'The students stood up (on their own / self-occurring rising) when the teacher entered.'
    }
  },

  // 焼く / 焼ける
  '焼く': {
    partner: '焼ける',
    partnerReading: 'やける',
    type: 'transitive',
    nuancedMeaning: 'to bake / grill (something) [direct action on food]',
    exampleSentence: {
      japanese: '魚を美味しく焼きました。',
      furigana: 'さかなを おいしく やきました。',
      english: 'I grilled the fish (direct action on an object) for dinner.'
    }
  },
  '焼ける': {
    partner: '焼く',
    partnerReading: 'やく',
    type: 'intransitive',
    nuancedMeaning: 'to be baked / to grill (on its own)',
    exampleSentence: {
      japanese: '美味しいパンが焼けました。',
      furigana: 'おいしい パンが やけました。',
      english: 'The delicious bread baked and is ready (self-occurring cooking).'
    }
  },

  // 治す / 治る
  '治す': {
    partner: '治る',
    partnerReading: 'なおる',
    type: 'transitive',
    nuancedMeaning: 'to cure (an illness) / to heal (someone)',
    exampleSentence: {
      japanese: '薬を飲んで風邪を治しました。',
      furigana: 'くすりを のんで かぜを なおしました。',
      english: 'I took medicine and cured my cold (direct action treating illness).'
    }
  },
  '治る': {
    partner: '治す',
    partnerReading: 'なおす',
    type: 'intransitive',
    nuancedMeaning: 'to heal (on its own) / to recover',
    exampleSentence: {
      japanese: '風邪がすっかり治りました。',
      furigana: 'かぜが すっかり なおりました。',
      english: 'My cold completely healed (on its own / self-occurring recovery).'
    }
  },

  // 上げる / 上がる
  '上げる': {
    partner: '上がる',
    partnerReading: 'あがる',
    type: 'transitive',
    nuancedMeaning: 'to raise (something) / to elevate (an object) / to give',
    exampleSentence: {
      japanese: '質問がある人は手を上げてください。',
      furigana: 'しつもんが ある ひとは てを あげて ください。',
      english: 'Those who have questions, please raise your hand (direct action on an object).'
    }
  },
  '上がる': {
    partner: '上げる',
    partnerReading: 'あげる',
    type: 'intransitive',
    nuancedMeaning: 'to rise (on its own) / to go up',
    exampleSentence: {
      japanese: '物価が上がりました。',
      furigana: 'ぶっかが あがりました。',
      english: 'Prices rose (on their own / self-occurring increase).'
    }
  },
};

// Add pure kana aliases for seamless lookup across datasets
const KANA_PAIR_ENTRIES: Array<[string, string]> = [
  ['あける', '開ける'],
  ['あく', '開く'],
  ['しめる', '閉める'],
  ['しまる', '閉まる'],
  ['とめる', '止める'],
  ['とまる', '止まる'],
  ['おとす', '落とす'],
  ['おちる', '落ちる'],
  ['こわす', '壊す'],
  ['こわれる', '壊れる'],
  ['けす', '消す'],
  ['きえる', '消える'],
  ['だす', '出す'],
  ['でる', '出る'],
  ['いれる', '入れる'],
  ['はいる', '入る'],
  ['はじめる', '始める'],
  ['はじまる', '始まる'],
  ['なおす', '直す'],
  ['なおる', '直る'],
  ['みつける', '見つける'],
  ['みつかる', '見つかる'],
  ['あつめる', '集める'],
  ['あつまる', '集まる'],
  ['かえる', '変える'],
  ['かわる', '変わる'],
  ['おこす', '起こす'],
  ['おきる', '起きる'],
  ['とどける', '届ける'],
  ['とどく', '届く'],
  ['わかす', '沸かす'],
  ['わく', '沸く'],
  ['ひやす', '冷やす'],
  ['ひえる', '冷える'],
  ['わる', '割る'],
  ['われる', '割れる'],
  ['よごす', '汚す'],
  ['よごれる', '汚れる'],
  ['たおす', '倒す'],
  ['たおれる', '倒れる'],
  ['もどす', '戻す'],
  ['もどる', '戻る'],
  ['のせる', '乗せる'],
  ['のる', '乗る'],
  ['おろす', '降ろす'],
  ['おりる', '降りる'],
  ['たてる', '立てる'],
  ['たつ', '立つ'],
  ['やく', '焼く'],
  ['やける', '焼ける'],
];

for (const [kana, kanjiKey] of KANA_PAIR_ENTRIES) {
  if (VERB_PAIRS_MAP[kanjiKey] && !VERB_PAIRS_MAP[kana]) {
    VERB_PAIRS_MAP[kana] = VERB_PAIRS_MAP[kanjiKey];
  }
}

/**
 * Detects whether a vocabulary item's existing meaning conflicts with a verb pair definition,
 * preventing homophone cross-contamination.
 */
export function isConflictingMeaning(key: string, meaning?: string): boolean {
  if (!meaning) return false;
  const m = meaning.toLowerCase();

  // つける / 点ける: turn on lights/devices
  if (key === 'つける' || key === '点ける') {
    if (m.includes('pickle') || m.includes('soak') || m.includes('attach') || m.includes('apply') || m.includes('wear') || m.includes('put on')) {
      return true;
    }
  }
  // つく / 点く: turn on
  if (key === 'つく' || key === '点く') {
    if (m.includes('arrive') || m.includes('reach') || m.includes('stick') || m.includes('adhere') || m.includes('poke')) {
      return true;
    }
  }
  // とまる / 止まる: stop / come to a halt
  if (key === 'とまる' || key === '止まる') {
    if (m.includes('overnight') || m.includes('hotel') || m.includes('inn') || m.includes('lodge') || m.includes('stay')) {
      return true;
    }
  }
  // とめる / 止める: stop / bring to halt
  if (key === 'とめる' || key === '止める') {
    if (m.includes('quit') || m.includes('resign') || m.includes('lodge') || m.includes('overnight')) {
      return true;
    }
  }
  // あげる / 上げる: raise / elevate / give
  if (key === 'あげる' || key === '上げる') {
    if (m.includes('fry') || m.includes('deep-fry') || m.includes('tempura') || m.includes('cite')) {
      return true;
    }
  }
  // きる / 切る: cut
  if (key === 'きる' || key === '切る') {
    if (m.includes('wear') || m.includes('put on') || m.includes('slay') || m.includes('kill with sword')) {
      return true;
    }
  }
  // きる / 着る: wear
  if (key === 'きる' || key === '着る') {
    if (m.includes('cut') || m.includes('slice') || m.includes('slay')) {
      return true;
    }
  }
  // いる / 居る: exist (animate)
  if (key === 'いる' || key === '居る') {
    if (m.includes('need') || m.includes('require') || m.includes('necessary')) {
      return true;
    }
  }
  // いる / 要る: need
  if (key === 'いる' || key === '要る') {
    if (m.includes('exist') || (m.includes('to be') && !m.includes('necessary'))) {
      return true;
    }
  }

  return false;
}

/**
 * Looks up verb pair details with strict homophone disambiguation:
 * - Strictly matches on exact expression (Kanji or Kana expression) — NEVER looks up by phonetic reading!
 * - Disambiguates homographs (止める: とめる vs やめる; 開く: あく vs ひらく).
 */
export function findVerbPair(
  expression: string,
  reading?: string,
  currentMeaning?: string
): VerbPairDetail | undefined {
  // Disambiguation for homographs sharing the same Kanji:
  if (expression === '止める' && reading && reading !== 'とめる') {
    return undefined; // e.g. やめる (quit) is not the transitive pair with 止まる
  }
  if (expression === '開く' && reading && reading === 'ひらく') {
    return undefined; // ひらく (open an event/flower) has distinct nuance from あく
  }

  // 1. Direct match on exact expression ONLY (Kanji form or pure Kana headword)
  // CRITICAL RULE: NO function may use reading (hiragana) as a lookup key.
  if (VERB_PAIRS_MAP[expression]) {
    if (currentMeaning && isConflictingMeaning(expression, currentMeaning)) {
      return undefined;
    }
    return VERB_PAIRS_MAP[expression];
  }

  return undefined;
}

/**
 * Formats an English definition according to JLPT structural nuance rules:
 * - TRANSITIVE (他動詞): Explicitly show direct action on an object (e.g., "to open (something) / to make open").
 * - INTRANSITIVE (自動詞): Explicitly show self-occurring action (e.g., "to open (on its own) / to be opened").
 */
export function formatNuancedDefinition(
  rawMeaning: string,
  transitivity: 'transitive' | 'intransitive',
  expression?: string
): string {
  // If exact expression is in dictionary, return the nuanced dictionary definition ONLY if not conflicting
  if (expression && VERB_PAIRS_MAP[expression] && !isConflictingMeaning(expression, rawMeaning)) {
    return VERB_PAIRS_MAP[expression].nuancedMeaning;
  }

  // Strip dictionary abbreviation markers like (v.t.), (v.i.), (vt), (vi)
  let clean = rawMeaning
    .replace(/\(v\.?t\.?\)/gi, '')
    .replace(/\(v\.?i\.?\)/gi, '')
    .replace(/\(vt\)/gi, '')
    .replace(/\(vi\)/gi, '')
    .trim();

  if (transitivity === 'transitive') {
    const hasObjectIndicator = /\((?:something|an object|someone|things|direct action)\)/i.test(clean) ||
      clean.toLowerCase().includes('direct action') ||
      clean.toLowerCase().includes('(something)');
    if (!hasObjectIndicator) {
      if (/^to\s+([a-z]+)/i.test(clean)) {
        clean = clean.replace(/^to\s+([a-z]+)/i, 'to $1 (something)');
      } else {
        clean = `${clean} (something) [direct action on an object]`;
      }
    }
  } else if (transitivity === 'intransitive') {
    const hasSelfIndicator = /\((?:on its own|self-occurring|to be opened|to be broken|to become)\)/i.test(clean) ||
      clean.toLowerCase().includes('self-occurring') ||
      clean.toLowerCase().includes('on its own');
    if (!hasSelfIndicator) {
      if (/^to\s+([a-z]+)/i.test(clean)) {
        clean = clean.replace(/^to\s+([a-z]+)/i, 'to $1 (on its own)');
      } else {
        clean = `${clean} (on its own) [self-occurring action]`;
      }
    }
  }

  return clean;
}

// Giving and receiving verbs
const GIVING_RECEIVING_LIST = new Set([
  'あげる', '上げる', 'くれる', 'もらう', '貰う', 'やる', '差し上げる', 'いただく', '頂く', 'くださる', '下さる'
]);

// Core N4 High-Frequency Verbs
const CORE_N4_VERBS = new Set([
  '伝える', '答える', '調べる', '考える', '決める', '送る', '手伝う', '知らせる',
  '案内する', '連絡する', '準備する', '注意する', '説明する', '受ける', '比べる',
  '乗り換える', '急ぐ', '通う', '払う', '選ぶ', '運ぶ', '慣れる', '迎える',
  '喜ぶ', '相談する', '約束する', '謝る', '頼む', '断る', '驚く'
]);

// High-Yield N5 Foundational Prerequisite Words
const CORE_N5_WORDS = new Set([
  '行く', '来る', '食べる', '飲む', '見る', '聞く', '読む', '書く', '買う', '話す',
  '会う', '待つ', '分かる', 'ある', 'いる', 'する', '言う', '教える', '勉強する',
  '学生', '先生', '友だち', '友達', '学校', '時間', '今日', '明日', '昨日',
  '大きい', '小さい', '高い', '新しい', 'いい', 'よい', '多い', '少ない', '近い', '遠い'
]);

/**
 * Parses a single CSV line with support for quoted strings and commas inside quotes
 */
export function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

/**
 * Corrects corrupted or dropped okurigana from raw source datasets
 * (e.g. older/improper entries like '落る' -> '落ちる', '落す' -> '落とす', '楽む' -> '楽しむ')
 * NEVER strips or trims trailing okurigana away from kanji stems.
 */
export function repairCorruptedOkurigana(rawExpression: string, reading?: string): string {
  if (!rawExpression) return '';
  const expr = rawExpression.trim();
  const rd = (reading || '').trim();

  // Known dictionary forms with corrupted okurigana in JLPT word lists
  if (expr === '落る' && (rd === 'おちる' || !rd)) return '落ちる';
  if (expr === '落す' && (rd === 'おとす' || !rd)) return '落とす';
  if (expr === '楽む' && (rd === 'たのしむ' || !rd)) return '楽しむ';
  if (expr === '曲る' && (rd === 'まがる' || !rd)) return '曲がる';
  if (expr === '終る' && (rd === 'おわる' || !rd)) return '終わる';
  if (expr === '下る' && rd === 'さがる') return '下がる';
  if (expr === '起る' && rd === 'おきる') return '起きる';
  if (expr === '受る' && rd === 'うける') return '受ける';
  if (expr === '消る' && rd === 'きえる') return '消える';
  if (expr === '変る' && rd === 'かわる') return '変わる';
  if (expr === '集る' && rd === 'あつまる') return '集まる';
  if (expr === '建る' && rd === 'たてる') return '建てる';
  if (expr === '生る' && rd === 'いきる') return '生きる';
  if (expr === '聞える' && rd === 'きこえる') return '聞こえる';
  if (expr === '見付かる' || expr === '見付る') return '見つかる';
  if (expr === '見付ける') return '見つける';

  return expr;
}

/**
 * Extracts a concise primary meaning slug for homophone disambiguation
 */
export function extractPrimaryMeaningSlug(meaning?: string): string {
  if (!meaning) return '';
  const firstGloss = meaning.split(/[;,(/]/)[0].trim().toLowerCase();
  const clean = firstGloss.replace(/^(to\s+|a\s+|the\s+)/i, '').trim();
  return clean.replace(/[^a-z0-9]+/g, '_').slice(0, 15);
}

/**
 * Generates an immutable unique word ID formatted strictly as:
 * `${kanji || reading}_${reading}_${meaning_slug}`
 */
export function generateWordId(kanjiOrExpr: string, reading: string, meaning?: string): string {
  const k = (kanjiOrExpr || reading || '').trim();
  const r = (reading || kanjiOrExpr || '').trim();
  const slug = extractPrimaryMeaningSlug(meaning);
  return slug ? `${k}_${r}_${slug}` : `${k}_${r}`;
}

/**
 * Generates unique, stable string IDs formatted like `jlpt_n4_落ちる_おちる`
 * to prevent localStorage merge collisions across sessions.
 */
export function generateCanonicalCardId(
  level: JLPTLevel,
  expression: string,
  reading: string,
  transitivity?: 'transitive' | 'intransitive',
  isPairWithSameKey = false,
  meaningSlug?: string
): string {
  const lvl = (level || 'N4').toLowerCase();
  const cleanExpr = expression.trim();
  const cleanReading = (reading || expression).trim();

  let id = `jlpt_${lvl}_${cleanExpr}_${cleanReading}`;
  if (isPairWithSameKey && transitivity) {
    id += `_${transitivity}`;
  }
  if (meaningSlug) {
    id += `_${meaningSlug}`;
  }
  return id;
}

/**
 * Merges two English definitions without duplicate sub-glosses
 */
export function mergeDefinitions(meaningA: string, meaningB: string): string {
  if (!meaningA) return meaningB || '';
  if (!meaningB) return meaningA || '';
  if (meaningA === meaningB) return meaningA;

  // Split both by semicolons or commas into individual glosses
  const glossesA = meaningA.split(/[;,]/).map((s) => s.trim()).filter(Boolean);
  const glossesB = meaningB.split(/[;,]/).map((s) => s.trim()).filter(Boolean);

  const seen = new Set<string>();
  const mergedGlosses: string[] = [];

  for (const gloss of [...glossesA, ...glossesB]) {
    const lower = gloss.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      mergedGlosses.push(gloss);
    }
  }

  return mergedGlosses.join(', ');
}

/**
 * Collapses duplicate cards into a single unified entry, merging meanings and preserving tags/examples
 */
export function collapseItems(items: VocabCardItem[]): VocabCardItem {
  if (items.length === 1) return { ...items[0] };

  // Pick best representative item (prefer curated fallback with exampleSentence or N4 level)
  const baseItem = items.find((i) => i.exampleSentence && i.level === 'N4') ||
    items.find((i) => i.exampleSentence) ||
    items.find((i) => i.level === 'N4') ||
    items[0];

  let mergedMeaning = baseItem.meaning;
  for (const item of items) {
    if (item !== baseItem) {
      mergedMeaning = mergeDefinitions(mergedMeaning, item.meaning);
    }
  }

  const tagSet = new Set<string>();
  for (const item of items) {
    (item.tags || []).forEach((t) => tagSet.add(t));
  }

  const bestExample = items.find((i) => i.exampleSentence)?.exampleSentence;

  return {
    ...baseItem,
    meaning: mergedMeaning,
    tags: Array.from(tagSet),
    exampleSentence: bestExample,
  };
}

/**
 * Smart Deck Normalization & Deduplication Pass:
 * 1. Repairs corrupted okurigana and detects transitive/intransitive traits.
 * 2. Keys each card by `kanji + reading`.
 * 3. IF duplicate entries have identical kanji AND reading:
 *    - Check if one is Transitive (他動詞) and the other is Intransitive (自動詞).
 *      IF YES, keep BOTH as distinct cards with their respective verb badges and non-colliding IDs.
 *    - IF NO (pure identical duplicates): Collapse them into a single card,
 *      merging any unique English definitions or example sentences into one entry.
 * 4. Ensures unique string IDs (e.g., `jlpt_n4_落ちる_おちる`).
 */
export function deduplicateAndNormalizeDeck(rawItems: VocabCardItem[]): VocabCardItem[] {
  // Pass 1: Okurigana repair and transitivity detection
  const normalizedItems: VocabCardItem[] = rawItems.map((raw) => {
    const reading = (raw.reading || raw.expression || '').trim();
    const expression = repairCorruptedOkurigana(raw.expression || '', reading);

    let transitivity = raw.transitivity;
    let category = raw.category;
    let pairNote = raw.pairNote;
    let meaning = raw.meaning;
    let exampleSentence = raw.exampleSentence;

    const pair = findVerbPair(expression, reading, raw.meaning);
    if (pair) {
      if (raw.transitivity && raw.transitivity !== pair.type) {
        transitivity = raw.transitivity;
        category = raw.transitivity === 'transitive' ? '他動詞 (Transitive Verb)' : '自動詞 (Intransitive Verb)';
        meaning = formatNuancedDefinition(raw.meaning, raw.transitivity, expression);
      } else {
        transitivity = pair.type;
        category = 'Transitive / Intransitive Pair';
        const typeLabel = pair.type === 'transitive' ? '他動詞 (Transitive)' : '自動詞 (Intransitive)';
        const partnerLabel = pair.type === 'transitive' ? '自動詞' : '他動詞';
        pairNote = `${typeLabel} ↔ ${partnerLabel}: ${pair.partner} (${pair.partnerReading})`;
        if (expression in VERB_PAIRS_MAP) {
          if (!raw.meaning || pair.nuancedMeaning.toLowerCase().includes(raw.meaning.toLowerCase())) {
            meaning = pair.nuancedMeaning;
          } else {
            meaning = mergeDefinitions(pair.nuancedMeaning, raw.meaning);
          }
        } else {
          meaning = raw.meaning || pair.nuancedMeaning;
        }
        if (!exampleSentence && pair.exampleSentence) {
          exampleSentence = pair.exampleSentence;
        }
      }
    } else {
      const hasTransTag = (raw.tags || []).some((t) => /transitive|他動詞/i.test(t)) ||
        /\(v\.?t\.?\)/i.test(raw.meaning) ||
        /\(vt\)/i.test(raw.meaning);
      const hasIntransTag = (raw.tags || []).some((t) => /intransitive|自動詞/i.test(t)) ||
        /\(v\.?i\.?\)/i.test(raw.meaning) ||
        /\(vi\)/i.test(raw.meaning);

      if (hasTransTag && !hasIntransTag) {
        transitivity = 'transitive';
        meaning = formatNuancedDefinition(raw.meaning, 'transitive', expression);
        category = category || '他動詞 (Transitive Verb)';
      } else if (hasIntransTag && !hasTransTag) {
        transitivity = 'intransitive';
        meaning = formatNuancedDefinition(raw.meaning, 'intransitive', expression);
        category = category || '自動詞 (Intransitive Verb)';
      } else if (transitivity) {
        meaning = formatNuancedDefinition(raw.meaning, transitivity, expression);
      }
    }

    return {
      ...raw,
      expression,
      reading,
      transitivity,
      category,
      pairNote,
      meaning,
      exampleSentence,
    };
  });

  // Pass 2: Group by `kanji + reading` (plus meaningSlug for pure kana homophones)
  const groups = new Map<string, VocabCardItem[]>();
  for (const item of normalizedItems) {
    const hasKanji = /[\u4e00-\u9faf]/.test(item.expression);
    const meaningSlug = !hasKanji ? extractPrimaryMeaningSlug(item.meaning) : '';
    const key = meaningSlug ? `${item.expression}:${item.reading}:${meaningSlug}` : `${item.expression}:${item.reading}`;
    const list = groups.get(key) || [];
    list.push(item);
    groups.set(key, list);
  }

  // Pass 3: Deduplicate / collapse
  const result: VocabCardItem[] = [];

  for (const [, items] of groups.entries()) {
    if (items.length === 1) {
      const single = items[0];
      const id = generateCanonicalCardId(single.level, single.expression, single.reading, single.transitivity, false);
      result.push({ ...single, id });
      continue;
    }

    // Check if one is Transitive and the other is Intransitive
    const transItems = items.filter((i) => i.transitivity === 'transitive');
    const intransItems = items.filter((i) => i.transitivity === 'intransitive');
    const hasBothPairs = transItems.length > 0 && intransItems.length > 0;

    if (hasBothPairs) {
      // Keep BOTH as distinct cards with their respective verb badges!
      const mergedTrans = collapseItems(transItems);
      mergedTrans.id = generateCanonicalCardId(mergedTrans.level, mergedTrans.expression, mergedTrans.reading, 'transitive', true);
      result.push(mergedTrans);

      const mergedIntrans = collapseItems(intransItems);
      mergedIntrans.id = generateCanonicalCardId(mergedIntrans.level, mergedIntrans.expression, mergedIntrans.reading, 'intransitive', true);
      result.push(mergedIntrans);

      // If any other untagged items exist in group, merge their meanings into both
      const others = items.filter((i) => i.transitivity !== 'transitive' && i.transitivity !== 'intransitive');
      for (const other of others) {
        mergedTrans.meaning = mergeDefinitions(mergedTrans.meaning, other.meaning);
        mergedIntrans.meaning = mergeDefinitions(mergedIntrans.meaning, other.meaning);
      }
    } else {
      // Pure duplicates: collapse into a single card
      const collapsed = collapseItems(items);
      collapsed.id = generateCanonicalCardId(collapsed.level, collapsed.expression, collapsed.reading, collapsed.transitivity, false);
      result.push(collapsed);
    }
  }

  return result;
}

/**
 * Parses raw CSV text into VocabCardItem array
 */
export function parseCSVToVocab(csvText: string, level: JLPTLevel): VocabCardItem[] {
  const lines = csvText.trim().split(/\r?\n/);
  if (lines.length < 2) return [];

  const items: VocabCardItem[] = [];
  // Skip header: expression,reading,meaning,tags
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = parseCSVLine(line);
    if (parts.length < 3) continue;

    const rawExpression = parts[0].trim();
    const reading = (parts[1] || rawExpression).trim();
    const expression = repairCorruptedOkurigana(rawExpression, reading);
    const meaning = parts[2].trim();
    const rawTags = parts[3] ? parts[3].split(' ').filter(Boolean) : [];

    items.push({
      id: generateCanonicalCardId(level, expression, reading),
      expression,
      reading,
      meaning,
      level,
      tags: rawTags,
      priority: 9999, // Assigned during ranking
    });
  }

  return items;
}

/**
 * Parses JSON word list format if available
 */
export function parseJSONToVocab(jsonData: any[], level: JLPTLevel): VocabCardItem[] {
  if (!Array.isArray(jsonData)) return [];

  return jsonData.map((item) => {
    const rawExpression = (item.word || item.expression || item.kanji || '').trim();
    const reading = (item.reading || item.hiragana || rawExpression).trim();
    const expression = repairCorruptedOkurigana(rawExpression, reading);
    const meaning = (item.meaning || item.english || '').trim();
    const tags = Array.isArray(item.tags) ? item.tags : [];

    return {
      id: generateCanonicalCardId(level, expression, reading),
      expression,
      reading,
      meaning,
      level,
      tags,
      priority: 9999,
    };
  }).filter((i) => i.expression && i.meaning);
}

/**
 * Priority and Frequency Ranking Algorithm:
 * Sorts and prioritizes vocabulary according to JLPT exam frequency presence:
 * 1. Core N4 Transitive / Intransitive pairs & Giving/Receiving verbs at the very top.
 * 2. Core N4 High-Frequency verbs, functional expressions, and key nouns.
 * 3. High-Yield N5 foundational words directly after to reinforce core prerequisites.
 * 4. General N4 words.
 * 5. General N5 words.
 */
export function rankAndEnrichVocab(rawItems: VocabCardItem[]): VocabCardItem[] {
  // Step 1: Smart deck normalization, okurigana repair, and deduplication
  const items = deduplicateAndNormalizeDeck(rawItems);

  // Step 2: Score each item for exam frequency presence
  const scoredItems = items.map((item) => {
    let score = 500; // Base score
    let category = item.category;
    let pairNote = item.pairNote;
    let transitivity = item.transitivity;
    let meaning = item.meaning;
    let exampleSentence = item.exampleSentence;

    let pairId = item.pairId;
    let relatedId = item.relatedId;

    // Check if Transitive / Intransitive pair via robust lookup (handling kanji, kana, and homographs)
    const pair = findVerbPair(item.expression, item.reading, item.meaning);
    if (pair) {
      score = 20; // Highest tier
      category = 'Transitive / Intransitive Pair';
      transitivity = pair.type;
      const sorted = [item.expression, pair.partner].sort();
      pairId = pairId || `pair_${sorted[0]}_${sorted[1]}`;

      // Nuanced English definition:
      if (!meaning || meaning === item.expression || pair.nuancedMeaning.toLowerCase().includes(meaning.toLowerCase())) {
        meaning = pair.nuancedMeaning;
      } else if (item.expression in VERB_PAIRS_MAP) {
        meaning = mergeDefinitions(pair.nuancedMeaning, meaning);
      } else {
        meaning = formatNuancedDefinition(meaning, pair.type, item.expression);
      }

      const typeLabel = pair.type === 'transitive' ? '他動詞 (Transitive)' : '自動詞 (Intransitive)';
      const partnerLabel = pair.type === 'transitive' ? '自動詞' : '他動詞';
      pairNote = `${typeLabel} ↔ ${partnerLabel}: ${pair.partner} (${pair.partnerReading})`;

      // Immutable Field Binding: Never overwrite an existing bound exampleSentence
      if (!exampleSentence && pair.exampleSentence) {
        exampleSentence = pair.exampleSentence;
      }
    } else {
      // Check if CSV/JSON tags or meaning denote transitivity for other verbs
      const hasTransTag = item.tags.some((t) => /transitive|他動詞/i.test(t)) ||
        /\(v\.?t\.?\)/i.test(item.meaning) ||
        /\(vt\)/i.test(item.meaning);
      const hasIntransTag = item.tags.some((t) => /intransitive|自動詞/i.test(t)) ||
        /\(v\.?i\.?\)/i.test(item.meaning) ||
        /\(vi\)/i.test(item.meaning);

      if (hasTransTag && !hasIntransTag) {
        transitivity = 'transitive';
        meaning = formatNuancedDefinition(item.meaning, 'transitive', item.expression);
        category = category || '他動詞 (Transitive Verb)';
      } else if (hasIntransTag && !hasTransTag) {
        transitivity = 'intransitive';
        meaning = formatNuancedDefinition(item.meaning, 'intransitive', item.expression);
        category = category || '自動詞 (Intransitive Verb)';
      } else if (transitivity) {
        // Ensure any pre-tagged verb reflects the nuanced definition
        meaning = formatNuancedDefinition(meaning, transitivity, item.expression);
      }

      if (transitivity && !pairId) {
        const kanjiMatches = item.expression.match(/[\u4e00-\u9faf]/g);
        if (kanjiMatches && kanjiMatches.length > 0) {
          pairId = `pair_kanji_${kanjiMatches.join('')}`;
        }
      }
    }

    if (pair) {
      // Score already set to 20
    } else if (GIVING_RECEIVING_LIST.has(item.expression)) {
      score = 30; // Giving & Receiving verbs
      category = 'Giving & Receiving (授受動詞)';
    } else if (item.level === 'N4' && CORE_N4_VERBS.has(item.expression)) {
      score = 60; // Core N4 Verbs
      category = 'Core N4 Verb';
    } else if (item.level === 'N5' && CORE_N5_WORDS.has(item.expression)) {
      score = 120; // N5 Essential Prerequisites
      category = 'N5 Essential Prerequisite';
    } else if (item.level === 'N4') {
      // General N4 words
      score = 300;
    } else {
      // General N5 words
      score = 600;
    }

    // Secondary adjustments: shorter common words rank slightly higher
    if (item.expression.length <= 4) {
      score -= 5;
    }

    return {
      item: {
        ...item,
        category,
        pairNote,
        transitivity,
        pairId,
        relatedId,
        meaning,
        exampleSentence,
      },
      score,
    };
  });

  // Sort by score ascending (lowest score = highest priority rank)
  scoredItems.sort((a, b) => a.score - b.score);

  // Step 3: Link relatedId across the deck for cards sharing a pairId
  const pairGroups = new Map<string, VocabCardItem[]>();
  for (const entry of scoredItems) {
    if (entry.item.pairId) {
      const list = pairGroups.get(entry.item.pairId) || [];
      list.push(entry.item);
      pairGroups.set(entry.item.pairId, list);
    }
  }

  for (const [, pairList] of pairGroups) {
    if (pairList.length >= 2) {
      for (const card of pairList) {
        const partner = pairList.find((p) => p.id !== card.id && p.transitivity !== card.transitivity) ||
          pairList.find((p) => p.id !== card.id);
        if (partner) {
          card.relatedId = partner.id;
        }
      }
    }
  }

  // Assign clean sequential 1-based priority index
  return scoredItems.map((entry, index) => ({
    ...entry.item,
    priority: index + 1,
  }));
}

/**
 * Fetches and merges both JLPT N5 and N4 lists with frequency sorting and multi-stage fallback.
 */
export async function fetchUnifiedDeck(): Promise<FetchResult> {
  const JSON_N5_URL = 'https://raw.githubusercontent.com/elzup/jlpt-word-list/master/json/n5.json';
  const JSON_N4_URL = 'https://raw.githubusercontent.com/elzup/jlpt-word-list/master/json/n4.json';

  const CSV_N5_URL = 'https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n5.csv';
  const CSV_N4_URL = 'https://raw.githubusercontent.com/elzup/jlpt-word-list/master/src/n4.csv';

  // Step 1: Attempt JSON fetch
  try {
    const [resN5, resN4] = await Promise.all([
      fetch(JSON_N5_URL, { cache: 'default' }),
      fetch(JSON_N4_URL, { cache: 'default' }),
    ]);

    if (resN5.ok && resN4.ok) {
      const dataN5 = await resN5.json();
      const dataN4 = await resN4.json();

      const itemsN5 = parseJSONToVocab(dataN5, 'N5');
      const itemsN4 = parseJSONToVocab(dataN4, 'N4');

      if (itemsN5.length > 0 || itemsN4.length > 0) {
        const merged = rankAndEnrichVocab([...FALLBACK_VOCAB_DATA, ...itemsN4, ...itemsN5]);
        return {
          items: merged,
          status: 'synced-json',
          statusMessage: `${merged.length} words loaded from JSON`,
        };
      }
    }
  } catch (err) {
    // Continue to CSV fallback
  }

  // Step 2: Attempt CSV fetch (the actual format hosted in elzup/jlpt-word-list)
  try {
    const [resN5CSV, resN4CSV] = await Promise.all([
      fetch(CSV_N5_URL, { cache: 'default' }),
      fetch(CSV_N4_URL, { cache: 'default' }),
    ]);

    if (resN5CSV.ok && resN4CSV.ok) {
      const textN5 = await resN5CSV.text();
      const textN4 = await resN4CSV.text();

      const itemsN5 = parseCSVToVocab(textN5, 'N5');
      const itemsN4 = parseCSVToVocab(textN4, 'N4');

      if (itemsN5.length > 0 || itemsN4.length > 0) {
        // Merge with our rich curated fallback items for instant example sentences
        const merged = rankAndEnrichVocab([...FALLBACK_VOCAB_DATA, ...itemsN4, ...itemsN5]);
        return {
          items: merged,
          status: 'synced-csv',
          statusMessage: `${merged.length} words synced (N5 + N4)`,
        };
      }
    }
  } catch (err) {
    // Network or CORS failure
  }

  // Step 3: Graceful fallback to built-in high-frequency dataset
  const fallbackRanked = rankAndEnrichVocab(FALLBACK_VOCAB_DATA);
  return {
    items: fallbackRanked,
    status: 'fallback',
    statusMessage: `Offline Mode (${fallbackRanked.length} high-frequency words)`,
  };
}
