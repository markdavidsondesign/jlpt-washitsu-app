export interface KanjiComponent {
  char: string;
  meaning: string;
}

export interface KanjiDecomposition {
  kanji: string;
  components: KanjiComponent[];
}

/**
 * Master dictionary of JLPT N5 and N4 kanji mapped to their constituent radicals and sub-elements.
 * Decomposes characters into meaningful sub-radicals rather than just single primary radicals.
 * Example: 語 -> 言 (speech), 五 (five), 口 (mouth)
 *          病 -> 疒 (sickness), 丙 (third rank)
 *          院 -> 阝 (hill / mound), 宀 (roof), 元 (origin)
 */
export const KANJI_DECOMPOSITION_MAP: Record<string, KanjiComponent[]> = {
  // --- N4/N5 Core Verbs & Compounds ---
  '語': [
    { char: '言', meaning: 'speech' },
    { char: '五', meaning: 'five' },
    { char: '口', meaning: 'mouth' },
  ],
  '話': [
    { char: '言', meaning: 'speech' },
    { char: '舌', meaning: 'tongue' },
  ],
  '読': [
    { char: '言', meaning: 'speech' },
    { char: '売', meaning: 'sell' },
  ],
  '計': [
    { char: '言', meaning: 'speech' },
    { char: '十', meaning: 'ten' },
  ],
  '記': [
    { char: '言', meaning: 'speech' },
    { char: '己', meaning: 'oneself' },
  ],
  '試': [
    { char: '言', meaning: 'speech' },
    { char: '式', meaning: 'ceremony' },
  ],
  '説': [
    { char: '言', meaning: 'speech' },
    { char: '兑', meaning: 'exchange' },
  ],
  '調': [
    { char: '言', meaning: 'speech' },
    { char: '周', meaning: 'circuit' },
  ],
  '談': [
    { char: '言', meaning: 'speech' },
    { char: '炎', meaning: 'flame' },
  ],
  '信': [
    { char: '亻', meaning: 'person' },
    { char: '言', meaning: 'speech' },
  ],

  // --- 門 Gate Family ---
  '開': [
    { char: '門', meaning: 'gate' },
    { char: '开', meaning: 'hands opening' },
  ],
  '閉': [
    { char: '門', meaning: 'gate' },
    { char: '才', meaning: 'talent / bar' },
  ],
  '聞': [
    { char: '門', meaning: 'gate' },
    { char: '耳', meaning: 'ear' },
  ],
  '間': [
    { char: '門', meaning: 'gate' },
    { char: '日', meaning: 'sun' },
  ],
  '問': [
    { char: '門', meaning: 'gate' },
    { char: '口', meaning: 'mouth' },
  ],

  // --- Sickness & Health ---
  '病': [
    { char: '疒', meaning: 'sickness' },
    { char: '丙', meaning: 'third rank' },
  ],
  '院': [
    { char: '阝', meaning: 'hill / mound' },
    { char: '宀', meaning: 'roof' },
    { char: '元', meaning: 'origin' },
  ],
  '痛': [
    { char: '疒', meaning: 'sickness' },
    { char: '甬', meaning: 'path / bell' },
  ],
  '疲': [
    { char: '疒', meaning: 'sickness' },
    { char: '皮', meaning: 'skin' },
  ],
  '薬': [
    { char: '艹', meaning: 'grass / plant' },
    { char: '白', meaning: 'white' },
    { char: '木', meaning: 'tree' },
  ],
  '医': [
    { char: '匚', meaning: 'box' },
    { char: '矢', meaning: 'arrow' },
  ],

  // --- Action Verbs & Okurigana Roots ---
  '落': [
    { char: '艹', meaning: 'grass / plant' },
    { char: '氵', meaning: 'water' },
    { char: '各', meaning: 'each' },
  ],
  '飲': [
    { char: '飠', meaning: 'food / eat' },
    { char: '欠', meaning: 'lack / yawn' },
  ],
  '食': [
    { char: '人', meaning: 'person' },
    { char: '良', meaning: 'good' },
  ],
  '飯': [
    { char: '飠', meaning: 'food' },
    { char: '反', meaning: 'opposite' },
  ],
  '館': [
    { char: '飠', meaning: 'food' },
    { char: '官', meaning: 'government' },
  ],
  '待': [
    { char: '彳', meaning: 'step' },
    { char: '寺', meaning: 'temple' },
  ],
  '持': [
    { char: '扌', meaning: 'hand' },
    { char: '寺', meaning: 'temple' },
  ],
  '電': [
    { char: '雨', meaning: 'rain' },
    { char: '申', meaning: 'lightning' },
  ],
  '勉': [
    { char: '免', meaning: 'dismiss' },
    { char: '力', meaning: 'power' },
  ],
  '強': [
    { char: '弓', meaning: 'bow' },
    { char: '厶', meaning: 'private' },
    { char: '虫', meaning: 'insect' },
  ],
  '点': [
    { char: '占', meaning: 'divination' },
    { char: '灬', meaning: 'fire' },
  ],
  '漬': [
    { char: '氵', meaning: 'water' },
    { char: '責', meaning: 'liability / cost' },
  ],
  '付': [
    { char: '亻', meaning: 'person' },
    { char: '寸', meaning: 'hand / inch' },
  ],
  '競': [
    { char: '立', meaning: 'stand' },
    { char: '兄', meaning: 'elder brother' },
  ],
  '斬': [
    { char: '車', meaning: 'cart' },
    { char: '斤', meaning: 'axe' },
  ],
  '泊': [
    { char: '氵', meaning: 'water' },
    { char: '白', meaning: 'white' },
  ],
  '測': [
    { char: '氵', meaning: 'water' },
    { char: '貝', meaning: 'shell / money' },
    { char: '刂', meaning: 'knife' },
  ],
  '量': [
    { char: '日', meaning: 'sun' },
    { char: '一', meaning: 'one' },
    { char: '里', meaning: 'village' },
  ],
  '揚': [
    { char: '扌', meaning: 'hand' },
    { char: '日', meaning: 'sun' },
    { char: '勿', meaning: 'not' },
  ],
  '挙': [
    { char: '⺌', meaning: 'sparks' },
    { char: '手', meaning: 'hand' },
  ],
  '居': [
    { char: '尸', meaning: 'shelter' },
    { char: '古', meaning: 'old' },
  ],
  '要': [
    { char: '覀', meaning: 'cover' },
    { char: '女', meaning: 'woman' },
  ],
  '会': [
    { char: '人', meaning: 'person' },
    { char: '二', meaning: 'two' },
    { char: '厶', meaning: 'private' },
  ],
  '社': [
    { char: '礻', meaning: 'altar / spirit' },
    { char: '土', meaning: 'earth' },
  ],
  '校': [
    { char: '木', meaning: 'tree' },
    { char: '交', meaning: 'intersect' },
  ],
  '新': [
    { char: '立', meaning: 'stand' },
    { char: '木', meaning: 'tree' },
    { char: '斤', meaning: 'axe' },
  ],
  '働': [
    { char: '亻', meaning: 'person' },
    { char: '重', meaning: 'heavy' },
    { char: '力', meaning: 'power' },
  ],
  '作': [
    { char: '亻', meaning: 'person' },
    { char: '乍', meaning: 'suddenly' },
  ],
  '買': [
    { char: '罒', meaning: 'net' },
    { char: '貝', meaning: 'shell / money' },
  ],
  '売': [
    { char: '士', meaning: 'samurai' },
    { char: '冖', meaning: 'cover' },
    { char: '儿', meaning: 'legs' },
  ],
  '時': [
    { char: '日', meaning: 'sun' },
    { char: '寺', meaning: 'temple' },
  ],
  '休': [
    { char: '亻', meaning: 'person' },
    { char: '木', meaning: 'tree' },
  ],
  '体': [
    { char: '亻', meaning: 'person' },
    { char: '本', meaning: 'book / origin' },
  ],
  '明': [
    { char: '日', meaning: 'sun' },
    { char: '月', meaning: 'moon' },
  ],
  '暗': [
    { char: '日', meaning: 'sun' },
    { char: '音', meaning: 'sound' },
  ],
  '音': [
    { char: '立', meaning: 'stand' },
    { char: '日', meaning: 'sun' },
  ],
  '楽': [
    { char: '白', meaning: 'white' },
    { char: '木', meaning: 'tree' },
  ],
  '理': [
    { char: '王', meaning: 'jewel / king' },
    { char: '里', meaning: 'village' },
  ],
  '意': [
    { char: '音', meaning: 'sound' },
    { char: '心', meaning: 'heart' },
  ],
  '味': [
    { char: '口', meaning: 'mouth' },
    { char: '未', meaning: 'not yet' },
  ],
  '町': [
    { char: '田', meaning: 'field' },
    { char: '丁', meaning: 'street' },
  ],
  '店': [
    { char: '广', meaning: 'shelter' },
    { char: '占', meaning: 'divination' },
  ],
  '駅': [
    { char: '馬', meaning: 'horse' },
    { char: '尺', meaning: 'ruler' },
  ],
  '銀': [
    { char: '釒', meaning: 'metal / gold' },
    { char: '艮', meaning: 'stopping' },
  ],
  '空': [
    { char: '穴', meaning: 'cave' },
    { char: '工', meaning: 'craft' },
  ],
  '道': [
    { char: '辶', meaning: 'road' },
    { char: '首', meaning: 'head' },
  ],
  '通': [
    { char: '辶', meaning: 'road' },
    { char: '甬', meaning: 'path' },
  ],
  '近': [
    { char: '辶', meaning: 'road' },
    { char: '斤', meaning: 'axe' },
  ],
  '遠': [
    { char: '辶', meaning: 'road' },
    { char: '袁', meaning: 'robe' },
  ],
  '運': [
    { char: '辶', meaning: 'road' },
    { char: '軍', meaning: 'army' },
  ],
  '週': [
    { char: '辶', meaning: 'road' },
    { char: '周', meaning: 'circuit' },
  ],
  '進': [
    { char: '辶', meaning: 'road' },
    { char: '隹', meaning: 'bird' },
  ],
  '返': [
    { char: '辶', meaning: 'road' },
    { char: '反', meaning: 'return' },
  ],
  '送': [
    { char: '辶', meaning: 'road' },
    { char: '关', meaning: 'barrier' },
  ],
  '迎': [
    { char: '辶', meaning: 'road' },
    { char: '卬', meaning: 'look up' },
  ],
  '達': [
    { char: '辶', meaning: 'road' },
    { char: '幸', meaning: 'fortune' },
  ],
  '起': [
    { char: '走', meaning: 'run' },
    { char: '己', meaning: 'oneself' },
  ],
  '教': [
    { char: '孝', meaning: 'filial' },
    { char: '攵', meaning: 'action' },
  ],
  '室': [
    { char: '宀', meaning: 'roof' },
    { char: '至', meaning: 'arrive' },
  ],
  '家': [
    { char: '宀', meaning: 'roof' },
    { char: '豕', meaning: 'pig' },
  ],
  '安': [
    { char: '宀', meaning: 'roof' },
    { char: '女', meaning: 'woman' },
  ],
  '宿': [
    { char: '宀', meaning: 'roof' },
    { char: '亻', meaning: 'person' },
    { char: '百', meaning: 'hundred' },
  ],
  '定': [
    { char: '宀', meaning: 'roof' },
    { char: '疋', meaning: 'foot' },
  ],
  '思': [
    { char: '田', meaning: 'field / brain' },
    { char: '心', meaning: 'heart' },
  ],
  '知': [
    { char: '矢', meaning: 'arrow' },
    { char: '口', meaning: 'mouth' },
  ],
  '考': [
    { char: '耂', meaning: 'elder' },
    { char: '丂', meaning: 'breath' },
  ],
  '古': [
    { char: '十', meaning: 'ten' },
    { char: '口', meaning: 'mouth' },
  ],
  '友': [
    { char: '𠂇', meaning: 'hand' },
    { char: '又', meaning: 'again' },
  ],
  '名': [
    { char: '夕', meaning: 'evening' },
    { char: '口', meaning: 'mouth' },
  ],
  '外': [
    { char: '夕', meaning: 'evening' },
    { char: '卜', meaning: 'divination' },
  ],
  '多': [
    { char: '夕', meaning: 'evening' },
    { char: '夕', meaning: 'evening' },
  ],
  '早': [
    { char: '日', meaning: 'sun' },
    { char: '十', meaning: 'ten' },
  ],
  '兄': [
    { char: '口', meaning: 'mouth' },
    { char: '儿', meaning: 'legs' },
  ],
  '姉': [
    { char: '女', meaning: 'woman' },
    { char: '市', meaning: 'market' },
  ],
  '妹': [
    { char: '女', meaning: 'woman' },
    { char: '未', meaning: 'not yet' },
  ],
  '男': [
    { char: '田', meaning: 'rice field' },
    { char: '力', meaning: 'power' },
  ],
  '紙': [
    { char: '糹', meaning: 'silk / thread' },
    { char: '氏', meaning: 'clan' },
  ],
  '終': [
    { char: '糹', meaning: 'thread' },
    { char: '冬', meaning: 'winter' },
  ],
  '続': [
    { char: '糹', meaning: 'thread' },
    { char: '売', meaning: 'sell' },
  ],
  '結': [
    { char: '糹', meaning: 'thread' },
    { char: '吉', meaning: 'good luck' },
  ],
  '始': [
    { char: '女', meaning: 'woman' },
    { char: '台', meaning: 'platform' },
  ],
  '好': [
    { char: '女', meaning: 'woman' },
    { char: '子', meaning: 'child' },
  ],
  '晴': [
    { char: '日', meaning: 'sun' },
    { char: '青', meaning: 'blue' },
  ],
  '雲': [
    { char: '雨', meaning: 'rain' },
    { char: '云', meaning: 'cloud' },
  ],
  '雪': [
    { char: '雨', meaning: 'rain' },
    { char: '彐', meaning: 'hand' },
  ],
  '青': [
    { char: '龶', meaning: 'sprout' },
    { char: '月', meaning: 'moon' },
  ],
  '黒': [
    { char: '里', meaning: 'village' },
    { char: '灬', meaning: 'fire' },
  ],
  '赤': [
    { char: '土', meaning: 'earth' },
    { char: '儿', meaning: 'legs' },
  ],
  '洗': [
    { char: '氵', meaning: 'water' },
    { char: '先', meaning: 'previous' },
  ],
  '海': [
    { char: '氵', meaning: 'water' },
    { char: '每', meaning: 'every' },
  ],
  '池': [
    { char: '氵', meaning: 'water' },
    { char: '也', meaning: 'snake' },
  ],
  '洋': [
    { char: '氵', meaning: 'water' },
    { char: '羊', meaning: 'sheep' },
  ],
  '消': [
    { char: '氵', meaning: 'water' },
    { char: '肖', meaning: 'resemble' },
  ],
  '漢': [
    { char: '氵', meaning: 'water' },
    { char: '艹', meaning: 'grass' },
    { char: '口', meaning: 'mouth' },
    { char: '夫', meaning: 'man' },
  ],
  '字': [
    { char: '宀', meaning: 'roof' },
    { char: '子', meaning: 'child' },
  ],
  '林': [
    { char: '木', meaning: 'tree' },
    { char: '木', meaning: 'tree' },
  ],
  '森': [
    { char: '木', meaning: 'tree' },
    { char: '木', meaning: 'tree' },
    { char: '木', meaning: 'tree' },
  ],
  '花': [
    { char: '艹', meaning: 'grass / flower' },
    { char: '化', meaning: 'transform' },
  ],
  '英': [
    { char: '艹', meaning: 'grass' },
    { char: '央', meaning: 'center' },
  ],
  '国': [
    { char: '囗', meaning: 'enclosure' },
    { char: '玉', meaning: 'jade' },
  ],
  '園': [
    { char: '囗', meaning: 'enclosure' },
    { char: '袁', meaning: 'robe' },
  ],
  '図': [
    { char: '囗', meaning: 'enclosure' },
    { char: '冬', meaning: 'winter' },
  ],
  '回': [
    { char: '囗', meaning: 'enclosure' },
    { char: '口', meaning: 'mouth' },
  ],
  '困': [
    { char: '囗', meaning: 'enclosure' },
    { char: '木', meaning: 'tree' },
  ],
  '広': [
    { char: '广', meaning: 'shelter' },
    { char: '厶', meaning: 'private' },
  ],
  '度': [
    { char: '广', meaning: 'shelter' },
    { char: '廿', meaning: 'twenty' },
    { char: '又', meaning: 'hand' },
  ],
  '席': [
    { char: '广', meaning: 'shelter' },
    { char: '巾', meaning: 'cloth' },
  ],
  '庭': [
    { char: '广', meaning: 'shelter' },
    { char: '廷', meaning: 'court' },
  ],
  '急': [
    { char: '⺈', meaning: 'bound' },
    { char: '彐', meaning: 'hand' },
    { char: '心', meaning: 'heart' },
  ],
  '忘': [
    { char: '亡', meaning: 'perish' },
    { char: '心', meaning: 'heart' },
  ],
  '忙': [
    { char: '忄', meaning: 'heart' },
    { char: '亡', meaning: 'perish' },
  ],
  '切': [
    { char: '七', meaning: 'seven' },
    { char: '刀', meaning: 'knife' },
  ],
  '分': [
    { char: '八', meaning: 'divide' },
    { char: '刀', meaning: 'knife' },
  ],
  '別': [
    { char: '口', meaning: 'mouth' },
    { char: '刂', meaning: 'knife' },
  ],
  '利': [
    { char: '禾', meaning: 'grain' },
    { char: '刂', meaning: 'knife' },
  ],
  '前': [
    { char: '䒑', meaning: 'horns' },
    { char: '月', meaning: 'moon' },
    { char: '刂', meaning: 'knife' },
  ],
  '歩': [
    { char: '止', meaning: 'stop' },
    { char: '少', meaning: 'few' },
  ],
  '走': [
    { char: '土', meaning: 'earth' },
    { char: '疋', meaning: 'foot' },
  ],
  '頭': [
    { char: '豆', meaning: 'bean' },
    { char: '頁', meaning: 'head' },
  ],
  '顔': [
    { char: '彦', meaning: 'scholar' },
    { char: '頁', meaning: 'head' },
  ],
  '題': [
    { char: '是', meaning: 'correct' },
    { char: '頁', meaning: 'head' },
  ],
  '写': [
    { char: '冖', meaning: 'cover' },
    { char: '与', meaning: 'give' },
  ],
  '真': [
    { char: '十', meaning: 'ten' },
    { char: '目', meaning: 'eye' },
    { char: '八', meaning: 'eight' },
  ],
  '貸': [
    { char: '代', meaning: 'substitute' },
    { char: '貝', meaning: 'shell / money' },
  ],
  '質': [
    { char: '斤', meaning: 'axe' },
    { char: '貝', meaning: 'shell / money' },
  ],
  '員': [
    { char: '口', meaning: 'mouth' },
    { char: '貝', meaning: 'shell / money' },
  ],
  '動': [
    { char: '重', meaning: 'heavy' },
    { char: '力', meaning: 'power' },
  ],
  '助': [
    { char: '且', meaning: 'furthermore' },
    { char: '力', meaning: 'power' },
  ],
  '借': [
    { char: '亻', meaning: 'person' },
    { char: '昔', meaning: 'past' },
  ],
  '使': [
    { char: '亻', meaning: 'person' },
    { char: '吏', meaning: 'officer' },
  ],
  '便': [
    { char: '亻', meaning: 'person' },
    { char: '更', meaning: 'renew' },
  ],
  '低': [
    { char: '亻', meaning: 'person' },
    { char: '氐', meaning: 'foundation' },
  ],
  '住': [
    { char: '亻', meaning: 'person' },
    { char: '主', meaning: 'master' },
  ],
  '何': [
    { char: '亻', meaning: 'person' },
    { char: '可', meaning: 'possible' },
  ],
  '押': [
    { char: '扌', meaning: 'hand' },
    { char: '甲', meaning: 'armor' },
  ],
  '拾': [
    { char: '扌', meaning: 'hand' },
    { char: '合', meaning: 'together' },
  ],
  '捨': [
    { char: '扌', meaning: 'hand' },
    { char: '舌', meaning: 'tongue' },
  ],
  '打': [
    { char: '扌', meaning: 'hand' },
    { char: '丁', meaning: 'nail' },
  ],
  '折': [
    { char: '扌', meaning: 'hand' },
    { char: '斤', meaning: 'axe' },
  ],
  '払': [
    { char: '扌', meaning: 'hand' },
    { char: '厶', meaning: 'private' },
  ],
  '抜': [
    { char: '扌', meaning: 'hand' },
    { char: '友', meaning: 'friend' },
  ],
  '配': [
    { char: '酉', meaning: 'wine' },
    { char: '己', meaning: 'oneself' },
  ],
  '酒': [
    { char: '氵', meaning: 'water' },
    { char: '酉', meaning: 'wine' },
  ],
  '降': [
    { char: '阝', meaning: 'hill / mound' },
    { char: '夅', meaning: 'descend' },
  ],
  '階': [
    { char: '阝', meaning: 'hill / mound' },
    { char: '皆', meaning: 'all' },
  ],
  '都': [
    { char: '者', meaning: 'person' },
    { char: '阝', meaning: 'town' },
  ],
  '部': [
    { char: '立', meaning: 'stand' },
    { char: '口', meaning: 'mouth' },
    { char: '阝', meaning: 'town' },
  ],
  '答': [
    { char: '竹', meaning: 'bamboo' },
    { char: '合', meaning: 'together' },
  ],
  '暑': [
    { char: '日', meaning: 'sun' },
    { char: '者', meaning: 'person' },
  ],
  '寒': [
    { char: '宀', meaning: 'roof' },
    { char: '井', meaning: 'well' },
    { char: '冫', meaning: 'ice' },
  ],
  '暖': [
    { char: '日', meaning: 'sun' },
    { char: '爰', meaning: 'hand / pull' },
  ],
  '涼': [
    { char: '氵', meaning: 'water' },
    { char: '京', meaning: 'capital' },
  ],
  '着': [
    { char: '羊', meaning: 'sheep' },
    { char: '目', meaning: 'eye' },
  ],
  '脱': [
    { char: '月', meaning: 'flesh' },
    { char: '兌', meaning: 'exchange' },
  ],
  '乗': [
    { char: '禾', meaning: 'grain' },
    { char: '北', meaning: 'north' },
  ],
  '重': [
    { char: '千', meaning: 'thousand' },
    { char: '里', meaning: 'village' },
  ],
  '軽': [
    { char: '車', meaning: 'cart' },
    { char: '圣', meaning: 'soil' },
  ],
  '短': [
    { char: '矢', meaning: 'arrow' },
    { char: '豆', meaning: 'bean' },
  ],
  '悪': [
    { char: '亜', meaning: 'inferior' },
    { char: '心', meaning: 'heart' },
  ],
  '正': [
    { char: '一', meaning: 'one' },
    { char: '止', meaning: 'stop' },
  ],
  '治': [
    { char: '氵', meaning: 'water' },
    { char: '台', meaning: 'platform' },
  ],
  '眠': [
    { char: '目', meaning: 'eye' },
    { char: '民', meaning: 'people' },
  ],
  '熱': [
    { char: '土', meaning: 'earth' },
    { char: '丸', meaning: 'round' },
    { char: '灬', meaning: 'fire' },
  ],
  '界': [
    { char: '田', meaning: 'field' },
    { char: '介', meaning: 'between' },
  ],
  '番': [
    { char: '釆', meaning: 'distinguish' },
    { char: '田', meaning: 'field' },
  ],
  '族': [
    { char: '方', meaning: 'direction' },
    { char: '矢', meaning: 'arrow' },
  ],
  '屋': [
    { char: '尸', meaning: 'shelter' },
    { char: '至', meaning: 'arrive' },
  ],
  '昼': [
    { char: '尺', meaning: 'ruler' },
    { char: '日', meaning: 'sun' },
  ],
  '験': [
    { char: '馬', meaning: 'horse' },
    { char: '僉', meaning: 'together' },
  ],
  '風': [
    { char: '几', meaning: 'wind enclosure' },
    { char: '虫', meaning: 'insect' },
  ],
  '朝': [
    { char: '十', meaning: 'ten' },
    { char: '日', meaning: 'sun' },
    { char: '月', meaning: 'moon' },
  ],
  '夜': [
    { char: '亠', meaning: 'lid' },
    { char: '亻', meaning: 'person' },
    { char: '夕', meaning: 'evening' },
  ],
  '親': [
    { char: '立', meaning: 'stand' },
    { char: '木', meaning: 'tree' },
    { char: '見', meaning: 'see' },
  ],
  '見': [
    { char: '目', meaning: 'eye' },
    { char: '儿', meaning: 'legs' },
  ],
  '覚': [
    { char: '⺍', meaning: 'sparks' },
    { char: '冖', meaning: 'crown' },
    { char: '見', meaning: 'see' },
  ],
  '死': [
    { char: '一', meaning: 'one' },
    { char: '夕', meaning: 'evening' },
    { char: '匕', meaning: 'spoon' },
  ],
  '曲': [
    { char: '日', meaning: 'sun' },
    { char: '丨', meaning: 'vertical' },
  ],
  '止': [], // Single-element primitive
  '車': [], // Single-element primitive
  '生': [], // Single-element primitive
  '日': [], // Single-element primitive
  '月': [], // Single-element primitive
  '木': [], // Single-element primitive
  '火': [], // Single-element primitive
  '水': [], // Single-element primitive
  '土': [], // Single-element primitive
  '山': [], // Single-element primitive
  '川': [], // Single-element primitive
  '人': [], // Single-element primitive
  '手': [], // Single-element primitive
  '目': [], // Single-element primitive
  '耳': [], // Single-element primitive
  '口': [], // Single-element primitive
  '子': [], // Single-element primitive
  '女': [], // Single-element primitive
  '力': [], // Single-element primitive
};

