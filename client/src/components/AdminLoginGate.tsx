import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, ArrowLeft, ArrowRight, AlertCircle, Shield } from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface AdminLoginGateProps {
  onLoginSuccess: (user: UserProfile) => void;
  onBackToStore: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({
  onLoginSuccess,
  onBackToStore,
}) => {
  const { language } = useLanguage();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setErrorMessage(
        language === 'ta'
          ? 'தயவுசெய்து Email ID மற்றும் Password இரண்டையும் உள்ளிடவும்.'
          : 'Please enter both Email and Password.'
      );
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const validEmails = [
        'admin@pureva.com',
        'admin@ssoil.com',
        'admin@gmail.com',
        'admin@oil.com',
        'admin',
      ];
      const validPasswords = ['admin', 'admin123', 'pureva123', 'admin@123'];

      const isEmailValid = validEmails.includes(cleanEmail) || cleanEmail.startsWith('admin');
      const isPassValid = validPasswords.includes(cleanPass);

      if (isEmailValid && isPassValid) {
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
      } else {
        setIsLoading(false);
        setErrorMessage(
          language === 'ta'
            ? 'தவறான Email அல்லது Password! (admin@pureva.com / admin123)'
            : 'Invalid Email or Password. Try: admin@pureva.com / admin123'
        );
      }
    }, 350);
  };

  const handleQuickFill = () => {
    setEmail('admin@pureva.com');
    setPassword('admin123');
  };

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col justify-center items-center px-4 py-12">
      
      {/* Back button */}
      <div className="w-full max-w-sm mb-4">
        <button
          onClick={onBackToStore}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-500 hover:text-stone-900 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{language === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Store'}</span>
        </button>
      </div>

      {/* Simple Clean Admin Login Card */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-stone-200 shadow-sm p-6 sm:p-8">
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full bg-stone-900 text-gold-400 flex items-center justify-center mx-auto mb-3 shadow-xs">
            <Shield className="w-6 h-6 text-gold-400" />
          </div>
          <h1 className="text-2xl font-bold text-stone-900">
            {language === 'ta' ? 'அட்மின் உள்நுழைவு' : 'Admin Login'}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {language === 'ta'
              ? 'அட்மின் பக்கத்தைத் திறக்க உள்நுழையவும்'
              : 'Enter your credentials to access the admin portal'}
          </p>
        </div>

        {/* Error alert */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {language === 'ta' ? 'மின்னஞ்சல் (Email ID)' : 'Email ID'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@pureva.com"
                required
                className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              {language === 'ta' ? 'கடவுச்சொல் (Password)' : 'Password'}
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="admin123"
                required
                className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 transition-all"
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

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-2 shadow-xs"
          >
            {isLoading ? (
              <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                <span>{language === 'ta' ? 'உள்நுழைக' : 'Sign In as Admin'}</span>
                <ArrowRight className="w-4 h-4 text-gold-400" />
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Helper */}
        <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>Demo: admin@pureva.com</span>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-stone-700 hover:text-stone-900 hover:underline cursor-pointer font-bold"
          >
            Auto Fill
          </button>
        </div>

      </div>

    </div>
  );
};
