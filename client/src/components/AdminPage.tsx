import React, { useState } from 'react';
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
} from 'lucide-react';
import { PlacedOrder, Product, Category, UserProfile } from '../types';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '../data/oilData';

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

export const AdminPage: React.FC<AdminPageProps> = ({
  orders,
  onUpdateOrderStatus,
  onBackToStore,
  onLogout,
}) => {
  // Exactly 5 Tabs requested: Dashboard, Categories, User Login List, Product, Settings
  type AdminTab = 'dashboard' | 'categories' | 'users' | 'products' | 'settings';
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // -------------------------------------------------------------
  // 1. DATA: Products State (Loaded First so Categories can assign products)
  // -------------------------------------------------------------
  const [productsList, setProductsList] = useState<Product[]>(PRODUCTS_DATA);
  const [productCategoryFilter, setProductCategoryFilter] = useState('ALL');

  const handleToggleStock = (productId: string) => {
    setProductsList((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, inStock: !p.inStock } : p))
    );
    showToast('Product stock status updated.');
  };

  const handleDeleteProduct = (productId: string) => {
    setProductsList((prev) => prev.filter((p) => p.id !== productId));
    showToast('Product removed from catalog.');
  };

  // -------------------------------------------------------------
  // 2. DATA: Categories State
  // -------------------------------------------------------------
  const [categoriesList, setCategoriesList] = useState<Category[]>([
    ...CATEGORIES_DATA,
    {
      id: 'cat-groundnut',
      slug: 'groundnut-oil',
      title: 'Groundnut Oil',
      subtitle: 'Wood-Pressed Farm Fresh Peanut Oil',
      image: '/products/groundnut_oil.jpg',
      itemCount: '3 Varieties',
      badge: 'Cold-Pressed',
      highlightText: 'Zero Cholesterol & Rich Vitamin E',
    },
    {
      id: 'cat-pooja',
      slug: 'pooja-oil',
      title: 'Pooja & Lamp Oil',
      subtitle: 'Pure 5-Oil Divine Deepam Blend',
      image: 'https://images.unsplash.com/photo-1606787366850-de6330128bfc?auto=format&fit=crop&w=800&q=80',
      itemCount: '2 Varieties',
      badge: 'Traditional',
      highlightText: 'Aromatic & Pure Flame Formulation',
    },
  ]);

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

  // -------------------------------------------------------------
  // EDIT CATEGORY STATE & HANDLERS
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
    // Find products currently assigned to this category
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

  const handleSaveEditCategory = (e: React.FormEvent) => {
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

    // Update categoriesList
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
          // If was previously in this category but was unchecked, leave in cooking-oil or default
          return {
            ...prod,
            category: 'cooking-oil',
            categoryName: 'Cooking Oil',
          };
        }
        return prod;
      })
    );

    setEditingCategory(null);
    showToast(`Category "${updatedCategory.title}" & products updated! ✨`);
  };

  // -------------------------------------------------------------
  // ADD CATEGORY STATE & HANDLERS
  // -------------------------------------------------------------
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

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatTitle.trim()) return;

    const slug =
      newCatSlug.trim() || newCatTitle.toLowerCase().replace(/\s+/g, '-');

    const newCategory: Category = {
      id: `cat-${Date.now()}`,
      slug,
      title: newCatTitle.trim(),
      subtitle: newCatSubtitle.trim() || 'Traditional cold-pressed quality oil',
      image: newCatImage || '/products/sesame_oil.jpg',
      itemCount: `${newCatAssignedProductIds.length} Varieties`,
      badge: newCatBadge.trim() || 'New Arrival',
      highlightText: 'Fresh Salem Mill Production',
    };

    setCategoriesList((prev) => [newCategory, ...prev]);

    // Update productsList: assign selected products to new category
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
    showToast(`Category "${newCategory.title}" created successfully! 🏷️`);
  };

  const handleDeleteCategory = (catId: string) => {
    const catToDelete = categoriesList.find((c) => c.id === catId);
    setCategoriesList((prev) => prev.filter((c) => c.id !== catId));
    showToast(`Category "${catToDelete?.title || 'Selected'}" deleted.`);
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
  // 4. DATA: Store Settings State
  // -------------------------------------------------------------
  const [settings, setSettings] = useState({
    storeName: 'PureVa SS OIL Mill',
    tagline: '100% Mara Chekku Traditional Cold-Pressed Oils',
    fssaiLicense: 'FSSAI Lic. No. 12421008000452',
    phone: '1800 425 7764',
    email: 'contact@pureva.com',
    millAddress: '42, Salem Mara Chekku Mill, Meyyanur Main Road, Salem - 636004, Tamil Nadu',
    freeDeliveryThreshold: 499,
    deliveryFee: 50,
    gstRate: 5,
    currency: 'INR (₹)',
    autoSMSAlerts: true,
    whatsappUpdates: true,
  });

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Admin Mill Settings saved successfully! ✨');
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
      {/* LEFT SIDEBAR: FIXED & NON-SCROLLING (ALWAYS ANCHORED)        */}
      {/* ============================================================ */}
      <aside className="w-full md:w-64 lg:w-72 bg-forest-950 text-cream-100 border-r border-forest-900 flex flex-col shrink-0 h-auto md:h-screen md:sticky md:top-0 z-30 overflow-hidden">
        
        {/* Brand Header */}
        <div className="p-5 lg:p-6 border-b border-forest-800/80 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gold-500/20 text-gold-400 flex items-center justify-center border border-gold-500/30 shadow-xs">
              <svg className="w-5 h-5 fill-gold-400" viewBox="0 0 24 24">
                <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" />
              </svg>
            </div>
            <div>
              <h1 className="font-serif text-lg font-black tracking-wide text-white">
                PureVa Admin
              </h1>
              <p className="text-[11px] text-cream-200/70">Salem Mill Console</p>
            </div>
          </div>
        </div>

        {/* Sidebar Navigation: EXACTLY THE 5 REQUESTED ITEMS */}
        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto md:overflow-hidden select-none">
          <div className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-wider text-stone-400">
            Admin Menu
          </div>

          {/* 1. Dashboard */}
          <button
            onClick={() => {
              setActiveTab('dashboard');
              setSearchTerm('');
            }}
            className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-gold-500 text-forest-950 shadow-md font-black'
                : 'text-stone-300 hover:text-white hover:bg-forest-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <LayoutDashboard className="w-4 h-4" />
              <span>Dashboard</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'dashboard' ? 'bg-forest-950 text-gold-300' : 'bg-forest-900 text-stone-400'
              }`}
            >
              {orders.length}
            </span>
          </button>

          {/* 2. Categories */}
          <button
            onClick={() => {
              setActiveTab('categories');
              setSearchTerm('');
            }}
            className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'categories'
                ? 'bg-gold-500 text-forest-950 shadow-md font-black'
                : 'text-stone-300 hover:text-white hover:bg-forest-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Layers className="w-4 h-4" />
              <span>Categories</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'categories' ? 'bg-forest-950 text-gold-300' : 'bg-forest-900 text-stone-400'
              }`}
            >
              {categoriesList.length}
            </span>
          </button>

          {/* 3. User Login List */}
          <button
            onClick={() => {
              setActiveTab('users');
              setSearchTerm('');
            }}
            className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'users'
                ? 'bg-gold-500 text-forest-950 shadow-md font-black'
                : 'text-stone-300 hover:text-white hover:bg-forest-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Users className="w-4 h-4" />
              <span>User Login List</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'users' ? 'bg-forest-950 text-gold-300' : 'bg-forest-900 text-stone-400'
              }`}
            >
              {usersList.length}
            </span>
          </button>

          {/* 4. Product */}
          <button
            onClick={() => {
              setActiveTab('products');
              setSearchTerm('');
            }}
            className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'products'
                ? 'bg-gold-500 text-forest-950 shadow-md font-black'
                : 'text-stone-300 hover:text-white hover:bg-forest-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Package className="w-4 h-4" />
              <span>Product</span>
            </div>
            <span
              className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                activeTab === 'products' ? 'bg-forest-950 text-gold-300' : 'bg-forest-900 text-stone-400'
              }`}
            >
              {productsList.length}
            </span>
          </button>

          {/* 5. Settings */}
          <button
            onClick={() => {
              setActiveTab('settings');
              setSearchTerm('');
            }}
            className={`w-full px-3.5 py-3 rounded-2xl text-xs font-bold transition-all flex items-center justify-between cursor-pointer ${
              activeTab === 'settings'
                ? 'bg-gold-500 text-forest-950 shadow-md font-black'
                : 'text-stone-300 hover:text-white hover:bg-forest-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <Settings className="w-4 h-4" />
              <span>Settings</span>
            </div>
          </button>
        </nav>

        {/* Sidebar Footer Actions */}
        <div className="p-4 border-t border-forest-900 space-y-2 bg-forest-950 shrink-0 mt-auto select-none">
          <button
            onClick={onBackToStore}
            className="w-full py-2.5 px-3.5 rounded-xl bg-forest-900 hover:bg-forest-800 text-cream-100 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-forest-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Store</span>
          </button>

          {onLogout && (
            <button
              onClick={onLogout}
              className="w-full py-2.5 px-3.5 rounded-xl bg-red-950/60 hover:bg-red-900 text-red-200 text-xs font-bold transition-all flex items-center gap-2 cursor-pointer border border-red-900/60"
            >
              <LogOut className="w-4 h-4 text-red-400" />
              <span>Admin Logout</span>
            </button>
          )}
        </div>

      </aside>

      {/* ============================================================ */}
      {/* RIGHT MAIN CONTENT AREA                                      */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-y-auto overflow-x-hidden">
        
        {/* Top Header Bar */}
        <header className="bg-white border-b border-stone-200 sticky top-0 z-20 px-4 sm:px-8 py-4 flex items-center justify-between shadow-xs">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
              Admin Portal
            </div>
            <h2 className="text-xl sm:text-2xl font-serif font-black text-forest-950">
              {activeTab === 'dashboard' && 'Mill Dashboard'}
              {activeTab === 'categories' && 'Categories Management'}
              {activeTab === 'users' && 'User Login & Account Directory'}
              {activeTab === 'products' && 'Product Inventory'}
              {activeTab === 'settings' && 'Mill Settings & Policies'}
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
          </div>
        </header>

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
                  <p className="text-[11px] text-stone-500 mt-0.5">Rates, Contact, FSSAI</p>
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
          {/* 3. USER LOGIN LIST VIEW                                      */}
          {/* ============================================================ */}
          {activeTab === 'users' && (
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

                <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
                  {['ALL', 'sesame-oil', 'groundnut-oil', 'coconut-oil', 'cooking-oil'].map((cat) => (
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
                        : cat === 'sesame-oil'
                        ? 'Sesame'
                        : cat === 'groundnut-oil'
                        ? 'Groundnut'
                        : cat === 'coconut-oil'
                        ? 'Coconut'
                        : 'Cooking'}
                    </button>
                  ))}
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
                              <button
                                onClick={() => handleDeleteProduct(prod.id)}
                                className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                title="Delete product"
                              >
                                <Trash2 className="w-4 h-4" />
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
          {/* 5. SETTINGS VIEW                                             */}
          {/* ============================================================ */}
          {activeTab === 'settings' && (
            <div className="bg-white rounded-3xl border border-stone-200 shadow-xs p-6 sm:p-8 space-y-6 max-w-4xl">
              
              <div className="border-b border-stone-100 pb-4">
                <h3 className="font-serif font-black text-xl text-forest-950">
                  Mill Operating & Storefront Settings
                </h3>
                <p className="text-xs text-stone-500">
                  Configure brand identity, contact details, shipping thresholds, and admin security
                </p>
              </div>

              <form onSubmit={handleSaveSettings} className="space-y-6">
                
                {/* 1. Store Profile */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    1. Brand & Mill Identity
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Mill & Brand Name
                      </label>
                      <input
                        type="text"
                        value={settings.storeName}
                        onChange={(e) => setSettings({ ...settings, storeName: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        FSSAI License Number
                      </label>
                      <input
                        type="text"
                        value={settings.fssaiLicense}
                        onChange={(e) => setSettings({ ...settings, fssaiLicense: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-forest-900"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Mill Physical Address
                    </label>
                    <input
                      type="text"
                      value={settings.millAddress}
                      onChange={(e) => setSettings({ ...settings, millAddress: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs focus:outline-none focus:border-forest-900"
                    />
                  </div>
                </div>

                {/* 2. Contact Information */}
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    2. Customer Support & Mill Desk
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Toll-Free Helpline
                      </label>
                      <input
                        type="text"
                        value={settings.phone}
                        onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-forest-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Support Email ID
                      </label>
                      <input
                        type="email"
                        value={settings.email}
                        onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-forest-900"
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Shipping & Pricing Policies */}
                <div className="space-y-3 pt-4 border-t border-stone-100">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
                    3. Orders, GST & Delivery Policies
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Free Delivery Minimum (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.freeDeliveryThreshold}
                        onChange={(e) =>
                          setSettings({
                            ...settings,
                            freeDeliveryThreshold: Number(e.target.value),
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-forest-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Flat Shipping Charge (₹)
                      </label>
                      <input
                        type="number"
                        value={settings.deliveryFee}
                        onChange={(e) =>
                          setSettings({ ...settings, deliveryFee: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-forest-900"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-stone-700 mb-1">
                        Edible Oil GST Rate (%)
                      </label>
                      <input
                        type="number"
                        value={settings.gstRate}
                        onChange={(e) =>
                          setSettings({ ...settings, gstRate: Number(e.target.value) })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs font-mono focus:outline-none focus:border-forest-900"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="pt-4 border-t border-stone-100 flex justify-end">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-forest-950 hover:bg-forest-900 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Save className="w-4 h-4 text-gold-400" />
                    <span>Save Mill Settings</span>
                  </button>
                </div>

              </form>

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
