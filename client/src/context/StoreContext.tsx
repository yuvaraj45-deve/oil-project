import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, StoreSettings, DEFAULT_STORE_SETTINGS } from '../types';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '../data/oilData';

const API_BASE_URL = 'http://localhost:5000';

interface StoreContextType {
  settings: StoreSettings;
  updateSettings: (newSettings: Partial<StoreSettings>) => void;
  products: Product[];
  categories: Category[];
  updateProduct: (product: Product) => Promise<void>;
  addProduct: (product: Product) => Promise<void>;
  deleteProduct: (productId: string) => Promise<void>;
  updateCategory: (category: Category) => Promise<void>;
  addCategory: (category: Category) => Promise<void>;
  deleteCategory: (categoryId: string) => Promise<void>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
}

const StoreContext = createContext<StoreContextType | undefined>(undefined);

export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // 1. Settings State (Sync with localStorage 'ssoil_admin_settings')
  const [settings, setSettings] = useState<StoreSettings>(() => {
    try {
      const saved = localStorage.getItem('ssoil_admin_settings');
      if (saved) {
        return { ...DEFAULT_STORE_SETTINGS, ...JSON.parse(saved) };
      }
    } catch (e) {
      console.error('Error reading saved store settings:', e);
    }
    return DEFAULT_STORE_SETTINGS;
  });

  // 2. Products State (Sync with localStorage 'ssoil_products' or fallback to PRODUCTS_DATA)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ssoil_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading saved products:', e);
    }
    return PRODUCTS_DATA;
  });

  // 3. Categories State (Sync with localStorage 'ssoil_categories' or fallback to CATEGORIES_DATA)
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('ssoil_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Error reading saved categories:', e);
    }
    return CATEGORIES_DATA;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Helper to fetch live from backend API if online
  const refreshData = useCallback(async () => {
    try {
      setIsLoading(true);
      const [catRes, prodRes] = await Promise.allSettled([
        fetch(`${API_BASE_URL}/api/products/categories`),
        fetch(`${API_BASE_URL}/api/products`),
      ]);

      if (catRes.status === 'fulfilled' && catRes.value.ok) {
        const catData = await catRes.value.json();
        if (catData.success && Array.isArray(catData.data) && catData.data.length > 0) {
          const mappedCats: Category[] = catData.data.map((c: any) => {
            const fallback = CATEGORIES_DATA.find((x) => x.slug === c.slug || x.id === c.id);
            return {
              id: c.id,
              slug: c.slug,
              title: c.name,
              subtitle: c.description || fallback?.subtitle || '100% Traditional Wood-Pressed',
              image: c.image || fallback?.image || '/showcase/showcase_groundnut.png',
              itemCount: `${c._count?.products || 4} Variants`,
              badge: fallback?.badge || 'Wood-Pressed',
              highlightText: fallback?.highlightText || 'Native Seeds',
            };
          });
          setCategories(mappedCats);
          localStorage.setItem('ssoil_categories', JSON.stringify(mappedCats));
        }
      }

      if (prodRes.status === 'fulfilled' && prodRes.value.ok) {
        const prodData = await prodRes.value.json();
        if (prodData.success && Array.isArray(prodData.data) && prodData.data.length > 0) {
          const mappedProds: Product[] = prodData.data.map((p: any) => {
            const fallback = PRODUCTS_DATA.find((x) => x.id === p.id || x.slug === p.slug);
            return {
              id: p.id,
              name: p.name,
              tamilName: fallback?.tamilName,
              tagline: p.tagline,
              category: p.category?.slug || fallback?.category || 'cooking-oil',
              categoryName: p.category?.name || fallback?.categoryName || 'Edible Oil',
              price: p.price,
              originalPrice: p.originalPrice || fallback?.originalPrice || p.price + 50,
              discountPercent: p.discountPercent || (fallback?.discountPercent ?? 10),
              rating: fallback?.rating || 4.9,
              reviewsCount: fallback?.reviewsCount || (p.reviews?.length ? p.reviews.length * 10 + 24 : 128),
              packSizes: p.packSizes?.length ? p.packSizes.map((ps: any) => ps.packSize) : (fallback?.packSizes || ['1 Litre Bottle']),
              defaultPack: p.defaultPack || fallback?.defaultPack || '1 Litre Bottle',
              image: p.image || fallback?.image || '/showcase/showcase_groundnut.png',
              badge: p.badge || fallback?.badge,
              description: p.description,
              benefits: fallback?.benefits || ['Zero Preservatives', 'Cold Extracted', 'Rich Antioxidants'],
              smokePoint: p.smokePoint || fallback?.smokePoint || '210°C',
              extractionMethod: p.extractionMethod || fallback?.extractionMethod || 'Traditional Vaagai Mara Chekku',
              inStock: p.inStock ?? true,
              featured: p.featured ?? fallback?.featured ?? false,
              labReport: p.labReports?.[0] || fallback?.labReport,
              aromaProfile: fallback?.aromaProfile,
              bestForDish: fallback?.bestForDish,
            };
          });
          setProducts(mappedProds);
          localStorage.setItem('ssoil_products', JSON.stringify(mappedProds));
        }
      }
    } catch (e) {
      console.warn('API sync completed with fallback local data:', e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch initial API data on mount
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  // Update Settings handler
  const updateSettings = useCallback((newSettings: Partial<StoreSettings>) => {
    setSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      try {
        localStorage.setItem('ssoil_admin_settings', JSON.stringify(updated));
      } catch (e) {
        console.error('Error saving settings:', e);
      }
      return updated;
    });
  }, []);

  // Product CRUD
  const updateProduct = useCallback(async (updatedProduct: Product) => {
    setProducts((prev) => {
      const next = prev.map((p) => (p.id === updatedProduct.id ? updatedProduct : p));
      try {
        localStorage.setItem('ssoil_products', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // Background API call
    try {
      await fetch(`${API_BASE_URL}/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedProduct.name,
          slug: updatedProduct.name.toLowerCase().replace(/\s+/g, '-'),
          tagline: updatedProduct.tagline,
          description: updatedProduct.description,
          price: updatedProduct.price,
          originalPrice: updatedProduct.originalPrice,
          defaultPack: updatedProduct.defaultPack,
          image: updatedProduct.image,
          badge: updatedProduct.badge,
          smokePoint: updatedProduct.smokePoint,
          extractionMethod: updatedProduct.extractionMethod,
          inStock: updatedProduct.inStock,
          featured: updatedProduct.featured,
        }),
      });
    } catch (e) {
      console.warn('API product update error:', e);
    }
  }, []);

  const addProduct = useCallback(async (newProduct: Product) => {
    setProducts((prev) => {
      const next = [newProduct, ...prev];
      try {
        localStorage.setItem('ssoil_products', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // Background API call
    try {
      await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          slug: newProduct.name.toLowerCase().replace(/\s+/g, '-'),
          tagline: newProduct.tagline,
          description: newProduct.description,
          price: newProduct.price,
          originalPrice: newProduct.originalPrice,
          defaultPack: newProduct.defaultPack,
          image: newProduct.image,
          badge: newProduct.badge,
          smokePoint: newProduct.smokePoint,
          extractionMethod: newProduct.extractionMethod,
          inStock: newProduct.inStock,
          featured: newProduct.featured,
          categorySlug: newProduct.category,
        }),
      });
    } catch (e) {
      console.warn('API add product error:', e);
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      try {
        localStorage.setItem('ssoil_products', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // Background API call
    try {
      await fetch(`${API_BASE_URL}/api/products/${productId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('API delete product error:', e);
    }
  }, []);

  // Category CRUD
  const updateCategory = useCallback(async (updatedCategory: Category) => {
    setCategories((prev) => {
      const next = prev.map((c) => (c.id === updatedCategory.id ? updatedCategory : c));
      try {
        localStorage.setItem('ssoil_categories', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    try {
      await fetch(`${API_BASE_URL}/api/products/categories/${updatedCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedCategory.title,
          slug: updatedCategory.slug,
          description: updatedCategory.subtitle,
          image: updatedCategory.image,
        }),
      });
    } catch (e) {
      console.warn('API update category error:', e);
    }
  }, []);

  const addCategory = useCallback(async (newCategory: Category) => {
    setCategories((prev) => {
      const next = [...prev, newCategory];
      try {
        localStorage.setItem('ssoil_categories', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    try {
      await fetch(`${API_BASE_URL}/api/products/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newCategory.title,
          slug: newCategory.slug,
          description: newCategory.subtitle,
          image: newCategory.image,
        }),
      });
    } catch (e) {
      console.warn('API add category error:', e);
    }
  }, []);

  const deleteCategory = useCallback(async (categoryId: string) => {
    setCategories((prev) => {
      const next = prev.filter((c) => c.id !== categoryId);
      try {
        localStorage.setItem('ssoil_categories', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    try {
      await fetch(`${API_BASE_URL}/api/products/categories/${categoryId}`, {
        method: 'DELETE',
      });
    } catch (e) {
      console.warn('API delete category error:', e);
    }
  }, []);

  return (
    <StoreContext.Provider
      value={{
        settings,
        updateSettings,
        products,
        categories,
        updateProduct,
        addProduct,
        deleteProduct,
        updateCategory,
        addCategory,
        deleteCategory,
        refreshData,
        isLoading,
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export const useStore = (): StoreContextType => {
  const context = useContext(StoreContext);
  if (!context) {
    throw new Error('useStore must be used within a StoreProvider');
  }
  return context;
};

