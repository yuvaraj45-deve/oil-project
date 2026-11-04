import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  List,
  Layers,
  Users,
  Package,
  Settings,
  Search,
  CheckCircle,
  Clock,
  DollarSign,
  TrendingUp,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  LogOut,
  Plus,
  Trash2,
  Edit,
  Eye,
  Download,
  Phone,
  Mail,
  MapPin,
  Shield,
  ShieldCheck,
  ChevronRight,
  AlertCircle,
  Save,
  Check,
  ToggleLeft,
  ToggleRight,
  Filter,
  X,
  Upload,
  Camera,
  Image as ImageIcon,
  CheckSquare,
  Square,
  Bell,
  CreditCard,
  Truck,
  Store,
  Palette,
  Tag,
  FileText,
  Home,
  ShoppingCart,
  Globe,
  Video,
  Play,
  Film,
  Star,
  Droplets,
} from 'lucide-react';
import {
  PlacedOrder,
  Product,
  Category,
  UserProfile,
  StoreSettings,
  HomeFeaturedVideo,
  DEFAULT_HOME_FEATURED_VIDEO,
  ReelStory,
  DEFAULT_REELS_DATA,
  StandingBottleItem,
  DEFAULT_STANDING_BOTTLES,
} from '../types';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '../data/oilData';
import { useStore, normalizeHomepage4 } from '../context/StoreContext';
import { getYouTubeEmbedUrl } from './HomeFeaturedVideoBanner';

interface AdminPageProps {
  orders: PlacedOrder[];
  onUpdateOrderStatus: (orderId: string, newStatus: PlacedOrder['orderStatus']) => void;
  onBackToStore: () => void;
  onLogout?: () => void;
}

// User Record Type for User Login List
interface UserRecord {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'admin' | 'customer';
  memberTier: 'Platinum Member' | 'Gold Member' | 'Silver Member';
  purityPoints: number;
  lastLogin: string;
  status: 'Active' | 'Inactive';
  totalOrders: number;
  totalSpent: number;
  address?: string;
  city?: string;
  pincode?: string;
  isVerified?: boolean;
}

// Preset High Quality Oil Images for Categories
const PRESET_IMAGES = [
  {
    name: 'Sesame Oil',
    url: '/products/sesame_oil.jpg',
  },
  {
    name: 'Groundnut Oil',
    url: '/products/groundnut_oil.jpg',
  },
  {
    name: 'Coconut Oil',
    url: '/products/coconut_oil.jpg',
  },
  {
    name: 'Cooking Oil',
    url: '/products/groundnut_oil.jpg',
  },
  {
    name: 'Sunflower Oil',
    url: '/products/sunflower_oil.jpg',
  },
  {
    name: 'Mustard Oil',
    url: '/products/mustard_oil.jpg',
  },
  {
    name: 'Pooja Deepam Oil',
    url: '/products/lamp_oil.jpg',
  },
  {
    name: 'Rice Bran Oil',
    url: '/products/rice_bran_oil.jpg',
  },
];

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : '');