/**
 * Common radicals detector for fallback parsing when a kanji is not in the explicit map.
 */
const RADICAL_PATTERNS: Array<{ radical: string; meaning: string; test: RegExp }> = [
  { radical: '氵', meaning: 'water', test: /[氵海池洗酒洋波消治浮深港泳]/ },
  { radical: '扌', meaning: 'hand', test: /[扌持打押拾捨折払抜技招授]/ },
  { radical: '亻', meaning: 'person', test: /[亻休体作働借使便低住信何代化]/ },
  { radical: '門', meaning: 'gate', test: /[門開閉聞間問関閣]/ },
  { radical: '辶', meaning: 'road / walk', test: /[辶道通近遠運週進返送迎達遅]/ },
  { radical: '宀', meaning: 'roof', test: /[宀家安宿定室字密容宴富]/ },
  { radical: '艹', meaning: 'grass / plant', test: /[艹落薬花英苦若草荷茶菜]/ },
  { radical: '言', meaning: 'speech', test: /[言語話読計記試説調談認誕]/ },
  { radical: '糹', meaning: 'thread', test: /[糸糹紙終続結約給線練組]/ },
  { radical: '飠', meaning: 'food', test: /[食飠飲飯館飼餓]/ },
  { radical: '釒', meaning: 'metal / gold', test: /[金釒銀鉄銭鏡針銘]/ },
  { radical: '疒', meaning: 'sickness', test: /[疒病痛疲疾症痛痴]/ },
  { radical: '阝', meaning: 'hill / town', test: /[阝院降階都部院防陸陽際]/ },
  { radical: '雨', meaning: 'rain', test: /[雨電雲雪雷震霧露]/ },
  { radical: '心', meaning: 'heart', test: /[心忄思意急忘忙悪恐息悲]/ },
  { radical: '木', meaning: 'tree', test: /[木林森校本村枚机根格様橋]/ },
  { radical: '貝', meaning: 'money / shell', test: /[貝買売貸員質財賞資賛]/ },
  { radical: '頁', meaning: 'head / page', test: /[頁頭顔題類願領頼]/ },
  { radical: '日', meaning: 'sun / day', test: /[日明時暗早春昼暑晩曜]/ },
];

