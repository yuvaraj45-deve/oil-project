import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  User,
  Globe,
  KeyRound,
  HelpCircle,
  ChevronDown,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Droplet,
  LogOut,
  Package,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

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
  onOpenPurityReport,
  onOpenProfile,
  onNavigateToLogin,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [accountDropdownOpen, setAccountDropdownOpen] = useState(false);
  const [cartPulse, setCartPulse] = useState(false);

  const shopDropdownTimeout = useRef<NodeJS.Timeout | null>(null);
  const accountDropdownRef = useRef<HTMLDivElement | null>(null);

  // Trigger pulse animation when cart count changes
  useEffect(() => {
    if (cartCount > 0) {
      setCartPulse(true);
      const timer = setTimeout(() => setCartPulse(false), 800);
      return () => clearTimeout(timer);
    }
  }, [cartCount]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close account dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (accountDropdownRef.current && !accountDropdownRef.current.contains(e.target as Node)) {
        setAccountDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Shop Categories for animated Mega Dropdown (matching gemedible.com)
  const shopCategories = [
    {
      slug: 'groundnut',
      title: language === 'ta' ? 'கடலை எண்ணெய்' : 'Groundnut Oil',
      subtitle: language === 'ta' ? 'பாரம்பரிய மரச்செக்கு' : '100% Mara Chekku',
      img: '/products/groundnut_oil.jpg',
      badge: '<42°C Cold',
    },
    {
      slug: 'sesame',
      title: language === 'ta' ? 'நல்லெண்ணெய்' : 'Sesame (Gingelly)',
      subtitle: language === 'ta' ? 'பனை கருப்பட்டி சேர்க்கை' : 'With Palm Jaggery',
      img: '/products/sesame_oil.jpg',
      badge: 'Zero Argemone',
    },
    {
      slug: 'sunflower',
      title: language === 'ta' ? 'சூரியகாந்தி எண்ணெய்' : 'Sunflower Oil',
      subtitle: language === 'ta' ? 'நீராவி முறை சுத்திகரிப்பு' : 'Physically Refined',
      img: '/products/sunflower_oil.jpg',
      badge: 'Light & Crisp',
    },
    {
      slug: 'coconut',
      title: language === 'ta' ? 'தேங்காய் எண்ணெய்' : 'Virgin Coconut',
      subtitle: language === 'ta' ? 'இயற்கை கொப்பரை' : 'Sun-Dried Copra',
      img: '/products/coconut_oil.jpg',
      badge: '100% Pure',
    },
    {
      slug: 'rice-bran',
      title: language === 'ta' ? 'தவிட்டு எண்ணெய்' : 'Rice Bran Oil',
      subtitle: language === 'ta' ? 'இதய ஆரோக்கியம்' : 'High Oryzanol',
      img: '/products/rice_bran_oil.jpg',
      badge: 'Heart Health',
    },
  ];

  return (
    <>
      {/* Sticky Gemedible Style Navigation Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 select-none ${
          isScrolled
            ? 'bg-white/95 backdrop-blur-md shadow-md py-2.5 border-b border-stone-200/90'
            : 'bg-white/90 backdrop-blur-sm py-3.5 border-b border-stone-200/60'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            
            {/* 1. Brand Logo (PureVa / Salem Mill) */}
            <button
              onClick={() => onNavigate('/')}
              className="flex items-center gap-3 group focus:outline-none cursor-pointer text-left transition-transform duration-300 hover:scale-[1.02]"
              aria-label="PureVa Home"
            >
              {/* Artisanal Emblem Badge */}
              <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-gradient-to-br from-forest-900 via-forest-950 to-forest-900 flex items-center justify-center shadow-md relative overflow-hidden border border-gold-500/30 group-hover:border-gold-400 group-hover:shadow-gold-500/20 transition-all duration-300">
                <div className="absolute inset-0 bg-gold-400/5 group-hover:bg-gold-400/15 transition-colors" />
                <svg
                  className="w-5 h-5 sm:w-5.5 sm:h-5.5 text-gold-400 relative z-10 transition-transform duration-500 group-hover:scale-115 group-hover:rotate-6"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-gold-300 animate-ping opacity-60" />
              </div>

              {/* Brand Typography */}
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-xl sm:text-2xl font-black tracking-tight text-forest-950 group-hover:text-forest-800 transition-colors">
                    PureVa
                  </span>
                  <span className="hidden sm:inline-block px-1.5 py-0.5 rounded-md text-[9px] font-bold bg-gold-500/15 text-gold-700 border border-gold-500/30">
                    Est. 1957
                  </span>
                </div>
                <p className="text-[9px] tracking-widest uppercase text-forest-800 font-bold -mt-0.5">
                  {language === 'ta' ? 'பாரம்பரிய மரச்செக்கு எண்ணெய்' : 'Cold-Pressed Edible Oils'}
                </p>
              </div>
            </button>

            {/* 2. Desktop Navigation Links (OUR STORY, SHOP, CONTACT, FAQs) with Smooth Underline Animation */}
            <nav className="hidden md:flex items-center space-x-1 lg:space-x-3">
              
              {/* Link 1: OUR STORY */}
              <button
                onClick={() => onNavigate('/about')}
                className={`relative px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer group ${
                  currentPath === '/about' ? 'text-forest-950 font-black' : 'text-stone-700 hover:text-forest-950'
                }`}
              >
                <span>{language === 'ta' ? 'எங்கள் வரலாறு' : 'OUR STORY'}</span>
                {/* Center-out expanding underline animation */}
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] bg-gradient-to-r from-amber-400 via-gold-500 to-amber-400 transition-all duration-300 rounded-full ${
                    currentPath === '/about' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

              {/* Link 2: SHOP (With Interactive Animated Mega Dropdown) */}
              <div
                className="relative"
                onMouseEnter={() => {
                  if (shopDropdownTimeout.current) clearTimeout(shopDropdownTimeout.current);
                  setShopDropdownOpen(true);
                }}
                onMouseLeave={() => {
                  shopDropdownTimeout.current = setTimeout(() => {
                    setShopDropdownOpen(false);
                  }, 200);
                }}
              >
                <button
                  onClick={() => onNavigate('/shop')}
                  className={`relative px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer flex items-center gap-1 group ${
                    currentPath.startsWith('/shop') ? 'text-forest-950 font-black' : 'text-stone-700 hover:text-forest-950'
                  }`}
                >
                  <span>{language === 'ta' ? 'எண்ணெய் வகைகள்' : 'SHOP'}</span>
                  <ChevronDown
                    className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-300 group-hover:text-forest-950 ${
                      shopDropdownOpen ? 'rotate-180 text-amber-500' : ''
                    }`}
                  />
                  {/* Underline */}
                  <span
                    className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] bg-gradient-to-r from-amber-400 via-gold-500 to-amber-400 transition-all duration-300 rounded-full ${
                      currentPath.startsWith('/shop') ? 'w-full' : 'w-0 group-hover:w-full'
                    }`}
                  />
                </button>

                {/* Animated Mega Dropdown Menu */}
                {shopDropdownOpen && (
                  <div className="absolute top-full left-1/2 -translate-x-1/2 pt-2 z-50 w-80 sm:w-96 animate-fadeIn">
                    <div className="bg-white/98 backdrop-blur-md rounded-2xl shadow-2xl border border-cream-300 p-3 space-y-1">
                      <div className="px-3 py-1.5 text-[10px] font-bold uppercase tracking-wider text-stone-400 flex justify-between items-center border-b border-stone-100">
                        <span>{language === 'ta' ? 'மரச்செக்கு தயாரிப்புகள்' : 'PureVa Oil Catalog'}</span>
                        <span className="text-gold-600 font-mono">100% Pure</span>
                      </div>

                      <div className="grid grid-cols-1 gap-1 pt-1">
                        {shopCategories.map((item) => (
                          <button
                            key={item.slug}
                            onClick={() => {
                              setShopDropdownOpen(false);
                              if (onNavigateCategory) {
                                onNavigateCategory(item.slug);
                              }
                              onNavigate('/shop');
                            }}
                            className="flex items-center gap-3 p-2 rounded-xl hover:bg-stone-50 transition-all duration-200 text-left cursor-pointer group"
                          >
                            <img
                              src={item.img}
                              alt={item.title}
                              className="w-9 h-9 rounded-lg object-contain bg-stone-100 p-0.5 border border-stone-200 group-hover:scale-105 transition-transform"
                            />
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-bold text-forest-950 group-hover:text-amber-600 transition-colors truncate">
                                  {item.title}
                                </span>
                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                                  {item.badge}
                                </span>
                              </div>
                              <span className="text-[10px] text-stone-500 block truncate">
                                {item.subtitle}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>

                      {/* Smart Bottle Feature Callout inside Dropdown */}
                      <div className="pt-2 border-t border-stone-100">
                        <button
                          onClick={() => {
                            setShopDropdownOpen(false);
                            onNavigate('/shop');
                          }}
                          className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-forest-950 to-forest-900 text-white text-xs font-bold flex items-center justify-between hover:from-forest-900 hover:to-forest-800 transition-all cursor-pointer shadow-xs"
                        >
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-gold-400" />
                            <span>{language === 'ta' ? 'அனைத்து எண்ணெய்களையும் பார்க்க' : 'View Full Catalog'}</span>
                          </div>
                          <ArrowRight className="w-3.5 h-3.5 text-gold-400" />
                        </button>
                      </div>

                    </div>
                  </div>
                )}
              </div>

              {/* Link 3: CONTACT */}
              <button
                onClick={() => onNavigate('/contact')}
                className={`relative px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer group ${
                  currentPath === '/contact' ? 'text-forest-950 font-black' : 'text-stone-700 hover:text-forest-950'
                }`}
              >
                <span>{language === 'ta' ? 'தொடர்பு' : 'CONTACT'}</span>
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] bg-gradient-to-r from-amber-400 via-gold-500 to-amber-400 transition-all duration-300 rounded-full ${
                    currentPath === '/contact' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

              {/* Link 4: FAQs */}
              <button
                onClick={() => {
                  if (onOpenFaq) {
                    onOpenFaq();
                  } else {
                    onNavigate('/why-us');
                  }
                }}
                className={`relative px-3.5 py-2 text-xs font-bold uppercase tracking-wider transition-colors duration-300 cursor-pointer group ${
                  currentPath === '/faq' ? 'text-forest-950 font-black' : 'text-stone-700 hover:text-forest-950'
                }`}
              >
                <div className="flex items-center gap-1">
                  <span>{language === 'ta' ? 'கேள்விகள்' : 'FAQs'}</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-gold-500 animate-pulse" />
                </div>
                <span
                  className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-[2.5px] bg-gradient-to-r from-amber-400 via-gold-500 to-amber-400 transition-all duration-300 rounded-full ${
                    currentPath === '/faq' ? 'w-full' : 'w-0 group-hover:w-full'
                  }`}
                />
              </button>

            </nav>

            {/* 3. Right Action Utilities: Search, Account / Log in, Cart, Language */}
            <div className="flex items-center gap-2 sm:gap-3">

              {/* Search Button (with Animated Hover Scale & Keyboard Hint) */}
              <button
                onClick={onOpenSearch}
                aria-label="Search edible oils"
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-forest-950 transition-all duration-200 cursor-pointer border border-stone-200 group"
                title="Search oils"
              >
                <Search className="w-4 h-4 text-stone-600 group-hover:scale-110 group-hover:text-amber-600 transition-transform" />
                <span className="hidden sm:inline text-xs font-bold text-stone-600 group-hover:text-forest-950">
                  {language === 'ta' ? 'தேடல்' : 'Search'}
                </span>
              </button>

              {/* Account / Log in Button with Dropdown */}
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
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-800 hover:text-forest-950 transition-all duration-200 cursor-pointer border border-stone-200 group"
                  title={currentUser ? `Account: ${currentUser.name}` : 'Log in / Register'}
                >
                  <div className="w-5 h-5 rounded-full bg-forest-950 text-gold-400 flex items-center justify-center text-[10px] font-bold group-hover:scale-110 transition-transform">
                    {currentUser ? currentUser.name.charAt(0).toUpperCase() : <User className="w-3 h-3" />}
                  </div>
                  <span className="hidden md:inline text-xs font-bold text-stone-700 group-hover:text-forest-950">
                    {currentUser ? currentUser.name.split(' ')[0] : language === 'ta' ? 'உள்நுழை' : 'Account'}
                  </span>
                  {currentUser && (
                    <ChevronDown className="w-3 h-3 text-stone-400 group-hover:text-stone-700 transition-transform" />
                  )}
                </button>

                {/* Account Dropdown for Signed In Users */}
                {currentUser && accountDropdownOpen && (
                  <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-stone-200 p-2 z-50 animate-fadeIn">
                    <div className="p-2 border-b border-stone-100 mb-1">
                      <p className="text-xs font-bold text-forest-950 truncate">{currentUser.name}</p>
                      <p className="text-[10px] text-stone-400 truncate">{currentUser.email}</p>
                      <span className="inline-block mt-1 text-[9px] font-bold px-1.5 py-0.5 rounded bg-gold-100 text-gold-800">
                        {currentUser.memberTier || 'PureVa Member'}
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

              {/* Cart Button (with Bounce Pulse & Counter) */}
              <button
                onClick={onOpenCart}
                aria-label="Shopping Cart"
                className={`flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-forest-950 hover:bg-forest-900 text-cream-100 shadow-md hover:shadow-lg transition-all group focus:outline-none cursor-pointer border border-forest-900 ${
                  cartPulse ? 'scale-110 ring-2 ring-gold-400' : ''
                }`}
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4 text-gold-400 group-hover:scale-110 transition-transform" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-gradient-to-tr from-amber-400 to-yellow-300 text-stone-950 font-black text-[10px] w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                      {cartCount}
                    </span>
                  )}
                </div>
                <span className="hidden sm:inline text-xs font-bold tracking-wide">
                  {language === 'ta' ? 'கூடை' : 'Cart'}
                </span>
              </button>

              {/* Language Switcher Capsule: EN | தமிழ் */}
              <div className="hidden sm:flex items-center p-0.5 rounded-full bg-stone-100 border border-stone-300 shadow-xs">
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    language === 'en'
                      ? 'bg-forest-950 text-gold-300 shadow-xs'
                      : 'text-stone-600 hover:text-forest-950'
                  }`}
                  title="Switch to English"
                >
                  EN
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('ta')}
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition-all cursor-pointer ${
                    language === 'ta'
                      ? 'bg-forest-950 text-gold-300 shadow-xs'
                      : 'text-stone-600 hover:text-forest-950'
                  }`}
                  title="தமிழுக்கு மாற்றவும்"
                >
                  தமிழ்
                </button>
              </div>

              {/* Mobile Hamburger Drawer Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="p-2 rounded-xl text-stone-800 hover:bg-stone-100 md:hidden focus:outline-none cursor-pointer border border-stone-200"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>

            </div>

          </div>
        </div>

        {/* 4. Mobile Navigation Drawer (Full Menu with Stagger Animation) */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white/98 backdrop-blur-md border-b border-stone-200 px-4 pt-3 pb-6 shadow-xl animate-fadeIn space-y-3">
            
            {/* Mobile Nav Links */}
            <div className="flex flex-col space-y-1">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/about');
                }}
                className="p-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider text-stone-800 hover:bg-stone-100 transition-colors flex items-center justify-between"
              >
                <span>{language === 'ta' ? 'எங்கள் வரலாறு' : 'OUR STORY'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/shop');
                }}
                className="p-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider text-stone-800 hover:bg-stone-100 transition-colors flex items-center justify-between"
              >
                <span>{language === 'ta' ? 'எண்ணெய் வகைகள்' : 'SHOP'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  onNavigate('/contact');
                }}
                className="p-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider text-stone-800 hover:bg-stone-100 transition-colors flex items-center justify-between"
              >
                <span>{language === 'ta' ? 'தொடர்பு' : 'CONTACT'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </button>

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onOpenFaq) onOpenFaq();
                  else onNavigate('/why-us');
                }}
                className="p-2.5 rounded-xl text-left text-xs font-bold uppercase tracking-wider text-amber-700 bg-amber-50/60 transition-colors flex items-center justify-between"
              >
                <span>{language === 'ta' ? 'கேள்விகள் (FAQs)' : 'FAQs'}</span>
                <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
              </button>
            </div>

            {/* Mobile Language Switcher */}
            <div className="flex items-center justify-between p-2.5 rounded-xl bg-stone-100 border border-stone-200">
              <span className="text-xs font-bold text-stone-700">Language / மொழி:</span>
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

            {/* Mobile Account / Sign In Action */}
            <div className="pt-2">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (currentUser && onOpenProfile) onOpenProfile();
                  else onNavigate('/login');
                }}
                className="w-full py-2.5 px-4 rounded-xl bg-forest-950 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-sm"
              >
                <User className="w-4 h-4 text-gold-400" />
                <span>{currentUser ? currentUser.name : language === 'ta' ? 'கணக்கில் உள்நுழை' : 'Account / Log in'}</span>
              </button>
            </div>

          </div>
        )}

      </header>
    </>
  );
};
