import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ComboOffer, Product } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (typeof window !== 'undefined' &&
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
    ? 'http://localhost:5000'
    : '');

// Helper to convert ComboOffer into standard Product for seamless Cart & Checkout integration
export const comboOfferToProduct = (combo: ComboOffer): Product => {
  const savings = Math.max(0, combo.originalPrice - combo.discountedPrice);
  const itemsText = (combo.items || [])
    .map((i) => `${i.quantity}x ${i.productName} (${i.packSize})`)
    .join(' + ');

  return {
    id: combo.id,
    slug: `combo-${combo.id}`,
    name: combo.title,
    tamilName: combo.tamilTitle || combo.title,
    tagline: combo.description || itemsText,
    tamilTagline: combo.tamilDescription || combo.tamilTitle || itemsText,
    category: 'combo-offers',
    categoryName: 'Combo Offers',
    price: combo.discountedPrice,
    originalPrice: combo.originalPrice,
    discountPercent:
      combo.discountPercent ||
      (combo.originalPrice ? Math.round((savings / combo.originalPrice) * 100) : 0),
    rating: combo.rating || 5.0,
    reviewsCount: combo.reviewsCount || 240,
    packSizes: [combo.packSize || '1 Combo Box'],
    defaultPack: combo.packSize || '1 Combo Box',
    image: combo.imageUrl || '/products/sesame_oil.jpg?v=ssoil',
    badge: combo.badge || 'Special Deal',
    description: combo.description || itemsText,
    benefits: (combo.items || []).map(
      (i) => `${i.quantity} × ${i.productName} (${i.packSize})`
    ),
    smokePoint: '232°C (Various)',
    extractionMethod: 'Vaagai Wood Mara Chekku Traditional Cold Extraction',
    inStock: combo.isActive !== false,
  };
};

interface ComboContextType {
  combos: ComboOffer[];
  activeCombos: ComboOffer[];
  isLoading: boolean;
  error: string | null;
  refreshCombos: () => Promise<void>;
  createCombo: (payload: Partial<ComboOffer>) => Promise<{ success: boolean; message: string; data?: ComboOffer }>;
  updateCombo: (id: string, payload: Partial<ComboOffer>) => Promise<{ success: boolean; message: string; data?: ComboOffer }>;
  toggleComboStatus: (id: string) => Promise<{ success: boolean; message: string; isActive?: boolean }>;
  deleteCombo: (id: string) => Promise<{ success: boolean; message: string }>;
}

const ComboContext = createContext<ComboContextType | undefined>(undefined);

export const ComboProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [combos, setCombos] = useState<ComboOffer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refreshCombos = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await fetch(`${API_BASE_URL}/api/combos?all=true`);
      const json = await res.json();
      if (json.success && Array.isArray(json.data)) {
        setCombos(json.data);
      }
    } catch (err) {
      console.warn('Could not load remote combos from server:', err);
      setError((err as Error).message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshCombos();

    const handleUpdate = () => {
      refreshCombos();
    };

    window.addEventListener('ssoil_combos_updated', handleUpdate);
    return () => {
      window.removeEventListener('ssoil_combos_updated', handleUpdate);
    };
  }, []);

  const activeCombos = useMemo(() => {
    const now = new Date();
    return combos.filter((c) => {
      if (!c.isActive) return false;
      const start = c.startDate ? new Date(c.startDate) : null;
      const end = c.endDate ? new Date(c.endDate) : null;
      return (!start || now >= start) && (!end || now <= end);
    });
  }, [combos]);

  const createCombo = async (payload: Partial<ComboOffer>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/combos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        await refreshCombos();
        window.dispatchEvent(new Event('ssoil_combos_updated'));
        return { success: true, message: json.message || 'Combo created successfully', data: json.data };
      }
      return { success: false, message: json.message || 'Failed to create combo' };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  };

  const updateCombo = async (id: string, payload: Partial<ComboOffer>) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/combos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const json = await res.json();
      if (json.success) {
        await refreshCombos();
        window.dispatchEvent(new Event('ssoil_combos_updated'));
        return { success: true, message: json.message || 'Combo updated successfully', data: json.data };
      }
      return { success: false, message: json.message || 'Failed to update combo' };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  };

  const toggleComboStatus = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/combos/${id}/toggle`, {
        method: 'PATCH',
      });
      const json = await res.json();
      if (json.success) {
        await refreshCombos();
        window.dispatchEvent(new Event('ssoil_combos_updated'));
        return { success: true, message: json.message || 'Status toggled successfully', isActive: json.isActive };
      }
      return { success: false, message: json.message || 'Failed to toggle status' };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  };

  const deleteCombo = async (id: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/combos/${id}`, {
        method: 'DELETE',
      });
      const json = await res.json();
      if (json.success) {
        await refreshCombos();
        window.dispatchEvent(new Event('ssoil_combos_updated'));
        return { success: true, message: json.message || 'Combo deleted successfully' };
      }
      return { success: false, message: json.message || 'Failed to delete combo' };
    } catch (err) {
      return { success: false, message: (err as Error).message };
    }
  };

  return (
    <ComboContext.Provider
      value={{
        combos,
        activeCombos,
        isLoading,
        error,
        refreshCombos,
        createCombo,
        updateCombo,
        toggleComboStatus,
        deleteCombo,
      }}
    >
      {children}
    </ComboContext.Provider>
  );
};

export const useCombos = () => {
  const ctx = useContext(ComboContext);
  if (!ctx) {
    throw new Error('useCombos must be used within a ComboProvider');
  }
  return ctx;
};
