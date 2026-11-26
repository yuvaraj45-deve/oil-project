import React, { useState, useMemo } from 'react';
import {
  Gift,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  Sparkles,
  Percent,
  ShoppingBag,
  Tag,
  AlertCircle,
  Upload,
  ImageIcon,
  ArrowRight,
  Eye,
  Layers,
  Boxes,
  CheckCircle2,
  Loader2,
  Calendar,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  PackageCheck,
  Flame,
} from 'lucide-react';
import { ComboOffer, ComboItem, Product } from '../../types';
import { useCombos, comboOfferToProduct } from '../../context/ComboContext';
import { useStore } from '../../context/StoreContext';
import { autoTranslateProductNameToTamil } from '../../utils/productUtils';

interface ComboOffersManagerProps {
  onShowToast: (msg: string) => void;
  onBackToStore?: () => void;
}

const PRESET_COMBO_IMAGES = [
  { label: 'Sesame & Groundnut Hero Banner', url: '/banners/groundnut_hero_banner.jpg' },
  { label: 'Sesame & Sunflower Festive Banner', url: '/banners/sesame_sunflower_banner.jpg' },
  { label: 'Bottling & Cold Extraction Banner', url: '/banners/ssoil_bottling_hero_banner.jpg' },
  { label: 'Sesame Oil Packshot', url: '/products/sesame_oil.jpg?v=ssoil' },
  { label: 'Coconut Oil Packshot', url: '/products/coconut_oil.jpg?v=ssoil' },
  { label: 'Groundnut Oil Packshot', url: '/products/groundnut_oil.jpg?v=ssoil' },
  { label: 'Family 5L Can Packshot', url: '/products/ss_oil_can.jpg?v=ssoil' },
  { label: 'Pure Pooja Lamp Oil', url: '/products/lamp_oil.jpg?v=ssoil' },
];

const PRESET_BADGES = [
  'Special Deal',
  'Best Value',
  'Limited Offer',
  'Buy 2 Get 1 Free',
  'Festive Special',
  'Mega Bundle Savings',
];

