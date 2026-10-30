import React from 'react';
import { Scale, FileCheck, ShieldAlert, Award, ChevronRight, Phone, Mail, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface TermsOfServicePageProps {
  onNavigate?: (path: string) => void;
}

export const TermsOfServicePage: React.FC<TermsOfServicePageProps> = ({ onNavigate }) => {
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
              {language === 'ta' ? 'சேவை விதிமுறைகள் & நிபந்தனைகள்' : 'Terms of Service'}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Header */}
      <section className="bg-forest-950 text-cream-100 py-12 sm:py-16 border-b border-forest-900 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-900 text-gold-300 border border-gold-500/30 text-xs font-bold uppercase tracking-wider">
            <Scale className="w-3.5 h-3.5 text-gold-400" />
            <span>{language === 'ta' ? 'சட்டப்பூர்வ வெளிப்படைத்தன்மை' : 'Fair Terms & Transparency'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
            {language === 'ta' ? 'சேவை விதிமுறைகள் & நிபந்தனைகள்' : 'Terms of Service'}
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {language === 'ta'
              ? 'SS OIL டிஜிட்டல் தளம் மற்றும் எங்களின் தூய மரச்செக்கு சமையல் எண்ணெய்களை வாங்குவதற்கான தெளிவான, நியாயமான நிபந்தனைகள்.'
              : 'Clear, transparent terms governing the purchase of authentic Mara Chekku cold-pressed oils from SS OIL and your usage of our digital storefront.'}
          </p>

          <p className="text-[11px] text-stone-400 font-mono">
            {language === 'ta' ? 'கடைசியாக புதுப்பிக்கப்பட்டது: அக்டோபர் 2026' : 'Last Updated: October 2026 • Governing Laws of Tamil Nadu, India'}
          </p>
        </div>
      </section>

      {/* 3. Core Commitments */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-md flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-forest-950">100% Purity Declaration</h3>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                {language === 'ta' ? 'கலப்படமற்ற தூய பாரம்பரிய எண்ணெய் தயாரிப்பு உறுதிமொழி.' : 'Zero mineral oils, chemical solvents, or synthetic dilution.'}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-md flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-forest-950">Net Volume Certified</h3>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                {language === 'ta' ? 'சட்ட அளவியல் விதிமுறைகளின்படி துல்லியமான அளவு.' : 'Packaged in certified volumetric measures (Legal Metrology).'}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-md flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <Scale className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-forest-950">Transparent Pricing</h3>
              <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
                {language === 'ta' ? 'ஜிஎஸ்டி வரி உட்பட அனைத்து விலைகளும் வெளிப்படையானவை.' : 'All retail prices inclusive of applicable GST taxes.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Detailed Terms Content */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">

        {/* Section 1: Acceptance & Pure Brand Promise */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">1</span>
            <span>{language === 'ta' ? 'விதிமுறைகளை ஏற்றுக்கொள்வது & பிராண்ட் உறுதிமொழி' : 'Acceptance of Terms & Product Authenticity'}</span>
          </h2>
          
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3 pt-1">
            <p>
              {language === 'ta'
                ? 'SS OIL தளத்தைப் பயன்படுத்துவதன் மூலமும், எங்கள் பொருட்களை ஆர்டர் செய்வதன் மூலமும், நீங்கள் இந்த விதிமுறைகளை முழுமையாக ஏற்றுக்கொள்கிறீர்கள். எங்கள் வாடிக்கையாளர்களுக்கு நாங்கள் வழங்கும் வாக்குறுதி:'
                : 'By browsing ssoil.in or placing an order, you agree to these transparent Terms of Service. Our core foundation is built upon uncompromised cold-press extraction:'}
            </p>
            <ul className="space-y-1.5 text-stone-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Authentic Vaagai Mara Chekku:</strong> We crush native oilseeds slowly in Vaagai wood pestles below 40°C without industrial heating.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Zero Chemical Refining:</strong> No caustic soda, no bleaching earth, and zero artificial preservatives or foam suppressants.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span><strong>Natural Sedimentation Note:</strong> Because genuine Mara Chekku oil is micro-filtered through natural cotton cloth without chemical clarifying agents, minor natural seed fiber sedimentation at the bottle base is natural and proves authentic unrefined quality.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 2: Pricing, Invoicing & GST */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">2</span>
            <span>{language === 'ta' ? 'விலை நிர்ணயம், பில்லிங் & ஜிஎஸ்டி (Pricing & Tax Invoices)' : 'Pricing, Billing & GST Compliance'}</span>
          </h2>
          
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3 pt-1">
            <p>
              {language === 'ta'
                ? 'தளத்தில் குறிப்பிடப்பட்டுள்ள அனைத்து விலைகளும் இந்திய அரசின் பொருந்தக்கூடிய ஜிஎஸ்டி வரிகளை உள்ளடக்கியது. ஒவ்வொரு ஆர்டருக்கும் சட்டப்பூர்வ வரி ரசீது இணைக்கப்படும்.'
                : 'All retail prices on the storefront are quoted in Indian Rupees (INR) and are fully inclusive of statutory GST. Every fulfilled order is accompanied by a compliant GST tax invoice.'}
            </p>
            <p>
              {language === 'ta'
                ? 'விவசாய விளைபொருட்களின் விலை மாற்றத்திற்கு ஏற்ப எண்ணெய் விலைகள் முன்கூட்டியே மாற்றி அமைக்கப்படலாம். நீங்கள் ஆர்டர் செய்து பணம் செலுத்திய விலையில் எந்த மாற்றமும் இருக்காது.'
                : 'Prices may be updated periodically based on agricultural seed harvest market conditions. The price confirmed at your checkout remains final and will not be altered post-order.'}
            </p>
          </div>
        </div>

        {/* Section 3: Orders, Dispatch & Delivery */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">3</span>
            <span>{language === 'ta' ? 'ஆர்டர் ரத்து & வாடிக்கையாளர் பொறுப்பு' : 'Orders, Cancellations & User Responsibility'}</span>
          </h2>
          
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3 pt-1">
            <p>
              {language === 'ta'
                ? 'எங்கள் தளத்தில் வழங்கப்பட்டுள்ள பிரத்யேக ஆர்டர் ரத்து பக்கம் வழியாக, பார்சல் அனுப்பப்படுவதற்கு முன் உங்கள் ஆர்டரை எளிதாக ரத்து செய்யலாம்.'
                : 'You may cancel any pending order prior to courier dispatch directly via our dedicated Order Cancellation page or by contacting customer support.'}
            </p>
            <p>
              {language === 'ta'
                ? 'சரியான டெலிவரி முகவரி, பின்கோடு மற்றும் வேலை செய்யும் மொபைல் எண்ணை வழங்குவது வாடிக்கையாளரின் பொறுப்பாகும்.'
                : 'Customers are responsible for providing complete shipping coordinates and an active mobile number to facilitate timely courier OTP handovers.'}
            </p>
          </div>
        </div>

        {/* Section 4: Jurisdiction & Governing Law */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="font-serif font-bold text-xl text-forest-950 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">4</span>
            <span>{language === 'ta' ? 'சட்ட வரம்பு & ஆளுகை (Governing Law & Jurisdiction)' : 'Governing Law & Legal Jurisdiction'}</span>
          </h2>
          
          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-2 pt-1">
            <p>
              {language === 'ta'
                ? 'இந்த விதிமுறைகள் இந்தியச் சட்டங்களுக்கு உட்பட்டவை. ஏதேனும் தகராறுகள் அல்லது சட்டரீதியான கேள்விகள் எழுந்தால், அது தமிழ்நாடு நீதிமன்றங்களின் அதிகார வரம்பிற்கு உட்பட்டது.'
                : 'These terms and conditions are governed by and construed in accordance with the laws of the Republic of India. Any disputes arising out of the purchase of products shall be subject to the exclusive jurisdiction of the competent courts in Tamil Nadu, India.'}
            </p>
            <div className="pt-2 text-xs text-stone-500">
              Regulatory Inquiries: <a href="mailto:legal@ssoil.in" className="text-emerald-700 font-bold hover:underline">legal@ssoil.in</a> | SS OIL Mills & Packing Facility
            </div>
          </div>
        </div>

      </section>

    </div>
  );
};
