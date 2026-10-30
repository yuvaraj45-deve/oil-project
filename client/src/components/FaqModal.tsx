import React, { useState } from 'react';
import {
  X,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Search,
  Sparkles,
  ShieldCheck,
  Droplet,
  Truck,
  RotateCcw,
  MessageCircleQuestion,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface FaqModalProps {
  isOpen: boolean;
  onClose: () => void;
  onShopOils?: () => void;
}

interface FaqItem {
  id: string;
  category: 'purity' | 'packaging' | 'orders' | 'storage';
  question: string;
  answer: string;
}

export const FaqModal: React.FC<FaqModalProps> = ({ isOpen, onClose, onShopOils }) => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({
    faq_1: true,
    faq_2: false,
  });

  if (!isOpen) return null;

  const faqs: FaqItem[] = [
    {
      id: 'faq_1',
      category: 'purity',
      question:
        language === 'ta'
          ? 'மரச்செக்கு எண்ணெய் என்றால் என்ன? சாதாரண ரீஃபைண்ட் எண்ணெயில் இருந்து எவ்வாறு வேறுபடுகிறது?'
          : 'What is Cold-Pressed Mara Chekku Oil, and how does it differ from standard refined oil?',
      answer:
        language === 'ta'
          ? 'மரச்செக்கு (Vaagai Wood Press) முறையில் விதைகள் 42°C-க்கு கீழ் குறைந்த வேகத்தில் ஆட்டப்படுகின்றன. எந்தவித ரசாயனக் கரைப்பான்கள் (Hexane) அல்லது பிளீச்சிங் சேர்க்கப்படுவதில்லை. இதனால் இயற்கை வைட்டமின் E, ஆன்டிஆக்ஸிடன்ட்கள் மற்றும் தூய மணம் 100% அப்படியே பாதுகாக்கப்படுகிறது.'
          : 'Traditional Mara Chekku oils are extracted using Vaagai wooden churners at slow speeds without artificial friction heat (<42°C). Unlike industrial oils treated with harsh chemical solvents (hexane) and caustic soda, our oils remain 100% unadulterated, rich in natural Vitamin E and raw aroma.',
    },
    {
      id: 'faq_2',
      category: 'packaging',
      question:
        language === 'ta'
          ? 'ஸ்மார்ட் பாட்டிலின் அளவீட்டு சேம்பர் (Measuring Chamber) எவ்வாறு செயல்படுகிறது?'
          : 'How does the Smart Bottle with built-in measuring chamber work?',
      answer:
        language === 'ta'
          ? 'பாட்டிலின் மேற்புறத்தில் உள்ளமைக்கப்பட்ட 10ml, 20ml மற்றும் 30ml அளவுகோல்கள் உள்ளன. பாட்டிலை லேசாக அழுத்தினால் தேவையான அளவு எண்ணெய் மேலே உள்ள சேம்பரில் நிரம்பும். ஆன்டி-டிரிப் மூடி மூலம் மேடையில் சிந்தாமல் துல்லியமாக சமையலில் ஊற்றலாம்.'
          : 'The smart bottle features a dual-chamber mechanism. Gently squeeze the lower reservoir to push exact 10ml, 20ml, or 30ml oil into the upper chamber. The precision anti-drip spout ensures zero oily drips down the bottle onto your clean kitchen countertops.',
    },
    {
      id: 'faq_3',
      category: 'purity',
      question:
        language === 'ta'
          ? 'நல்லெண்ணெயில் கருப்பட்டி சேர்க்கப்படுவது எதற்காக?'
          : 'Why is traditional Palm Jaggery (Karupatti) added to Sesame / Gingelly Oil?',
      answer:
        language === 'ta'
          ? 'எள்ளில் உள்ள இயற்கை கசப்புத் தன்மையைச் சமநிலைப்படுத்தவும், செரிமான ஆற்றலை அதிகரிக்கவும் பாரம்பரிய முறைப்படி தூய பனை கருப்பட்டி சேர்த்து ஆட்டப்படுகிறது. இது உணவிற்கு உன்னதமான மணத்தையும், வயிற்றுப் புண்களுக்கு மருந்தாகவும் அமைகிறது.'
          : 'Authentic South Indian tradition blends organic palm jaggery during sesame crushing to balance natural bitterness, introduce digestive minerals, and enhance the rich, nutty bouquet ideal for everyday cooking and auspicious morning prayers.',
    },
    {
      id: 'faq_4',
      category: 'storage',
      question:
        language === 'ta'
          ? 'மரச்செக்கு எண்ணெயின் ஆயுட்காலம் (Shelf Life) எவ்வளவு நாள்? எவ்வாறு சேமிப்பது?'
          : 'What is the shelf life of SS OIL Cold-Pressed Oils, and how should they be stored?',
      answer:
        language === 'ta'
          ? 'எண்ணெயில் ரசாயன பாதுகாப்பிகள் ஏதும் இல்லாததால், தயாரித்த தேதியிலிருந்து 9 முதல் 12 மாதங்கள் வரை அதன் தரம் மாறாமல் இருக்கும். நேரடி சூரிய ஒளி படாத, குளிர்ந்த உலர்ந்த இடத்தில் மூடியை இறுக்கமாக மூடி வைக்கவும்.'
          : 'Since our oils contain zero artificial preservatives, they maintain optimal nutritional freshness for 9 to 12 months from manufacturing date. Store in a cool, dry pantry away from direct sunlight, keeping the aroma-lock cap firmly sealed.',
    },
    {
      id: 'faq_5',
      category: 'orders',
      question:
        language === 'ta'
          ? 'டெலிவரி எவ்வளவு நாட்களில் கிடைக்கும்? தமிழகம் முழுவதும் கிடைக்குமா?'
          : 'How long does delivery take, and do you ship across Tamil Nadu & India?',
      answer:
        language === 'ta'
          ? 'சேலம் மில்லிலிருந்து அதே நாளில் பிரெஷ்ஷாக பேக் செய்யப்பட்டு அனுப்பப்படுகிறது. தமிழகத்தின் அனைத்து மாவட்டங்களுக்கும் 24 முதல் 48 மணி நேரத்திற்குள் விநியோகிக்கப்படுகிறது. ₹499-க்கு மேல் ஆர்டர் செய்தால் இலவச டெலிவரி!'
          : 'All orders are dispatched fresh directly from our central mill within 24 hours. Delivery across Tamil Nadu takes 1–2 business days, and other states take 3–4 business days. Free shipping on all orders above ₹499.',
    },
    {
      id: 'faq_6',
      category: 'purity',
      question:
        language === 'ta'
          ? 'பாட்டிலின் அடியில் லேசான படிமானம் (Sediment) இருப்பது ஏன்? அது பாதுகாப்பானதா?'
          : 'Why is there a slight natural sediment at the bottom of the bottle? Is it safe?',
      answer:
        language === 'ta'
          ? 'ஆம், 100% பாதுகாப்பானது! எங்கள் எண்ணெய் ரசாயன ஃபில்டர்கள் இன்றி, சூரிய ஒளியில் இயற்கையாக தெளியவைக்கப்பட்டு பருத்தி துணியால் மட்டுமே வடிக்கப்படுகிறது. அடியில் உள்ள சிறிய துகள்கள் தூய மரச்செக்கு முறைக்கான அசல் சான்றாகும்.'
          : 'Yes, absolutely! Unlike factory oils stripped with bleach, our oils undergo natural gravity sedimentation and traditional cotton mesh filtering. Tiny microscopic seed particulates are natural proof of unadulterated, unrefined virgin wood pressing.',
    },
  ];

  const toggleItem = (id: string) => {
    setOpenItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredFaqs = faqs.filter((faq) => {
    const matchesCategory = activeCategory === 'all' || faq.category === activeCategory;
    const matchesSearch =
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-cream-200 overflow-hidden my-auto max-h-[90vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white flex items-center justify-between shrink-0 border-b border-forest-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30">
              <MessageCircleQuestion className="w-5 h-5 text-gold-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif text-lg font-bold text-white tracking-wide">
                  {language === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'Frequently Asked Questions (FAQs)'}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-400/20 text-gold-300 border border-gold-400/30">
                  SS OIL Help Desk
                </span>
              </div>
              <p className="text-xs text-cream-200/70">
                {language === 'ta'
                  ? 'மரச்செக்கு தூய்மை, ஸ்மார்ட் பாட்டில் மற்றும் டெலிவரி பற்றிய முழு விவரங்கள்'
                  : 'Everything about cold-pressed purity, smart bottles, and fast delivery'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-stone-300 hover:text-white hover:bg-forest-800 transition-colors cursor-pointer"
            aria-label="Close FAQs"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Tabs */}
        <div className="p-4 sm:p-6 border-b border-stone-200 bg-stone-50/70 shrink-0 space-y-3">
          {/* Search Bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={
                language === 'ta'
                  ? 'கேள்விகளைத் தேடவும் (எ.கா. மரச்செக்கு, அளவீடு, டெலிவரி)...'
                  : 'Search questions (e.g. cold-pressed, smart bottle, delivery)...'
              }
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-stone-300 text-xs sm:text-sm focus:outline-none focus:border-forest-900 shadow-xs"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar text-xs">
            {[
              { id: 'all', label: language === 'ta' ? 'அனைத்தும்' : 'All Topics' },
              { id: 'purity', label: language === 'ta' ? 'மரச்செக்கு தூய்மை' : 'Purity & Process' },
              { id: 'packaging', label: language === 'ta' ? 'ஸ்மார்ட் பாட்டில்' : 'Smart Bottle' },
              { id: 'orders', label: language === 'ta' ? 'டெலிவரி & ஆர்டர்' : 'Delivery & Orders' },
              { id: 'storage', label: language === 'ta' ? 'சேமிப்பு முறை' : 'Shelf Life' },
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  activeCategory === cat.id
                    ? 'bg-forest-950 text-gold-300 shadow-xs'
                    : 'bg-white text-stone-600 hover:text-stone-900 border border-stone-300'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ Accordion List (Scrollable Area) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3 divide-y divide-transparent">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-10 text-stone-500 text-sm">
              <HelpCircle className="w-8 h-8 text-stone-400 mx-auto mb-2" />
              <p>No matching questions found for "{searchTerm}".</p>
            </div>
          ) : (
            filteredFaqs.map((faq) => {
              const isOpenItem = !!openItems[faq.id];
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-stone-200/90 overflow-hidden bg-white shadow-xs transition-all duration-200 hover:border-gold-500/60"
                >
                  <button
                    onClick={() => toggleItem(faq.id)}
                    className="w-full p-4 sm:p-5 text-left flex items-start justify-between gap-4 cursor-pointer focus:outline-none"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-gold-500 shrink-0 mt-0.5" />
                      <h4 className="text-xs sm:text-sm font-bold text-forest-950 leading-snug">
                        {faq.question}
                      </h4>
                    </div>
                    <div className="w-6 h-6 rounded-full bg-stone-100 flex items-center justify-center shrink-0 text-stone-600">
                      {isOpenItem ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </button>

                  {isOpenItem && (
                    <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-stone-600 font-light leading-relaxed border-t border-stone-100 bg-stone-50/40 animate-fadeIn">
                      <p>{faq.answer}</p>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-stone-500 text-center sm:text-left">
            <span>Have more questions? Call mill desk at </span>
            <span className="font-bold text-forest-950">1800 425 7764</span>
          </div>

          <div className="flex items-center gap-2">
            {onShopOils && (
              <button
                onClick={() => {
                  onClose();
                  onShopOils();
                }}
                className="px-5 py-2 rounded-full bg-forest-950 hover:bg-forest-900 text-white font-bold text-xs transition-all cursor-pointer shadow-xs"
              >
                {language === 'ta' ? 'எண்ணெய் வாங்க' : 'Shop Pure Oils'}
              </button>
            )}
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-800 font-bold text-xs transition-all cursor-pointer"
            >
              {language === 'ta' ? 'மூடுக' : 'Close'}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