/**
 * Parses a single string radical like "門 (gate)" into a KanjiComponent
 */
export function parseSingleRadicalString(raw?: string): KanjiComponent | null {
  if (!raw) return null;
  const match = raw.match(/^([^\s(（]+)\s*[（(]([^）)]+)[）)]/);
  if (match) {
    return { char: match[1].trim(), meaning: match[2].trim() };
  }
  return { char: raw.trim(), meaning: 'radical' };
}

/**
 * Extracts constituent radicals and elements for all kanji present in `expression`.
 * - If expression is purely Kana (no kanji), returns empty list `[]`.
 * - If kanji are indivisible single-element primitives, returns empty list `[]`.
 * - If kanji exist, extracts all constituent components per kanji.
 * - If word has multiple kanji (e.g. 病院), returns entries for both characters.
 */
export function decomposeWord(
  expression: string,
  fallbackRadical?: string
): KanjiDecomposition[] {
  if (!expression) return [];

  // Find all kanji characters in the expression
  const kanjiChars = expression.match(/[\u4e00-\u9faf]/g);
  if (!kanjiChars || kanjiChars.length === 0) {
    return [];
  }

  // De-duplicate kanji characters while preserving order
  const uniqueKanji = Array.from(new Set(kanjiChars));
  const results: KanjiDecomposition[] = [];

  for (const kanji of uniqueKanji) {
    let components: KanjiComponent[] = [];

    if (KANJI_DECOMPOSITION_MAP[kanji] !== undefined) {
      components = [...KANJI_DECOMPOSITION_MAP[kanji]];
    } else {
      // Check radical patterns
      for (const p of RADICAL_PATTERNS) {
        if (p.test.test(kanji)) {
          components.push({ char: p.radical, meaning: p.meaning });
          break;
        }
      }

      // If still empty and card had a fallback radical string, parse it
      if (components.length === 0 && fallbackRadical) {
        const parsed = parseSingleRadicalString(fallbackRadical);
        if (parsed) {
          components.push(parsed);
        }
      }
    }

    if (components.length > 0) {
      results.push({ kanji, components });
    }
  }

  return results;
}
