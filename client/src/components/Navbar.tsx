import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  UserPlus,
  LogIn,
  CheckCircle2,
  Globe,
  KeyRound,
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
  onNavigateToLogin?: (mode?: 'login' | 'register') => void;
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
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);
  const accountDropdownRef = useRef<HTMLDivElement | null>(null);
  const shopDropdownRef = useRef<HTMLDivElement | null>(null);

  // Scroll detection & Heading Bar state:
  // Starting-la mattum thaan heading bar irukanum; scroll pannathuku apram maraivil irukum.
  // Scroll pannathuku apram 3line icon click panna heading bar vara vendum, thirumba click panna marayanum.
  const [isScrolled, setIsScrolled] = useState(false);
  const [scrolledHeadingOpen, setScrolledHeadingOpen] = useState(false);
  const [topHeadingClosed, setTopHeadingClosed] = useState(false);

  useEffect(() => {
    let lastScroll = window.scrollY || 0;
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0;
      const scrolled = scrollY > 25;
      setIsScrolled(scrolled);
      if (scrolled) {
        if (Math.abs(scrollY - lastScroll) > 40) {
          setScrolledHeadingOpen(false);
          lastScroll = scrollY;
        }
      } else {
        setScrolledHeadingOpen(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleHeadingBar = () => {
    if (isScrolled) {
      setScrolledHeadingOpen((prev) => !prev);
    } else {
      setTopHeadingClosed((prev) => !prev);
    }
  };

  const showHeadingBar = isScrolled ? scrolledHeadingOpen : !topHeadingClosed;

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
      {/* MAIN HEADER (Clean Solid White Layout - 100% Crisp & High Contrast) */}
      <header className="sticky top-0 z-50 bg-white select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 sm:py-4">
          <div className="flex items-center justify-between">
            
            {/* LEFT ACTIONS: Hamburger Menu + Search */}
            <div className="flex items-center gap-3 sm:gap-4">
              {/* Hamburger 3-Line Menu Toggle - Toggles SUB-NAV row right in place */}
              <button
                onClick={toggleHeadingBar}
                aria-label="Toggle Navigation Menu"
                className={`p-1.5 sm:p-2 -ml-1 rounded-xl transition-all cursor-pointer ${
                  showHeadingBar
                    ? 'text-[#b32d2e] bg-amber-50 ring-1 ring-amber-200'
                    : 'text-stone-900 hover:text-amber-700 hover:bg-stone-100'
                }`}
                title={showHeadingBar ? 'Hide Menu' : 'Show Menu'}
              >
                {showHeadingBar ? (
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
              <div className="flex items-center p-0.5 rounded-full bg-stone-100 border border-stone-300">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    language === 'en' ? 'bg-forest-950 text-gold-300' : 'text-stone-600'
                  }`}
                  title="English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ta')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    language === 'ta' ? 'bg-forest-950 text-gold-300' : 'text-stone-600'
                  }`}
                  title="தமிழ்"
                >
                  தமிழ்
                </button>
              </div>

              {/* User Account / Log In Icon (Single Clean Icon as Originally Designed) */}
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
                  aria-label={currentUser ? `Account: ${currentUser.name}` : 'Log In / Register'}
                  className="p-1.5 sm:p-2 text-stone-900 hover:text-amber-700 hover:bg-stone-100 rounded-xl transition-all cursor-pointer group flex items-center gap-1"
                  title={currentUser ? `Signed in as ${currentUser.name}` : 'Account / Log in / Register'}
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
                      <p className="text-[10px] text-stone-400 truncate">{currentUser.email || currentUser.phone}</p>
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

              {/* Shopping Cart Icon (with live badge counter & indicator dot) */}
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
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-60"></span>
                    <span className="relative inline-flex items-center justify-center rounded-full h-4.5 min-w-[18px] px-1 bg-[#b32d2e] text-white font-bold text-[10px] shadow-md">
                      {cartCount}
                    </span>
                  </span>
                )}
              </button>

            </div>

          </div>
        </div>

        {/* SUB-NAV ROW: HOME • ABOUT US • SHOP ˅ • CONTACT • FAQs */}
        <div
          className={`bg-white overflow-hidden transition-all duration-300 ease-in-out border-t border-stone-100/90 ${
            showHeadingBar
              ? 'max-h-[600px] opacity-100 pt-1 pb-3 sm:pb-3.5 px-3 sm:px-4 block'
              : 'max-h-0 opacity-0 py-0 px-3 sm:px-4 pointer-events-none'
          }`}
        >
          {/* Horizontal Pills / Links (Always starts with HOME & ABOUT US on mobile without left-clipping) */}
          <nav className="max-w-7xl mx-auto flex items-center justify-start sm:justify-center gap-2.5 sm:gap-8 md:gap-12 text-xs sm:text-[13px] font-bold tracking-[0.08em] uppercase text-stone-900 overflow-x-auto no-scrollbar py-0.5">
            {/* 1. HOME */}
            <button
              onClick={() => {
                if (isScrolled) setScrolledHeadingOpen(false);
                onNavigate('/');
              }}
              className={`hover:text-[#1e7e34] transition-colors cursor-pointer py-1 px-2.5 flex items-center gap-1 shrink-0 rounded-lg sm:rounded-none focus:outline-none ${
                currentPath === '/' || currentPath === '' ? 'text-[#1e7e34] font-black bg-emerald-50/70 sm:bg-transparent' : 'text-stone-900 bg-stone-50 sm:bg-transparent'
              }`}
            >
              <span>{language === 'ta' ? 'முகப்பு' : 'HOME'}</span>
            </button>

            {/* 2. ABOUT US */}
            <button
              onClick={() => {
                if (isScrolled) setScrolledHeadingOpen(false);
                onNavigate('/about');
              }}
              className={`hover:text-[#1e7e34] transition-colors cursor-pointer py-1 px-2.5 flex items-center gap-1 shrink-0 rounded-lg sm:rounded-none focus:outline-none ${
                currentPath === '/about' ? 'text-[#1e7e34] font-black bg-emerald-50/70 sm:bg-transparent' : 'text-stone-900 bg-stone-50 sm:bg-transparent'
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
                  if (isScrolled) setScrolledHeadingOpen(false);
                  if (onNavigateCategory) onNavigateCategory('all');
                  onNavigate('/shop');
                }}
                className={`hover:text-[#1e7e34] transition-colors cursor-pointer py-1 px-2.5 rounded-lg sm:rounded-none focus:outline-none ${
                  currentPath === '/shop' ? 'text-[#1e7e34] font-black bg-emerald-50/70 sm:bg-transparent' : 'text-stone-900 bg-stone-50 sm:bg-transparent'
                }`}
              >
                <span>{language === 'ta' ? 'அங்காடி' : 'SHOP'}</span>
              </button>

              {/* Shop Categories Dropdown */}
              {shopDropdownOpen && (
                <div className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 top-full mt-1 w-64 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-fadeIn text-left normal-case tracking-normal max-h-80 overflow-y-auto">
                  <button
                    onClick={() => {
                      setShopDropdownOpen(false);
                      if (isScrolled) setScrolledHeadingOpen(false);
                      if (onNavigateCategory) onNavigateCategory('all');
                      onNavigate('/shop');
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
                        if (isScrolled) setScrolledHeadingOpen(false);
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
              onClick={() => {
                if (isScrolled) setScrolledHeadingOpen(false);
                onNavigate('/contact');
              }}
              className={`hover:text-[#1e7e34] transition-colors cursor-pointer py-1 px-2.5 shrink-0 rounded-lg sm:rounded-none focus:outline-none ${
                currentPath === '/contact' ? 'text-[#1e7e34] font-black bg-emerald-50/70 sm:bg-transparent' : 'text-stone-900 bg-stone-50 sm:bg-transparent'
              }`}
            >
              <span>{language === 'ta' ? 'தொடர்புக்கு' : 'CONTACT'}</span>
            </button>

            {/* 5. FAQs */}
            <button
              onClick={() => {
                if (isScrolled) setScrolledHeadingOpen(false);
                if (onOpenFaq) onOpenFaq();
                else onNavigate('/faq');
              }}
              className={`hover:text-[#1e7e34] transition-colors cursor-pointer py-1 px-2.5 shrink-0 rounded-lg sm:rounded-none focus:outline-none ${
                currentPath === '/faq' ? 'text-[#1e7e34] font-black bg-emerald-50/70 sm:bg-transparent' : 'text-stone-900 bg-stone-50 sm:bg-transparent'
              }`}
            >
              FAQs
            </button>

          </nav>
        </div>

      </header>
    </>
  );
};
