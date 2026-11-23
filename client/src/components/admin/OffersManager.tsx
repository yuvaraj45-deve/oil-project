import React, { useState, useEffect } from 'react';
import {
  Tag,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  Calendar,
  Percent,
  Coins,
  Truck,
  ExternalLink,
  Copy,
  Check,
  AlertTriangle,
  X,
  Upload,
  RefreshCw,
  Info,
  AlertCircle,
} from 'lucide-react';

export interface OfferItem {
  id: string;
  title: string;
  description: string;
  code: string;
  discountType: 'PERCENTAGE' | 'FIXED' | 'FREE_DELIVERY';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number | null;
  imageUrl?: string | null;
  applicableProducts?: string | null;
  startDate: string;
  endDate: string;
  isActive: boolean;
  usageCount: number;
  status: 'ACTIVE' | 'INACTIVE' | 'EXPIRED' | 'UPCOMING';
  createdAt?: string;
  updatedAt?: string;
}

export const OIL_PRODUCT_OPTIONS = [
  'All Mara Chekku Oils',
  'Sesame Oil (நல்லெண்ணெய்)',
  'Groundnut Oil (கடலை எண்ணெய்)',
  'Coconut Oil (தேங்காய் எண்ணெய்)',
  'Sunflower Oil (சூரியகாந்தி)',
  'Mustard Oil (கடுகு எண்ணெய்)',
  'Pooja Lamp Oil (தீபம்)',
  'A2 Cow Ghee (நாட்டு நெய்)',
  '5L Family Cans',
  'Festival Trio Combos',
];

interface OffersManagerProps {
  onShowToast: (msg: string) => void;
  autoOpenCreateModal?: boolean;
  onResetAutoOpen?: () => void;
}

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : '');

const API_BASE = `${API_BASE_URL}/api/offers`;

