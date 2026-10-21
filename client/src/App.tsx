import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ShopByCategory } from './components/ShopByCategory';
import { FeaturedProducts } from './components/FeaturedProducts';
import { WhyChooseUs } from './components/WhyChooseUs';
import { OilSommelier } from './components/OilSommelier';
import { PromotionalBanner } from './components/PromotionalBanner';
import { PurityComparison } from './components/PurityComparison';
import { Testimonials } from './components/Testimonials';
import { FarmOriginsMap } from './components/FarmOriginsMap';
import { AboutSection } from './components/AboutSection';
import { Newsletter } from './components/Newsletter';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { ProductQuickViewModal } from './components/ProductQuickViewModal';
import { SearchModal } from './components/SearchModal';
import { LabReportModal } from './components/LabReportModal';
import { QuickDock } from './components/QuickDock';
import { Toast } from './components/Toast';
import { Product, CartItem } from './types';
import { PRODUCTS_DATA } from './data/oilData';

export function App() {
  // Shopping Cart state
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      product: PRODUCTS_DATA[0],
      packSize: '1 Litre Bottle',
      quantity: 1,
      price: PRODUCTS_DATA[0].price,
    },
  ]);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  const [selectedLabReportProduct, setSelectedLabReportProduct] = useState<Product | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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

  const totalCartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-stone-800 selection:bg-gold-500 selection:text-white pb-16 md:pb-0">
      {/* 1. Header & Announcement Bar */}
      <Navbar
        cartCount={totalCartCount}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onNavigateCategory={handleCategorySelect}
        onOpenPurityReport={handleOpenPurityReport}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {/* 2. Hero Section */}
        <Hero
          onShopNow={handleShopNow}
          onExploreProducts={handleExploreProducts}
          onQuickViewSample={() => setQuickViewProduct(PRODUCTS_DATA[0])}
        />

        {/* 3. Shop by Category */}
        <ShopByCategory
          onSelectCategory={handleCategorySelect}
          selectedCategory={selectedCategory}
        />

        {/* 4. Featured Products Grid */}
        <FeaturedProducts
          onAddToCart={handleAddToCart}
          onQuickView={(product) => setQuickViewProduct(product)}
          onViewLabReport={(product) => setSelectedLabReportProduct(product)}
          selectedCategory={selectedCategory}
          onSelectCategory={(cat) => setSelectedCategory(cat)}
        />

        {/* 5. Why Choose SS OIL? */}
        <WhyChooseUs />

        {/* 6. Chef's Oil Sommelier (Dish-to-oil matchmaker) */}
        <div id="sommelier">
          <OilSommelier
            onAddToCart={handleAddToCart}
            onQuickView={(p) => setQuickViewProduct(p)}
          />
        </div>

        {/* 7. Promotional Banner ("Bring Quality to Your Kitchen") */}
        <PromotionalBanner onShopCollection={handleShopNow} />

        {/* 8. The Purity Truth: Side-by-Side Comparison */}
        <PurityComparison />

        {/* 9. Single-Origin Farm Origins Map */}
        <FarmOriginsMap />

        {/* 10. Customer Testimonials */}
        <Testimonials />

        {/* 11. About Us Heritage Section */}
        <AboutSection />

        {/* 12. Newsletter Section */}
        <Newsletter />
      </main>

      {/* 13. Footer */}
      <Footer onSelectCategory={handleCategorySelect} />

      {/* Floating Bottom Quick-Order Dock (Desktop & Mobile) */}
      <QuickDock
        items={cartItems}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenLabReport={handleOpenPurityReport}
      />

      {/* Interactive Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        items={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onClearCart={handleClearCart}
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

      {/* Instant Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectProduct={(product) => setQuickViewProduct(product)}
        onAddToCart={handleAddToCart}
      />

      {/* Official Laboratory Gas Chromatography Report Modal */}
      <LabReportModal
        report={selectedLabReportProduct?.labReport || null}
        productName={selectedLabReportProduct?.name || 'SS OIL Mara Chekku'}
        onClose={() => setSelectedLabReportProduct(null)}
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
