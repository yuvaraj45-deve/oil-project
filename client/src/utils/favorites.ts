export const getFavorites = (): string[] => {
  try {
    const raw = localStorage.getItem('ssoil_favorites');
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        // If it was just the old hardcoded default array, wipe it so user has clean favorites
        if (
          parsed.length === 2 &&
          parsed.includes('ss-groundnut-1000') &&
          parsed.includes('ss-sesame-1000')
        ) {
          localStorage.setItem('ssoil_favorites', JSON.stringify([]));
          return [];
        }
        return parsed;
      }
    }
  } catch {
    // ignore
  }
  return [];
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

