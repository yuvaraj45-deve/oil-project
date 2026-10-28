import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  Globe,
  KeyRound,
  ChevronDown,
  Sparkles,
  ArrowRight,
  LogOut,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useStore } from '../context/StoreContext';

interface NavbarProps {
  cartCount: number;
  currentPath: string;
  currentUser?: UserProfile | null;
  onNavigate: (path: string) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onOpenFaq?: () => void;
  onNavigateCategory?: (slug: string) => void;
  onOpenPurityReport: () => void;
  onOpenProfile?: () => void;
  onNavigateToLogin?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  currentPath,
  currentUser,
  onNavigate,
  onOpenCart,
  onOpenSearch,
  onOpenFaq,
  onNavigateCategory,
  onOpenProfile,
  onNavigateToLogin,
}) => {
  const { language, setLanguage } = useLanguage();
  const { settings, categories } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement | null>(null);
  const shopDropdownRef = useRef<HTMLDivElement | null>(null);

  // Scroll detection: 'OUR STORY', 'SHOP', 'CONTACT', 'FAQs' only visible at the starting (top)
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 25);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Trigger pulse animation when cart count changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartPulse(true);
      const timer = setTimeout(() => setCartPulse(false), 800);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(e.target as Node)) {
        setShopDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      {/* 1. TOP ANNOUNCEMENT GREY BAR (Exact match to gemedible.com screenshot) */}
      {settings.announcementEnabled !== false && (
        <div className="bg-[#e2e2e2] text-stone-800 text-xs sm:text-[13px] font-normal py-2 px-4 sm:px-8 flex items-center justify-between border-b border-stone-300/80 select-none">
          <span className="tracking-wide">
            {settings.announcementText ||
              (language === 'ta' ? 'தூய மரச்செக்கு எண்ணெய்கள், 1957 முதல் நம்பகமானது' : 'Pure Oils, Trusted Since 1957')}
          </span>
          <span className="tracking-wide hidden xs:inline font-medium">
            {settings.announcementSubText ||
              (language === 'ta' ? '10,000+ இல்லங்களில் பரிமாறப்பட்டது' : '10,000+ Kitchens Served')}
          </span>
        </div>
      )}

      {/* 2. MAIN HEADER (Clean Solid White Layout - 100% Crisp & High Contrast) */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200/90 shadow-xs select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex items-center justify-between">
            
            {/* LEFT ACTIONS: Hamburger Menu + Search */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Hamburger Menu Toggle (Opens Side Navigation Drawer) */}
              <button
                onClick={() => setMobileMenuOpen(true)}
                aria-label="Open Navigation Menu"
                className="p-1.5 sm:p-2 -ml-1 text-stone-900 hover:text-amber-700 hover:bg-stone-100 rounded-xl transition-all cursor-pointer"
                title="Menu"
              >
                <Menu className="w-6 h-6 stroke-[2.2]" />
              </button>

              {/* Search Icon */}
              <button
                onClick={onOpenSearch}
                aria-label="Search edible oils"
                className="p-1.5 sm:p-2 text-stone-900 hover:text-amber-700 hover:bg-stone-100 rounded-xl transition-all cursor-pointer group flex items-center gap-2"
                title="Search oils"
              >
                <Search className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] group-hover:scale-110 transition-transform" />
                <span className="hidden lg:inline text-xs font-semibold text-stone-600 group-hover:text-stone-900">
                  {language === 'ta' ? 'தேடல்' : 'Search'}
                </span>
              </button>
            </div>

            {/* CENTER BRAND LOGO: Dynamic Store Logo & Name */}
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-2 sm:gap-2.5 cursor-pointer group text-center focus:outline-none"
              aria-label={settings.storeName || "Gem's gold"}
            >
              <img
                src={settings.logoUrl || "/admin_assets/ss_gold_drop_logo.png"}
                alt={settings.storeName || "SS Oil"}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col items-start justify-center">
                <span className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-[#b32d2e] group-hover:text-[#942021] transition-colors leading-none">
                  {settings.storeName || "Gem's gold"}
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-[#b32d2e] group-hover:text-[#942021] transition-colors mt-0.5">
                  {settings.tagline || 'SINCE 1966'}
                </span>
              </div>
            </button>

            {/* RIGHT ACTIONS: User Account + Shopping Cart + Language */}
            <div className="flex items-center gap-2.5 sm:gap-4">
              
              {/* Language Switcher Capsule */}
              <div className="hidden sm:flex items-center p-0.5 rounded-full bg-stone-100 border border-stone-300">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    language === 'en' ? 'bg-forest-950 text-gold-300' : 'text-stone-600'
                  }`}
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ta')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    language === 'ta' ? 'bg-forest-950 text-gold-300' : 'text-stone-600'
                  }`}
                >
                  தமிழ்
                </button>
              </div>

              {/* User Account / Log In Icon */}
              <div className="relative" ref={accountDropdownRef}>
                <button
                  onClick={() => {
                    if (currentUser) {
                      setAccountDropdownOpen(!accountDropdownOpen);
                    } else if (onNavigateToLogin) {
                      onNavigateToLogin();
                    } else {
                      onNavigate('/login');
                    }
                  }}
                  aria-label={currentUser ? `Account: ${currentUser.name}` : 'Log In'}
                  className="p-1.5 sm:p-2 text-stone-900 hover:text-amber-700 hover:bg-stone-100 rounded-xl transition-all cursor-pointer group flex items-center gap-1"
                  title={currentUser ? `Signed in as ${currentUser.name}` : 'Account / Log in'}
                >
                  <User className="w-6 h-6 stroke-[2.2] group-hover:scale-105 transition-transform" />
                  {currentUser && (
                    <span className="hidden xl:inline text-xs font-bold text-stone-700">
                      {currentUser.name.split(' ')[0]}
                    </span>
                  )}
                </button>

                {/* Account Dropdown for Signed In Users */}
                {currentUser && accountDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-fadeIn">
                    <div className="p-2 border-b border-stone-100 mb-1">
                      <p className="text-xs font-bold text-forest-950 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-stone-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-800">
                        {currentUser.memberTier || 'Member'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        if (onOpenProfile) onOpenProfile();
                        else onNavigate('/profile');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100 hover:text-forest-950 flex items-center gap-2 cursor-pointer"
                    >
                      <User className="w-3.5 h-3.5 text-stone-500" />
                      <span>{language === 'ta' ? 'என் கணக்கு' : 'My Account'}</span>
                    </button>

                    {currentUser.role === 'admin' && (
                      <button
                        onClick={() => {
                          setAccountDropdownOpen(false);
                          onNavigate('/admin');
                        }}
                        className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-amber-700 hover:bg-amber-50 flex items-center gap-2 cursor-pointer"
                      >
                        <KeyRound className="w-3.5 h-3.5 text-amber-600" />
                        <span>{language === 'ta' ? 'அட்மின் போர்டல்' : 'Admin Console'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        onNavigate('/login');
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 flex items-center gap-2 cursor-pointer border-t border-stone-100 mt-1"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{language === 'ta' ? 'வெளியேறு' : 'Sign Out'}</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Shopping Cart Icon (with live badge counter) */}
              <button
                onClick={onOpenCart}
                aria-label="Shopping Cart"
                className={`p-1.5 sm:p-2 -mr-1 text-stone-900 hover:text-amber-700 hover:bg-stone-100 rounded-xl transition-all cursor-pointer relative ${
                  cartPulse ? 'scale-115 text-amber-600' : ''
                }`}
                title="View Cart"
              >
                <ShoppingBag className="w-6 h-6 stroke-[2.2]" />
                {cartCount > 0 && (
                  <span className="absolute top-0 right-0 bg-[#b32d2e] text-white font-bold text-[10px] min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-sm animate-fadeIn">
                    {cartCount}
                  </span>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* SUB-NAV ROW: OUR STORY • SHOP ˅ • CONTACT • FAQs */}
        {/* Starting la mattum thaan irukanum, scroll pannathuku apram vara vena */}
        <div
          className={`bg-white overflow-hidden transition-all duration-300 ease-in-out ${
            isScrolled
              ? 'max-h-0 opacity-0 pb-0 pointer-events-none -mt-2'
              : 'max-h-16 opacity-100 pb-3 sm:pb-3.5 -mt-1 sm:-mt-2'
          }`}
        >
          <nav className="max-w-7xl mx-auto px-4 flex items-center justify-center gap-7 sm:gap-11 md:gap-14 text-xs sm:text-[13px] font-bold tracking-[0.08em] uppercase text-stone-900">
            {/* OUR STORY */}
            <button
              onClick={() => onNavigate('/about')}
              className={`hover:text-[#b32d2e] transition-colors cursor-pointer py-1 ${
                currentPath === '/about' ? 'text-[#b32d2e] font-extrabold' : ''
              }`}
            >
              {language === 'ta' ? 'எங்கள் கதை' : 'OUR STORY'}
            </button>

            {/* SHOP with Dropdown */}
            <div
              className="relative"
              ref={shopDropdownRef}
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                onClick={() => onNavigate('/shop')}
                className={`flex items-center gap-1 hover:text-[#b32d2e] transition-colors cursor-pointer py-1 ${
                  currentPath === '/shop' ? 'text-[#b32d2e] font-extrabold' : ''
                }`}
              >
                <span>{language === 'ta' ? 'கடைகள்' : 'SHOP'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    shopDropdownOpen ? 'rotate-180 text-[#b32d2e]' : ''
                  }`}
                />
              </button>

              {/* Shop Categories Dropdown */}
              {shopDropdownOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full mt-1 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-fadeIn text-left normal-case tracking-normal max-h-80 overflow-y-auto">
                  <button
                    onClick={() => {
                      setShopDropdownOpen(false);
                      onNavigate('/shop');
                      if (onNavigateCategory) onNavigateCategory('all');
                    }}
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-stone-50 hover:text-[#b32d2e] transition-colors cursor-pointer border-b border-stone-100 mb-1"
                  >
                    {language === 'ta' ? 'அனைத்து எண்ணெய்கள்' : 'All Products'}
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setShopDropdownOpen(false);
                        if (onNavigateCategory) onNavigateCategory(cat.slug);
                        else onNavigate(`/category/${cat.slug}`);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-stone-50 hover:text-[#b32d2e] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{cat.title}</span>
                      <span className="text-[10px] text-stone-400 font-normal shrink-0 ml-1">{cat.itemCount}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* CONTACT */}
            <button
              onClick={() => onNavigate('/contact')}
              className={`hover:text-[#b32d2e] transition-colors cursor-pointer py-1 ${
                currentPath === '/contact' ? 'text-[#b32d2e] font-extrabold' : ''
              }`}
            >
              {language === 'ta' ? 'தொடர்புக்கு' : 'CONTACT'}
            </button>

            {/* FAQs */}
            <button
              onClick={() => {
                if (onOpenFaq) onOpenFaq();
                else onNavigate('/faq');
              }}
              className="hover:text-[#b32d2e] transition-colors cursor-pointer py-1"
            >
              FAQs
            </button>
          </nav>
        </div>

        {/* 3. SLIDING NAVIGATION DRAWER (Opened via Hamburger Menu) */}
        {mobileMenuOpen && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex animate-fadeIn">
            <div className="w-full max-w-sm bg-white h-full shadow-2xl flex flex-col p-6 overflow-y-auto animate-slideInLeft">
              
              {/* Drawer Top Header */}
              <div className="flex items-center justify-between pb-5 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  <img
                    src={settings.logoUrl || "/admin_assets/ss_gold_drop_logo.png"}
                    alt={settings.storeName || "Gem's gold"}
                    className="w-8 h-8 object-contain"
                  />
                  <div className="flex flex-col">
                    <span className="font-serif text-2xl font-bold text-[#b32d2e]">
                      {settings.storeName || "Gem's gold"}
                    </span>
                    <span className="text-[9px] font-bold tracking-widest text-stone-400">
                      {settings.tagline || 'SINCE 1966'}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 cursor-pointer"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Menu Links with Smooth Hover & Arrow */}
              <div className="py-6 space-y-2 flex-1">
                {[
                  { name: language === 'ta' ? 'எங்கள் வரலாறு (OUR STORY)' : 'OUR STORY', path: '/about' },
                  { name: language === 'ta' ? 'எண்ணெய் வகைகள் (SHOP)' : 'SHOP', path: '/shop' },
                  { name: language === 'ta' ? 'மரச்செக்கு பயணம்' : 'MILL JOURNEY', path: '/why-us' },
                  { name: language === 'ta' ? 'தொடர்பு (CONTACT)' : 'CONTACT', path: '/contact' },
                  { name: language === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'FAQs', path: 'faq' },
                ].map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (item.path === 'faq') {
                        if (onOpenFaq) onOpenFaq();
                        else onNavigate('/why-us');
                      } else {
                        onNavigate(item.path);
                      }
                    }}
                    className="w-full p-3.5 rounded-xl text-left font-serif text-sm font-bold tracking-wider uppercase text-stone-800 hover:text-[#b32d2e] hover:bg-stone-50 flex items-center justify-between transition-all cursor-pointer group"
                  >
                    <span>{item.name}</span>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#b32d2e] group-hover:translate-x-1 transition-all" />
                  </button>
                ))}
              </div>

              {/* Drawer Bottom Actions */}
              <div className="pt-4 border-t border-stone-200 space-y-3">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100">
                  <span className="text-xs font-bold text-stone-700">Language:</span>
                  <div className="flex items-center p-0.5 rounded-full bg-white border border-stone-300">
                    <button
                      onClick={() => setLanguage('en')}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        language === 'en' ? 'bg-forest-950 text-gold-300' : 'text-stone-600'
                      }`}
                    >
                      EN
                    </button>
                    <button
                      onClick={() => setLanguage('ta')}
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        language === 'ta' ? 'bg-forest-950 text-gold-300' : 'text-stone-600'
                      }`}
                    >
                      தமிழ்
                    </button>
                  </div>
                </div>

                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (currentUser && onOpenProfile) onOpenProfile();
                    else onNavigate('/login');
                  }}
                  className="w-full py-3 rounded-xl bg-[#b32d2e] hover:bg-[#942021] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer transition-colors"
                >
                  <User className="w-4 h-4" />
                  <span>{currentUser ? currentUser.name : language === 'ta' ? 'உள்நுழைக' : 'Account / Log In'}</span>
                </button>
              </div>

            </div>
          </div>
        )}

      </header>
    </>
  );
};
