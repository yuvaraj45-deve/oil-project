import React, { useState, useMemo } from 'react';
import {
  Gift,
  Plus,
  Search,
  Edit,
  Trash2,
  Check,
  X,
  ExternalLink,
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
} from 'lucide-react';
import { Product } from '../../types';
import { useStore } from '../../context/StoreContext';
import { autoTranslateProductNameToTamil } from '../../utils/productUtils';

interface ComboOffersManagerProps {
  onShowToast: (msg: string) => void;
  onBackToStore?: () => void;
}

const PRESET_COMBO_IMAGES = [
  { label: 'Sesame & Sunflower Trio', url: '/products/sesame_oil.jpg?v=ssoil' },
  { label: 'Coconut & Cold-Pressed', url: '/products/coconut_oil.jpg?v=ssoil' },
  { label: 'Groundnut Vaagai Mara Chekku', url: '/products/groundnut_oil.jpg?v=ssoil' },
  { label: 'Family 5L Can Deal', url: '/products/ss_oil_can.jpg?v=ssoil' },
  { label: 'Divine Pooja & Heritage', url: '/products/lamp_oil.jpg?v=ssoil' },
];

const PRESET_BADGES = [
  'Combo Offer',
  'Buy 2 Get 1 Free',
  'Festive Special',
  'Mega Bundle Savings',
  '18% OFF',
  'Limited Time Combo',
];

