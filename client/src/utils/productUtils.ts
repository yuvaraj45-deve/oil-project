/**
 * Centralized utility for resolving authentic SS OIL product packshots.
 * Prevents broken images, missing images, and external Unsplash links from failing in Cart, Drawer & Store.
 */
export const resolveProductImage = (product: any): string => {
  if (!product) return '/products/sesame_oil.jpg?v=ssoil';
  const img = product.image || '';

  // If already pointing to an authentic local /products/ packshot, keep it
  if (typeof img === 'string' && (img.startsWith('/products/') || img.startsWith('data:') || img.startsWith('blob:'))) {
    return img;
  }

  const name = (product.name || '').toLowerCase();
  const cat = (product.category || '').toLowerCase();
  const slug = (product.slug || '').toLowerCase();

  if (name.includes('groundnut') || cat.includes('groundnut') || slug.includes('groundnut') || name.includes('peanut')) {
    return '/products/groundnut_oil.jpg?v=ssoil';
  }
  if (name.includes('sesame') || name.includes('gingelly') || cat.includes('sesame') || slug.includes('sesame') || name.includes('til')) {
    return '/products/sesame_oil.jpg?v=ssoil';
  }
  if (name.includes('coconut') || cat.includes('coconut') || slug.includes('coconut') || name.includes('thengai')) {
    return '/products/coconut_oil.jpg?v=ssoil';
  }
  if (name.includes('sunflower') || cat.includes('sunflower') || slug.includes('sunflower')) {
    return '/products/sunflower_oil.jpg?v=ssoil';
  }
  if (name.includes('rice bran') || cat.includes('ricebran') || slug.includes('ricebran') || name.includes('rice')) {
    return '/products/rice_bran_oil.jpg?v=ssoil';
  }
  if (name.includes('mustard') || cat.includes('mustard') || slug.includes('mustard') || name.includes('kadugu')) {
    return '/products/mustard_oil.jpg?v=ssoil';
  }
  if (name.includes('pooja') || name.includes('lamp') || name.includes('deepam') || cat.includes('pooja') || slug.includes('pooja')) {
    return '/products/lamp_oil.jpg?v=ssoil';
  }
  if (name.includes('can') || name.includes('5 litre') || name.includes('5l')) {
    return '/products/ss_oil_can.jpg?v=ssoil';
  }
  if (name.includes('cooking') || cat.includes('cooking') || slug.includes('cooking')) {
    return '/products/sunflower_oil.jpg?v=ssoil';
  }

  // If it's a valid relative path and not an external broken unsplash URL
  if (typeof img === 'string' && img.trim() !== '' && !img.includes('unsplash.com')) {
    return img;
  }

  return '/products/sesame_oil.jpg?v=ssoil';
};

/**
 * Intelligent English-to-Tamil oil and grocery product name auto-translator.
 * Translates exact product names as typed by Admin into natural, authentic Tamil.
 */
