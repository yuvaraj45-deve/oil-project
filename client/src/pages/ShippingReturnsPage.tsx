import React from 'react';
import { Truck, RotateCcw, ShieldCheck, Clock, CheckCircle2, AlertCircle, Phone, Mail, ChevronRight, PackageCheck, Headphones } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface ShippingReturnsPageProps {
  onNavigate?: (path: string) => void;
}

export const ShippingReturnsPage: React.FC<ShippingReturnsPageProps> = ({ onNavigate }) => {
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
              {language === 'ta' ? 'டெலிவரி, திருப்புதல் & மாற்றுதல் கொள்கை' : 'Shipping, Returns & Exchange Policy'}
            </span>
          </nav>
        </div>
      </div>

      {/* 2. Hero Header */}
      <section className="bg-forest-950 text-cream-100 py-12 sm:py-16 border-b border-forest-900 relative overflow-hidden">
        <div className="absolute -right-20 -bottom-20 w-80 h-80 rounded-full bg-gold-500/10 blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-forest-900 text-gold-300 border border-gold-500/30 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5 text-gold-400" />
            <span>{language === 'ta' ? 'வாடிக்கையாளர் உத்தரவாதம்' : 'Customer Delivery Promise'}</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-serif font-black tracking-tight text-white">
            {language === 'ta'
              ? 'டெலிவரி, திருப்புதல் & மாற்றுதல் கொள்கை'
              : 'Shipping, Returns & Exchange Policy'}
          </h1>

          <p className="text-stone-300 text-sm sm:text-base leading-relaxed max-w-2xl">
            {language === 'ta'
              ? 'எங்கள் பாரம்பரிய மரச்செக்கு எண்ணெய்கள் உணவு பாதுகாப்பு நெறிமுறைகளுடன் பாதுகாப்பாக பேக் செய்யப்பட்டு, உங்கள் இல்லத்திற்கு விரைவாகவும் சேதமின்றியும் கொண்டு சேர்க்கப்படுகிறது.'
              : 'Carefully extracted, fresh cold-pressed edible oils dispatched in airtight, tamper-evident food-grade canisters with 100% door-step safety guarantee across Tamil Nadu and India.'}
          </p>
        </div>
      </section>

      {/* 3. Core Policy Highlights Cards */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-md flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-forest-950">
                {language === 'ta' ? 'இலவச டெலிவரி' : 'Free Delivery Above ₹499'}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {language === 'ta' ? 'ரூ. 499-க்கு மேல் உள்ள அனைத்து ஆர்டர்களுக்கும் இலவச டெலிவரி.' : 'No delivery fee on all orders of ₹499 and above.'}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-md flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-forest-950">
                {language === 'ta' ? 'அதே நாளில் அனுப்புதல்' : 'Same-Day Mill Dispatch'}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {language === 'ta' ? 'மதியம் 2:00 மணிக்குள் வரும் ஆர்டர்கள் அன்றே அனுப்பப்படும்.' : 'Orders placed before 2:00 PM IST dispatch the same day.'}
              </p>
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-md flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif font-bold text-sm text-forest-950">
                {language === 'ta' ? 'சேதத்திற்கு உடனடி மாற்று' : 'Transit Damage Guarantee'}
              </h3>
              <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                {language === 'ta' ? 'வழியில் ஏதேனும் கசிவு ஏற்பட்டால் உடனடி புதிய பாட்டில் மாற்றித் தரப்படும்.' : 'Instant free replacement if damaged or leaking in transit.'}
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* 4. Detailed Policy Sections */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-8">

        {/* Section 1: Shipping Timelines */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <h2 className="font-serif font-bold text-xl text-forest-950">
              {language === 'ta' ? 'டெலிவரி கால அட்டவணை (Shipping Timelines)' : 'Shipping & Doorstep Delivery Timelines'}
            </h2>
          </div>

          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3 pt-2">
            <p>
              {language === 'ta'
                ? 'அனைத்து SS OIL தயாரிப்புகளும் எங்கள் பாரம்பரிய மரச்செக்கு ஆலையிலிருந்து நேரடியாக புதிய பேட்ச்களாக பேக்கிங் செய்யப்பட்டு அனுப்பப்படுகின்றன. இடைத்தரகர்கள் எவரும் கிடையாது.'
                : 'All SS OIL products are freshly wood-pressed and packed in hygienic, tamper-proof food grade packaging directly at our central extraction facility before immediate courier handover.'}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-cream-300">
                <span className="font-bold text-forest-950 block text-xs uppercase tracking-wide">
                  {language === 'ta' ? 'தமிழ்நாடு முழுவதும்:' : 'Tamil Nadu Delivery:'}
                </span>
                <span className="text-emerald-700 font-bold text-sm block mt-0.5">
                  1 – 2 Business Days
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">
                  {language === 'ta' ? 'சென்னை, கோவை, மதுரை, திருச்சி மற்றும் அனைத்து மாவட்டங்களுக்கும்.' : 'Covers Chennai, Coimbatore, Madurai, Trichy, and all tier-2 & tier-3 towns.'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-cream-300">
                <span className="font-bold text-forest-950 block text-xs uppercase tracking-wide">
                  {language === 'ta' ? 'தென்னிந்திய மாநிலங்கள் (South India):' : 'Karnataka, Kerala, AP & Telangana:'}
                </span>
                <span className="text-forest-900 font-bold text-sm block mt-0.5">
                  2 – 3 Business Days
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">
                  {language === 'ta' ? 'பெங்களூரு, ஹைதராபாத், கொச்சி போன்ற நகரங்களுக்கு விரைவு சேவை.' : 'Express surface & air line haul connections.'}
                </span>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-cream-300 sm:col-span-2">
                <span className="font-bold text-forest-950 block text-xs uppercase tracking-wide">
                  {language === 'ta' ? 'இந்தியாவின் மற்ற மாநிலங்கள் (Rest of India):' : 'Rest of India:'}
                </span>
                <span className="text-stone-700 font-bold text-sm block mt-0.5">
                  3 – 5 Business Days
                </span>
                <span className="text-[11px] text-stone-500 block mt-1">
                  {language === 'ta' ? 'மும்பை, டெல்லி, கொல்கத்தா உட்பட அனைத்து இந்திய அஞ்சல் குறியீடுகளுக்கும் அனுப்பப்படுகிறது.' : 'Blue Dart, DTDC, and India Post Speed Post for remote and north-eastern pin codes.'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: Packaging Integrity */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <h2 className="font-serif font-bold text-xl text-forest-950">
              {language === 'ta' ? 'கசிவு இல்லா பாதுகாப்பு பேக்கிங் முறை' : 'Leak-Proof, Food-Grade Packaging Standard'}
            </h2>
          </div>

          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3 pt-2">
            <p>
              {language === 'ta'
                ? 'தூய சமையல் எண்ணெய்களை கொண்டு சேர்க்கும் போது கசிவு ஏற்படாமல் இருக்க, நாங்கள் உயர்ரக தொழில்முறை பேக்கிங் தொழில்நுட்பத்தைப் பயன்படுத்துகிறோம்:'
                : 'Because pure cold-pressed oils are sensitive to sunlight, oxygen, and rough transit movement, we utilize hospital-grade hygienic packaging procedures:'}
            </p>

            <ul className="space-y-2 text-xs sm:text-sm text-stone-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Airtight Induction Seal:</strong> {language === 'ta' ? 'ஒவ்வொரு பாட்டிலின் வாயிலும் காற்று புகா அலுமினியம் இன்டக்ஷன் சீல் வைக்கப்படுகிறது.' : 'Every bottle cap is mechanically induction heat-sealed with a foil tamper-proof membrane.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Shock-Absorbing Cushioning:</strong> {language === 'ta' ? 'பாட்டில்கள் ஏர்-குஷன் பைகளில் வைக்கப்பட்டு 5-அடுக்கு அட்டைப்பெட்டிகளில் பேக் செய்யப்படுகின்றன.' : 'Custom heavy-duty air-bubble cushions and 5-ply fluted corrugated export-grade cartons.'}
                </span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span>
                  <strong>Food Safety Certified (FSSAI):</strong> {language === 'ta' ? 'அனைத்து கேன்கள் மற்றும் பாட்டில்களும் பிஸ்பீனால் (BPA-Free) அற்ற உணவுத் தரம் வாய்ந்தவை.' : 'All containers are 100% Virgin Food-Grade (BPA-Free) complying with central food safety norms.'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Section 3: Return & Exchange Policy */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <h2 className="font-serif font-bold text-xl text-forest-950">
              {language === 'ta' ? 'திருப்புதல் மற்றும் மாற்றுதல் விதிகள் (Returns & Exchange)' : 'Return, Exchange & Replacement Guidelines'}
            </h2>
          </div>

          <div className="text-xs sm:text-sm text-stone-600 leading-relaxed space-y-3 pt-2">
            <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 text-stone-800 text-xs sm:text-sm">
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-amber-900 block font-serif">
                    {language === 'ta' ? 'உணவுப் பாதுகாப்பு வழிகாட்டுதல் (Food Hygiene Notice):' : 'Food Hygiene & Safety Regulations:'}
                  </strong>
                  <span className="text-stone-700 leading-relaxed block mt-1">
                    {language === 'ta'
                      ? 'சமையல் எண்ணெய்கள் உணவுப் பொருள் என்பதால், பாட்டிலைத் திறந்து பயன்படுத்திய பிறகு திருப்பித் தர இயலாது. ஆனால் உங்கள் திருப்திக்கு நாங்கள் 100% பொறுப்பேற்கிறோம்.'
                      : 'Because edible cooking oils are perishable food items subject to strict contamination safeguards, opened bottles cannot be returned for restock. However, you are 100% protected against all delivery anomalies and damages.'}
                  </span>
                </div>
              </div>
            </div>

            <h4 className="font-bold text-forest-950 text-sm pt-2">
              {language === 'ta' ? 'எந்த சூழ்நிலைகளில் மாற்று அல்லது பணம் திரும்பப் பெறலாம்?' : 'Eligible Scenarios for Free Replacement or Full Refund:'}
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <span className="font-bold text-stone-900 text-xs block">1. Transit Damage or Leakage</span>
                <p className="text-xs text-stone-600">
                  {language === 'ta'
                    ? 'பாட்டிலில் உடைசல் அல்லது எண்ணெய் கசிவு இருந்தால், புகைப்படம் எடுத்து வாட்ஸ்அப்பில் அனுப்பவும். உடனடி மாற்று பாட்டில் அனுப்பப்படும்.'
                    : 'If the parcel arrives punctured, cracked, or leaking, simply take a quick photo and WhatsApp us. A fresh bottle is dispatched immediately.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <span className="font-bold text-stone-900 text-xs block">2. Incorrect Item Delivered</span>
                <p className="text-xs text-stone-600">
                  {language === 'ta'
                    ? 'நீங்கள் ஆர்டர் செய்த எண்ணெயை விட வேறு எண்ணெய் அல்லது அளவு தவறாக வந்தால், சரியான பொருள் உடனடியாக மாற்றப்படும்.'
                    : 'If an incorrect variety (e.g. Sesame instead of Groundnut) or wrong pack size is delivered, we dispatch the correct items at our cost.'}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <span className="font-bold text-stone-900 text-xs block">3. Compromised Tamper Seal</span>
                <p className="text-xs text-stone-600">
                  {language === 'ta'
                    ? 'பாட்டிலின் சீல் பிரிக்கப்பட்டிருந்தால் எண்ணெயைப் பயன்படுத்த வேண்டாம். உடனடியாக எங்களுக்குத் தெரிவிக்கவும்.'
                    : 'If the induction safety seal is broken or tampered with upon receipt, do not consume. We replace it immediately with priority courier.'}
                </p>
              </div>
            </div>

            <h4 className="font-bold text-forest-950 text-sm pt-3">
              {language === 'ta' ? 'எப்படி விண்ணப்பிப்பது?' : 'How to Claim a Replacement or Refund:'}
            </h4>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs sm:text-sm text-stone-700">
              <li>
                {language === 'ta'
                  ? 'பார்சல் கிடைத்த 48 மணி நேரத்திற்குள் பாட்டிலின் புகைப்படத்தை எடுத்து வாட்ஸ்அப் (+91 98765 43210) அல்லது care@ssoil.in-க்கு அனுப்பவும்.'
                  : 'Share a photo of the outer box and the affected bottle with your Order ID via WhatsApp (+91 98765 43210) or email to care@ssoil.in within 48 hours.'}
              </li>
              <li>
                {language === 'ta'
                  ? 'எங்கள் வாடிக்கையாளர் குழு 2 மணி நேரத்திற்குள் பரிசீலித்து ஒப்புதல் வழங்கும்.'
                  : 'Our customer support team reviews and approves your claim within 2 to 4 business hours.'}
              </li>
              <li>
                {language === 'ta'
                  ? 'புதிய பாட்டில் அன்றைய தினமே அனுப்பப்படும், அல்லது உங்கள் வங்கி கணக்கில் 3-5 நாட்களில் பணம் திருப்பி அளிக்கப்படும்.'
                  : 'A replacement shipment is dispatched the same day, or a 100% refund is initiated back to your original payment method (3-5 business days).'}
              </li>
            </ol>
          </div>
        </div>

        {/* Section 4: Customer Help Desk */}
        <div className="bg-gradient-to-r from-forest-950 to-forest-900 p-6 sm:p-8 rounded-3xl text-cream-100 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1.5 text-center sm:text-left">
            <span className="text-gold-400 font-bold text-xs uppercase tracking-wider block">
              {language === 'ta' ? 'உதவி தேவையா?' : 'Need Instant Assistance?'}
            </span>
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-white">
              {language === 'ta' ? 'எங்கள் வாடிக்கையாளர் ஆதரவுப் பிரிவு' : 'Reach Our Customer Support Desk'}
            </h3>
            <p className="text-xs sm:text-sm text-stone-300 max-w-md">
              {language === 'ta'
                ? 'திங்கள் – சனி: காலை 9:00 முதல் இரவு 7:30 வரை உங்கள் ஆர்டர் தொடர்பான அனைத்து உதவிகளுக்கும் தொடர்பு கொள்ளலாம்.'
                : 'Direct human assistance for all dispatch, tracking, and cancellation inquiries. Mon – Sat: 9:00 AM – 7:30 PM IST.'}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <a
              href="https://wa.me/919876543210?text=Hi%20SS%20OIL,%20I%20have%20an%20inquiry%20regarding%20my%20shipping%20or%20order"
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>WhatsApp Support</span>
            </a>
            <a
              href="mailto:care@ssoil.in"
              className="px-5 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-gold-300 font-bold text-xs border border-gold-500/30 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Mail className="w-3.5 h-3.5" />
              <span>care@ssoil.in</span>
            </a>
          </div>
        </div>

      </section>

    </div>
  );
};
