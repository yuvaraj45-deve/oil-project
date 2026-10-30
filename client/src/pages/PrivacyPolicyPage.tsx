import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2, ChevronRight, Phone, Mail, UserCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface PrivacyPolicyPageProps {
  onNavigate?: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  const { language } = useLanguage();

  const handleNav = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      window.location.pathname = path;
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF8F5] text-stone-900 pb-20">
      
      {/* 1. Breadcrumbs */}
      <div className="bg-white border-b border-stone-200/60">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between text-xs">
          <nav className="flex items-center gap-2 text-stone-500 overflow-x-auto whitespace-nowrap">
            <button
              onClick={() => handleNav('/')}
              className="hover:text-forest-950 font-medium transition-colors cursor-pointer"
            >
              {language === 'ta' ? 'முகப்பு' : 'Home'}
            </button>
            <ChevronRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
            <span className="text-forest-950 font-semibold truncate">
              {language === 'ta' ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy'}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Header */}
      <section className="bg-forest-950 text-cream-100 py-12 sm:py-16 border-b border-forest-900 relative overflow-hidden">
        <div className="absolute -left-20 -top-20 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-900 text-gold-300 border border-gold-500/30 text-xs font-bold uppercase tracking-wider">
            <Lock className="w-3.5 h-3.5 text-gold-400" />
            <span>{language === 'ta' ? 'பாதுகாப்பு & வெளிப்படைத்தன்மை' : 'Data Protection & Transparency'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
            {language === 'ta' ? 'தனியுரிமைக் கொள்கை' : 'Privacy Policy'}
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {language === 'ta'
              ? 'உங்கள் தனிப்பட்ட தகவல்களை நாங்கள் எவ்வாறு சேகரிக்கிறோம், பாதுகாக்கிறோம் மற்றும் மதிக்கிறோம் என்பதை விளக்கும் வெளிப்படையான தனியுரிமைக் கொள்கை. உங்கள் தகவல்கள் ஒருபோதும் மூன்றாம் நபர்களுக்கு விற்கப்படாது.'
              : 'At SS OIL, your trust is as pure as our oil. Learn how we protect, store, and utilize your personal information with enterprise-grade encryption and zero spam tolerance.'}
          </p>

          <p className="text-[11px] text-stone-400 font-mono">
            {language === 'ta' ? 'கடைசியாக புதுப்பிக்கப்பட்டது: அக்டோபர் 2026' : 'Last Updated: October 2026 • Compliant with DPDP Act 2023 & IT Act 2000'}
          </p>
        </div>
      </section>

      {/* 3. Privacy Trust Badges */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-md flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <EyeOff className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-forest-950">Zero Data Selling</h3>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                {language === 'ta' ? 'விளம்பர நிறுவனங்களுக்கு எக்காரணத்தைக் கொண்டும் தரவுகள் பகிரப்படாது.' : 'We never sell or rent your contact details to telemarketers.'}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-md flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-forest-950">256-bit SSL Encryption</h3>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                {language === 'ta' ? 'அனைத்து பரிவர்த்தனைகளும் மிக உயர்ந்த பாதுகாப்புடன் குறியாக்கம் செய்யப்படுகிறது.' : 'Bank-grade encrypted checkout and secure tokenized payments.'}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-md flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <UserCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-forest-950">Customer Data Control</h3>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                {language === 'ta' ? 'உங்கள் கணக்கு விவரங்களை எப்போது வேண்டுமானாலும் நீக்க உரிமை உண்டு.' : 'Full rights to access, update, or permanently purge your profile.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Detailed Policy Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">

        {/* Section 1: Information We Collect */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">1</span>
            <span>{language === 'ta' ? 'நாங்கள் சேகரிக்கும் தகவல்கள்' : 'Information We Collect'}</span>
          </h2>
          
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3 pt-1">
            <p>
              {language === 'ta'
                ? 'உங்கள் ஆர்டரை சரியாக செயலாக்கி உங்கள் வீட்டு வாசலுக்கு டெலிவரி செய்வதற்கு மட்டுமே தேவையான குறைந்தபட்ச தகவல்களை நாங்கள் சேகரிக்கிறோம்:'
                : 'To deliver your cold-pressed edible oils efficiently and keep you updated on dispatch progress, we collect only necessary fulfillment data:'}
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-stone-700">
              <li>
                <strong>{language === 'ta' ? 'தொடர்பு & முகவரி விவரங்கள்:' : 'Contact & Shipping Data:'}</strong> {language === 'ta' ? 'முழு பெயர், டெலிவரி முகவரி, பின்கோடு, தொலைபேசி எண் மற்றும் மின்னஞ்சல் முகவரி.' : 'Full name, shipping address, landmark, PIN code, mobile phone number, and email address.'}
              </li>
              <li>
                <strong>{language === 'ta' ? 'ஆர்டர் வரலாறு:' : 'Order & Purchase History:'}</strong> {language === 'ta' ? 'வாங்கிய பொருட்கள், பேக்கிங் அளவு, விலைப்பட்டியல் மற்றும் டெலிவரி நிலை.' : 'Items purchased, pack sizes chosen, invoice copies, and courier tracking identifiers.'}
              </li>
              <li>
                <strong>{language === 'ta' ? 'பேமெண்ட் விவரங்கள்:' : 'Payment Processing:'}</strong> {language === 'ta' ? 'கார்டு எண், CVV அல்லது UPI PIN போன்ற ரகசிய தகவல்களை நாங்கள் சேமிப்பது இல்லை. அவை ரிசர்வ் வங்கி அங்கீகரித்த கட்டண நுழைவாயில்கள் (Payment Gateways) மூலம் பாதுகாப்பாக பரிசீலிக்கப்படுகின்றன.' : 'We do NOT store or see your debit/credit card numbers, CVVs, or UPI PINs. All payments are securely tokenized through RBI-authorized, PCI-DSS Level 1 certified gateways.'}
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: How We Use Information */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">2</span>
            <span>{language === 'ta' ? 'தகவல்கள் எவ்வாறு பயன்படுத்தப்படுகின்றன' : 'How We Use Your Personal Data'}</span>
          </h2>
          
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3 pt-1">
            <p>
              {language === 'ta'
                ? 'சேகரிக்கப்படும் தகவல்கள் பின்வரும் நன்மையான காரியங்களுக்கு மட்டுமே பயன்படுத்தப்படுகின்றன:'
                : 'Your personal information is used strictly to provide reliable service and maintain high fulfillment standards:'}
            </p>
            <ul className="space-y-2 text-stone-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'ta' ? 'ஆர்டர்களை பேக் செய்து, கொரியர் மூலம் உங்கள் வீட்டுக்கு பாதுகாப்பாக டெலிவரி செய்ய.' : 'To process, package, and safely dispatch your pure oil orders directly to your address.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'ta' ? 'ஆர்டர் உறுதிப்படுத்தல் மற்றும் லைவ் டிராக்கிங் தகவல்களை வாட்ஸ்அப் / SMS மூலம் அனுப்ப.' : 'To transmit automated WhatsApp, SMS, and email shipping updates and tracking links.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'ta' ? 'வாடிக்கையாளர் ஆதரவு, ஆர்டர் ரத்து மற்றும் திருப்புதல் கோரிக்கைகளை உடனடியாக தீர்க்க.' : 'To provide responsive customer support and resolve order inquiries promptly.'}</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>{language === 'ta' ? 'ஜிஎஸ்டி மற்றும் சட்டப்பூர்வ தணிக்கை ஆவணங்களை பராமரிக்க.' : 'To generate statutory GST tax invoices and comply with Indian commercial accounting regulations.'}</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3: Browser Cookies & Storage */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">3</span>
            <span>{language === 'ta' ? 'குக்கீகள் & பிரவுசர் சேமிப்பு (Cookies & Session Storage)' : 'Cookies & Browser Storage'}</span>
          </h2>
          
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-2 pt-1">
            <p>
              {language === 'ta'
                ? 'உங்கள் ஷாப்பிங் கார்ட்டில் சேர்த்த பொருட்கள் மறைந்துவிடாமல் இருக்கவும், உங்கள் மொழி விருப்பம் (தமிழ்/ஆங்கிலம்) மற்றும் விருப்பப் பட்டியல் (Favorites) சேமிக்க மட்டுமே பிரவுசர் லோக்கல் ஸ்டோரேஜ் பயன்படுத்தப்படுகிறது.'
                : 'We use essential, lightweight client-side storage to preserve your active cart items, chosen language preference (Tamil / English), and favorite oils across page visits. We do NOT use invasive cross-site tracking cookies.'}
            </p>
          </div>
        </div>

        {/* Section 4: Customer Rights & Grievance */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">4</span>
            <span>{language === 'ta' ? 'உங்கள் உரிமைகள் & குறைதீர்க்கும் அதிகாரி' : 'Your Rights & Grievance Redressal'}</span>
          </h2>
          
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3 pt-1">
            <p>
              {language === 'ta'
                ? 'டிஜிட்டல் தனிநபர் தரவு பாதுகாப்புச் சட்டம் 2023 (DPDP Act)-இன் படி, உங்கள் தனிப்பட்ட தகவல்களை மதிப்பாய்வு செய்யவும், திருத்தவும், அல்லது எங்கள் தளத்திலிருந்து நிரந்தரமாக நீக்கவும் உங்களுக்கு முழு உரிமை உள்ளது.'
                : 'Under the Digital Personal Data Protection Act (DPDP Act), you possess the unconditional right to review, rectify, or request permanent erasure of your personal records from our database.'}
            </p>

            <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-1">
              <strong className="text-forest-950 block text-xs">Grievance & Data Redressal Desk:</strong>
              <p className="text-xs text-stone-600">
                Customer Redressal Officer, SS OIL Mills & Packing Facility, Tamil Nadu – 636004.<br />
                Direct Email: <a href="mailto:privacy@ssoil.in" className="text-emerald-700 font-bold hover:underline">privacy@ssoil.in</a> | Phone: +91 98765 43210
              </p>
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};

