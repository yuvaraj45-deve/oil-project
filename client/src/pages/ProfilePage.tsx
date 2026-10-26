import React, { useState } from 'react';
import {
  User,
  Package,
  MapPin,
  Award,
  Phone,
  Mail,
  Truck,
  LogOut,
  Edit2,
  ShoppingBag,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Plus
} from 'lucide-react';
import { PlacedOrder, UserProfile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface ProfilePageProps {
  currentUser: UserProfile | null;
  orders: PlacedOrder[];
  onNavigate: (path: string) => void;
  onUpdateUser: (updatedUser: UserProfile) => void;
  onSignOut: () => void;
  onShopOils?: () => void;
}

export const ProfilePage: React.FC<ProfilePageProps> = ({
  currentUser,
  orders,
  onNavigate,
  onUpdateUser,
  onSignOut,
  onShopOils,
}) => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'rewards' | 'settings'>('orders');

  // Editable Profile States
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(currentUser?.name || 'Customer');
  const [editPhone, setEditPhone] = useState(currentUser?.phone || '98421 45620');
  const [editEmail, setEditEmail] = useState(currentUser?.email || 'customer@ssoil.com');

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 'addr_1',
      tag: 'Home (Default)',
      isDefault: true,
      recipient: currentUser?.name || 'Ramesh Sundaram',
      phone: currentUser?.phone || '98421 45620',
      addressLine: '42, Meyyanur Main Road, Near New Bus Stand',
      city: 'Salem',
      state: 'Tamil Nadu',
      pincode: '636004',
    },
    {
      id: 'addr_2',
      tag: 'Office / Work',
      isDefault: false,
      recipient: currentUser?.name || 'Ramesh Sundaram',
      phone: currentUser?.phone || '98421 45620',
      addressLine: '108, Anna Salai, Guindy Industrial Estate',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600032',
    },
  ]);

  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newTag, setNewTag] = useState('Home');
  const [newRecipient, setNewRecipient] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newAddressLine, setNewAddressLine] = useState('');
  const [newCity, setNewCity] = useState('');
  const [newPincode, setNewPincode] = useState('');

  // WhatsApp Alert Toggle
  const [whatsappAlerts, setWhatsappAlerts] = useState(true);

  // Sync state if currentUser changes
  React.useEffect(() => {
    if (currentUser) {
      setEditName(currentUser.name);
      setEditPhone(currentUser.phone);
      setEditEmail(currentUser.email);
    }
  }, [currentUser]);

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    const updated: UserProfile = {
      ...currentUser,
      name: editName.trim() || currentUser.name,
      phone: editPhone.trim() || currentUser.phone,
      email: editEmail.trim() || currentUser.email,
    };
    onUpdateUser(updated);
    setIsEditing(false);
  };

  // Add Address Handler
  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddressLine.trim() || !newCity.trim() || !newPincode.trim()) return;

    const newAddr = {
      id: `addr_${Date.now()}`,
      tag: newTag,
      isDefault: addresses.length === 0,
      recipient: newRecipient || currentUser?.name || 'Customer',
      phone: newPhone || currentUser?.phone || '98421 45620',
      addressLine: newAddressLine,
      city: newCity,
      state: 'Tamil Nadu',
      pincode: newPincode,
    };

    setAddresses([...addresses, newAddr]);
    setShowAddAddressModal(false);
    setNewAddressLine('');
    setNewCity('');
    setNewPincode('');
  };

  // If Guest (not logged in), prompt to Sign In
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-stone-50 py-16 px-4 sm:px-6 lg:px-8 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-stone-200 shadow-xl text-center animate-scaleUp">
          <div className="w-16 h-16 rounded-full bg-forest-900/10 text-forest-900 mx-auto flex items-center justify-center mb-4">
            <User className="w-8 h-8" />
          </div>
          <h2 className="font-serif text-2xl font-bold text-forest-950 mb-2">
            Sign In to View Profile
          </h2>
          <p className="text-xs text-stone-500 mb-6 leading-relaxed">
            Please log in with your mobile number or password to track orders, manage saved delivery addresses, and redeem Purity Club points.
          </p>
          <div className="space-y-3">
            <button
              onClick={() => onNavigate('/login')}
              className="w-full py-3 px-4 rounded-full bg-forest-950 hover:bg-forest-900 text-white font-bold text-xs uppercase tracking-wider transition-all shadow-md cursor-pointer"
            >
              Sign In to Account
            </button>
            <button
              onClick={() => onNavigate('/')}
              className="w-full py-2.5 px-4 rounded-full border border-stone-200 hover:bg-stone-50 text-stone-600 font-bold text-xs transition-all cursor-pointer"
            >
              Return to Store
            </button>
          </div>
        </div>
      </div>
    );
  }

  const initials = currentUser.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-stone-100/70 py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        
        {/* Top Breadcrumb & Return to Store */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => onNavigate('/')}
            className="flex items-center gap-2 text-xs font-bold text-stone-600 hover:text-forest-950 transition-colors cursor-pointer group"
          >
            <div className="p-1 rounded-full bg-white border border-stone-200 group-hover:bg-stone-50 transition-colors">
              <ChevronRight className="w-3.5 h-3.5 rotate-180" />
            </div>
            <span>{language === 'ta' ? 'முகப்பிற்குத் திரும்பு' : 'Return to Store'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>{language === 'ta' ? 'பியூர்வா நுகர்வோர் போர்டல்' : 'PureVa Verified Member Portal'}</span>
          </div>
        </div>

        {/* ============================================================ */}
        {/* 2-COLUMN DASHBOARD: SIDEBAR ON LEFT + CONTENT ON RIGHT       */}
        {/* ============================================================ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* ============================================================ */}
          {/* LEFT SIDEBAR: PROFILE CARD + SIDE MENU (Orders, Addresses...) */}
          {/* ============================================================ */}
          <aside className="lg:col-span-4 space-y-5">
            
            {/* User Mini Profile Card */}
            <div className="bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white rounded-3xl p-6 shadow-md border border-forest-800 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-48 h-48 bg-gold-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 rounded-full bg-gradient-to-tr from-gold-400 via-gold-500 to-amber-600 p-0.5 shadow-md shrink-0">
                    <div className="w-full h-full rounded-full bg-forest-900 flex items-center justify-center text-gold-300 font-serif text-xl font-black">
                      {initials}
                    </div>
                  </div>

                  <div className="min-w-0">
                    <h2 className="font-serif text-xl font-black tracking-tight text-white truncate">
                      {currentUser.name}
                    </h2>
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-gold-500/20 text-gold-300 border border-gold-500/40 uppercase tracking-wider font-mono mt-0.5">
                      {currentUser.memberTier || 'Gold Member'}
                    </span>
                  </div>
                </div>

                <div className="space-y-1.5 text-xs text-stone-300 pt-2 border-t border-forest-800/80">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span>+91 {currentUser.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 truncate">
                    <Mail className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                    <span className="truncate">{currentUser.email}</span>
                  </div>
                </div>

                <div className="pt-2 flex items-center gap-2">
                  {currentUser.role === 'admin' && (
                    <button
                      onClick={() => onNavigate('/admin')}
                      className="flex-1 py-2 px-3 rounded-xl bg-gold-400 hover:bg-gold-300 text-forest-950 text-xs font-bold transition-all flex items-center justify-center gap-1.5 shadow-sm cursor-pointer"
                    >
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>Admin Console</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-cream-100 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer border border-white/20"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                    <span>{isEditing ? 'Cancel Edit' : 'Edit Info'}</span>
                  </button>
                </div>
              </div>

              {/* Edit Profile Form Drawer */}
              {isEditing && (
                <form onSubmit={handleSaveProfile} className="mt-4 pt-4 border-t border-forest-800/80 space-y-2.5 animate-fadeIn">
                  <div>
                    <label className="block text-[10px] font-bold text-stone-300 uppercase mb-0.5">Full Name</label>
                    <input
                      type="text"
                      value={editName}
                      onChange={(e) => setEditName(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-forest-900 border border-forest-700 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-gold-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-300 uppercase mb-0.5">Phone Number</label>
                    <input
                      type="text"
                      value={editPhone}
                      onChange={(e) => setEditPhone(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-forest-900 border border-forest-700 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-gold-400"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-stone-300 uppercase mb-0.5">Email Address</label>
                    <input
                      type="email"
                      value={editEmail}
                      onChange={(e) => setEditEmail(e.target.value)}
                      className="w-full px-3 py-1.5 rounded-xl bg-forest-900 border border-forest-700 text-xs text-white placeholder-stone-400 focus:outline-none focus:border-gold-400"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-2 px-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-forest-950 font-bold text-xs tracking-wide shadow-md transition-all cursor-pointer mt-1"
                  >
                    Save Changes
                  </button>
                </form>
              )}
            </div>

            {/* ============================================================ */}
            {/* SIDEBAR NAVIGATION: Orders, Addresses, Rewards, Settings     */}
            {/* ============================================================ */}
            <div className="bg-white rounded-3xl p-3 shadow-sm border border-stone-200 space-y-1.5">
              <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
                Account Navigation
              </div>

              {/* 1. Orders ({orders.length}) */}
              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'orders'
                    ? 'bg-forest-950 text-white shadow-sm'
                    : 'text-stone-700 hover:text-forest-950 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Package className={`w-4 h-4 ${activeTab === 'orders' ? 'text-gold-400' : 'text-stone-500'}`} />
                  <span>{language === 'ta' ? 'ஆர்டர்கள்' : 'Orders'}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'orders'
                      ? 'bg-gold-500 text-forest-950'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {orders.length}
                </span>
              </button>

              {/* 2. Addresses ({addresses.length}) */}
              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'addresses'
                    ? 'bg-forest-950 text-white shadow-sm'
                    : 'text-stone-700 hover:text-forest-950 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <MapPin className={`w-4 h-4 ${activeTab === 'addresses' ? 'text-gold-400' : 'text-stone-500'}`} />
                  <span>{language === 'ta' ? 'முகவரிகள்' : 'Addresses'}</span>
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === 'addresses'
                      ? 'bg-gold-500 text-forest-950'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {addresses.length}
                </span>
              </button>

              {/* 3. Purity Rewards */}
              <button
                onClick={() => setActiveTab('rewards')}
                className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'rewards'
                    ? 'bg-forest-950 text-white shadow-sm'
                    : 'text-stone-700 hover:text-forest-950 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Award className={`w-4 h-4 ${activeTab === 'rewards' ? 'text-gold-400' : 'text-amber-500'}`} />
                  <span>{language === 'ta' ? 'சலுகைப் புள்ளிகள்' : 'Purity Rewards'}</span>
                </div>
                <span className="text-[11px] font-bold text-amber-600 font-mono">
                  {currentUser.purityPoints || 240} pts
                </span>
              </button>

              {/* 4. Settings */}
              <button
                onClick={() => setActiveTab('settings')}
                className={`w-full py-3 px-4 rounded-2xl text-xs font-bold transition-all cursor-pointer flex items-center justify-between ${
                  activeTab === 'settings'
                    ? 'bg-forest-950 text-white shadow-sm'
                    : 'text-stone-700 hover:text-forest-950 hover:bg-stone-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <User className={`w-4 h-4 ${activeTab === 'settings' ? 'text-gold-400' : 'text-stone-500'}`} />
                  <span>{language === 'ta' ? 'அமைப்புகள்' : 'Settings'}</span>
                </div>
              </button>

              {/* Quick Sign Out in Sidebar */}
              <div className="pt-2 mt-2 border-t border-stone-100">
                <button
                  onClick={onSignOut}
                  className="w-full py-2.5 px-4 rounded-2xl text-xs font-bold text-red-600 hover:bg-red-50 transition-all flex items-center gap-3 cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  <span>{language === 'ta' ? 'கணக்கிலிருந்து வெளியேறுக' : 'Sign Out'}</span>
                </button>
              </div>

            </div>

            {/* Quick Rewards Box */}
            <div className="bg-amber-50/70 rounded-3xl p-5 border border-amber-200/80 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block">Purity Club</span>
                <span className="font-serif text-2xl font-black text-amber-950">{currentUser.purityPoints || 240} Pts</span>
                <span className="text-[11px] text-amber-700 block">Worth ₹{currentUser.purityPoints || 240} in savings</span>
              </div>
              <button
                onClick={() => onNavigate('/shop')}
                className="px-3.5 py-1.5 rounded-full bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold shadow-xs cursor-pointer transition-colors"
              >
                Shop Now
              </button>
            </div>

          </aside>

          {/* ============================================================ */}
          {/* RIGHT MAIN CONTENT AREA: ACTIVE TAB CONTENT                  */}
          {/* ============================================================ */}
          <main className="lg:col-span-8 min-w-0 space-y-6">
            
            {/* Header of Active Section */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                  Dashboard
                </span>
                <h3 className="text-xl sm:text-2xl font-serif font-black text-forest-950 mt-0.5">
                  {activeTab === 'orders' && (language === 'ta' ? `உங்கள் ஆர்டர்கள் (${orders.length})` : `Your Orders (${orders.length})`)}
                  {activeTab === 'addresses' && (language === 'ta' ? `டெலிவரி முகவரிகள் (${addresses.length})` : `Saved Delivery Addresses (${addresses.length})`)}
                  {activeTab === 'rewards' && (language === 'ta' ? 'பியூர்வா சலுகைப் புள்ளிகள்' : 'PureVa Loyalty & Purity Rewards')}
                  {activeTab === 'settings' && (language === 'ta' ? 'கணக்கு அமைப்புகள் & பாதுகாப்பு' : 'Account Settings & Security')}
                </h3>
              </div>

              {activeTab === 'addresses' && (
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="px-4 py-2 rounded-full bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Address</span>
                </button>
              )}
            </div>

            {/* TAB 1: ORDERS CONTENT */}
            {activeTab === 'orders' && (
              <div className="space-y-4">
                {orders.length === 0 ? (
                  <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
                    <ShoppingBag className="w-12 h-12 text-stone-300 mx-auto mb-3" />
                    <h3 className="font-serif text-lg font-bold text-stone-800">No Orders Placed Yet</h3>
                    <p className="text-stone-500 text-xs mt-1 max-w-sm mx-auto">
                      Experience traditional Salem Mara Chekku purity. Browse our cold pressed sesame, coconut, and everyday pure oils.
                    </p>
                    <button
                      onClick={() => onNavigate('/shop')}
                      className="mt-4 px-5 py-2.5 rounded-full bg-forest-950 hover:bg-forest-900 text-white font-bold text-xs tracking-wider uppercase cursor-pointer shadow-sm transition-all"
                    >
                      Explore Oils
                    </button>
                  </div>
                ) : (
                  orders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-white rounded-3xl p-6 border border-stone-200 shadow-sm hover:border-gold-500/60 transition-all"
                    >
                      {/* Order Top Strip */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-100">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-sm text-forest-950">
                              {order.orderNumber}
                            </span>
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
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
                          <p className="text-xs text-stone-400 mt-1">
                            Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </p>
                        </div>

                        <div className="text-left sm:text-right">
                          <span className="font-serif text-xl font-black text-forest-950">
                            ₹{order.totalAmount}
                          </span>
                          <span className="text-xs text-stone-500 block">
                            Payment: {order.paymentMethod} ({order.paymentStatus})
                          </span>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="py-4 space-y-3">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between text-xs sm:text-sm">
                            <div className="flex items-center gap-2">
                              <div className="w-2 h-2 rounded-full bg-gold-500" />
                              <span className="font-medium text-stone-800">{item.productName}</span>
                              <span className="text-stone-400 font-mono text-xs">({item.packSize})</span>
                            </div>
                            <span className="font-mono font-bold text-stone-700">× {item.quantity}</span>
                          </div>
                        ))}
                      </div>

                      {/* Tracking Timeline */}
                      <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/80">
                        <div className="flex items-center justify-between text-xs text-stone-600 mb-3">
                          <span className="font-bold text-forest-950 flex items-center gap-1.5">
                            <Truck className="w-4 h-4 text-forest-800" /> Express Courier Dispatch
                          </span>
                          <span>Delivery City: <strong className="text-stone-900">{order.city || 'Salem'}</strong></span>
                        </div>

                        <div className="grid grid-cols-4 gap-2 text-center">
                          <div className="flex flex-col items-center">
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                            <span className="text-[10px] font-semibold text-stone-800 mt-1">Confirmed</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">✓</div>
                            <span className="text-[10px] font-semibold text-stone-800 mt-1">Packed</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-300 text-stone-600'
                            }`}>
                              {order.orderStatus === 'SHIPPED' || order.orderStatus === 'DELIVERED' ? '✓' : '3'}
                            </div>
                            <span className="text-[10px] font-semibold text-stone-800 mt-1">Shipped</span>
                          </div>
                          <div className="flex flex-col items-center">
                            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              order.orderStatus === 'DELIVERED'
                                ? 'bg-emerald-600 text-white'
                                : 'bg-stone-300 text-stone-600'
                            }`}>
                              {order.orderStatus === 'DELIVERED' ? '✓' : '4'}
                            </div>
                            <span className="text-[10px] font-semibold text-stone-800 mt-1">Delivered</span>
                          </div>
                        </div>
                      </div>

                    </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 2: ADDRESSES CONTENT */}
            {activeTab === 'addresses' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div
                      key={addr.id}
                      className={`bg-white rounded-3xl p-6 border transition-all ${
                        addr.isDefault
                          ? 'border-2 border-forest-900 shadow-sm'
                          : 'border-stone-200 hover:border-stone-300 shadow-xs'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <span className="font-bold text-xs uppercase tracking-wider text-forest-950 flex items-center gap-1.5">
                          <MapPin className="w-4 h-4 text-forest-900" />
                          {addr.tag}
                        </span>
                        {addr.isDefault && (
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="font-bold text-sm text-stone-900 mb-1">{addr.recipient}</p>
                      <p className="text-xs text-stone-600 leading-relaxed mb-3">
                        {addr.addressLine}, {addr.city}, {addr.state} - {addr.pincode}
                      </p>
                      <p className="text-xs text-stone-500 font-mono">
                        Phone: +91 {addr.phone}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Add Address Modal Form */}
                {showAddAddressModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
                    <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-scaleUp">
                      <h4 className="font-serif text-lg font-bold text-forest-950 mb-4">Add Delivery Address</h4>
                      <form onSubmit={handleAddAddress} className="space-y-3">
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Address Tag</label>
                          <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="e.g. Home, Office, Farm"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-stone-700 mb-1">Street Address</label>
                          <input
                            type="text"
                            value={newAddressLine}
                            onChange={(e) => setNewAddressLine(e.target.value)}
                            placeholder="House / Flat / Street"
                            className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                            required
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">City</label>
                            <input
                              type="text"
                              value={newCity}
                              onChange={(e) => setNewCity(e.target.value)}
                              placeholder="e.g. Salem"
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                              required
                            />
                          </div>
                          <div>
                            <label className="block text-xs font-bold text-stone-700 mb-1">Pincode</label>
                            <input
                              type="text"
                              value={newPincode}
                              onChange={(e) => setNewPincode(e.target.value)}
                              placeholder="e.g. 636004"
                              className="w-full px-3 py-2 rounded-xl border border-stone-200 text-xs"
                              required
                            />
                          </div>
                        </div>
                        <div className="flex gap-2 pt-3">
                          <button
                            type="button"
                            onClick={() => setShowAddAddressModal(false)}
                            className="flex-1 py-2 rounded-xl border border-stone-200 text-xs font-semibold cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 py-2 rounded-xl bg-forest-950 text-white text-xs font-bold cursor-pointer"
                          >
                            Save Address
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: REWARDS CONTENT */}
            {activeTab === 'rewards' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-gold-500/10 via-amber-500/15 to-gold-500/10 border border-gold-500/40 rounded-3xl p-6 sm:p-8">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider text-gold-700 block mb-1">
                        Available Loyalty Balance
                      </span>
                      <div className="font-serif text-4xl sm:text-5xl font-black text-forest-950">
                        {currentUser.purityPoints || 240} <span className="text-base font-sans font-bold text-stone-600">Points</span>
                      </div>
                      <p className="text-xs text-stone-600 mt-2">
                        Worth <strong className="text-forest-950 font-bold">₹{currentUser.purityPoints || 240}</strong> instant deduction on your next mara chekku wood-pressed oil purchase.
                      </p>
                    </div>

                    <div className="p-4 bg-white/80 rounded-2xl border border-gold-400/40 text-center">
                      <span className="text-[10px] font-bold text-stone-500 uppercase block">Active Coupon Code</span>
                      <code className="text-sm font-mono font-bold text-forest-950 block mt-1">PUREDROP240</code>
                      <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">Auto-applied at checkout</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-3xl p-6 border border-stone-200">
                  <h4 className="font-serif text-base font-bold text-forest-950 mb-3">
                    Gold Member Privileges
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                      <Truck className="w-5 h-5 text-forest-900 mb-2" />
                      <span className="text-xs font-bold text-stone-900 block">Free Express Delivery</span>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">Zero shipping fee on all orders over ₹499.</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                      <Sparkles className="w-5 h-5 text-gold-600 mb-2" />
                      <span className="text-xs font-bold text-stone-900 block">Priority Wood Pressing</span>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">Direct fresh-churn allocation from our Salem vaagai wood churners.</span>
                    </div>

                    <div className="p-4 rounded-2xl bg-stone-50 border border-stone-100">
                      <ShieldCheck className="w-5 h-5 text-emerald-600 mb-2" />
                      <span className="text-xs font-bold text-stone-900 block">Lab GC-MS Reports</span>
                      <span className="text-[11px] text-stone-500 mt-0.5 block">Download official laboratory purity certificates per batch.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 4: SETTINGS CONTENT */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 space-y-6">
                <div>
                  <h3 className="font-serif text-lg font-bold text-forest-950 mb-1">Account & Preferences</h3>
                  <p className="text-xs text-stone-500">Manage communication channels and security settings.</p>
                </div>

                <div className="space-y-4 pt-2">
                  <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">WhatsApp Delivery Updates</span>
                      <span className="text-[11px] text-stone-500">Receive parcel dispatch alerts and live tracking links via WhatsApp.</span>
                    </div>
                    <input
                      type="checkbox"
                      checked={whatsappAlerts}
                      onChange={(e) => setWhatsappAlerts(e.target.checked)}
                      className="w-4 h-4 rounded text-forest-950 focus:ring-forest-950 cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 rounded-2xl bg-stone-50 border border-stone-200/80">
                    <div>
                      <span className="text-xs font-bold text-stone-900 block">Session & Devices</span>
                      <span className="text-[11px] text-stone-500">Signed in on this browser (Chrome • Windows).</span>
                    </div>
                    <button
                      onClick={onSignOut}
                      className="px-3.5 py-1.5 rounded-xl border border-stone-200 hover:bg-red-50 text-stone-600 hover:text-red-700 text-xs font-bold transition-colors cursor-pointer"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};
