import React, { useState, useEffect, useMemo } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { CategoryCircles } from './components/CategoryCircles';
import { ValuePillars } from './components/ValuePillars';
import { OurProductRange } from './components/OurProductRange';
import { FeaturedProducts } from './components/FeaturedProducts';
import { PureDifference } from './components/PureDifference';
import { MakeTheSwitchBanner } from './components/MakeTheSwitchBanner';
import { SSOilQualityBanner } from './components/SSOilQualityBanner';
import { HomeFeaturedVideoBanner } from './components/HomeFeaturedVideoBanner';
import { CraftsmanshipVisualizer } from './components/CraftsmanshipVisualizer';
import { PurityComparison } from './components/PurityComparison';
import { HealthyRecipesSection } from './components/HealthyRecipesSection';
import { EasyOilGuide } from './components/EasyOilGuide';
import { WhyChooseUs } from './components/WhyChooseUs';
import { PromotionalBanner } from './components/PromotionalBanner';
import { Testimonials } from './components/Testimonials';
import { AboutSection } from './components/AboutSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { SearchModal } from './components/SearchModal';
import { LabReportModal } from './components/LabReportModal';
import { QuickDock } from './components/QuickDock';
import { Toast } from './components/Toast';
import { CheckoutModal } from './components/CheckoutModal';
import { OrderSuccessModal } from './components/OrderSuccessModal';
import { AdminPage } from './components/AdminPage';
import { ProfileModal } from './components/ProfileModal';
import { FaqModal } from './components/FaqModal';
import { Product, CartItem, PlacedOrder, UserProfile } from './types';
import { PRODUCTS_DATA } from './data/oilData';
import { useStore } from './context/StoreContext';

// Dedicated Page Components for each Navbar route
import { ShopPage } from './pages/ShopPage';
import { MillJourneyPage } from './pages/MillJourneyPage';
import { SommelierPage } from './pages/SommelierPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { WhyUsPage } from './pages/WhyUsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { ProfilePage } from './pages/ProfilePage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CategoryDetailPage } from './pages/CategoryDetailPage';
import { CancelOrderPage } from './pages/CancelOrderPage';
import { ShippingReturnsPage } from './pages/ShippingReturnsPage';
import { PrivacyPolicyPage } from './pages/PrivacyPolicyPage';
import { TermsOfServicePage } from './pages/TermsOfServicePage';
import { CartPage } from './pages/CartPage';
import { FaqPage } from './pages/FaqPage';
import { OffersPage } from './pages/OffersPage';

