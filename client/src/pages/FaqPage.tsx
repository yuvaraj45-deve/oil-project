import React, { useState } from 'react';
import {
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  ShieldCheck,
  Droplets,
  Truck,
  RotateCcw,
  MessageCircleQuestion,
  Sparkles,
  ArrowRight,
  Phone,
  MessageCircle,
  ArrowLeft,
  ChevronRight,
  ShoppingBag,
  Award,
  CheckCircle2,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FaqPageProps {
  onNavigate: (path: string) => void;
  onShopOils?: () => void;
}

interface FaqItem {
  id: string;
  category: 'purity' | 'packaging' | 'orders' | 'storage' | 'health';
  questionEn: string;
  questionTa: string;
  answerEn: string;
  answerTa: string;
  tag: string;
  tagTa: string;
}

const FAQS_DATA: FaqItem[] = [
  {
    id: 'faq-1',
    category: 'purity',
    tag: 'Extraction Process',
    tagTa: 'ஆலை தயாரிப்பு முறை',
    questionEn: 'What is Cold-Pressed Mara Chekku Oil, and how does it differ from standard refined oil?',
    questionTa: 'மரச்செக்கு எண்ணெய் என்றால் என்ன? சாதாரண ரீஃபைண்ட் எண்ணெயில் இருந்து எவ்வாறு வேறுபடுகிறது?',
    answerEn:
      'Traditional Mara Chekku oils are extracted using Vaagai (Albizia Lebbeck) wooden churners at slow speeds without artificial friction heat (<42°C). Unlike industrial oils treated with harsh chemical solvents (hexane) and caustic soda, our oils remain 100% unadulterated, rich in natural Vitamin E, native phytosterols, and raw aroma.',
    answerTa:
      'மரச்செக்கு (Vaagai Wood Press) முறையில் விதைகள் 42°C-க்கு கீழ் குறைந்த வேகத்தில் மெதுவாக ஆட்டப்படுகின்றன. எந்தவித ரசாயனக் கரைப்பான்கள் (Hexane) அல்லது பிளீச்சிங் சேர்க்கப்படுவதில்லை. இதனால் இயற்கை வைட்டமின் E, ஆன்டிஆக்ஸிடன்ட்கள் மற்றும் தூய மணம் 100% அப்படியே பாதுகாக்கப்படுகிறது.',
  },
  {
    id: 'faq-2',
    category: 'packaging',
    tag: 'Smart Bottle',
    tagTa: 'ஸ்மார்ட் பாட்டில்',
    questionEn: 'How does the Smart Bottle with built-in measuring chamber work?',
    questionTa: 'ஸ்மார்ட் பாட்டிலின் அளவீட்டு சேம்பர் (Measuring Chamber) எவ்வாறு செயல்படுகிறது?',
    answerEn:
      'The smart bottle features an innovative dual-chamber mechanism. Gently squeeze the lower reservoir to push exact 10ml, 20ml, or 30ml oil into the upper chamber. The precision anti-drip spout ensures zero oily drips down the bottle onto your clean kitchen countertops.',
    answerTa:
      'பாட்டிலின் மேற்புறத்தில் உள்ளமைக்கப்பட்ட 10ml, 20ml மற்றும் 30ml அளவுகோல்கள் உள்ளன. பாட்டிலை லேசாக அழுத்தினால் தேவையான அளவு எண்ணெய் மேலே உள்ள சேம்பரில் நிரம்பும். ஆன்டி-டிரிப் மூடி மூலம் மேடையில் சிந்தாமல் துல்லியமாக சமையலில் ஊற்றலாம்.',
  },
  {
    id: 'faq-3',
    category: 'purity',
    tag: 'Heritage Recipe',
    tagTa: 'பாரம்பரிய முறை',
    questionEn: 'Why is traditional Palm Jaggery (Karupatti) added to Sesame / Gingelly Oil?',
    questionTa: 'நல்லெண்ணெயில் கருப்பட்டி சேர்க்கப்படுவது எதற்காக?',
    answerEn:
      'Authentic South Indian tradition blends organic palm jaggery during sesame crushing to balance natural bitterness, introduce digestive minerals, and enhance the rich, nutty bouquet ideal for everyday cooking and auspicious morning prayers.',
    answerTa:
      'எள்ளில் உள்ள இயற்கை கசப்புத் தன்மையைச் சமநிலைப்படுத்தவும், செரிமான ஆற்றலை அதிகரிக்கவும் பாரம்பரிய முறைப்படி தூய பனை கருப்பட்டி சேர்த்து ஆட்டப்படுகிறது. இது உணவிற்கு உன்னதமான மணத்தையும், வயிற்றுப் புண்களுக்கு மருந்தாகவும் அமைகிறது.',
  },
  {
    id: 'faq-4',
    category: 'storage',
    tag: 'Shelf Life',
    tagTa: 'ஆயுட்காலம்',
    questionEn: 'What is the shelf life of SS OIL Cold-Pressed Oils, and how should they be stored?',
    questionTa: 'மரச்செக்கு எண்ணெயின் ஆயுட்காலம் (Shelf Life) எவ்வளவு நாள்? எவ்வாறு சேமிப்பது?',
    answerEn:
      'Since our oils contain zero artificial preservatives, they maintain optimal nutritional freshness for 9 to 12 months from manufacturing date. Store in a cool, dry pantry away from direct sunlight, keeping the aroma-lock cap firmly sealed.',
    answerTa:
      'எண்ணெயில் ரசாயன பாதுகாப்பிகள் ஏதும் இல்லாததால், தயாரித்த தேதியிலிருந்து 9 முதல் 12 மாதங்கள் வரை அதன் தரம் மாறாமல் இருக்கும். நேரடி சூரிய ஒளி படாத, குளிர்ந்த உலர்ந்த இடத்தில் மூடியை இறுக்கமாக மூடி வைக்கவும்.',
  },
  {
    id: 'faq-5',
    category: 'orders',
    tag: 'Delivery',
    tagTa: 'விநியோகம்',
    questionEn: 'How long does delivery take, and do you ship across Tamil Nadu & India?',
    questionTa: 'டெலிவரி எவ்வளவு நாட்களில் கிடைக்கும்? தமிழகம் முழுவதும் கிடைக்குமா?',
    answerEn:
      'All orders are dispatched fresh directly from our central mill within 24 hours. Delivery across Tamil Nadu takes 1–2 business days, and other states take 3–4 business days. Free shipping on all orders above ₹499.',
    answerTa:
      'சேலம் மில்லிலிருந்து அதே நாளில் பிரெஷ்ஷாக பேக் செய்யப்பட்டு அனுப்பப்படுகிறது. தமிழகத்தின் அனைத்து மாவட்டங்களுக்கும் 24 முதல் 48 மணி நேரத்திற்குள் விநியோகிக்கப்படுகிறது. ₹499-க்கு மேல் ஆர்டர் செய்தால் இலவச டெலிவரி!',
  },
  {
    id: 'faq-6',
    category: 'purity',
    tag: 'Natural Sediment',
    tagTa: 'இயற்கை வண்டல்',
    questionEn: 'Why is there a slight natural sediment at the bottom of the bottle? Is it safe?',
    questionTa: 'பாட்டிலின் அடியில் லேசான படிமானம் (Sediment) இருப்பது ஏன்? அது பாதுகாப்பானதா?',
    answerEn:
      'Yes, absolutely! Unlike factory oils stripped with bleach, our oils undergo natural gravity sedimentation and traditional cotton mesh filtering. Tiny microscopic seed particulates are natural proof of unadulterated, unrefined virgin wood pressing.',
    answerTa:
      'ஆம், 100% பாதுகாப்பானது! எங்கள் எண்ணெய் ரசாயன ஃபில்டர்கள் இன்றி, சூரிய ஒளியில் இயற்கையாக தெளியவைக்கப்பட்டு பருத்தி துணியால் மட்டுமே வடிக்கப்படுகிறது. அடியில் உள்ள சிறிய துகள்கள் தூய மரச்செக்கு முறைக்கான அசல் சான்றாகும்.',
  },
  {
    id: 'faq-7',
    category: 'health',
    tag: 'Smoke Point & Cooking',
    tagTa: 'சமையல் பயன்பாடு',
    questionEn: 'Can cold-pressed oils be used for deep frying?',
    questionTa: 'மரச்செக்கு எண்ணெயை ஆழமான வறுவலுக்கு (Deep Frying) பயன்படுத்தலாமா?',
    answerEn:
      'Yes! Our Wood-Pressed Groundnut Oil (Smoke point ~232°C), Pure Coconut Oil (~177°C), and Rice Bran Oil (~250°C) are excellent for high-heat Indian cooking, deep frying snacks, tadkas, and traditional gravies without producing toxic aldehydes.',
    answerTa:
      'நிச்சயமாக! மரச்செக்கு கடலை எண்ணெய் (232°C) மற்றும் ரைஸ் பிரான் எண்ணெய் (250°C) அதிக வெப்பத்தைத் தாங்கும் தன்மை கொண்டவை. பலகாரங்கள், வறுவல், பொரியல் மற்றும் தாளிப்புக்கு எவ்வித ரசாயன மாற்றமும் இன்றி பாதுகாப்பாகப் பயன்படுத்தலாம்.',
  },
  {
    id: 'faq-8',
    category: 'orders',
    tag: 'Cancellation & Returns',
    tagTa: 'ரத்து & மாற்றுதல்',
    questionEn: 'What is your policy on cancellation, returns, or transit damage?',
    questionTa: 'ஆர்டரை ரத்து செய்தல் அல்லது சேதமடைந்த பாட்டிலை மாற்றுவது எப்படி?',
    answerEn:
      'You can easily cancel an order directly from your Orders page before mill dispatch. In the rare case of transit leakage or seal tampering, send a photo to our WhatsApp support within 48 hours for an instant free replacement or 100% refund.',
    answerTa:
      'மில்லில் இருந்து அனுப்பப்படும் முன் உங்கள் கணக்கு பக்கத்தில் (Orders Page) இருந்தே உடனடியாக ரத்து செய்யலாம். டெலிவரியின் போது ஏதேனும் சேதம் ஏற்பட்டால், 48 மணி நேரத்திற்குள் எங்கள் வாட்ஸ்அப் எண்ணிற்கு படம் அனுப்பினால் உடனே மாற்று பாட்டில் அல்லது முழு பணமும் திரும்ப வழங்கப்படும்.',
  },
];

export const FaqPage: React.FC<FaqPageProps> = ({ onNavigate, onShopOils }) => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    'faq-1': true,
    'faq-2': true,
  });

  const categories = [
    { id: 'all', labelEn: 'All Questions', labelTa: 'அனைத்து கேள்விகள்' },
    { id: 'purity', labelEn: 'Mara Chekku Purity', labelTa: 'மரச்செக்கு தூய்மை' },
    { id: 'packaging', labelEn: 'Smart Bottle & Packs', labelTa: 'ஸ்மார்ட் பாட்டில்' },
    { id: 'storage', labelEn: 'Shelf Life & Storage', labelTa: 'சேமிப்பு & ஆயுட்காலம்' },
    { id: 'health', labelEn: 'Cooking & Health', labelTa: 'சமையல் & ஆரோக்கியம்' },
    { id: 'orders', labelEn: 'Orders & Shipping', labelTa: 'ஆர்டர் & டெலிவரி' },
  ];

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleExpandAll = () => {
    const allOpen: Record<string, boolean> = {};
    FAQS_DATA.forEach((faq) => {
      allOpen[faq.id] = true;
    });
    setOpenItems(allOpen);
  };

  const handleCollapseAll = () => {
    setOpenItems({});
  };

  const filteredFaqs = FAQS_DATA.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const q = (language === 'ta' ? faq.questionTa : faq.questionEn).toLowerCase();
    const a = (language === 'ta' ? faq.answerTa : faq.answerEn).toLowerCase();
    const tag = (language === 'ta' ? faq.tagTa : faq.tag).toLowerCase();
    const search = searchTerm.toLowerCase().trim();
    const matchesSearch = !search || q.includes(search) || a.includes(search) || tag.includes(search);
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-24">
      {/* 1. Breadcrumbs Top Bar */}
      <div className="bg-white border-b border-stone-200/60 sticky top-0 z-20 shadow-2xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3 overflow-x-auto">
            <button
              onClick={() => onNavigate('/')}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-stone-200 hover:border-[#1e7e34] text-stone-700 hover:text-stone-950 font-bold transition-all text-xs cursor-pointer bg-stone-50 hover:bg-white shadow-2xs shrink-0"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'முகப்புக்கு திரும்ப' : 'Back to Home'}</span>
            </button>

            <nav className="flex items-center gap-2 text-stone-500 whitespace-nowrap">
              <button
                onClick={() => onNavigate('/')}
                className="hover:text-[#1e7e34] font-medium transition-colors cursor-pointer"
              >
                {language === 'ta' ? 'முகப்பு' : 'Home'}
              </button>
              <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
              <span className="font-bold text-stone-900">
                {language === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'FAQs & Knowledge Base'}
              </span>
            </nav>
          </div>

          <button
            onClick={() => {
              if (onShopOils) onShopOils();
              else onNavigate('/shop');
            }}
            className="hidden sm:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-[#1e7e34] hover:bg-[#18682a] text-white font-bold text-xs transition-colors cursor-pointer shadow-xs shrink-0"
          >
            <ShoppingBag className="w-3.5 h-3.5 text-gold-300" />
            <span>{language === 'ta' ? 'அங்காடி செல்ல' : 'Shop All Oils'}</span>
          </button>
        </div>
      </div>

      {/* 2. Hero Header Banner */}
      <div className="bg-gradient-to-b from-[#1b4332] via-[#2d6a4f] to-[#1b4332] text-white py-14 sm:py-20 relative overflow-hidden">
        {/* Subtle decorative circles */}
        <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-emerald-400/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-amber-400/10 blur-3xl pointer-events-none" />

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-bold tracking-wider uppercase">
            <MessageCircleQuestion className="w-3.5 h-3.5 text-amber-300" />
            <span>{language === 'ta' ? 'மரச்செக்கு வழிகாட்டி & பதில்கள்' : 'Heritage Mill Knowledge & FAQ'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white leading-tight">
            {language === 'ta'
              ? 'அடிக்கடி கேட்கப்படும் கேள்விகள்'
              : 'Frequently Asked Questions'}
          </h1>

          <p className="text-emerald-100/90 text-sm sm:text-base max-w-2xl mx-auto font-normal leading-relaxed">
            {language === 'ta'
              ? 'மரச்செக்கு தயாரிப்பு முறை, ஊட்டச்சத்து நன்மைகள், ஸ்மார்ட் பாட்டில் மற்றும் டெலிவரி பற்றிய முழுமையான விடை இங்கே.'
              : 'Everything you need to know about our unrefined Vaagai wood cold-pressing, smart measuring bottle, shelf life, and doorstep delivery.'}
          </p>

          {/* Search Bar */}
          <div className="pt-4 max-w-xl mx-auto">
            <div className="relative">
              <Search className="w-5 h-5 text-stone-400 absolute left-4 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'கேள்வி அல்லது வார்த்தையைத் தேடவும் (எ.கா: கருப்பட்டி, டெலிவரி)...'
                    : 'Search questions (e.g., Karupatti, shelf life, delivery)...'
                }
                className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-white text-stone-900 placeholder-stone-400 text-sm shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-400/30 border border-white/20"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-400 hover:text-stone-700 bg-stone-100 hover:bg-stone-200 px-2 py-0.5 rounded-md"
                >
                  Clear
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Category Filter Tabs */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 relative z-10">
        <div className="bg-white rounded-2xl p-2 sm:p-2.5 shadow-lg border border-stone-200/80 flex items-center gap-1.5 overflow-x-auto scrollbar-none">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-[#1e7e34] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-950 hover:bg-stone-100'
                }`}
              >
                {language === 'ta' ? cat.labelTa : cat.labelEn}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Controls & Accordion FAQ List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-4">
        {/* Counter and Expand/Collapse Controls */}
        <div className="flex items-center justify-between text-xs text-stone-500 pb-2 border-b border-stone-200">
          <span className="font-bold text-stone-700">
            {language === 'ta'
              ? `${filteredFaqs.length} கேள்விகள் கிடைக்கின்றன`
              : `Showing ${filteredFaqs.length} answers`}
          </span>

          <div className="flex items-center gap-3 font-semibold">
            <button
              onClick={handleExpandAll}
              className="hover:text-[#1e7e34] transition-colors cursor-pointer"
            >
              {language === 'ta' ? 'அனைத்தும் திறக்க' : 'Expand All'}
            </button>
            <span>•</span>
            <button
              onClick={handleCollapseAll}
              className="hover:text-[#1e7e34] transition-colors cursor-pointer"
            >
              {language === 'ta' ? 'அனைத்தும் சுருக்க' : 'Collapse All'}
            </button>
          </div>
        </div>

        {/* Empty State */}
        {filteredFaqs.length === 0 && (
          <div className="bg-white rounded-3xl p-10 text-center border border-stone-200/80 shadow-xs space-y-3">
            <HelpCircle className="w-10 h-10 text-stone-300 mx-auto" />
            <h3 className="text-base font-bold text-stone-800">
              {language === 'ta' ? 'கேள்விகள் ஏதும் கிடைக்கவில்லை' : 'No matching questions found'}
            </h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {language === 'ta'
                ? 'வேறு வார்த்தைகளை பயன்படுத்தி தேடவும் அல்லது எங்கள் வாடிக்கையாளர் உதவி மையத்தை தொடர்பு கொள்ளவும்.'
                : 'Try searching with different keywords or connect with our customer support team directly.'}
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setActiveCategory('all');
              }}
              className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs cursor-pointer transition-colors"
            >
              {language === 'ta' ? 'தேடலை மீட்டமைக்க' : 'Reset Search'}
            </button>
          </div>
        )}

        {/* FAQ Accordion Cards */}
        <div className="space-y-3">
          {filteredFaqs.map((faq) => {
            const isOpen = !!openItems[faq.id];
            const question = language === 'ta' ? faq.questionTa : faq.questionEn;
            const answer = language === 'ta' ? faq.answerTa : faq.answerEn;
            const tag = language === 'ta' ? faq.tagTa : faq.tag;

            return (
              <div
                key={faq.id}
                className={`rounded-2xl transition-all duration-200 border overflow-hidden ${
                  isOpen
                    ? 'bg-white border-[#1e7e34]/30 shadow-md ring-1 ring-[#1e7e34]/15'
                    : 'bg-white border-stone-200 hover:border-stone-300 shadow-2xs'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleItem(faq.id)}
                  className="w-full text-left p-5 sm:p-6 flex items-start justify-between gap-4 cursor-pointer"
                >
                  <div className="space-y-1.5 flex-1">
                    <span className="inline-block px-2.5 py-0.5 rounded-md text-[10px] font-extrabold tracking-wider uppercase bg-amber-50 text-amber-800 border border-amber-200/80">
                      {tag}
                    </span>
                    <h3 className="font-serif text-base sm:text-lg font-bold text-stone-900 leading-snug">
                      {question}
                    </h3>
                  </div>

                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-[#1e7e34] text-white'
                        : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                    }`}
                  >
                    {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-1 text-sm text-stone-600 leading-relaxed border-t border-stone-100 bg-[#FAF8F5]/60 animate-fadeIn">
                    <p>{answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 5. Need Personal Assistance / WhatsApp Help Card */}
        <div className="mt-12 bg-gradient-to-r from-emerald-950 via-forest-900 to-emerald-950 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-emerald-800 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-bold">
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{language === 'ta' ? 'வாடிக்கையாளர் ஆதரவு' : 'Customer Mill Support'}</span>
            </div>
            <h4 className="text-xl sm:text-2xl font-serif font-black text-white">
              {language === 'ta'
                ? 'மேலும் சந்தேகங்கள் உள்ளதா? நேரடியாக பேசலாம்!'
                : 'Still have questions? Chat with our Mill Experts!'}
            </h4>
            <p className="text-xs sm:text-sm text-emerald-200/90 max-w-xl">
              {language === 'ta'
                ? 'எங்கள் வாட்ஸ்அப் அல்லது தொலைபேசி மூலம் நேரடி உதவி பெறலாம். காலை 9 முதல் இரவு 8 வரை.'
                : 'Connect with our Salem wood mill team on WhatsApp for instant guidance on oil varieties and customized corporate orders.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0 w-full md:w-auto">
            <a
              href="https://wa.me/919443224099?text=Hello%20SS%20OIL,%20I%20have%20a%20question%20about%20your%20Mara%20Chekku%20oils"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <MessageCircle className="w-4 h-4 text-emerald-100" />
              <span>{language === 'ta' ? 'வாட்ஸ்அப் உதவி' : 'WhatsApp Support'}</span>
            </a>

            <button
              onClick={() => {
                if (onShopOils) onShopOils();
                else onNavigate('/shop');
              }}
              className="w-full sm:w-auto px-5 py-3 rounded-xl bg-gold-400 hover:bg-gold-300 text-forest-950 font-black text-xs transition-all flex items-center justify-center gap-2 shadow-md cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{language === 'ta' ? 'அங்காடி செல்ல' : 'Explore Shop'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

