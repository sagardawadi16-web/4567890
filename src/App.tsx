/**
 * Dawosti - Women's Fashion Nepal
 * Production E-Commerce Platform
 */

import React from 'react';
import { ShopProvider, useShopStore } from './store/shopStore';
import { HomePage } from './pages/HomePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPanelModal } from './components/admin/AdminPanelModal';
import { RecentPurchaseNotification } from './components/common/RecentPurchaseNotification';

function AppContent() {
  const { pageView } = useShopStore();

  return (
    <>
      {pageView === 'checkout' || pageView === 'order-confirmation' ? (
        <CheckoutPage />
      ) : (
        <HomePage />
      )}
      
      {/* Global Admin Modal for Listings, Photos, Static QR & Passcode */}
      <AdminPanelModal />

      {/* Realistic Subtle Looping Purchase Indicator with Self-Order Feedback */}
      <RecentPurchaseNotification />
    </>
  );
}

export default function App() {
  return (
    <ShopProvider>
      <AppContent />
    </ShopProvider>
  );
}
