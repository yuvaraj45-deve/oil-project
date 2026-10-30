import React, { useState } from 'react';
import { User, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (path: string) => void;
  onOpenAdmin?: () => void;
  initialMode?: 'login' | 'register';
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
  onOpenAdmin,
  initialMode = 'login',
}) => {
  const { language } = useLanguage();
  const [isRegister, setIsRegister] = useState(initialMode === 'register');

  // Input states
  const [name, setName] = useState('');
  const [emailOrId, setEmailOrId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Loading & error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanId = emailOrId.trim();
    const cleanPass = password.trim();

    if (!cleanId || !cleanPass) {
      setErrorMessage(
        language === 'ta'
          ? 'பயனர் ஐடி மற்றும் கடவுச்சொல்லை உள்ளிடவும்.'
          : 'Please enter both User ID and password.'
      );
      return;
    }

    if (isRegister && !name.trim()) {
      setErrorMessage(
        language === 'ta' ? 'உங்கள் பெயரை உள்ளிடவும்.' : 'Please enter your name.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const lowerId = cleanId.toLowerCase();

      // 1. Secret Silent Admin Check (Zero UI disclosure of admin)
      const adminIds = ['admin', 'admin@ssoil.com', 'admin@pureva.com', 'admin@gmail.com', 'ssoil_admin', 'ssoiladmin'];
      const adminPasswords = ['admin', 'admin123', 'pureva123', 'admin@123', 'ssoil123', 'ssoil', 'admin2026'];

      const isAdminAttempt = !isRegister && (adminIds.includes(lowerId) || lowerId.startsWith('admin'));

      if (isAdminAttempt) {
        if (adminPasswords.includes(cleanPass)) {
          try {
            sessionStorage.setItem('pureva_admin_unlocked', 'true');
          } catch (e) {}

          const adminUser: UserProfile = {
            id: 'usr_admin',
            name: 'SS OIL Admin',
            email: cleanId.includes('@') ? cleanId : 'admin@ssoil.com',
            phone: '1800 425 7764',
            role: 'admin',
            memberTier: 'Platinum Member',
            purityPoints: 9999,
          };

          try {
            localStorage.setItem('ssoil_user', JSON.stringify(adminUser));
          } catch (e) {}

          setIsLoading(false);
          onLoginSuccess(adminUser);
          if (onOpenAdmin) {
            onOpenAdmin();
          } else {
            onNavigate('/admin');
          }
          return;
        } else {
          setIsLoading(false);
          setErrorMessage(
            language === 'ta'
              ? 'தவறான கடவுச்சொல். சரியான கடவுச்சொல்லை உள்ளிடவும்.'
              : 'Invalid password. Please enter the correct password.'
          );
          return;
        }
      }

      // 2. Normal Customer Login / Register
      let displayName = name.trim();
      if (!displayName) {
        if (cleanId.includes('@')) {
          const raw = cleanId.split('@')[0];
          displayName = raw.charAt(0).toUpperCase() + raw.slice(1);
        } else {
          displayName = cleanId.charAt(0).toUpperCase() + cleanId.slice(1);
        }
      }

      const customerUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: displayName,
        email: cleanId.includes('@') ? cleanId : `${lowerId.replace(/\s+/g, '')}@gmail.com`,
        phone: '98421 45620',
        role: 'customer',
        memberTier: 'Gold Member',
        purityPoints: isRegister ? 100 : 240,
      };

      try {
        localStorage.setItem('ssoil_user', JSON.stringify(customerUser));
      } catch (e) {}

      setIsLoading(false);
      onLoginSuccess(customerUser);
      onNavigate('/');
    }, 350);
  };

  return (
    <div className="min-h-[85vh] bg-stone-50 flex flex-col justify-center items-center px-4 py-12">
      
      {/* Back to Home Button */}
      <div className="w-full max-w-sm mb-4">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
        </button>
      </div>

      {/* Unified Single Login Box */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        
        {/* Brand Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-forest-950 text-gold-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <svg className="w-6 h-6 fill-gold-400" viewBox="0 0 24 24">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            {isRegister
              ? language === 'ta'
                ? 'புதிய பயனர் கணக்கு'
                : 'Create Account'
              : language === 'ta'
              ? 'உள்நுழைவு'
              : 'Sign In'}
          </h1>
          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {isRegister
              ? language === 'ta'
                ? 'புதிய வாடிக்கையாளர் கணக்கை உருவாக்க விவரங்களை உள்ளிடவும்'
                : 'Sign up to start ordering fresh Mara Chekku oils'
              : language === 'ta'
              ? 'உங்கள் பயனர் ஐடி மற்றும் கடவுச்சொல்லை உள்ளிடவும்'
              : 'Enter your User ID and password to continue'}
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name field (Only for Register) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'ta' ? 'முழுப் பெயர்' : 'Full Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ramesh Sundaram"
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all"
              />
            </div>
          )}

          {/* User ID / Email Address */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {language === 'ta' ? 'பயனர் ஐடி / மின்னஞ்சல்' : 'User ID / Email'}
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={emailOrId}
                onChange={(e) => setEmailOrId(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'User ID அல்லது Email முகவரி'
                    : 'User ID or Email address'
                }
                required
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all"
              />
            </div>
          </div>

          {/* Password Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {language === 'ta' ? 'கடவுச்சொல்' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-forest-950 hover:bg-forest-900 text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-xs"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>
                  {isRegister
                    ? language === 'ta'
                      ? 'கணக்கு உருவாக்குக'
                      : 'Create Account'
                    : language === 'ta'
                    ? 'உள்நுழைக'
                    : 'Sign In'}
                </span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Sign In and Register */}
        <div className="mt-5 text-center text-xs text-stone-600">
          {isRegister ? (
            <p>
              {language === 'ta' ? 'ஏற்கனவே கணக்கு உள்ளதா?' : 'Already have an account?'}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(false);
                  setErrorMessage(null);
                }}
                className="font-bold text-forest-950 hover:underline cursor-pointer"
              >
                {language === 'ta' ? 'உள்நுழைக' : 'Sign In'}
              </button>
            </p>
          ) : (
            <p>
              {language === 'ta' ? 'புதிய கணக்கு தேவையா?' : "Don't have an account?"}{' '}
              <button
                type="button"
                onClick={() => {
                  setIsRegister(true);
                  setErrorMessage(null);
                }}
                className="font-bold text-forest-950 hover:underline cursor-pointer"
              >
                {language === 'ta' ? 'பதிவு செய்க' : 'Sign Up'}
              </button>
            </p>
          )}
        </div>

      </div>

    </div>
  );
};
