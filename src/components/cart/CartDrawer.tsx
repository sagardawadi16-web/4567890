import React, { useState } from 'react';
import {
  X,
  Plus,
  Minus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Truck,
  Sparkles,
  MessageCircle,
  CheckCircle2,
  Globe,
} from 'lucide-react';
import { useShopStore } from '../../store/shopStore';
import { useCart } from '../../hooks/useCart';

export const CartDrawer: React.FC = () => {
  const { language, getWhatsAppCartOrderUrl, clearCart } = useShopStore();
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartCount,
    cartSubtotal,
    deliveryFee,
    totalAmount,
    isFreeDeliveryEligible,
    amountNeededForFreeDelivery,
    freeDeliveryThreshold,
    isCartOpen,
    setIsCartOpen,
    formatPrice,
  } = useCart();
  const { setPageView } = useShopStore();

  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  // Mobile swipe down to dismiss gesture state
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState<number>(0);

  if (!isCartOpen) return null;

  const progressPercent = Math.min(
    100,
    Math.round((cartSubtotal / freeDeliveryThreshold) * 100)
  );

  const handleStandardCheckout = () => {
    setIsCartOpen(false);
    setPageView('checkout');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  // Touch gesture handlers for mobile swipe-down dismiss
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (translateY > 75) {
      setIsCartOpen(false);
      setCheckoutSuccess(false);
    }
    setTranslateY(0);
    setTouchStartY(null);
  };

  return (
    <div
      id="cart-drawer-overlay"
      className="fixed inset-0 z-50 overflow-hidden flex flex-col justify-end md:flex-row md:justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => {
          setIsCartOpen(false);
          setCheckoutSuccess(false);
        }}
      />

      {/* Cart Drawer:
          - Mobile (<768px): Slides smoothly from bottom with rounded top corners + swipe to dismiss
          - Desktop (>=768px): Slides smoothly from the right
      */}
      <div
        id="cart-drawer-content"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: translateY > 0 ? `translateY(${translateY}px)` : undefined,
          transition: translateY > 0 ? 'none' : 'transform 0.25s ease-out',
        }}
        className="relative w-full md:max-w-md bg-[#FFF8F0] max-h-[90vh] md:max-h-none md:h-full shadow-2xl flex flex-col justify-between z-10 rounded-t-3xl md:rounded-none border-t md:border-t-0 md:border-l border-[#EADCCE] animate-in slide-in-from-bottom md:slide-in-from-right duration-300 overflow-hidden"
      >
        {/* Mobile touch pull handle */}
        <div className="pt-2.5 pb-1 flex flex-col items-center justify-center bg-[#FAF2E9] md:hidden cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1 bg-[#EADCCE] rounded-full mb-1" />
          <span className="text-[10px] text-[#6B564C]/70">
            {language === 'np' ? 'तल तानेर बन्द गर्नुहोस्' : 'Swipe down to close'}
          </span>
        </div>

        {/* Drawer Header */}
        <div className="px-5 py-3.5 sm:py-4 border-b border-[#EADCCE] bg-[#FAF2E9] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShoppingBag className="w-5 h-5 text-[#8B3A3A]" />
            <h2 className="font-serif-luxury text-lg font-bold text-[#2B1810]">
              {language === 'np' ? 'तपाईंको सपिङ झोला' : 'Shopping Bag'}
            </h2>
            <span className="text-xs font-bold bg-[#8B3A3A] text-white px-2.5 py-0.5 rounded-full">
              {cartCount}
            </span>
          </div>

          <button
            id="close-cart-btn"
            onClick={() => {
              setIsCartOpen(false);
              setCheckoutSuccess(false);
            }}
            aria-label="Close cart"
            className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full text-[#6B564C] hover:text-[#8B3A3A] hover:bg-white/80 active:scale-[0.97] transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Free Delivery Meter */}
        <div className="bg-[#8B3A3A]/5 px-5 py-3 border-b border-[#EADCCE] shrink-0">
          <div className="flex items-center justify-between text-xs mb-1.5 font-medium">
            <span className="flex items-center gap-1.5 text-[#8B3A3A] font-bold">
              <Truck className="w-3.5 h-3.5 text-[#D4AF37]" />
              {isFreeDeliveryEligible
                ? language === 'np'
                  ? '🎉 तपाईंले नेपालभर निःशुल्क डेलिभरी पाउनुभयो!'
                  : '🎉 You unlocked FREE Delivery across Nepal!'
                : language === 'np'
                ? `निःशुल्क डेलिभरीका लागि थप ${formatPrice(amountNeededForFreeDelivery)}`
                : `Add ${formatPrice(amountNeededForFreeDelivery)} more for FREE Delivery`}
            </span>
            <span className="text-[#6B564C] font-mono text-[11px] font-bold">
              {progressPercent}%
            </span>
          </div>

          <div className="w-full bg-[#EADCCE] h-1.5 rounded-full overflow-hidden">
            <div
              className="bg-gradient-to-r from-[#D4AF37] to-[#8B3A3A] h-full transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Success confirmation state */}
        {checkoutSuccess ? (
          <div className="flex-1 p-6 flex flex-col items-center justify-center text-center overflow-y-auto">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mb-4 border border-emerald-300">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="font-serif-luxury text-xl font-bold text-[#2B1810] mb-2">
              {language === 'np' ? 'अर्डर सफलतापूर्वक दर्ता भयो!' : 'Order Placed Successfully!'}
            </h3>
            <p className="text-xs text-[#6B564C] mb-4 max-w-xs leading-relaxed">
              {language === 'np'
                ? `कुल ${formatPrice(totalAmount)} को अर्डर प्राप्त भएको छ। हाम्रा काठमाडौँ प्रतिनिधिले छिट्टै कल वा ह्वाट्सएपमा सम्पर्क गर्नेछन्।`
                : `Your order of ${formatPrice(totalAmount)} has been registered. Our Kathmandu dispatch team will contact you shortly for dispatch verification.`}
            </p>
            <div className="bg-white p-4 rounded-xl border border-[#EADCCE] text-xs text-[#2B1810] w-full max-w-xs mb-6 text-left space-y-1">
              <p><strong>Payment:</strong> Cash on Delivery (COD)</p>
              <p><strong>Dispatch:</strong> Kathmandu (24h) / Nepal (2-4 days)</p>
            </div>
            <button
              onClick={() => {
                clearCart();
                setCheckoutSuccess(false);
                setIsCartOpen(false);
              }}
              className="min-h-[48px] px-6 py-3 bg-[#8B3A3A] text-white rounded-xl text-xs font-bold hover:bg-[#722E2E] active:scale-[0.97] transition-all"
            >
              {language === 'np' ? 'किनमेल जारी राख्नुहोस्' : 'Continue Shopping'}
            </button>
          </div>
        ) : (
          /* Scrollable Cart Items with instant Optimistic UI */
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-3.5">
            {cart.length === 0 ? (
              <div className="text-center py-12 px-4 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-[#FAF2E9] flex items-center justify-center text-[#8B3A3A] mb-4 border border-[#EADCCE]">
                  <ShoppingBag className="w-8 h-8 stroke-1" />
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-[#2B1810] mb-1">
                  {language === 'np' ? 'तपाईंको झोला खाली छ' : 'Your Bag is Empty'}
                </h3>
                <p className="text-xs text-[#6B564C] max-w-xs mb-6 leading-relaxed">
                  {language === 'np'
                    ? 'हाम्रा मौलिक सिल्क, च्याङ्ग्रा पश्मिना तथा बनारसी साडीहरू संग्रहबाट छान्नुहोस्।'
                    : 'Discover authentic Nepali handlooms, silk sarees and Himalayan cashmere wraps.'}
                </p>
                <button
                  id="cart-empty-explore-btn"
                  onClick={() => setIsCartOpen(false)}
                  className="min-h-[48px] px-6 py-3 bg-[#8B3A3A] hover:bg-[#722E2E] text-white text-xs font-bold rounded-xl shadow-xs transition-all active:scale-[0.97]"
                >
                  {language === 'np' ? 'संग्रह हेर्नुहोस्' : 'Explore Collections'}
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={`${item.product.id}-${item.selectedSize}`}
                  className="flex gap-3 p-3 bg-white rounded-2xl border border-[#EADCCE] shadow-2xs hover:border-[#D4AF37]/50 transition-all"
                >
                  {/* Thumbnail */}
                  <img
                    src={item.product.images[0]}
                    alt={item.product.title[language]}
                    className="w-20 h-24 object-cover object-top rounded-xl border border-[#EADCCE] shrink-0"
                    referrerPolicy="no-referrer"
                  />

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs sm:text-sm font-bold text-[#2B1810] line-clamp-1">
                          {item.product.title[language]}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                          aria-label={`Remove ${item.product.title[language]}`}
                          className="min-h-[44px] min-w-[44px] flex items-center justify-center text-[#6B564C] hover:text-[#8B3A3A] transition-colors p-1 active:scale-[0.97]"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[11px] font-bold text-[#8B3A3A] bg-[#FAF2E9] px-2 py-0.5 rounded-md border border-[#EADCCE]">
                          {language === 'np' ? 'साइज' : 'Size'}: {item.selectedSize}
                        </span>
                        <span className="text-[10px] text-[#6B564C] truncate">
                          {item.product.categoryName[language]}
                        </span>
                      </div>
                    </div>

                    {/* Quantity Controls (with min 48px tap targets & optimistic instant response) & Price */}
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#FAF2E9]">
                      <div className="flex items-center border border-[#EADCCE] rounded-xl bg-[#FAF2E9] shadow-2xs">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, -1)}
                          aria-label="Decrease quantity"
                          className="min-h-[48px] min-w-[48px] flex items-center justify-center text-[#2B1810] hover:text-[#8B3A3A] active:scale-[0.97] transition-transform text-base font-bold"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2 text-xs font-bold font-mono text-[#2B1810] min-w-[28px] text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.selectedSize, 1)}
                          aria-label="Increase quantity"
                          className="min-h-[48px] min-w-[48px] flex items-center justify-center text-[#2B1810] hover:text-[#8B3A3A] active:scale-[0.97] transition-transform text-base font-bold"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-right">
                        <span className="text-xs sm:text-sm font-bold text-[#8B3A3A] font-serif-luxury">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Footer with Calculations & Ordering CTAs */}
        {!checkoutSuccess && cart.length > 0 && (
          <div className="p-4 sm:p-5 border-t border-[#EADCCE] bg-[#FAF2E9] space-y-3 shrink-0">
            {/* Subtotal & Delivery Breakdowns */}
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-[#6B564C]">
                <span>{language === 'np' ? 'सामानको रकम (Subtotal)' : 'Subtotal'}</span>
                <span className="font-bold text-[#2B1810] font-mono">
                  {formatPrice(cartSubtotal)}
                </span>
              </div>
              <div className="flex justify-between text-[#6B564C]">
                <span>{language === 'np' ? 'नेपालभर डेलिभरी' : 'Delivery across Nepal'}</span>
                <span>
                  {deliveryFee === 0 ? (
                    <span className="text-emerald-700 font-bold">
                      {language === 'np' ? 'निःशुल्क (FREE)' : 'FREE'}
                    </span>
                  ) : (
                    <span className="font-mono">{formatPrice(deliveryFee)}</span>
                  )}
                </span>
              </div>
              <div className="flex justify-between text-sm font-bold text-[#2B1810] pt-2 border-t border-[#EADCCE]">
                <span>{language === 'np' ? 'कुल भुक्तानी रकम' : 'Total Amount'}</span>
                <span className="text-[#8B3A3A] text-base font-serif-luxury">
                  {formatPrice(totalAmount)}
                </span>
              </div>
            </div>

            {/* ACTION 1: Standard Website Checkout (Buy in Website) */}
            <button
              id="standard-checkout-btn"
              onClick={handleStandardCheckout}
              className="w-full min-h-[48px] py-3 px-4 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all active:scale-[0.97]"
            >
              <Globe className="w-4 h-4 shrink-0" />
              <span>
                {language === 'np'
                  ? 'वेबसाइटबाट अर्डर (Buy in Website • COD / eSewa)'
                  : 'Buy in Website (COD / eSewa / Cards)'}
              </span>
              <ArrowRight className="w-4 h-4 shrink-0" />
            </button>

            {/* ACTION 2: DIRECT WHATSAPP ORDERING BUTTON */}
            <a
              id="cart-whatsapp-checkout-btn"
              href={getWhatsAppCartOrderUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[48px] py-3 px-4 bg-[#25D366] hover:bg-[#1EBE5B] text-white rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all active:scale-[0.97]"
            >
              <MessageCircle className="w-5 h-5 fill-white text-white shrink-0" />
              <span className="truncate">
                {language === 'np'
                  ? 'व्हाट्सएपबाट सिधै अर्डर गर्नुहोस् (Order via WhatsApp)'
                  : 'Order Bag via WhatsApp'}
              </span>
            </a>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-2 pt-0.5 text-[11px] text-[#6B564C]">
              <Sparkles className="w-3 h-3 text-[#D4AF37]" />
              <span>
                {language === 'np'
                  ? 'काठमाडौँमा २४ घण्टा, अन्यत्र २-४ दिनमा डेलिभरी'
                  : 'Fast Delivery across all 77 districts of Nepal'}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
