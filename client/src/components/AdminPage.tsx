import React, { useState, useEffect } from 'react';
import {
  LayoutDashboard,
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
  Sparkles,
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
} from 'lucide-react';
import { PlacedOrder, Product, Category, UserProfile, StoreSettings } from '../types';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '../data/oilData';
import { useStore } from '../context/StoreContext';

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
}

// Preset High Quality Oil Images for Categories
const PRESET_IMAGES = [
  {
    name: 'Sesame (நல்லெண்ணெய்)',
    url: '/products/sesame_oil.jpg',
  },
  {
    name: 'Groundnut (கடலை)',
    url: '/products/groundnut_oil.jpg',
  },
  {
    name: 'Coconut (தேங்காய்)',
    url: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Cooking (சமையல்)',
    url: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Pooja (தீப எண்ணெய்)',
    url: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80',
  },
];

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const AdminPage: React.FC<AdminPageProps> = ({
  orders,
  onUpdateOrderStatus,
  onBackToStore,
  onLogout,
}) => {
  // Admin Tab Navigation
  type AdminTab =
    | 'dashboard'
    | 'products'
    | 'orders'
    | 'customers'
    | 'users'
    | 'categories'
    | 'offers'
    | 'content'
    | 'settings'
    | 'analytics';
  const [activeTab, setActiveTab] = useState<AdminTab>('settings');

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
  // 1. DATA: Live Store Context Connection (Bi-directional Sync)
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
  } = useStore();

  const [productsList, setProductsList] = useState<Product[]>(storeProducts || PRODUCTS_DATA);
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');
  const [categoriesList, setCategoriesList] = useState<Category[]>(storeCategories || CATEGORIES_DATA);

  // Sync when context changes
  useEffect(() => {
    if (storeProducts && storeProducts.length > 0) {
      setProductsList(storeProducts);
    }
  }, [storeProducts]);

  useEffect(() => {
    if (storeCategories && storeCategories.length > 0) {
      setCategoriesList(storeCategories);
    }
  }, [storeCategories]);

  // Load Live Data from TiDB Cloud via Express Server on mount
  useEffect(() => {
    let isMounted = true;
    const fetchLiveData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch(`${API_BASE_URL}/api/products/categories`),
          fetch(`${API_BASE_URL}/api/products`),
        ]);

        if (catRes.ok) {
          const catData = await catRes.json();
          if (catData.success && Array.isArray(catData.data) && catData.data.length > 0 && isMounted) {
            const mappedCats: Category[] = catData.data.map((c: any) => ({
              id: c.id,
              slug: c.slug,
              title: c.name || c.title || 'Category',
              subtitle: c.description || c.subtitle || '',
              image: c.image || '/products/sesame_oil.jpg',
              badge: c.badge || 'Cold-Pressed',
              highlightText: c.highlightText || '100% Traditional Mara Chekku',
              itemCount: `${c._count?.products || 0} Varieties`,
            }));
            setCategoriesList(mappedCats);
          }
        }

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          if (prodData.success && Array.isArray(prodData.data) && prodData.data.length > 0 && isMounted) {
            const mappedProds: Product[] = prodData.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              tagline: p.tagline || '',
              category: p.category?.slug || p.categoryId || 'cooking-oil',
              categoryName: p.category?.name || 'Cold-Pressed Oil',
              price: Number(p.price),
              originalPrice: Number(p.originalPrice || p.price),
              discountPercent: p.discountPercent || 0,
              rating: p.rating || 4.9,
              reviewsCount: p.reviews?.length || p.reviewsCount || 128,
              packSizes: p.packSizes && p.packSizes.length > 0
                ? p.packSizes.map((ps: any) => ps.packSize || ps)
                : ['500 ml Bottle', '1 Litre Bottle', '2 Litre Can', '5 Litre Can'],
              defaultPack: p.defaultPack || '1 Litre Bottle',
              image: p.image || '/products/sesame_oil.jpg',
              badge: p.badge || undefined,
              description: p.description || '',
              benefits: p.benefits || ['Zero Chemical Solvents', 'Unrefined & Pure', 'High Smoke Point'],
              smokePoint: p.smokePoint || '210°C',
              extractionMethod: p.extractionMethod || 'Traditional Cold-Pressed Mara Chekku',
              inStock: p.inStock !== false,
              featured: Boolean(p.featured),
            }));
            setProductsList(mappedProds);
          }
        }
      } catch (err) {
        console.warn('Backend offline or not reachable, using seeded oil dataset.', err);
      }
    };

    fetchLiveData();
    return () => {
      isMounted = false;
    };
  }, []);

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

  // Image Upload helper (FileReader -> DataURL)
  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setImageCallback: (url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageCallback(reader.result);
          showToast('Image uploaded successfully! 📸');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Canvas-based image resizer and optimizer (ensures logo/images never exceed localStorage quota)
  const resizeImageFile = (file: File, maxDim = 320): Promise<string> => {
    return new Promise((resolve, reject) => {
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
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL('image/png'));
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

  // -------------------------------------------------------------
  // CATEGORY EDIT STATE & HANDLERS
  // -------------------------------------------------------------
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [editCatTitle, setEditCatTitle] = useState('');
  const [editCatSubtitle, setEditCatSubtitle] = useState('');
  const [editCatBadge, setEditCatBadge] = useState('');
  const [editCatSlug, setEditCatSlug] = useState('');
  const [editCatImage, setEditCatImage] = useState('');
  const [editCatAssignedProductIds, setEditCatAssignedProductIds] = useState<string[]>([]);

  const openEditCategory = (cat: Category) => {
    setEditingCategory(cat);
    setEditCatTitle(cat.title);
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
      subtitle: editCatSubtitle.trim(),
      badge: editCatBadge.trim() || 'Cold-Pressed',
      slug: updatedSlug,
      image: editCatImage || '/products/sesame_oil.jpg',
      itemCount: `${editCatAssignedProductIds.length} Varieties`,
    };

    // Update categoriesList locally
    setCategoriesList((prev) =>
      prev.map((c) => (c.id === editingCategory.id ? updatedCategory : c))
    );

    // Update productsList: reassign products
    setProductsList((prev) =>
      prev.map((prod) => {
        if (editCatAssignedProductIds.includes(prod.id)) {
          return {
            ...prod,
            category: updatedSlug as any,
            categoryName: updatedCategory.title,
          };
        } else if (prod.category === editingCategory.slug) {
          return {
            ...prod,
            category: 'cooking-oil',
            categoryName: 'Cooking Oil',
          };
        }
        return prod;
      })
    );

    // Sync to TiDB Cloud backend
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

    setEditingCategory(null);
    contextUpdateCategory(updatedCategory);
    showToast(`Category "${updatedCategory.title}" updated successfully! ✨`);
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
      highlightText: 'Fresh Salem Mill Production',
    };

    setCategoriesList((prev) => [newCategory, ...prev]);

    if (newCatAssignedProductIds.length > 0) {
      setProductsList((prev) =>
        prev.map((prod) =>
          newCatAssignedProductIds.includes(prod.id)
            ? {
                ...prod,
                category: slug as any,
                categoryName: newCategory.title,
              }
            : prod
        )
      );
    }

    setIsAddCategoryOpen(false);
    setNewCatTitle('');
    setNewCatSubtitle('');
    setNewCatBadge('');
    setNewCatSlug('');
    setNewCatImage('/products/sesame_oil.jpg');
    setNewCatAssignedProductIds([]);
    contextAddCategory(newCategory);
    showToast(`Category "${newCategory.title}" created successfully! 🏷️`);
  };

  const handleDeleteCategory = async (catId: string) => {
    const catToDelete = categoriesList.find((c) => c.id === catId);
    setCategoriesList((prev) => prev.filter((c) => c.id !== catId));
    contextDeleteCategory(catId);

    try {
      await fetch(`${API_BASE_URL}/api/products/categories/${catId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete category from database:', err);
    }

    showToast(`Category "${catToDelete?.title || 'Selected'}" deleted.`);
  };

  // -------------------------------------------------------------
  // PRODUCT EDIT & CREATE STATE & HANDLERS
  // -------------------------------------------------------------
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editProdName, setEditProdName] = useState('');
  const [editProdTagline, setEditProdTagline] = useState('');
  const [editProdCategory, setEditProdCategory] = useState('');
  const [editProdPrice, setEditProdPrice] = useState<number>(0);
  const [editProdOriginalPrice, setEditProdOriginalPrice] = useState<number>(0);
  const [editProdDefaultPack, setEditProdDefaultPack] = useState('1 Litre Bottle');
  const [editProdPackSizes, setEditProdPackSizes] = useState<string[]>([]);
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

  const handleSaveEditProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct || !editProdName.trim()) return;

    const matchedCat = categoriesList.find((c) => c.slug === editProdCategory);
    const updatedProduct: Product = {
      ...editingProduct,
      name: editProdName.trim(),
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

    setProductsList((prev) =>
      prev.map((p) => (p.id === editingProduct.id ? updatedProduct : p))
    );

    // Sync to TiDB Cloud backend
    try {
      await fetch(`${API_BASE_URL}/api/products/${editingProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedProduct.name,
          tagline: updatedProduct.tagline,
          description: updatedProduct.description,
          price: updatedProduct.price,
          originalPrice: updatedProduct.originalPrice,
          defaultPack: updatedProduct.defaultPack,
          image: updatedProduct.image,
          badge: updatedProduct.badge || null,
          smokePoint: updatedProduct.smokePoint,
          extractionMethod: updatedProduct.extractionMethod,
          inStock: updatedProduct.inStock,
          featured: updatedProduct.featured,
          categoryId: matchedCat?.id,
          packSizes: updatedProduct.packSizes.map((ps) => ({
            packSize: ps,
            price: updatedProduct.price,
            originalPrice: updatedProduct.originalPrice,
            inStock: updatedProduct.inStock,
          })),
        }),
      });
    } catch (err) {
      console.error('Failed to sync product update to database:', err);
    }

    setEditingProduct(null);
    contextUpdateProduct(updatedProduct);
    showToast(`Product "${updatedProduct.name}" updated successfully! ✨`);
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
  const [newProdImage, setNewProdImage] = useState('/products/groundnut_oil.jpg');
  const [newProdBadge, setNewProdBadge] = useState('Cold-Pressed');
  const [newProdSmokePoint, setNewProdSmokePoint] = useState('220°C');
  const [newProdExtraction, setNewProdExtraction] = useState('Traditional Mara Chekku Cold-Pressed');
  const [newProdDescription, setNewProdDescription] = useState('');
  const [newProdInStock, setNewProdInStock] = useState(true);
  const [newProdFeatured, setNewProdFeatured] = useState(false);

  const handleTogglePackSizeInNew = (pack: string) => {
    setNewProdPackSizes((prev) =>
      prev.includes(pack) ? prev.filter((p) => p !== pack) : [...prev, pack]
    );
  };

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const matchedCat = categoriesList.find((c) => c.slug === newProdCategory) || categoriesList[0];
    let createdId = `prod-${Date.now()}`;

    // Sync to TiDB Cloud backend
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProdName.trim(),
          tagline: newProdTagline.trim(),
          description: newProdDescription.trim() || 'Authentic traditional oil freshly pressed at Salem Mill.',
          price: Number(newProdPrice),
          originalPrice: Number(newProdOriginalPrice),
          defaultPack: newProdDefaultPack,
          image: newProdImage || '/products/groundnut_oil.jpg',
          badge: newProdBadge || null,
          smokePoint: newProdSmokePoint || '220°C',
          extractionMethod: newProdExtraction || 'Traditional Mara Chekku Cold-Pressed',
          inStock: newProdInStock,
          featured: newProdFeatured,
          categoryId: matchedCat?.id || 'f94f271e-f1ad-4af5-8fdd-fa6849c79752',
          packSizes: newProdPackSizes.map((ps) => ({
            packSize: ps,
            price: Number(newProdPrice),
            originalPrice: Number(newProdOriginalPrice),
            inStock: newProdInStock,
          })),
        }),
      });
      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.data?.id) {
          createdId = resData.data.id;
        }
      }
    } catch (err) {
      console.error('Failed to create product in database:', err);
    }

    const newProduct: Product = {
      id: createdId,
      name: newProdName.trim(),
      tagline: newProdTagline.trim(),
      category: matchedCat?.slug || 'groundnut-oil',
      categoryName: matchedCat?.title || 'Groundnut Oil',
      price: Number(newProdPrice),
      originalPrice: Number(newProdOriginalPrice),
      discountPercent:
        newProdOriginalPrice > newProdPrice
          ? Math.round(((newProdOriginalPrice - newProdPrice) / newProdOriginalPrice) * 100)
          : 0,
      rating: 5.0,
      reviewsCount: 1,
      packSizes: newProdPackSizes.length > 0 ? newProdPackSizes : ['1 Litre Bottle'],
      defaultPack: newProdDefaultPack,
      image: newProdImage || '/products/groundnut_oil.jpg',
      badge: newProdBadge || undefined,
      description: newProdDescription || 'Authentic cold-pressed oil.',
      benefits: ['Zero Chemical Solvents', 'Unrefined & Pure', 'Naturally Rich in Vitamin E'],
      smokePoint: newProdSmokePoint,
      extractionMethod: newProdExtraction,
      inStock: newProdInStock,
      featured: newProdFeatured,
    };

    setProductsList((prev) => [newProduct, ...prev]);
    contextAddProduct(newProduct);
    setIsAddProductOpen(false);
    setNewProdName('');
    setNewProdTagline('');
    setNewProdDescription('');
    showToast(`Product "${newProduct.name}" added to catalog! 🛢️`);
  };

  const handleDeleteProduct = async (productId: string) => {
    const prodToDelete = productsList.find((p) => p.id === productId);
    setProductsList((prev) => prev.filter((p) => p.id !== productId));
    contextDeleteProduct(productId);

    try {
      await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.error('Failed to delete product from database:', err);
    }

    showToast(`Product "${prodToDelete?.name || 'Selected'}" deleted.`);
  };

  const handleToggleStock = async (productId: string) => {
    const target = productsList.find((p) => p.id === productId);
    if (!target) return;
    const newStock = !target.inStock;

    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: newStock } : p))
    );

    try {
      await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: newStock }),
      });
    } catch (err) {
      console.error('Failed to update stock in database:', err);
    }

    showToast(`Stock status for "${target.name}" updated.`);
  };

  // -------------------------------------------------------------
  // 3. DATA: User Login List State
  // -------------------------------------------------------------
  const [usersList, setUsersList] = useState<UserRecord[]>([
    {
      id: 'usr_admin',
      name: 'PureVa Admin',
      email: 'admin@pureva.com',
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
  ]);

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
    showToast('Store settings saved! User pages updated instantly ✨');
  };

  // -------------------------------------------------------------
  // 5. DATA: Dashboard KPI Calculations
  // -------------------------------------------------------------
  const totalRevenue = orders.reduce((sum, ord) => sum + ord.totalAmount, 0);
  const totalItemsSold = orders.reduce(
    (sum, ord) => sum + ord.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  const activeOrdersCount = orders.filter((o) => o.orderStatus !== 'DELIVERED').length;
  const inStockProductsCount = productsList.filter((p) => p.inStock).length;

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
    link.setAttribute('download', `PureVa_Orders_${new Date().toISOString().slice(0, 10)}.csv`);
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
            { id: 'dashboard', label: 'Dashboard', icon: Home, count: orders.length },
            { id: 'products', label: 'Products', icon: Package, count: productsList.length },
            { id: 'orders', label: 'Orders', icon: ShoppingCart, count: activeOrdersCount },
            { id: 'customers', label: 'Customers', icon: Users, count: usersList.length },
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
                  setActiveTab(item.id as AdminTab);
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
                      isActive ? 'bg-[#132c19] text-white' : 'bg-black/20 text-stone-300'
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

            {/* Admin Avatar Pill */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className="w-8 h-8 rounded-full bg-[#132c19] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                A
              </div>
              <span className="hidden sm:inline text-xs font-bold text-stone-800">
                Admin ˇ
              </span>
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
                {activeTab === 'categories' && 'Categories Management'}
                {activeTab === 'customers' && 'User Login & Account Directory'}
                {activeTab === 'products' && 'Product Inventory'}
                {activeTab === 'orders' && 'Orders Management'}
                {activeTab === 'offers' && 'Offers & Coupons'}
                {activeTab === 'content' && 'Content Management'}
                {activeTab === 'analytics' && 'Analytics & Performance'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {activeTab === 'dashboard' && (
                <button
                  onClick={exportCSV}
                  className="px-3.5 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-all border border-stone-300 flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Download className="w-3.5 h-3.5 text-stone-600" />
                  <span>Export CSV</span>
                </button>
              )}

              {activeTab === 'categories' && (
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
              )}

              {activeTab === 'products' && (
                <button
                  onClick={() => {
                    setNewProdName('');
                    setNewProdTagline('');
                    setNewProdCategory(categoriesList[0]?.slug || 'sesame-oil');
                    setNewProdPrice(350);
                    setNewProdOriginalPrice(420);
                    setNewProdDefaultPack('1 Litre Bottle');
                    setNewProdPackSizes(['500 ml Bottle', '1 Litre Bottle', '2 Litre Can', '5 Litre Can']);
                    setNewProdImage('/products/sesame_oil.jpg');
                    setNewProdBadge('Cold-Pressed');
                    setNewProdSmokePoint('220°C');
                    setNewProdExtraction('Traditional Cold-Pressed Mara Chekku');
                    setNewProdDescription('');
                    setNewProdInStock(true);
                    setNewProdFeatured(false);
                    setIsAddProductOpen(true);
                  }}
                  className="px-3.5 py-2 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5 text-gold-400" />
                  <span>Add Product</span>
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
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <button
                  onClick={() => setActiveTab('categories')}
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-gold-500 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <Layers className="w-5 h-5 text-forest-800 group-hover:text-gold-600 mb-2" />
                  <h4 className="font-bold text-xs text-stone-900">Manage Categories</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{categoriesList.length} Categories configured</p>
                </button>

                <button
                  onClick={() => setActiveTab('users')}
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-gold-500 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <Users className="w-5 h-5 text-forest-800 group-hover:text-gold-600 mb-2" />
                  <h4 className="font-bold text-xs text-stone-900">User Login List</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{usersList.length} User records</p>
                </button>

                <button
                  onClick={() => setActiveTab('products')}
                  className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-gold-500 text-left transition-all cursor-pointer group shadow-xs"
                >
                  <Package className="w-5 h-5 text-forest-800 group-hover:text-gold-600 mb-2" />
                  <h4 className="font-bold text-xs text-stone-900">Product Inventory</h4>
                  <p className="text-[11px] text-stone-500 mt-0.5">{productsList.length} Edible Oils</p>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
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
                          1. Category Image (புகைப்படம் சேர்க்கவும்)
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
                              Category Title (பெயர்)
                            </label>
                            <input
                              type="text"
                              required
                              value={editCatTitle}
                              onChange={(e) => setEditCatTitle(e.target.value)}
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold"
                            />
                          </div>

                          <div>
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
                            Subtitle / Description (விளக்கம்)
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
                            3. Link Products to this Category (பொருட்களை மாற்றவும்)
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

              {/* ============================================================ */}
              {/* ADD CATEGORY MODAL (Image upload + Product Assignment)        */}
              {/* ============================================================ */}
              {isAddCategoryOpen && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
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
                          1. Category Image (புகைப்படம் சேர்க்கவும்)
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
                              Category Title (பெயர்)
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
                            Subtitle (விளக்கம்)
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
                        <th className="py-3 px-4 font-bold">Tier & Purity Points</th>
                        <th className="py-3 px-4 font-bold">Orders / Spent</th>
                        <th className="py-3 px-4 font-bold">Last Login Activity</th>
                        <th className="py-3 px-4 font-bold">Status</th>
                        <th className="py-3 px-4 font-bold text-right">Action</th>
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
                                  <span className="font-bold text-stone-900 block">
                                    {user.name}
                                  </span>
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
                              {user.phone}
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-stone-800 block">
                                {user.memberTier}
                              </span>
                              <span className="text-[10px] text-gold-700 font-semibold">
                                🌿 {user.purityPoints} Purity Pts
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-bold text-forest-950 block">
                                {user.totalOrders} Orders
                              </span>
                              <span className="text-[11px] text-stone-500">
                                ₹{user.totalSpent} spent
                              </span>
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

                            <td className="py-3 px-4 text-right">
                              <button
                                onClick={() => handleToggleUserStatus(user.id)}
                                className="text-xs font-semibold text-stone-600 hover:text-forest-950 underline cursor-pointer"
                              >
                                {user.status === 'Active' ? 'Deactivate' : 'Activate'}
                              </button>
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
          {/* 4. PRODUCT VIEW                                              */}
          {/* ============================================================ */}
          {activeTab === 'products' && (
            <div className="space-y-5">
              
              {/* Product Search & Category Filters */}
              <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div className="relative w-full sm:w-80">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search oils by name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 bg-stone-50/50"
                  />
                </div>

                <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto justify-between sm:justify-end">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    {['ALL', ...Array.from(new Set(categoriesList.map((c) => c.slug)))].map((cat) => (
                      <button
                        key={cat}
                        onClick={() => setProductCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                          productCategoryFilter === cat
                            ? 'bg-forest-950 text-white shadow-xs'
                            : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                        }`}
                      >
                        {cat === 'ALL'
                          ? 'All Oils'
                          : categoriesList.find((c) => c.slug === cat)?.title || cat}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      setNewProdName('');
                      setNewProdTagline('');
                      setNewProdCategory(categoriesList[0]?.slug || 'sesame-oil');
                      setNewProdPrice(350);
                      setNewProdOriginalPrice(420);
                      setNewProdDefaultPack('1 Litre Bottle');
                      setNewProdPackSizes(['500 ml Bottle', '1 Litre Bottle', '2 Litre Can', '5 Litre Can']);
                      setNewProdImage('/products/sesame_oil.jpg');
                      setNewProdBadge('Cold-Pressed');
                      setNewProdSmokePoint('220°C');
                      setNewProdExtraction('Traditional Cold-Pressed Mara Chekku');
                      setNewProdDescription('');
                      setNewProdInStock(true);
                      setNewProdFeatured(false);
                      setIsAddProductOpen(true);
                    }}
                    className="px-3 py-1.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-white text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer shadow-xs whitespace-nowrap shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5 text-gold-400" />
                    <span>+ Add Product</span>
                  </button>
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-stone-50 border-b border-stone-200 text-stone-700 font-serif">
                      <tr>
                        <th className="py-3 px-4 font-bold">Product</th>
                        <th className="py-3 px-4 font-bold">Category</th>
                        <th className="py-3 px-4 font-bold">Extraction Method</th>
                        <th className="py-3 px-4 font-bold">Price / MRP</th>
                        <th className="py-3 px-4 font-bold">Pack Sizes Available</th>
                        <th className="py-3 px-4 font-bold">Stock Status</th>
                        <th className="py-3 px-4 font-bold text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {productsList
                        .filter((p) => {
                          const matchesCat =
                            productCategoryFilter === 'ALL' || p.category === productCategoryFilter;
                          const matchesSearch =
                            !searchTerm ||
                            p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            p.tagline.toLowerCase().includes(searchTerm.toLowerCase());
                          return matchesCat && matchesSearch;
                        })
                        .map((prod) => (
                          <tr key={prod.id} className="hover:bg-amber-50/20">
                            <td className="py-3 px-4">
                              <div className="flex items-center gap-3">
                                <img
                                  src={prod.image}
                                  alt={prod.name}
                                  className="w-12 h-12 rounded-xl object-cover border border-stone-200 shrink-0 bg-stone-50"
                                />
                                <div>
                                  <span className="font-bold text-stone-900 block">{prod.name}</span>
                                  <span className="text-[11px] text-stone-500 line-clamp-1">
                                    {prod.tagline}
                                  </span>
                                </div>
                              </div>
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
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>

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
                          1. Product Image (புகைப்படம் சேர்க்கவும்)
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
                              Product Name (பெயர்)
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
                              Tagline / Subtitle (விவரக் குறிப்பு)
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
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Category (பிரிவு)
                            </label>
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
                              Selling Price (விற்பனை விலை ₹)
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
                              MRP / Original Price (அசல் விலை ₹)
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

                      {/* 4. Pack Sizes Checkbox Selection */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          4. Available Pack Sizes (அளவு தேர்வுகள்)
                        </label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {ALL_PACK_OPTIONS.map((pack) => {
                            const isSelected = editProdPackSizes.includes(pack);
                            return (
                              <button
                                key={pack}
                                type="button"
                                onClick={() => handleTogglePackSizeInEdit(pack)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-forest-950 text-gold-300 border-forest-950 shadow-xs'
                                    : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="w-3.5 h-3.5 text-gold-400" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5 text-stone-400" />
                                )}
                                <span>{pack}</span>
                              </button>
                            );
                          })}
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
                              Extraction Method (செக்கு வகை)
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
                              In Stock (கையிருப்பு உள்ளது)
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
                              Feature on Homepage Showcase (முகப்புப் பக்கத்தில் காட்டவும்)
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
                      
                      {/* 1. Product Image */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          1. Product Image (புகைப்படம் சேர்க்கவும்)
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
                                  onChange={(e) => handleImageFileUpload(e, setNewProdImage)}
                                />
                              </label>
                              <span className="text-[11px] text-stone-400">or paste URL</span>
                            </div>

                            <input
                              type="text"
                              value={newProdImage}
                              onChange={(e) => setNewProdImage(e.target.value)}
                              placeholder="https://... or /products/groundnut_oil.jpg"
                              className="w-full px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 focus:outline-none focus:border-forest-900 bg-white"
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
                              Product Name (பெயர்)
                            </label>
                            <input
                              type="text"
                              required
                              value={newProdName}
                              onChange={(e) => setNewProdName(e.target.value)}
                              placeholder="e.g. SS Pure Castor Oil (ஆமணக்கு எண்ணெய்)"
                              className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900 font-bold"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Tagline / Subtitle
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
                            <label className="block text-xs font-semibold text-stone-700 mb-1">
                              Category (பிரிவு)
                            </label>
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
                              Selling Price (விற்பனை விலை ₹)
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
                              MRP / Original Price (அசல் விலை ₹)
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
                              Default Pack Unit
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

                      {/* 4. Pack Sizes */}
                      <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                        <label className="block text-xs font-bold uppercase tracking-wider text-stone-700">
                          4. Available Pack Sizes (அளவு தேர்வுகள்)
                        </label>
                        <div className="flex flex-wrap gap-2 pt-1">
                          {ALL_PACK_OPTIONS.map((pack) => {
                            const isSelected = newProdPackSizes.includes(pack);
                            return (
                              <button
                                key={pack}
                                type="button"
                                onClick={() => handleTogglePackSizeInNew(pack)}
                                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border flex items-center gap-1.5 ${
                                  isSelected
                                    ? 'bg-forest-950 text-gold-300 border-forest-950 shadow-xs'
                                    : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
                                }`}
                              >
                                {isSelected ? (
                                  <Check className="w-3.5 h-3.5 text-gold-400" />
                                ) : (
                                  <Plus className="w-3.5 h-3.5 text-stone-400" />
                                )}
                                <span>{pack}</span>
                              </button>
                            );
                          })}
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
                              Extraction Method (செக்கு வகை)
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
                              Smoke Point & Dish Recommendation
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
                              In Stock (கையிருப்பு உள்ளது)
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
                              Feature on Homepage Showcase (முகப்புப் பக்கத்தில் காட்டவும்)
                            </span>
                          </label>
                        </div>
                      </div>

                      {/* 6. Description */}
                      <div>
                        <label className="block text-xs font-semibold text-stone-700 mb-1">
                          Product Description & Health Benefits
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
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <h4 className="font-serif font-bold text-base text-stone-900">The Mara Chekku Experience</h4>
                  <p className="text-xs text-stone-600">5 Generational Milestones Interactive Visualizer is live on homepage.</p>
                  <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Active & Synchronized
                  </span>
                </div>

                <div className="p-5 rounded-2xl border border-stone-200 bg-stone-50/50 space-y-2">
                  <h4 className="font-serif font-bold text-base text-stone-900">Community Instagram Reels</h4>
                  <p className="text-xs text-stone-600">5 authentic creator kitchen stories with video lightboxes configured.</p>
                  <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                    Active on Flagship Homepage
                  </span>
                </div>
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

        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-stone-200 py-4 px-8 text-center text-xs text-stone-400 mt-auto">
          PureVa • Salem Mara Chekku Mill Management Operating System • All rights reserved
        </footer>

      </div>

    </div>
  );
};
