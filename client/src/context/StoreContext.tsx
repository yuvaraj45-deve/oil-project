import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, Category, StoreSettings, DEFAULT_STORE_SETTINGS } from '../types';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '../data/oilData';

const API_BASE_URL = import.meta.env.VITE_API_URL || (typeof window !== 'undefined' && window.location.hostname === 'localhost' ? 'http://localhost:5000' : '');

const getDeletedProductIds = (): string[] => {
  try {
    const raw = localStorage.getItem('ssoil_deleted_products');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const mergeProducts = (base: Product[], ...sources: (Product[] | undefined | null)[]): Product[] => {
  const deletedIds = getDeletedProductIds();
  const map = new Map<string, Product>();

  // Baseline products
  base.forEach((p) => {
    if (!deletedIds.includes(p.id)) {
      map.set(p.id, p);
    }
  });

  // Sources (localStorage, API response, etc.)
  sources.forEach((src) => {
    if (!src || !Array.isArray(src)) return;
    src.forEach((p) => {
      if (!p || !p.id || deletedIds.includes(p.id)) return;
      const matchedKey = Array.from(map.keys()).find((k) => {
        const item = map.get(k);
        return (
          item &&
          (item.id === p.id ||
            (item.name && p.name && item.name.toLowerCase().trim() === p.name.toLowerCase().trim()))
        );
      });
      if (matchedKey) {
        map.set(matchedKey, { ...map.get(matchedKey)!, ...p });
      } else {
        map.set(p.id, p);
      }
    });
  });

  return Array.from(map.values());
};

const mergeCategories = (base: Category[], ...sources: (Category[] | undefined | null)[]): Category[] => {
  const map = new Map<string, Category>();
  base.forEach((c) => {
    if (c?.slug) map.set(c.slug, c);
  });
  sources.forEach((src) => {
    if (!src || !Array.isArray(src)) return;
    src.forEach((c) => {
      if (!c || !c.slug) return;
      const existing = map.get(c.slug);
      if (existing) {
        map.set(c.slug, { ...existing, ...c });
      } else {
        map.set(c.slug, c);
      }
    });
  });
  return Array.from(map.values());
};

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
        const parsed = JSON.parse(saved);
        if (!parsed.storeName || parsed.storeName === "Gem's gold") {
          parsed.storeName = 'ss oil';
          try {
            localStorage.setItem('ssoil_admin_settings', JSON.stringify({ ...DEFAULT_STORE_SETTINGS, ...parsed }));
          } catch {}
        }
        return { ...DEFAULT_STORE_SETTINGS, ...parsed };
      }
    } catch (e) {
      console.error('Error reading saved store settings:', e);
    }
    return DEFAULT_STORE_SETTINGS;
  });

  // 2. Products State (Always guarantees all 9 base catalog products + any locally added or saved products)
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('ssoil_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeProducts(PRODUCTS_DATA, parsed);
        }
      }
    } catch (e) {
      console.error('Error reading saved products:', e);
    }
    return PRODUCTS_DATA;
  });

  // 3. Categories State (Sync with localStorage 'ssoil_categories' and CATEGORIES_DATA)
  const [categories, setCategories] = useState<Category[]>(() => {
    try {
      const saved = localStorage.getItem('ssoil_categories');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return mergeCategories(CATEGORIES_DATA, parsed);
        }
      }
    } catch (e) {
      console.error('Error reading saved categories:', e);
    }
    return CATEGORIES_DATA;
  });

  const [isLoading, setIsLoading] = useState(false);

  // Helper to fetch live from backend API if online
  const refreshData = useCallback(async () => {
    if (!API_BASE_URL) return;
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
              image: c.image || fallback?.image || '/products/sesame_oil.jpg',
              itemCount: `${c._count?.products || 4} Variants`,
              badge: fallback?.badge || 'Wood-Pressed',
              highlightText: fallback?.highlightText || 'Native Seeds',
            };
          });

          let localSavedCats: Category[] = [];
          try {
            const saved = localStorage.getItem('ssoil_categories');
            if (saved) localSavedCats = JSON.parse(saved);
          } catch {}

          const finalCats = mergeCategories(CATEGORIES_DATA, mappedCats, localSavedCats);
          setCategories(finalCats);
          localStorage.setItem('ssoil_categories', JSON.stringify(finalCats));
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
              image: p.image || fallback?.image || '/products/sesame_oil.jpg',
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

          // Read any custom products currently in localStorage
          let localSavedProds: Product[] = [];
          try {
            const saved = localStorage.getItem('ssoil_products');
            if (saved) localSavedProds = JSON.parse(saved);
          } catch {}

          const finalProds = mergeProducts(PRODUCTS_DATA, mappedProds, localSavedProds);
          setProducts(finalProds);
          localStorage.setItem('ssoil_products', JSON.stringify(finalProds));
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
        window.dispatchEvent(new Event('store_settings_updated'));
      } catch (e) {
        console.error('Error saving settings:', e);
      }
      return updated;
    });
  }, []);

  // Listen for settings changes across windows/tabs and local triggers
  useEffect(() => {
    const handleStorageChange = () => {
      try {
        const saved = localStorage.getItem('ssoil_admin_settings');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (!parsed.storeName || parsed.storeName === "Gem's gold") {
            parsed.storeName = 'ss oil';
          }
          setSettings((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.error('Error reloading settings:', e);
      }
    };
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('store_settings_updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('store_settings_updated', handleStorageChange);
    };
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
    // 0. Remove from deleted products list if re-added
    try {
      const deletedRaw = localStorage.getItem('ssoil_deleted_products');
      if (deletedRaw) {
        const deletedArr: string[] = JSON.parse(deletedRaw);
        const filtered = deletedArr.filter((id) => id !== newProduct.id);
        localStorage.setItem('ssoil_deleted_products', JSON.stringify(filtered));
      }
    } catch (e) {}

    // 1. Immediately update state and localStorage
    setProducts((prev) => {
      const next = [newProduct, ...prev.filter((p) => p.id !== newProduct.id)];
      try {
        localStorage.setItem('ssoil_products', JSON.stringify(next));
      } catch (e) {}
      return next;
    });

    // 2. Persist to API if reachable
    if (!API_BASE_URL) return;
    try {
      const res = await fetch(`${API_BASE_URL}/api/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newProduct.name,
          slug: newProduct.slug || newProduct.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),
          tagline: newProduct.tagline,
          description: newProduct.description,
          price: newProduct.price,
          originalPrice: newProduct.originalPrice,
          discountPercent: newProduct.discountPercent,
          defaultPack: newProduct.defaultPack,
          image: newProduct.image,
          badge: newProduct.badge,
          smokePoint: newProduct.smokePoint,
          extractionMethod: newProduct.extractionMethod,
          inStock: newProduct.inStock,
          featured: newProduct.featured,
          categoryId: newProduct.category,
          categorySlug: newProduct.category,
          categoryName: newProduct.categoryName,
          packSizes: newProduct.packSizes?.map((ps) => ({
            packSize: ps,
            price: newProduct.price,
            originalPrice: newProduct.originalPrice,
            inStock: newProduct.inStock,
          })),
        }),
      });

      if (res.ok) {
        const resData = await res.json();
        if (resData.success && resData.data?.id) {
          const serverId = resData.data.id;
          const serverSlug = resData.data.slug;
          setProducts((prev) => {
            const updated = prev.map((p) =>
              p.id === newProduct.id ? { ...p, id: serverId, slug: serverSlug } : p
            );
            try {
              localStorage.setItem('ssoil_products', JSON.stringify(updated));
            } catch (e) {}
            return updated;
          });
        }
      }
    } catch (e) {
      console.warn('API add product error:', e);
    }
  }, []);

  const deleteProduct = useCallback(async (productId: string) => {
    setProducts((prev) => {
      const next = prev.filter((p) => p.id !== productId);
      try {
        localStorage.setItem('ssoil_products', JSON.stringify(next));
        const deletedRaw = localStorage.getItem('ssoil_deleted_products');
        const deletedArr: string[] = deletedRaw ? JSON.parse(deletedRaw) : [];
        if (!deletedArr.includes(productId)) {
          deletedArr.push(productId);
          localStorage.setItem('ssoil_deleted_products', JSON.stringify(deletedArr));
        }
      } catch (e) {}
      return next;
    });

    // Background API call
    if (!API_BASE_URL) return;
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

