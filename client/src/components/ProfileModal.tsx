import React, { useState } from 'react';
import {
  User,
  X,
  Package,
  MapPin,
  Award,
  Phone,
  Mail,
  CheckCircle2,
  Truck,
  LogOut,
  ShoppingBag,
  Edit2
} from 'lucide-react';
import { PlacedOrder, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: PlacedOrder[];
  currentUser?: UserProfile | null;
  onSignOut?: () => void;
  onNavigateToLogin?: () => void;
  onExploreShop?: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({
  isOpen,
  onClose,
  orders,
  currentUser,
  onSignOut,
  onNavigateToLogin,
  onExploreShop,
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'rewards'>('orders');
  const [userName, setUserName] = useState(currentUser?.name || 'Customer');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '98421 45620');
  const [userEmail, setUserEmail] = useState(currentUser?.email || 'customer@ssoil.com');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  React.useEffect(() => {
    if (currentUser) {
      setUserName(currentUser.name);
      setUserPhone(currentUser.phone);
      setUserEmail(currentUser.email);
    }
  }, [currentUser]);

  const initials = userName
    .split(' ')
    .filter(Boolean)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2) || 'SS';

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-stone-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="min-h-full flex items-center justify-center p-4">
        <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden border border-stone-200 animate-scaleUp">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              aria-label="Close Profile"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              {/* Profile Avatar */}
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 p-0.5 shadow-md">
                <div className="w-full h-full rounded-full bg-forest-900 flex items-center justify-center text-gold-300 font-serif text-2xl font-bold">
                  {initials}
                </div>
              </div>

              {/* User Details */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h2 className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                    {userName}
                  </h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-300 border border-gold-500/30">
                    {currentUser?.memberTier || 'Gold Member'}
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-stone-300 text-xs mt-1">
                  <span className="flex items-center gap-1">
                    <Phone className="w-3 h-3 text-gold-400" /> +91 {userPhone}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="w-3 h-3 text-gold-400" /> {userEmail}
                  </span>
                </div>
              </div>

              {/* Edit Profile Toggle */}
              <button
                onClick={() => setIsEditingProfile(!isEditingProfile)}
                className="text-xs px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-cream-200 transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Edit2 className="w-3 h-3" />
                <span>{isEditingProfile ? 'Done' : 'Edit'}</span>
              </button>
            </div>

            {/* Quick Editable Form */}
            {isEditingProfile && (
              <div className="mt-4 pt-4 border-t border-forest-800/80 grid grid-cols-1 sm:grid-cols-3 gap-2 animate-fadeIn">
                <input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  placeholder="Full Name"
                  className="px-3 py-1.5 rounded-lg bg-forest-900 border border-forest-700 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-gold-400"
                />
                <input
                  type="text"
                  value={userPhone}
                  onChange={(e) => setUserPhone(e.target.value)}
                  placeholder="Phone"
                  className="px-3 py-1.5 rounded-lg bg-forest-900 border border-forest-700 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-gold-400"
                />
                <input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  placeholder="Email"
                  className="px-3 py-1.5 rounded-lg bg-forest-900 border border-forest-700 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-gold-400"
                />
              </div>
            )}
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-stone-200 bg-stone-50 px-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`py-3 px-4 font-semibold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'border-forest-950 text-forest-950 font-bold bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Package className="w-4 h-4 text-forest-800" />
              <span>{language === 'ta' ? `ஆர்டர்கள் (${orders.length})` : `Orders (${orders.length})`}</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`py-3 px-4 font-semibold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'addresses'
                  ? 'border-forest-950 text-forest-950 font-bold bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <MapPin className="w-4 h-4 text-forest-800" />
              <span>{language === 'ta' ? 'முகவரிகள்' : 'Addresses'}</span>
            </button>

            <button
              onClick={() => setActiveTab('rewards')}
              className={`py-3 px-4 font-semibold text-xs tracking-wider uppercase border-b-2 transition-all cursor-pointer flex items-center gap-2 ${
                activeTab === 'rewards'
                  ? 'border-forest-950 text-forest-950 font-bold bg-white'
                  : 'border-transparent text-stone-500 hover:text-stone-800'
              }`}
            >
              <Award className="w-4 h-4 text-gold-600" />
              <span>{language === 'ta' ? 'பியூரிட்டி கிளப்' : 'Purity Club'}</span>
            </button>
          </div>

          {/* Modal Body Content */}
          <div className="p-6 max-h-[60vh] overflow-y-auto">
            
            {/* TAB 1: ORDERS & PARCEL TRACKING */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="text-center py-12">
                    <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <p className="text-sm font-semibold text-stone-700">No orders placed yet</p>
                    <p className="text-xs text-stone-500 mt-1">Explore our cold pressed oils and place your first order.</p>
                    {onExploreShop && (
                      <button
                        onClick={() => {
                          onClose();
                          onExploreShop();
                        }}
                        className="mt-4 px-4 py-2 bg-forest-950 text-white rounded-full text-xs font-bold hover:bg-forest-900 cursor-pointer"
                      >
                        Explore Oils
                      </button>
                    )}
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="border border-stone-200 rounded-2xl p-4.5 bg-white hover:border-gold-400/60 transition-all shadow-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-xs text-forest-950">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.orderStatus === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800'
                                  : order.orderStatus === 'SHIPPED'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-amber-100 text-amber-800'
                              }`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                          <p className="text-[11px] text-stone-400 mt-0.5">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric'
                            })}
                          </p>
                        </div>
                        <div className="text-left sm:text-right">
                          <span className="font-serif font-black text-sm text-forest-950">
                            ₹{order.totalAmount}
                          </span>
                          <span className="text-[10px] block text-stone-500">
                            Paid via {order.paymentMethod}
                          </span>
                        </div>
                      </div>

                      {/* Items Preview */}
                      <div className="py-3 space-y-2">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs">
                            <span className="text-stone-700 font-medium">
                              {item.productName} ({item.packSize})
                            </span>
                            <span className="text-stone-500 font-mono">
                              × {item.quantity}
                            </span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking Timeline Bar */}
                      <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 mt-2">
                        <div className="flex items-center justify-between text-[11px] text-stone-600 mb-2">
                          <span className="flex items-center gap-1 font-semibold text-forest-900">
                            <Truck className="w-3.5 h-3.5 text-forest-800" /> Express Dispatch
                          </span>
                          <span className="text-stone-500">
                            Delivering to: <strong className="text-stone-800">{order.city}</strong>
                          </span>
                        </div>

                        {/* Progress Stepper */}
                        <div className="grid grid-cols-4 gap-1 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </div>
                            <span className="text-[9px] font-medium text-stone-700 mt-1">Confirmed</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-4 h-4 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[9px] font-bold">
                              ✓
                            </div>
                            <span className="text-[9px] font-medium text-stone-700 mt-1">Packed</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-300 text-stone-600'
                            }`}>
                              {order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED' ? '✓' : '3'}
                            </div>
                            <span className="text-[9px] font-medium text-stone-700 mt-1">Shipped</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold ${
                              order.orderStatus === 'DELIVERED'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-300 text-stone-600'
                            }`}>
                              {order.orderStatus === 'DELIVERED' ? '✓' : '4'}
                            </div>
                            <span className="text-[9px] font-medium text-stone-700 mt-1">Delivered</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-3">
                {/* Address 1: Primary Home */}
                <div className="p-4 rounded-2xl border-2 border-forest-900/40 bg-forest-50/40 relative">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-forest-950 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-forest-800" /> Home (Default)
                    </span>
                    <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                      Primary
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed mt-2 font-medium">
                    42, Meyyanur Main Road, Near New Bus Stand,
                    <br />
                    Salem, Tamil Nadu - 636004
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Contact: +91 98421 45620 (Ramesh)
                  </p>
                </div>

                {/* Address 2: Chennai Office */}
                <div className="p-4 rounded-2xl border border-stone-200 bg-stone-50 relative hover:border-stone-300 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-bold text-stone-800 uppercase tracking-wider flex items-center gap-1.5">
                      <MapPin className="w-3.5 h-3.5 text-stone-500" /> Work / Office
                    </span>
                  </div>
                  <p className="text-xs text-stone-700 leading-relaxed mt-2">
                    108, Anna Salai, Guindy Industrial Estate,
                    <br />
                    Chennai, Tamil Nadu - 600032
                  </p>
                  <p className="text-[11px] text-stone-500 mt-1">
                    Contact: +91 98421 45620
                  </p>
                </div>
              </div>
            )}

            {/* TAB 3: PURITY CLUB REWARDS */}
            {activeTab === 'rewards' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gold-500/10 to-amber-500/20 border border-gold-500/40 rounded-2xl p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-bold uppercase tracking-wider text-gold-700">
                        Available Balance
                      </span>
                      <div className="font-serif text-3xl font-black text-forest-950 mt-0.5">
                        240 <span className="text-sm font-sans font-semibold text-stone-600">Points</span>
                      </div>
                      <p className="text-xs text-stone-600 mt-1">
                        Worth <strong className="text-forest-900">₹240</strong> instant discount at checkout.
                      </p>
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-gold-400/20 border border-gold-500/40 flex items-center justify-center text-gold-600">
                      <Award className="w-8 h-8" />
                    </div>
                  </div>
                </div>

                <div className="bg-stone-50 rounded-2xl p-4 border border-stone-200">
                  <h4 className="text-xs font-bold text-forest-950 uppercase tracking-wide mb-2">
                    Member Privileges (Gold Tier)
                  </h4>
                  <ul className="space-y-2 text-xs text-stone-700">
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Free Express Shipping on all orders above ₹499</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Priority milling fresh harvest allocations</span>
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>Direct access to batch Gas Chromatography purity reports</span>
                    </li>
                  </ul>
                </div>
              </div>
            )}

          </div>

          {/* Footer Actions */}
          <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs">
            <button
              onClick={() => {
                if (onSignOut) onSignOut();
                onClose();
                if (onNavigateToLogin) onNavigateToLogin();
              }}
              className="flex items-center gap-1.5 text-stone-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out & Switch Account</span>
            </button>
            <span className="text-stone-400 font-medium text-[11px]">
              SS OIL Artisanal Portal • Secure & Encrypted
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
