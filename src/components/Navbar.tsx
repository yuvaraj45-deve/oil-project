import React, { useState, useEffect } from 'react';
import { Search, User, ShoppingBag, Menu, X, Phone, ShieldCheck, Heart, Sparkles, Compass } from 'lucide-react';

interface NavbarProps {
  cartCount: number;
  onOpenCart: () => void;
  onOpenSearch: () => void;
  onNavigateCategory: (slug: string) => void;
  onOpenPurityReport: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  cartCount,
  onOpenCart,
  onOpenSearch,
  onNavigateCategory,
  onOpenPurityReport,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'Mill Journey', href: '#mill-journey' },
    { name: 'Oil Sommelier', href: '#sommelier' },
    { name: 'Shop All', href: '#products' },
    { name: 'Categories', href: '#categories' },
    { name: 'Why SS OIL', href: '#why-us' },
    { name: 'About Us', href: '#about' },
    { name: 'Contact', href: '#contact' },
  ];

  return (
    <>
      {/* Top Announcement Bar */}
      <div className="bg-forest-900 text-cream-100 text-xs py-2 px-4 border-b border-forest-800">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold bg-gold-500 text-forest-950 uppercase tracking-wider font-mono">
              Launch Special
            </span>
            <span className="text-cream-200">
              Free Express Delivery on all orders above ₹499 across India ✨
            </span>
          </div>
          <div className="flex items-center gap-4 text-cream-300 hidden md:flex">
            <a href="tel:1800-425-7764" className="flex items-center gap-1 hover:text-gold-400 transition-colors">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>1800-425-SSOIL</span>
            </a>
            <span className="text-forest-700">|</span>
            <button
              onClick={onOpenPurityReport}
              className="flex items-center gap-1.5 hover:text-gold-400 transition-colors cursor-pointer text-left"
              title="Click to view official laboratory purity certificate"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold-400" />
              <span className="underline decoration-gold-500/50 underline-offset-2">100% Mara Chekku Lab Tested</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'glass-nav shadow-soft py-3'
            : 'bg-cream-100/95 backdrop-blur-md py-4 border-b border-cream-300/40'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <a href="#home" className="flex items-center gap-3 group focus:outline-none">
              <div className="w-11 h-11 rounded-full bg-forest-900 flex items-center justify-center shadow-md relative overflow-hidden group-hover:scale-105 transition-transform">
                {/* Golden oil drop badge icon */}
                <div className="absolute inset-0 bg-gradient-to-tr from-forest-950 to-forest-800" />
                <svg
                  className="w-6 h-6 text-gold-400 relative z-10"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                >
                  <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
                </svg>
                <div className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full bg-gold-300 animate-ping opacity-75" />
              </div>
              <div>
                <div className="flex items-baseline gap-1">
                  <span className="font-serif text-2xl font-black tracking-tight text-forest-900 group-hover:text-forest-700 transition-colors">
                    SS OIL
                  </span>
                  <span className="text-[10px] font-bold text-gold-600 uppercase tracking-widest px-1 py-0.2 bg-gold-100 rounded">
                    Pure
                  </span>
                </div>
                <p className="text-[10px] tracking-wider uppercase text-stone-500 font-medium -mt-0.5">
                  Artisanal Mara Chekku
                </p>
              </div>
            </a>

            {/* Desktop Navigation Links */}
            <nav className="hidden xl:flex items-center space-x-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-stone-700 hover:text-forest-900 text-sm font-semibold tracking-wide transition-colors relative py-1 after:absolute after:bottom-0 after:left-0 after:w-0 after:h-0.5 after:bg-gold-500 hover:after:w-full after:transition-all after:duration-300"
                >
                  {link.name}
                </a>
              ))}
            </nav>

            {/* Action Icons */}
            <div className="flex items-center space-x-2 sm:space-x-3">
              {/* Lab Certificate Shortcut Button */}
              <button
                onClick={onOpenPurityReport}
                className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-forest-900/10 hover:bg-forest-900 text-forest-900 hover:text-gold-300 text-xs font-bold transition-all border border-forest-900/20 cursor-pointer"
                title="View Gas Chromatography Lab Report"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-gold-600" />
                <span>Lab Report</span>
              </button>

              {/* Search Trigger */}
              <button
                onClick={onOpenSearch}
                aria-label="Search edible oils"
                className="p-2.5 rounded-full text-stone-700 hover:text-forest-900 hover:bg-cream-200 transition-colors focus:outline-none cursor-pointer"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Account Icon */}
              <button
                aria-label="Account profile"
                onClick={() => alert('SS OIL Account Portal: Sign in / Registration module is active.')}
                className="p-2.5 rounded-full text-stone-700 hover:text-forest-900 hover:bg-cream-200 transition-colors focus:outline-none hidden sm:inline-flex cursor-pointer"
              >
                <User className="w-5 h-5" />
              </button>

              {/* Shopping Cart Button */}
              <button
                onClick={onOpenCart}
                aria-label="Shopping Cart"
                className="relative p-2.5 rounded-full bg-forest-900 text-cream-100 hover:bg-forest-800 transition-all shadow-sm hover:shadow group focus:outline-none cursor-pointer"
              >
                <ShoppingBag className="w-5 h-5 group-hover:scale-110 transition-transform" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-gold-500 text-forest-950 font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center border-2 border-cream-100 animate-pulse">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* Mobile Hamburger Toggle */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label="Toggle mobile menu"
                className="p-2.5 rounded-lg text-stone-800 hover:bg-cream-200 xl:hidden focus:outline-none cursor-pointer"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="xl:hidden bg-cream-100 border-b border-cream-300 px-4 pt-3 pb-6 animate-fadeIn">
            <div className="flex flex-col space-y-2">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-stone-800 hover:text-forest-900 font-semibold py-2 px-3 rounded-lg hover:bg-cream-200 text-sm"
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3 border-t border-cream-300/60 flex items-center justify-between text-xs text-stone-600 px-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPurityReport();
                  }}
                  className="flex items-center gap-1.5 text-forest-900 font-bold"
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  View Lab Certificate
                </button>
                <span className="font-semibold text-stone-500">Estd. 1984</span>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
};
