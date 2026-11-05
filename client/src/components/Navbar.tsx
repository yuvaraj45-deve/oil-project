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
  ChevronRight,
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
  onSignOut?: () => void;
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
  onSignOut,
}) => {
  const { language, setLanguage } = useLanguage();
  const { settings, categories } = useStore();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement | null>(null);
  const shopDropdownRef = useRef<HTMLDivElement | null>(null);

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

  // Lock background scroll when hamburger navigation drawer is open
  useEffect(() => {
    if (drawerOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => {
        document.body.style.overflow = originalOverflow;
      };
    }
  }, [drawerOpen]);

  return (
    <>
      {/* MAIN HEADER (Clean Solid White Layout - 100% Crisp & High Contrast) */}
      <header className="sticky top-0 z-50 bg-white border-b border-stone-200/90 shadow-xs select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex items-center justify-between">
            
            {/* LEFT ACTIONS: Hamburger Menu + Search */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Hamburger 3-Line Menu Toggle - Opens responsive side drawer */}
              <button
                onClick={() => setDrawerOpen((prev) => !prev)}
                aria-label="Toggle Navigation Menu"
                className={`p-1.5 sm:p-2 -ml-1 rounded-xl transition-all cursor-pointer ${
                  drawerOpen
                    ? 'text-[#b32d2e] bg-amber-50 ring-1 ring-amber-200'
                    : 'text-stone-900 hover:text-amber-700 hover:bg-stone-100'
                }`}
                title={drawerOpen ? 'Close Menu' : 'Open Navigation Menu'}
              >
                {drawerOpen ? (
                  <X className="w-6 h-6 stroke-[2.2]" />
                ) : (
                  <Menu className="w-6 h-6 stroke-[2.2]" />
                )}
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
              aria-label={settings.storeName || "ss oil"}
            >
              <img
                src={settings.logoUrl || "/admin_assets/ss_gold_drop_logo.png"}
                alt={settings.storeName || "ss oil"}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain drop-shadow-xs group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col items-start justify-center">
                <span className="font-serif text-2xl sm:text-3xl lg:text-[32px] font-bold tracking-tight text-forest-900 group-hover:text-forest-700 transition-colors leading-none">
                  {settings.storeName || "ss oil"}
                </span>
                <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase font-bold text-forest-700 group-hover:text-forest-800 transition-colors mt-0.5">
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

                    <button
                      onClick={() => {
                        setAccountDropdownOpen(false);
                        if (onSignOut) {
                          onSignOut();
                        } else {
                          onNavigate('/');
                        }
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

        {/* SUB-NAV ROW: HOME • OUR STORY • SHOP ˅ • CONTACT • FAQs (Steady height, zero jitter) */}
        <div className="bg-white border-t border-stone-100/90 border-b border-stone-200/80 shadow-2xs py-2 px-4">
          <nav className="max-w-7xl mx-auto flex items-center justify-center gap-4 sm:gap-8 md:gap-12 text-xs sm:text-[13px] font-bold tracking-[0.08em] uppercase text-stone-900 overflow-x-auto no-scrollbar">
            {/* 1. HOME */}
            <button
              onClick={() => onNavigate('/')}
              className={`hover:text-[#1e7e34] transition-colors cursor-pointer py-1 px-1.5 flex items-center gap-1.5 shrink-0 border-b-2 ${
                currentPath === '/' || currentPath === '' ? 'text-[#1e7e34] font-black border-[#1e7e34]' : 'text-stone-900 border-transparent'
              }`}
            >
              <span>{language === 'ta' ? 'முகப்பு' : 'HOME'}</span>
            </button>

            {/* 2. OUR STORY */}
            <button
              onClick={() => onNavigate('/about')}
              className={`hover:text-[#1e7e34] transition-colors cursor-pointer py-1 px-1.5 flex items-center gap-1.5 shrink-0 border-b-2 ${
                currentPath === '/about' ? 'text-[#1e7e34] font-black border-[#1e7e34]' : 'text-stone-900 border-transparent'
              }`}
            >
              <span>{language === 'ta' ? 'எங்கள் கதை' : 'OUR STORY'}</span>
            </button>

            {/* 3. SHOP with Dropdown */}
            <div
              className="relative shrink-0"
              ref={shopDropdownRef}
              onMouseEnter={() => setShopDropdownOpen(true)}
              onMouseLeave={() => setShopDropdownOpen(false)}
            >
              <button
                onClick={() => {
                  if (onNavigateCategory) onNavigateCategory('all');
                  onNavigate('/shop');
                }}
                className={`flex items-center gap-1 hover:text-[#1e7e34] transition-colors cursor-pointer py-1 px-1.5 border-b-2 ${
                  currentPath === '/shop' ? 'text-[#1e7e34] font-black border-[#1e7e34]' : 'text-stone-900 border-transparent'
                }`}
              >
                <span>{language === 'ta' ? 'அங்காடி' : 'SHOP'}</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 transition-transform duration-200 ${
                    shopDropdownOpen ? 'rotate-180 text-[#1e7e34]' : ''
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
                    className="w-full text-left px-3 py-2 rounded-xl text-xs font-bold text-stone-800 hover:bg-emerald-50 hover:text-[#1e7e34] transition-colors cursor-pointer border-b border-stone-100 mb-1"
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
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-medium text-stone-700 hover:bg-emerald-50 hover:text-[#1e7e34] transition-colors cursor-pointer flex items-center justify-between"
                    >
                      <span className="truncate">{cat.title}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* 4. CONTACT */}
            <button
              onClick={() => onNavigate('/contact')}
              className={`hover:text-[#1e7e34] transition-colors cursor-pointer py-1 px-1.5 shrink-0 border-b-2 ${
                currentPath === '/contact' ? 'text-[#1e7e34] font-black border-[#1e7e34]' : 'text-stone-900 border-transparent'
              }`}
            >
              <span>{language === 'ta' ? 'தொடர்புக்கு' : 'CONTACT'}</span>
            </button>

            {/* 5. FAQs */}
            <button
              onClick={() => {
                if (onOpenFaq) onOpenFaq();
                else onNavigate('/faq');
              }}
              className={`hover:text-[#1e7e34] transition-colors cursor-pointer py-1 px-1.5 shrink-0 border-b-2 ${
                currentPath === '/faq' ? 'text-[#1e7e34] font-black border-[#1e7e34]' : 'text-stone-900 border-transparent'
              }`}
            >
              FAQs
            </button>

            {/* 6. OFFERS & COUPONS */}
            <button
              onClick={() => onNavigate('/offers')}
              className={`hover:text-[#1e7e34] transition-colors cursor-pointer py-1 px-1.5 shrink-0 border-b-2 flex items-center gap-1.5 ${
                currentPath === '/offers' ? 'text-[#1e7e34] font-black border-[#1e7e34]' : 'text-amber-800 border-transparent'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>{language === 'ta' ? 'சலுகைகள்' : 'OFFERS'}</span>
              <span className="px-1.5 py-0.5 rounded-md text-[9px] font-black bg-amber-400 text-forest-950 leading-none">
                %
              </span>
            </button>
          </nav>
        </div>

      </header>

      {/* FULL RESPONSIVE NAVIGATION DRAWER (Opens when 3-line hamburger is clicked) */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex animate-fadeIn select-none">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-stone-950/60 backdrop-blur-xs transition-opacity"
            onClick={() => setDrawerOpen(false)}
          />

          {/* Drawer Sidebar */}
          <div className="relative z-10 w-80 max-w-[85vw] bg-white h-full shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-200">
            {/* Drawer Top Header */}
            <div className="p-5 border-b border-stone-200 bg-stone-50/70 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <img
                  src={settings.logoUrl || "/admin_assets/ss_gold_drop_logo.png"}
                  alt={settings.storeName || "ss oil"}
                  className="w-8 h-8 object-contain"
                />
                <div>
                  <h3 className="font-serif font-black text-lg text-forest-950 leading-none">
                    {settings.storeName || "ss oil"}
                  </h3>
                  <span className="text-[10px] font-bold tracking-wider text-amber-700 uppercase">
                    {language === 'ta' ? 'தூய மரச்செக்கு எண்ணெய்' : 'Heritage Cold-Pressed Oils'}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setDrawerOpen(false)}
                className="p-2 rounded-xl text-stone-500 hover:text-stone-900 hover:bg-stone-200/60 transition-colors cursor-pointer"
                aria-label="Close Menu"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Drawer Navigation Links */}
            <div className="p-4 space-y-1.5 flex-1 overflow-y-auto">
              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('/');
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                  currentPath === '/' ? 'bg-forest-900 text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <span className="text-base">🏠</span>
                <span>{language === 'ta' ? 'முகப்பு' : 'Home'}</span>
              </button>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('/about');
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                  currentPath === '/about' ? 'bg-forest-900 text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <span className="text-base">📖</span>
                <span>{language === 'ta' ? 'எங்கள் கதை' : 'Our Story'}</span>
              </button>

              {/* Shop & Categories */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onNavigateCategory) onNavigateCategory('all');
                    onNavigate('/shop');
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                    currentPath === '/shop' ? 'bg-forest-900 text-white' : 'text-stone-800 hover:bg-stone-100'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-base">🛍️</span>
                    <span>{language === 'ta' ? 'அனைத்து எண்ணெய்கள்' : 'Shop All Oils'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-60" />
                </button>

                {/* Subcategory List */}
                <div className="pl-9 pr-2 pt-1.5 pb-2 space-y-1">
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => {
                        setDrawerOpen(false);
                        if (onNavigateCategory) onNavigateCategory(cat.slug);
                        else onNavigate(`/category/${cat.slug}`);
                      }}
                      className="w-full text-left px-3 py-1.5 rounded-lg text-xs font-semibold text-stone-600 hover:text-forest-900 hover:bg-stone-100 transition-colors flex items-center justify-between cursor-pointer"
                    >
                      <span className="truncate">{cat.title}</span>
                      <ArrowRight className="w-3 h-3 text-stone-300" />
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('/contact');
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                  currentPath === '/contact' ? 'bg-forest-900 text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <span className="text-base">📞</span>
                <span>{language === 'ta' ? 'தொடர்புக்கு' : 'Contact Us'}</span>
              </button>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  if (onOpenFaq) onOpenFaq();
                  else onNavigate('/faq');
                }}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                  currentPath === '/faq' ? 'bg-forest-900 text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <span className="text-base">❓</span>
                <span>{language === 'ta' ? 'அடிக்கடி கேட்கப்படும் கேள்விகள் (FAQs)' : 'FAQs'}</span>
              </button>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('/offers');
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer ${
                  currentPath === '/offers' ? 'bg-forest-900 text-white' : 'text-stone-800 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">🏷️</span>
                  <span>{language === 'ta' ? 'சலுகைகள் & கூப்பன்கள்' : 'Offers & Discount Coupons'}</span>
                </div>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-400 text-forest-950">
                  DEALS
                </span>
              </button>

              <button
                onClick={() => {
                  setDrawerOpen(false);
                  onNavigate('/sommelier');
                }}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer text-stone-800 hover:bg-stone-100"
              >
                <span className="text-base">👨‍🍳</span>
                <span>{language === 'ta' ? 'சமையல் எண்ணெய் வழிகாட்டி' : 'Oil Sommelier'}</span>
              </button>

              {currentUser ? (
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onOpenProfile) onOpenProfile();
                    else onNavigate('/profile');
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer text-stone-800 hover:bg-stone-100"
                >
                  <User className="w-4 h-4 text-forest-700" />
                  <span>{language === 'ta' ? 'என் கணக்கு' : 'My Account'} ({currentUser.name.split(' ')[0]})</span>
                </button>
              ) : (
                <button
                  onClick={() => {
                    setDrawerOpen(false);
                    if (onNavigateToLogin) onNavigateToLogin();
                    else onNavigate('/login');
                  }}
                  className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-bold transition-all text-left cursor-pointer text-stone-800 hover:bg-stone-100"
                >
                  <User className="w-4 h-4 text-forest-700" />
                  <span>{language === 'ta' ? 'உள்நுழைக / பதிவு செய்ய' : 'Sign In / Register'}</span>
                </button>
              )}
            </div>

            {/* Drawer Footer: Language & WhatsApp */}
            <div className="p-4 border-t border-stone-200 bg-stone-50 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-stone-600">
                  {language === 'ta' ? 'மொழி:' : 'Language:'}
                </span>
                <div className="flex items-center p-0.5 rounded-full bg-white border border-stone-300">
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      language === 'en' ? 'bg-forest-950 text-gold-300' : 'text-stone-600'
                    }`}
                  >
                    EN
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('ta')}
                    className={`px-3 py-1 rounded-full text-xs font-bold transition-all cursor-pointer ${
                      language === 'ta' ? 'bg-forest-950 text-gold-300' : 'text-stone-600'
                    }`}
                  >
                    தமிழ்
                  </button>
                </div>
              </div>

              <a
                href="https://wa.me/919876543210?text=Hi%20SS%20OIL,%20I%20would%20like%20to%20know%20more%20about%20cold-pressed%20oils"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-2.5 px-4 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-xs transition-colors"
              >
                <span>💬 WhatsApp Helpdesk</span>
              </a>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
