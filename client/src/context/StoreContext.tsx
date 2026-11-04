import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import {
  Product,
  Category,
  StoreSettings,
  DEFAULT_STORE_SETTINGS,
  HomeFeaturedVideo,
  DEFAULT_HOME_FEATURED_VIDEO,
  ReelStory,
  DEFAULT_REELS_DATA,
  StandingBottleItem,
  DEFAULT_STANDING_BOTTLES,
} from '../types';
import { PRODUCTS_DATA, CATEGORIES_DATA } from '../data/oilData';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : '');

const getDeletedProductIds = (): string[] => {
  try {
    const raw = localStorage.getItem('ssoil_deleted_products');
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

export const getProductKey = (p: Product): string => {
  if (!p) return '';
  const s = `${p.id || ''} ${p.slug || ''} ${p.name || ''} ${p.category || ''}`.toLowerCase();
  if (s.includes('groundnut') || s.includes('கடலை') || s.includes('peanut')) return 'oil_groundnut';
  if (s.includes('sesame') || s.includes('நல்லெண்ணெய்') || s.includes('gingelly')) return 'oil_sesame';
  if (s.includes('coconut') || s.includes('தேங்காய்')) return 'oil_coconut';
  if (s.includes('mustard') || s.includes('கடுகு')) return 'oil_mustard';
  if (s.includes('sunflower') || s.includes('சூரியகாந்தி')) return 'oil_sunflower';
  if (s.includes('rice') || s.includes('தவிடு') || s.includes('rice-bran')) return 'oil_ricebran';
  if (s.includes('pooja') || s.includes('deepam') || s.includes('தீப')) return 'oil_pooja';
  if (s.includes('ghee') || s.includes('நெய்')) return 'oil_ghee';
  if (s.includes('jaggery') || s.includes('karupatti') || s.includes('கருப்பட்டி')) return 'oil_jaggery';
  return p.id || p.slug || p.name.toLowerCase().trim();
};

export const getCategoryKey = (c: Category): string => {
  if (!c) return '';
  const s = `${c.id || ''} ${c.slug || ''} ${c.title || ''}`.toLowerCase();
  if (s.includes('groundnut') || s.includes('கடலை')) return 'cat_groundnut';
  if (s.includes('sesame') || s.includes('நல்லெண்ணெய்') || s.includes('gingelly')) return 'cat_sesame';
  if (s.includes('coconut') || s.includes('தேங்காய்')) return 'cat_coconut';
  if (s.includes('mustard') || s.includes('கடுகு')) return 'cat_mustard';
  if (s.includes('cooking') || s.includes('சமையல்')) return 'cat_cooking';
  if (s.includes('pooja') || s.includes('deepam') || s.includes('தீப')) return 'cat_pooja';
  if (s.includes('ghee') || s.includes('நெய்')) return 'cat_ghee';
  if (s.includes('jaggery') || s.includes('karupatti') || s.includes('கருப்பட்டி')) return 'cat_jaggery';
  return c.slug || c.id || c.title.toLowerCase().trim();
};

export const normalizeHomepage4 = (configuredIds: string[] | undefined, allProds: Product[]): Product[] => {
  if (!allProds || allProds.length === 0) return [];
  const selected: Product[] = [];
  const ids = configuredIds && configuredIds.length > 0 ? configuredIds : [];

  for (const id of ids) {
    if (selected.length >= 4) break;
    if (!id) continue;
    const found = allProds.find(
      (p) =>
        !selected.some((sp) => sp.id === p.id) &&
        (p.id === id ||
          p.slug === id ||
          (p.name && p.name.toLowerCase().trim() === id.toLowerCase().trim()) ||
          getProductKey(p) === id)
    );
    if (found) {
      selected.push(found);
    }
  }

  // Fill up to 4 with distinct products
  for (const p of allProds) {
    if (selected.length >= 4) break;
    if (!selected.some((sp) => sp.id === p.id)) {
      selected.push(p);
    }
  }

  return selected;
};

const mergeProducts = (base: Product[], ...sources: (Product[] | undefined | null)[]): Product[] => {
  const deletedIds = getDeletedProductIds();
  const map = new Map<string, Product>();

  // Baseline products
  base.forEach((p) => {
    if (!deletedIds.includes(p.id)) {
      const key = getProductKey(p);
      map.set(key, p);
    }
  });

  // Sources (API response, and lastly localStorage which MUST win)
  sources.forEach((src) => {
    if (!src || !Array.isArray(src)) return;
    src.forEach((p) => {
      if (!p || !p.id || deletedIds.includes(p.id)) return;
      const key = getProductKey(p);
      const existing = map.get(key);
      if (existing) {
        map.set(key, { ...existing, ...p });
      } else {
        map.set(key, p);
      }
    });
  });

  return Array.from(map.values());
};

const mergeCategories = (base: Category[], ...sources: (Category[] | undefined | null)[]): Category[] => {
  const map = new Map<string, Category>();
  base.forEach((c) => {
    if (c?.slug || c?.id) {
      const key = getCategoryKey(c);
      map.set(key, c);
    }
  });
  sources.forEach((src) => {
    if (!src || !Array.isArray(src)) return;
    src.forEach((c) => {
      if (!c || (!c.slug && !c.id)) return;
      const key = getCategoryKey(c);
      const existing = map.get(key);
      if (existing) {
        map.set(key, { ...existing, ...c });
      } else {
        map.set(key, c);
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
  homeFeaturedVideo: HomeFeaturedVideo;
  updateHomeFeaturedVideo: (video: Partial<HomeFeaturedVideo>) => void;
  reels: ReelStory[];
  addReel: (reel: ReelStory) => void;
  updateReel: (reel: ReelStory) => void;
  deleteReel: (id: string) => void;
  resetReels: () => void;
  standingBottles: StandingBottleItem[];
  updateStandingBottles: (bottles: StandingBottleItem[]) => void;
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

  // 4. Home Featured Video State (Sync with localStorage 'ssoil_featured_video')
  const [homeFeaturedVideo, setHomeFeaturedVideo] = useState<HomeFeaturedVideo>(() => {
    try {
      const saved = localStorage.getItem('ssoil_featured_video');
      if (saved) return { ...DEFAULT_HOME_FEATURED_VIDEO, ...JSON.parse(saved) };
    } catch {}
    return DEFAULT_HOME_FEATURED_VIDEO;
  });

  const updateHomeFeaturedVideo = useCallback((newVideo: Partial<HomeFeaturedVideo>) => {
    setHomeFeaturedVideo((prev) => {
      const updated = { ...prev, ...newVideo };
      try {
        localStorage.setItem('ssoil_featured_video', JSON.stringify(updated));
        window.dispatchEvent(new Event('ssoil_video_updated'));
      } catch {}
      return updated;
    });
  }, []);

  // 5. Home Reels State (Sync with localStorage 'ssoil_reels')
  const [reels, setReels] = useState<ReelStory[]>(() => {
    try {
      const saved = localStorage.getItem('ssoil_reels');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return DEFAULT_REELS_DATA;
  });

  const addReel = useCallback((reel: ReelStory) => {
    setReels((prev) => {
      const updated = [reel, ...prev];
      try {
        localStorage.setItem('ssoil_reels', JSON.stringify(updated));
        window.dispatchEvent(new Event('ssoil_video_updated'));
      } catch {}
      return updated;
    });
  }, []);

  const updateReel = useCallback((updatedReel: ReelStory) => {
    setReels((prev) => {
      const updated = prev.map((r) => (r.id === updatedReel.id ? updatedReel : r));
      try {
        localStorage.setItem('ssoil_reels', JSON.stringify(updated));
        window.dispatchEvent(new Event('ssoil_video_updated'));
      } catch {}
      return updated;
    });
  }, []);

  const deleteReel = useCallback((id: string) => {
    setReels((prev) => {
      const updated = prev.filter((r) => r.id !== id);
      try {
        localStorage.setItem('ssoil_reels', JSON.stringify(updated));
        window.dispatchEvent(new Event('ssoil_video_updated'));
      } catch {}
      return updated;
    });
  }, []);

  const resetReels = useCallback(() => {
    setReels(DEFAULT_REELS_DATA);
    try {
      localStorage.setItem('ssoil_reels', JSON.stringify(DEFAULT_REELS_DATA));
      window.dispatchEvent(new Event('ssoil_video_updated'));
    } catch {}
  }, []);

  // Helper to sanitize bottle entries, ensuring uniform standing bottles matching the line-up
  const sanitizeBottlesList = (list: StandingBottleItem[]): StandingBottleItem[] => {
    if (!Array.isArray(list) || list.length === 0) {
      return DEFAULT_STANDING_BOTTLES;
    }
    const hasCorrupt = list.some(
      (b) =>
        !b ||
        !b.name ||
        b.name.toLowerCase().includes('new pure') ||
        b.name.toLowerCase().includes('ss oil can') ||
        b.name.toLowerCase().includes('oil can') ||
        b.image?.includes('ss_oil_can') ||
        b.image?.includes('unsplash') ||
        b.image?.includes('photo-')
    );
    if (hasCorrupt || list.length < 7 || list[0]?.slug !== 'groundnut-oil') {
      return DEFAULT_STANDING_BOTTLES;
    }
    return list;
  };

  // 6. Standing Bottles & Cans Showcase State (Sync with localStorage 'ssoil_standing_bottles')
  const [standingBottles, setStandingBottles] = useState<StandingBottleItem[]>(() => {
    try {
      const saved = localStorage.getItem('ssoil_standing_bottles');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const sanitized = sanitizeBottlesList(parsed);
          localStorage.setItem('ssoil_standing_bottles', JSON.stringify(sanitized));
          return sanitized;
        }
      }
    } catch (e) {
      console.error('Error reading saved standing bottles:', e);
    }
    try {
      localStorage.setItem('ssoil_standing_bottles', JSON.stringify(DEFAULT_STANDING_BOTTLES));
    } catch {}
    return DEFAULT_STANDING_BOTTLES;
  });

  const updateStandingBottles = useCallback((newBottles: StandingBottleItem[]) => {
    const sanitized = sanitizeBottlesList(newBottles);
    setStandingBottles(sanitized);
    try {
      localStorage.setItem('ssoil_standing_bottles', JSON.stringify(sanitized));
      window.dispatchEvent(new Event('ssoil_bottles_updated'));
    } catch (e) {
      console.error('Error saving standing bottles:', e);
    }
  }, []);

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
            const isOriginalCat = fallback && fallback.title.toLowerCase().trim() === c.name.toLowerCase().trim();
            const resolvedTamilTitle = isOriginalCat ? fallback.tamilTitle : (c.tamilTitle || c.name);
            return {
              id: c.id,
              slug: c.slug,
              title: c.name,
              tamilTitle: resolvedTamilTitle,
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
            const isOriginalName = fallback && fallback.name.toLowerCase().trim() === p.name.toLowerCase().trim();
            const resolvedTamilName = isOriginalName ? fallback.tamilName : (p.tamilName || p.name);
            return {
              id: p.id,
              name: p.name,
              tamilName: resolvedTamilName,
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

  // Listen for product changes across windows/tabs and local updates
  useEffect(() => {
    const handleProductsStorageChange = () => {
      try {
        const saved = localStorage.getItem('ssoil_products');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(mergeProducts(PRODUCTS_DATA, parsed));
          }
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleProductsStorageChange);
    window.addEventListener('ssoil_products_updated', handleProductsStorageChange);
    return () => {
      window.removeEventListener('storage', handleProductsStorageChange);
      window.removeEventListener('ssoil_products_updated', handleProductsStorageChange);
    };
  }, []);

  // Listen for video and reel changes across windows/tabs
  useEffect(() => {
    const handleVideoStorageChange = () => {
      try {
        const savedVideo = localStorage.getItem('ssoil_featured_video');
        if (savedVideo) {
          setHomeFeaturedVideo((prev) => ({ ...prev, ...JSON.parse(savedVideo) }));
        }
        const savedReels = localStorage.getItem('ssoil_reels');
        if (savedReels) {
          const parsed = JSON.parse(savedReels);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setReels(parsed);
          }
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleVideoStorageChange);
    window.addEventListener('ssoil_video_updated', handleVideoStorageChange);
    return () => {
      window.removeEventListener('storage', handleVideoStorageChange);
      window.removeEventListener('ssoil_video_updated', handleVideoStorageChange);
    };
  }, []);

  // Listen for category changes across windows/tabs and local updates
  useEffect(() => {
    const handleCategoriesStorageChange = () => {
      try {
        const saved = localStorage.getItem('ssoil_categories');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setCategories(mergeCategories(CATEGORIES_DATA, parsed));
          }
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleCategoriesStorageChange);
    window.addEventListener('ssoil_categories_updated', handleCategoriesStorageChange);
    return () => {
      window.removeEventListener('storage', handleCategoriesStorageChange);
      window.removeEventListener('ssoil_categories_updated', handleCategoriesStorageChange);
    };
  }, []);

  // Listen for standing bottles changes across windows/tabs
  useEffect(() => {
    const handleBottlesStorageChange = () => {
      try {
        const saved = localStorage.getItem('ssoil_standing_bottles');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setStandingBottles(sanitizeBottlesList(parsed));
          }
        }
      } catch (e) {}
    };
    window.addEventListener('storage', handleBottlesStorageChange);
    window.addEventListener('ssoil_bottles_updated', handleBottlesStorageChange);
    return () => {
      window.removeEventListener('storage', handleBottlesStorageChange);
      window.removeEventListener('ssoil_bottles_updated', handleBottlesStorageChange);
    };
  }, []);

  // Product CRUD
  const updateProduct = useCallback(async (updatedProduct: Product) => {
    setProducts((prev) => {
      const targetKey = getProductKey(updatedProduct);
      let matched = false;
      const next = prev.map((p) => {
        if (
          p.id === updatedProduct.id ||
          (p.slug && updatedProduct.slug && p.slug === updatedProduct.slug) ||
          (p.name && updatedProduct.name && p.name.toLowerCase().trim() === updatedProduct.name.toLowerCase().trim()) ||
          getProductKey(p) === targetKey
        ) {
          matched = true;
          return { ...p, ...updatedProduct };
        }
        return p;
      });
      const finalNext = matched ? next : [updatedProduct, ...prev];
      try {
        localStorage.setItem('ssoil_products', JSON.stringify(finalNext));
        window.dispatchEvent(new Event('ssoil_products_updated'));
      } catch (e) {}
      return finalNext;
    });

    // Background API call
    if (!API_BASE_URL) return;
    try {
      await fetch(`${API_BASE_URL}/api/products/${updatedProduct.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: updatedProduct.name,
          slug: updatedProduct.slug || updatedProduct.name.toLowerCase().replace(/\s+/g, '-'),
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
        window.dispatchEvent(new Event('ssoil_products_updated'));
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
        window.dispatchEvent(new Event('ssoil_products_updated'));
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
      const targetKey = getCategoryKey(updatedCategory);
      let matched = false;
      const next = prev.map((c) => {
        if (
          c.id === updatedCategory.id ||
          (c.slug && updatedCategory.slug && c.slug === updatedCategory.slug) ||
          getCategoryKey(c) === targetKey
        ) {
          matched = true;
          return { ...c, ...updatedCategory };
        }
        return c;
      });
      const finalNext = matched ? next : [...prev, updatedCategory];
      try {
        localStorage.setItem('ssoil_categories', JSON.stringify(finalNext));
        window.dispatchEvent(new Event('ssoil_categories_updated'));
      } catch (e) {}
      return finalNext;
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
        window.dispatchEvent(new Event('ssoil_categories_updated'));
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
        window.dispatchEvent(new Event('ssoil_categories_updated'));
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
        homeFeaturedVideo,
        updateHomeFeaturedVideo,
        reels,
        addReel,
        updateReel,
        deleteReel,
        resetReels,
        standingBottles,
        updateStandingBottles,
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