export const ComboOffersManager: React.FC<ComboOffersManagerProps> = ({
  onShowToast,
  onBackToStore,
}) => {
  const { products, addProduct, updateProduct, deleteProduct } = useStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterBadge, setFilterBadge] = useState('ALL');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingComboId, setEditingComboId] = useState<string | null>(null);

  // Delete confirmation modal state
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [comboToDelete, setComboToDelete] = useState<Product | null>(null);

  // Form fields
  const [formName, setFormName] = useState('');
  const [formTamilName, setFormTamilName] = useState('');
  const [isTamilManual, setIsTamilManual] = useState(false);
  const [formTagline, setFormTagline] = useState('');
  const [formPrice, setFormPrice] = useState<number | ''>(869);
  const [formMrp, setFormMrp] = useState<number | ''>(1060);
  const [formBadge, setFormBadge] = useState('Combo Offer');
  const [formPackSize, setFormPackSize] = useState('3 Litre Heritage Combo Box (1L x 3 Bottles)');
  const [formIncludedOils, setFormIncludedOils] = useState(
    '1L Sesame Oil + 1L Groundnut Oil + 1L Pure Coconut Oil in celebratory box'
  );
  const [formImage, setFormImage] = useState('/products/sesame_oil.jpg?v=ssoil');
  const [formInStock, setFormInStock] = useState(true);
  const [formError, setFormError] = useState('');

  // Extract combo products from store catalog
  const comboProducts = useMemo(() => {
    return products.filter((p) => {
      const isCat = p.category === 'combo-offers' || p.category === 'combo';
      const isBadge =
        p.badge?.toLowerCase().includes('combo') ||
        p.badge?.toLowerCase().includes('buy 2 get 1') ||
        p.badge?.toLowerCase().includes('b2g1');
      const isName =
        p.name.toLowerCase().includes('combo') ||
        p.name.toLowerCase().includes('buy 2 get 1') ||
        p.name.toLowerCase().includes('trio');
      return isCat || isBadge || isName;
    });
  }, [products]);

  // Filtered combo products based on search & badge
  const filteredCombos = useMemo(() => {
    return comboProducts.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.tamilName && c.tamilName.includes(searchTerm)) ||
        c.tagline?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.description?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesBadge =
        filterBadge === 'ALL' ||
        (c.badge && c.badge.toLowerCase() === filterBadge.toLowerCase());

      return matchesSearch && matchesBadge;
    });
  }, [comboProducts, searchTerm, filterBadge]);

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingComboId(null);
    setFormName('');
    setFormTamilName('');
    setIsTamilManual(false);
    setFormTagline('');
    setFormPrice(869);
    setFormMrp(1060);
    setFormBadge('Combo Offer');
    setFormPackSize('3 Litre Combo Pack');
    setFormIncludedOils('');
    setFormImage('/products/sesame_oil.jpg?v=ssoil');
    setFormInStock(true);
    setFormError('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (combo: Product) => {
    setEditingComboId(combo.id);
    setFormName(combo.name);
    setFormTamilName(combo.tamilName || '');
    setIsTamilManual(!!combo.tamilName);
    setFormTagline(combo.tagline || '');
    setFormPrice(combo.price);
    setFormMrp(combo.originalPrice || combo.price);
    setFormBadge(combo.badge || 'Combo Offer');
    setFormPackSize(combo.defaultPack || (combo.packSizes && combo.packSizes[0]) || '3 Litre Combo');
    setFormIncludedOils(combo.benefits?.join(', ') || combo.description || '');
    setFormImage(combo.image || '/products/sesame_oil.jpg?v=ssoil');
    setFormInStock(combo.inStock !== false);
    setFormError('');
    setIsModalOpen(true);
  };

  // Handle Form Submit (Create or Update)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFormError('Please enter a Combo Offer Name (காம்போ பெயர் தேவை)');
      return;
    }
    if (!formPrice || Number(formPrice) <= 0) {
      setFormError('Please enter a valid Offer Price (செல்லுபடியாகும் சலுகை விலை தேவை)');
      return;
    }

    const priceNum = Number(formPrice);
    const mrpNum = formMrp ? Number(formMrp) : priceNum;
    const discountPercent =
      mrpNum > priceNum ? Math.round(((mrpNum - priceNum) / mrpNum) * 100) : 0;

    const resolvedTamil =
      formTamilName.trim() || autoTranslateProductNameToTamil(formName, 'combo-offers');

    const benefitsArray = formIncludedOils
      .split(/[,•\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    if (benefitsArray.length === 0) {
      benefitsArray.push(formTagline || formName);
    }

    if (editingComboId) {
      // Update existing combo
      const existing = comboProducts.find((p) => p.id === editingComboId);
      const updatedProduct: Product = {
        ...(existing || {}),
        id: editingComboId,
        name: formName.trim(),
        tamilName: resolvedTamil,
        tagline: formTagline.trim() || 'Special Wood-Pressed Combo Offer Pack',
        category: 'combo-offers',
        categoryName: 'Combo Offers',
        price: priceNum,
        originalPrice: mrpNum,
        discountPercent: discountPercent,
        rating: existing?.rating || 5.0,
        reviewsCount: existing?.reviewsCount || 150,
        packSizes: [formPackSize.trim() || '3 Litre Combo Box'],
        defaultPack: formPackSize.trim() || '3 Litre Combo Box',
        image: formImage.trim() || '/products/sesame_oil.jpg?v=ssoil',
        badge: formBadge,
        description:
          formIncludedOils.trim() ||
          `Special Combo Offer featuring authentic wood-pressed oils. Save ${discountPercent}% instantly!`,
        benefits: benefitsArray,
        inStock: formInStock,
        featured: true,
      };

      await updateProduct(updatedProduct);
      onShowToast(`Combo Offer "${formName}" updated successfully! (காம்போ மாற்றப்பட்டது)`);
    } else {
      // Create new combo
      const newId = `combo-${Date.now()}`;
      const newProduct: Product = {
        id: newId,
        name: formName.trim(),
        tamilName: resolvedTamil,
        tagline: formTagline.trim() || 'Special Wood-Pressed Combo Offer Pack',
        category: 'combo-offers',
        categoryName: 'Combo Offers',
        price: priceNum,
        originalPrice: mrpNum,
        discountPercent: discountPercent,
        rating: 5.0,
        reviewsCount: 1,
        packSizes: [formPackSize.trim() || '3 Litre Combo Box'],
        defaultPack: formPackSize.trim() || '3 Litre Combo Box',
        image: formImage.trim() || '/products/sesame_oil.jpg?v=ssoil',
        badge: formBadge,
        description:
          formIncludedOils.trim() ||
          `Special Combo Offer featuring authentic wood-pressed oils. Save ${discountPercent}% instantly!`,
        benefits: benefitsArray,
        inStock: formInStock,
        featured: true,
      };

      await addProduct(newProduct);
      onShowToast(`New Combo Offer "${formName}" created & published to Store! (புதிய காம்போ சேர்க்கப்பட்டது)`);
    }

    setIsModalOpen(false);
  };

  // Toggle Stock Status
  const handleToggleStock = async (combo: Product) => {
    const updated = { ...combo, inStock: !combo.inStock };
    await updateProduct(updated);
    onShowToast(
      `Stock status updated for ${combo.name}: ${!combo.inStock ? 'In Stock' : 'Out of Stock'}`
    );
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!comboToDelete) return;
    await deleteProduct(comboToDelete.id);
    onShowToast(`Combo offer "${comboToDelete.name}" removed from catalog.`);
    setDeleteModalOpen(false);
    setComboToDelete(null);
  };

  // Upload image handler
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('File size exceeds 2MB limit. Please choose a smaller image.');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6 select-none">
      {/* 1. Header Banner & Action Bar */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-forest-950 via-[#132c19] to-emerald-950 text-white relative overflow-hidden shadow-xl border border-emerald-900/40">
        <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
          <Gift className="w-80 h-80 text-gold-400" />
        </div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gold-400/20 text-gold-300 border border-gold-400/30 text-[11px] font-bold uppercase tracking-wider">
              <Gift className="w-3.5 h-3.5" />
              <span>காம்போ சலுகைகள் நிர்வாகம் • Combo Packs & Bundles</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-black text-white leading-tight">
              SS Oil Combo Offers Management
            </h2>
            <p className="text-xs sm:text-sm text-stone-300 leading-relaxed">
              Create, customize, and publish bundled oil deals like{' '}
              <strong className="text-gold-300">Heritage Multi-Oil Trio</strong> and{' '}
              <strong className="text-gold-300">Buy 2 Get 1 Free</strong> packs. Customers can browse
              and buy these directly on the store catalog with instant bundle discounts.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleOpenCreateModal}
              className="px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-500 hover:to-amber-700 text-stone-950 font-black text-xs sm:text-sm shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center gap-2 transform active:scale-95"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>+ Create Combo Offer (புதிய காம்போ சேர்)</span>
            </button>

            <a
              href="/shop"
              target="_blank"
              rel="noreferrer"
              className="px-4 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs transition-all border border-white/10 flex items-center gap-2 cursor-pointer backdrop-blur-xs"
            >
              <Eye className="w-4 h-4" />
              <span>View Store Catalog</span>
            </a>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/10">
          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Total Combo Offers
            </div>
            <div className="font-serif text-2xl font-black text-white mt-0.5">
              {comboProducts.length}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              In Stock & Active
            </div>
            <div className="font-serif text-2xl font-black text-emerald-400 mt-0.5">
              {comboProducts.filter((c) => c.inStock !== false).length}
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Max Bundle Savings
            </div>
            <div className="font-serif text-2xl font-black text-amber-300 mt-0.5">
              Up to 33% OFF
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-xs p-3.5 rounded-2xl border border-white/10">
            <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
              Store Category
            </div>
            <div className="text-xs font-black text-white mt-1.5 flex items-center gap-1.5 truncate">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>combo-offers</span>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 p-4 bg-white rounded-2xl border border-stone-200 shadow-xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search combo offers by name, Tamil name, or included oils..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs font-medium focus:outline-none focus:border-forest-900 focus:ring-1 focus:ring-forest-900 bg-stone-50/50"
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

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0">
            Filter:
          </span>
          {['ALL', 'Combo Offer', 'Buy 2 Get 1 Free', 'Festive Special'].map((badge) => (
            <button
              key={badge}
              onClick={() => setFilterBadge(badge)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                filterBadge === badge
                  ? 'bg-forest-950 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {badge}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Combo Offers Grid */}
      {filteredCombos.length === 0 ? (
        <div className="p-12 text-center bg-white rounded-3xl border border-dashed border-stone-300 space-y-4">
          <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
            <Gift className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1">
            <h3 className="font-serif font-black text-lg text-stone-800">
              No Combo Offers Found
            </h3>
            <p className="text-xs text-stone-500">
              {searchTerm || filterBadge !== 'ALL'
                ? 'Try adjusting your search query or filters to find combo packs.'
                : 'No combo offers have been configured yet. Click the button below to create your first combo deal!'}
            </p>
          </div>
          <button
            onClick={handleOpenCreateModal}
            className="px-5 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-white font-bold text-xs transition-all inline-flex items-center gap-2 cursor-pointer shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Create First Combo Offer</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredCombos.map((combo) => {
            const savings =
              combo.originalPrice && combo.originalPrice > combo.price
                ? combo.originalPrice - combo.price
                : 0;

            return (
              <div
                key={combo.id}
                className="bg-white rounded-3xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all overflow-hidden flex flex-col justify-between"
              >
                {/* Top Section */}
                <div className="p-5 space-y-4">
                  <div className="flex items-start gap-4">
                    {/* Image Preview */}
                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 shrink-0 relative group">
                      <img
                        src={combo.image || '/products/sesame_oil.jpg?v=ssoil'}
                        alt={combo.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/products/sesame_oil.jpg?v=ssoil';
                        }}
                      />
                      {combo.badge && (
                        <div className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider bg-amber-400 text-forest-950 shadow-xs">
                          {combo.badge}
                        </div>
                      )}
                    </div>

                    {/* Content Details */}
                    <div className="flex-1 min-w-0 space-y-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                          {combo.categoryName || 'Combo Offer'}
                        </span>
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              combo.inStock !== false ? 'bg-emerald-500' : 'bg-red-500'
                            }`}
                          />
                          <span className="text-[11px] font-bold text-stone-500">
                            {combo.inStock !== false ? 'In Stock' : 'Out of Stock'}
                          </span>
                        </div>
                      </div>

                      <h3 className="font-serif font-black text-base sm:text-lg text-forest-950 leading-snug line-clamp-2">
                        {combo.name}
                      </h3>

                      {combo.tamilName && (
                        <p className="text-xs font-bold text-amber-900 line-clamp-1">
                          {combo.tamilName}
                        </p>
                      )}

                      <p className="text-xs text-stone-500 line-clamp-2 pt-0.5">
                        {combo.tagline || combo.description}
                      </p>
                    </div>
                  </div>

                  {/* Included Items Pills */}
                  {combo.benefits && combo.benefits.length > 0 && (
                    <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-amber-200/60 space-y-1.5">
                      <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
                        <Boxes className="w-3 h-3 text-amber-700" />
                        <span>Included In This Combo Pack:</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {combo.benefits.map((benefit, idx) => (
                          <span
                            key={idx}
                            className="inline-flex items-center gap-1 text-[11px] font-semibold text-forest-950 bg-white px-2.5 py-1 rounded-xl border border-stone-200 shadow-2xs"
                          >
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>{benefit}</span>
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Price & Savings Display */}
                  <div className="flex items-baseline justify-between pt-2 border-t border-stone-100">
                    <div>
                      <div className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                        Combo Deal Price
                      </div>
                      <div className="flex items-baseline gap-2 mt-0.5">
                        <span className="font-serif text-2xl font-black text-forest-950">
                          ₹{combo.price}
                        </span>
                        {combo.originalPrice && combo.originalPrice > combo.price && (
                          <span className="text-sm font-bold text-stone-400 line-through">
                            MRP ₹{combo.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {savings > 0 && (
                      <div className="text-right">
                        <span className="px-2.5 py-1 rounded-xl bg-emerald-100 text-emerald-900 font-black text-xs inline-block">
                          Save ₹{savings} ({combo.discountPercent || Math.round((savings / (combo.originalPrice || combo.price)) * 100)}% OFF)
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleToggleStock(combo)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                      combo.inStock !== false
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 hover:bg-emerald-100'
                        : 'bg-red-50 text-red-800 border-red-300 hover:bg-red-100'
                    }`}
                  >
                    {combo.inStock !== false ? '✓ Active & In Stock' : '✕ Out of Stock'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleOpenEditModal(combo)}
                      className="px-3 py-1.5 rounded-xl bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold transition-all border border-stone-200 shadow-2xs flex items-center gap-1 cursor-pointer"
                    >
                      <Edit className="w-3.5 h-3.5 text-stone-600" />
                      <span>Edit</span>
                    </button>

                    <button
                      onClick={() => {
                        setComboToDelete(combo);
                        setDeleteModalOpen(true);
                      }}
                      className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 transition-all cursor-pointer"
                      title="Delete Combo Offer"
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

      {/* ============================================================ */}
      {/* CREATE / EDIT COMBO OFFER MODAL                              */}
      {/* ============================================================ */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                  Combo Offers Manager (காம்போ சலுகைகள்)
                </span>
                <h3 className="font-serif font-black text-xl text-forest-950">
                  {editingComboId ? 'Edit Combo Offer' : 'Create New Combo Offer (புதிய காம்போ)'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-lg hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                <span className="font-semibold">{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Combo Name (English & Tamil) */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Combo Title (English) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formName}
                    onChange={(e) => {
                      const val = e.target.value;
                      setFormName(val);
                      if (!isTamilManual) {
                        setFormTamilName(autoTranslateProductNameToTamil(val, 'combo-offers'));
                      }
                    }}
                    placeholder="e.g. Mara Chekku Heritage Trio Combo"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold focus:outline-none focus:border-forest-900 bg-white"
                  />
                </div>

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="block text-xs font-semibold text-stone-700">
                      Tamil Name (தமிழ் பெயர்)
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        const translated = autoTranslateProductNameToTamil(formName, 'combo-offers');
                        setFormTamilName(translated);
                        setIsTamilManual(false);
                      }}
                      className="text-[10px] font-bold text-amber-700 hover:text-amber-800 underline cursor-pointer"
                    >
                      தானாக மொழிபெயர் 🔄
                    </button>
                  </div>
                  <input
                    type="text"
                    value={formTamilName}
                    onChange={(e) => {
                      setIsTamilManual(true);
                      setFormTamilName(e.target.value);
                    }}
                    placeholder="மரச்செக்கு ஹெரிட்டேஜ் காம்போ"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-bold focus:outline-none focus:border-forest-900 bg-white"
                  />
                </div>
              </div>

              {/* Tagline / Subtitle */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Tagline / Highlights <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTagline}
                  onChange={(e) => setFormTagline(e.target.value)}
                  placeholder="e.g. 1L Sesame Oil + 1L Groundnut Oil + 1L Pure Coconut Oil in celebratory box"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                />
              </div>

              {/* Pricing & MRP */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200/70">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Combo Offer Price (₹) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={1}
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="869"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-black text-forest-950 focus:outline-none focus:border-forest-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Original MRP (₹)
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={formMrp}
                    onChange={(e) => setFormMrp(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="1060"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-600 focus:outline-none focus:border-forest-900 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Calculated Savings
                  </label>
                  <div className="px-3.5 py-2 rounded-xl bg-white border border-stone-200 text-xs font-black text-emerald-700">
                    {formPrice && formMrp && Number(formMrp) > Number(formPrice)
                      ? `Save ₹${Number(formMrp) - Number(formPrice)} (${Math.round(
                          ((Number(formMrp) - Number(formPrice)) / Number(formMrp)) * 100
                        )}% OFF)`
                      : 'Regular Price'}
                  </div>
                </div>
              </div>

              {/* Badge & Pack Size */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Offer Badge Tag (பேட்ஜ்)
                  </label>
                  <select
                    value={formBadge}
                    onChange={(e) => setFormBadge(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-bold focus:outline-none focus:border-forest-900 bg-white"
                  >
                    {PRESET_BADGES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Pack Format / Size Label
                  </label>
                  <input
                    type="text"
                    value={formPackSize}
                    onChange={(e) => setFormPackSize(e.target.value)}
                    placeholder="e.g. 3 Litre Heritage Combo Box (1L x 3 Bottles)"
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                  />
                </div>
              </div>

              {/* Included Items Details */}
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Included Items & Bundle Benefits (Separate with commas)
                </label>
                <textarea
                  rows={2}
                  value={formIncludedOils}
                  onChange={(e) => setFormIncludedOils(e.target.value)}
                  placeholder="e.g. 1L Sesame Oil, 1L Groundnut Oil, 1L Pure Coconut Oil, Includes complimentary cotton wicks"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                />
              </div>

              {/* Image Picker */}
              <div className="space-y-2 p-3.5 rounded-2xl bg-stone-50 border border-stone-200">
                <label className="block text-xs font-bold text-stone-700">
                  Combo Image (படம்)
                </label>
                <div className="flex items-center gap-3">
                  <div className="w-16 h-16 rounded-xl overflow-hidden border border-stone-300 shrink-0 bg-white">
                    <img
                      src={formImage || '/products/sesame_oil.jpg?v=ssoil'}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <label className="px-3 py-1.5 rounded-xl bg-forest-950 text-white text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 shadow-2xs">
                        <Upload className="w-3.5 h-3.5 text-gold-400" />
                        <span>Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageUpload}
                        />
                      </label>
                      <span className="text-[11px] text-stone-400">or choose preset below:</span>
                    </div>

                    <input
                      type="text"
                      value={formImage}
                      onChange={(e) => setFormImage(e.target.value)}
                      placeholder="Image URL"
                      className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                    />
                  </div>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {PRESET_COMBO_IMAGES.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => setFormImage(preset.url)}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold bg-white hover:bg-stone-100 border border-stone-200 text-stone-700 cursor-pointer"
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* In Stock Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="comboInStock"
                  checked={formInStock}
                  onChange={(e) => setFormInStock(e.target.checked)}
                  className="w-4 h-4 accent-emerald-700 cursor-pointer"
                />
                <label htmlFor="comboInStock" className="text-xs font-bold text-stone-800 cursor-pointer">
                  In Stock & Published on Store Catalog (கடையில் உடனடியாகக் காட்டவும்)
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#1e7e34] to-emerald-800 hover:from-[#1b6d2e] hover:to-emerald-900 text-white text-xs font-black transition-all cursor-pointer shadow-md flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingComboId ? 'Update Combo Offer' : 'Publish Combo Offer'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* DELETE CONFIRMATION MODAL                                    */}
      {/* ============================================================ */}
      {deleteModalOpen && comboToDelete && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-md rounded-3xl p-6 border border-stone-200 shadow-2xl space-y-4 animate-fadeIn">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-serif font-black text-lg text-stone-900">
                Delete Combo Offer?
              </h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Are you sure you want to delete{' '}
                <strong className="text-stone-800">"{comboToDelete.name}"</strong>? This will remove
                it from the customer store catalog.
              </p>
            </div>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                onClick={() => {
                  setDeleteModalOpen(false);
                  setComboToDelete(null);
                }}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black cursor-pointer shadow-sm"
              >
                Yes, Delete Combo
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
