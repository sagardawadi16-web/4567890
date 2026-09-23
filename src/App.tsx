/**
 * Dawosti - Women's Fashion Nepal
 * Production E-Commerce Platform
 */

import React from 'react';
import { ShopProvider, useShopStore } from './store/shopStore';
import { HomePage } from './pages/HomePage';
import { CheckoutPage } from './pages/CheckoutPage';
import { AdminPanelModal } from './components/admin/AdminPanelModal';
import { FloatingWhatsAppButton } from './components/common/FloatingWhatsAppButton';

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

      {/* Floating Official WhatsApp hotline button (9708251494) */}
      <FloatingWhatsAppButton />
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
