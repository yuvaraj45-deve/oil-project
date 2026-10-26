import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Loading & error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMessage(
        language === 'ta'
          ? 'மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.'
          : 'Please enter both email and password.'
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
      // 1. Check Admin Credentials
      const adminEmails = ['admin@pureva.com', 'admin@ssoil.com', 'admin@gmail.com', 'admin'];
      const adminPasswords = ['admin', 'admin123', 'pureva123', 'admin@123'];

      const isAdmin =
        !isRegister &&
        (adminEmails.includes(cleanEmail) || cleanEmail.startsWith('admin')) &&
        adminPasswords.includes(cleanPass);

      if (isAdmin) {
        try {
          sessionStorage.setItem('pureva_admin_unlocked', 'true');
        } catch (e) {}

        const adminUser: UserProfile = {
          id: 'usr_admin',
          name: 'PureVa Admin',
          email: cleanEmail.includes('@') ? cleanEmail : 'admin@pureva.com',
          phone: '1800 425 7764',
          role: 'admin',
          memberTier: 'Platinum Member',
          purityPoints: 9999,
        };

        setIsLoading(false);
        onLoginSuccess(adminUser);
        if (onOpenAdmin) {
          onOpenAdmin();
        } else {
          onNavigate('/admin');
        }
        return;
      }

      // 2. Normal Customer Login / Register
      let displayName = name.trim();
      if (!displayName) {
        if (cleanEmail.includes('@')) {
          const raw = cleanEmail.split('@')[0];
          displayName = raw.charAt(0).toUpperCase() + raw.slice(1);
        } else {
          displayName = cleanEmail.charAt(0).toUpperCase() + cleanEmail.slice(1);
        }
      }

      const customerUser: UserProfile = {
        id: `usr_${Date.now()}`,
        name: displayName,
        email: cleanEmail.includes('@') ? cleanEmail : `${cleanEmail}@gmail.com`,
        phone: '98421 45620',
        role: 'customer',
        memberTier: 'Gold Member',
        purityPoints: isRegister ? 100 : 240,
      };

      setIsLoading(false);
      onLoginSuccess(customerUser);
      onNavigate('/');
    }, 400);
  };

  const handleQuickDemo = (type: 'customer' | 'admin') => {
    if (type === 'admin') {
      setEmail('admin@pureva.com');
      setPassword('admin123');
      setIsRegister(false);
    } else {
      setEmail('customer@pureva.com');
      setPassword('user123');
      setIsRegister(false);
    }
  };

  return (
    <div className="min-h-[85vh] bg-stone-50 flex flex-col justify-center items-center px-4 py-12">
      
      {/* Back button */}
      <div className="w-full max-w-sm mb-4">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Home'}</span>
        </button>
      </div>

      {/* Simple Login Box */}
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
                ? 'புதிய கணக்கு'
                : 'Create Account'
              : language === 'ta'
              ? 'உள்நுழைவு'
              : 'Login'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {isRegister
              ? language === 'ta'
                ? 'புதிய கணக்கை உருவாக்க விவரங்களை உள்ளிடவும்'
                : 'Sign up to start ordering fresh pure oils'
              : language === 'ta'
              ? 'உங்கள் மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்'
              : 'Enter your email and password to continue'}
          </p>
        </div>

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          
          {/* Name field (Only for Register) */}
          {isRegister && (
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                {language === 'ta' ? 'பெயர்' : 'Full Name'}
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

          {/* Email / Username Field */}
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {language === 'ta' ? 'மின்னஞ்சல்' : 'Email Address'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
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

        {/* Subtle Quick Demo Helpers */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>Quick fill:</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('customer')}
              className="text-stone-600 hover:text-forest-950 hover:underline cursor-pointer font-medium"
            >
              User
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => handleQuickDemo('admin')}
              className="text-amber-700 hover:text-amber-900 hover:underline cursor-pointer font-bold"
            >
              Admin
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
