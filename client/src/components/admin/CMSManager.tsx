import React, { useState, useEffect } from 'react';
import {
  FileText,
  Home,
  ShoppingBag,
  Tag,
  Phone,
  Image as ImageIcon,
  CheckCircle2,
  Clock,
  Eye,
  Save,
  RotateCcw,
  Upload,
  Plus,
  Trash2,
  Edit,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  X,
  Check,
  Search,
  Filter,
  Layers,
  ChevronRight,
  ShieldCheck,
  Copy,
} from 'lucide-react';
import {
  useCMS,
  CmsSiteContent,
  HomeContent,
  ProductPageContent,
  OffersContent,
  ContactContent,
} from '../../context/CMSContext';

interface CMSManagerProps {
  onShowToast: (msg: string) => void;
}

type TabKey = 'home' | 'product' | 'offers' | 'contact' | 'media';

export const CMSManager: React.FC<CMSManagerProps> = ({ onShowToast }) => {
  const {
    siteContent,
    isLoading,
    updateTabContent,
    publishTabContent,
    draftTabContent,
    resetTabContent,
  } = useCMS();

  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [isSaving, setIsSaving] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  // Local editable copies of each tab's form state
  const [homeForm, setHomeForm] = useState<HomeContent>(siteContent.home);
  const [productForm, setProductForm] = useState<ProductPageContent>(siteContent.product);
  const [offersForm, setOffersForm] = useState<OffersContent>(siteContent.offers);
  const [contactForm, setContactForm] = useState<ContactContent>(siteContent.contact);

  // Sync forms whenever backend / context siteContent changes
  useEffect(() => {
    setHomeForm(siteContent.home);
    setProductForm(siteContent.product);
    setOffersForm(siteContent.offers);
    setContactForm(siteContent.contact);
  }, [siteContent]);

  // Handle image upload from PC (converts to base64 data-URL)
  const handleImageUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    onSuccess: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      onShowToast('File size must be under 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onSuccess(result);
        onShowToast('Image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // Save current active tab as Draft
  const handleSaveDraft = async () => {
    setIsSaving(true);
    try {
      let payload: any = null;
      if (activeTab === 'home') payload = { ...homeForm, status: 'DRAFT' };
      else if (activeTab === 'product') payload = { ...productForm, status: 'DRAFT' };
      else if (activeTab === 'offers') payload = { ...offersForm, status: 'DRAFT' };
      else if (activeTab === 'contact') payload = { ...contactForm, status: 'DRAFT' };

      if (payload && activeTab !== 'media') {
        await updateTabContent(activeTab, payload);
        onShowToast(`${activeTab.toUpperCase()} changes saved as Draft (🟡).`);
      }
    } catch (e) {
      onShowToast('Failed to save draft.');
    } finally {
      setIsSaving(false);
    }
  };

  // Publish current active tab to Live Website
  const handlePublish = async () => {
    setIsSaving(true);
    try {
      let payload: any = null;
      if (activeTab === 'home') payload = { ...homeForm, status: 'PUBLISHED' };
      else if (activeTab === 'product') payload = { ...productForm, status: 'PUBLISHED' };
      else if (activeTab === 'offers') payload = { ...offersForm, status: 'PUBLISHED' };
      else if (activeTab === 'contact') payload = { ...contactForm, status: 'PUBLISHED' };

      if (payload && activeTab !== 'media') {
        await updateTabContent(activeTab, payload);
        onShowToast(`🎉 ${activeTab.toUpperCase()} changes Published live to website!`);
      }
    } catch (e) {
      onShowToast('Failed to publish changes.');
    } finally {
      setIsSaving(false);
    }
  };

  // Reset tab to factory defaults
  const handleConfirmReset = async () => {
    if (activeTab === 'media') return;
    await resetTabContent(activeTab);
    setIsResetConfirmOpen(false);
    onShowToast(`${activeTab.toUpperCase()} content restored to factory defaults.`);
  };

  // Current tab status helper
  const getCurrentTabStatus = (): 'PUBLISHED' | 'DRAFT' => {
    if (activeTab === 'home') return homeForm.status;
    if (activeTab === 'product') return productForm.status;
    if (activeTab === 'offers') return offersForm.status;
    if (activeTab === 'contact') return contactForm.status;
    return 'PUBLISHED';
  };

  const navItems = [
    { id: 'home', label: 'Home Page', icon: Home, desc: 'Hero banner, headlines, featured section' },
    { id: 'product', label: 'Product Page', icon: ShoppingBag, desc: 'Collection title, benefits, gallery' },
    { id: 'offers', label: 'Offers & Discounts', icon: Tag, desc: 'Promo banner, coupons, discount info' },
    { id: 'contact', label: 'Contact Page', icon: Phone, desc: 'Address, phone, email, mill hours' },
    { id: 'media', label: 'Media Gallery', icon: ImageIcon, desc: 'All uploaded images & assets' },
  ];

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 rounded-3xl p-6 sm:p-8 text-white shadow-lg border border-gold-500/20 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gold-500/10 via-transparent to-transparent pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-3 py-0.5 rounded-full bg-gold-500/20 text-gold-300 font-mono text-[11px] font-bold tracking-wider border border-gold-500/30">
                LIVE CMS MODULE
              </span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-serif font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Website Content Management</span>
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 mt-1 max-w-2xl">
              Manage website text, images, banners, and promotions without editing any code. Changes update dynamically across customer-facing pages.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
            <button
              type="button"
              onClick={() => setIsPreviewOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-white/20 shadow-xs"
              title="Preview changes on website"
            >
              <Eye className="w-4 h-4 text-gold-300" />
              <span>Live Preview</span>
            </button>

            <button
              type="button"
              onClick={handleSaveDraft}
              disabled={isSaving}
              className="px-4 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-amber-500/40 shadow-xs disabled:opacity-50"
              title="Save current tab as Draft"
            >
              <Clock className="w-4 h-4" />
              <span>Save as Draft</span>
            </button>

            <button
              type="button"
              onClick={handlePublish}
              disabled={isSaving}
              className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-forest-700 hover:from-emerald-500 hover:to-forest-600 text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md border border-emerald-400/40 disabled:opacity-50"
              title="Publish changes to live website"
            >
              <CheckCircle2 className="w-4 h-4 text-emerald-200" />
              <span>Publish Changes 🟢</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Top Stats Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Manageable Tabs</span>
          <div className="text-2xl font-serif font-black text-forest-950">4 Core Pages</div>
          <span className="text-[10px] text-emerald-700 font-semibold flex items-center gap-1">
            <Check className="w-3 h-3" /> Home, Product, Offers, Contact
          </span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Current Tab Status</span>
          <div className="flex items-center gap-2">
            <span className={`w-3 h-3 rounded-full ${getCurrentTabStatus() === 'PUBLISHED' ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`} />
            <span className="text-xl font-serif font-black text-stone-900">
              {getCurrentTabStatus() === 'PUBLISHED' ? 'Published 🟢' : 'Draft 🟡'}
            </span>
          </div>
          <span className="text-[10px] text-stone-500">Active tab: {activeTab.toUpperCase()}</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Bilingual Support</span>
          <div className="text-2xl font-serif font-black text-forest-950">English + தமிழ்</div>
          <span className="text-[10px] text-amber-700 font-semibold">100% native translations</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Live Website Sync</span>
          <div className="text-2xl font-serif font-black text-emerald-700">Active ⚡</div>
          <span className="text-[10px] text-stone-500">Auto-updates customer pages</span>
        </div>
      </div>

      {/* 3. Main Dashboard Layout: Sidebar Navigation + Content Editor */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left: Sidebar Navigation Menu */}
        <div className="lg:col-span-3 bg-white rounded-3xl border border-stone-200 p-3 shadow-xs space-y-1">
          <div className="p-3 border-b border-stone-100 mb-2">
            <h4 className="font-serif font-bold text-sm text-forest-950 uppercase tracking-wider">
              Content Sections
            </h4>
            <p className="text-[11px] text-stone-500">Select section to edit content</p>
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id as TabKey)}
                className={`w-full text-left p-3 rounded-2xl transition-all cursor-pointer flex items-center justify-between group ${
                  isActive
                    ? 'bg-forest-950 text-white shadow-sm ring-1 ring-gold-500/40'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      isActive ? 'bg-forest-900 text-gold-300' : 'bg-stone-100 text-stone-600 group-hover:bg-cream-100'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-stone-900'}`}>
                      {item.label}
                    </p>
                    <p className={`text-[10px] truncate ${isActive ? 'text-stone-300' : 'text-stone-400'}`}>
                      {item.desc}
                    </p>
                  </div>
                </div>
                <ChevronRight className={`w-4 h-4 shrink-0 transition-transform ${isActive ? 'text-gold-300 translate-x-0.5' : 'text-stone-300'}`} />
              </button>
            );
          })}

          <div className="pt-3 border-t border-stone-100 mt-2">
            <button
              type="button"
              onClick={() => setIsResetConfirmOpen(true)}
              className="w-full py-2 px-3 rounded-xl text-stone-500 hover:text-red-700 hover:bg-red-50 text-[11px] font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset {activeTab.toUpperCase()} to Factory Defaults</span>
            </button>
          </div>
        </div>

        {/* Right: Active Tab Content Editor Form */}
        <div className="lg:col-span-9 bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
          
          {/* Active Tab Header & Status Indicator */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-100 pb-5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-cream-200 text-forest-950">
                EDITOR • {activeTab.toUpperCase()}
              </span>
              <h3 className="font-serif font-black text-xl text-stone-900 mt-1">
                {navItems.find((n) => n.id === activeTab)?.label}
              </h3>
              <p className="text-xs text-stone-500">
                {navItems.find((n) => n.id === activeTab)?.desc}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-bold border ${
                  getCurrentTabStatus() === 'PUBLISHED'
                    ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                    : 'bg-amber-50 text-amber-800 border-amber-300'
                }`}
              >
                {getCurrentTabStatus() === 'PUBLISHED' ? 'Status: Published 🟢' : 'Status: Draft 🟡'}
              </span>

              <button
                type="button"
                onClick={handleSaveDraft}
                className="px-3.5 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold cursor-pointer transition-colors"
              >
                Save Draft
              </button>
              <button
                type="button"
                onClick={handlePublish}
                className="px-4 py-1.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 text-xs font-bold cursor-pointer transition-colors shadow-xs"
              >
                Publish Now
              </button>
            </div>
          </div>

          {/* ========================================================== */}
          {/* TAB 1: HOME PAGE CONTENT                                   */}
          {/* ========================================================== */}
          {activeTab === 'home' && (
            <div className="space-y-6">
              
              {/* Section 1: Hero Titles */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Hero Section Title (English) *
                  </label>
                  <input
                    type="text"
                    value={homeForm.heroTitle}
                    onChange={(e) => setHomeForm((p) => ({ ...p, heroTitle: e.target.value }))}
                    placeholder="e.g. Pure Mara Chekku Cold-Pressed Oils"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Hero Section Title (தமிழ்) *
                  </label>
                  <input
                    type="text"
                    value={homeForm.heroTamilTitle || ''}
                    onChange={(e) => setHomeForm((p) => ({ ...p, heroTamilTitle: e.target.value }))}
                    placeholder="உதா: பாரம்பரிய வாகை மரச்செக்கு தூய எண்ணெய்கள்"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>
              </div>

              {/* Section 2: Hero Subtitle */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Hero Subtitle (English)
                  </label>
                  <input
                    type="text"
                    value={homeForm.heroSubtitle}
                    onChange={(e) => setHomeForm((p) => ({ ...p, heroSubtitle: e.target.value }))}
                    placeholder="e.g. Timeless Purity, Modern Convenience"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Hero Subtitle (தமிழ்)
                  </label>
                  <input
                    type="text"
                    value={homeForm.heroTamilSubtitle || ''}
                    onChange={(e) => setHomeForm((p) => ({ ...p, heroTamilSubtitle: e.target.value }))}
                    placeholder="உதா: காலமற்ற தூய்மை, நவீன வசதி"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900"
                  />
                </div>
              </div>

              {/* Section 3: Hero Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Hero Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={homeForm.heroDescription}
                    onChange={(e) => setHomeForm((p) => ({ ...p, heroDescription: e.target.value }))}
                    placeholder="Detailed explanation of the cold pressing heritage..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 resize-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Hero Description (தமிழ்)
                  </label>
                  <textarea
                    rows={3}
                    value={homeForm.heroTamilDescription || ''}
                    onChange={(e) => setHomeForm((p) => ({ ...p, heroTamilDescription: e.target.value }))}
                    placeholder="பாரம்பரிய மரச்செக்கு முறை பற்றிய தமிழ் விளக்கம்..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 resize-none"
                  />
                </div>
              </div>

              {/* Section 4: Hero Background Image Upload & Preview */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-[#FFFDF5] space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <ImageIcon className="w-4 h-4 text-amber-700" />
                    <span>Hero Background Image</span>
                  </label>
                  <span className="text-[11px] text-stone-500">Recommended: 1920x800px</span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-4">
                  <div className="w-full sm:w-48 h-28 rounded-xl overflow-hidden bg-stone-100 border border-stone-300 flex items-center justify-center shrink-0 shadow-2xs">
                    {homeForm.heroBgImage ? (
                      <img
                        src={homeForm.heroBgImage}
                        alt="Hero Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs text-stone-400">No Image</span>
                    )}
                  </div>

                  <div className="space-y-2 flex-1 w-full">
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={homeForm.heroBgImage}
                        onChange={(e) => setHomeForm((p) => ({ ...p, heroBgImage: e.target.value }))}
                        placeholder="/banners/ssoil_bottling_hero_banner.jpg or https://..."
                        className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <label className="px-3.5 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold cursor-pointer transition-all flex items-center gap-1.5 shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-amber-700" />
                        <span>Upload from Computer</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageUpload(e, (url) => setHomeForm((p) => ({ ...p, heroBgImage: url })))
                          }
                        />
                      </label>
                      <button
                        type="button"
                        onClick={() =>
                          setHomeForm((p) => ({ ...p, heroBgImage: '/banners/ssoil_bottling_hero_banner.jpg' }))
                        }
                        className="px-3 py-1.5 rounded-xl text-stone-500 hover:text-stone-800 text-xs font-medium cursor-pointer"
                      >
                        Reset Default
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Section 5: Button Text & Featured Products Section Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Primary CTA Button Text (English)
                  </label>
                  <input
                    type="text"
                    value={homeForm.buttonText}
                    onChange={(e) => setHomeForm((p) => ({ ...p, buttonText: e.target.value }))}
                    placeholder="e.g. SHOP NOW"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Primary CTA Button Text (தமிழ்)
                  </label>
                  <input
                    type="text"
                    value={homeForm.buttonTamilText || ''}
                    onChange={(e) => setHomeForm((p) => ({ ...p, buttonTamilText: e.target.value }))}
                    placeholder="உதா: இப்போதே வாங்க"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Featured Products Section Title (English) *
                  </label>
                  <input
                    type="text"
                    value={homeForm.featuredTitle}
                    onChange={(e) => setHomeForm((p) => ({ ...p, featuredTitle: e.target.value }))}
                    placeholder="e.g. Handcrafted Heritage Oils"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Featured Products Section Title (தமிழ்) *
                  </label>
                  <input
                    type="text"
                    value={homeForm.featuredTamilTitle || ''}
                    onChange={(e) => setHomeForm((p) => ({ ...p, featuredTamilTitle: e.target.value }))}
                    placeholder="உதா: கைவினை பாரம்பரிய எண்ணெய்கள்"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 2: PRODUCT PAGE CONTENT                                */}
          {/* ========================================================== */}
          {activeTab === 'product' && (
            <div className="space-y-6">
              
              {/* Product Section Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Product Section Title (English) *
                  </label>
                  <input
                    type="text"
                    value={productForm.sectionTitle}
                    onChange={(e) => setProductForm((p) => ({ ...p, sectionTitle: e.target.value }))}
                    placeholder="e.g. Our Artisanal Wood-Pressed Oil Collection"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Product Section Title (தமிழ்) *
                  </label>
                  <input
                    type="text"
                    value={productForm.tamilSectionTitle || ''}
                    onChange={(e) => setProductForm((p) => ({ ...p, tamilSectionTitle: e.target.value }))}
                    placeholder="உதா: எங்கள் மரச்செக்கு எண்ணெய் வகைகள்"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>
              </div>

              {/* Product Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Product Page Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.description}
                    onChange={(e) => setProductForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Explore our 100% virgin cold-pressed..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Product Page Description (தமிழ்)
                  </label>
                  <textarea
                    rows={3}
                    value={productForm.tamilDescription || ''}
                    onChange={(e) => setProductForm((p) => ({ ...p, tamilDescription: e.target.value }))}
                    placeholder="தயாரிப்புகள் குறித்த பொதுவான தமிழ் விவரம்..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 resize-none"
                  />
                </div>
              </div>

              {/* Product Benefits */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Product Health & Quality Benefits (English - bullet list)
                  </label>
                  <textarea
                    rows={4}
                    value={productForm.benefits}
                    onChange={(e) => setProductForm((p) => ({ ...p, benefits: e.target.value }))}
                    placeholder="• Cold-pressed below 42°C&#10;• Zero chemical solvents&#10;• Agmark Grade-1 certified"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-mono text-[11px]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Product Health & Quality Benefits (தமிழ் - குறிப்புகள்)
                  </label>
                  <textarea
                    rows={4}
                    value={productForm.tamilBenefits || ''}
                    onChange={(e) => setProductForm((p) => ({ ...p, tamilBenefits: e.target.value }))}
                    placeholder="• 42°C-க்கு கீழ் மரச்செக்கில் ஆட்டப்பட்டது&#10;• 100% இயற்கை, ரசாயனக் கலப்பற்றது"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-mono text-[11px]"
                  />
                </div>
              </div>

              {/* Product Images Management Gallery */}
              <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-sm text-stone-900">
                      Product Showcase Photos ({productForm.images?.length || 0})
                    </h4>
                    <p className="text-[11px] text-stone-500">
                      Upload, replace or remove featured product photos displayed on storefront
                    </p>
                  </div>
                  <label className="px-3.5 py-1.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs">
                    <Plus className="w-3.5 h-3.5 text-gold-400" />
                    <span>Add New Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleImageUpload(e, (url) => {
                          const newImg = {
                            id: `img-${Date.now()}`,
                            url,
                            alt: 'SS OIL Product',
                            title: 'Mara Chekku Oil',
                          };
                          setProductForm((p) => ({
                            ...p,
                            images: [...(p.images || []), newImg],
                          }));
                        })
                      }
                    />
                  </label>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  {(productForm.images || []).map((img, idx) => (
                    <div
                      key={img.id || idx}
                      className="bg-white rounded-2xl p-3 border border-stone-200 shadow-2xs space-y-2 relative group"
                    >
                      <div className="aspect-square w-full rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-200">
                        <img src={img.url} alt={img.alt} className="w-full h-full object-contain p-2" />
                      </div>
                      <input
                        type="text"
                        value={img.title}
                        onChange={(e) => {
                          const val = e.target.value;
                          setProductForm((p) => ({
                            ...p,
                            images: p.images.map((item, i) => (i === idx ? { ...item, title: val } : item)),
                          }));
                        }}
                        placeholder="Image title"
                        className="w-full px-2 py-1 rounded-lg border border-stone-200 text-[11px] font-bold"
                      />
                      <div className="flex items-center justify-between pt-1">
                        <label className="text-[10px] font-bold text-amber-800 hover:text-amber-900 cursor-pointer flex items-center gap-1">
                          <Upload className="w-3 h-3" />
                          <span>Replace</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleImageUpload(e, (url) => {
                                setProductForm((p) => ({
                                  ...p,
                                  images: p.images.map((item, i) => (i === idx ? { ...item, url } : item)),
                                }));
                              })
                            }
                          />
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setProductForm((p) => ({
                              ...p,
                              images: p.images.filter((_, i) => i !== idx),
                            }));
                            onShowToast('Image removed from showcase.');
                          }}
                          className="text-[10px] font-bold text-red-600 hover:text-red-700 cursor-pointer flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>Delete</span>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 4: OFFERS & DISCOUNTS CONTENT                          */}
          {/* ========================================================== */}
          {activeTab === 'offers' && (
            <div className="space-y-6">
              
              {/* Offer Banner Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Offer Banner Title (English) *
                  </label>
                  <input
                    type="text"
                    value={offersForm.bannerTitle}
                    onChange={(e) => setOffersForm((p) => ({ ...p, bannerTitle: e.target.value }))}
                    placeholder="e.g. Festive Mill Celebration & Bulk Discounts"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Offer Banner Title (தமிழ்) *
                  </label>
                  <input
                    type="text"
                    value={offersForm.tamilBannerTitle || ''}
                    onChange={(e) => setOffersForm((p) => ({ ...p, tamilBannerTitle: e.target.value }))}
                    placeholder="உதா: பண்டிகை கால ஆலை தள்ளுபடி மற்றும் சலுகைகள்"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>
              </div>

              {/* Offer Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Offer Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={offersForm.description}
                    onChange={(e) => setOffersForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Save up to 20% on fresh cold-pressed oils..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Offer Description (தமிழ்)
                  </label>
                  <textarea
                    rows={3}
                    value={offersForm.tamilDescription || ''}
                    onChange={(e) => setOffersForm((p) => ({ ...p, tamilDescription: e.target.value }))}
                    placeholder="மரச்செக்கு எண்ணெய்களுக்கான தள்ளுபடி விவரம்..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 resize-none"
                  />
                </div>
              </div>

              {/* Discount Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Discount Information Summary (English)
                  </label>
                  <input
                    type="text"
                    value={offersForm.discountInfo}
                    onChange={(e) => setOffersForm((p) => ({ ...p, discountInfo: e.target.value }))}
                    placeholder="10% OFF on First Order • 15% Above ₹1000 • 20% on Bulk"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Discount Information Summary (தமிழ்)
                  </label>
                  <input
                    type="text"
                    value={offersForm.tamilDiscountInfo || ''}
                    onChange={(e) => setOffersForm((p) => ({ ...p, tamilDiscountInfo: e.target.value }))}
                    placeholder="முதல் ஆர்டருக்கு 10% • ₹1000 மேல் 15% • மொத்தமாக 20%"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900"
                  />
                </div>
              </div>

              {/* Coupon Section Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Coupon Section Instructions (English)
                  </label>
                  <input
                    type="text"
                    value={offersForm.couponSectionDesc}
                    onChange={(e) => setOffersForm((p) => ({ ...p, couponSectionDesc: e.target.value }))}
                    placeholder="Copy any coupon code below and apply during checkout..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Coupon Section Instructions (தமிழ்)
                  </label>
                  <input
                    type="text"
                    value={offersForm.tamilCouponSectionDesc || ''}
                    onChange={(e) => setOffersForm((p) => ({ ...p, tamilCouponSectionDesc: e.target.value }))}
                    placeholder="கூப்பனை காப்பி செய்து செக்அவுட்டில் பயன்படுத்துங்கள்..."
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900"
                  />
                </div>
              </div>

              {/* Offer Banner Photo */}
              <div className="p-4 rounded-2xl border border-amber-200 bg-[#FFFDF5] space-y-3">
                <label className="text-xs font-bold text-stone-900 block">Offer Campaign Banner Photo</label>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-20 rounded-xl overflow-hidden bg-white border border-stone-300 flex items-center justify-center shrink-0 shadow-2xs">
                    {offersForm.bannerImage ? (
                      <img src={offersForm.bannerImage} alt="Offer preview" className="w-full h-full object-cover" />
                    ) : (
                      <span className="text-[10px] text-stone-400">No Image</span>
                    )}
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="text"
                      value={offersForm.bannerImage || ''}
                      onChange={(e) => setOffersForm((p) => ({ ...p, bannerImage: e.target.value }))}
                      placeholder="/banners/ssoil_bottling_hero_banner.jpg or URL"
                      className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs bg-white"
                    />
                    <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-bold cursor-pointer hover:bg-stone-50">
                      <Upload className="w-3.5 h-3.5 text-amber-700" />
                      <span>Upload Banner Photo</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) =>
                          handleImageUpload(e, (url) => setOffersForm((p) => ({ ...p, bannerImage: url })))
                        }
                      />
                    </label>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 5: CONTACT PAGE CONTENT                                */}
          {/* ========================================================== */}
          {activeTab === 'contact' && (
            <div className="space-y-6">
              
              {/* Contact Title */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Contact Page Title (English) *
                  </label>
                  <input
                    type="text"
                    value={contactForm.title}
                    onChange={(e) => setContactForm((p) => ({ ...p, title: e.target.value }))}
                    placeholder="e.g. Get in Touch with SS OIL Mill Desk"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Contact Page Title (தமிழ்) *
                  </label>
                  <input
                    type="text"
                    value={contactForm.tamilTitle || ''}
                    onChange={(e) => setContactForm((p) => ({ ...p, tamilTitle: e.target.value }))}
                    placeholder="உதா: எங்கள் ஆலை அலுவலகத்தைத் தொடர்பு கொள்ள"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 font-bold"
                  />
                </div>
              </div>

              {/* Contact Description */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Contact Description (English)
                  </label>
                  <textarea
                    rows={2}
                    value={contactForm.description}
                    onChange={(e) => setContactForm((p) => ({ ...p, description: e.target.value }))}
                    placeholder="Have questions regarding batch certificates..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 resize-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Contact Description (தமிழ்)
                  </label>
                  <textarea
                    rows={2}
                    value={contactForm.tamilDescription || ''}
                    onChange={(e) => setContactForm((p) => ({ ...p, tamilDescription: e.target.value }))}
                    placeholder="வாடிக்கையாளர் உதவி மையம் குறித்த விளக்கம்..."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900 resize-none"
                  />
                </div>
              </div>

              {/* Address Information */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Mill Address Information *
                </label>
                <input
                  type="text"
                  value={contactForm.address}
                  onChange={(e) => setContactForm((p) => ({ ...p, address: e.target.value }))}
                  placeholder="SS OIL Mills & Packing Unit, No. 42 Chekku Street, Industrial Estate, Tamil Nadu – 636004"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-forest-900"
                />
              </div>

              {/* Phone, Email, Mill Hours */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Phone Number *</label>
                  <input
                    type="text"
                    value={contactForm.phone}
                    onChange={(e) => setContactForm((p) => ({ ...p, phone: e.target.value }))}
                    placeholder="+91 98765 43210"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Email Address *</label>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => setContactForm((p) => ({ ...p, email: e.target.value }))}
                    placeholder="care@ssoil.in"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">Mill Operating Hours</label>
                  <input
                    type="text"
                    value={contactForm.millHours || ''}
                    onChange={(e) => setContactForm((p) => ({ ...p, millHours: e.target.value }))}
                    placeholder="Mon – Sat: 9:00 AM – 7:30 PM IST"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900"
                  />
                </div>
              </div>

            </div>
          )}

          {/* ========================================================== */}
          {/* TAB 5: MEDIA GALLERY                                       */}
          {/* ========================================================== */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-serif font-bold text-base text-stone-900">Website Media Assets</h4>
                  <p className="text-xs text-stone-500">Browse and copy direct image URLs for any CMS section</p>
                </div>
                <label className="px-4 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Image</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) =>
                      handleImageUpload(e, (url) => {
                        onShowToast('Image added to gallery!');
                      })
                    }
                  />
                </label>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {[
                  { name: 'Bottling Line Hero', url: '/banners/ssoil_bottling_hero_banner.jpg' },
                  { name: 'Sesame & Sunflower Banner', url: '/banners/sesame_sunflower_banner.jpg' },
                  { name: 'Groundnut Tradition Banner', url: '/banners/groundnut_hero_banner.jpg' },
                  { name: 'Smart Measuring Dispenser', url: '/banners/smart_measuring_banner.jpg' },
                  { name: 'Mara Chekku Churn', url: '/craft_stage_churn.jpg' },
                  { name: 'Sun-Cured Native Seeds', url: '/craft_stage_seeds.jpg' },
                  { name: 'Coconut Oil Packshot', url: '/products/coconut_oil.jpg?v=ssoil' },
                  { name: 'Sesame Oil Packshot', url: '/products/sesame_oil.jpg?v=ssoil' },
                  { name: 'Groundnut Oil Packshot', url: '/products/groundnut_oil.jpg?v=ssoil' },
                  { name: 'Sunflower Oil Packshot', url: '/products/sunflower_oil.jpg?v=ssoil' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-2xl border border-stone-200 shadow-2xs space-y-2 group">
                    <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center border border-stone-200">
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold text-stone-800 truncate max-w-[120px]">{item.name}</span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(item.url);
                          onShowToast(`Copied URL: ${item.url}`);
                        }}
                        className="p-1 rounded text-stone-400 hover:text-forest-900 cursor-pointer"
                        title="Copy image URL"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Bottom Action Strip */}
          <div className="pt-6 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="text-xs text-stone-500 flex items-center gap-2">
              <span className={`w-2 h-2 rounded-full ${getCurrentTabStatus() === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
              <span>Current Status: <strong>{getCurrentTabStatus()}</strong></span>
              <span>•</span>
              <span>Last updated: {new Date().toLocaleTimeString()}</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsPreviewOpen(true)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <Eye className="w-3.5 h-3.5 text-forest-800" />
                <span>Preview Before Publishing</span>
              </button>

              <button
                type="button"
                onClick={handleSaveDraft}
                disabled={isSaving}
                className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Clock className="w-3.5 h-3.5 text-amber-700" />
                <span>Save as Draft (🟡)</span>
              </button>

              <button
                type="button"
                onClick={handlePublish}
                disabled={isSaving}
                className="px-5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md disabled:opacity-50"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Publish Changes (🟢)</span>
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* ============================================================ */}
      {/* 4. MODAL: LIVE PREVIEW BEFORE PUBLISHING                     */}
      {/* ============================================================ */}
      {isPreviewOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-[#FAF8F5] rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-stone-300 shadow-2xl space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-serif font-black text-xl text-forest-950">
                  Live Preview: {activeTab.toUpperCase()} Section
                </h3>
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                  Draft Simulation
                </span>
              </div>
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* PREVIEW CONTAINER */}
            <div className="bg-white rounded-2xl border border-stone-200 p-6 space-y-6 shadow-sm">
              {activeTab === 'home' && (
                <div className="space-y-6">
                  <div className="relative rounded-2xl overflow-hidden min-h-[260px] bg-forest-950 flex flex-col justify-center p-8 text-white">
                    {homeForm.heroBgImage && (
                      <img
                        src={homeForm.heroBgImage}
                        alt="Hero"
                        className="absolute inset-0 w-full h-full object-cover opacity-40"
                      />
                    )}
                    <div className="relative z-10 space-y-3 max-w-xl">
                      <span className="text-[11px] font-bold uppercase tracking-widest text-gold-400 bg-forest-900/80 px-2.5 py-1 rounded-full border border-gold-500/30">
                        {homeForm.heroSubtitle}
                      </span>
                      <h2 className="text-3xl sm:text-4xl font-serif font-black text-white leading-tight">
                        {homeForm.heroTitle}
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-200 leading-relaxed">
                        {homeForm.heroDescription}
                      </p>
                      <button className="px-5 py-2.5 rounded-xl bg-gold-500 text-forest-950 font-black text-xs uppercase tracking-wider shadow-md">
                        {homeForm.buttonText} →
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-stone-100">
                    <h3 className="font-serif font-bold text-xl text-forest-950">
                      {homeForm.featuredTitle}
                    </h3>
                    <p className="text-xs text-stone-500">
                      Extracted with cold-pressing below 42°C preserving native nutrients & taste
                    </p>
                  </div>
                </div>
              )}

              {activeTab === 'product' && (
                <div className="space-y-4">
                  <h3 className="text-2xl font-serif font-black text-forest-950">{productForm.sectionTitle}</h3>
                  <p className="text-xs sm:text-sm text-stone-600">{productForm.description}</p>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                    <h5 className="font-bold text-xs text-emerald-950 mb-1">Verified Benefits</h5>
                    <pre className="text-xs text-emerald-800 font-sans whitespace-pre-line">{productForm.benefits}</pre>
                  </div>
                </div>
              )}

              {activeTab === 'offers' && (
                <div className="p-6 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white space-y-2">
                  <h3 className="text-2xl font-serif font-black text-white">{offersForm.bannerTitle}</h3>
                  <p className="text-xs text-amber-100">{offersForm.description}</p>
                  <div className="pt-2 font-mono text-xs font-bold text-yellow-200">{offersForm.discountInfo}</div>
                </div>
              )}

              {activeTab === 'contact' && (
                <div className="space-y-3">
                  <h3 className="text-2xl font-serif font-black text-forest-950">{contactForm.title}</h3>
                  <p className="text-xs text-stone-600">{contactForm.description}</p>
                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-1">
                    <p><strong>Address:</strong> {contactForm.address}</p>
                    <p><strong>Phone:</strong> {contactForm.phone}</p>
                    <p><strong>Email:</strong> {contactForm.email}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-stone-200">
              <button
                onClick={() => setIsPreviewOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold cursor-pointer"
              >
                Close Preview
              </button>
              <button
                onClick={() => {
                  setIsPreviewOpen(false);
                  handlePublish();
                }}
                className="px-5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 text-xs font-bold cursor-pointer shadow-md"
              >
                Looks Great, Publish Now! 🟢
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* 5. MODAL: RESET CONFIRMATION                                 */}
      {/* ============================================================ */}
      {isResetConfirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-serif font-black text-lg text-stone-900">Reset Content Section?</h4>
                <p className="text-xs text-stone-500">This will revert {activeTab.toUpperCase()} to factory defaults.</p>
              </div>
            </div>

            <p className="text-xs text-stone-600">
              Are you sure you want to discard changes for this section? All custom text and image URLs will be replaced with initial default values.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setIsResetConfirmOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmReset}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer shadow-sm"
              >
                Yes, Reset Defaults
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
