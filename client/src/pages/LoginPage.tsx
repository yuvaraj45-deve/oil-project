import React, { useState, useEffect } from 'react';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  ShieldCheck,
  CheckCircle2,
  RefreshCw,
  Sparkles,
  LogIn,
  UserPlus,
} from 'lucide-react';
import { UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface LoginPageProps {
  onLoginSuccess: (user: UserProfile) => void;
  onNavigate: (path: string) => void;
  onOpenAdmin?: () => void;
  initialMode?: 'login' | 'register';
}

interface StoredAccount {
  id: string;
  name: string;
  email: string;
  phone: string;
  city?: string;
  address?: string;
  password?: string;
  role: 'customer' | 'admin';
  memberTier: 'Gold Member' | 'Silver Member' | 'Platinum Member';
  purityPoints: number;
  isVerified: boolean;
  createdAt?: string;
}

// Built-in default seed accounts for seamless demo testing
const DEFAULT_SEED_ACCOUNTS: StoredAccount[] = [
  {
    id: 'usr_ramesh',
    name: 'Ramesh Sundaram',
    email: 'ramesh.sundaram@gmail.com',
    phone: '9842145620',
    city: 'Coimbatore',
    address: '14, Cross Cut Road, Gandhipuram',
    password: 'password123',
    role: 'customer',
    memberTier: 'Gold Member',
    purityPoints: 240,
    isVerified: true,
  },
  {
    id: 'usr_anitha',
    name: 'Anitha Vijay',
    email: 'anitha.vijay@yahoo.co.in',
    phone: '9789234110',
    city: 'Chennai',
    address: '42, Anna Nagar West',
    password: 'password123',
    role: 'customer',
    memberTier: 'Silver Member',
    purityPoints: 120,
    isVerified: true,
  },
  {
    id: 'usr_karthik',
    name: 'Karthik Narayanan',
    email: 'karthik.n@gmail.com',
    phone: '9443289100',
    city: 'Madurai',
    address: '5, West Masi Street',
    password: 'password123',
    role: 'customer',
    memberTier: 'Gold Member',
    purityPoints: 310,
    isVerified: true,
  },
];

export const LoginPage: React.FC<LoginPageProps> = ({
  onLoginSuccess,
  onNavigate,
  onOpenAdmin,
  initialMode,
}) => {
  const { language, setLanguage } = useLanguage();

  // First time visitor opens Register Page; Second time visitor opens Sign In Page!
  const [isRegister, setIsRegister] = useState<boolean>(() => {
    if (initialMode === 'register') return true;
    if (initialMode === 'login') return false;
    const hasRegistered = localStorage.getItem('ssoil_has_registered');
    return hasRegistered !== 'true'; // First time: Register! Second time: Sign In!
  });

  // Flow Step: 'details' -> 'verified'
  const [step, setStep] = useState<'details' | 'verified'>('details');

  // Registration Full Details
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');

  // Sign In Credentials (always empty on mount, no admin hints)
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Pending user object for welcome display
  const [pendingUser, setPendingUser] = useState<StoredAccount | null>(null);

  // Loading & error
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset fields when switching between sign-in and register
  useEffect(() => {
    setLoginIdentifier('');
    setPassword('');
    setConfirmPassword('');
    setErrorMessage(null);
  }, [isRegister]);

  // Helper to get all registered accounts (combining seed + saved in localStorage)
  const getRegisteredAccounts = (): StoredAccount[] => {
    try {
      const saved = localStorage.getItem('ssoil_registered_accounts');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const merged = [...parsed];
          DEFAULT_SEED_ACCOUNTS.forEach((seed) => {
            if (!merged.some((m) => m.email.toLowerCase() === seed.email.toLowerCase())) {
              merged.push(seed);
            }
          });
          return merged;
        }
      }
    } catch (e) {}
    return DEFAULT_SEED_ACCOUNTS;
  };

  // Helper to save a new registered account
  const saveNewAccount = (newAcc: StoredAccount) => {
    try {
      const current = getRegisteredAccounts();
      const existingIdx = current.findIndex(
        (a) => a.email.toLowerCase() === newAcc.email.toLowerCase() || a.phone === newAcc.phone
      );
      if (existingIdx >= 0) {
        current[existingIdx] = { ...current[existingIdx], ...newAcc };
      } else {
        current.unshift(newAcc);
      }
      localStorage.setItem('ssoil_registered_accounts', JSON.stringify(current));
      localStorage.setItem('ssoil_has_registered', 'true');
    } catch (e) {}
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // ==============================================================
    // 1. SIGN IN FLOW (Second-time login or returning user)
    // ==============================================================
    if (!isRegister) {
      const cleanId = loginIdentifier.trim();
      const cleanPass = password.trim();
      const lowerId = cleanId.toLowerCase();

      if (!cleanId || !cleanPass) {
        setErrorMessage(
          language === 'ta'
            ? 'மின்னஞ்சல் மற்றும் கடவுச்சொல்லை உள்ளிடவும்.'
            : 'Please enter both Email/Phone and password.'
        );
        return;
      }

      // Silent Admin Login Bypass Check
      const adminIds = ['admin', 'admin@ssoil.com', 'admin@pureva.com', 'admin@gmail.com', 'ssoil_admin', 'ssoiladmin'];
      const adminPasswords = ['admin', 'admin123', 'pureva123', 'admin@123', 'ssoil123', 'ssoil', 'admin2026'];

      if (adminIds.includes(lowerId) || lowerId.startsWith('admin')) {
        if (adminPasswords.includes(cleanPass)) {
          setIsLoading(true);
          setTimeout(() => {
            try {
              sessionStorage.setItem('pureva_admin_unlocked', 'true');
              sessionStorage.setItem('admin_active_tab', 'dashboard');
            } catch (e) {}

            const adminUser: UserProfile = {
              id: 'usr_admin',
              name: 'SS OIL Admin',
              email: cleanId.includes('@') ? cleanId : 'admin@ssoil.com',
              phone: '1800 425 7764',
              role: 'admin',
              memberTier: 'Platinum Member',
              purityPoints: 9999,
              city: 'Coimbatore',
              isVerified: true,
            };

            try {
              localStorage.setItem('ssoil_user', JSON.stringify(adminUser));
              const dirStr = localStorage.getItem('ssoil_users_directory');
              const dir = dirStr ? JSON.parse(dirStr) : [];
              const existingIdx = dir.findIndex(
                (u: any) => u.email === adminUser.email || (adminUser.id && u.id === adminUser.id)
              );
              const record = {
                ...adminUser,
                lastLogin: 'Just Now (Online)',
                status: 'Active',
                totalOrders: 0,
                totalSpent: 0,
              };
              if (existingIdx >= 0) dir[existingIdx] = { ...dir[existingIdx], ...record };
              else dir.unshift(record);
              localStorage.setItem('ssoil_users_directory', JSON.stringify(dir));
              window.dispatchEvent(new Event('ssoil_user_logged_in'));
            } catch (e) {}

            setIsLoading(false);
            onLoginSuccess(adminUser);
            if (onOpenAdmin) onOpenAdmin();
            else onNavigate('/admin');
          }, 350);
          return;
        } else {
          // Admin password wrong
          setErrorMessage(
            language === 'ta'
              ? 'தவறான கடவுச்சொல். சரியான கடவுச்சொல்லை உள்ளிடவும் (Incorrect password).'
              : 'Incorrect password. Please enter the correct password.'
          );
          return;
        }
      }

      // Customer Sign In Verification
      setIsLoading(true);
      setTimeout(() => {
        const accounts = getRegisteredAccounts();
        const cleanPhoneDigits = cleanId.replace(/\D/g, '');

        // Find user by email or 10-digit phone
        const matchedAccount = accounts.find(
          (a) =>
            a.email.toLowerCase() === lowerId ||
            (cleanPhoneDigits.length >= 10 && a.phone.replace(/\D/g, '').endsWith(cleanPhoneDigits))
        );

        if (!matchedAccount) {
          setIsLoading(false);
          setErrorMessage(
            language === 'ta'
              ? 'இந்த மின்னஞ்சலில் கணக்கு பதிவு செய்யப்படவில்லை. தயவுசெய்து முதலில் பதிவு செய்யவும்.'
              : 'Account not found with this Email/Phone. Please register first.'
          );
          return;
        }

        // Verify Password
        if (matchedAccount.password && matchedAccount.password !== cleanPass) {
          setIsLoading(false);
          setErrorMessage(
            language === 'ta'
              ? 'தவறான கடவுச்சொல் (Incorrect password). சரியான கடவுச்சொல்லை உள்ளிடவும்.'
              : 'Incorrect password. Please enter the correct password.'
          );
          return;
        }

        // Correct Password -> Sign In Success!
        const verifiedUser: UserProfile = {
          id: matchedAccount.id,
          name: matchedAccount.name,
          email: matchedAccount.email,
          phone: matchedAccount.phone,
          city: matchedAccount.city || 'Coimbatore',
          address: matchedAccount.address || '',
          role: 'customer',
          memberTier: matchedAccount.memberTier || 'Gold Member',
          purityPoints: matchedAccount.purityPoints || 240,
          isVerified: true,
        };

        try {
          localStorage.setItem('ssoil_user', JSON.stringify(verifiedUser));
          const dirStr = localStorage.getItem('ssoil_users_directory');
          const dir = dirStr ? JSON.parse(dirStr) : [];
          const existingIdx = dir.findIndex(
            (u: any) => u.phone === verifiedUser.phone || u.email === verifiedUser.email
          );
          // Calculate actual orders placed by this user (0 if they haven't ordered yet)
          let userOrdersCount = 0;
          let userOrdersSpent = 0;
          try {
            const savedOrdersStr = localStorage.getItem('ssoil_orders');
            if (savedOrdersStr) {
              const savedOrders = JSON.parse(savedOrdersStr);
              if (Array.isArray(savedOrders)) {
                const userOrders = savedOrders.filter((o: any) => {
                  const oEmail = (o.customerEmail || '').toLowerCase().trim();
                  const oPhone = (o.customerPhone || '').replace(/\D/g, '');
                  const uEmail = (verifiedUser.email || '').toLowerCase().trim();
                  const uPhone = (verifiedUser.phone || '').replace(/\D/g, '');
                  return (uEmail && oEmail === uEmail) || (uPhone && oPhone === uPhone);
                });
                userOrdersCount = userOrders.length;
                userOrdersSpent = userOrders.reduce((sum: number, o: any) => sum + (o.totalAmount || 0), 0);
              }
            }
          } catch (e) {}

          const record = {
            ...verifiedUser,
            lastLogin: 'Just Now (Online)',
            status: 'Active',
            totalOrders: userOrdersCount,
            totalSpent: userOrdersSpent,
          };
          if (existingIdx >= 0) dir.splice(existingIdx, 1);
          dir.unshift(record);
          localStorage.setItem('ssoil_users_directory', JSON.stringify(dir));
          window.dispatchEvent(new Event('ssoil_user_logged_in'));
        } catch (e) {}

        setIsLoading(false);
        onLoginSuccess(verifiedUser);
        onNavigate('/');
      }, 400);

      return;
    }

    // ==============================================================
    // 2. REGISTER FLOW (First-time user collects full details & verifies)
    // ==============================================================
    const cleanName = name.trim();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    const cleanEmail = email.trim().toLowerCase();
    const cleanCity = city.trim();
    const cleanPass = password.trim();
    const cleanConfirmPass = confirmPassword.trim();

    if (!cleanName) {
      setErrorMessage(
        language === 'ta' ? 'தயவுசெய்து உங்கள் முழுப் பெயரை உள்ளிடவும்.' : 'Please enter your full name.'
      );
      return;
    }

    if (cleanPhone.length < 10) {
      setErrorMessage(
        language === 'ta'
          ? 'தயவுசெய்து சரியான 10 இலக்க தொலைபேசி எண்ணை உள்ளிடவும்.'
          : 'Please enter a valid 10-digit mobile number.'
      );
      return;
    }

    if (!cleanEmail || !cleanEmail.includes('@')) {
      setErrorMessage(
        language === 'ta'
          ? 'தயவுசெய்து சரியான மின்னஞ்சல் முகவரியை உள்ளிடவும்.'
          : 'Please enter a valid email address.'
      );
      return;
    }

    if (!cleanCity) {
      setErrorMessage(
        language === 'ta' ? 'தயவுசெய்து உங்கள் நகரம் / ஊரை உள்ளிடவும்.' : 'Please enter your city/town.'
      );
      return;
    }

    if (!cleanPass || cleanPass.length < 4) {
      setErrorMessage(
        language === 'ta'
          ? 'கடவுச்சொல் குறைந்தபட்சம் 4 எழுத்துக்கள் இருக்க வேண்டும்.'
          : 'Password must be at least 4 characters long.'
      );
      return;
    }

    if (!cleanConfirmPass) {
      setErrorMessage(
        language === 'ta'
          ? 'தயவுசெய்து கடவுச்சொல்லை உறுதிப்படுத்தவும் (Confirm Password).'
          : 'Please enter confirm password.'
      );
      return;
    }

    if (cleanPass !== cleanConfirmPass) {
      setErrorMessage(
        language === 'ta'
          ? 'கடவுச்சொல் மற்றும் உறுதிப்படுத்தல் கடவுச்சொல் பொருந்தவில்லை (Passwords do not match).'
          : 'Password and Confirm Password do not match.'
      );
      return;
    }

    // Check if email already registered
    const accounts = getRegisteredAccounts();
    const alreadyExists = accounts.some(
      (a) => a.email.toLowerCase() === cleanEmail || a.phone.replace(/\D/g, '') === cleanPhone
    );

    if (alreadyExists) {
      setErrorMessage(
        language === 'ta'
          ? 'இந்த மின்னஞ்சல் அல்லது தொலைபேசி எண்ணில் ஏற்கனவே கணக்கு உள்ளது. தயவுசெய்து உள்நுழையவும்.'
          : 'An account already exists with this Email or Phone. Please Sign In.'
      );
      return;
    }

    // Prepare new registered account
    const newAcc: StoredAccount = {
      id: `usr_${Date.now()}`,
      name: cleanName.charAt(0).toUpperCase() + cleanName.slice(1),
      phone: cleanPhone,
      email: cleanEmail,
      city: cleanCity,
      address: address.trim(),
      password: cleanPass,
      role: 'customer',
      memberTier: 'Gold Member',
      purityPoints: 240,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };
    setPendingUser(newAcc);
    setIsLoading(true);

    setTimeout(() => {
      // 1. Save new account permanently into registered accounts database
      saveNewAccount(newAcc);

      // 2. Set current active user session
      const verifiedProfile: UserProfile = {
        id: newAcc.id,
        name: newAcc.name,
        phone: newAcc.phone,
        email: newAcc.email,
        city: newAcc.city,
        address: newAcc.address,
        role: 'customer',
        memberTier: 'Gold Member',
        purityPoints: 240,
        isVerified: true,
      };

      try {
        localStorage.setItem('ssoil_user', JSON.stringify(verifiedProfile));
        const dirStr = localStorage.getItem('ssoil_users_directory');
        const dir = dirStr ? JSON.parse(dirStr) : [];
        const existingIdx = dir.findIndex(
          (u: any) => u.phone === verifiedProfile.phone || u.email === verifiedProfile.email
        );
        const record = {
          ...verifiedProfile,
          lastLogin: 'Just Now (Online)',
          status: 'Active',
          totalOrders: 0,
          totalSpent: 0,
        };
        if (existingIdx >= 0) dir.splice(existingIdx, 1);
        dir.unshift(record);
        localStorage.setItem('ssoil_users_directory', JSON.stringify(dir));
        window.dispatchEvent(new Event('ssoil_user_logged_in'));
      } catch (e) {}

      setStep('verified');

      setTimeout(() => {
        setIsLoading(false);
        onLoginSuccess(verifiedProfile);
        onNavigate('/');
      }, 700);
    }, 350);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#FFFDF7] via-stone-50 to-[#FFF9E6] flex flex-col justify-center items-center px-4 py-8 sm:py-12 relative overflow-hidden">
      {/* Decorative Warm Ambient Glows */}
      <div className="absolute top-0 right-1/4 w-96 h-96 rounded-full bg-amber-100/50 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full bg-emerald-100/30 blur-3xl pointer-events-none" />

      {/* Top Bar: Back to Home + Language Toggle */}
      <div className="w-full max-w-md mb-4 flex items-center justify-between relative z-10">
        <button
          onClick={() => onNavigate('/')}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-600 hover:text-stone-900 bg-white/80 hover:bg-white px-3 py-1.5 rounded-xl border border-stone-200/80 shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4 text-forest-900" />
          <span>{language === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Back to Store'}</span>
        </button>

        <div className="flex items-center gap-1 bg-white/80 border border-stone-200/80 p-0.5 rounded-xl shadow-2xs text-[11px] font-bold">
          <button
            onClick={() => setLanguage('en')}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              language === 'en' ? 'bg-forest-950 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('ta')}
            className={`px-2 py-1 rounded-lg transition-colors cursor-pointer ${
              language === 'ta' ? 'bg-forest-950 text-white shadow-2xs' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            தமிழ்
          </button>
        </div>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md bg-white rounded-3xl border border-stone-200/90 shadow-xl p-6 sm:p-8 relative z-10 backdrop-blur-md">
        {/* Brand Header */}
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-full bg-forest-950 text-gold-400 flex items-center justify-center mx-auto mb-3 shadow-md relative group">
            <svg className="w-7 h-7 fill-gold-400" viewBox="0 0 24 24">
              <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
            </svg>
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 rounded-full p-1 text-white border-2 border-white shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-stone-900 font-serif">
            {step === 'verified'
              ? language === 'ta'
                ? 'பதிவு முடிந்தது!'
                : 'Registration Successful!'
              : isRegister
              ? language === 'ta'
                ? 'புதிய பயனர் பதிவு (Register)'
                : 'New Customer Registration'
              : language === 'ta'
              ? 'பயனர் உள்நுழைவு (Sign In)'
              : 'Customer Sign In'}
          </h1>

          <p className="text-xs text-stone-500 mt-1 leading-relaxed">
            {step === 'verified'
              ? language === 'ta'
                ? 'உங்கள் கணக்கு வெற்றிகரமாக உருவாக்கப்பட்டது. உள்நுழைகிறது...'
                : 'Your profile has been created. Redirecting to store...'
              : isRegister
              ? language === 'ta'
                ? 'முதல் முறை பயனர்: உங்கள் விவரங்களை உள்ளிட்டு பதிவு செய்யவும்'
                : 'First-time customer: enter your details to register directly'
              : language === 'ta'
              ? 'உங்கள் மின்னஞ்சல் அல்லது தொலைபேசி மற்றும் கடவுச்சொல் கொண்டு உள்நுழையவும்'
              : 'Enter your registered Email/Phone and password to sign in'}
          </p>
        </div>

        {/* Tab Switcher: Sign In vs Register (Only on details step) */}
        {step === 'details' && (
          <div className="flex items-center p-1 bg-stone-100 rounded-2xl mb-5 text-xs font-bold">
            <button
              type="button"
              onClick={() => {
                setIsRegister(false);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                !isRegister
                  ? 'bg-white text-forest-950 shadow-xs font-extrabold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'உள்நுழைவு (Sign In)' : 'Sign In'}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setIsRegister(true);
                setErrorMessage(null);
              }}
              className={`flex-1 py-2 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                isRegister
                  ? 'bg-white text-forest-950 shadow-xs font-extrabold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'பதிவு செய்க (Register)' : 'Register'}</span>
            </button>
          </div>
        )}

        {/* Error message */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* STEP 1: FORM (Sign In OR Register) */}
        {step === 'details' && (
          <form onSubmit={handleSubmit} autoComplete="off" className="space-y-3.5">
            {/* ---------------- REGISTRATION FIELDS ---------------- */}
            {isRegister ? (
              <>
                {/* Full Name */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'முழுப் பெயர் (Full Name)' : 'Full Name'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="reg_fullname"
                      autoComplete="off"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder=""
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Mobile / Phone Number */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'தொலைபேசி எண் (Mobile Number)' : 'Mobile Phone Number'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-stone-500 font-mono">
                      +91
                    </span>
                    <input
                      type="tel"
                      name="reg_phone"
                      autoComplete="off"
                      maxLength={10}
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
                      placeholder=""
                      required
                      className="w-full pl-12 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm font-mono text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all bg-stone-50/50"
                    />
                    <Phone className="w-4 h-4 text-stone-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'மின்னஞ்சல் முகவரி (Email Address)' : 'Email Address'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="email"
                      name="reg_email"
                      autoComplete="off"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder=""
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* City / Location & Address */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'ta' ? 'நகரம் (City / Town)' : 'City / Town'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        name="reg_city"
                        autoComplete="off"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder=""
                        required
                        className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all bg-stone-50/50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      {language === 'ta' ? 'முகவரி (Street Address)' : 'Street Address'}
                    </label>
                    <input
                      type="text"
                      name="reg_address"
                      autoComplete="off"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder=""
                      className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Create Password */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'கடவுச்சொல் (Create Password)' : 'Create Password'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="reg_password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=""
                      required
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all bg-stone-50/50 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <Eye className="w-4 h-4 text-forest-900" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'கடவுச்சொல்லை உறுதிப்படுத்துக (Confirm Password)' : 'Confirm Password'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      name="reg_confirm_password"
                      autoComplete="new-password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder=""
                      required
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all bg-stone-50/50 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      title={showConfirmPassword ? 'Hide password' : 'Show password'}
                    >
                      {showConfirmPassword ? <Eye className="w-4 h-4 text-forest-900" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Register Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-forest-950 hover:bg-forest-900 text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-md active:scale-98"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>
                        {language === 'ta'
                          ? 'பதிவு செய்து தொடர்க (Register & Continue)'
                          : 'Register & Continue'}
                      </span>
                      <ArrowRight className="w-4 h-4 text-gold-400" />
                    </>
                  )}
                </button>
              </>
            ) : (
              /* ---------------- SIGN IN FIELDS ---------------- */
              <>
                {/* Email or Phone */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta'
                      ? 'மின்னஞ்சல் அல்லது தொலைபேசி எண்'
                      : 'Email Address or Mobile Number'}{' '}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="ssoil_auth_id"
                      autoComplete="off"
                      autoCorrect="off"
                      autoCapitalize="none"
                      value={loginIdentifier}
                      onChange={(e) => setLoginIdentifier(e.target.value)}
                      placeholder={
                        language === 'ta'
                          ? 'மின்னஞ்சல் அல்லது மொபைல் எண் உள்ளிடவும்'
                          : 'Enter email or mobile number'
                      }
                      required
                      className="w-full pl-9 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all bg-stone-50/50"
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      {language === 'ta' ? 'கடவுச்சொல் (Password)' : 'Password'}{' '}
                      <span className="text-red-500">*</span>
                    </label>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="ssoil_auth_secret"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder=""
                      required
                      className="w-full pl-9 pr-9 py-2.5 rounded-xl border border-stone-300 text-sm text-stone-900 placeholder-stone-400 focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 transition-all bg-stone-50/50 [&::-ms-reveal]:hidden [&::-ms-clear]:hidden"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 cursor-pointer"
                      title={showPassword ? 'Hide password' : 'Show password'}
                    >
                      {showPassword ? <Eye className="w-4 h-4 text-forest-900" /> : <EyeOff className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* Sign In Submit Button */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 px-4 rounded-xl bg-forest-950 hover:bg-forest-900 text-white font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2 mt-4 shadow-md active:scale-98"
                >
                  {isLoading ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{language === 'ta' ? 'உள்நுழைக (Sign In)' : 'Sign In to Account'}</span>
                      <ArrowRight className="w-4 h-4 text-gold-400" />
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        )}

        {/* STEP 3: Verification Success */}
        {step === 'verified' && (
          <div className="py-6 text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-md">
              <CheckCircle2 className="w-10 h-10 animate-bounce" />
            </div>
            <h3 className="text-xl font-bold text-forest-950 font-serif">
              {language === 'ta' ? 'பதிவு & சரிபார்ப்பு முடிந்தது!' : 'Registration Verified!'}
            </h3>
            <p className="text-xs text-stone-600 max-w-xs mx-auto">
              {language === 'ta'
                ? `வணக்கம் ${pendingUser?.name || ''}! உங்கள் விவரங்கள் வெற்றிகரமாக சரிபார்க்கப்பட்டு கணக்கு உருவாக்கப்பட்டது.`
                : `Welcome ${pendingUser?.name || ''}! Your account has been verified and registered successfully.`}
            </p>
            <div className="flex items-center justify-center gap-2 text-xs font-semibold text-emerald-800 pt-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              <span>{language === 'ta' ? 'முகப்பிற்கு செல்கிறது...' : 'Redirecting to store...'}</span>
            </div>
          </div>
        )}

        {/* Footer Toggle */}
        {step === 'details' && (
          <div className="mt-5 text-center text-xs text-stone-600 border-t border-stone-100 pt-3">
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
                  {language === 'ta' ? 'உள்நுழைக (Sign In)' : 'Sign In'}
                </button>
              </p>
            ) : (
              <p>
                {language === 'ta' ? 'முதல் முறை வாடிக்கையாளரா?' : 'First-time customer?'}{' '}
                <button
                  type="button"
                  onClick={() => {
                    setIsRegister(true);
                    setErrorMessage(null);
                  }}
                  className="font-bold text-forest-950 hover:underline cursor-pointer"
                >
                  {language === 'ta' ? 'புதிய பதிவு செய்க (Register)' : 'Register Here'}
                </button>
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
