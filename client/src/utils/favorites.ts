export const getFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem('ssoil_favorites');
    if (raw) return JSON.parse(raw);
  } catch {
    // ignore
  }
  // Default favorites to popular mara chekku products
  return ['ss-groundnut-1000', 'ss-sesame-1000'];
};

export const toggleFavorite = (productId: string): boolean => {
  try {
    const current = getFavorites();
    let updated: string[];
    let isAdded = false;
    if (current.includes(productId)) {
      updated = current.filter((id) => id !== productId);
      isAdded = false;
    } else {
      updated = [...current, productId];
      isAdded = true;
    }
    localStorage.setItem('ssoil_favorites', JSON.stringify(updated));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('ssoil_favorites_updated', { detail: updated }));
    }
    return isAdded;
  } catch {
    return false;
  }
};

export const isFavorite = (productId: string): boolean => {
  return getFavorites().includes(productId);
};
