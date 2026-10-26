import React from 'react';
import { CraftsmanshipVisualizer } from '../components/CraftsmanshipVisualizer';
import { Compass, ShieldCheck, Flame, Droplets, Award, ArrowRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface MillJourneyPageProps {
  onShopOils: () => void;
}

export const MillJourneyPage: React.FC<MillJourneyPageProps> = ({ onShopOils }) => {
  const { language } = useLanguage();

  return (
    <div className="bg-cream-50/50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-forest-950 text-cream-100 py-16 px-4 text-center border-b border-forest-900 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gold-400/10 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-900 border border-gold-500/30 text-gold-300 text-xs font-bold uppercase tracking-widest">
            <Compass className="w-3.5 h-3.5 text-gold-400" />
            <span>{language === 'ta' ? 'தலைமுறை பாரம்பரிய கைவினை' : 'Generational Craftsmanship'}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-serif font-black tracking-tight text-white">
            {language === 'ta' ? 'புனித வாகை மரச்செக்கு பயணம்' : 'The Sacred Mara Chekku Journey'}
          </h1>
          <p className="text-stone-300 text-sm sm:text-base max-w-2xl mx-auto leading-relaxed font-light">
            {language === 'ta'
              ? 'சேலம் மில்லில் இயற்கை விதைகள் 14 RPM மெதுவான சுழற்சியில் வாகை மர உலக்கையால் எந்த ஒரு வெப்பமோ, ரசாயனமோ இன்றி எவ்வாறு சொட்டு சொட்டாக வடிக்கப்படுகிறது என்பதை காணுங்கள்.'
              : 'Step inside our Salem mill and witness how raw sun-dried farmer pods are slowly cold-churned at 14 RPM using Vaagai wood mortars without artificial heat or chemical solvents.'}
          </p>
        </div>
      </div>

      {/* Interactive 5-Stage Craftsmanship Visualizer */}
      <CraftsmanshipVisualizer />

      {/* Deep-Dive Technical Facts */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="font-serif text-3xl font-bold text-forest-950">
            {language === 'ta' ? 'வாகை மரம் ஏன் முக்கியமானது?' : 'Why Vaagai Wood (Albizia Lebbeck) Matters'}
          </h2>
          <p className="text-stone-600 text-sm mt-2">
            {language === 'ta'
              ? 'பழங்கால சித்த மருத்துவத்தில், வாகை மரம் வெப்பத்தை உறிஞ்சும் இயற்கை பண்பு கொண்டதாக போற்றப்படுகிறது.'
              : 'In ancient Siddha medicine, Vaagai wood is revered as a natural heat-absorber.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Droplets className="w-5 h-5 text-gold-600" />
            </div>
            <h3 className="font-serif font-bold text-lg text-forest-950">
              {language === 'ta' ? 'குறைந்த உராய்வு வெப்பம் (< 38°C)' : 'Low Friction Heat (< 38°C)'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'ta'
                ? 'நவீன ஸ்டீல் எக்ஸ்பெல்லர்கள் எண்ணெயை 120°C வரை சூடாக்கி சத்துக்களை அழிக்கிறது. எங்கள் வாகை மர உலக்கை வெறும் 14 RPM வேகத்தில் சுழன்று குளிர்ச்சியை பராமரிக்கிறது.'
                : 'Modern steel expellers heat oil to 120°C, burning away volatile nutrients. Our heavy wooden pestles rotate at only 14 RPM, keeping extraction temperature completely cold.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-serif font-bold text-lg text-forest-950">
              {language === 'ta' ? 'பூஜ்ஜிய ரசாயன சுத்திகரிப்பு' : 'Zero Chemical Bleaching'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'ta'
                ? 'வணிக ரீதியான ரீஃபைண்ட் எண்ணெய்கள் காஸ்டிக் சோடா மற்றும் ஹெக்ஸேன் பயன்படுத்துகிறது. SS OIL 5 நாட்கள் இயற்கை சூரிய ஒளியில் பருத்தி துணி கொண்டு தெளிய வைக்கப்படுகிறது.'
                : 'Industrial refined oils use caustic soda, phosphoric acid, and hexane solvent. SS OIL uses 5 days of natural sunlight sedimentation through organic cotton cloths.'}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold">
              <Award className="w-5 h-5 text-blue-700" />
            </div>
            <h3 className="font-serif font-bold text-lg text-forest-950">
              {language === 'ta' ? 'உயிருள்ள இயற்கை வைட்டமின் E' : 'Living Tocopherol Vitamin E'}
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              {language === 'ta'
                ? 'GC-MS ஆய்வக முடிவுகள் ஒவ்வொரு பாட்டிலிலும் 28.4 mg / 100g இயற்கை வைட்டமின் E மற்றும் பாலிஃபீனால்கள் முழுமையாக இருப்பதை உறுதி செய்கிறது.'
                : 'GC-MS lab analysis confirms 28.4 mg / 100g of natural Vitamin E and polyphenols intact in every single bottle dispatched from our mill.'}
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="mt-12 text-center">
          <button
            onClick={onShopOils}
            className="px-8 py-4 rounded-2xl bg-forest-950 hover:bg-forest-900 text-cream-100 font-bold text-sm transition-all shadow-lg shadow-forest-950/20 inline-flex items-center gap-2 cursor-pointer"
          >
            <span>{language === 'ta' ? 'புதிய மில் பேட்ச் வாங்க' : 'Shop Fresh Mill Batches'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