export const ComboOffersManager: React.FC<ComboOffersManagerProps> = ({
  onShowToast,
  onBackToStore,
}) => {
  const { combos, isLoading, createCombo, updateCombo, toggleComboStatus, deleteCombo } = useCombos();
  const { products } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBadge, setFilterBadge] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState<'ALL' | 'ACTIVE' | 'INACTIVE'>('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComboId, setEditingComboId] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [comboToDelete, setComboToDelete] = useState<ComboOffer | null>(null);

  // Form fields
  const [formTitle, setFormTitle] = useState('');
  const [formTamilTitle, setFormTamilTitle] = useState('');
  const [isTamilManual, setIsTamilManual] = useState(false);
  const [formDescription, setFormDescription] = useState('');
  const [formTamilDescription, setFormTamilDescription] = useState('');
  const [formBadge, setFormBadge] = useState('Special Deal');
  const [formOriginalPrice, setFormOriginalPrice] = useState<number | ''>(1060);
  const [formDiscountedPrice, setFormDiscountedPrice] = useState<number | ''>(869);
  const [formPackSize, setFormPackSize] = useState('3 Litre Heritage Combo Box (1L x 3 Bottles)');
  const [formImage, setFormImage] = useState('/banners/groundnut_hero_banner.jpg');
  const [formStartDate, setFormStartDate] = useState(new Date().toISOString().split('T')[0]);
  const [formEndDate, setFormEndDate] = useState(
    new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
  );
  const [formIsActive, setFormIsActive] = useState(true);

  // Selected Products for this Combo
  const [selectedItems, setSelectedItems] = useState<ComboItem[]>([
    {
      productId: 'ss-sesame-1000',
      productName: 'SS Cold-Pressed Sesame Oil (நல்லெண்ணெய்)',
      productTamilName: 'மரச்செக்கு நல்லெண்ணெய்',
      packSize: '1 Litre Glass Bottle',
      quantity: 1,
      unitPrice: 420,
    },
    {
      productId: 'ss-groundnut-1000',
      productName: 'SS Cold-Pressed Groundnut Oil (கடலை எண்ணெய்)',
      productTamilName: 'மரச்செக்கு கடலை எண்ணெய்',
      packSize: '1 Litre Glass Bottle',
      quantity: 1,
      unitPrice: 320,
    },
    {
      productId: 'ss-coconut-1000',
      productName: 'SS Pure Cold-Pressed Coconut Oil (தேங்காய் எண்ணெய்)',
      productTamilName: 'மரச்செக்கு தேங்காய் எண்ணெய்',
      packSize: '1 Litre Glass Bottle',
      quantity: 1,
      unitPrice: 320,
    },
  ]);

  const [formError, setFormError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filter regular oil products from store catalog that can be included in combos
  const regularProducts = useMemo(() => {
    return (products || []).filter((p) => p.category !== 'combo-offers' && p.category !== 'combo');
  }, [products]);

  // Filtered Combos
  const filteredCombos = useMemo(() => {
    return combos.filter((c) => {
      const q = searchTerm.toLowerCase();
      const matchesSearch =
        c.title.toLowerCase().includes(q) ||
        (c.tamilTitle && c.tamilTitle.includes(searchTerm)) ||
        c.description.toLowerCase().includes(q) ||
        (c.badge && c.badge.toLowerCase().includes(q));

      const matchesBadge =
        filterBadge === 'ALL' || (c.badge && c.badge.toLowerCase() === filterBadge.toLowerCase());

      const matchesStatus =
        filterStatus === 'ALL' ||
        (filterStatus === 'ACTIVE' && c.isActive) ||
        (filterStatus === 'INACTIVE' && !c.isActive);

      return matchesSearch && matchesBadge && matchesStatus;
    });
  }, [combos, searchTerm, filterBadge, filterStatus]);

  // Auto-calculate suggested MRP from selected items
  const calculatedItemsTotal = useMemo(() => {
    return selectedItems.reduce((sum, item) => sum + (item.unitPrice || 0) * item.quantity, 0);
  }, [selectedItems]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingComboId(null);
    setFormTitle('');
    setFormTamilTitle('');
    setIsTamilManual(false);
    setFormDescription('');
    setFormTamilDescription('');
    setFormBadge('Special Deal');
    setFormOriginalPrice(calculatedItemsTotal > 0 ? calculatedItemsTotal : 1060);
    setFormDiscountedPrice(calculatedItemsTotal > 0 ? Math.round(calculatedItemsTotal * 0.82) : 869);
    setFormPackSize('3 Litre Combo Box');
    setFormImage('/banners/groundnut_hero_banner.jpg');
    setFormStartDate(new Date().toISOString().split('T')[0]);
    setFormEndDate(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
    setFormIsActive(true);
    setFormError('');

    // Pre-populate with default 3 popular products if none
    if (regularProducts.length >= 3 && selectedItems.length === 0) {
      setSelectedItems(
        regularProducts.slice(0, 3).map((p) => ({
          productId: p.id,
          productName: p.name,
          productTamilName: p.tamilName || p.name,
          packSize: p.defaultPack || (p.packSizes && p.packSizes[0]) || '1 Litre Bottle',
          quantity: 1,
          unitPrice: p.price,
        }))
      );
    }
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (combo: ComboOffer) => {
    setEditingComboId(combo.id);
    setFormTitle(combo.title);
    setFormTamilTitle(combo.tamilTitle || '');
    setIsTamilManual(!!combo.tamilTitle);
    setFormDescription(combo.description || '');
    setFormTamilDescription(combo.tamilDescription || '');
    setFormBadge(combo.badge || 'Special Deal');
    setFormOriginalPrice(combo.originalPrice);
    setFormDiscountedPrice(combo.discountedPrice);
    setFormPackSize(combo.packSize || '3 Litre Combo Pack');
    setFormImage(combo.imageUrl || '/banners/groundnut_hero_banner.jpg');
    setFormStartDate(
      combo.startDate
        ? new Date(combo.startDate).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0]
    );
    setFormEndDate(
      combo.endDate
        ? new Date(combo.endDate).toISOString().split('T')[0]
        : new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
    );
    setFormIsActive(combo.isActive !== false);
    setSelectedItems(combo.items || []);
    setFormError('');
    setIsModalOpen(true);
  };

  // Add Product to Selected Combo Items
  const handleAddProductToCombo = (productId: string) => {
    const prod = regularProducts.find((p) => p.id === productId);
    if (!prod) return;

    const existingIndex = selectedItems.findIndex((i) => i.productId === productId);
    if (existingIndex >= 0) {
      // Increment quantity
      setSelectedItems((prev) =>
        prev.map((item, idx) =>
          idx === existingIndex ? { ...item, quantity: item.quantity + 1 } : item
        )
      );
    } else {
      setSelectedItems((prev) => [
        ...prev,
        {
          productId: prod.id,
          productName: prod.name,
          productTamilName: prod.tamilName || prod.name,
          packSize: prod.defaultPack || (prod.packSizes && prod.packSizes[0]) || '1 Litre Bottle',
          quantity: 1,
          unitPrice: prod.price,
        },
      ]);
    }
  };

  // Remove Product from Combo Items
  const handleRemoveProductFromCombo = (productId: string) => {
    setSelectedItems((prev) => prev.filter((i) => i.productId !== productId));
  };

  // Update Item Quantity
  const handleUpdateItemQuantity = (productId: string, delta: number) => {
    setSelectedItems((prev) =>
      prev
        .map((i) => {
          if (i.productId === productId) {
            const nextQty = Math.max(1, i.quantity + delta);
            return { ...i, quantity: nextQty };
          }
          return i;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  // Handle Form Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;

    if (!formTitle.trim()) {
      setFormError('Please enter a Combo Offer Name (காம்போ பெயர் தேவை)');
      return;
    }

    const orig = Number(formOriginalPrice);
    const disc = Number(formDiscountedPrice);

    if (isNaN(orig) || orig <= 0) {
      setFormError('Please enter a valid Original Price / MRP (அசல் மதிப்பு தேவை)');
      return;
    }

    if (isNaN(disc) || disc <= 0) {
      setFormError('Please enter a valid Discounted Combo Price (சலுகை விலை தேவை)');
      return;
    }

    if (disc > orig) {
      setFormError('Discounted price cannot be greater than original price (சலுகை விலை அசல் விலையை விட அதிகமாக இருக்க முடியாது)');
      return;
    }

    if (selectedItems.length === 0) {
      setFormError('Please select at least one oil product included in this combo (குறைந்தது ஒரு எண்ணெயை தேர்ந்தெடுக்கவும்)');
      return;
    }

    setIsSubmitting(true);
    setFormError('');

    const payload: Partial<ComboOffer> = {
      title: formTitle.trim(),
      tamilTitle: formTamilTitle.trim() || autoTranslateProductNameToTamil(formTitle),
      description: formDescription.trim() || selectedItems.map((i) => `${i.quantity}x ${i.productName}`).join(' + '),
      tamilDescription: formTamilDescription.trim() || null,
      badge: formBadge,
      imageUrl: formImage.trim() || '/banners/groundnut_hero_banner.jpg',
      originalPrice: orig,
      discountedPrice: disc,
      discountPercent: Math.round(((orig - disc) / orig) * 100),
      packSize: formPackSize.trim() || `${selectedItems.length} Oil Heritage Combo`,
      items: selectedItems,
      startDate: new Date(formStartDate).toISOString(),
      endDate: new Date(formEndDate).toISOString(),
      isActive: formIsActive,
      sortOrder: 0,
    };

    try {
      if (editingComboId) {
        const res = await updateCombo(editingComboId, payload);
        if (res.success) {
          onShowToast(`✓ Combo offer "${formTitle}" updated successfully in TiDB!`);
          setIsModalOpen(false);
        } else {
          setFormError(res.message);
        }
      } else {
        const res = await createCombo(payload);
        if (res.success) {
          onShowToast(`✓ Combo offer "${formTitle}" published live to TiDB & Shop Page!`);
          setIsModalOpen(false);
        } else {
          setFormError(res.message);
        }
      }
    } catch (err) {
      setFormError((err as Error).message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Toggle Status
  const handleToggle = async (combo: ComboOffer) => {
    const res = await toggleComboStatus(combo.id);
    if (res.success) {
      onShowToast(
        res.isActive
          ? `✓ "${combo.title}" Activated live on website!`
          : `⚠️ "${combo.title}" Deactivated.`
      );
    } else {
      onShowToast(`❌ Error: ${res.message}`);
    }
  };

  // Handle Delete Confirmation
  const handleDeleteConfirm = async () => {
    if (!comboToDelete) return;
    const res = await deleteCombo(comboToDelete.id);
    if (res.success) {
      onShowToast(`✓ Combo offer "${comboToDelete.title}" deleted.`);
      setDeleteModalOpen(false);
      setComboToDelete(null);
    } else {
      onShowToast(`❌ Error: ${res.message}`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Bar */}
      <div className="p-5 sm:p-6 rounded-3xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-300 text-forest-950 shadow-md border-2 border-amber-500 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-forest-950 text-gold-300 font-mono text-[10px] font-black uppercase tracking-wider">
              TiDB CLOUD PERSISTENCE
            </span>
            <span className="text-xs font-bold text-amber-900">
              {combos.filter((c) => c.isActive).length} Active Combos Live
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-serif font-black tracking-tight text-forest-950 mt-1 flex items-center gap-2">
            <Gift className="w-6 h-6 text-forest-950" />
            <span>Special Combo Offers Management (காம்போ சலுகைகள்)</span>
          </h2>
          <p className="text-xs sm:text-sm text-forest-900 font-medium max-w-2xl mt-0.5">
            Create high-converting bundle deals (e.g. Mara Chekku Trio, Buy 2 Get 1 Free). Changes sync automatically to TiDB Cloud and publish live to the Customer Shop Page.
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          {onBackToStore && (
            <button
              onClick={onBackToStore}
              className="px-4 py-2.5 rounded-xl border border-forest-900/40 hover:bg-forest-900/10 text-forest-950 font-bold text-xs transition-all cursor-pointer"
            >
              View Shop Page
            </button>
          )}

          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-2xl bg-forest-950 hover:bg-forest-900 text-gold-300 font-black text-xs sm:text-sm flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer transform active:scale-95"
          >
            <Plus className="w-4 h-4 text-gold-400" />
            <span>Create New Combo (புதிய காம்போ)</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            placeholder="Search combos by name, badge, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500 bg-stone-50/50"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 bg-white focus:outline-none"
          >
            <option value="ALL">All Status</option>
            <option value="ACTIVE">Active Only</option>
            <option value="INACTIVE">Inactive Only</option>
          </select>

          {/* Badge Filter */}
          <select
            value={filterBadge}
            onChange={(e) => setFilterBadge(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 bg-white focus:outline-none"
          >
            <option value="ALL">All Badges</option>
            {PRESET_BADGES.map((b) => (
              <option key={b} value={b}>
                {b}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Combos Grid Display */}
      {isLoading ? (
        <div className="py-16 text-center">
          <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
          <p className="text-xs text-stone-500 mt-2 font-bold">Loading Combo Offers from TiDB Cloud...</p>
        </div>
      ) : filteredCombos.length === 0 ? (
        <div className="bg-white rounded-3xl p-10 text-center border-2 border-dashed border-stone-300 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto">
            <Gift className="w-7 h-7" />
          </div>
          <div>
            <h3 className="font-serif font-black text-lg text-stone-800">No Combo Offers Found</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto mt-1">
              {searchTerm || filterBadge !== 'ALL' || filterStatus !== 'ALL'
                ? 'Try adjusting your search or filters.'
                : 'Click "Create New Combo" above to add your first attractive oil combo deal!'}
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-4 py-2 rounded-xl bg-forest-950 text-gold-300 font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Combo</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCombos.map((combo) => {
            const savings = Math.max(0, combo.originalPrice - combo.discountedPrice);
            return (
              <div
                key={combo.id}
                className={`bg-white rounded-3xl border-2 transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-sm hover:shadow-xl ${
                  combo.isActive
                    ? 'border-amber-300 hover:border-amber-500'
                    : 'border-stone-200 opacity-60 bg-stone-50/70'
                }`}
              >
                {/* Header Strip */}
                <div className="p-3.5 bg-gradient-to-r from-amber-100 via-amber-50 to-stone-50 border-b border-amber-200/80 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider bg-amber-400 text-forest-950">
                      {combo.badge || 'Special Deal'}
                    </span>
                    <span className="text-[10px] font-mono text-stone-500">#{combo.id}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleToggle(combo)}
                      className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase flex items-center gap-1 cursor-pointer transition-all ${
                        combo.isActive
                          ? 'bg-emerald-600 text-white shadow-2xs'
                          : 'bg-stone-300 text-stone-700'
                      }`}
                      title={combo.isActive ? 'Click to Deactivate' : 'Click to Activate'}
                    >
                      {combo.isActive ? <Check className="w-3 h-3" /> : <X className="w-3 h-3" />}
                      <span>{combo.isActive ? 'Active Live' : 'Disabled'}</span>
                    </button>
                  </div>
                </div>

                {/* Body Content */}
                <div className="p-5 flex-1 space-y-3.5">
                  {/* Image & Pack */}
                  <div className="relative h-44 rounded-2xl overflow-hidden bg-amber-50/40 border border-stone-200/80 flex items-center justify-center p-3">
                    <img
                      src={combo.imageUrl}
                      alt={combo.title}
                      onError={(e) => {
                        e.currentTarget.src = '/banners/groundnut_hero_banner.jpg';
                      }}
                      className="w-full h-full object-contain drop-shadow-md"
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded-lg bg-forest-950/80 text-white text-[10px] font-bold backdrop-blur-xs">
                      {combo.packSize}
                    </div>
                    {savings > 0 && (
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-lg bg-emerald-600 text-white text-[10px] font-black shadow-xs">
                        Save ₹{savings} ({combo.discountPercent}% OFF)
                      </div>
                    )}
                  </div>

                  {/* Title & Tamil */}
                  <div>
                    <h3 className="font-serif font-black text-base sm:text-lg text-forest-950 line-clamp-1">
                      {combo.title}
                    </h3>
                    {combo.tamilTitle && (
                      <p className="text-xs font-bold text-amber-900 line-clamp-1">{combo.tamilTitle}</p>
                    )}
                    <p className="text-xs text-stone-500 line-clamp-2 mt-1">{combo.description}</p>
                  </div>

                  {/* Included Items List */}
                  <div className="pt-2 border-t border-stone-100 space-y-1">
                    <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
                      Included Products ({combo.items?.length || 0}):
                    </span>
                    <div className="space-y-1 max-h-24 overflow-y-auto pr-1">
                      {(combo.items || []).map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between text-xs bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/60"
                        >
                          <span className="font-semibold text-stone-800 truncate mr-2">
                            {item.quantity}x {item.productName}
                          </span>
                          <span className="text-[10px] font-bold text-stone-500 shrink-0">
                            {item.packSize}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Price Row */}
                  <div className="pt-3 border-t border-stone-100 flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] text-stone-400 uppercase font-bold block">Combo Price</span>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-serif text-2xl font-black text-forest-950">
                          ₹{combo.discountedPrice}
                        </span>
                        {combo.originalPrice > combo.discountedPrice && (
                          <span className="text-xs line-through text-stone-400 font-bold">
                            ₹{combo.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded border border-emerald-300 block">
                        {combo.discountPercent}% OFF
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-3.5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5 text-[11px] text-stone-500">
                    <Calendar className="w-3 h-3 text-stone-400" />
                    <span>
                      {combo.endDate
                        ? `Valid till ${new Date(combo.endDate).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}`
                        : 'Permanent Deal'}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(combo)}
                      className="p-2 rounded-xl text-stone-600 hover:text-amber-800 hover:bg-amber-100/60 border border-stone-200 transition-colors cursor-pointer"
                      title="Edit Combo"
                    >
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setComboToDelete(combo);
                        setDeleteModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-stone-400 hover:text-rose-600 hover:bg-rose-50 border border-stone-200 transition-colors cursor-pointer"
                      title="Delete Combo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* CREATE / EDIT COMBO MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fadeIn select-none">
          <div className="bg-white w-full max-w-3xl rounded-3xl border-2 border-amber-300 shadow-2xl overflow-hidden relative my-6 max-h-[92vh] flex flex-col">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-forest-950 via-[#132c19] to-emerald-950 text-white px-6 py-4 flex items-center justify-between border-b border-amber-400/40 shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-400 text-forest-950 flex items-center justify-center font-bold">
                  <Gift className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-black text-lg text-white">
                    {editingComboId ? 'Edit Combo Offer (காம்போவை மாற்று)' : 'Create New Combo Offer (புதிய காம்போ)'}
                  </h3>
                  <p className="text-[11px] text-cream-200">
                    Store combo details directly in TiDB database and publish live to customer checkout
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5 flex-1">
              {formError && (
                <div className="p-3.5 bg-rose-50 border border-rose-300 rounded-2xl flex items-center gap-2 text-xs text-rose-700 font-bold">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Title & Tamil Title */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Combo Offer Name (English) *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Heritage Mara Chekku Trio Combo"
                    value={formTitle}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormTitle(val);
                      if (!isTamilManual) {
                        setFormTamilTitle(autoTranslateProductNameToTamil(val));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    தமிழ் பெயர் (Tamil Name)
                  </label>
                  <input
                    type="text"
                    placeholder="எ.கா. பாரம்பரிய மரச்செக்கு முக்கூட்டு காம்போ"
                    value={formTamilTitle}
                    onChange={(e) => {
                      setIsTamilManual(true);
                      setFormTamilTitle(e.target.value);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Description & Tamil */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Combo Description (English)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Describe included oils, health benefits, and celebratory packaging..."
                    value={formDescription}
                    onChange={(e) => setFormDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    விளக்கம் (Tamil Description)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="காம்போ பற்றிய தமிழ் விளக்கம்..."
                    value={formTamilDescription}
                    onChange={(e) => setFormTamilDescription(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Badge & Pack Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Promotional Badge Label
                  </label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {PRESET_BADGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Bundle Pack Size / Package Type
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 3 Litre Heritage Box (1L x 3)"
                    value={formPackSize}
                    onChange={(e) => setFormPackSize(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* ============================================================ */}
              {/* SELECT INCLUDED OIL PRODUCTS AND SET QUANTITIES             */}
              {/* ============================================================ */}
              <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-300/80 space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2">
                    <Boxes className="w-4 h-4 text-amber-800" />
                    <label className="text-xs font-serif font-black text-forest-950">
                      Included Oil Products & Quantities in this Combo *
                    </label>
                  </div>
                  {calculatedItemsTotal > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setFormOriginalPrice(calculatedItemsTotal);
                        setFormDiscountedPrice(Math.round(calculatedItemsTotal * 0.8));
                      }}
                      className="text-[11px] font-bold text-amber-900 bg-white hover:bg-amber-100 px-2.5 py-1 rounded-lg border border-amber-300 transition-colors cursor-pointer"
                    >
                      Sum Total: ₹{calculatedItemsTotal} (Click to set MRP)
                    </button>
                  )}
                </div>

                {/* Selected Items List */}
                {selectedItems.length > 0 ? (
                  <div className="space-y-2">
                    {selectedItems.map((item) => (
                      <div
                        key={item.productId}
                        className="bg-white p-3 rounded-xl border border-amber-200 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-forest-950 truncate">
                            {item.productName}
                          </h4>
                          <span className="text-[10px] text-stone-500 block">
                            Pack: {item.packSize} • Base: ₹{item.unitPrice || 0}/unit
                          </span>
                        </div>

                        {/* Quantity Counter */}
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQuantity(item.productId, -1)}
                            className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center cursor-pointer"
                          >
                            -
                          </button>
                          <span className="w-6 text-center text-xs font-black text-forest-950">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateItemQuantity(item.productId, 1)}
                            className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold flex items-center justify-center cursor-pointer"
                          >
                            +
                          </button>
                          <span className="text-xs font-serif font-bold text-stone-900 ml-1">
                            = ₹{(item.unitPrice || 0) * item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleRemoveProductFromCombo(item.productId)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer ml-1"
                            title="Remove oil from combo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-amber-900 font-medium">
                    No oils added to combo yet. Select from available oils below:
                  </p>
                )}

                {/* Available Products Quick-Add Dropdown */}
                <div className="pt-2 border-t border-amber-200/60">
                  <span className="text-[10px] font-bold text-stone-600 uppercase tracking-wider block mb-1.5">
                    + Add Another Oil to this Combo:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {regularProducts.map((p) => {
                      const isAdded = selectedItems.some((i) => i.productId === p.id);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleAddProductToCombo(p.id)}
                          className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                            isAdded
                              ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                              : 'bg-white hover:bg-amber-100 text-stone-700 border border-stone-200 shadow-2xs'
                          }`}
                        >
                          <Plus className="w-3 h-3" />
                          <span>{p.name.replace('SS Cold-Pressed ', '').replace('SS Pure Cold-Pressed ', '')}</span>
                          <span className="text-[10px] text-stone-400">(₹{p.price})</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Pricing & Discount Real-time Calculator */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Original Price (MRP) *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formOriginalPrice}
                      onChange={(e) =>
                        setFormOriginalPrice(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-stone-300 text-xs font-serif font-black text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Discounted Combo Price *
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-600 font-bold text-xs">₹</span>
                    <input
                      type="number"
                      required
                      min={1}
                      value={formDiscountedPrice}
                      onChange={(e) =>
                        setFormDiscountedPrice(e.target.value === '' ? '' : Number(e.target.value))
                      }
                      className="w-full pl-7 pr-3 py-2 rounded-xl border border-emerald-400 text-xs font-serif font-black text-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Calculated Savings
                  </label>
                  {formOriginalPrice && formDiscountedPrice && Number(formOriginalPrice) >= Number(formDiscountedPrice) ? (
                    <div className="p-2 rounded-xl bg-emerald-100 text-emerald-900 font-bold text-xs flex items-center justify-between border border-emerald-300">
                      <span>Save ₹{Number(formOriginalPrice) - Number(formDiscountedPrice)}</span>
                      <span className="px-1.5 py-0.5 rounded bg-emerald-700 text-white font-black text-[10px]">
                        {Math.round(
                          ((Number(formOriginalPrice) - Number(formDiscountedPrice)) /
                            Number(formOriginalPrice)) *
                            100
                        )}
                        % OFF
                      </span>
                    </div>
                  ) : (
                    <span className="text-xs text-stone-400 mt-2 block">Enter valid prices</span>
                  )}
                </div>
              </div>

              {/* Combo Image Selection */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Combo Packshot / Banner Image
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl border border-stone-200 bg-amber-50/50 p-1 shrink-0 flex items-center justify-center overflow-hidden">
                    <img
                      src={formImage}
                      alt="Preview"
                      onError={(e) => (e.currentTarget.src = '/banners/groundnut_hero_banner.jpg')}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <input
                    type="text"
                    value={formImage}
                    onChange={(e) => setFormImage(e.target.value)}
                    placeholder="Paste image URL (e.g. /banners/groundnut_hero_banner.jpg)"
                    className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                {/* Preset image selector */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {PRESET_COMBO_IMAGES.map((img) => (
                    <button
                      key={img.url}
                      type="button"
                      onClick={() => setFormImage(img.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border transition-colors cursor-pointer ${
                        formImage === img.url
                          ? 'bg-amber-500 text-forest-950 border-amber-600'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {img.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Start & End Dates */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Offer Start Date
                  </label>
                  <input
                    type="date"
                    value={formStartDate}
                    onChange={(e) => setFormStartDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Offer Expiry Date
                  </label>
                  <input
                    type="date"
                    value={formEndDate}
                    onChange={(e) => setFormEndDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* In-Stock / Active Status */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="comboInStock"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-forest-950 accent-forest-950 cursor-pointer"
                />
                <label htmlFor="comboInStock" className="text-xs font-bold text-stone-800 cursor-pointer">
                  Activate immediately on Customer Shop Page and Checkout
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 font-black text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving to TiDB...</span>
                    </>
                  ) : (
                    <span>{editingComboId ? 'Update & Save to TiDB' : 'Create & Save to TiDB'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteModalOpen && comboToDelete && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-fadeIn select-none">
          <div className="bg-white w-full max-w-md rounded-3xl border border-stone-200 shadow-2xl p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-serif font-black text-lg text-stone-900">
                Delete Combo Offer?
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                Are you sure you want to delete <strong className="text-stone-900">"{comboToDelete.title}"</strong>? This will permanently remove this combo deal from TiDB and the customer Shop Page.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDeleteConfirm}
                className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Yes, Delete from TiDB
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
