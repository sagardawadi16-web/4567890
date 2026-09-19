import React from 'react';
import { AnnouncementBar } from '../components/layout/AnnouncementBar';
import { Header } from '../components/layout/Header';
import { MobileNavOverlay } from '../components/layout/MobileNavOverlay';
import { FrontpageExperience } from '../components/home/FrontpageExperience';
import { ProductGrid } from '../components/products/ProductGrid';
import { FilterDrawer } from '../components/products/FilterDrawer';
import { ProductDetailModal } from '../components/products/ProductDetailModal';
import { HeritageTrust } from '../components/home/HeritageTrust';
import { Footer } from '../components/layout/Footer';
import { CartDrawer } from '../components/cart/CartDrawer';
import { RecentPurchaseNotification } from '../components/common/RecentPurchaseNotification';
import { useShopStore } from '../store/shopStore';

export const HomePage: React.FC = () => {
  const { frontpageDisplayMode } = useShopStore();

  return (
    <div className="min-h-screen flex flex-col bg-[#FFF8F0] text-[#2B1810]">
      {/* 1. Announcement Bar at the very top */}
      <AnnouncementBar />

      {/* 2. Responsive Navigation Header */}
      <Header />

      {/* 3. Mobile Navigation Overlay (active when mobile menu toggled) */}
      <MobileNavOverlay />

      {/* Main Content Area */}
      <main className="flex-1">
        {/* Unique Atelier Frontpage Showcase */}
        {frontpageDisplayMode === 'curated' && <FrontpageExperience />}

        {/* Further Listings & Complete Collections on the back, smoothly guiding user to browse and pay */}
        <ProductGrid />

        {/* Nepali Heritage Trust Pillars */}
        <HeritageTrust />
      </main>

      {/* 4. Slide-in Cart Drawer (Bottom on mobile, Right on desktop) */}
      <CartDrawer />

      {/* 5. Mobile Filter & Sort Bottom Slide-Over Drawer */}
      <FilterDrawer />

      {/* 6. Product Detail View Modal with touch gallery and WhatsApp ordering */}
      <ProductDetailModal />

      {/* 7. Site Footer */}
      <Footer />
    </div>
  );
};
