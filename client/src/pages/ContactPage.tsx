import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldCheck } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ContactPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    inquiryType: 'customer',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-cream-50/50 min-h-screen py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-900/10 text-forest-900 text-xs font-bold uppercase tracking-wider">
            <span>{t('contact.badge')}</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-serif font-black text-forest-950 tracking-tight">
            {t('contact.title')}
          </h1>
          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            {t('contact.subtitle')}
          </p>
        </div>

        {/* 2-Column Contact Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Information Cards (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="bg-white p-6 rounded-3xl border border-cream-200 shadow-xs space-y-5">
              <h3 className="font-serif font-bold text-lg text-forest-950 border-b border-cream-200 pb-3">
                {t('contact.officeTitle')}
              </h3>

              <div className="space-y-4 text-xs text-stone-600">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-gold-700" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">{t('contact.locationTitle')}</span>
                    <p className="text-stone-600 leading-relaxed mt-0.5">
                      {t('contact.locationDesc')}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Phone className="w-4 h-4 text-emerald-700" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">{t('contact.phoneTitle')}</span>
                    <a href="tel:1800-425-7764" className="text-forest-900 font-bold block hover:underline">
                      1800-425-SSOIL / +91 98765 43210
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Mail className="w-4 h-4 text-blue-700" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">{t('contact.emailTitle')}</span>
                    <a href="mailto:care@ssoil.in" className="text-forest-900 font-bold block hover:underline">
                      care@ssoil.in / orders@ssoil.in
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Clock className="w-4 h-4 text-purple-700" />
                  </div>
                  <div>
                    <span className="font-bold text-stone-900 block">{language === 'ta' ? 'பணி நேரம்' : 'Mill Hours'}</span>
                    <p className="text-stone-600 mt-0.5">
                      {t('contact.phoneHours')}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Certifications Badge */}
            <div className="bg-forest-950 p-5 rounded-3xl text-cream-100 border border-forest-900 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-gold-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>{language === 'ta' ? 'சட்டப்பூர்வ தர அங்கீகாரம் & FSSAI' : 'Statutory Compliance & FSSAI'}</span>
              </div>
              <p className="text-[11px] text-cream-200/70 leading-relaxed">
                {language === 'ta'
                  ? 'மத்திய உரிமம்: 1242000000001 • அக்மார்க் சான்றளிக்கப்பட்ட தரம் • பாரம்பரிய தூய வாகை மரச்செக்கு முறை.'
                  : 'Central License: 1242000000001 • Agmark Certified Quality • Pure Vaagai Chekku Extraction Standard.'}
              </p>
            </div>
          </div>

          {/* Right: Interactive Message & Wholesale Form (7 cols) */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-3xl border border-cream-200 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-xl text-forest-950">
                  {language === 'ta' ? 'செய்தி சேலம் ஆலைக்கு அனுப்பப்பட்டது!' : 'Message Sent to Salem Mill Desk!'}
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto leading-relaxed">
                  {language === 'ta'
                    ? `நன்றி, ${formData.name}. எங்கள் ஆலை நிர்வாகி உங்கள் விவரங்களைப் பரிசீலித்து 24 மணி நேரத்திற்குள் தொடர்புகொள்வார்.`
                    : `Thank you, ${formData.name}. Our master miller will review your inquiry and get in touch within 24 working hours.`}
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 rounded-xl bg-forest-900 text-cream-100 text-xs font-bold cursor-pointer"
                >
                  {language === 'ta' ? 'மற்றொரு செய்தி அனுப்ப' : 'Send Another Message'}
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <h3 className="font-serif font-bold text-lg text-forest-950 pb-1">
                    {t('contact.formTitle')}
                  </h3>
                  <p className="text-stone-500">
                    {language === 'ta'
                      ? 'கீழே உள்ள படிவத்தைப் பூர்த்தி செய்யவும், நாங்கள் உடனே பதிலளிக்கிறோம்.'
                      : 'Fill out the form below and we will respond promptly.'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">{t('contact.formName')} *</label>
                    <input
                      type="text"
                      required
                      placeholder={language === 'ta' ? 'எ.கா. ரமேஷ் குமார்' : 'e.g. Ramesh Kumar'}
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-cream-50/40 text-xs focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">{t('contact.formPhone')} *</label>
                    <input
                      type="tel"
                      required
                      placeholder={language === 'ta' ? '10 இலக்க எண்' : '10-digit number'}
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-cream-50/40 text-xs focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">{t('contact.formEmail')} *</label>
                    <input
                      type="email"
                      required
                      placeholder="name@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-cream-50/40 text-xs focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-700 mb-1">{t('contact.formType')}</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-xs font-medium text-stone-800 focus:outline-none"
                    >
                      <option value="customer">{t('contact.typeRetail')}</option>
                      <option value="wholesale">{t('contact.typeBulk')}</option>
                      <option value="distributor">{t('contact.typeDist')}</option>
                      <option value="feedback">{language === 'ta' ? 'தர ஆலோசனைகள் & கருத்து' : 'Quality Feedback & Suggestions'}</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">{t('contact.formMessage')} *</label>
                  <textarea
                    rows={4}
                    required
                    placeholder={language === 'ta' ? 'உங்கள் கேள்விகள் அல்லது தேவைகளை இங்கே எழுதவும்...' : 'Tell us what you are looking for...'}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-cream-50/40 text-xs focus:outline-none focus:ring-2 focus:ring-forest-800/20"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-xl bg-forest-950 hover:bg-forest-900 text-cream-100 font-bold text-xs transition-colors shadow-md flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 text-gold-400" />
                  <span>{t('contact.formSubmit')}</span>
                </button>
              </form>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
