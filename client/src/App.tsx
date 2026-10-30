import React, { useState, useEffect } from 'react';
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
import { ReelsCarouselSection } from './components/ReelsCarouselSection';
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

export function App() {
  const { products, categories, settings } = useStore();
  const effectiveProducts = products && products.length > 0 ? products : PRODUCTS_DATA;

  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: effectiveProducts[0] || PRODUCTS_DATA[0],
      packSize: '1 Litre Bottle',
      quantity: 1,
      price: (effectiveProducts[0] || PRODUCTS_DATA[0]).price,
    },
  ]);

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
    window.history.pushState({}, '', path);
    setCurrentPath(path);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenProduct = (product: Product) => {
    navigateTo(`/product/${product.slug || product.id}`);
  };

  // Dedicated Product Route Helper (/product/:slug or /product/:id)
  const isProductRoute = currentPath.startsWith('/product/');
  const productIdentifier = isProductRoute
    ? currentPath.replace('/product/', '').replace(/\/$/, '')
    : null;
  const currentProduct = productIdentifier
    ? effectiveProducts.find(
        (p) =>
          p.id === productIdentifier ||
          p.slug === productIdentifier ||
          p.category === productIdentifier ||
          p.name.toLowerCase().includes(productIdentifier.toLowerCase().replace(/-/g, ' '))
      ) || effectiveProducts[0] || PRODUCTS_DATA[0]
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

  // Live Orders List with initial seed data and localStorage persistence
  const [orders, setOrders] = useState<PlacedOrder[]>(() => {
    try {
      const saved = localStorage.getItem('ssoil_orders');
      if (saved) return JSON.parse(saved);
    } catch (e) {}
    return [
      {
        id: 'ord_1',
        orderNumber: 'SSOIL-2026-1042',
        customerName: 'Ramesh Sundaram',
        customerEmail: 'ramesh.sundaram@gmail.com',
        customerPhone: '9842145620',
        shippingAddress: '42, Meyyanur Main Road, Salem, Tamil Nadu - 636004',
        city: 'Salem',
        pincode: '636004',
        paymentMethod: 'UPI',
        paymentStatus: 'PAID',
        orderStatus: 'SHIPPED',
        subtotal: 680,
        shippingFee: 0,
        totalAmount: 680,
        createdAt: '2026-10-21T14:30:00.000Z',
        items: [
          {
            productId: 'ss-sesame-1000',
            productName: 'Wood-Pressed Gingelly (Sesame) Oil',
            packSize: '1 Litre Bottle',
            quantity: 2,
            unitPrice: 395,
            subtotal: 790,
          },
        ],
      },
      {
        id: 'ord_2',
        orderNumber: 'SSOIL-2026-1088',
        customerName: 'Anitha Vijay',
        customerEmail: 'anitha.vijay@yahoo.co.in',
        customerPhone: '9789234110',
        shippingAddress: '15, 2nd Avenue, Anna Nagar, Chennai, Tamil Nadu - 600040',
        city: 'Chennai',
        pincode: '600040',
        paymentMethod: 'CARD',
        paymentStatus: 'PAID',
        orderStatus: 'PACKED',
        subtotal: 570,
        shippingFee: 0,
        totalAmount: 570,
        createdAt: '2026-10-21T18:15:00.000Z',
        items: [
          {
            productId: 'prod_coconut',
            productName: 'Pure Cold-Pressed Coconut Oil (Chekku)',
            packSize: '1 Litre Bottle',
            quantity: 1,
            unitPrice: 380,
            subtotal: 380,
          },
          {
            productId: 'prod_sesame',
            productName: 'Traditional Mara Chekku Sesame (Gingelly) Oil',
            packSize: '500ml Bottle',
            quantity: 1,
            unitPrice: 190,
            subtotal: 190,
          },
        ],
      },
      {
        id: 'ord_3',
        orderNumber: 'SSOIL-2026-1120',
        customerName: 'Karthik Muthusamy',
        customerEmail: 'karthik.m@outlook.com',
        customerPhone: '9443219087',
        shippingAddress: '78, Race Course Road, Coimbatore, Tamil Nadu - 641018',
        city: 'Coimbatore',
        pincode: '641018',
        paymentMethod: 'COD',
        paymentStatus: 'PENDING',
        orderStatus: 'PROCESSING',
        subtotal: 850,
        shippingFee: 0,
        totalAmount: 850,
        createdAt: '2026-10-22T08:45:00.000Z',
        items: [
          {
            productId: 'prod_ghee',
            productName: 'A2 Desi Cow Bilona Cultured Ghee',
            packSize: '500ml Glass Jar',
            quantity: 1,
            unitPrice: 850,
            subtotal: 850,
          },
        ],
      },
    ];
  });

  // Sync orders to localStorage on any change
  useEffect(() => {
    try {
      localStorage.setItem('ssoil_orders', JSON.stringify(orders));
    } catch (e) {}
  }, [orders]);

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

  // Cart helper functions
  const handleAddToCart = (product: Product, packSize: string, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product.id === product.id && item.packSize === packSize
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        updated[existingIndex].quantity += quantity;
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product,
            packSize,
            quantity,
            price: product.price,
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
        onBackToStore={() => navigateTo('/')}
        onLogout={handleGlobalSignOut}
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
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onOpenFaq={() => setIsFaqOpen(true)}
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
            product={currentProduct}
            allProducts={PRODUCTS_DATA}
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

        {/* Route: /login */}
        {currentPath === '/login' && (
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
        )}

        {/* Route: /profile (Dedicated Standalone Customer Profile Page) */}
        {currentPath === '/profile' && (
          <ProfilePage
            currentUser={currentUser}
            orders={orders}
            onNavigate={navigateTo}
            onCancelOrder={handleCancelOrder}
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

            {/* Homepage Featured Showcase Video (Configured dynamically from Admin Portal) */}
            <HomeFeaturedVideoBanner />

            {/* SS OIL Community Reels & Kitchen Stories Carousel */}
            <ReelsCarouselSection />

            {/* 4. Our Product Range & Categories: Pure Oils for a Healthier You */}
            <OurProductRange
              onShopProduct={(slug) => {
                setSelectedCategory(slug);
                navigateTo(`/category/${slug}`);
              }}
            />

            {/* 5. Products Showcase: Only 4 Curated Products on Homepage + View All */}
            <FeaturedProducts
              maxProducts={settings.homepageProductsLimit || 4}
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

      {/* 13. Footer (Rendered on Home Page, Product Detail Pages, and Category Detail Pages) */}
      {(currentPath === '/' || currentPath === '' || isProductRoute || isCategoryRoute) && (
        <Footer
          onSelectCategory={(cat) => {
            setSelectedCategory(cat);
            navigateTo(`/category/${cat}`);
          }}
          onNavigate={navigateTo}
        />
      )}

      {/* Floating Bottom Quick-Order Dock (Desktop & Mobile) */}
      <QuickDock
        items={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLabReport={handleOpenPurityReport}
        onNavigate={navigateTo}
      />

      {/* Interactive Cart Drawer with Cart, Favorites & Orders Tabs */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
        onProceedToCheckout={handleProceedToCheckout}
        orders={orders}
        onCancelOrder={handleCancelOrder}
        onAddToCart={handleAddToCart}
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

      {/* Official Laboratory Gas Chromatography Report Modal */}
      <LabReportModal
        report={selectedLabReportProduct?.labReport || null}
        productName={selectedLabReportProduct?.name || 'SS OIL Mara Chekku'}
        onClose={() => setSelectedLabReportProduct(null)}
      />

      {/* Customer Profile & Live Order Tracking Modal */}
      <ProfileModal
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
        orders={orders}
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
