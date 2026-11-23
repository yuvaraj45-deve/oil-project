import React from 'react';
import {
  History,
  ShieldCheck,
  Award,
  Trees,
  HeartHandshake,
  Wheat,
  Droplets,
  Flame,
  ArrowRight,
  CheckCircle2,
  Calendar,
  MapPin,
  Sparkles,
  Target,
  Compass,
} from 'lucide-react';
import { Product } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AboutPageProps {
  onAddToCart?: (product: Product, packSize: string) => void;
  onQuickView?: (product: Product) => void;
  onViewLabReport?: (product: Product) => void;
  onViewAllProducts?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onViewAllProducts }) => {
  const { language } = useLanguage();
  const isTa = language === 'ta';

  return (
    <div className="bg-[#FAF8F5] min-h-screen text-stone-800 font-sans pb-24">
      
      {/* ============================================================ */}
      {/* HERO BANNER: A Legacy of Tradition Since 1982                */}
      {/* ============================================================ */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#132A13] via-[#1B3B1B] to-[#132A13] text-cream-100 py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b-4 border-[#D4AF37]">
        {/* Subtle decorative glow & vintage pattern */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative max-w-5xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-[#D4AF37]/20 border border-[#D4AF37]/40 text-[#F3E5AB] text-xs sm:text-sm font-serif font-bold uppercase tracking-widest shadow-inner">
            <span>{isTa ? '1982 முதல் தொடரும் பாரம்பரியம்' : 'A Legacy of Tradition Since 1982'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight leading-tight text-white drop-shadow-md">
            {isTa ? (
              <>
                1982 முதல் தலைமுறை கடந்த பாரம்பரியம்
              </>
            ) : (
              <>
                A Legacy of Tradition Since 1982
              </>
            )}
          </h1>

          <p className="text-base sm:text-xl lg:text-2xl text-[#E8DCC4] font-serif italic max-w-3xl mx-auto leading-relaxed">
            {isTa
              ? 'தலைமுறைகள் கடந்த பாரம்பரியம்... மாறாத தரத்திற்கான எங்கள் அர்ப்பணிப்பு!'
              : 'A tradition spanning generations... a commitment to quality that never wavers!'}
          </p>

          {/* Key milestone badges */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs sm:text-sm font-semibold text-cream-200">
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
              <Calendar className="w-4 h-4 text-[#D4AF37]" />
              <span>{isTa ? 'ஆரம்பம்: 1982' : 'Estd. 1982'}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
              <MapPin className="w-4 h-4 text-[#D4AF37]" />
              <span>{isTa ? 'தண்டராம்பட்டு, திருவண்ணாமலை' : 'Thandarampattu, Tiruvannamalai'}</span>
            </div>
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-xs border border-white/15">
              <Award className="w-4 h-4 text-[#D4AF37]" />
              <span>{isTa ? '3 தலைமுறை நம்பிக்கை' : '3 Generations of Trust'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Sections */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-16 space-y-12 sm:space-y-16">

        {/* ============================================================ */}
        {/* 1. OUR HERITAGE                                              */}
        {/* ============================================================ */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-cream-300 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-xs border border-amber-200">
              1
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                {isTa ? 'ஆரம்ப வேர்கள்' : 'Roots & Beginnings'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
                {isTa ? 'எங்கள் பாரம்பரியம்' : 'Our Heritage'}
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
            <p className="font-serif italic text-base sm:text-lg text-forest-900 border-l-4 border-amber-600 pl-4 py-1 bg-amber-50/60 rounded-r-xl">
              {isTa
                ? 'எங்களின் இந்த பயணம் வெறும் ஒரு வியாபாரமாக தொடங்கவில்லை; இது பாரம்பரியம், கடின உழைப்பு, தரம் மற்றும் நம்பிக்கையின் அடையாளமாகத் தொடங்கியது.'
                : 'Our journey did not begin merely as a business; it started as a symbol of tradition, hard work, quality, and trust.'}
            </p>

            <p>
              {isTa
                ? '1982-ல் திருவண்ணாமலை மாவட்டம், தண்டராம்பட்டில் எங்களது பாட்டனார் திரு. ராஜி செட்டியார் அவர்கள் பாரம்பரிய முறையில் — மாட்டுச் செக்கு மற்றும் கல் செக்கு மூலம் எண்ணெய் உற்பத்தி செய்யும் தொழிலைத் தொடங்கினார்.'
                : 'In 1982, in Thandarampattu, Tiruvannamalai district, our grandfather, Mr. Raji Chettiar, established an oil-production business using traditional methods—employing both animal-powered and stone-based oil presses (chekku).'}
            </p>

            <p>
              {isTa
                ? 'ஆரம்பத்திலிருந்தே சீரான தரம், தூய்மை மற்றும் வாடிக்கையாளர்களின் நம்பிக்கையை முதன்மையாகக் கொண்டு இந்த தொழில் கட்டமைக்கப்பட்டது.'
                : 'From the very beginning, the business was built upon the pillars of consistent quality, purity, and the trust of our customers.'}
            </p>

            <p className="font-semibold text-forest-950">
              {isTa
                ? 'அவர் விதைத்த பாரம்பரிய விதை, இன்று மூன்று தலைமுறைகளைக் கடந்து தழைத்தோங்கி வளர்ந்துள்ளது.'
                : 'The seeds of tradition he sowed have flourished, now spanning three generations.'}
            </p>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 2. OUR JOURNEY THROUGH GENERATIONS                           */}
        {/* ============================================================ */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-cream-300 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-xs border border-emerald-200">
              2
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                {isTa ? 'தலைமுறை கடந்த வளர்ச்சி' : 'Three Epochs of Excellence'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
                {isTa ? 'தலைமுறைகள் கடந்த எங்கள் பயணம்' : 'Our Journey Through Generations'}
              </h2>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            {/* Generation 1 */}
            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-amber-200/90 shadow-2xs relative flex flex-col justify-between hover:border-amber-400 transition-colors">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 font-mono">
                  1982
                </span>
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  {isTa ? 'முதல் தலைமுறை – திரு. ராஜி செட்டியார்' : 'First Generation – Mr. Raji Chettiar (1982)'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {isTa
                    ? 'எங்கள் குடும்பத்தின் எண்ணெய் உற்பத்தி தொழிலுக்கு அடித்தளமிட்டவர். பாரம்பரிய மாட்டுச் செக்கு மற்றும் கல் செக்கு மூலம் எண்ணெய் எடுத்து, தரம் மற்றும் நம்பிக்கையை எங்களது அடையாளமாக மாற்றினார்.'
                    : 'He laid the foundation for our family’s oil-production business. By initiating the traditional extraction process using animal-powered and stone presses, he established quality and trust as the hallmarks of our enterprise.'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-amber-100 flex items-center gap-1.5 text-[11px] font-bold text-amber-800">
                <History className="w-3.5 h-3.5" />
                <span>{isTa ? 'அடித்தளம் & தொடக்கம்' : 'The Foundation Stone'}</span>
              </div>
            </div>

            {/* Generation 2 */}
            <div className="p-6 rounded-2xl bg-[#FCFAF6] border border-emerald-200/90 shadow-2xs relative flex flex-col justify-between hover:border-emerald-400 transition-colors">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 font-mono">
                  {isTa ? 'இரண்டாம் தலைமுறை' : 'Second Generation'}
                </span>
                <h3 className="font-serif text-lg font-bold text-forest-950">
                  {isTa ? 'இரண்டாம் தலைமுறை – திரு. ரா. சேகர் செட்டியார்' : 'Second Generation – Mr. Ra. Sekar Chettiar'}
                </h3>
                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {isTa
                    ? 'முன்னோர்கள் கற்றுத்தந்த பாரம்பரியத்தையும் தொழில் நெறிமுறைகளையும் சிறிதும் மாறாமல் காத்து, அடுத்த தலைமுறைக்கு எண்ணெய் உற்பத்தி தொழிலை வழிநடத்திச் சென்றார்.'
                    : 'Upholding the traditions and business ethics established by his predecessors, he carried the oil-production legacy forward to the next generation.'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-emerald-100 flex items-center gap-1.5 text-[11px] font-bold text-emerald-800">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>{isTa ? 'பாரம்பரியப் பாதுகாப்பு' : 'Preserving the Ethos'}</span>
              </div>
            </div>

            {/* Generation 3 */}
            <div className="p-6 rounded-2xl bg-gradient-to-br from-[#132A13] to-[#1C3B1C] text-cream-100 shadow-md relative flex flex-col justify-between border border-[#D4AF37]/40">
              <div className="space-y-3">
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#D4AF37] text-forest-950 font-mono shadow-xs">
                  2025
                </span>
                <h3 className="font-serif text-lg font-bold text-[#F3E5AB]">
                  {isTa ? 'மூன்றாம் தலைமுறை – S.S. AGRO FOODS' : 'Third Generation – S.S. AGRO FOODS (2025)'}
                </h3>
                <p className="text-xs sm:text-sm text-cream-200/90 leading-relaxed">
                  {isTa
                    ? 'முன்னோர்கள் வளர்த்த பாரம்பரியத்தையும் தரத்தையும் கட்டிக்காத்து, இன்றைய நவீன வணிக வளர்ச்சிக்கு ஏற்ப குடும்பத் தொழிலை அடுத்த கட்டத்திற்கு எடுத்துச் செல்ல 2025-ல் "S.S. AGRO FOODS" என்ற புதிய பெயரில் தொடங்கினோம்.'
                    : 'Preserving the heritage and quality established by our ancestors, while embracing modern business growth, we launched under the new identity "S.S. AGRO FOODS" in 2025 to take our family business to the next level.'}
                </p>
                <p className="text-[11px] sm:text-xs text-[#E8DCC4] font-medium pt-1">
                  {isTa
                    ? 'எங்கள் பாரம்பரியத்தைப் பாதுகாப்பது மட்டுமல்லாமல், அனைத்து மக்களுக்கும் உயர்தர உணவுப் பொருட்களைக் கொண்டு சேர்ப்பதே எங்கள் நோக்கம்.'
                    : 'Our mission is not only to safeguard our traditions but also to bring high-quality food products to a wider community.'}
                </p>
              </div>
              <div className="pt-4 mt-4 border-t border-white/10 flex items-center gap-1.5 text-[11px] font-bold text-[#D4AF37]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{isTa ? 'நவீன வளர்ச்சி & தரம்' : 'Modern Growth & Purity'}</span>
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================ */}
        {/* 3. FROM FARM TO FAMILY                                       */}
        {/* ============================================================ */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-cream-300 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-xs border border-amber-200">
              3
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                {isTa ? 'விவசாயிகளுடன் நேரடி உறவு' : 'Rooted in Native Agriculture'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
                {isTa ? 'விவசாய நிலத்திலிருந்து உங்கள் குடும்பத்திற்கு' : 'From Farm to Family'}
              </h2>
            </div>
          </div>

          <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
            <p>
              {isTa
                ? 'விவசாயமே நாட்டின் முதுகெலும்பு என்பதை உணர்ந்து, விவசாயிகளை எங்கள் உற்பத்திப் பயணத்தின் மையப்புள்ளியாக வைத்துள்ளோம்.'
                : 'Recognizing that agriculture is the foundation of our nation, we place farmers at the heart of our production journey.'}
            </p>

            <p>
              {isTa
                ? 'எண்ணெய் உற்பத்திக்குத் தேவையான விவசாய மூலப்பொருட்களை விவசாயிகளிடமிருந்து நேரடியாகவே கொள்முதல் செய்கிறோம்.'
                : 'We source the agricultural raw materials required for our oil production directly from farmers.'}
            </p>

            <p>
              {isTa
                ? 'அவற்றை எங்கள் ஆலையில் சுத்தப்படுத்தி, பாரம்பரிய முறைப்படி தரமாக எண்ணெய்களாக மாற்றி வாடிக்கையாளர்களுக்கு வழங்குகிறோம்.'
                : 'These raw materials are cleaned at our facility and processed using traditional, proper production methods to create the oils we provide to our customers.'}
            </p>

            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center gap-3 text-emerald-950 font-semibold text-sm sm:text-base mt-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0" />
              <span>
                {isTa
                  ? 'எங்கள் முதன்மை நோக்கம்: உயர்தரமான பொருட்களை நியாயமான விலையில் மக்களுக்கு வழங்குவது.'
                  : 'Our primary objective is to deliver high-quality products at fair and reasonable prices.'}
              </span>
            </div>
          </div>

          {/* 3 Step Flow */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
            <div className="p-4 rounded-xl bg-cream-50 border border-cream-200 text-center space-y-2">
              <Wheat className="w-6 h-6 text-amber-700 mx-auto" />
              <h4 className="font-serif font-bold text-sm text-forest-950">
                {isTa ? '1. நேரடி கொள்முதல்' : '1. Direct Sourcing'}
              </h4>
              <p className="text-xs text-stone-600">
                {isTa
                  ? 'விவசாயிகளிடமிருந்து நேரடியாக தேர்வு செய்யப்படும் முதல் தர விதைகள்'
                  : 'Procured straight from authentic local farmers at fair compensation'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cream-50 border border-cream-200 text-center space-y-2">
              <Droplets className="w-6 h-6 text-emerald-700 mx-auto" />
              <h4 className="font-serif font-bold text-sm text-forest-950">
                {isTa ? '2. மரச்செக்கு தயாரிப்பு' : '2. Traditional Milling'}
              </h4>
              <p className="text-xs text-stone-600">
                {isTa
                  ? 'சுத்திகரிக்கப்பட்டு வாகை மரச்செக்கில் மெதுவாக ஆட்டப்படும் தூய முறை'
                  : 'Cleaned at our facility and cold-pressed with zero heat or chemicals'}
              </p>
            </div>

            <div className="p-4 rounded-xl bg-cream-50 border border-cream-200 text-center space-y-2">
              <HeartHandshake className="w-6 h-6 text-[#D4AF37] mx-auto" />
              <h4 className="font-serif font-bold text-sm text-forest-950">
                {isTa ? '3. நியாயமான விலை' : '3. Honest Family Price'}
              </h4>
              <p className="text-xs text-stone-600">
                {isTa
                  ? 'இடைத்தரகர்கள் இன்றி உங்கள் வீட்டிற்கு நேரடியாக வரும் தூய்மை'
                  : 'Delivered directly to households at reasonable, authentic pricing'}
              </p>
            </div>
          </div>
        </section>

        {/* ============================================================ */}
        {/* 4. OUR PRODUCTS                                              */}
        {/* ============================================================ */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-cream-300 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-xs border border-amber-200">
              4
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                {isTa ? 'தூய மரச்செக்கு வகைகள்' : 'Pure Offerings'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
                {isTa ? 'எங்கள் தயாரிப்புகள்' : 'Our Products'}
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-stone-600 mb-8">
            {isTa
              ? 'எங்கள் பாரம்பரிய எண்ணெய் உற்பத்தி வரிசையில் முதன்மையான தயாரிப்புகள்:'
              : 'Key offerings in our traditional oil production range include:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* 1. Groundnut Oil */}
            <div className="p-5 rounded-2xl bg-cream-50/70 border border-cream-200 flex flex-col items-center text-center space-y-3 hover:border-amber-400 transition-colors">
              <div className="h-32 w-24 flex items-center justify-center">
                <img
                  src="/products/groundnut_oil.png"
                  alt="Groundnut Oil"
                  className="max-h-full max-w-full object-contain drop-shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = '/products/groundnut_oil.jpg';
                  }}
                />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                {isTa ? 'கடலை எண்ணெய்' : 'Groundnut Oil'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isTa
                  ? 'உயர்தர நிலக்கடலையை மூலப்பொருளாகப் பயன்படுத்தி தயாரிக்கப்படுகிறது.'
                  : 'Produced using high-quality groundnuts as the raw material.'}
              </p>
            </div>

            {/* 2. Coconut Oil */}
            <div className="p-5 rounded-2xl bg-cream-50/70 border border-cream-200 flex flex-col items-center text-center space-y-3 hover:border-amber-400 transition-colors">
              <div className="h-32 w-24 flex items-center justify-center">
                <img
                  src="/products/coconut_oil.png"
                  alt="Coconut Oil"
                  className="max-h-full max-w-full object-contain drop-shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = '/products/coconut_oil.jpg';
                  }}
                />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                {isTa ? 'தேங்காய் எண்ணெய்' : 'Coconut Oil'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isTa
                  ? 'இயற்கை முறையில் உலர்ந்த உயர்தர தேங்காய்களிலிருந்து எடுக்கப்படும் சுத்தமான எண்ணெய்.'
                  : 'Produced from high-quality coconuts.'}
              </p>
            </div>

            {/* 3. Sesame Oil */}
            <div className="p-5 rounded-2xl bg-cream-50/70 border border-cream-200 flex flex-col items-center text-center space-y-3 hover:border-amber-400 transition-colors">
              <div className="h-32 w-24 flex items-center justify-center">
                <img
                  src="/products/sesame_oil.png"
                  alt="Sesame Oil"
                  className="max-h-full max-w-full object-contain drop-shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = '/products/sesame_oil.jpg';
                  }}
                />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                {isTa ? 'நல்லெண்ணெய்' : 'Sesame Oil'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isTa
                  ? 'முதல்தர நாட்டு எள் கொண்டு பதமாக ஆட்டப்படும் பாரம்பரிய நல்லெண்ணெய்.'
                  : 'Traditional sesame oil, crafted using sesame seeds.'}
              </p>
            </div>

            {/* 4. Pancha Deepam Oil */}
            <div className="p-5 rounded-2xl bg-cream-50/70 border border-cream-200 flex flex-col items-center text-center space-y-3 hover:border-amber-400 transition-colors">
              <div className="h-32 w-24 flex items-center justify-center">
                <img
                  src="/products/lamp_oil.png"
                  alt="Pancha Deepam Oil"
                  className="max-h-full max-w-full object-contain drop-shadow-sm"
                  onError={(e) => {
                    e.currentTarget.src = '/products/lamp_oil.jpg';
                  }}
                />
              </div>
              <h3 className="font-serif font-bold text-base text-forest-950">
                {isTa ? 'பஞ்ச தீபம் எண்ணெய்' : 'Pancha Deepam Oil'}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isTa
                  ? 'நமது பாரம்பரிய வழிபாட்டிற்கும் ஆன்மீக சடங்குகளுக்கும் உகந்த சிறப்பு எண்ணெய் கலவை.'
                  : 'A special blend of oils used for traditional rituals and worship.'}
              </p>
            </div>

          </div>
        </section>

        {/* ============================================================ */}
        {/* 5. OUR VALUES                                                */}
        {/* ============================================================ */}
        <section className="bg-white rounded-3xl p-6 sm:p-10 lg:p-12 border border-cream-300 shadow-sm relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-xs border border-emerald-200">
              5
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                {isTa ? 'எங்கள் 5 அடிப்படைக் கொள்கைகள்' : 'Guiding Pillars'}
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
                {isTa ? 'எங்கள் கொள்கைகள்' : 'Our Values'}
              </h2>
            </div>
          </div>

          <p className="text-sm sm:text-base text-stone-600 mb-8">
            {isTa
              ? 'எங்கள் வணிகம் ஐந்து அடிப்படைக் கொள்கைகளின் மீது உறுதியாகக் கட்டமைக்கப்பட்டுள்ளது:'
              : 'Our business is built upon five core principles:'}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            
            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                1
              </div>
              <h4 className="font-serif font-bold text-sm text-forest-950">
                {isTa ? 'தரம் (Quality)' : 'Quality'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isTa
                  ? 'உயர்தர மூலப்பொருட்கள் மற்றும் தயாரிப்பு முறைக்கு முதலிடம்.'
                  : 'Prioritizing high-quality raw materials and production standards.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                2
              </div>
              <h4 className="font-serif font-bold text-sm text-forest-950">
                {isTa ? 'தூய்மை (Purity)' : 'Purity'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isTa
                  ? 'மூலப்பொருட்களை நன்றாகச் சுத்தப்படுத்தி, சரியான முறையில் தயார் செய்தல்.'
                  : 'Ensuring raw materials are thoroughly cleaned and processed using proper methods.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                3
              </div>
              <h4 className="font-serif font-bold text-sm text-forest-950">
                {isTa ? 'நம்பிக்கை (Trust)' : 'Trust'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isTa
                  ? 'வாடிக்கையாளர்களுடன் நீண்டகால நல்லுறவை வளர்த்தல்.'
                  : 'Building long-lasting relationships with our customers.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                4
              </div>
              <h4 className="font-serif font-bold text-sm text-forest-950">
                {isTa ? 'நியாயமான விலை' : 'Fair Price'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isTa
                  ? 'தரமான பொருட்களை சரியான, நியாயமான விலையில் வழங்குதல்.'
                  : 'Offering high-quality products at reasonable, honest prices.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-cream-50 border border-cream-200 space-y-2">
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs">
                5
              </div>
              <h4 className="font-serif font-bold text-sm text-forest-950">
                {isTa ? 'பாரம்பரியம் (Tradition)' : 'Tradition'}
              </h4>
              <p className="text-xs text-stone-600 leading-relaxed">
                {isTa
                  ? 'முன்னோர்கள் வழியில் வணிக நெறிமுறைகளைக் கடைப்பிடித்தல்.'
                  : 'Preserving and upholding the business ethics and practices followed by our ancestors.'}
              </p>
            </div>

          </div>
        </section>

        {/* ============================================================ */}
        {/* 6. OUR MISSION & 7. OUR VISION                               */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* 6. Our Mission */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-xs border border-amber-200">
                  6
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 block">
                    {isTa ? 'எங்கள் குறிக்கோள்' : 'Purpose in Action'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
                    {isTa ? 'எங்கள் இலக்கு' : 'Our Mission'}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
                <p>
                  {isTa
                    ? 'பாரம்பரிய எண்ணெய் உற்பத்தி முறைகளின் சிறப்பையும், ஆரோக்கியமான உணவுப் பொருட்களின் முக்கியத்துவத்தையும் மக்களிடம் கொண்டு சேர்ப்பது.'
                    : 'To share the excellence of traditional oil-making methods and the importance of high-quality food products with the community.'}
                </p>
                <p className="font-semibold text-forest-950">
                  {isTa
                    ? 'விவசாயிகளிடமிருந்து நேரடியாகப் பொருட்களைப் பெற்று, ஒவ்வொரு இல்லத்திற்கும் தரமான பொருட்களை நியாயமான விலையில் வழங்குவதே எங்களின் குறிக்கோள்.'
                    : 'Our primary goal is to procure raw materials directly from farmers and provide high-quality products to every household at a fair price.'}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-cream-200 flex items-center gap-2 text-xs font-bold text-amber-800">
              <Target className="w-4 h-4 text-amber-700" />
              <span>{isTa ? 'சமூக நலம் & விவசாய நலன்' : 'Serving Family & Farmer'}</span>
            </div>
          </section>

          {/* 7. Our Vision */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border border-cream-300 shadow-sm relative overflow-hidden flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-xs border border-emerald-200">
                  7
                </div>
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800 block">
                    {isTa ? 'எதிர்காலக் கனவு' : 'The Road Ahead'}
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950">
                    {isTa ? 'எங்கள் தொலைநோக்கு பார்வை' : 'Our Vision'}
                  </h2>
                </div>
              </div>

              <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed">
                <p>
                  {isTa
                    ? '1982-ல் தொடங்கிய எங்கள் குடும்பத் தொழிலின் பாரம்பரியத்தை வருங்கால தலைமுறைகளுக்கும் கடத்துவது.'
                    : 'To carry forward the legacy of our family business—which began in 1982—to future generations.'}
                </p>
                <p className="font-semibold text-forest-950">
                  {isTa
                    ? 'தமிழகம் முழுவதும் S.S. AGRO FOODS நிறுவனத்தை நிலைநிறுத்தி, எதிர்காலத்தில் பாரம்பரிய எண்ணெய்கள் மற்றும் உணவுப் பொருட்களுக்கான அகில இந்திய நம்பிக்கைக்குரிய பிராண்டாக உயர்த்துவதே எங்களின் தொலைநோக்குப் பார்வை.'
                    : 'Our vision is to establish S.S. AGRO FOODS throughout Tamil Nadu and, in the future, grow it into a trusted, pan-Indian brand for food products and traditional oils.'}
                </p>
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-cream-200 flex items-center gap-2 text-xs font-bold text-emerald-800">
              <Compass className="w-4 h-4 text-emerald-700" />
              <span>{isTa ? 'அகில இந்திய நம்பிக்கை பிராண்ட்' : 'Pan-Indian Traditional Excellence'}</span>
            </div>
          </section>

        </div>

        {/* ============================================================ */}
        {/* 8. OUR PROMISE                                               */}
        {/* ============================================================ */}
        <section className="rounded-3xl p-6 sm:p-10 lg:p-12 bg-gradient-to-br from-[#132A13] via-[#1B3B1B] to-[#132A13] text-cream-100 border-2 border-[#D4AF37]/60 shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-80 h-80 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#D4AF37] text-forest-950 flex items-center justify-center font-serif font-black text-xl shrink-0 shadow-md">
                8
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37] block">
                  {isTa ? 'எங்கள் புனித வாக்குறுதி' : 'Our Sacred Pledge'}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif font-bold text-white">
                  {isTa ? 'எங்கள் வாக்குறுதி' : 'Our Promise'}
                </h2>
              </div>
            </div>

            <div className="space-y-4 text-cream-200 text-sm sm:text-base leading-relaxed max-w-3xl">
              <p>
                {isTa
                  ? '1982-ல் தாத்தா திரு. ராஜி செட்டியார் அவர்களால் தொடங்கப்பட்டு, அப்பா திரு. ரா. சேகர் செட்டியார் அவர்களால் வளர்க்கப்பட்ட எங்கள் தொழில் பயணம், இன்று S.S. AGRO FOODS என்ற பெயரில் புதிய பாதையில் நடைபோடுகிறது.'
                  : 'The business journey, initiated by our grandfather, Mr. Raji Chettiar, in 1982, was further nurtured by our father, Mr. Ra. Sekar Chettiar. Today, it continues on a new path of growth under the name S.S. AGRO FOODS.'}
              </p>

              <p className="font-serif italic text-base sm:text-lg text-white font-medium">
                {isTa
                  ? 'தலைமுறைகள் மாறினாலும், எங்களின் அடிப்படைக் கொள்கைகள் என்றும் மாறுவதில்லை.'
                  : 'While generations may change, our core principles remain the same.'}
              </p>

              <p className="text-[#F3E5AB] font-semibold">
                {isTa
                  ? 'தரம், உண்மை, நம்பிக்கை, பாரம்பரியம் ஆகியவற்றை என்றும் நிலைநிறுத்துவோம்; நீங்கள் எங்கள் மீது வைத்துள்ள நம்பிக்கையைக் காப்பாற்றுவோம் என உறுதி கூறுகிறோம்!'
                  : 'We pledge to uphold quality, integrity, trust, and tradition, ensuring that we always honor the confidence our customers place in us.'}
              </p>
            </div>

            {/* Prominent Hallmark Seal */}
            <div className="pt-8 mt-6 border-t border-white/15">
              <div className="rounded-2xl bg-white/10 backdrop-blur-xs p-6 sm:p-8 border border-[#D4AF37]/50 text-center space-y-3">
                <span className="font-serif text-2xl sm:text-4xl font-black tracking-widest text-[#D4AF37] block drop-shadow-sm">
                  S.S. AGRO FOODS
                </span>
                <p className="font-serif italic text-base sm:text-xl text-white font-medium">
                  {isTa
                    ? 'மூன்று தலைமுறைகள். ஒரே பாரம்பரியம். மாறாத நம்பிக்கை.'
                    : 'Three Generations. One Tradition. Unchanging Trust.'}
                </p>
                <p className="text-xs sm:text-sm font-mono tracking-wider text-[#E8DCC4] uppercase">
                  {isTa
                    ? '1982 முதல் தொடரும் பாரம்பரியம்... 2025 முதல் மலரும் புதிய வளர்ச்சிப் பயணம்!'
                    : 'A legacy spanning from 1982... A new journey of growth beginning in 2025!'}
                </p>
              </div>
            </div>

            {/* Call to action to shop oils */}
            {onViewAllProducts && (
              <div className="pt-4 text-center">
                <button
                  type="button"
                  onClick={onViewAllProducts}
                  className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-forest-950 font-extrabold text-sm uppercase tracking-wider transition-all duration-300 shadow-lg hover:shadow-xl cursor-pointer"
                >
                  <span>{isTa ? 'எங்கள் தயாரிப்புகளைக் காணுங்கள்' : 'Explore Our Traditional Oils'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
};
