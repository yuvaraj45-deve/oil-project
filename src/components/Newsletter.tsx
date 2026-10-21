import React, { useState } from 'react';
import { Mail, CheckCircle2, AlertCircle, ArrowRight, Shield } from 'lucide-react';

export const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      setStatus('error');
      setErrorMessage('Please enter your email address.');
      return;
    }
    if (!emailRegex.test(email.trim())) {
      setStatus('error');
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    // Since no backend is connected, show clear simulation feedback
    setStatus('success');
    setErrorMessage('');
  };

  return (
    <section className="py-14 sm:py-16 bg-cream-100 border-t border-cream-300/60">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Emblem */}
        <div className="w-12 h-12 rounded-full bg-forest-900 text-gold-400 mx-auto flex items-center justify-center mb-4 shadow-sm">
          <Mail className="w-6 h-6" />
        </div>

        <h3 className="text-2xl sm:text-3xl font-serif font-bold text-forest-950 tracking-tight">
          Stay Connected with SS OIL
        </h3>
        <p className="mt-2 text-stone-600 text-sm sm:text-base max-w-xl mx-auto">
          Subscribe for secret festival harvest discounts, traditional oil culinary tips, and wellness articles.
        </p>

        {/* Form */}
        <div className="mt-8 max-w-md mx-auto">
          {status === 'success' ? (
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 text-emerald-800 text-sm flex items-center justify-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>
                <strong>Thank you!</strong> Email received for demonstration. Note: No backend server is connected yet.
              </span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Mail className="w-5 h-5" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (status === 'error') setStatus('idle');
                    }}
                    placeholder="Enter your email address"
                    className="w-full pl-10 pr-4 py-3.5 rounded-xl border border-cream-300 focus:outline-none focus:border-forest-800 focus:ring-1 focus:ring-forest-800 bg-white text-stone-800 text-sm shadow-xs placeholder-stone-400"
                  />
                </div>
                <button
                  type="submit"
                  className="px-6 py-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-100 font-semibold text-sm transition-all duration-200 shadow-sm hover:shadow flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Subscribe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {status === 'error' && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-600 font-medium">
                  <AlertCircle className="w-4 h-4" />
                  <span>{errorMessage}</span>
                </div>
              )}
            </form>
          )}

          <div className="mt-4 flex items-center justify-center gap-1.5 text-xs text-stone-400">
            <Shield className="w-3.5 h-3.5" />
            <span>We value your privacy. No spam. You can unsubscribe anytime.</span>
          </div>
        </div>

      </div>
    </section>
  );
};