export const AdminPage: React.FC<AdminPageProps> = ({
  orders,
  onUpdateOrderStatus,
  onBackToStore,
  onLogout,
}) => {
  // Admin Tab Navigation (default to 'products' and remember tab across reloads)
  type AdminTab =
    | 'dashboard'
    | 'products'
    | 'orders'
    | 'customers'
    | 'users'
    | 'categories'
    | 'videos'
    | 'offers'
    | 'content'
    | 'settings'
    | 'analytics';
  const [activeTab, setActiveTab] = useState<AdminTab>(() => {
    try {
      const saved = sessionStorage.getItem('admin_active_tab') as AdminTab;
      if (saved && (saved as string) !== 'featured-products' && (saved as string) !== 'bottles') return saved;
    } catch {}
    return 'dashboard';
  });

  const handleTabChange = (tab: AdminTab) => {
    setActiveTab(tab);
    try {
      sessionStorage.setItem('admin_active_tab', tab);
    } catch {}
  };

  // Settings Sub-Navigation Tabs (Appearance, Notifications, SEO removed per request)
  type SettingsSubTab =
    | 'store'
    | 'payment'
    | 'shipping'
    | 'system';
  const [settingsSubTab, setSettingsSubTab] = useState<SettingsSubTab>('store');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // 1. DATA: Live Store Context Connection (Single Source of Truth)
  // -------------------------------------------------------------
  const {
    settings: storeSettings,
    updateSettings: updateStoreSettings,
    products: storeProducts,
    categories: storeCategories,
    updateProduct: contextUpdateProduct,
    addProduct: contextAddProduct,
    deleteProduct: contextDeleteProduct,
    updateCategory: contextUpdateCategory,
    addCategory: contextAddCategory,
    deleteCategory: contextDeleteCategory,
    homeFeaturedVideo,
    updateHomeFeaturedVideo,
    reels: storeReels,
    addReel: contextAddReel,
    updateReel: contextUpdateReel,
    deleteReel: contextDeleteReel,
    resetReels: contextResetReels,
    standingBottles: storeStandingBottles,
    updateStandingBottles: storeUpdateStandingBottles,
    refreshData: storeRefreshData,
  } = useStore();

  const [bottlesList, setBottlesList] = useState<StandingBottleItem[]>(() => {
    return storeStandingBottles && storeStandingBottles.length > 0
      ? storeStandingBottles
      : DEFAULT_STANDING_BOTTLES;
  });

  useEffect(() => {
    if (storeStandingBottles && storeStandingBottles.length > 0) {
      setBottlesList(storeStandingBottles);
    }
  }, [storeStandingBottles]);

  const reelsList = storeReels && storeReels.length > 0 ? storeReels : DEFAULT_REELS_DATA;

  const productsList = storeProducts && storeProducts.length > 0 ? storeProducts : PRODUCTS_DATA;
  const categoriesList = storeCategories && storeCategories.length > 0 ? storeCategories : CATEGORIES_DATA;

  // Refresh live data on mount
  useEffect(() => {
    storeRefreshData();
  }, [storeRefreshData]);

  // Common Pack Size Options for Oils
  const ALL_PACK_OPTIONS = [
    '500 ml Bottle',
    '1 Litre Bottle',
    '1 Litre Glass Jar',
    '1 Litre Pouch',
    '2 Litre Bottle',
    '2 Litre Can',
    '5 Litre Can',
    '5 Litre Tin',
    '15 Litre Tin',
  ];

  // Canvas-based image resizer and optimizer (preserves 100% transparent PNGs & aspect ratios)
  const resizeImageFile = (file: File, maxDim = 800): Promise<string> => {
    return new Promise((resolve, reject) => {
      const isPng = file.type === 'image/png' || file.name.toLowerCase().endsWith('.png');
      const isWebp = file.type === 'image/webp' || file.name.toLowerCase().endsWith('.webp');

      // If file is already small (< 1MB) and is PNG, read directly to preserve 100% crispness & transparency
      if (file.size < 1024 * 1024 && isPng) {
        const directReader = new FileReader();
        directReader.onload = (e) => resolve(e.target?.result as string);
        directReader.onerror = () => reject(new Error('Failed to read image file'));
        directReader.readAsDataURL(file);
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(img, 0, 0, width, height);
            if (isPng) {
              resolve(canvas.toDataURL('image/png'));
            } else if (isWebp) {
              resolve(canvas.toDataURL('image/webp', 0.88));
            } else {
              resolve(canvas.toDataURL('image/jpeg', 0.85));
            }
          } else {
            resolve(e.target?.result as string);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target?.result as string;
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  // Image Upload helper (FileReader -> Canvas Optimized DataURL)
  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageCallback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const optimized = await resizeImageFile(file, 800);
        setImageCallback(optimized);
        showToast('Image uploaded and ready! 📸');
      } catch (err) {
        console.error('Image upload error:', err);
        showToast('Failed to load image file. Please try another.');
      } finally {
        e.target.value = ''; // Reset input so same file can be re-selected
      }
    }
  };

  // -------------------------------------------------------------
  // CUSTOM STANDING BOTTLE ADD STATE & HANDLERS
  // -------------------------------------------------------------
  const [isAddBottleModalOpen, setIsAddBottleModalOpen] = useState(false);
  const [newBottleName, setNewBottleName] = useState('');
  const [newBottleTamilName, setNewBottleTamilName] = useState('');
  const [newBottleImage, setNewBottleImage] = useState('/products/sesame_oil.png');
  const [newBottleSlug, setNewBottleSlug] = useState('sesame-oil');

  const handleSaveNewBottle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newBottleName.trim()) {
      showToast('Please enter a bottle name!');
      return;
    }
    const newBottle: StandingBottleItem = {
      id: `bottle-${Date.now()}`,
      name: newBottleName.trim(),
      tamilName: newBottleTamilName.trim() || undefined,
      slug: newBottleSlug,
      image: newBottleImage || '/products/sesame_oil.png',
      enabled: true,
    };
    const updated = [...bottlesList, newBottle];
    setBottlesList(updated);
    storeUpdateStandingBottles(updated);
    setIsAddBottleModalOpen(false);
    setNewBottleName('');
    setNewBottleTamilName('');
    setNewBottleImage('/products/sesame_oil.png');
    showToast(`Your bottle "${newBottle.name}" was added to Homepage! 🍾✨`);
  };

  // -------------------------------------------------------------
  // EDIT STANDING BOTTLE STATE & HANDLERS
  // -------------------------------------------------------------
  const [editingBottle, setEditingBottle] = useState<StandingBottleItem | null>(null);
  const [editBottleName, setEditBottleName] = useState('');
  const [editBottleTamilName, setEditBottleTamilName] = useState('');
  const [editBottleImage, setEditBottleImage] = useState('');
  const [editBottleSlug, setEditBottleSlug] = useState('');
  const [editBottleEnabled, setEditBottleEnabled] = useState(true);

  const openEditBottle = (bottle: StandingBottleItem) => {
    setEditingBottle(bottle);
    setEditBottleName(bottle.name);
    setEditBottleTamilName(bottle.tamilName || '');
    setEditBottleImage(bottle.image);
    setEditBottleSlug(bottle.slug);
    setEditBottleEnabled(bottle.enabled !== false);
  };

  const handleSaveEditBottle = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBottle) return;
    const updated = bottlesList.map((b) =>
      b.id === editingBottle.id
        ? {
            ...b,
            name: editBottleName.trim(),
            tamilName: editBottleTamilName.trim() || undefined,
            image: editBottleImage.trim() || b.image,
            slug: editBottleSlug,
            enabled: editBottleEnabled,
          }
        : b
    );
    setBottlesList(updated);
    storeUpdateStandingBottles(updated);
    setEditingBottle(null);
    showToast(`Bottle "${editBottleName}" updated successfully! ✨`);
  };

  // -------------------------------------------------------------
  // CATEGORY EDIT STATE & HANDLERS
  // -------------------------------------------------------------
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCatTitle, setEditCatTitle] = useState('');
  const [editCatTamilTitle, setEditCatTamilTitle] = useState('');
  const [editCatSubtitle, setEditCatSubtitle] = useState('');
  const [editCatBadge, setEditCatBadge] = useState('');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [editCatImage, setEditCatImage] = useState('');
  const [editCatAssignedProductIds, setEditCatAssignedProductIds] = useState<string[]>([]);

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setEditCatTitle(cat.title);
    setEditCatTamilTitle(cat.tamilTitle || cat.title || '');
    setEditCatSubtitle(cat.subtitle);
    setEditCatBadge(cat.badge);
    setEditCatSlug(cat.slug);
    setEditCatImage(cat.image);
    const assignedIds = productsList
      .filter((p) => p.category === cat.slug)
      .map((p) => p.id);
    setEditCatAssignedProductIds(assignedIds);
  };

  const handleToggleProductInEdit = (productId: string) => {
    setEditCatAssignedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleSaveEditCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingCategory || !editCatTitle.trim()) return;

    const updatedSlug =
      editCatSlug.trim() || editCatTitle.toLowerCase().replace(/\s+/g, '-');

    const updatedCategory: Category = {
      ...editingCategory,
      title: editCatTitle.trim(),
      tamilTitle: editCatTamilTitle.trim() || editCatTitle.trim(),
      subtitle: editCatSubtitle.trim(),
      badge: editCatBadge.trim() || 'Cold-Pressed',
      slug: updatedSlug,
      image: editCatImage || '/products/sesame_oil.jpg',
      itemCount: `${editCatAssignedProductIds.length} Varieties`,
    };

    // Reassign products if category changed
    editCatAssignedProductIds.forEach((pid) => {
      const prod = productsList.find((p) => p.id === pid);
      if (prod) {
        contextUpdateProduct({
          ...prod,
          category: updatedSlug as any,
          categoryName: updatedCategory.title,
        });
      }
    });

    // Sync to TiDB Cloud backend
    if (API_BASE_URL) {
      try {
        await fetch(`${API_BASE_URL}/api/products/categories/${editingCategory.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: updatedCategory.title,
            slug: updatedCategory.slug,
            description: updatedCategory.subtitle,
            image: updatedCategory.image,
          }),
        });
      } catch (err) {
        console.error('Failed to sync category update to database:', err);
      }
    }

    setEditingCategory(null);
    await contextUpdateCategory(updatedCategory);
    showToast(`Category "${updatedCategory.title}" updated successfully!`);
  };

  // ADD CATEGORY STATE & HANDLERS
  const [isAddCategoryOpen, setIsAddCategoryOpen] = useState(false);
  const [newCatTitle, setNewCatTitle] = useState('');
  const [newCatSubtitle, setNewCatSubtitle] = useState('');
  const [newCatBadge, setNewCatBadge] = useState('');
  const [newCatSlug, setNewCatSlug] = useState('');
  const [newCatImage, setNewCatImage] = useState('/products/sesame_oil.jpg');
  const [newCatAssignedProductIds, setNewCatAssignedProductIds] = useState<string[]>([]);

  const handleToggleProductInNew = (productId: string) => {
    setNewCatAssignedProductIds((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatTitle.trim()) return;

    const slug =
      newCatSlug.trim() || newCatTitle.toLowerCase().replace(/\s+/g, '-');

    let createdId = `cat-${Date.now()}`;

    // Sync to TiDB Cloud backend
    try {
      const res = await fetch(`${API_BASE_URL}/api/products/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCatTitle.trim(),
          slug,
          description: newCatSubtitle.trim() || 'Traditional cold-pressed quality oil',
          image: newCatImage || '/products/sesame_oil.jpg',
        }),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.data?.id) {
          createdId = resData.data.id;
        }
      }
    } catch (err) {
      console.error('Failed to create category in database:', err);
    }

    const newCategory: Category = {
      id: createdId,
      slug,
      title: newCatTitle.trim(),
      subtitle: newCatSubtitle.trim() || 'Traditional cold-pressed quality oil',
      image: newCatImage || '/products/sesame_oil.jpg',
      itemCount: `${newCatAssignedProductIds.length} Varieties`,
      badge: newCatBadge.trim() || 'New Arrival',
      highlightText: 'Fresh Mara Chekku Mill Production',
    };

    await contextAddCategory(newCategory);

    if (newCatAssignedProductIds.length > 0) {
      newCatAssignedProductIds.forEach((pid) => {
        const prod = productsList.find((p) => p.id === pid);
        if (prod) {
          contextUpdateProduct({
            ...prod,
            category: slug as any,
            categoryName: newCategory.title,
          });
        }
      });
    }

    if (isAddProductOpen) {
      setNewProdCategory(slug);
    }
    if (editingProduct) {
      setEditProdCategory(slug);
    }

    setIsAddCategoryOpen(false);
    setNewCatTitle('');
    setNewCatSubtitle('');
    setNewCatBadge('');
    setNewCatSlug('');
    setNewCatImage('/products/sesame_oil.jpg');
    setNewCatAssignedProductIds([]);
    showToast(`Category "${newCategory.title}" created successfully! 🏷️`);
  };

  const handleDeleteCategory = async (catId: string) => {
    const catToDelete = categoriesList.find((c) => c.id === catId || c.slug === catId);
    await contextDeleteCategory(catId);

    if (API_BASE_URL) {
      try {
        await fetch(`${API_BASE_URL}/api/products/categories/${catId}`, {
          method: 'DELETE',
        });
      } catch (err) {
        console.error('Failed to delete category from database:', err);
      }
    }

    showToast(`Category "${catToDelete?.title || 'Selected'}" deleted.`);
  };

  // -------------------------------------------------------------
  // PRODUCT EDIT & CREATE STATE & HANDLERS
  // -------------------------------------------------------------
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdTamilName, setEditProdTamilName] = useState('');
  const [editProdTagline, setEditProdTagline] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('');
  const [editProdPrice, setEditProdPrice] = useState<number>(0);
  const [editProdOriginalPrice, setEditProdOriginalPrice] = useState<number>(0);
  const [editProdDefaultPack, setEditProdDefaultPack] = useState('1 Litre Bottle');
  const [editProdPackSizes, setEditProdPackSizes] = useState<string[]>([]);
  const [editCustomPackInput, setEditCustomPackInput] = useState('');
  const [editProdImage, setEditProdImage] = useState('');
  const [editProdBadge, setEditProdBadge] = useState('');
  const [editProdSmokePoint, setEditProdSmokePoint] = useState('');
  const [editProdExtraction, setEditProdExtraction] = useState('');
  const [editProdDescription, setEditProdDescription] = useState('');
  const [editProdInStock, setEditProdInStock] = useState(true);
  const [editProdFeatured, setEditProdFeatured] = useState(false);

  const openEditProduct = (prod: Product) => {
    setEditingProduct(prod);
    setEditProdName(prod.name);
    setEditProdTamilName(prod.tamilName || prod.name || '');
    setEditProdTagline(prod.tagline || '');
    setEditProdCategory(prod.category);
    setEditProdPrice(prod.price);
    setEditProdOriginalPrice(prod.originalPrice || prod.price);
    setEditProdDefaultPack(prod.defaultPack || '1 Litre Bottle');
    setEditProdPackSizes(prod.packSizes && prod.packSizes.length > 0 ? prod.packSizes : ['1 Litre Bottle']);
    setEditProdImage(prod.image);
    setEditProdBadge(prod.badge || '');
    setEditProdSmokePoint(prod.smokePoint || '220°C');
    setEditProdExtraction(prod.extractionMethod || 'Traditional Cold-Pressed Mara Chekku');
    setEditProdDescription(prod.description || '');
    setEditProdInStock(prod.inStock);
    setEditProdFeatured(Boolean(prod.featured));
  };

  const handleTogglePackSizeInEdit = (pack: string) => {
    setEditProdPackSizes((prev) =>
      prev.includes(pack) ? prev.filter((p) => p !== pack) : [...prev, pack]
    );
  };

  const handleAddCustomPackSizeEdit = () => {
    const trimmed = editCustomPackInput.trim();
    if (!trimmed) return;
    if (!editProdPackSizes.includes(trimmed)) {
      setEditProdPackSizes((prev) => [...prev, trimmed]);
      if (!editProdDefaultPack) setEditProdDefaultPack(trimmed);
    }
    setEditCustomPackInput('');
  };

  const handleRemovePackSizeEdit = (sizeToRemove: string) => {
    setEditProdPackSizes((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProdName.trim()) return;

    const matchedCat = categoriesList.find((c) => c.slug === editProdCategory);
    const updatedProduct: Product = {
      ...editingProduct,
      name: editProdName.trim(),
      tamilName: editProdTamilName.trim() || editProdName.trim(),
      tagline: editProdTagline.trim(),
      category: editProdCategory,
      categoryName: matchedCat?.title || editingProduct.categoryName,
      price: Number(editProdPrice),
      originalPrice: Number(editProdOriginalPrice),
      discountPercent:
        editProdOriginalPrice > editProdPrice
          ? Math.round(((editProdOriginalPrice - editProdPrice) / editProdOriginalPrice) * 100)
          : 0,
      defaultPack: editProdDefaultPack,
      packSizes: editProdPackSizes.length > 0 ? editProdPackSizes : ['1 Litre Bottle'],
      image: editProdImage || '/products/sesame_oil.jpg',
      badge: editProdBadge || undefined,
      smokePoint: editProdSmokePoint,
      extractionMethod: editProdExtraction,
      description: editProdDescription,
      inStock: editProdInStock,
      featured: editProdFeatured,
    };

    setEditingProduct(null);
    await contextUpdateProduct(updatedProduct);

    // Sync homepage selection with featured toggle
    if (editProdFeatured && !currentHomepageProductIds.includes(updatedProduct.id)) {
      const nextIds = [...currentHomepageProductIds, updatedProduct.id];
      setSettings((prev) => ({ ...prev, homepageProductIds: nextIds }));
      updateStoreSettings({ homepageProductIds: nextIds });
    } else if (!editProdFeatured && currentHomepageProductIds.includes(updatedProduct.id)) {
      const nextIds = currentHomepageProductIds.filter((id) => id !== updatedProduct.id);
      setSettings((prev) => ({ ...prev, homepageProductIds: nextIds }));
      updateStoreSettings({ homepageProductIds: nextIds });
    }

    showToast(`Product "${updatedProduct.name}" updated successfully!`);
  };

  // ADD PRODUCT STATE & HANDLERS
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdTagline, setNewProdTagline] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('');
  const [newProdPrice, setNewProdPrice] = useState<number>(350);
  const [newProdOriginalPrice, setNewProdOriginalPrice] = useState<number>(420);
  const [newProdDefaultPack, setNewProdDefaultPack] = useState('1 Litre Bottle');
  const [newProdPackSizes, setNewProdPackSizes] = useState<string[]>([
    '500 ml Bottle',
    '1 Litre Bottle',
    '2 Litre Can',
    '5 Litre Can',
  ]);
  const [newProdImage, setNewProdImage] = useState('');
  const [newCustomPackInput, setNewCustomPackInput] = useState('');
  const [newProdBadge, setNewProdBadge] = useState('Cold-Pressed');
  const [newProdSmokePoint, setNewProdSmokePoint] = useState('220°C');
  const [newProdExtraction, setNewProdExtraction] = useState('Traditional Mara Chekku Cold-Pressed');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdInStock, setNewProdInStock] = useState(true);
  const [newProdFeatured, setNewProdFeatured] = useState(false);
  const [addProdError, setAddProdError] = useState<string | null>(null);

  const handleTogglePackSizeInNew = (pack: string) => {
    setNewProdPackSizes((prev) =>
      prev.includes(pack) ? prev.filter((p) => p !== pack) : [...prev, pack]
    );
  };

  const handleAddCustomPackSizeNew = () => {
    const trimmed = newCustomPackInput.trim();
    if (!trimmed) return;
    if (!newProdPackSizes.includes(trimmed)) {
      setNewProdPackSizes((prev) => [...prev, trimmed]);
      if (!newProdDefaultPack) setNewProdDefaultPack(trimmed);
    }
    setNewCustomPackInput('');
  };

  const handleRemovePackSizeNew = (sizeToRemove: string) => {
    setNewProdPackSizes((prev) => prev.filter((s) => s !== sizeToRemove));
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddProdError(null);

    // Full oil can details mandatory validation
    if (!newProdImage.trim()) {
      setAddProdError(
        'தயவுசெய்து ஆயில் கேன் படம் (Image) பதிவேற்றவும் அல்லது தேர்ந்தெடுக்கவும். (Product image is required)'
      );
      return;
    }
    if (!newProdName.trim()) {
      setAddProdError('தயவுசெய்து தயாரிப்பு பெயரை (Product Name) உள்ளிடவும்.');
      return;
    }
    if (!newProdTagline.trim()) {
      setAddProdError('தயவுசெய்து Tagline / Subtitle உள்ளிடவும்.');
      return;
    }
    if (!newProdPrice || Number(newProdPrice) <= 0) {
      setAddProdError('தயவுசெய்து சரியான விற்பனை விலையை (Selling Price) உள்ளிடவும்.');
      return;
    }
    if (!newProdOriginalPrice || Number(newProdOriginalPrice) <= 0) {
      setAddProdError('தயவுசெய்து சரியான MRP விலையை உள்ளிடவும்.');
      return;
    }
    if (!newProdDefaultPack.trim()) {
      setAddProdError('தயவுசெய்து Default Pack Unit (எ.கா: 1 Litre Bottle) உள்ளிடவும்.');
      return;
    }
    if (newProdPackSizes.length === 0) {
      setAddProdError(
        'தயவுசெய்து குறைந்தபட்சம் ஒரு Can / Pack Size-ஐ டைப் செய்து சேர்க்கவும் (At least one can/pack size required).'
      );
      return;
    }
    if (!newProdExtraction.trim()) {
      setAddProdError('தயவுசெய்து எண்ணெய் தயாரிப்பு முறை (Extraction Method) உள்ளிடவும்.');
      return;
    }
    if (!newProdSmokePoint.trim()) {
      setAddProdError('தயவுசெய்து Smoke Point & பயன்பாட்டு பரிந்துரை உள்ளிடவும்.');
      return;
    }
    if (!newProdDescription.trim()) {
      setAddProdError('தயவுசெய்து தயாரிப்பு விவரம் & நன்மைகள் (Product Description) உள்ளிடவும்.');
      return;
    }

    const matchedCat = categoriesList.find((c) => c.slug === newProdCategory) || categoriesList[0];
    const createdId = `prod-${Date.now()}`;

    const newProduct: Product = {
      id: createdId,
      name: newProdName.trim(),
      tagline: newProdTagline.trim(),
      category: matchedCat?.slug || 'groundnut-oil',
      categoryName: matchedCat?.title || 'Groundnut Oil',
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice) || Number(newProdPrice),
      discountPercent:
        newProdOriginalPrice > newProdPrice
          ? Math.round(((newProdOriginalPrice - newProdPrice) / newProdOriginalPrice) * 100)
          : 0,
      rating: 5.0,
      reviewsCount: 1,
      packSizes: newProdPackSizes,
      defaultPack: newProdDefaultPack.trim(),
      image: newProdImage.trim(),
      badge: newProdBadge || undefined,
      description: newProdDescription.trim(),
      benefits: ['Zero Chemical Solvents', 'Unrefined & Pure', 'Naturally Rich in Vitamin E'],
      smokePoint: newProdSmokePoint.trim(),
      extractionMethod: newProdExtraction.trim(),
      inStock: newProdInStock,
      featured: newProdFeatured,
    };

    // Close modal immediately upon successful addition ("add panna oda close aganum")
    setIsAddProductOpen(false);

    await contextAddProduct(newProduct);

    // Reset all input fields
    setNewProdName('');
    setNewProdTagline('');
    setNewProdDescription('');
    setNewProdImage('');
    setNewCustomPackInput('');
    setNewProdPackSizes([]);
    setNewProdDefaultPack('');
    setAddProdError(null);
    showToast(`Product "${newProduct.name}" added to catalog! 🛢️`);
  };

  const handleDeleteProduct = async (productId: string) => {
    const prodToDelete = productsList.find((p) => p.id === productId);
    await contextDeleteProduct(productId);
    showToast(`Product "${prodToDelete?.name || 'Selected'}" deleted.`);
  };

  const handleToggleStock = async (productId: string) => {
    const target = productsList.find((p) => p.id === productId);
    if (!target) return;
    const newStock = !target.inStock;
    await contextUpdateProduct({ ...target, inStock: newStock });
    showToast(`Stock status for "${target.name}" updated.`);
  };

  // -------------------------------------------------------------
  // 3. DATA: User Login List State (Synced with localStorage login records)
  // -------------------------------------------------------------
  const DEFAULT_INITIAL_USERS: UserRecord[] = [
    {
      id: 'usr_admin',
      name: 'SS OIL Admin',
      email: 'admin@ssoil.com',
      phone: '1800 425 7764',
      role: 'admin',
      memberTier: 'Platinum Member',
      purityPoints: 9999,
      lastLogin: 'Just Now (Online)',
      status: 'Active',
      totalOrders: 0,
      totalSpent: 0,
    },
    {
      id: 'usr_ramesh',
      name: 'Ramesh Sundaram',
      email: 'ramesh.sundaram@gmail.com',
      phone: '98421 45620',
      role: 'customer',
      memberTier: 'Gold Member',
      purityPoints: 240,
      lastLogin: 'Today, 04:30 PM',
      status: 'Active',
      totalOrders: 2,
      totalSpent: 1470,
    },
    {
      id: 'usr_anitha',
      name: 'Anitha Vijay',
      email: 'anitha.vijay@yahoo.co.in',
      phone: '97892 34110',
      role: 'customer',
      memberTier: 'Silver Member',
      purityPoints: 120,
      lastLogin: 'Yesterday, 11:15 AM',
      status: 'Active',
      totalOrders: 1,
      totalSpent: 620,
    },
    {
      id: 'usr_karthik',
      name: 'Karthik Narayanan',
      email: 'karthik.n@gmail.com',
      phone: '94432 89100',
      role: 'customer',
      memberTier: 'Gold Member',
      purityPoints: 310,
      lastLogin: '23 Oct, 09:20 AM',
      status: 'Active',
      totalOrders: 3,
      totalSpent: 2150,
    },
    {
      id: 'usr_meena',
      name: 'Meenakshi Sundaram',
      email: 'meena.sundaram@gmail.com',
      phone: '98433 12450',
      role: 'customer',
      memberTier: 'Platinum Member',
      purityPoints: 540,
      lastLogin: '22 Oct, 06:45 PM',
      status: 'Active',
      totalOrders: 4,
      totalSpent: 3490,
    },
  ];

  const loadUsersList = (): UserRecord[] => {
    try {
      const userMap = new Map<string, UserRecord>();
      const userList: UserRecord[] = [];

      const addUser = (u: UserRecord, toFront: boolean = false) => {
        const key = (u.email || u.phone || u.id || '').toLowerCase().trim();
        if (!key) return;
        if (userMap.has(key)) {
          const existingIdx = userList.findIndex(
            (item) => (item.email || item.phone || item.id || '').toLowerCase().trim() === key
          );
          if (existingIdx >= 0) {
            const updated = { ...userList[existingIdx], ...u };
            userList.splice(existingIdx, 1);
            if (toFront) {
              userList.unshift(updated);
            } else {
              userList.push(updated);
            }
            userMap.set(key, updated);
          }
        } else {
          userMap.set(key, u);
          if (toFront) {
            userList.unshift(u);
          } else {
            userList.push(u);
          }
        }
      };

      // 1. Saved registered users from ssoil_users_directory (latest users first)
      const savedDirectory = localStorage.getItem('ssoil_users_directory');
      if (savedDirectory) {
        const parsed = JSON.parse(savedDirectory);
        if (Array.isArray(parsed)) {
          parsed.forEach((savedUser: UserRecord) => {
            addUser(savedUser, false);
          });
        }
      }

      // 2. Demo initial seed users at the bottom
      DEFAULT_INITIAL_USERS.forEach((seed) => {
        addUser(seed, false);
      });

      // 3. Put current active logged-in user at the ABSOLUTE TOP (index 0)!
      const activeUserStr = localStorage.getItem('ssoil_user');
      if (activeUserStr) {
        const activeUser = JSON.parse(activeUserStr);
        if (activeUser && (activeUser.name || activeUser.email)) {
          const liveUserRecord: UserRecord = {
            id: activeUser.id || `usr_${Date.now()}`,
            name: activeUser.name || 'Logged User',
            email: activeUser.email || 'user@ssoil.com',
            phone: activeUser.phone || '98421 45620',
            role: activeUser.role || 'customer',
            memberTier: activeUser.memberTier || 'Gold Member',
            purityPoints: activeUser.purityPoints || 240,
            lastLogin: 'Just Now (Online)',
            status: 'Active',
            totalOrders: activeUser.totalOrders || 0,
            totalSpent: activeUser.totalSpent || 0,
            city: activeUser.city,
            address: activeUser.address,
            pincode: activeUser.pincode,
            isVerified: activeUser.isVerified ?? true,
          };
          addUser(liveUserRecord, true);
        }
      }

      return userList;
    } catch (e) {
      return DEFAULT_INITIAL_USERS;
    }
  };

  const [usersList, setUsersList] = useState<UserRecord[]>(loadUsersList);

  useEffect(() => {
    const handleUserUpdate = () => {
      setUsersList(loadUsersList());
    };
    window.addEventListener('storage', handleUserUpdate);
    window.addEventListener('ssoil_user_logged_in', handleUserUpdate);
    return () => {
      window.removeEventListener('storage', handleUserUpdate);
      window.removeEventListener('ssoil_user_logged_in', handleUserUpdate);
    };
  }, []);

  const [userRoleFilter, setUserRoleFilter] = useState<'ALL' | 'customer' | 'admin'>('ALL');

  const handleToggleUserStatus = (userId: string) => {
    setUsersList((prev) =>
      prev.map((u) =>
        u.id === userId
          ? { ...u, status: u.status === 'Active' ? 'Inactive' : 'Active' }
          : u
      )
    );
    showToast('User account status updated.');
  };

  // -------------------------------------------------------------
  // 4. DATA: Store Settings State (Synced with useStore())
  // -------------------------------------------------------------
  const [settings, setSettings] = useState<StoreSettings>(storeSettings);

  useEffect(() => {
    if (storeSettings) {
      setSettings(storeSettings);
    }
  }, [storeSettings]);

  const handleSaveSettings = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateStoreSettings(settings);
    showToast('Store settings saved! User pages updated instantly');
  };

  // -------------------------------------------------------------
  // 4C. DATA: Homepage Featured Products State & Helpers
  // -------------------------------------------------------------
  const currentHomepageProductIds =
    settings.homepageProductIds && settings.homepageProductIds.length > 0
      ? settings.homepageProductIds
      : productsList.slice(0, 4).map((p) => p.id);

  const handleSetHomepageSlot = (slotIdx: number, newProductId: string) => {
    const nextIds = [...currentHomepageProductIds];
    while (nextIds.length < 4) {
      const remaining = productsList.find((p) => !nextIds.includes(p.id));
      nextIds.push(remaining ? remaining.id : productsList[0].id);
    }

    // Clean swap if newProductId is already assigned to another slot
    const existingIndex = nextIds.indexOf(newProductId);
    if (existingIndex !== -1 && existingIndex !== slotIdx) {
      nextIds[existingIndex] = nextIds[slotIdx];
    }
    nextIds[slotIdx] = newProductId;

    const newSettings = { ...settings, homepageProductIds: nextIds };
    setSettings(newSettings);
    updateStoreSettings({ homepageProductIds: nextIds });

    const newProd = productsList.find((p) => p.id === newProductId);
    if (newProd) {
      contextUpdateProduct({ ...newProd, featured: true });
    }
    showToast(`Slot ${slotIdx + 1} updated to "${newProd?.name || 'Oil'}"! ⭐`);
  };

  const handleToggleHomepageProduct = (productId: string) => {
    let nextIds: string[];
    const isCurrentlyActive = currentHomepageProductIds.includes(productId);

    if (isCurrentlyActive) {
      if (currentHomepageProductIds.length <= 1) {
        showToast('At least 1 product must remain active on the Homepage!');
        return;
      }
      nextIds = currentHomepageProductIds.filter((id) => id !== productId);
    } else {
      nextIds = [...currentHomepageProductIds, productId];
    }

    const newSettings = { ...settings, homepageProductIds: nextIds };
    setSettings(newSettings);
    updateStoreSettings({ homepageProductIds: nextIds });

    const prod = productsList.find((p) => p.id === productId);
    if (prod) {
      contextUpdateProduct({ ...prod, featured: !isCurrentlyActive });
    }
    const prodName = prod?.name || 'Product';
    if (isCurrentlyActive) {
      showToast(`"${prodName}" removed from Homepage.`);
    } else {
      showToast(`"${prodName}" is now active on Homepage! ⭐`);
    }
  };

  // -------------------------------------------------------------
  // 4B. DATA: Homepage Video & Reels Management State
  // -------------------------------------------------------------
  const [videoSubTab, setVideoSubTab] = useState<'featured' | 'reels'>('featured');
  const [showAdvancedVideoSettings, setShowAdvancedVideoSettings] = useState(false);
  const [showAdvancedReelFields, setShowAdvancedReelFields] = useState(false);
  const [videoForm, setVideoForm] = useState<HomeFeaturedVideo>(homeFeaturedVideo);

  useEffect(() => {
    if (homeFeaturedVideo) {
      setVideoForm(homeFeaturedVideo);
    }
  }, [homeFeaturedVideo]);

  const handleSaveFeaturedVideo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    updateHomeFeaturedVideo({
      ...videoForm,
      title: DEFAULT_HOME_FEATURED_VIDEO.title,
      tamilTitle: DEFAULT_HOME_FEATURED_VIDEO.tamilTitle,
      subtitle: DEFAULT_HOME_FEATURED_VIDEO.subtitle,
      tamilSubtitle: DEFAULT_HOME_FEATURED_VIDEO.tamilSubtitle,
    });
    showToast('Homepage featured video updated successfully!');
  };

  // Video File Uploader Handler
  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>, setter: (val: string) => void) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 50 * 1024 * 1024) {
      alert('Video file is large (>50MB). Please select a file under 50MB or enter a video URL.');
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setter(reader.result);
        showToast(`Video "${file.name}" loaded successfully! 📹`);
      }
    };
    reader.readAsDataURL(file);
  };

  // 5. DATA: Dashboard KPI Calculations
  // -------------------------------------------------------------
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const totalItemsSold = orders.reduce(
    (sum, ord) => sum + ord.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'DELIVERED').length;
  const inStockProductsCount = productsList.filter((p) => p.inStock).length;

  // -------------------------------------------------------------
  // Unread Items Tracking: Badges only appear when unviewed, and disappear once seen!
  // -------------------------------------------------------------
  const [seenOrderIds, setSeenOrderIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ssoil_seen_order_ids');
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial = orders.map((o) => o.id);
    try {
      localStorage.setItem('ssoil_seen_order_ids', JSON.stringify(initial));
    } catch {}
    return initial;
  });

  const [seenCustomerIds, setSeenCustomerIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ssoil_seen_customer_ids');
      if (saved) return JSON.parse(saved);
    } catch {}
    const initial = usersList.map((u) => u.id || u.email || u.phone);
    try {
      localStorage.setItem('ssoil_seen_customer_ids', JSON.stringify(initial));
    } catch {}
    return initial;
  });

  // When admin visits the Orders tab, mark all current orders as seen!
  useEffect(() => {
    if (activeTab === 'orders' && orders.length > 0) {
      const allOrderIds = orders.map((o) => o.id);
      const hasUnseen = allOrderIds.some((id) => !seenOrderIds.includes(id));
      if (hasUnseen) {
        const merged = Array.from(new Set([...seenOrderIds, ...allOrderIds]));
        setSeenOrderIds(merged);
        try {
          localStorage.setItem('ssoil_seen_order_ids', JSON.stringify(merged));
        } catch {}
      }
    }
  }, [activeTab, orders, seenOrderIds]);

  // When admin visits the Customers tab, mark all current customers as seen!
  useEffect(() => {
    if (activeTab === 'customers' && usersList.length > 0) {
      const allCustomerKeys = usersList.map((u) => u.id || u.email || u.phone);
      const hasUnseen = allCustomerKeys.some((key) => !seenCustomerIds.includes(key));
      if (hasUnseen) {
        const merged = Array.from(new Set([...seenCustomerIds, ...allCustomerKeys]));
        setSeenCustomerIds(merged);
        try {
          localStorage.setItem('ssoil_seen_customer_ids', JSON.stringify(merged));
        } catch {}
      }
    }
  }, [activeTab, usersList, seenCustomerIds]);

  // Unread badge count: only shown if admin has not opened the tab yet
  const unreadOrdersCount =
    activeTab === 'orders'
      ? 0
      : orders.filter((o) => !seenOrderIds.includes(o.id)).length;

  const unreadCustomersCount =
    activeTab === 'customers'
      ? 0
      : usersList.filter((u) => !seenCustomerIds.includes(u.id || u.email || u.phone)).length;

  const exportCSV = () => {
    const headers = ['Order Number', 'Customer Name', 'Phone', 'Total Amount', 'Status', 'Date'];
    const rows = orders.map((o) => [
      o.orderNumber,
      `"${o.customerName}"`,
      o.customerPhone,
      o.totalAmount,
      o.orderStatus,
      o.createdAt,
    ]);
    const csvContent =
      'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SSOIL_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="h-screen w-full bg-stone-100 text-stone-900 flex flex-col md:flex-row font-sans overflow-hidden">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-forest-950 text-white px-4 py-2.5 rounded-xl shadow-lg border border-gold-500/40 text-xs font-semibold flex items-center gap-2 animate-fadeIn">
          <CheckCircle className="w-4 h-4 text-gold-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* ============================================================ */}
      {/* LEFT SIDEBAR: EXACT MATCH TO USER SCREENSHOT                 */}
      {/* ============================================================ */}
      <aside className="w-full md:w-64 lg:w-72 bg-[#132c19] text-cream-100 border-r border-[#1a3821] flex flex-col shrink-0 h-auto md:h-screen md:sticky md:top-0 z-30 overflow-hidden relative">
        
        {/* Brand Header: SS Oil Pure & Healthy */}
        <div className="p-5 lg:p-6 border-b border-white/10 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/10 p-1 flex items-center justify-center shadow-md shrink-0 border border-white/10 overflow-hidden">
              <img
                src={settings.logoUrl || "/admin_assets/ss_gold_drop_logo.png"}
                alt="SS Oil Logo"
                className="w-full h-full object-contain rounded-xl drop-shadow"
              />
            </div>
            <div>
              <h1 className="font-serif text-xl font-black tracking-tight text-white leading-none">
                {settings.storeName || "ss oil"}
              </h1>
              <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest mt-0.5">
                {settings.tagline || 'Pure & Healthy'}
              </p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation Items from Screenshot */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto select-none relative z-10">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: Home },
            { id: 'products', label: 'Products', icon: Package },
            { id: 'categories', label: 'Categories', icon: Layers },
            { id: 'videos', label: 'Homepage Video', icon: Video },
            { id: 'orders', label: 'Orders', icon: ShoppingCart, count: unreadOrdersCount },
            { id: 'customers', label: 'Customers', icon: Users, count: unreadCustomersCount },
            { id: 'offers', label: 'Offers & Coupons', icon: Tag },
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  handleTabChange(item.id as AdminTab);
                  setSearchTerm('');
                }}
                className={`w-full px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
                  isActive
                    ? 'bg-[#1e7e34] text-white shadow-md font-bold'
                    : 'text-stone-300 hover:text-white hover:bg-white/10 font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </div>
                {item.count !== undefined && item.count > 0 && (
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                      isActive ? 'bg-[#132c19] text-white' : 'bg-amber-400 text-stone-900 shadow-2xs font-extrabold'
                    }`}
                  >
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Logout Action in Nav */}
          <button
            onClick={() => {
              if (onLogout) onLogout();
              else onBackToStore();
            }}
            className="w-full px-3.5 py-2.5 rounded-xl text-xs font-medium text-stone-400 hover:text-red-300 hover:bg-red-950/30 transition-all flex items-center gap-3 cursor-pointer pt-2"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            <span>Logout</span>
          </button>
        </nav>

      </aside>

      {/* ============================================================ */}
      {/* RIGHT MAIN CONTENT AREA                                      */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden bg-[#F8FAF9]">
        
        {/* Top Header Bar matching Screenshot */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-20 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
          {/* Search Anything Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search anything..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-stone-50 border border-stone-200 text-xs focus:outline-none focus:border-[#1e7e34] focus:bg-white transition-all text-stone-800 placeholder-stone-400"
            />
          </div>

          {/* Right: Notifications & Admin Profile */}
          <div className="flex items-center gap-3 sm:gap-4 ml-4">
            <button
              onClick={() => showToast('You have 3 new notifications')}
              className="p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-all cursor-pointer relative"
              title="Notifications"
            >
              <Bell className="w-5 h-5" />
              <span className="w-2 h-2 rounded-full bg-red-500 absolute top-1.5 right-1.5 ring-2 ring-white" />
            </button>

            {/* Admin Avatar Pill & Quick Logout */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-stone-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#132c19] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                  A
                </div>
                <div className="hidden sm:block text-left">
                  <div className="text-xs font-bold text-stone-800 leading-tight">Admin</div>
                  <div className="text-[10px] text-stone-400">Super Admin</div>
                </div>
              </div>
              <button
                onClick={() => {
                  if (onLogout) onLogout();
                  else if (onBackToStore) onBackToStore();
                  else window.location.href = '/';
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold transition-all cursor-pointer shadow-2xs"
                title="Sign out of Admin Portal"
              >
                <LogOut className="w-3.5 h-3.5 shrink-0" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </header>

        {/* Secondary Action Bar (Shown for non-settings tabs) */}
        {activeTab !== 'settings' && (
          <div className="bg-white border-b border-stone-200 px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xs">
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Admin Portal
              </div>
              <h2 className="text-xl sm:text-2xl font-serif font-black text-forest-950">
                {activeTab === 'dashboard' && 'Mill Dashboard'}
                {activeTab === 'products' && 'Products'}
                {activeTab === 'categories' && 'Categories Management'}
                {activeTab === 'videos' && 'Mara Chekku Heritage Video'}
                {activeTab === 'customers' && 'User Login & Account Directory'}
                {activeTab === 'orders' && 'Orders Management'}
                {activeTab === 'offers' && 'Offers & Coupons'}
                {activeTab === 'content' && 'Content Management'}
                {activeTab === 'analytics' && 'Analytics & Performance'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'products' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onBackToStore}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-stone-200 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View on Home</span>
                  </button>
                  <button
                    onClick={() => {
                      setNewProdName('');
                      setNewProdTagline('');
                      setNewProdCategory(categoriesList[0]?.slug || 'sesame-oil');
                      setNewProdPrice(350);
                      setNewProdOriginalPrice(420);
                      setNewProdDefaultPack('');
                      setNewProdPackSizes([]);
                      setNewProdImage('');
                      setNewCustomPackInput('');
                      setNewProdBadge('Cold-Pressed');
                      setNewProdSmokePoint('220°C');
                      setNewProdExtraction('Traditional Vaagai Mara Chekku');
                      setNewProdDescription('');
                      setNewProdInStock(true);
                      setNewProdFeatured(false);
                      setAddProdError(null);
                      setIsAddProductOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold-400" />
                    <span>Add Product</span>
                  </button>
                </div>
              )}

              {activeTab === 'categories' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={onBackToStore}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-stone-200 shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View on Home</span>
                  </button>
                  <button
                    onClick={() => {
                      setNewCatTitle('');
                      setNewCatSubtitle('');
                      setNewCatBadge('New Arrival');
                      setNewCatSlug('');
                      setNewCatImage('/products/sesame_oil.jpg');
                      setNewCatAssignedProductIds([]);
                      setIsAddCategoryOpen(true);
                    }}
                    className="px-3.5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold-400" />
                    <span>Add Category</span>
                  </button>
                </div>
              )}

              {activeTab === 'videos' && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleSaveFeaturedVideo}
                    className="px-4 py-2 rounded-xl bg-[#1e7e34] hover:bg-[#18682a] text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Save className="w-3.5 h-3.5 text-gold-300" />
                    <span>Save Video</span>
                  </button>
                  <button
                    onClick={onBackToStore}
                    className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer border border-stone-200"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View on Store</span>
                  </button>
                </div>
              )}

              {activeTab === 'dashboard' && (
                <button
                  onClick={exportCSV}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all border border-stone-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-stone-600" />
                  <span>Export CSV</span>
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Body */}
        <main className="p-4 sm:p-8 space-y-6">

          {/* ============================================================ */}
          {/* 1. DASHBOARD VIEW                                            */}
          {/* ============================================================ */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6">
              
              {/* 4 Metric Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                
                {/* Total Gross Sales */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider">Total Sales</span>
                    <span className="p-2 rounded-xl bg-emerald-100 text-emerald-800">
                      <DollarSign className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-black text-forest-950">
                    ₹{totalRevenue.toLocaleString()}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1 mt-1">
                    <TrendingUp className="w-3.5 h-3.5" /> Live Auto-Calculated
                  </span>
                </div>

                {/* Total Orders */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider">Orders</span>
                    <span className="p-2 rounded-xl bg-blue-100 text-blue-800">
                      <ShoppingBag className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-black text-forest-950">
                    {orders.length}
                  </div>
                  <span className="text-[11px] text-amber-700 font-semibold mt-1 block">
                    {activeOrdersCount} Pending Dispatch
                  </span>
                </div>

                {/* Registered Users */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider">Logins / Users</span>
                    <span className="p-2 rounded-xl bg-purple-100 text-purple-800">
                      <Users className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-black text-forest-950">
                    {usersList.length}
                  </div>
                  <span className="text-[11px] text-purple-700 font-semibold mt-1 block">
                    {usersList.filter((u) => u.role === 'customer').length} Active Customers
                  </span>
                </div>

                {/* Products in Catalog */}
                <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
                  <div className="flex items-center justify-between text-stone-500 mb-1">
                    <span className="text-xs font-semibold uppercase tracking-wider">Products</span>
                    <span className="p-2 rounded-xl bg-amber-100 text-amber-800">
                      <Package className="w-4 h-4" />
                    </span>
                  </div>
                  <div className="font-serif text-2xl sm:text-3xl font-black text-forest-950">
                    {productsList.length}
                  </div>
                  <span className="text-[11px] text-emerald-700 font-semibold mt-1 block">
                    {inStockProductsCount} In Stock
                  </span>
                </div>

              </div>

              {/* Recent Orders Queue Snapshot */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-4">
                <div className="flex items-center justify-between border-b border-stone-100 pb-4">
                  <div>
                    <h3 className="font-serif font-black text-lg text-forest-950">
                      Recent Orders Dispatch
                    </h3>
                    <p className="text-xs text-stone-500">
                      Live orders placed by customers across Tamil Nadu
                    </p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200">
                    {orders.length} Total Orders
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-serif">
                      <tr>
                        <th className="py-3 px-4 font-bold">Order ID</th>
                        <th className="py-3 px-4 font-bold">Customer Details</th>
                        <th className="py-3 px-4 font-bold">Items</th>
                        <th className="py-3 px-4 font-bold">Total</th>
                        <th className="py-3 px-4 font-bold">Payment</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {orders.map((ord) => (
                        <tr key={ord.id} className="hover:bg-amber-50/20">
                          <td className="py-3 px-4 font-mono font-bold text-forest-950">
                            {ord.orderNumber}
                          </td>
                          <td className="py-3 px-4">
                            <span className="font-bold text-stone-900 block">{ord.customerName}</span>
                            <span className="text-[11px] text-stone-500">{ord.customerPhone}</span>
                          </td>
                          <td className="py-3 px-4">
                            <span className="text-stone-700">
                              {ord.items.map((i) => `${i.productName} (${i.packSize})`).join(', ')}
                            </span>
                          </td>
                          <td className="py-3 px-4 font-bold font-serif text-sm text-forest-950">
                            ₹{ord.totalAmount}
                          </td>
                          <td className="py-3 px-4">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-700">
                              {ord.paymentMethod}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                                ord.orderStatus === 'DELIVERED'
                                  ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                  : ord.orderStatus === 'SHIPPED'
                                  ? 'bg-purple-100 text-purple-800 border-purple-300'
                                  : 'bg-amber-100 text-amber-800 border-amber-300'
                              }`}
                            >
                              {ord.orderStatus}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            {ord.orderStatus !== 'DELIVERED' ? (
                              <button
                                onClick={() => {
                                  const seq: PlacedOrder['orderStatus'][] = [
                                    'PROCESSING',
                                    'PACKED',
                                    'SHIPPED',
                                    'DELIVERED',
                                  ];
                                  const idx = seq.indexOf(ord.orderStatus);
                                  if (idx < seq.length - 1) {
                                    onUpdateOrderStatus(ord.id, seq[idx + 1]);
                                  }
                                }}
                                className="px-2.5 py-1 rounded-lg bg-forest-950 text-white text-[11px] font-bold hover:bg-forest-900 cursor-pointer"
                              >
                                Advance →
                              </button>
                            ) : (
                              <span className="text-[11px] text-emerald-700 font-bold">✓ Delivered</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Navigation Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                <button
                  onClick={() => handleTabChange('categories')}
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-gold-500 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <Layers className="w-5 h-5 text-forest-800 group-hover:text-gold-600 mb-2" />
                  <h4 className="font-bold text-xs text-stone-900">Manage Categories</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{categoriesList.length} Categories configured</p>
                </button>

                <button
                  onClick={() => handleTabChange('videos')}
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-gold-500 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <Video className="w-5 h-5 text-forest-800 group-hover:text-gold-600 mb-2" />
                  <h4 className="font-bold text-xs text-stone-900">Homepage Videos</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">1 Heritage Showcase Video</p>
                </button>

                <button
                  onClick={() => handleTabChange('users')}
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-gold-500 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <Users className="w-5 h-5 text-forest-800 group-hover:text-gold-600 mb-2" />
                  <h4 className="font-bold text-xs text-stone-900">User Login List</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{usersList.length} User records</p>
                </button>

                <button
                  onClick={() => handleTabChange('products')}
                  className="p-4 rounded-2xl bg-gradient-to-br from-amber-50 to-white border border-amber-200 hover:border-amber-400 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <Package className="w-5 h-5 text-forest-800 group-hover:scale-110 mb-2" />
                  <h4 className="font-bold text-xs text-stone-900">Products</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{productsList.length} Edible Oils • Homepage Showcase</p>
                </button>

                <button
                  onClick={() => handleTabChange('settings')}
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-gold-500 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <Settings className="w-5 h-5 text-forest-800 group-hover:text-gold-600 mb-2" />
                  <h4 className="font-bold text-xs text-stone-900">Mill Settings</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">Rates, Contact, Mill Info</p>
                </button>
              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* 2. CATEGORIES VIEW (With Edit, Product Assignment & Images)  */}
          {/* ============================================================ */}
          {activeTab === 'categories' && (
            <div className="space-y-5">
              
              {/* Category Search & Counter */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search categories..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 bg-stone-50/50"
                  />
                </div>
                <div className="text-xs text-stone-500">
                  Total <strong>{categoriesList.length}</strong> Categories Available • Click <strong>Edit</strong> to change details, image & products
                </div>
              </div>

              {/* Categories Grid: Shows Image, Info & Assigned Products */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {categoriesList
                  .filter((c) =>
                    searchTerm
                      ? c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        c.subtitle.toLowerCase().includes(searchTerm.toLowerCase())
                      : true
                  )
                  .map((cat) => {
                    const assignedProducts = productsList.filter(
                      (p) => p.category === cat.slug
                    );

                    return (
                      <div
                        key={cat.id}
                        className="bg-white rounded-3xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                      >
                        {/* Top Category Image Banner */}
                        <div className="relative h-44 w-full bg-stone-100 overflow-hidden group">
                          <img
                            src={cat.image}
                            alt={cat.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

                          {/* Badge Tag */}
                          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-400 text-forest-950 shadow-sm border border-gold-300">
                            {cat.badge}
                          </span>

                          {/* Quick Edit Image Button */}
                          <button
                            type="button"
                            onClick={() => openEditCategory(cat)}
                            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 text-stone-800 hover:bg-forest-950 hover:text-gold-300 transition-colors shadow-xs cursor-pointer"
                            title="Edit Category & Change Image"
                          >
                            <Camera className="w-3.5 h-3.5" />
                          </button>

                          {/* Title over gradient at bottom */}
                          <div className="absolute bottom-3 left-4 right-4 text-white">
                            <h3 className="font-serif font-black text-lg leading-snug drop-shadow-sm">
                              {cat.title}
                            </h3>
                            <span className="text-[11px] font-mono text-gold-300 block">
                              slug: /{cat.slug}
                            </span>
                          </div>
                        </div>

                        {/* Card Body */}
                        <div className="p-5 space-y-3.5 flex-1 flex flex-col justify-between">
                          <div className="space-y-3">
                            <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                              {cat.subtitle}
                            </p>

                            {/* Assigned Products Section (product ahh mathikura mathiri) */}
                            <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 space-y-2">
                              <div className="flex items-center justify-between text-xs">
                                <span className="font-bold text-stone-700 flex items-center gap-1.5">
                                  <Package className="w-3.5 h-3.5 text-forest-800" />
                                  <span>Assigned Oils ({assignedProducts.length})</span>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => openEditCategory(cat)}
                                  className="text-[11px] font-bold text-forest-950 hover:text-gold-600 hover:underline cursor-pointer"
                                >
                                  Edit Products →
                                </button>
                              </div>

                              {assignedProducts.length > 0 ? (
                                <div className="flex flex-wrap gap-1">
                                  {assignedProducts.map((p) => (
                                    <span
                                      key={p.id}
                                      className="px-2 py-0.5 rounded-lg bg-white border border-stone-200 text-[10px] font-medium text-stone-800 shadow-2xs truncate max-w-[200px]"
                                    >
                                      {p.name.replace('SS Premium Wood-Pressed ', '').replace('SS Pure Traditional ', '')}
                                    </span>
                                  ))}
                                </div>
                              ) : (
                                <p className="text-[11px] text-stone-400 italic">
                                  No products linked yet. Click Edit to assign.
                                </p>
                              )}
                            </div>
                          </div>

                          {/* Card Footer Actions */}
                          <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                            <button
                              type="button"
                              onClick={() => openEditCategory(cat)}
                              className="px-3.5 py-1.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                            >
                              <Edit className="w-3.5 h-3.5 text-gold-400" />
                              <span>Edit Category</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCategory(cat.id)}
                              className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                              title="Delete category"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
              </div>

              {/* ============================================================ */}
              {/* EDIT CATEGORY MODAL (Image upload + Product Assignment)       */}
              {/* ============================================================ */}
              {editingCategory && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
                    
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                          Category Editor
                        </span>
                        <h3 className="font-serif font-black text-xl text-forest-950">
                          Edit Category: {editingCategory.title}
                        </h3>
                      </div>
                      <button
                        onClick={() => setEditingCategory(null)}
                        className="text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-lg hover:bg-stone-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveEditCategory} className="space-y-5">
                      
                      {/* 1. Category Image (Upload / URL / Presets) */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          1. Category Image
                        </label>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* Live Preview */}
                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-stone-300 shadow-xs shrink-0 bg-stone-100 relative">
                            {editCatImage ? (
                              <img
                                src={editCatImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            {/* File Upload Button */}
                            <div className="flex items-center gap-2">
                              <label className="px-3.5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs">
                                <Upload className="w-3.5 h-3.5 text-gold-400" />
                                <span>Upload Image from Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, setEditCatImage)}
                                />
                              </label>

                              <span className="text-[11px] text-stone-400">or paste URL below</span>
                            </div>

                            {/* Image URL text input */}
                            <input
                              type="text"
                              value={editCatImage}
                              onChange={(e) => setEditCatImage(e.target.value)}
                              placeholder="https://... or /products/sesame_oil.jpg"
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-forest-900 bg-white"
                            />
                          </div>
                        </div>

                        {/* Quick Presets Strip */}
                        <div className="pt-2 border-t border-stone-200">
                          <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                            ⚡ Quick 1-Click Oil Presets:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {PRESET_IMAGES.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => setEditCatImage(preset.url)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                                  editCatImage === preset.url
                                    ? 'bg-forest-950 text-gold-300 border-forest-950'
                                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                                }`}
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 2. Basic Category Info */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          2. Category Details
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Category Title
                            </label>
                            <input
                              type="text"
                              required
                              value={editCatTitle}
                              onChange={(e) => setEditCatTitle(e.target.value)}
                              placeholder="e.g. Sesame Oil"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Tamil Title (Optional)
                            </label>
                            <input
                              type="text"
                              value={editCatTamilTitle}
                              onChange={(e) => setEditCatTamilTitle(e.target.value)}
                              placeholder="e.g. Sesame Oil"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Slug Identifier (URL)
                            </label>
                            <input
                              type="text"
                              required
                              value={editCatSlug}
                              onChange={(e) => setEditCatSlug(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-forest-900"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            Subtitle / Description
                          </label>
                          <input
                            type="text"
                            value={editCatSubtitle}
                            onChange={(e) => setEditCatSubtitle(e.target.value)}
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            Badge Label
                          </label>
                          <input
                            type="text"
                            value={editCatBadge}
                            onChange={(e) => setEditCatBadge(e.target.value)}
                            placeholder="e.g. Authentic Gingelly, Daily Essential"
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                          />
                        </div>
                      </div>

                      {/* 3. Assigned Products (product ahh mathikura mathiri) */}
                      <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold uppercase tracking-wider text-forest-950">
                            3. Link Products to this Category
                          </label>
                          <span className="text-[11px] font-bold text-amber-800">
                            {editCatAssignedProductIds.length} Selected
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500">
                          Check or uncheck the oils that should appear under this category:
                        </p>

                        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                          {productsList.map((product) => {
                            const isAssigned = editCatAssignedProductIds.includes(product.id);
                            return (
                              <div
                                key={product.id}
                                onClick={() => handleToggleProductInEdit(product.id)}
                                className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                                  isAssigned
                                    ? 'bg-white border-forest-900 shadow-2xs'
                                    : 'bg-white/60 border-stone-200 hover:border-stone-300 opacity-80'
                                }`}
                              >
                                <div className="flex items-center gap-3">
                                  <img
                                    src={product.image}
                                    alt={product.name}
                                    className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                                  />
                                  <div>
                                    <span className="font-bold text-xs text-stone-900 block">
                                      {product.name}
                                    </span>
                                    <span className="text-[10px] text-stone-500">
                                      ₹{product.price} • {product.extractionMethod}
                                    </span>
                                  </div>
                                </div>

                                <div className="shrink-0 text-forest-900">
                                  {isAssigned ? (
                                    <CheckSquare className="w-5 h-5 text-forest-950" />
                                  ) : (
                                    <Square className="w-5 h-5 text-stone-300" />
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      {/* Modal Action Buttons */}
                      <div className="pt-2 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingCategory(null)}
                          className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                        >
                          <Save className="w-4 h-4 text-gold-400" />
                          <span>Save Changes</span>
                        </button>
                      </div>

                    </form>

                  </div>
                </div>
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* 3. USER LOGIN & CUSTOMERS LIST VIEW                          */}
          {/* ============================================================ */}
          {(activeTab === 'users' || activeTab === 'customers') && (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 space-y-5">
              
              {/* Header & Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="font-serif font-black text-lg text-forest-950">
                    User Login & Account Directory
                  </h3>
                  <p className="text-xs text-stone-500">
                    Registered users, login timestamps, and customer activity logs
                  </p>
                </div>

                {/* Role Filter Pills */}
                <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
                  {(['ALL', 'customer', 'admin'] as const).map((r) => (
                    <button
                      key={r}
                      onClick={() => setUserRoleFilter(r)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        userRoleFilter === r
                          ? 'bg-forest-950 text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900'
                      }`}
                    >
                      {r === 'ALL' ? 'All Users' : r === 'customer' ? 'Customers' : 'Admins'}
                    </button>
                  ))}
                </div>
              </div>

              {/* User Search Input */}
              <div className="relative max-w-sm">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 bg-stone-50/50"
                />
              </div>

              {/* User Logins Table */}
              <div className="rounded-2xl border border-stone-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-serif">
                      <tr>
                        <th className="py-3 px-4 font-bold">User Name & Email</th>
                        <th className="py-3 px-4 font-bold">Role</th>
                        <th className="py-3 px-4 font-bold">Contact Phone</th>
                        <th className="py-3 px-4 font-bold">Orders / Spent</th>
                        <th className="py-3 px-4 font-bold">Last Login Activity</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {usersList
                        .filter((u) => {
                          const matchesRole =
                            userRoleFilter === 'ALL' || u.role === userRoleFilter;
                          const matchesSearch =
                            !searchTerm ||
                            u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            u.phone.includes(searchTerm);
                          return matchesRole && matchesSearch;
                        })
                        .map((user) => (
                          <tr key={user.id} className="hover:bg-amber-50/20">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-2.5">
                                <div className="w-8 h-8 rounded-full bg-forest-950 text-gold-400 flex items-center justify-center font-bold text-xs shrink-0">
                                  {user.name.charAt(0)}
                                </div>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-stone-900 block">
                                      {user.name}
                                    </span>
                                    {user.isVerified !== false && (
                                      <span className="inline-flex items-center px-1.5 py-0.2 rounded text-[9px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                        ✓ Verified
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-stone-500 font-mono">
                                    {user.email}
                                  </span>
                                </div>
                              </div>
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                  user.role === 'admin'
                                    ? 'bg-gold-100 text-gold-900 border border-gold-300'
                                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                }`}
                              >
                                {user.role === 'admin' ? '🛡️ Administrator' : 'Customer'}
                              </span>
                            </td>

                            <td className="py-3 px-4 font-mono text-stone-600">
                              <div className="font-semibold">{user.phone}</div>
                              {user.city && (
                                <span className="text-[10px] text-stone-500 block font-sans">
                                  📍 {user.city}
                                </span>
                              )}
                            </td>

                            <td className="py-3 px-4">
                              {(() => {
                                const cleanPhone = (user.phone || '').replace(/\D/g, '');
                                const cleanEmail = (user.email || '').toLowerCase().trim();
                                const userOrders = orders.filter((o) => {
                                  const oPhone = (o.customerPhone || '').replace(/\D/g, '');
                                  const oEmail = (o.customerEmail || '').toLowerCase().trim();
                                  return (cleanEmail && oEmail === cleanEmail) || (cleanPhone && oPhone === cleanPhone);
                                });
                                const orderCount = userOrders.length;
                                const spentAmount = userOrders.reduce((sum, o) => sum + (o.totalAmount || 0), 0);

                                if (orderCount === 0) {
                                  return (
                                    <div>
                                      <span className="font-semibold text-stone-400 block text-xs">
                                        0 Orders
                                      </span>
                                      <span className="text-[10px] text-stone-400">
                                        No purchases yet
                                      </span>
                                    </div>
                                  );
                                }

                                return (
                                  <div>
                                    <span className="font-bold text-forest-950 block">
                                      {orderCount} {orderCount === 1 ? 'Order' : 'Orders'}
                                    </span>
                                    <span className="text-[11px] text-emerald-700 font-semibold">
                                      ₹{spentAmount} spent
                                    </span>
                                  </div>
                                );
                              })()}
                            </td>

                            <td className="py-3 px-4 font-mono text-stone-600">
                              {user.lastLogin}
                            </td>

                            <td className="py-3 px-4">
                              <span
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                  user.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-800'
                                    : 'bg-stone-200 text-stone-600'
                                }`}
                              >
                                {user.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}
          {/* ============================================================ */}
          {/* PRODUCTS MANAGEMENT                                          */}
          {/* ============================================================ */}
          {activeTab === 'products' && (
            <div className="space-y-4">
              
              {/* 2. Search Bar */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-96">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search oils by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 bg-stone-50/50"
                  />
                </div>
                <div className="text-xs text-stone-500 font-semibold">
                  Total Products: <span className="text-forest-950 font-bold">{productsList.length}</span>
                </div>
              </div>

              {/* 3. Products List Rendering (Table) */}
              {(() => {
                const filteredProducts = productsList.filter((p) => {
                  const matchesSearch =
                    !searchTerm ||
                    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    p.tagline.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    (p.categoryName && p.categoryName.toLowerCase().includes(searchTerm.toLowerCase()));
                  return matchesSearch;
                });

                if (filteredProducts.length === 0) {
                  return (
                    <div className="bg-white rounded-3xl border-2 border-dashed border-stone-300 p-12 text-center space-y-3">
                      <Package className="w-10 h-10 text-stone-400 mx-auto" />
                      <h4 className="font-serif font-bold text-base text-forest-950">
                        No oils found matching your search
                      </h4>
                      <p className="text-xs text-stone-500 max-w-sm mx-auto">
                        Try typing a different name or clearing your search term.
                      </p>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm('');
                        }}
                        className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold transition-all cursor-pointer"
                      >
                        Clear Search
                      </button>
                    </div>
                  );
                }

                return (
                  <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-serif">
                          <tr>
                            <th className="py-3 px-4 font-bold">Product</th>
                            <th className="py-3 px-4 font-bold text-center">Home</th>
                            <th className="py-3 px-4 font-bold">Category</th>
                            <th className="py-3 px-4 font-bold">Extraction Method</th>
                            <th className="py-3 px-4 font-bold">Price / MRP</th>
                            <th className="py-3 px-4 font-bold">Pack Sizes Available</th>
                            <th className="py-3 px-4 font-bold">Stock Status</th>
                            <th className="py-3 px-4 font-bold text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {filteredProducts.map((prod) => {
                            const isHomepageActive = currentHomepageProductIds.includes(prod.id);
                            return (
                              <tr key={prod.id} className="hover:bg-amber-50/20">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-3">
                                    <img
                                      src={prod.image}
                                      alt={prod.name}
                                      className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-50"
                                    />
                                    <div>
                                      <div className="flex items-center gap-2">
                                        <span className="font-bold text-stone-900 block">{prod.name}</span>
                                      </div>
                                      <span className="text-[11px] text-stone-500 line-clamp-1">
                                        {prod.tagline}
                                      </span>
                                    </div>
                                  </div>
                                </td>

                                <td className="py-3 px-4 text-center">
                                  <input
                                    type="checkbox"
                                    checked={isHomepageActive}
                                    onChange={() => handleToggleHomepageProduct(prod.id)}
                                    className="w-5 h-5 rounded border-stone-300 text-forest-900 focus:ring-forest-900 cursor-pointer accent-forest-900"
                                    title={isHomepageActive ? "Active on Home" : "Off"}
                                  />
                                </td>

                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-800 border border-stone-200">
                                    {prod.categoryName || prod.category}
                                  </span>
                                </td>

                                <td className="py-3 px-4">
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-200">
                                    {prod.extractionMethod}
                                  </span>
                                </td>

                                <td className="py-3 px-4">
                                  <span className="font-serif font-black text-sm text-forest-950 block">
                                    ₹{prod.price}
                                  </span>
                                  <span className="text-[11px] text-stone-400 line-through">
                                    MRP ₹{prod.originalPrice}
                                  </span>
                                </td>

                                <td className="py-3 px-4">
                                  <div className="flex flex-wrap gap-1 max-w-xs">
                                    {prod.packSizes.map((pack) => (
                                      <span
                                        key={pack}
                                        className="px-1.5 py-0.5 rounded bg-stone-100 text-[10px] text-stone-700"
                                      >
                                        {pack}
                                      </span>
                                    ))}
                                  </div>
                                </td>

                                <td className="py-3 px-4">
                                  <button
                                    onClick={() => handleToggleStock(prod.id)}
                                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold border flex items-center gap-1 cursor-pointer ${
                                      prod.inStock
                                        ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                                        : 'bg-red-100 text-red-800 border-red-300'
                                    }`}
                                  >
                                    {prod.inStock ? (
                                      <>
                                        <CheckCircle className="w-3 h-3 text-emerald-600" />
                                        <span>In Stock</span>
                                      </>
                                    ) : (
                                      <>
                                        <AlertCircle className="w-3 h-3 text-red-600" />
                                        <span>Out of Stock</span>
                                      </>
                                    )}
                                  </button>
                                </td>

                                <td className="py-3 px-4 text-right">
                                  <div className="flex items-center justify-end gap-1.5">
                                    <button
                                      type="button"
                                      onClick={() => openEditProduct(prod)}
                                      className="px-2.5 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-xs"
                                      title="Edit product"
                                    >
                                      <Edit className="w-3.5 h-3.5 text-amber-600" />
                                      <span>Edit</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteProduct(prod.id)}
                                      className="p-1.5 rounded-xl text-stone-400 hover:text-red-600 hover:bg-red-50 border border-transparent hover:border-red-200 transition-colors cursor-pointer"
                                      title="Delete product"
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
                  </div>
                );
              })()}

            </div>
          )}

          {/* ============================================================ */}
          {/* ORDERS MANAGEMENT VIEW                                       */}
          {/* ============================================================ */}
          {activeTab === 'orders' && (
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-5">
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between border-b border-stone-100 pb-4">
                <div>
                  <h3 className="font-serif font-black text-xl text-stone-900">
                    Orders Management ({orders.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Live orders, payment confirmation & dispatch tracking
                  </p>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 uppercase font-bold text-[10px] tracking-wider border-b border-stone-200">
                    <tr>
                      <th className="py-3 px-4">Order ID</th>
                      <th className="py-3 px-4">Customer</th>
                      <th className="py-3 px-4">Phone</th>
                      <th className="py-3 px-4">Items</th>
                      <th className="py-3 px-4">Total</th>
                      <th className="py-3 px-4">Payment</th>
                      <th className="py-3 px-4">Order Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {orders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-amber-50/20">
                        <td className="py-3 px-4 font-mono font-bold text-stone-900">{ord.orderNumber}</td>
                        <td className="py-3 px-4 font-semibold text-stone-900">{ord.customerName}</td>
                        <td className="py-3 px-4 text-stone-500 font-mono">{ord.customerPhone}</td>
                        <td className="py-3 px-4 text-stone-600">{ord.items.map((i) => `${i.productName} (${i.packSize})`).join(', ')}</td>
                        <td className="py-3 px-4 font-serif font-black text-stone-900">₹{ord.totalAmount}</td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            ord.paymentStatus === 'PAID' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.paymentStatus} ({ord.paymentMethod})
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as PlacedOrder['orderStatus'])}
                            className="px-2.5 py-1 rounded-xl text-xs font-bold border border-stone-300 bg-white cursor-pointer focus:outline-none focus:border-[#1e7e34]"
                          >
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="PACKED">PACKED</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                          {ord.cancelReason && (
                            <div className="mt-1 text-[10px] text-red-700 bg-red-50 px-2 py-0.5 rounded-lg border border-red-200 font-medium max-w-[200px]">
                              Reason: {ord.cancelReason}
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* OFFERS & COUPONS VIEW                                        */}
          {/* ============================================================ */}
          {activeTab === 'offers' && (
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-serif font-black text-xl text-stone-900">
                  Offers & Discount Coupons
                </h3>
                <p className="text-xs text-stone-500">
                  Manage active discount vouchers, promotional banners, and festival codes
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {[
                  { code: 'FESTIVE16', discount: '16% OFF', title: 'Festive Oil Combo Deal', status: 'Active', exp: 'Valid till 31 Oct 2026' },
                  { code: 'MARACHEKKU10', discount: '10% OFF', title: 'Wood-Pressed Welcome Offer', status: 'Active', exp: 'Valid for new customers' },
                  { code: 'FREESHIP499', discount: 'FREE SHIPPING', title: 'Free Home Delivery on ₹499+', status: 'Active', exp: 'Permanent coupon' },
                  { code: 'NITHYAMFREE', discount: '250ml FREE', title: 'Buy 2x1L Nithyam Get 250ml Free', status: 'Active', exp: 'Limited festive stock' },
                ].map((c) => (
                  <div key={c.code} className="p-5 rounded-2xl border border-dashed border-[#1e7e34] bg-emerald-50/40 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-mono text-sm font-black text-[#1e7e34] bg-white px-2.5 py-1 rounded-lg border border-emerald-200 shadow-2xs">
                          {c.code}
                        </span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          {c.status}
                        </span>
                      </div>
                      <h4 className="font-serif font-bold text-sm text-stone-900 mt-2">{c.title}</h4>
                      <p className="text-xs font-bold text-amber-700 mt-1">{c.discount}</p>
                      <p className="text-[11px] text-stone-400 mt-1">{c.exp}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* CONTENT MANAGEMENT VIEW                                      */}
          {/* ============================================================ */}
          {activeTab === 'content' && (
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-serif font-black text-xl text-stone-900">
                  Storefront Content & Storylines
                </h3>
                <p className="text-xs text-stone-500">
                  Manage heritage storytelling, Vaagai wood chekku visualizer, and FAQ content
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <h4 className="font-serif font-bold text-base text-stone-900">The Mara Chekku Experience</h4>
                  <p className="text-xs text-stone-600">5 Generational Milestones Interactive Visualizer is live on homepage.</p>
                  <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Active & Synchronized
                  </span>
                </div>

                <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-base text-stone-900">Mara Chekku Heritage Video</h4>
                    <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                      Active on Homepage
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Featured live wood pressing heritage showcase video configured on homepage.
                  </p>
                  <button
                    onClick={() => handleTabChange('videos')}
                    className="px-4 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Video className="w-3.5 h-3.5 text-gold-400" />
                    <span>Manage Homepage Video →</span>
                  </button>
                </div>

                <div className="p-5 rounded-2xl border border-amber-200 bg-amber-50/40 space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-base text-stone-900">Products</h4>
                    <span className="inline-block text-[11px] font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full">
                      {currentHomepageProductIds.length} Oils Active on Home
                    </span>
                  </div>
                  <p className="text-xs text-stone-600">
                    Manage catalog oils and toggle which ones appear prominently on the storefront homepage.
                  </p>
                  <button
                    onClick={() => handleTabChange('products')}
                    className="px-4 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Package className="w-3.5 h-3.5 text-gold-400" />
                    <span>Manage Oils & Homepage Selection →</span>
                  </button>
                </div>
              </div>

              {/* SECTION: Homepage Quality Pillars Center Banner Photo */}
              <div className="p-6 rounded-2xl border border-amber-200/90 bg-[#FFFDF5] space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-amber-200/60 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-md">
                      Quality Pillars Center Image
                    </span>
                    <h4 className="font-serif font-black text-lg text-stone-900 mt-1">
                      Homepage 4 Quality Pillars Center Banner Photo
                    </h4>
                    <p className="text-xs text-stone-600">
                      Change or upload the center bottle photo displayed in the 4 quality pillars section on the homepage.
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full shrink-0">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    Live on Homepage
                  </span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                  {/* Left: Preview */}
                  <div className="lg:col-span-4 flex flex-col items-center">
                    <div className="relative rounded-3xl overflow-hidden shadow-sm max-w-[280px] w-full border border-amber-300/70 bg-[#FFF9D5] p-5 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider mb-2">Live Preview</span>
                      <div className="h-56 w-full flex items-center justify-center rounded-2xl overflow-hidden bg-white/60">
                        <img
                          src={settings.qualityBannerImage || '/quality_banner_bottles.jpg'}
                          alt="Quality Pillars Center Preview"
                          className="w-full h-full object-contain drop-shadow-md"
                        />
                      </div>
                      <div className="mt-3 px-3 py-1 rounded-full bg-forest-950 text-gold-300 text-[10px] font-bold uppercase tracking-wider shadow-sm">
                        <span className="truncate max-w-[200px]">{settings.qualityBannerBadge || '100% Mara Chekku • SS OIL Heritage'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Upload & Controls */}
                  <div className="lg:col-span-8 space-y-4">
                    {/* Upload File from PC */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1.5">
                        Upload New Photo from Computer:
                      </label>
                      <label className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-stone-800 text-xs font-bold cursor-pointer shadow-xs transition-all hover:border-amber-500">
                        <Upload className="w-4 h-4 text-amber-700" />
                        <span>Choose Photo (JPG, PNG, WebP)</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) =>
                            handleImageFileUpload(e, (url) => {
                              setSettings((prev) => ({ ...prev, qualityBannerImage: url }));
                              updateStoreSettings({ qualityBannerImage: url });
                              showToast('Quality Pillars image updated and saved!');
                            })
                          }
                        />
                      </label>
                    </div>

                    {/* Image URL Input */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Or Enter Direct Image URL:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.qualityBannerImage || ''}
                          onChange={(e) => setSettings((prev) => ({ ...prev, qualityBannerImage: e.target.value }))}
                          placeholder="/quality_banner_bottles.jpg or https://..."
                          className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateStoreSettings({ qualityBannerImage: settings.qualityBannerImage });
                            showToast('Quality Pillars image URL saved!');
                          }}
                          className="px-4 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
                        >
                          Save URL
                        </button>
                      </div>
                    </div>

                    {/* Badge Text Input */}
                    <div>
                      <label className="block text-xs font-bold text-stone-800 mb-1">
                        Bottom Badge Seal Text:
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={settings.qualityBannerBadge || ''}
                          onChange={(e) => setSettings((prev) => ({ ...prev, qualityBannerBadge: e.target.value }))}
                          placeholder="100% Mara Chekku • SS OIL Heritage"
                          className="flex-1 px-3.5 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 bg-white"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateStoreSettings({ qualityBannerBadge: settings.qualityBannerBadge });
                            showToast('Badge seal text saved!');
                          }}
                          className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all border border-stone-300 cursor-pointer shadow-xs"
                        >
                          Update Badge
                        </button>
                      </div>
                    </div>

                    {/* Presets Quick Chooser */}
                    <div>
                      <span className="block text-[11px] font-bold text-stone-500 mb-1.5 uppercase tracking-wider">
                        Quick Select Presets:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { label: 'SS OIL Trio Packshot (Default)', url: '/quality_banner_bottles.jpg' },
                          { label: 'Salem Bottling Line', url: '/craft_stage_bottling.jpg' },
                          { label: 'Vaagai Mara Chekku Churn', url: '/craft_stage_churn.jpg' },
                          { label: 'Sun-Cured Seeds', url: '/craft_stage_seeds.jpg' },
                        ].map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => {
                              setSettings((prev) => ({ ...prev, qualityBannerImage: preset.url }));
                              updateStoreSettings({ qualityBannerImage: preset.url });
                              showToast(`Applied preset: ${preset.label}`);
                            }}
                            className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all cursor-pointer ${
                              (settings.qualityBannerImage || '/quality_banner_bottles.jpg') === preset.url
                                ? 'bg-amber-100 border-amber-600 text-amber-950 font-bold shadow-2xs'
                                : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* HOMEPAGE SINGLE FEATURED VIDEO MANAGEMENT VIEW                */}
          {/* ============================================================ */}
          {activeTab === 'videos' && (
            <div className="space-y-6 max-w-5xl mx-auto">
              
              {/* Master Card */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6">
                
                {/* Header with Switch */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                      <h3 className="font-serif font-black text-xl text-stone-900">
                        Mara Chekku Heritage Video
                      </h3>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Display a single featured heritage video on the homepage. Change or update it below.
                    </p>
                  </div>

                  {/* Clean ON / OFF Pill Toggle */}
                  <button
                    type="button"
                    onClick={() => setVideoForm((prev) => ({ ...prev, enabled: !prev.enabled }))}
                    className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border ${
                      videoForm.enabled
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300 shadow-2xs'
                        : 'bg-stone-100 text-stone-500 border-stone-200'
                    }`}
                  >
                    <span className={`w-2.5 h-2.5 rounded-full ${videoForm.enabled ? 'bg-emerald-500' : 'bg-stone-400'}`} />
                    <span>{videoForm.enabled ? 'Video Active on Homepage 🟢' : 'Video Hidden ⚪'}</span>
                  </button>
                </div>

                {/* 1. Live Video Preview Box (Right at the top) */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-600 flex items-center gap-1.5">
                      <Eye className="w-3.5 h-3.5 text-forest-800" />
                      <span>Current Active Video</span>
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                      {videoForm.videoType === 'youtube' ? 'YouTube Stream' : 'Local / MP4 Video'}
                    </span>
                  </div>

                  <div className="rounded-2xl overflow-hidden border-2 border-stone-200 shadow-md bg-black aspect-video max-h-[360px] w-full mx-auto relative flex items-center justify-center">
                    {videoForm.videoType === 'youtube' && videoForm.videoUrl ? (
                      <iframe
                        src={getYouTubeEmbedUrl(videoForm.videoUrl) || ''}
                        title="Preview"
                        className="w-full h-full border-0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    ) : (
                      <video
                        key={videoForm.videoUrl}
                        src={videoForm.videoUrl || '/videos/reel_1.mp4'}
                        poster={videoForm.posterUrl || '/products/sesame_oil.jpg'}
                        controls
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                </div>

                <form onSubmit={handleSaveFeaturedVideo} className="space-y-5">
                  
                  {/* 2. Choose Video Source / Replace Video */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-stone-800">
                        Replace Video
                      </label>
                      <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        Only 1 Video
                      </span>
                    </div>
                    <p className="text-[11px] text-stone-500">
                      Upload a new video file or provide a YouTube link to instantly replace the current video on the homepage.
                    </p>

                    {/* Format Buttons */}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setVideoForm((prev) => ({ ...prev, videoType: 'mp4' }))}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          videoForm.videoType === 'mp4'
                            ? 'bg-forest-950 text-white border-forest-950 shadow-xs'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        📁 Video File / MP4
                      </button>
                      <button
                        type="button"
                        onClick={() => setVideoForm((prev) => ({ ...prev, videoType: 'youtube' }))}
                        className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                          videoForm.videoType === 'youtube'
                            ? 'bg-forest-950 text-white border-forest-950 shadow-xs'
                            : 'bg-white text-stone-600 border-stone-200 hover:bg-stone-100'
                        }`}
                      >
                        ▶ YouTube Link
                      </button>
                    </div>

                    {/* Input Row */}
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={videoForm.videoUrl}
                        onChange={(e) => setVideoForm((prev) => ({ ...prev, videoUrl: e.target.value }))}
                        placeholder={videoForm.videoType === 'youtube' ? 'Paste YouTube link (e.g. https://www.youtube.com/watch?v=...)' : 'Enter video path or upload from PC (e.g. /videos/heritage_video.mp4)'}
                        className="flex-1 px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 bg-white font-mono"
                      />

                      {videoForm.videoType === 'mp4' && (
                        <label className="px-4 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shrink-0 shadow-xs justify-center">
                          <Upload className="w-3.5 h-3.5 text-gold-400" />
                          <span>Upload & Replace from PC</span>
                          <input
                            type="file"
                            accept="video/mp4,video/webm"
                            className="hidden"
                            onChange={(e) => handleVideoFileUpload(e, (url) => setVideoForm((prev) => ({ ...prev, videoUrl: url })))}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Clean Save Button Bar */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-2xl bg-[#1e7e34] hover:bg-[#18682a] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                    >
                      <Save className="w-4 h-4 text-gold-300" />
                      <span>Save Video</span>
                    </button>

                    <button
                      type="button"
                      onClick={onBackToStore}
                      className="px-5 py-3.5 rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold text-xs transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View on Store</span>
                    </button>
                  </div>

                </form>

              </div>

            </div>
          )}

          {/* ============================================================ */}
          {/* ANALYTICS & PERFORMANCE VIEW                                 */}
          {/* ============================================================ */}
          {activeTab === 'analytics' && (
            <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs p-6 space-y-6">
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-serif font-black text-xl text-stone-900">
                  Store Sales & Order Performance
                </h3>
                <p className="text-xs text-stone-500">
                  Analytics, repeat customer rate, and bestselling wood-pressed varieties
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="p-5 rounded-2xl bg-amber-50/60 border border-amber-200 space-y-1">
                  <span className="text-[11px] font-bold text-amber-900 uppercase tracking-wider">Top Selling Oil</span>
                  <h4 className="font-serif font-black text-xl text-amber-950">Groundnut Oil (48%)</h4>
                  <p className="text-xs text-amber-800">1L & 5L most requested packs</p>
                </div>

                <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-900 uppercase tracking-wider">Repeat Rate</span>
                  <h4 className="font-serif font-black text-xl text-emerald-950">84.2%</h4>
                  <p className="text-xs text-emerald-800">Monthly household subscribers</p>
                </div>

                <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-1">
                  <span className="text-[11px] font-bold text-blue-900 uppercase tracking-wider">Average Order Value</span>
                  <h4 className="font-serif font-black text-xl text-blue-950">₹820</h4>
                  <p className="text-xs text-blue-800">2.1 bottles per shipment</p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================ */}
          {/* 5. SETTINGS VIEW: EXACT MATCH TO USER SCREENSHOT             */}
          {/* ============================================================ */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-7xl mx-auto">
              
              {/* Page Title & Subtitle */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#1e7e34]/10 text-[#1e7e34] flex items-center justify-center shrink-0">
                  <Settings className="w-6 h-6 stroke-[2.2]" />
                </div>
                <div>
                  <h1 className="text-2xl sm:text-3xl font-serif font-black text-stone-900 tracking-tight">
                    Settings
                  </h1>
                  <p className="text-xs sm:text-sm text-stone-500 font-medium">
                    Manage your store settings and preferences
                  </p>
                </div>
              </div>

              {/* Sub-Navigation Tabs Bar (Appearance, Notifications, SEO removed per request) */}
              <div className="bg-white rounded-2xl p-1.5 border border-stone-200/80 shadow-2xs flex items-center gap-1.5 overflow-x-auto scrollbar-none select-none">
                {[
                  { id: 'store', label: 'Store Settings', icon: Store },
                  { id: 'payment', label: 'Payment & UPI', icon: CreditCard },
                  { id: 'shipping', label: 'Shipping & Delivery', icon: Truck },
                  { id: 'system', label: 'System & Security', icon: ShieldCheck },
                ].map((tab) => {
                  const Icon = tab.icon;
                  const isActive = settingsSubTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setSettingsSubTab(tab.id as SettingsSubTab)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer shrink-0 ${
                        isActive
                          ? 'bg-[#1e7e34] text-white shadow-xs'
                          : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{tab.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* TAB 1: Store Settings (The Exact 2x2 Grid View from Screenshot) */}
              {settingsSubTab === 'store' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  
                  {/* CARD 1: Store Information */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#1e7e34] flex items-center justify-center">
                          <Store className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif font-bold text-base text-stone-900">
                          Store Information
                        </h3>
                      </div>
                      <p className="text-xs text-stone-400 mb-5 ml-9">
                        Update your store basic details
                      </p>

                      <div className="grid grid-cols-1 sm:grid-cols-12 gap-5">
                        {/* Logo Box */}
                        <div className="sm:col-span-4 flex flex-col items-center justify-center">
                          <div className="w-28 h-28 rounded-2xl border border-stone-200 bg-amber-50/20 p-2 flex flex-col items-center justify-center mb-2.5 shadow-2xs overflow-hidden">
                            <img
                              src={settings.logoUrl || "/admin_assets/ss_gold_drop_logo.png"}
                              alt={settings.storeName || "Logo"}
                              className="h-14 w-14 object-contain rounded-xl drop-shadow"
                            />
                            <span className="text-[11px] font-serif font-black text-stone-900 mt-1 leading-tight text-center truncate max-w-full">
                              {settings.storeName || "ss oil"}
                            </span>
                            <span className="text-[7px] text-emerald-700 font-bold uppercase tracking-wider text-center truncate max-w-full">
                              {settings.tagline || 'Pure & Healthy'}
                            </span>
                          </div>

                          <div className="flex flex-col items-center gap-1.5 w-full">
                            <label className="w-full text-center px-3 py-1.5 rounded-xl border border-stone-200 bg-white hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer shadow-2xs transition-all">
                              <span>Upload New Logo</span>
                              <input
                                type="file"
                                accept="image/*"
                                className="hidden"
                                onChange={async (e) => {
                                  const file = e.target.files?.[0];
                                  if (file) {
                                    try {
                                      const optimized = await resizeImageFile(file, 256);
                                      setSettings((prev) => ({ ...prev, logoUrl: optimized }));
                                      showToast('Store logo updated! Click "Save Changes" to apply.');
                                    } catch (err) {
                                      const reader = new FileReader();
                                      reader.onload = () => {
                                        setSettings((prev) => ({ ...prev, logoUrl: reader.result as string }));
                                        showToast('Store logo updated! Click "Save Changes" to apply.');
                                      };
                                      reader.readAsDataURL(file);
                                    }
                                  }
                                }}
                              />
                            </label>

                            {/* Preset Quick Selectors */}
                            <div className="flex items-center gap-1.5 mt-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setSettings((prev) => ({ ...prev, logoUrl: '/admin_assets/ss_gold_drop_logo.png' }));
                                  showToast("SS Oil Gold Drop logo selected! Click 'Save Changes' to apply.");
                                }}
                                className="text-[10px] px-2 py-0.5 rounded-lg border border-amber-200 bg-amber-50 text-amber-800 hover:bg-amber-100 font-medium cursor-pointer"
                                title="Default Drop Logo"
                              >
                                SS Oil (Gold Drop)
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSettings((prev) => ({ ...prev, logoUrl: '/admin_assets/ssoil_logo.png' }));
                                  showToast("SS Oil Emblem logo selected! Click 'Save Changes' to apply.");
                                }}
                                className="text-[10px] px-2 py-0.5 rounded-lg border border-stone-200 bg-stone-100 text-stone-700 hover:bg-stone-200 font-medium cursor-pointer"
                                title="Traditional Emblem"
                              >
                                SS Oil (Emblem)
                              </button>
                            </div>
                          </div>
                        </div>

                        {/* Form Inputs */}
                        <div className="sm:col-span-8 space-y-3">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Store Name
                            </label>
                            <input
                              type="text"
                              value={settings.storeName}
                              onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1e7e34] bg-white text-stone-900 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Tagline
                            </label>
                            <input
                              type="text"
                              value={settings.tagline}
                              onChange={(e) => setSettings({ ...settings, tagline: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1e7e34] bg-white text-stone-900 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Description
                            </label>
                            <textarea
                              rows={3}
                              value={settings.description}
                              onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1e7e34] bg-white text-stone-900 font-medium resize-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Homepage Products Display
                            </label>
                            <select
                              value={settings.homepageProductsLimit || 4}
                              onChange={(e) => setSettings({ ...settings, homepageProductsLimit: Number(e.target.value) })}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1e7e34] bg-white text-stone-900 font-medium cursor-pointer"
                            >
                              <option value={4}>4 Products (Recommended)</option>
                              <option value={6}>6 Products</option>
                              <option value={8}>8 Products</option>
                              <option value={999}>All Products</option>
                            </select>
                            <p className="text-[10px] text-stone-400 mt-1">
                              Choose how many featured products are shown on the homepage.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex justify-end">
                      <button
                        onClick={() => handleSaveSettings()}
                        className="px-5 py-2 rounded-xl bg-[#1e7e34] hover:bg-[#18682a] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>

                  {/* CARD 2: Top Announcement Bar (Directly controls the top header grey banner) */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#1e7e34] flex items-center justify-center">
                          <Globe className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif font-bold text-base text-stone-900">
                          Top Announcement Bar
                        </h3>
                      </div>
                      <p className="text-xs text-stone-400 mb-5 ml-9">
                        Configure the announcement banner displayed at top of customer pages
                      </p>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            Primary Announcement Text (Left)
                          </label>
                          <input
                            type="text"
                            value={settings.announcementText || ''}
                            onChange={(e) => setSettings({ ...settings, announcementText: e.target.value })}
                            placeholder="e.g. Pure Oils, Trusted Since 1957"
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1e7e34] bg-white text-stone-900 font-medium"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-semibold text-stone-700 mb-1">
                            Secondary Badge Text (Right)
                          </label>
                          <input
                            type="text"
                            value={settings.announcementSubText || ''}
                            onChange={(e) => setSettings({ ...settings, announcementSubText: e.target.value })}
                            placeholder="e.g. 10,000+ Kitchens Served"
                            className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1e7e34] bg-white text-stone-900 font-medium"
                          />
                        </div>

                        <div className="flex items-center justify-between pt-2">
                          <div>
                            <span className="text-xs font-bold text-stone-800 block">Show Announcement Bar</span>
                            <span className="text-[11px] text-stone-400">Display this header banner to store visitors</span>
                          </div>
                          <button
                            type="button"
                            onClick={() => setSettings({ ...settings, announcementEnabled: !settings.announcementEnabled })}
                            className={`w-11 h-6 flex items-center rounded-full p-1 cursor-pointer transition-colors duration-200 ${
                              settings.announcementEnabled !== false ? 'bg-[#1e7e34]' : 'bg-stone-300'
                            }`}
                          >
                            <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                              settings.announcementEnabled !== false ? 'translate-x-5' : 'translate-x-0'
                            }`} />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex justify-end">
                      <button
                        onClick={() => handleSaveSettings()}
                        className="px-5 py-2 rounded-xl bg-[#1e7e34] hover:bg-[#18682a] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>

                  {/* CARD 3: Store Contact & Mill Details (Directly updates Footer & Contact Page) */}
                  <div className="bg-white rounded-2xl sm:rounded-3xl border border-stone-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between lg:col-span-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-lg bg-emerald-50 text-[#1e7e34] flex items-center justify-center">
                          <Store className="w-4 h-4" />
                        </div>
                        <h3 className="font-serif font-bold text-base text-stone-900">
                          Contact & Mill Details
                        </h3>
                      </div>
                      <p className="text-xs text-stone-400 mb-5 ml-9">
                        Updates customer Footer desk, Contact page, and statutory information
                      </p>

                      <div className="space-y-4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Phone / Customer Care
                            </label>
                            <input
                              type="text"
                              value={settings.phone || ''}
                              onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                              placeholder="+91 98765 43210"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1e7e34] bg-white text-stone-900 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Support Email
                            </label>
                            <input
                              type="email"
                              value={settings.email || ''}
                              onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                              placeholder="care@ssoil.in"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1e7e34] bg-white text-stone-900 font-medium"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Mill & Factory Physical Address
                            </label>
                            <input
                              type="text"
                              value={settings.millAddress || ''}
                              onChange={(e) => setSettings({ ...settings, millAddress: e.target.value })}
                              placeholder="e.g. 42 Chekku Street, Salem, Tamil Nadu"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1e7e34] bg-white text-stone-900 font-medium"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Working / Mill Desk Hours
                            </label>
                            <input
                              type="text"
                              value={settings.millHours || ''}
                              onChange={(e) => setSettings({ ...settings, millHours: e.target.value })}
                              placeholder="Mon – Sat: 9:00 AM – 7:30 PM IST"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-200 text-xs focus:outline-none focus:border-[#1e7e34] bg-white text-stone-900 font-medium"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex justify-end">
                      <button
                        onClick={() => handleSaveSettings()}
                        className="px-5 py-2 rounded-xl bg-[#1e7e34] hover:bg-[#18682a] text-white text-xs font-bold transition-all shadow-xs cursor-pointer active:scale-98"
                      >
                        Save Changes
                      </button>
                    </div>
                  </div>

                </div>
              )}

              {/* SUBTAB 2: Payment Subtab */}
              {settingsSubTab === 'payment' && (
                <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <h3 className="font-serif font-black text-xl text-stone-900">
                      Payment Gateways & UPI
                    </h3>
                    <p className="text-xs text-stone-500">
                      Configure live UPI, Razorpay credentials, and Cash on Delivery
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        UPI VPA Address
                      </label>
                      <input
                        type="text"
                        value={settings.upiVpa}
                        onChange={(e) => setSettings({ ...settings, upiVpa: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#1e7e34]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Razorpay Live Key ID
                      </label>
                      <input
                        type="text"
                        value={settings.razorpayKeyId}
                        onChange={(e) => setSettings({ ...settings, razorpayKeyId: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#1e7e34]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 3: Shipping Subtab */}
              {settingsSubTab === 'shipping' && (
                <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <h3 className="font-serif font-black text-xl text-stone-900">
                      Shipping Rates & Free Delivery
                    </h3>
                    <p className="text-xs text-stone-500">
                      Configure delivery minimums, flat rates, and GST calculations
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Free Delivery Minimum (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.freeDeliveryThreshold}
                        onChange={(e) => setSettings({ ...settings, freeDeliveryThreshold: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#1e7e34]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Flat Shipping Fee (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.deliveryFee}
                        onChange={(e) => setSettings({ ...settings, deliveryFee: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#1e7e34]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        GST Rate (%)
                      </label>
                      <input
                        type="number"
                        value={settings.gstRate}
                        onChange={(e) => setSettings({ ...settings, gstRate: Number(e.target.value) })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-[#1e7e34]"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* SUBTAB 4: System Subtab */}
              {settingsSubTab === 'system' && (
                <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <h3 className="font-serif font-black text-xl text-stone-900">
                      System Status & Database
                    </h3>
                    <p className="text-xs text-stone-500">
                      TiDB Cloud MySQL live connection and server diagnostics
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950">TiDB Cloud Serverless MySQL</h4>
                        <p className="text-[11px] text-emerald-800">Connected & Synced (SSL Active)</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-emerald-800 shadow-2xs">
                      Live 🟢
                    </span>
                  </div>
                </div>
              )}

              {/* SUBTAB 7: System Subtab */}
              {settingsSubTab === 'system' && (
                <div className="bg-white rounded-3xl border border-stone-200/80 p-6 sm:p-8 space-y-6">
                  <div className="border-b border-stone-100 pb-4">
                    <h3 className="font-serif font-black text-xl text-stone-900">
                      System Status & Database
                    </h3>
                    <p className="text-xs text-stone-500">
                      TiDB Cloud MySQL live connection and server diagnostics
                    </p>
                  </div>

                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping" />
                      <div>
                        <h4 className="text-xs font-bold text-emerald-950">TiDB Cloud Serverless MySQL</h4>
                        <p className="text-[11px] text-emerald-800">Connected & Synced (SSL Active)</p>
                      </div>
                    </div>
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white text-emerald-800 shadow-2xs">
                      Live 🟢
                    </span>
                  </div>
                </div>
              )}

            </div>
          )}

          {/* ============================================================ */}
          {/* GLOBAL ADD CATEGORY MODAL (Accessible from any tab or dialog) */}
          {/* ============================================================ */}
          {isAddCategoryOpen && (
            <div className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
              <div className="bg-white w-full max-w-xl rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
                
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                      Create Category
                    </span>
                    <h3 className="font-serif font-black text-xl text-forest-950">
                      Add New Category
                    </h3>
                  </div>
                  <button
                    onClick={() => setIsAddCategoryOpen(false)}
                    className="text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-lg hover:bg-stone-100"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddCategory} className="space-y-5">
                  
                  {/* Image Picker */}
                  <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      1. Category Image
                    </label>

                    <div className="flex flex-col sm:flex-row items-center gap-4">
                      <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-stone-300 shadow-xs shrink-0 bg-stone-100">
                        <img
                          src={newCatImage}
                          alt="Preview"
                          className="w-full h-full object-cover"
                        />
                      </div>

                      <div className="flex-1 space-y-2 w-full">
                        <label className="px-3.5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs">
                          <Upload className="w-3.5 h-3.5 text-gold-400" />
                          <span>Upload Image from Device</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageFileUpload(e, setNewCatImage)}
                          />
                        </label>

                        <input
                          type="text"
                          value={newCatImage}
                          onChange={(e) => setNewCatImage(e.target.value)}
                          placeholder="Image URL"
                          className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-forest-900 bg-white"
                        />
                      </div>
                    </div>

                    {/* Presets */}
                    <div className="pt-2 border-t border-stone-200">
                      <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                        ⚡ Quick Presets:
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {PRESET_IMAGES.map((preset) => (
                          <button
                            key={preset.name}
                            type="button"
                            onClick={() => setNewCatImage(preset.url)}
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                              newCatImage === preset.url
                                ? 'bg-forest-950 text-gold-300 border-forest-950'
                                : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                            }`}
                          >
                            {preset.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Basic Fields */}
                  <div className="space-y-3">
                    <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                      2. Category Info
                    </label>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Category Title
                        </label>
                        <input
                          type="text"
                          required
                          value={newCatTitle}
                          onChange={(e) => setNewCatTitle(e.target.value)}
                          placeholder="e.g. Cold-Pressed Mustard Oil"
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Slug (Optional)
                        </label>
                        <input
                          type="text"
                          value={newCatSlug}
                          onChange={(e) => setNewCatSlug(e.target.value)}
                          placeholder="e.g. mustard-oil"
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-forest-900"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Subtitle / Description
                      </label>
                      <input
                        type="text"
                        value={newCatSubtitle}
                        onChange={(e) => setNewCatSubtitle(e.target.value)}
                        placeholder="e.g. Traditional pungent cold-pressed mustard oil"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Badge Tag
                      </label>
                      <input
                        type="text"
                        value={newCatBadge}
                        onChange={(e) => setNewCatBadge(e.target.value)}
                        placeholder="e.g. Pure Mara Chekku"
                        className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                      />
                    </div>
                  </div>

                  {/* Products to Link */}
                  <div className="p-4 rounded-2xl bg-amber-50/50 border border-amber-200/80 space-y-3">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold uppercase tracking-wider text-forest-950">
                        3. Select Products for this Category
                      </label>
                      <span className="text-[11px] font-bold text-amber-800">
                        {newCatAssignedProductIds.length} Selected
                      </span>
                    </div>

                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {productsList.map((product) => {
                        const isAssigned = newCatAssignedProductIds.includes(product.id);
                        return (
                          <div
                            key={product.id}
                            onClick={() => handleToggleProductInNew(product.id)}
                            className={`p-2.5 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${
                              isAssigned
                                ? 'bg-white border-forest-900 shadow-2xs'
                                : 'bg-white/60 border-stone-200 hover:border-stone-300 opacity-80'
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0"
                              />
                              <div>
                                <span className="font-bold text-xs text-stone-900 block">
                                  {product.name}
                                </span>
                                <span className="text-[10px] text-stone-500">
                                  ₹{product.price} • {product.extractionMethod}
                                </span>
                              </div>
                            </div>

                            <div className="shrink-0 text-forest-900">
                              {isAssigned ? (
                                <CheckSquare className="w-5 h-5 text-forest-950" />
                              ) : (
                                <Square className="w-5 h-5 text-stone-300" />
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex gap-3">
                    <button
                      type="button"
                      onClick={() => setIsAddCategoryOpen(false)}
                      className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                    >
                      <Plus className="w-4 h-4 text-gold-400" />
                      <span>Create Category</span>
                    </button>
                  </div>

                </form>

              </div>
            </div>
          )}



              {/* ============================================================ */}
              {/* EDIT PRODUCT MODAL                                           */}
              {/* ============================================================ */}
              {editingProduct && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
                    
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                          Product Editor
                        </span>
                        <h3 className="font-serif font-black text-xl text-forest-950">
                          Edit Oil: {editingProduct.name}
                        </h3>
                      </div>
                      <button
                        onClick={() => setEditingProduct(null)}
                        className="text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-lg hover:bg-stone-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveEditProduct} className="space-y-5">
                      
                      {/* 1. Product Image (Upload / URL / Quick Presets) */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          1. Product Image
                        </label>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          {/* Live Preview */}
                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-stone-300 shadow-xs shrink-0 bg-stone-100 relative">
                            {editProdImage ? (
                              <img
                                src={editProdImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-stone-400">
                                <ImageIcon className="w-8 h-8" />
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            <div className="flex items-center gap-2">
                              <label className="px-3.5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs">
                                <Upload className="w-3.5 h-3.5 text-gold-400" />
                                <span>Upload Image from Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, setEditProdImage)}
                                />
                              </label>
                              <span className="text-[11px] text-stone-400">or paste URL</span>
                            </div>

                            <input
                              type="text"
                              value={editProdImage}
                              onChange={(e) => setEditProdImage(e.target.value)}
                              placeholder="https://... or /products/sesame_oil.jpg"
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-forest-900 bg-white"
                            />
                          </div>
                        </div>

                        {/* Quick Presets Strip */}
                        <div className="pt-2 border-t border-stone-200">
                          <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                            ⚡ Quick 1-Click Oil Presets:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {PRESET_IMAGES.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => setEditProdImage(preset.url)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                                  editProdImage === preset.url
                                    ? 'bg-forest-950 text-gold-300 border-forest-950'
                                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                                }`}
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 2. Basic Details: Name, Tagline, Category, Badge */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          2. Basic Oil Information
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Product Name
                            </label>
                            <input
                              type="text"
                              required
                              value={editProdName}
                              onChange={(e) => setEditProdName(e.target.value)}
                              placeholder="e.g. Pure Mara Chekku Sesame Oil"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Tamil Name (Optional)
                            </label>
                            <input
                              type="text"
                              value={editProdTamilName}
                              onChange={(e) => setEditProdTamilName(e.target.value)}
                              placeholder="e.g. Cold-Pressed Sesame Oil"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold"
                            />
                          </div>

                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Tagline / Subtitle
                            </label>
                            <input
                              type="text"
                              value={editProdTagline}
                              onChange={(e) => setEditProdTagline(e.target.value)}
                              placeholder="e.g. Traditional Gingelly Oil with Palm Jaggery"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-stone-700">
                                Category
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewCatTitle('');
                                  setNewCatSubtitle('');
                                  setNewCatBadge('New Arrival');
                                  setNewCatSlug('');
                                  setNewCatImage('/products/sesame_oil.jpg');
                                  setNewCatAssignedProductIds([]);
                                  setIsAddCategoryOpen(true);
                                }}
                                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-850 flex items-center gap-0.5 cursor-pointer hover:underline"
                              >
                                <Plus className="w-3 h-3 text-emerald-600" />
                                <span>+ New Category</span>
                              </button>
                            </div>
                            <select
                              value={editProdCategory}
                              onChange={(e) => setEditProdCategory(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold bg-white"
                            >
                              {categoriesList.map((c) => (
                                <option key={c.id || c.slug} value={c.slug}>
                                  {c.title} ({c.slug})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Highlight Badge
                            </label>
                            <select
                              value={editProdBadge}
                              onChange={(e) => setEditProdBadge(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold bg-white"
                            >
                              <option value="">No Badge</option>
                              <option value="Bestseller">Bestseller</option>
                              <option value="Cold-Pressed">Cold-Pressed</option>
                              <option value="Wood-Pressed">Wood-Pressed</option>
                              <option value="100% Pure">100% Pure</option>
                              <option value="Popular">Popular</option>
                              <option value="Light & Pure">Light & Pure</option>
                              <option value="Heart Care">Heart Care</option>
                              <option value="Temple Pooja">Temple Pooja</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* 3. Pricing & Default Pack */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          3. Pricing & Default Packaging
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Selling Price (₹)
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={editProdPrice}
                              onChange={(e) => setEditProdPrice(Number(e.target.value))}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-serif font-black text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              MRP / Original Price (₹)
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={editProdOriginalPrice}
                              onChange={(e) => setEditProdOriginalPrice(Number(e.target.value))}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-serif font-black text-sm"
                            />
                            {editProdOriginalPrice > editProdPrice && (
                              <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                                {Math.round(((editProdOriginalPrice - editProdPrice) / editProdOriginalPrice) * 100)}% Discount Calculated
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Default Pack Unit
                            </label>
                            <input
                              type="text"
                              value={editProdDefaultPack}
                              onChange={(e) => setEditProdDefaultPack(e.target.value)}
                              placeholder="e.g. 1 Litre Bottle"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4. Pack & Can Sizes Section */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                            4. Available Can / Pack Sizes
                          </label>
                          <span className="text-[11px] text-stone-500 font-medium">
                            {editProdPackSizes.length} sizes configured
                          </span>
                        </div>

                        {/* Configured Pack Size Chips */}
                        <div className="flex flex-wrap gap-2 pt-0.5 min-h-[32px]">
                          {editProdPackSizes.length === 0 ? (
                            <span className="text-xs text-stone-400 italic">No pack sizes configured yet. Type below to add.</span>
                          ) : (
                            editProdPackSizes.map((pack) => (
                              <span
                                key={pack}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-forest-950 text-gold-300 border border-forest-950 shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5 text-gold-400" />
                                <span>{pack}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePackSizeEdit(pack)}
                                  className="w-4 h-4 ml-0.5 rounded-full bg-forest-800 hover:bg-red-600 text-white flex items-center justify-center text-[10px] cursor-pointer transition-colors"
                                  title="Remove this size"
                                >
                                  ✕
                                </button>
                              </span>
                            ))
                          )}
                        </div>

                        {/* Admin Type Custom Can/Pack Size Input */}
                        <div className="pt-2 border-t border-stone-200/80">
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            Type Custom Can / Pack Size:
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={editCustomPackInput}
                              onChange={(e) => setEditCustomPackInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCustomPackSizeEdit();
                                }
                              }}
                              placeholder="e.g. 5 Litre Can, 15 Litre Tin, 2 Litre Can, 500 ml Bottle..."
                              className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-forest-900 bg-white"
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomPackSizeEdit}
                              className="px-3.5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-xs active:scale-98"
                            >
                              <Plus className="w-3.5 h-3.5 text-gold-400" />
                              <span>Add Size</span>
                            </button>
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="pt-2 border-t border-stone-200/80">
                          <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                            ⚡ Quick Presets (Click to add / remove):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {ALL_PACK_OPTIONS.map((pack) => {
                              const isSelected = editProdPackSizes.includes(pack);
                              return (
                                <button
                                  key={pack}
                                  type="button"
                                  onClick={() => handleTogglePackSizeInEdit(pack)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${
                                    isSelected
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                                  }`}
                                >
                                  {isSelected ? `✓ ${pack}` : `+ ${pack}`}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* 5. Production Specifications & Inventory */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          5. Production Specs & Inventory Status
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Extraction Method
                            </label>
                            <input
                              type="text"
                              value={editProdExtraction}
                              onChange={(e) => setEditProdExtraction(e.target.value)}
                              placeholder="e.g. Traditional Vaagai Mara Chekku"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Smoke Point & Dish Recommendation
                            </label>
                            <input
                              type="text"
                              value={editProdSmokePoint}
                              onChange={(e) => setEditProdSmokePoint(e.target.value)}
                              placeholder="e.g. 210°C (Deep Frying & Seasoning)"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                            />
                          </div>
                        </div>

                        {/* Stock & Featured Checkboxes */}
                        <div className="flex flex-wrap items-center gap-4 pt-1">
                          <label className="inline-flex items-center gap-2 cursor-pointer bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200">
                            <input
                              type="checkbox"
                              checked={editProdInStock}
                              onChange={(e) => setEditProdInStock(e.target.checked)}
                              className="rounded text-forest-950 focus:ring-forest-950 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-stone-800">
                              In Stock
                            </span>
                          </label>

                          <label className="inline-flex items-center gap-2 cursor-pointer bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200">
                            <input
                              type="checkbox"
                              checked={editProdFeatured}
                              onChange={(e) => setEditProdFeatured(e.target.checked)}
                              className="rounded text-forest-950 focus:ring-forest-950 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-stone-800">
                              Show on Home
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* 6. Product Description */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Product Description & Health Benefits
                        </label>
                        <textarea
                          rows={3}
                          value={editProdDescription}
                          onChange={(e) => setEditProdDescription(e.target.value)}
                          placeholder="Describe the purity, pressing process, and culinary benefits..."
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 leading-relaxed"
                        />
                      </div>

                      {/* Modal Action Buttons */}
                      <div className="pt-2 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setEditingProduct(null)}
                          className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                        >
                          <Save className="w-4 h-4 text-gold-400" />
                          <span>Save Product Changes</span>
                        </button>
                      </div>

                    </form>

                  </div>
                </div>
              )}

              {/* ============================================================ */}
              {/* ADD PRODUCT MODAL                                            */}
              {/* ============================================================ */}
              {isAddProductOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
                  <div className="bg-white w-full max-w-2xl rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-2xl space-y-5 my-8 max-h-[90vh] overflow-y-auto">
                    
                    <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-gold-600">
                          Catalog Manager
                        </span>
                        <h3 className="font-serif font-black text-xl text-forest-950">
                          Add New Wood-Pressed Oil
                        </h3>
                      </div>
                      <button
                        onClick={() => setIsAddProductOpen(false)}
                        className="text-stone-400 hover:text-stone-600 cursor-pointer p-1 rounded-lg hover:bg-stone-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>

                    <form onSubmit={handleAddProduct} className="space-y-5">

                      {/* Error Alert Banner */}
                      {addProdError && (
                        <div className="p-3.5 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2.5 animate-fadeIn shadow-xs">
                          <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                          <span className="font-semibold leading-relaxed">{addProdError}</span>
                        </div>
                      )}
                      
                      {/* 1. Product Image */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          1. Product Image <span className="text-red-500">*</span>
                        </label>

                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-stone-300 shadow-xs shrink-0 bg-stone-100 relative">
                            {newProdImage ? (
                              <img
                                src={newProdImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex flex-col items-center justify-center text-stone-400 p-2 text-center bg-stone-50">
                                <ImageIcon className="w-7 h-7 mb-1 text-stone-300" />
                                <span className="text-[10px] text-stone-400 font-semibold">No Image</span>
                              </div>
                            )}
                          </div>

                          <div className="flex-1 space-y-2 w-full">
                            <div className="flex items-center gap-2">
                              <label className="px-3.5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-2 shadow-xs">
                                <Upload className="w-3.5 h-3.5 text-gold-400" />
                                <span>Upload Image from Device</span>
                                <input
                                  type="file"
                                  accept="image/*"
                                  className="hidden"
                                  onChange={(e) => handleImageFileUpload(e, setNewProdImage)}
                                />
                              </label>
                              <span className="text-[11px] text-stone-400">or paste URL</span>
                            </div>

                            <input
                              type="text"
                              value={newProdImage}
                              onChange={(e) => setNewProdImage(e.target.value)}
                              placeholder="Upload oil can image or enter image URL (Required)"
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-forest-900 bg-white"
                            />
                          </div>
                        </div>

                        {/* Presets */}
                        <div className="pt-2 border-t border-stone-200">
                          <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                            ⚡ Quick 1-Click Oil Presets:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {PRESET_IMAGES.map((preset) => (
                              <button
                                key={preset.name}
                                type="button"
                                onClick={() => setNewProdImage(preset.url)}
                                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer border ${
                                  newProdImage === preset.url
                                    ? 'bg-forest-950 text-gold-300 border-forest-950'
                                    : 'bg-white text-stone-700 border-stone-200 hover:border-stone-400'
                                }`}
                              >
                                {preset.name}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* 2. Basic Details */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          2. Basic Oil Information
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Product Name <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              required
                              value={newProdName}
                              onChange={(e) => setNewProdName(e.target.value)}
                              placeholder="e.g. SS Pure Castor Oil"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Tagline / Subtitle <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newProdTagline}
                              onChange={(e) => setNewProdTagline(e.target.value)}
                              placeholder="e.g. 100% Mara Chekku Cold-Pressed Virgin Grade"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                            />
                          </div>

                          <div>
                            <div className="flex items-center justify-between mb-1">
                              <label className="text-xs font-semibold text-stone-700">
                                Category <span className="text-red-500">*</span>
                              </label>
                              <button
                                type="button"
                                onClick={() => {
                                  setNewCatTitle('');
                                  setNewCatSubtitle('');
                                  setNewCatBadge('New Arrival');
                                  setNewCatSlug('');
                                  setNewCatImage('/products/sesame_oil.jpg');
                                  setNewCatAssignedProductIds([]);
                                  setIsAddCategoryOpen(true);
                                }}
                                className="text-[11px] font-bold text-emerald-700 hover:text-emerald-850 flex items-center gap-0.5 cursor-pointer hover:underline"
                              >
                                <Plus className="w-3 h-3 text-emerald-600" />
                                <span>+ New Category</span>
                              </button>
                            </div>
                            <select
                              value={newProdCategory}
                              onChange={(e) => setNewProdCategory(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold bg-white"
                            >
                              {categoriesList.map((c) => (
                                <option key={c.id || c.slug} value={c.slug}>
                                  {c.title} ({c.slug})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Highlight Badge
                            </label>
                            <select
                              value={newProdBadge}
                              onChange={(e) => setNewProdBadge(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold bg-white"
                            >
                              <option value="Cold-Pressed">Cold-Pressed</option>
                              <option value="Wood-Pressed">Wood-Pressed</option>
                              <option value="Bestseller">Bestseller</option>
                              <option value="100% Pure">100% Pure</option>
                              <option value="Popular">Popular</option>
                              <option value="Light & Pure">Light & Pure</option>
                              <option value="Temple Pooja">Temple Pooja</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* 3. Pricing */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          3. Pricing & Default Packaging
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Selling Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={newProdPrice}
                              onChange={(e) => setNewProdPrice(Number(e.target.value))}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-serif font-black text-sm"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              MRP / Original Price (₹) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              min="1"
                              value={newProdOriginalPrice}
                              onChange={(e) => setNewProdOriginalPrice(Number(e.target.value))}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-serif font-black text-sm"
                            />
                            {newProdOriginalPrice > newProdPrice && (
                              <span className="text-[10px] text-emerald-600 font-bold block mt-1">
                                {Math.round(((newProdOriginalPrice - newProdPrice) / newProdOriginalPrice) * 100)}% Discount Calculated
                              </span>
                            )}
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Default Pack Unit <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newProdDefaultPack}
                              onChange={(e) => setNewProdDefaultPack(e.target.value)}
                              placeholder="e.g. 1 Litre Bottle"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                            />
                          </div>
                        </div>
                      </div>

                      {/* 4. Pack & Can Sizes Section */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <div className="flex items-center justify-between">
                          <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                            4. Available Can / Pack Sizes <span className="text-red-500">*</span>
                          </label>
                          <span className="text-[11px] text-stone-500 font-medium">
                            {newProdPackSizes.length} sizes configured
                          </span>
                        </div>

                        {/* Configured Pack Size Chips */}
                        <div className="flex flex-wrap gap-2 pt-0.5 min-h-[32px]">
                          {newProdPackSizes.length === 0 ? (
                            <span className="text-xs text-stone-400 italic">No can sizes added yet. Type below to add.</span>
                          ) : (
                            newProdPackSizes.map((pack) => (
                              <span
                                key={pack}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-forest-950 text-gold-300 border border-forest-950 shadow-xs"
                              >
                                <Check className="w-3.5 h-3.5 text-gold-400" />
                                <span>{pack}</span>
                                <button
                                  type="button"
                                  onClick={() => handleRemovePackSizeNew(pack)}
                                  className="w-4 h-4 ml-0.5 rounded-full bg-forest-800 hover:bg-red-600 text-white flex items-center justify-center text-[10px] cursor-pointer transition-colors"
                                  title="Remove this size"
                                >
                                  ✕
                                </button>
                              </span>
                            ))
                          )}
                        </div>

                        {/* Admin Type Custom Can/Pack Size Input */}
                        <div className="pt-2 border-t border-stone-200/80">
                          <label className="block text-[11px] font-bold text-stone-700 mb-1">
                            Type Custom Can / Pack Size:
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="text"
                              value={newCustomPackInput}
                              onChange={(e) => setNewCustomPackInput(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleAddCustomPackSizeNew();
                                }
                              }}
                              placeholder="e.g. 5 Litre Can, 15 Litre Tin, 2 Litre Can, 500 ml Bottle..."
                              className="flex-1 px-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-800 placeholder-stone-400 focus:outline-none focus:border-forest-900 bg-white"
                            />
                            <button
                              type="button"
                              onClick={handleAddCustomPackSizeNew}
                              className="px-3.5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-gold-300 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shrink-0 shadow-xs active:scale-98"
                            >
                              <Plus className="w-3.5 h-3.5 text-gold-400" />
                              <span>Add Size</span>
                            </button>
                          </div>
                        </div>

                        {/* Quick Presets */}
                        <div className="pt-2 border-t border-stone-200/80">
                          <span className="text-[11px] font-semibold text-stone-500 block mb-1.5">
                            ⚡ Quick Presets (Click to add / remove):
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {ALL_PACK_OPTIONS.map((pack) => {
                              const isSelected = newProdPackSizes.includes(pack);
                              return (
                                <button
                                  key={pack}
                                  type="button"
                                  onClick={() => handleTogglePackSizeInNew(pack)}
                                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer border ${
                                    isSelected
                                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300 font-bold'
                                      : 'bg-white text-stone-600 border-stone-200 hover:border-stone-400'
                                  }`}
                                >
                                  {isSelected ? `✓ ${pack}` : `+ ${pack}`}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>

                      {/* 5. Production Specs & Inventory */}
                      <div className="space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          5. Production Specs & Inventory Status
                        </label>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Extraction Method <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newProdExtraction}
                              onChange={(e) => setNewProdExtraction(e.target.value)}
                              placeholder="e.g. Traditional Vaagai Mara Chekku"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Smoke Point & Dish Recommendation <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="text"
                              value={newProdSmokePoint}
                              onChange={(e) => setNewProdSmokePoint(e.target.value)}
                              placeholder="e.g. 220°C (High Smoke Point)"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                            />
                          </div>
                        </div>

                        {/* Stock & Featured */}
                        <div className="flex flex-wrap items-center gap-4 pt-1">
                          <label className="inline-flex items-center gap-2 cursor-pointer bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200">
                            <input
                              type="checkbox"
                              checked={newProdInStock}
                              onChange={(e) => setNewProdInStock(e.target.checked)}
                              className="rounded text-forest-950 focus:ring-forest-950 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-stone-800">
                              In Stock
                            </span>
                          </label>

                          <label className="inline-flex items-center gap-2 cursor-pointer bg-stone-50 px-3.5 py-2 rounded-xl border border-stone-200">
                            <input
                              type="checkbox"
                              checked={newProdFeatured}
                              onChange={(e) => setNewProdFeatured(e.target.checked)}
                              className="rounded text-forest-950 focus:ring-forest-950 w-4 h-4 cursor-pointer"
                            />
                            <span className="text-xs font-bold text-stone-800">
                              Show on Home
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* 6. Description */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Product Description & Health Benefits <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          rows={3}
                          value={newProdDescription}
                          onChange={(e) => setNewProdDescription(e.target.value)}
                          placeholder="Describe the purity, pressing process, and culinary benefits..."
                          className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 leading-relaxed"
                        />
                      </div>

                      {/* Buttons */}
                      <div className="pt-2 flex gap-3">
                        <button
                          type="button"
                          onClick={() => setIsAddProductOpen(false)}
                          className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 shadow-xs"
                        >
                          <Plus className="w-4 h-4 text-gold-400" />
                          <span>Add Product to Store</span>
                        </button>
                      </div>

                    </form>

                  </div>
                </div>
              )}

              {/* EDIT BOTTLE MODAL */}
              

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-stone-200 py-4 px-8 text-center text-xs text-stone-400 mt-auto">
          SS OIL • Mara Chekku Mill Management Operating System • All rights reserved
        </footer>

      </div>

    </div>
  );
};
