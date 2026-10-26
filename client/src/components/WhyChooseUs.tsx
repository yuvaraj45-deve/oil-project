import React from 'react';
import { ShieldCheck, Lock, Headphones, Droplet, Heart, Award, CheckCircle2 } from 'lucide-react';
import { WHY_CHOOSE_US_DATA } from '../data/oilData';
import { useLanguage } from '../context/LanguageContext';

export const WhyChooseUs: React.FC = () => {
  const { language } = useLanguage();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
      case 'Award':
        return <Award className="w-6 h-6 text-gold-500" />;
      case 'ShieldCheck':
        return <ShieldCheck className="w-6 h-6 text-emerald-600" />;
      case 'Lock':
        return <Lock className="w-6 h-6 text-forest-800" />;
      case 'Headphones':
        return <Headphones className="w-6 h-6 text-amber-600" />;
      default:
        return <Award className="w-6 h-6 text-gold-500" />;
    }
  };

  const tamilFeatures = [
    {
      badge: 'வாகை மரம்',
      title: 'பாரம்பரிய மரச்செக்கு முறை',
      description: 'வாகை மர உரலில் 42°C குறைவான அறை வெப்பநிலையில் மெதுவாக பிழியப்பட்டு சத்துக்கள் காக்கப்படுகின்றன.',
    },
    {
      badge: '100% இயற்கை',
      title: 'கலப்படமற்ற தூய்மை',
      description: 'மினரல் ஆயில், பாமாயில், அமிலங்கள் அல்லது பெட்ரோலிய கரைப்பான்கள் சிறிதும் கலக்கப்படுவதில்லை.',
    },
    {
      badge: 'நேரடி கொள்முதல்',
      title: 'முதல் தர நாட்டு விதைகள்',
      description: 'தமிழ்நாட்டு விவசாயிகளிடமிருந்து நேரடியாகத் தரம் பார்த்து பெறப்பட்ட எள், கடலை மற்றும் தேங்காய்.',
    },
    {
      badge: 'ஆய்வக சான்று',
      title: '24 தரப் பரிசோதனைகள்',
      description: 'ஒவ்வொரு பேட்சும் குறைந்த பெராக்சைடு மற்றும் பூஜ்ஜிய ரசாயனத்திற்காக ஆய்வகத்தில் சோதிக்கப்படுகிறது.',
    },
  ];

  return (
    <section id="why-us" className="py-16 sm:py-24 bg-cream-100 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold-700 uppercase tracking-widest bg-gold-100 border border-gold-300 px-3 py-1 rounded-full">
            {language === 'ta' ? 'எங்கள் தூய்மை வாக்குறுதி' : 'Our Commitment to Purity'}
          </span>
          <h2 className="text-3xl sm:text-4xl font-serif font-bold text-forest-950 mt-3 tracking-tight">
            {language === 'ta' ? 'ஏன் SS OIL-ஐத் தேர்ந்தெடுக்க வேண்டும்?' : 'Why Choose SS OIL?'}
          </h2>
          <p className="mt-3 text-stone-600 text-base sm:text-lg">
            {language === 'ta'
              ? 'உங்கள் குடும்ப ஆரோக்கியத்திற்கு ஊட்டச்சத்துக்கள் நிறைந்த தூய எண்ணெய்களை பாரம்பரிய முறையில் வழங்குகிறோம்.'
              : 'We preserve generational oil pressing methods to give your kitchen genuine, nutrient-rich purity.'}
          </p>
          <div className="w-16 h-1 bg-gold-500 mx-auto mt-4 rounded-full" />
        </div>

        {/* 4 Feature Blocks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {WHY_CHOOSE_US_DATA.map((feature, idx) => {
            const taF = tamilFeatures[idx] || {};
            const title = language === 'ta' ? taF.title : feature.title;
            const badge = language === 'ta' ? taF.badge : feature.badge;
            const description = language === 'ta' ? taF.description : feature.description;

            return (
              <div
                key={feature.title}
                className="bg-white rounded-3xl p-7 border border-cream-300/80 shadow-soft hover:shadow-card hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  {/* Icon wrapper */}
                  <div className="w-14 h-14 rounded-2xl bg-cream-100 flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-forest-900 transition-all duration-300">
                    <span className="group-hover:text-gold-400 transition-colors">
                      {getIcon(feature.iconName)}
                    </span>
                  </div>

                  <div className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-cream-200 text-stone-700 mb-2">
                    {badge}
                  </div>

                  <h3 className="font-serif text-xl font-bold text-forest-950 mb-2 group-hover:text-forest-700 transition-colors">
                    {title}
                  </h3>

                  <p className="text-stone-600 text-sm leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="pt-5 mt-6 border-t border-cream-200 flex items-center gap-1.5 text-xs font-semibold text-forest-800">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span>{language === 'ta' ? 'உறுதிசெய்யப்பட்ட தரம்' : 'Verified Standard'}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Traditional Wood-Pressed Story Card */}
        <div className="mt-16 bg-forest-900 text-cream-100 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-card border border-forest-800">
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-gold-500/10 to-transparent pointer-events-none" />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-8 space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-forest-800 text-gold-300 text-xs font-bold uppercase tracking-wider">
                <Droplet className="w-3.5 h-3.5 text-gold-400 fill-gold-400" />
                {language === 'ta' ? 'மரச்செக்கு வேறுபாடு' : 'The Mara Chekku Difference'}
              </div>
              <h3 className="text-2xl sm:text-3xl font-serif font-bold text-white tracking-tight">
                {language === 'ta'
                  ? '45°C குறைவான மெதுவான சுழற்சி vs 200°C அதிக வெப்ப சுத்திகரிப்பு'
                  : 'Slow Wood Churning Under 45°C vs Harsh High Heat Refining'}
              </h3>
              <p className="text-cream-200/90 text-sm sm:text-base leading-relaxed">
                {language === 'ta'
                  ? 'தொழிற்சாலை ரீஃபைண்ட் எண்ணெய்கள் 200°C வெப்பநிலையிலும் ஹெக்சேன் கரைப்பான்களிலும் இயற்கை வைட்டமின்களை இழக்கின்றன. SS OIL-ல் வாகை மர உரல்கள் நிதானமாக சுழன்று இயற்கை மணம், சத்துக்கள் மற்றும் சுவையை முழுமையாகத் தக்கவைக்கின்றன.'
                  : 'Industrial refined oils are subjected to over 200°C temperatures and hexane chemical solvents that eliminate natural antioxidants. At SS OIL, native wooden mortars rotate leisurely, preserving the natural fragrance, essential fatty acids, and wholesome vitality.'}
              </p>
            </div>
            
            <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <div className="bg-forest-800/80 rounded-2xl p-4 border border-forest-700/60 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-gold-500 text-forest-950 font-bold">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {language === 'ta' ? 'ஹெக்சேன் ரசாயனம் இல்லை' : 'Zero Hexane Solvents'}
                  </div>
                  <div className="text-xs text-cream-300">
                    {language === 'ta' ? 'இயற்கை மர அழுத்தப் பிழிவு' : 'Pure Physical Extraction'}
                  </div>
                </div>
              </div>

              <div className="bg-forest-800/80 rounded-2xl p-4 border border-forest-700/60 flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-500 text-white font-bold">
                  <Heart className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-sm font-bold text-white">
                    {language === 'ta' ? 'இயற்கை வைட்டமின் E சத்து' : 'Retains Natural Tocopherols'}
                  </div>
                  <div className="text-xs text-cream-300">
                    {language === 'ta' ? 'ஆன்டி-ஆக்ஸிடன்ட் நிறைந்த சமையல்' : 'Antioxidant-Rich Cooking'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