export function App() {
  const { products, categories, settings } = useStore();
  const effectiveProducts = products && products.length > 0 ? products : PRODUCTS_DATA;

  // Shopping Cart state (starts 100% empty until user explicitly adds an item)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('ssoil_cart');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) return parsed;
      }
    } catch (e) {}
    return [];
  });

  // Sync cart to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('ssoil_cart', JSON.stringify(cartItems));
    } catch (e) {}
  }, [cartItems]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isFaqOpen, setIsFaqOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    try {
      const saved = localStorage.getItem('ssoil_user');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      // ignore
    }
    return null;
  });

  // Dedicated Admin Unlock State: Requires entering Email ID & Password to access /admin
  const [isAdminUnlocked, setIsAdminUnlocked] = useState<boolean>(() => {
    try {
      return sessionStorage.getItem('pureva_admin_unlocked') === 'true';
    } catch (e) {
      return false;
    }
  });
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedLabReportProduct, setSelectedLabReportProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Path-based Router State (/ or /admin)
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setCurrentPath(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateTo = (path: string) => {
    // When visiting /shop, always reset category to 'all' so every single admin product is visible
    if (path === '/shop') {
      setSelectedCategory('all');
    }
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (product: Product) => {
    // Navigate with unique product.id so it never collides or falls back to the wrong product
    navigateTo(`/product/${product.id}`);
  };

  // Dedicated Product Route Helper (/product/:slug or /product/:id)
  const isProductRoute = currentPath.startsWith('/product/');
  const productIdentifier = isProductRoute
    ? decodeURIComponent(currentPath.replace('/product/', '').replace(/\/$/, '')).trim()
    : null;
  const currentProduct = productIdentifier
    ? effectiveProducts.find((p) => p.id === productIdentifier) ||
      effectiveProducts.find((p) => p.slug && p.slug.toLowerCase() === productIdentifier.toLowerCase()) ||
      effectiveProducts.find((p) => p.name && p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') === productIdentifier.toLowerCase()) ||
      effectiveProducts.find((p) => p.name && p.name.toLowerCase().trim() === productIdentifier.toLowerCase()) ||
      PRODUCTS_DATA.find((p) => p.id === productIdentifier) ||
      PRODUCTS_DATA.find((p) => p.slug && p.slug.toLowerCase() === productIdentifier.toLowerCase()) ||
      null
    : null;

  // Dedicated Category Route Helper (/category/:slug)
  const isCategoryRoute = currentPath.startsWith('/category/');
  const categorySlug = isCategoryRoute
    ? currentPath.replace('/category/', '').replace(/\/$/, '')
    : null;

  // Checkout & Admin States
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [isOrderSuccessOpen, setIsOrderSuccessOpen] = useState(false);
  const [lastPlacedOrder, setLastPlacedOrder] = useState<PlacedOrder | null>(null);

  // Helper to filter out fake demo/seed orders
  const isGenuineOrder = (o: any): boolean => {
    if (!o || typeof o !== 'object') return false;
    if (['ord_1', 'ord_2', 'ord_3', 'ord-1', 'ord-2', 'ord-3', 'demo_1', 'demo_2'].includes(o.id)) return false;
    if (o.customerName === 'Demo User' || o.customerName === 'Sample Customer') return false;
    if (!o.items || !Array.isArray(o.items) || o.items.length === 0) return false;
    return true;
  };

  // Live Orders List with localStorage persistence (no fake dummy seed orders)
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('ssoil_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed.filter(isGenuineOrder);
        }
      }
    } catch (e) {}
    return [];
  });

  // Clean out any old dummy demo orders from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('ssoil_orders');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          const cleaned = parsed.filter(isGenuineOrder);
          if (cleaned.length !== parsed.length) {
            localStorage.setItem('ssoil_orders', JSON.stringify(cleaned));
            setOrders(cleaned);
          }
        }
      }
    } catch (e) {}
  }, []);

  // Sync orders to localStorage on any change
  useEffect(() => {
    try {
      localStorage.setItem('ssoil_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

  // User-isolated genuine orders: Only show orders belonging to the logged-in user
  const userOrders = useMemo(() => {
    if (!currentUser) return [];
    return orders.filter((o) => {
      if (!isGenuineOrder(o)) return false;
      if (o.userId && currentUser.id && o.userId === currentUser.id) return true;
      if (currentUser.phone && o.customerPhone && o.customerPhone.replace(/\D/g, '') === currentUser.phone.replace(/\D/g, '')) return true;
      if (currentUser.email && o.customerEmail && o.customerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()) return true;
      return false;
    });
  }, [orders, currentUser]);

  // Handle Order Cancellation with Reason
  const handleCancelOrder = (orderId: string, reason: string, note?: string) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              orderStatus: 'CANCELLED' as const,
              cancelReason: reason,
              cancelledAt: new Date().toISOString(),
            }
          : o
      )
    );
    setToastMessage(`Order cancelled: "${reason}"`);
  };

  // Dedicated Order Cancellation State & Navigation
  const [orderToCancel, setOrderToCancel] = useState<PlacedOrder | null>(null);

  const handleStartCancelOrder = (order: PlacedOrder) => {
    setOrderToCancel(order);
    setIsCartOpen(false);
    navigateTo(`/cancel-order/${order.id}`);
  };

  // Helper to calculate pack price accurately based on pack size
  const calculatePackPrice = (basePrice: number, pack: string): number => {
    if (!pack) return basePrice;
    if (pack.includes('500 ml') || pack.includes('500ml') || pack.includes('500g')) {
      return Math.round(basePrice * 0.55);
    }
    if (pack.includes('250 ml') || pack.includes('250g') || pack.includes('250ml')) {
      return Math.round(basePrice * 0.32);
    }
    if (pack.includes('2 Litre') || pack.includes('2L') || pack.includes('2 Litre Can') || pack.includes('2 Litre Bottle') || pack.includes('2 kg')) {
      return Math.round(basePrice * 1.95);
    }
    if (pack.includes('5 Litre') || pack.includes('5L') || pack.includes('5 Litre Can') || pack.includes('5 Litre Tin')) {
      return Math.round(basePrice * 4.75);
    }
    if (pack.includes('15 Litre') || pack.includes('15L') || pack.includes('15 Litre Tin')) {
      return Math.round(basePrice * 13.8);
    }
    if (pack.includes('1 kg') || pack.includes('1kg')) {
      return Math.round(basePrice * 1.9);
    }
    return basePrice;
  };

  // Cart helper functions
  const handleAddToCart = (product: Product, packSize: string, quantity = 1) => {
    const unitPrice = calculatePackPrice(product.price, packSize);
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.packSize === packSize
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        updated[existingIndex].price = unitPrice;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product,
            packSize,
            quantity,
            price: unitPrice,
          },
        ];
      }
    });

    setToastMessage(`Added ${quantity}x ${product.name} (${packSize}) to your cart!`);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleUpdateQuantity = (productId: string, packSize: string, delta: number) => {
    setCartItems((prevItems) => {
      return prevItems
        .map((item) => {
          if (item.product.id === productId && item.packSize === packSize) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[];
    });
  };

  const handleRemoveItem = (productId: string, packSize: string) => {
    setCartItems((prevItems) =>
      prevItems.filter(
        (item) => !(item.product.id === productId && item.packSize === packSize)
      )
    );
  };

  const handleClearCart = () => {
    setCartItems([]);
  };

  const handleCategorySelect = (categorySlug: string) => {
    setSelectedCategory(categorySlug);
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleShopNow = () => {
    const element = document.getElementById('products');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreProducts = () => {
    const element = document.getElementById('categories');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOpenPurityReport = () => {
    setSelectedLabReportProduct(PRODUCTS_DATA[0]);
  };

  const handleOpenAdmin = () => {
    navigateTo('/admin');
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setIsCheckoutOpen(true);
  };

  const handleOrderSuccess = (newOrder: PlacedOrder) => {
    setOrders((prev) => [newOrder, ...prev]);
    setCartItems([]);
    setLastPlacedOrder(newOrder);
    setIsCheckoutOpen(false);
    setIsOrderSuccessOpen(true);
    setToastMessage(`Order #${newOrder.orderNumber} placed successfully!`);
  };

  const handleUpdateOrderStatus = (orderId: string, newStatus: PlacedOrder['orderStatus']) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, orderStatus: newStatus } : o))
    );
    setToastMessage(`Order status updated to ${newStatus}`);
  };

  // Global Unconditional Sign Out Handler (Never stays on the same page, completely resets to root homepage)
  const handleGlobalSignOut = () => {
    setIsAdminUnlocked(false);
    try {
      sessionStorage.removeItem('pureva_admin_unlocked');
      localStorage.removeItem('ssoil_user');
    } catch (e) {}
    setCurrentUser(null);
    setToastMessage('Signed out successfully.');
    window.location.href = '/';
  };

  // Dedicated Full-Page Route for /admin (PROTECTED: Unified Single Login Page)
  if (currentPath === '/admin' || currentPath === '/admin/') {
    // If not explicitly unlocked with Admin ID and Password, display the Single Unified LoginPage!
    if (!isAdminUnlocked || !currentUser || currentUser.role !== 'admin') {
      return (
        <LoginPage
          onLoginSuccess={(user) => {
            setCurrentUser(user);
            try {
              localStorage.setItem('ssoil_user', JSON.stringify(user));
            } catch (e) {}
            if (user.role === 'admin') {
              setIsAdminUnlocked(true);
              try {
                sessionStorage.setItem('pureva_admin_unlocked', 'true');
                sessionStorage.setItem('admin_active_tab', 'dashboard');
              } catch (e) {}
              setToastMessage(`Welcome back, ${user.name}! Admin Portal Unlocked 🛡️`);
              navigateTo('/admin');
            } else {
              setToastMessage(`Welcome, ${user.name}! Sign in successful`);
              navigateTo('/');
            }
          }}
          onNavigate={navigateTo}
          onOpenAdmin={() => navigateTo('/admin')}
        />
      );
    }

    // Authenticated Admin Access
    return (
      <AdminPage
        orders={orders}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        onBackToStore={() => {
          setSelectedCategory('all');
          navigateTo('/');
        }}
        onLogout={handleGlobalSignOut}
      />
    );
  }

  // Dedicated Standalone Full-Page Route for /login (No storefront navbar/footer clutter)
  if (currentPath === '/login' || currentPath === '/login/') {
    return (
      <LoginPage
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          try {
            localStorage.setItem('ssoil_user', JSON.stringify(user));
          } catch (e) {}
          if (user.role === 'admin') {
            setIsAdminUnlocked(true);
            try {
              sessionStorage.setItem('pureva_admin_unlocked', 'true');
            } catch (e) {}
            setToastMessage(`Welcome back, ${user.name}!`);
            navigateTo('/admin');
          } else {
            setToastMessage(`Welcome, ${user.name}! Sign in successful`);
            navigateTo('/');
          }
        }}
        onNavigate={navigateTo}
        onOpenAdmin={() => navigateTo('/admin')}
      />
    );
  }

  // Dedicated Standalone Full-Page Route for /cancel-order
  const isCancelOrderRoute = currentPath.startsWith('/cancel-order');
  if (isCancelOrderRoute) {
    const cancelOrderId = currentPath.replace('/cancel-order', '').replace(/^\//, '');
    const resolvedOrderToCancel =
      orderToCancel ||
      orders.find((o) => o.id === cancelOrderId || o.orderNumber === cancelOrderId) ||
      orders.find((o) => o.orderStatus === 'PROCESSING' || o.orderStatus === 'PACKED') ||
      orders[0] ||
      null;

    return (
      <CancelOrderPage
        order={resolvedOrderToCancel}
        onConfirmCancel={(orderId, reason, note) => {
          handleCancelOrder(orderId, reason, note);
        }}
        onBack={() => {
          navigateTo('/');
          setIsCartOpen(true);
        }}
        onNavigate={navigateTo}
        onViewOrders={() => {
          navigateTo('/');
          setIsCartOpen(true);
        }}
      />
    );
  }

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-800 selection:bg-gold-500 selection:text-white pb-16 md:pb-0">
      {/* 1. Header & Announcement Bar */}
      <Navbar
        cartCount={totalCartCount}
        currentPath={currentPath}
        currentUser={currentUser}
        onNavigate={navigateTo}
        onOpenCart={() => navigateTo('/cart')}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFaq={() => navigateTo('/faq')}
        onOpenProfile={() => navigateTo('/profile')}
        onNavigateToLogin={() => navigateTo('/login')}
        onSignOut={handleGlobalSignOut}
        onNavigateCategory={(cat) => {
          setSelectedCategory(cat);
          navigateTo(`/category/${cat}`);
        }}
        onOpenPurityReport={handleOpenPurityReport}
      />

      {/* Main Dedicated Page Renderer */}
      <main className="flex-1">
        {/* Dedicated Route: /category/:slug (Dedicated Full Category Page with Products) */}
        {isCategoryRoute && categorySlug && (
          <CategoryDetailPage
            categorySlug={categorySlug}
            onAddToCart={handleAddToCart}
            onBuyNow={(prod, pack, qty) => {
              handleAddToCart(prod, pack, qty);
              setIsCheckoutOpen(true);
            }}
            onViewLabReport={(p) => setSelectedLabReportProduct(p)}
            onNavigate={navigateTo}
            onSelectProduct={handleOpenProduct}
          />
        )}

        {/* Dedicated Route: /product/:slug (Full Standalone Product Detail Page) */}
        {isProductRoute && currentProduct && (
          <ProductDetailPage
            key={currentProduct.id}
            product={currentProduct}
            allProducts={effectiveProducts}
            onAddToCart={handleAddToCart}
            onBuyNow={(prod, pack, qty) => {
              handleAddToCart(prod, pack, qty);
              setIsCheckoutOpen(true);
            }}
            onViewLabReport={(p) => setSelectedLabReportProduct(p)}
            onNavigate={navigateTo}
            onSelectProduct={handleOpenProduct}
          />
        )}

        {/* Route: /shop */}
        {currentPath === '/shop' && (
          <ShopPage
            initialCategory={selectedCategory}
            onAddToCart={handleAddToCart}
            onQuickView={handleOpenProduct}
            onViewLabReport={(p) => setSelectedLabReportProduct(p)}
          />
        )}

        {/* Route: /mill-journey */}
        {currentPath === '/mill-journey' && (
          <MillJourneyPage onShopOils={() => navigateTo('/shop')} />
        )}

        {/* Route: /sommelier */}
        {currentPath === '/sommelier' && (
          <SommelierPage
            onAddToCart={handleAddToCart}
            onQuickView={handleOpenProduct}
            onExploreShop={() => navigateTo('/shop')}
          />
        )}

        {/* Route: /categories */}
        {currentPath === '/categories' && (
          <CategoriesPage
            onSelectCategory={(cat) => {
              setSelectedCategory(cat);
              navigateTo(`/category/${cat}`);
            }}
          />
        )}

        {/* Route: /why-us */}
        {currentPath === '/why-us' && (
          <WhyUsPage
            onShopOils={() => navigateTo('/shop')}
            onOpenLabModal={handleOpenPurityReport}
          />
        )}

        {/* Route: /about */}
        {currentPath === '/about' && (
          <AboutPage
            onAddToCart={handleAddToCart}
            onQuickView={handleOpenProduct}
            onViewLabReport={(p) => setSelectedLabReportProduct(p)}
            onViewAllProducts={() => {
              setSelectedCategory('all');
              navigateTo('/shop');
            }}
          />
        )}

        {/* Route: /contact */}
        {currentPath === '/contact' && <ContactPage />}

        {/* Route: /profile (Dedicated Standalone Customer Profile Page) */}
        {currentPath === '/profile' && (
          <ProfilePage
            currentUser={currentUser}
            orders={userOrders}
            onNavigate={navigateTo}
            onCancelOrder={handleCancelOrder}
            onStartCancelOrder={handleStartCancelOrder}
            onUpdateUser={(updated) => {
              setCurrentUser(updated);
              try {
                localStorage.setItem('ssoil_user', JSON.stringify(updated));
              } catch (e) {}
              setToastMessage('Profile details updated successfully');
            }}
            onSignOut={handleGlobalSignOut}
            onShopOils={() => navigateTo('/shop')}
          />
        )}

        {/* Route: /shipping-returns (Shipping, Returns & Exchange) */}
        {currentPath === '/shipping-returns' && (
          <ShippingReturnsPage onNavigate={navigateTo} />
        )}

        {/* Route: /privacy-policy (Privacy Policy) */}
        {(currentPath === '/privacy-policy' || currentPath === '/privacy') && (
          <PrivacyPolicyPage onNavigate={navigateTo} />
        )}

        {/* Route: /cart (Dedicated Full-Page Cart, Favorites & Orders Page) */}
        {currentPath === '/cart' && (
          <CartPage
            items={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            onProceedToCheckout={handleProceedToCheckout}
            orders={userOrders}
            onCancelOrder={handleCancelOrder}
            onStartCancelOrder={handleStartCancelOrder}
            onAddToCart={handleAddToCart}
            onNavigate={navigateTo}
          />
        )}

        {/* Route: /terms-of-service (Terms of Service) */}
        {(currentPath === '/terms-of-service' || currentPath === '/terms') && (
          <TermsOfServicePage onNavigate={navigateTo} />
        )}

        {/* Route: /faq (Dedicated FAQs Page) */}
        {currentPath === '/faq' && (
          <FaqPage
            onNavigate={navigateTo}
            onShopOils={() => {
              setSelectedCategory('all');
              navigateTo('/shop');
            }}
          />
        )}

        {/* Route: /offers (Dedicated Offers & Discount Coupons Page) */}
        {currentPath === '/offers' && (
          <OffersPage
            onNavigate={navigateTo}
            onOpenCart={() => setIsCartOpen(true)}
          />
        )}

        {/* Route: / (Default Flagship Homepage) */}
        {(currentPath === '/' || currentPath === '') && (
          <>
            {/* 1. Horizontal Standing Bottles Row */}
            <CategoryCircles
              onSelectCategory={(slug) => {
                setSelectedCategory(slug);
                navigateTo(`/category/${slug}`);
              }}
              selectedCategory={selectedCategory}
            />

            {/* 2. Hero Section: Timeless Purity, Modern Convenience with Yellow SHOP NOW Button */}
            <Hero
              onShopNow={() => navigateTo('/shop')}
              onExploreProducts={() => navigateTo('/shop')}
              onSelectCategory={(category) => {
                setSelectedCategory(category);
                navigateTo('/shop');
              }}
            />

            {/* 2. 4 Value Pillars: 100% Pure & Natural, Good for Health, Premium Quality, Sustainable */}
            <ValuePillars />

            {/* SS OIL 4 Quality Pillars (Quality You Can Count On, Honest Processing, Sourcing, Indian Cooking) */}
            <SSOilQualityBanner />

            {/* Homepage Featured Showcase Video (Configured dynamically from Admin Portal - Only 1 single video) */}
            <HomeFeaturedVideoBanner />

            {/* 4. Our Product Range & Categories: Pure Oils for a Healthier You */}
            <OurProductRange
              onShopProduct={(slug) => {
                setSelectedCategory(slug);
                navigateTo(`/category/${slug}`);
              }}
            />

            {/* 5. Products Showcase: Curated Products on Homepage + View All */}
            <FeaturedProducts
              onAddToCart={handleAddToCart}
              onQuickView={handleOpenProduct}
              onViewLabReport={(p) => setSelectedLabReportProduct(p)}
              selectedCategory={selectedCategory}
              onSelectCategory={(c) => setSelectedCategory(c)}
              onViewAllProducts={() => {
                setSelectedCategory('all');
                navigateTo('/shop');
              }}
            />

            {/* 6. The Mara Chekku Craftsmanship: 5-Stage Interactive Mill Journey */}
            <CraftsmanshipVisualizer />

            {/* 7. Purity Matrix: Mara Chekku vs Chemical Factory Refined Oils */}
            <PurityComparison />

            {/* 8. The Pure Difference (4 Quality Features) */}
            <PureDifference />

            {/* 9. Make the Switch to SS OIL Banner */}
            <MakeTheSwitchBanner onShopNow={() => navigateTo('/shop')} />
          </>
        )}
      </main>

      {/* 13. Footer (Rendered ONLY on Home Page) */}
      {(currentPath === '/' || currentPath === '') && (
        <Footer
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            navigateTo(`/category/${cat}`);
          }}
          onNavigate={navigateTo}
        />
      )}

      {/* Floating Bottom Quick-Order Dock (Only when cart has items and not on /cart page or with cart drawer open) */}
      {currentPath !== '/cart' && !isCartOpen && (
        <QuickDock
          items={cartItems}
          onOpenCart={() => navigateTo('/cart')}
          onOpenLabReport={handleOpenPurityReport}
          onNavigate={navigateTo}
        />
      )}

      {/* Interactive Cart Drawer with Cart, Favorites & Orders Tabs */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        orders={userOrders}
        onCancelOrder={handleCancelOrder}
        onStartCancelOrder={handleStartCancelOrder}
        onAddToCart={handleAddToCart}
        onNavigate={navigateTo}
      />

      {/* Instant Checkout Modal */}
      <CheckoutModal
        isOpen={isCheckoutOpen}
        onClose={() => setIsCheckoutOpen(false)}
        items={cartItems}
        onOrderSuccess={handleOrderSuccess}
      />

      {/* Order Confirmation Success Modal */}
      <OrderSuccessModal
        order={lastPlacedOrder}
        onClose={() => setIsOrderSuccessOpen(false)}
        onViewOrders={() => setIsCartOpen(true)}
      />

      {/* Product Quick View Modal */}
      <ProductQuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
        onViewDetails={(p) => {
          setQuickViewProduct(null);
          handleOpenProduct(p);
        }}
        onViewLabReport={(p) => {
          setQuickViewProduct(null);
          setSelectedLabReportProduct(p);
        }}
      />

      {/* Instant Search Modal (Typing 'admin' unlocks Store Admin Portal) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => handleOpenProduct(product)}
        onAddToCart={handleAddToCart}
        onOpenAdmin={handleOpenAdmin}
      />

      {/* Customer Profile & Live Order Tracking Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        orders={userOrders}
        currentUser={currentUser}
        onSignOut={() => {
          setCurrentUser(null);
          try {
            localStorage.removeItem('ssoil_user');
          } catch (e) {}
          setToastMessage('You have been signed out.');
        }}
        onNavigateToLogin={() => navigateTo('/login')}
        onExploreShop={() => navigateTo('/shop')}
      />

      {/* Frequently Asked Questions (FAQ) Modal */}
      <FaqModal
        isOpen={isFaqOpen}
        onClose={() => setIsFaqOpen(false)}
        onShopOils={() => {
          setIsFaqOpen(false);
          navigateTo('/shop');
        }}
      />

      {/* Notification Toast */}
      <Toast
        message={toastMessage}
        onClose={() => setToastMessage(null)}
      />
    </div>
  );
}

export default App;