export const autoTranslateProductNameToTamil = (name: string, category?: string): string => {
  if (!name || !name.trim()) return '';

  // 1. If the input already contains Tamil characters, preserve it as is
  if (/[\u0B80-\u0BFF]/.test(name)) {
    return name.trim();
  }

  const raw = name.trim();
  const lower = raw.toLowerCase();

  // Strip brand prefixes for matching
  const clean = lower
    .replace(/\b(ss|ssoil|pureva|gem|gems|brand|pure|natural|organic|authentic|virgin|extra virgin|cold pressed|wood pressed|mara chekku|chekku|vaagai)\b/gi, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  // Check prefix intents
  const isColdPressed = lower.includes('cold pressed') || lower.includes('wood pressed') || lower.includes('mara chekku') || lower.includes('chekku') || lower.includes('vaagai');
  const isExtraVirgin = lower.includes('extra virgin') || lower.includes('virgin');
  const isPure = lower.includes('pure') || lower.includes('100%');

  // Check specific oil & grocery matches first (highest priority)
  if (clean.includes('groundnut') || clean.includes('peanut') || clean.includes('kadala') || clean.includes('kadalai')) {
    return isColdPressed ? 'மரச்செக்கு கடலை எண்ணெய்' : 'தூய கடலை எண்ணெய்';
  }
  if (clean.includes('sesame') || clean.includes('gingelly') || clean.includes('gingely') || clean.includes('til') || clean.includes('nallennai') || clean.includes('nallenai') || clean.includes('ellu')) {
    return isColdPressed ? 'மரச்செக்கு நல்லெண்ணெய்' : 'தூய நல்லெண்ணெய்';
  }
  if (clean.includes('coconut') || clean.includes('thengai') || clean.includes('copra')) {
    return isExtraVirgin ? 'மரச்செக்கு கன்னி தேங்காய் எண்ணெய்' : (isColdPressed ? 'மரச்செக்கு தேங்காய் எண்ணெய்' : 'தூய தேங்காய் எண்ணெய்');
  }
  if (clean.includes('sunflower') || clean.includes('suriyaganthi')) {
    return 'தூய சூரியகாந்தி எண்ணெய்';
  }
  if (clean.includes('mustard') || clean.includes('kadugu')) {
    return isColdPressed ? 'மரச்செக்கு கடுகு எண்ணெய்' : 'தூய கடுகு எண்ணெய்';
  }
  if (clean.includes('castor') || clean.includes('vilakku') || clean.includes('aamanakku') || clean.includes('amanakku')) {
    return 'தூய விளக்கெண்ணெய்';
  }
  if (clean.includes('neem') || clean.includes('veppam') || clean.includes('veppilai') || clean.includes('veppan')) {
    return isColdPressed ? 'மரச்செக்கு வேப்ப எண்ணெய்' : 'தூய வேப்ப எண்ணெய்';
  }
  if (clean.includes('rice bran') || clean.includes('ricebran') || clean.includes('tavittu') || clean.includes('thavittu')) {
    return 'இதய நலம் தரும் தவிட்டு எண்ணெய்';
  }
  if (clean.includes('mahua') || clean.includes('iluppai') || clean.includes('ilupai')) {
    return 'மரச்செக்கு இலுப்பை எண்ணெய்';
  }
  if (clean.includes('pungam') || clean.includes('karanja')) {
    return 'மரச்செக்கு புங்க எண்ணெய்';
  }
  if (clean.includes('almond') || clean.includes('badam')) {
    return 'தூய பாதாம் எண்ணெய்';
  }
  if (clean.includes('olive')) {
    return isExtraVirgin ? 'தூய எக்ஸ்ட்ரா வெர்ஜின் ஆலிவ் எண்ணெய்' : 'தூய ஆலிவ் எண்ணெய்';
  }
  if (clean.includes('flaxseed') || clean.includes('flax seed') || clean.includes('alsi') || clean.includes('linseed') || clean.includes('aali')) {
    return 'மரச்செக்கு ஆளி விதை எண்ணெய்';
  }
  if (clean.includes('walnut')) {
    return 'தூய வால்நட் எண்ணெய்';
  }
  if (clean.includes('avocado')) {
    return 'அவகேடோ எண்ணெய்';
  }
  if (clean.includes('jojoba')) {
    return 'ஜோஜோபா எண்ணெய்';
  }
  if (clean.includes('rosemary')) {
    return 'ரோஸ்மேரி எண்ணெய்';
  }
  if (clean.includes('tea tree') || clean.includes('teatree')) {
    return 'டீ ட்ரீ எண்ணெய்';
  }
  if (clean.includes('herbal hair') || (clean.includes('hair') && clean.includes('oil'))) {
    return 'மூலிகை கூந்தல் எண்ணெய்';
  }
  if (clean.includes('pooja') || clean.includes('deepam') || clean.includes('lamp') || clean.includes('pancha deepam') || clean.includes('panchadeepam')) {
    return 'பஞ்ச தீப பூஜை எண்ணெய்';
  }
  if (clean.includes('ghee') || clean.includes('ney') || clean.includes('nei')) {
    if (lower.includes('bilona') || lower.includes('a2') || lower.includes('desi') || lower.includes('country')) {
      return 'நாட்டு மாட்டு பிலோனா நெய்';
    }
    return 'தூய நாட்டு மாட்டு நெய்';
  }
  if (clean.includes('jaggery') || clean.includes('karupatti') || clean.includes('vellam')) {
    if (lower.includes('palm') || lower.includes('udangudi') || lower.includes('panai')) {
      return 'உடன்குடி பனை கருப்பட்டி';
    }
    if (lower.includes('cane') || lower.includes('sugar') || lower.includes('nattu sakkarai')) {
      return 'நாட்டு சர்க்கரை';
    }
    return 'உடன்குடி பனை கருப்பட்டி';
  }
  if (clean.includes('honey') || clean.includes('then')) {
    if (lower.includes('wild') || lower.includes('forest') || lower.includes('kattu')) {
      return 'தூய காட்டுத் தேன்';
    }
    return 'தூய மலைத் தேன்';
  }
  if (clean.includes('turmeric') || clean.includes('manjal')) {
    return lower.includes('powder') ? 'நாட்டு விரலி மஞ்சள் தூள்' : 'நாட்டு விரலி மஞ்சள்';
  }
  if (clean.includes('chilli') || clean.includes('milagai')) {
    return lower.includes('powder') ? 'தூய மிளகாய் தூள்' : 'நாட்டு மிளகாய்';
  }
  if (clean.includes('coriander') || clean.includes('malli')) {
    return lower.includes('powder') ? 'தூய மல்லித் தூள்' : 'நாட்டு மல்லி';
  }
  if (clean.includes('pepper') || clean.includes('milagu')) {
    return 'நாட்டு கருப்பு மிளகு';
  }
  if (clean.includes('cardamom') || clean.includes('elakkai') || clean.includes('elachi')) {
    return 'மணக்கும் ஏலக்காய்';
  }
  if (clean.includes('clove') || clean.includes('kirambu') || clean.includes('lavangam')) {
    return 'நாட்டு கிராம்பு';
  }
  if (clean.includes('fenugreek') || clean.includes('vendhayam')) {
    return 'நாட்டு வெந்தயம்';
  }
  if (clean.includes('cumin') || clean.includes('jeera') || clean.includes('seeragam')) {
    return 'தூய சீரகம்';
  }
  if (clean.includes('cooking') || clean.includes('edible')) {
    return 'தூய தினசரி சமையல் எண்ணெய்';
  }

  // 2. Transliteration dictionary for words, seeds, and codes
  const WORD_MAP: Record<string, string> = {
    oil: 'எண்ணெய்',
    pure: 'தூய',
    virgin: 'கன்னி',
    cold: 'குளிர்',
    pressed: 'பிழிந்த',
    wood: 'மரச்செக்கு',
    mara: 'மர',
    chekku: 'செக்கு',
    avocado: 'அவகேடோ',
    rosehip: 'ரோஸ்ஹிப்',
    jojoba: 'ஜோஜோபா',
    argan: 'ஆர்கன்',
    grapeseed: 'திராட்சை விதை',
    hemp: 'ஹெம்ப்',
    seed: 'விதை',
    seeds: 'விதைகள்',
    butter: 'வெண்ணெய்',
    tea: 'தேயிலை',
    coffee: 'காபி',
    salt: 'உப்பு',
    sugar: 'சர்க்கரை',
    flour: 'மாவு',
    powder: 'தூள்',
    soap: 'சோப்',
    shampoo: 'ஷாம்பு',
    cream: 'கிரீம்',
    herbal: 'மூலிகை',
    hair: 'கூந்தல்',
    face: 'முக',
    skin: 'சரும',
    bath: 'குளியல்',
    body: 'உடல்',
    special: 'ஸ்பெஷல்',
    super: 'சூப்பர்',
    mini: 'மினி',
    mega: 'மெகா',
    combo: 'காம்போ',
    pack: 'பேக்',
    can: 'கேன்',
    tin: 'டின்',
    bottle: 'பாட்டில்',
    jar: 'ஜாடி',
    test: 'டெஸ்ட்',
    sample: 'மாதிரி',
    demo: 'டெமோ',
    new: 'புதிய',
    batch: 'பேட்ச்',
    ss: 'எஸ்.எஸ்.',
    ssoil: 'எஸ்.எஸ். ஆயில்',
    kannan: 'கண்ணன்',
  };

  const LETTER_PHONETIC_TAMIL: Record<string, string> = {
    u: 'யு',
    a: 'ஏ',
    b: 'பி',
    c: 'சி',
    d: 'டி',
    e: 'இ',
    f: 'எஃப்',
    g: 'ஜி',
    h: 'ஹெச்',
    i: 'ஐ',
    j: 'ஜே',
    k: 'கே',
    l: 'எல்',
    m: 'எம்',
    n: 'என்',
    o: 'ஓ',
    p: 'பி',
    q: 'கியூ',
    r: 'ஆர்',
    s: 'எஸ்',
    t: 'டி',
    v: 'வி',
    w: 'டபிள்யூ',
    x: 'எக்ஸ்',
    y: 'ஒய்',
    z: 'இஸட்',
  };

  // Helper to translate single token (handles codes like u1, u2, a1, b1 or words)
  const translateToken = (token: string): string => {
    const t = token.toLowerCase();

    // Check direct word map
    if (WORD_MAP[t]) return WORD_MAP[t];

    // Check code patterns like u1, u2, a1, b1, g1, etc.
    const codeMatch = t.match(/^([a-z])(\d+)$/);
    if (codeMatch) {
      const letter = codeMatch[1];
      const digits = codeMatch[2];
      const tamilLetter = LETTER_PHONETIC_TAMIL[letter] || letter.toUpperCase();
      return `${tamilLetter}${digits}`;
    }

    // Check code with hyphen like u-1, a-2
    const hyphenCodeMatch = t.match(/^([a-z])-(\d+)$/);
    if (hyphenCodeMatch) {
      const letter = hyphenCodeMatch[1];
      const digits = hyphenCodeMatch[2];
      const tamilLetter = LETTER_PHONETIC_TAMIL[letter] || letter.toUpperCase();
      return `${tamilLetter}-${digits}`;
    }

    // Check single letter like u, a, b
    if (t.length === 1 && LETTER_PHONETIC_TAMIL[t]) {
      return LETTER_PHONETIC_TAMIL[t];
    }

    return token;
  };

  // Split raw into words and translate each token
  const words = raw.split(/\s+/).filter(Boolean);
  const translatedWords = words.map(translateToken);
  const candidate = translatedWords.join(' ');

  // If candidate has Tamil characters, return it
  if (/[\u0B80-\u0BFF]/.test(candidate)) {
    return candidate;
  }

  // Only use category fallback IF user typed an exclusively generic placeholder term
  // (e.g. literally "oil" or "cold pressed oil" with no specific name or code)
  const isGenericOilName = clean === '' || clean === 'oil' || clean === 'pure oil' || clean === 'cold pressed oil' || clean === 'wood pressed oil';
  if (isGenericOilName && category) {
    if (category.includes('groundnut')) return 'மரச்செக்கு கடலை எண்ணெய்';
    if (category.includes('sesame')) return 'மரச்செக்கு நல்லெண்ணெய்';
    if (category.includes('coconut')) return 'மரச்செக்கு தேங்காய் எண்ணெய்';
    if (category.includes('sunflower')) return 'தூய சூரியகாந்தி எண்ணெய்';
    if (category.includes('mustard')) return 'மரச்செக்கு கடுகு எண்ணெய்';
    if (category.includes('rice')) return 'இதய நலம் தரும் தவிட்டு எண்ணெய்';
    if (category.includes('pooja') || category.includes('deepam')) return 'பஞ்ச தீப பூஜை எண்ணெய்';
    if (category.includes('ghee')) return 'நாட்டு மாட்டு பிலோனா நெய்';
  }

  // If it's a completely unknown word/code without Tamil characters, return the typed name as-is
  // (NEVER return an unrelated oil name like Groundnut Oil!)
  return raw;
};