export const OffersManager: React.FC<OffersManagerProps> = ({
  onShowToast,
  autoOpenCreateModal,
  onResetAutoOpen,
}) => {
  const [offers, setOffers] = useState<OfferItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [typeFilter, setTypeFilter] = useState<string>('ALL');

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [selectedOfferId, setSelectedOfferId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Delete Confirmation Modal
  const [deleteModalOpen, setDeleteModalOpen] = useState<boolean>(false);
  const [offerToDelete, setOfferToDelete] = useState<OfferItem | null>(null);

  // Copied code feedback
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  // Form State
  const defaultForm = {
    title: '',
    description: '',
    code: '',
    discountType: 'PERCENTAGE' as 'PERCENTAGE' | 'FIXED' | 'FREE_DELIVERY',
    discountValue: 10,
    minOrderValue: 0,
    maxDiscount: '' as string | number,
    imageUrl: '',
    applicableProducts: 'All Mara Chekku Oils',
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    isActive: true,
  };
  const [formData, setFormData] = useState(defaultForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // 1. Fetch Offers from TiDB backend
  const fetchOffers = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(API_BASE);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setOffers(json.data);
      } else {
        onShowToast('Could not load offers list');
      }
    } catch (err) {
      console.error('Error fetching offers:', err);
      onShowToast('Server connection failed when loading offers');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  // 2. Open Create Modal
  const handleOpenCreateModal = () => {
    setFormData({
      ...defaultForm,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });
    setFormErrors({});
    setIsEditing(false);
    setSelectedOfferId(null);
    setIsModalOpen(true);
  };

  useEffect(() => {
    const handleTriggerCreate = () => {
      handleOpenCreateModal();
    };
    window.addEventListener('ssoil_open_create_offer', handleTriggerCreate);
    return () => window.removeEventListener('ssoil_open_create_offer', handleTriggerCreate);
  }, []);

  useEffect(() => {
    if (autoOpenCreateModal) {
      handleOpenCreateModal();
      if (onResetAutoOpen) onResetAutoOpen();
    }
  }, [autoOpenCreateModal, onResetAutoOpen]);

  // 3. Open Edit Modal
  const handleOpenEditModal = (item: OfferItem) => {
    const startStr = item.startDate ? new Date(item.startDate).toISOString().split('T')[0] : '';
    const endStr = item.endDate ? new Date(item.endDate).toISOString().split('T')[0] : '';

    setFormData({
      title: item.title,
      description: item.description || '',
      code: item.code,
      discountType: item.discountType,
      discountValue: item.discountValue,
      minOrderValue: item.minOrderValue,
      maxDiscount: item.maxDiscount !== null && item.maxDiscount !== undefined ? item.maxDiscount : '',
      imageUrl: item.imageUrl || '',
      applicableProducts: item.applicableProducts || 'All Mara Chekku Oils',
      startDate: startStr,
      endDate: endStr,
      isActive: item.isActive,
    });
    setFormErrors({});
    setIsEditing(true);
    setSelectedOfferId(item.id);
    setIsModalOpen(true);
  };

  // 4. Handle Image Upload from PC (converts to base64)
  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 4 * 1024 * 1024) {
      onShowToast('Image size must be under 4MB');
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setFormData((prev) => ({ ...prev, imageUrl: base64 }));
        onShowToast('Offer banner image uploaded successfully!');
      }
    };
    reader.readAsDataURL(file);
  };

  // 5. Form Validation
  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.title.trim()) {
      errs.title = 'Offer title is required';
    }
    if (!formData.code.trim()) {
      errs.code = 'Coupon code is required';
    } else if (formData.code.trim().length < 2) {
      errs.code = 'Coupon code must be at least 2 characters';
    }
    if (formData.discountValue === undefined || Number(formData.discountValue) <= 0) {
      errs.discountValue = 'Discount value must be greater than 0';
    }
    if (formData.discountType === 'PERCENTAGE' && Number(formData.discountValue) > 100) {
      errs.discountValue = 'Percentage cannot exceed 100%';
    }
    if (!formData.startDate) {
      errs.startDate = 'Start date is required';
    }
    if (!formData.endDate) {
      errs.endDate = 'Expiry date is required';
    }
    if (formData.startDate && formData.endDate && new Date(formData.endDate) < new Date(formData.startDate)) {
      errs.endDate = 'Expiry date cannot be earlier than start date';
    }
    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  // 6. Handle Submit (Create or Update)
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e && e.preventDefault) e.preventDefault();
    if (!validate()) {
      onShowToast('⚠️ தயவுசெய்து மேலே உள்ள Offer Title & Coupon Code பூர்த்தி செய்யவும்');
      const formEl = document.getElementById('offerFormScroll');
      if (formEl) {
        formEl.scrollTop = 0;
      }
      setTimeout(() => {
        const titleEl = document.getElementById('offer_input_title');
        if (titleEl) titleEl.focus();
      }, 50);
      return;
    }

    setIsSubmitting(true);
    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        code: formData.code.trim().toUpperCase(),
        discountType: formData.discountType,
        discountValue: Number(formData.discountValue),
        minOrderValue: Number(formData.minOrderValue) || 0,
        maxDiscount: formData.maxDiscount ? Number(formData.maxDiscount) : null,
        imageUrl: formData.imageUrl || null,
        applicableProducts: formData.applicableProducts || 'All Mara Chekku Oils',
        startDate: new Date(formData.startDate).toISOString(),
        endDate: new Date(formData.endDate + 'T23:59:59Z').toISOString(),
        isActive: Boolean(formData.isActive),
      };

      const url = isEditing ? `${API_BASE}/${selectedOfferId}` : API_BASE;
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      let json: any = {};
      try {
        json = await res.json();
      } catch (parseErr) {
        throw new Error('Server returned invalid response');
      }

      if (json.success) {
        onShowToast(isEditing ? 'Offer updated successfully!' : '🎉 New Offer created and saved to TiDB!');
        setIsModalOpen(false);
        setFormData(defaultForm);
        setFormErrors({});
        await fetchOffers();
        // Notify store components
        window.dispatchEvent(new Event('ssoil_coupon_updated'));
      } else {
        const errMsg = json.message || 'Failed to save offer';
        setFormErrors((prev) => ({ ...prev, submit: errMsg }));
        onShowToast(`⚠️ ${errMsg}`);
      }
    } catch (err) {
      console.error('Error saving offer:', err);
      const errMsg = (err as Error).message || 'Server error while saving offer';
      setFormErrors((prev) => ({ ...prev, submit: errMsg }));
      onShowToast(`⚠️ ${errMsg}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 7. Toggle Active/Inactive Status
  const handleToggleStatus = async (item: OfferItem) => {
    try {
      const res = await fetch(`${API_BASE}/${item.id}/toggle-status`, {
        method: 'PATCH',
      });
      const json = await res.json();
      if (json.success) {
        onShowToast(`Coupon '${item.code}' is now ${json.isActive ? 'Active 🟢' : 'Deactivated ⚪'}`);
        setOffers((prev) =>
          prev.map((o) =>
            o.id === item.id
              ? {
                  ...o,
                  isActive: json.isActive,
                  status: json.isActive ? (new Date() > new Date(o.endDate) ? 'EXPIRED' : 'ACTIVE') : 'INACTIVE',
                }
              : o
          )
        );
        window.dispatchEvent(new Event('ssoil_coupon_updated'));
      } else {
        onShowToast(json.message || 'Status toggle failed');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Network error while toggling offer status');
    }
  };

  // 8. Confirm & Delete Offer
  const handleConfirmDelete = async () => {
    if (!offerToDelete) return;
    try {
      const res = await fetch(`${API_BASE}/${offerToDelete.id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        onShowToast(`Offer '${offerToDelete.code}' deleted from TiDB.`);
        setOffers((prev) => prev.filter((o) => o.id !== offerToDelete.id));
        setDeleteModalOpen(false);
        setOfferToDelete(null);
        window.dispatchEvent(new Event('ssoil_coupon_updated'));
      } else {
        onShowToast(json.message || 'Failed to delete offer');
      }
    } catch (err) {
      console.error(err);
      onShowToast('Error deleting offer');
    }
  };

  // 9. Copy Code to Clipboard
  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    onShowToast(`Copied coupon code '${code}' to clipboard!`);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // 10. Filtered list calculation
  const filteredOffers = offers.filter((item) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = item.title?.toLowerCase().includes(q);
      const matchCode = item.code?.toLowerCase().includes(q);
      const matchDesc = item.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchDesc) return false;
    }
    // Status filter
    if (statusFilter !== 'ALL') {
      if (item.status !== statusFilter) return false;
    }
    // Type filter
    if (typeFilter !== 'ALL') {
      if (item.discountType !== typeFilter) return false;
    }
    return true;
  });

  // Overview Counts
  const totalCount = offers.length;
  const activeCount = offers.filter((o) => o.status === 'ACTIVE').length;
  const inactiveCount = offers.filter((o) => o.status === 'INACTIVE').length;
  const expiredCount = offers.filter((o) => o.status === 'EXPIRED').length;

  return (
    <div className="space-y-6">
      
      {/* 1. Header Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5 relative overflow-hidden">
        <div className="space-y-1.5 relative z-10">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 font-mono text-[11px] font-bold tracking-wider border border-emerald-200 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              TiDB DATABASE SYNC
            </span>
            <span className="text-xs text-stone-400">•</span>
            <span className="text-xs font-semibold text-stone-500">Live Customer Storefront Module</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Tag className="w-7 h-7 text-[#1e7e34]" />
            <span>Offers & Discounts Management</span>
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-2xl leading-relaxed">
            Create and manage promotional discount vouchers, festive coupon codes, and cart savings. Changes update live across the SS OIL website and checkout.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 relative z-10">
          <a
            href="/shop"
            target="_blank"
            rel="noreferrer"
            className="px-4 py-2.5 rounded-xl border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs"
            title="View customer store"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>View Customer Store ↗</span>
          </a>

          <button
            type="button"
            onClick={fetchOffers}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-600 hover:text-stone-900 transition-all cursor-pointer shadow-2xs"
            title="Refresh from TiDB"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin text-[#1e7e34]' : ''}`} />
          </button>

          <button
            type="button"
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-[#1e7e34] hover:bg-[#165c26] text-white text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shadow-md hover:shadow-lg"
          >
            <Plus className="w-4 h-4" />
            <span>+ Create Coupon / Offer</span>
          </button>
        </div>
      </div>

      {/* 2. Stats Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Total Offers</span>
          <div className="text-2xl font-serif font-black text-stone-900">{totalCount}</div>
          <span className="text-[10px] text-stone-500 font-medium">Recorded in TiDB Cloud</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/20 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">Active Coupons</span>
          <div className="text-2xl font-serif font-black text-emerald-800 flex items-center gap-2">
            <span>{activeCount}</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          </div>
          <span className="text-[10px] text-emerald-700 font-semibold">Available for customers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">Deactivated</span>
          <div className="text-2xl font-serif font-black text-stone-700">{inactiveCount}</div>
          <span className="text-[10px] text-stone-500">Draft or paused offers</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200/80 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800">Expired</span>
          <div className="text-2xl font-serif font-black text-amber-900">{expiredCount}</div>
          <span className="text-[10px] text-amber-700 font-medium">Past expiry date</span>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Left: Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search coupon code, title..."
            className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-200 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-[#1e7e34] bg-stone-50/50"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Right: Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl text-xs font-bold">
            {(['ALL', 'ACTIVE', 'INACTIVE', 'EXPIRED'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                  statusFilter === st
                    ? 'bg-white text-stone-900 shadow-2xs font-black'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
              >
                {st === 'ALL' ? 'All' : st.charAt(0) + st.slice(1).toLowerCase()}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-200 text-xs text-stone-700 bg-white focus:outline-none focus:border-[#1e7e34] cursor-pointer"
          >
            <option value="ALL">All Types</option>
            <option value="PERCENTAGE">Percentage (%)</option>
            <option value="FIXED">Fixed Amount (₹)</option>
            <option value="FREE_DELIVERY">Free Delivery</option>
          </select>
        </div>
      </div>

      {/* 4. Offers Table View */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center space-y-3">
            <RefreshCw className="w-8 h-8 text-[#1e7e34] animate-spin mx-auto" />
            <p className="text-xs font-bold text-stone-500">Loading offers from TiDB...</p>
          </div>
        ) : filteredOffers.length === 0 ? (
          <div className="p-12 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#1e7e34] flex items-center justify-center mx-auto">
              <Tag className="w-6 h-6" />
            </div>
            <h4 className="font-serif font-bold text-base text-stone-900">No Offers Found</h4>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              {searchQuery || statusFilter !== 'ALL' || typeFilter !== 'ALL'
                ? 'No offers match your current filter criteria. Try resetting your search or filters.'
                : 'No offers currently exist. Click "+ Create New Offer" to create your first discount coupon.'}
            </p>
            <button
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-[#1e7e34] text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Offer Now</span>
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50/80 border-b border-stone-200 text-stone-500 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Offer Name & Details</th>
                  <th className="py-3.5 px-4">Coupon Code</th>
                  <th className="py-3.5 px-4">Discount</th>
                  <th className="py-3.5 px-4">Start Date</th>
                  <th className="py-3.5 px-4">Expiry Date</th>
                  <th className="py-3.5 px-4 text-center">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredOffers.map((item) => {
                  const isExpired = item.status === 'EXPIRED';
                  const isUpcoming = item.status === 'UPCOMING';
                  const isActive = item.status === 'ACTIVE';

                  const formattedStart = item.startDate
                    ? new Date(item.startDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—';
                  const formattedEnd = item.endDate
                    ? new Date(item.endDate).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })
                    : '—';

                  return (
                    <tr
                      key={item.id}
                      className="hover:bg-emerald-50/20 transition-colors group"
                    >
                      {/* 1. Offer Name */}
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-11 h-11 rounded-xl border border-stone-200 overflow-hidden bg-stone-100 shrink-0 flex items-center justify-center">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Tag className="w-5 h-5 text-[#1e7e34]" />
                            )}
                          </div>
                          <div>
                            <span className="font-serif font-bold text-stone-900 block group-hover:text-[#1e7e34] transition-colors">
                              {item.title}
                            </span>
                            <span className="text-[11px] text-stone-500 line-clamp-1 max-w-xs block">
                              {item.description || 'Exclusive wood-pressed oil promotional offer'}
                            </span>
                            {item.applicableProducts && (
                              <span className="text-[10px] text-emerald-800 font-semibold block mt-0.5 line-clamp-1">
                                🌿 {item.applicableProducts}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* 2. Coupon Code */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5 bg-emerald-50 border border-emerald-300 text-emerald-900 px-2.5 py-1 rounded-lg font-mono text-xs font-black shadow-2xs">
                          <span>{item.code}</span>
                          <button
                            type="button"
                            onClick={() => handleCopyCode(item.code)}
                            className="text-emerald-700 hover:text-emerald-950 cursor-pointer transition-transform active:scale-90"
                            title="Copy coupon code"
                          >
                            {copiedCode === item.code ? (
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>

                      {/* 3. Discount */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-0.5">
                          <span className="font-bold text-stone-900 block text-xs">
                            {item.discountType === 'PERCENTAGE' && `${item.discountValue}% OFF`}
                            {item.discountType === 'FIXED' && `₹${item.discountValue} FLAT OFF`}
                            {item.discountType === 'FREE_DELIVERY' && 'FREE EXPRESS DELIVERY'}
                          </span>
                          <span className="text-[10px] text-stone-500 block">
                            Min: ₹{item.minOrderValue}
                            {item.maxDiscount ? ` • Max: ₹${item.maxDiscount}` : ''}
                          </span>
                        </div>
                      </td>

                      {/* 4. Start Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-stone-600 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>{formattedStart}</span>
                        </div>
                      </td>

                      {/* 5. Expiry Date */}
                      <td className="py-4 px-4 whitespace-nowrap text-stone-600 text-[11px]">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-stone-400" />
                          <span className={isExpired ? 'text-amber-800 font-semibold' : ''}>
                            {formattedEnd}
                          </span>
                        </div>
                      </td>

                      {/* 6. Status */}
                      <td className="py-4 px-4 whitespace-nowrap text-center">
                        {isExpired ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3" />
                            Expired
                          </span>
                        ) : isUpcoming ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            <Clock className="w-3 h-3" />
                            Upcoming
                          </span>
                        ) : isActive ? (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-800 border border-emerald-300 transition-all cursor-pointer"
                            title="Click to Deactivate"
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
                            <span>Active</span>
                          </button>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleStatus(item)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-200 transition-all cursor-pointer"
                            title="Click to Activate"
                          >
                            <XCircle className="w-3 h-3 text-stone-400" />
                            <span>Inactive</span>
                          </button>
                        )}
                      </td>

                      {/* 7. Actions */}
                      <td className="py-4 px-4 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(item)}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-[#1e7e34] hover:bg-emerald-50 transition-all cursor-pointer"
                            title="Edit Offer"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setOfferToDelete(item);
                              setDeleteModalOpen(true);
                            }}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                            title="Delete Offer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 5. MODAL: CREATE / EDIT OFFER                                  */}
      {/* ============================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full max-h-[90vh] flex flex-col border border-stone-200 shadow-2xl relative overflow-hidden">
            {/* Modal Header (Fixed at top) */}
            <div className="flex items-center justify-between p-5 sm:p-6 pb-4 border-b border-stone-100 shrink-0 bg-white">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-[#1e7e34] flex items-center justify-center shrink-0">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-stone-900 leading-snug">
                    {isEditing ? 'Edit Offer & Discount' : 'Create New Offer & Coupon'}
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Store details in TiDB and publish live to SS OIL customer checkout
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 cursor-pointer"
                title="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(e);
              }}
              className="flex flex-col flex-1 overflow-hidden min-h-0"
            >
              {/* Modal Scrollable Form Body */}
              <div id="offerFormScroll" className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-4">
                {/* Validation Error Banner at Top */}
                {Object.keys(formErrors).length > 0 && (
                  <div className="p-3.5 bg-red-50 border border-red-300 rounded-2xl flex items-start gap-2.5 text-xs text-red-700 animate-fadeIn shadow-2xs">
                    <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="font-bold">விடுபட்ட விவரங்களை சரிசெய்யவும் (Please complete required fields):</p>
                      <ul className="list-disc list-inside text-[11px] mt-1 space-y-0.5 font-semibold text-red-600">
                        {formErrors.title && <li>{formErrors.title}</li>}
                        {formErrors.code && <li>{formErrors.code}</li>}
                        {formErrors.discountValue && <li>{formErrors.discountValue}</li>}
                        {formErrors.startDate && <li>{formErrors.startDate}</li>}
                        {formErrors.endDate && <li>{formErrors.endDate}</li>}
                        {formErrors.submit && <li>{formErrors.submit}</li>}
                      </ul>
                    </div>
                  </div>
                )}

                {/* Row 1: Title & Code */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Offer Title *
                    </label>
                    <input
                      id="offer_input_title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="e.g. 15% OFF on Orders Above ₹1000"
                      className={`w-full px-3.5 py-2 rounded-xl border text-xs text-stone-900 focus:outline-none focus:ring-2 ${
                        formErrors.title
                          ? 'border-red-400 ring-red-400/20'
                          : 'border-stone-300 focus:border-[#1e7e34] focus:ring-emerald-500/20'
                      }`}
                    />
                    {formErrors.title && (
                      <span className="text-[10px] text-red-600 font-semibold mt-0.5 block">
                        {formErrors.title}
                      </span>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-800 mb-1">
                      Coupon Code * (Alphanumeric)
                    </label>
                    <input
                      id="offer_input_code"
                      type="text"
                      value={formData.code}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          code: e.target.value.toUpperCase().replace(/[^A-Z0-9_-]/g, ''),
                        })
                      }
                      placeholder="e.g. SAVE15"
                      className={`w-full px-3.5 py-2 rounded-xl border font-mono text-xs uppercase font-bold text-emerald-900 focus:outline-none focus:ring-2 ${
                        formErrors.code
                          ? 'border-red-400 ring-red-400/20'
                          : 'border-stone-300 focus:border-[#1e7e34] focus:ring-emerald-500/20'
                      }`}
                    />
                  {formErrors.code && (
                    <span className="text-[10px] text-red-600 font-semibold mt-0.5 block">
                      {formErrors.code}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 2: Description */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Offer Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Welcome offer for all natural cold-pressed oil purchases..."
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#1e7e34] resize-none"
                />
              </div>

              {/* Row 3: Discount Type & Value */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Discount Type *
                  </label>
                  <select
                    value={formData.discountType}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        discountType: e.target.value as 'PERCENTAGE' | 'FIXED' | 'FREE_DELIVERY',
                      })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#1e7e34] bg-white cursor-pointer"
                  >
                    <option value="PERCENTAGE">Percentage (%)</option>
                    <option value="FIXED">Fixed Amount (₹)</option>
                    <option value="FREE_DELIVERY">Free Delivery</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Discount Value * {formData.discountType === 'PERCENTAGE' ? '(%)' : '(₹)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={formData.discountType === 'PERCENTAGE' ? '100' : '10000'}
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className={`w-full px-3 py-2 rounded-xl border text-xs font-bold text-stone-900 focus:outline-none focus:ring-2 ${
                      formErrors.discountValue
                        ? 'border-red-400 ring-red-400/20'
                        : 'border-stone-300 focus:border-[#1e7e34] focus:ring-emerald-500/20'
                    }`}
                  />
                  {formErrors.discountValue && (
                    <span className="text-[10px] text-red-600 font-semibold mt-0.5 block">
                      {formErrors.discountValue}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Min Order Value (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    placeholder="0"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-900 focus:outline-none focus:border-[#1e7e34]"
                  />
                </div>
              </div>

              {/* Row 4: Max Discount Cap (for percentage) */}
              {formData.discountType === 'PERCENTAGE' && (
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Maximum Discount Cap (₹) (Optional)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={formData.maxDiscount}
                    onChange={(e) => setFormData({ ...formData, maxDiscount: e.target.value })}
                    placeholder="e.g. 300 (Leaves uncapped if blank)"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#1e7e34]"
                  />
                </div>
              )}

              {/* Row 5: Start & Expiry Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Offer Start Date *
                  </label>
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#1e7e34] cursor-pointer"
                  />
                  {formErrors.startDate && (
                    <span className="text-[10px] text-red-600 font-semibold mt-0.5 block">
                      {formErrors.startDate}
                    </span>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Offer Expiry Date *
                  </label>
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:border-[#1e7e34] cursor-pointer"
                  />
                  {formErrors.endDate && (
                    <span className="text-[10px] text-red-600 font-semibold mt-0.5 block">
                      {formErrors.endDate}
                    </span>
                  )}
                </div>
              </div>

              {/* Row 6: Offer Image Upload or URL */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Offer Banner Image (Optional)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-14 rounded-xl border border-stone-200 overflow-hidden bg-stone-100 flex items-center justify-center shrink-0">
                    {formData.imageUrl ? (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Tag className="w-6 h-6 text-stone-400" />
                    )}
                  </div>

                  <div className="flex-1 space-y-1.5">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl border border-stone-300 hover:border-emerald-600 bg-white hover:bg-stone-50 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-[#1e7e34]" />
                        <span>Upload Photo</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageFileChange}
                        />
                      </label>
                      {formData.imageUrl && (
                        <button
                          type="button"
                          onClick={() => setFormData((p) => ({ ...p, imageUrl: '' }))}
                          className="text-xs text-red-600 hover:underline cursor-pointer"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={formData.imageUrl || ''}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      placeholder="Or paste direct image URL (https://...)"
                      className="w-full px-3 py-1 rounded-lg border border-stone-200 text-[11px] text-stone-700"
                    />
                  </div>
                </div>
              </div>

              {/* Row 7: Applicable Oil Products */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-800">
                  Applicable Oil Products
                </label>
                <p className="text-[11px] text-stone-500">
                  Select which oils or bundles this promotional coupon applies to:
                </p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {OIL_PRODUCT_OPTIONS.map((opt) => {
                    const isSelected =
                      formData.applicableProducts === opt ||
                      (formData.applicableProducts || '').includes(opt);
                    return (
                      <button
                        key={opt}
                        type="button"
                        onClick={() => {
                          if (opt === 'All Mara Chekku Oils') {
                            setFormData((p) => ({ ...p, applicableProducts: 'All Mara Chekku Oils' }));
                          } else {
                            const currentList = (formData.applicableProducts || '')
                              .split(',')
                              .map((s) => s.trim())
                              .filter((s) => s && s !== 'All Mara Chekku Oils');
                            let nextList: string[];
                            if (currentList.includes(opt)) {
                              nextList = currentList.filter((s) => s !== opt);
                            } else {
                              nextList = [...currentList, opt];
                            }
                            setFormData((p) => ({
                              ...p,
                              applicableProducts: nextList.length > 0 ? nextList.join(', ') : 'All Mara Chekku Oils',
                            }));
                          }
                        }}
                        className={`px-3 py-1.5 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-800 text-white shadow-2xs'
                            : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                        }`}
                      >
                        {isSelected ? '✓ ' : ''}{opt}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Row 8: Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="isActiveToggle"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#1e7e34] rounded border-stone-300 focus:ring-emerald-500 cursor-pointer"
                />
                <label
                  htmlFor="isActiveToggle"
                  className="text-xs font-bold text-stone-800 cursor-pointer select-none"
                >
                  Activate immediately on website & checkout
                </label>
              </div>
            </div>

            {/* Modal Footer (Fixed at bottom inside the form) */}
            <div className="p-4 sm:p-5 border-t border-stone-100 bg-stone-50/90 shrink-0 flex items-center justify-between gap-3">
              {Object.keys(formErrors).length > 0 ? (
                <button
                  type="button"
                  onClick={() => {
                    const formEl = document.getElementById('offerFormScroll');
                    if (formEl) formEl.scrollTop = 0;
                    document.getElementById('offer_input_title')?.focus();
                  }}
                  className="flex items-center gap-1.5 text-xs font-bold text-red-600 hover:text-red-700 underline text-left cursor-pointer"
                  title="Click to scroll to errors"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>
                    {formErrors.submit || formErrors.code || formErrors.title || '⚠️ பிழையைச் சரிசெய்ய இங்கே கிளிக் செய்யவும் (Click to view errors)'}
                  </span>
                </button>
              ) : (
                <span className="text-[11px] text-stone-400 hidden sm:inline">
                  * Marked fields are mandatory
                </span>
              )}

              <div className="flex items-center gap-2.5 ml-auto">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-stone-700 text-xs font-bold transition-all border border-stone-200 cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit(e);
                  }}
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-[#1e7e34] hover:bg-[#165c26] text-white text-xs font-bold transition-all cursor-pointer shadow-md disabled:opacity-50 flex items-center gap-2"
                >
                  {isSubmitting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>{isEditing ? 'Save Changes' : 'Create & Save to TiDB'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    )}

      {/* ============================================================== */}
      {/* 6. MODAL: DELETE CONFIRMATION                                  */}
      {/* ============================================================== */}
      {deleteModalOpen && offerToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 border border-stone-200 shadow-2xl">
            <div className="flex items-center gap-3 text-red-600">
              <div className="w-10 h-10 rounded-2xl bg-red-100 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <h4 className="font-serif font-black text-lg text-stone-900">Delete Offer Coupon?</h4>
                <p className="text-xs text-stone-500">
                  This will permanently remove code <strong className="font-mono text-red-700">{offerToDelete.code}</strong>.
                </p>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Are you sure you want to delete <strong>{offerToDelete.title}</strong>? Customers will no longer be able to redeem this coupon at checkout.
            </p>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setDeleteModalOpen(false);
                  setOfferToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 text-stone-700 text-xs font-bold hover:bg-stone-200 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-bold cursor-pointer shadow-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

