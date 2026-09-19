import { useShopStore } from '../store/shopStore';

export function useCart() {
  const {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    isCartOpen,
    setIsCartOpen,
    formatPrice,
  } = useShopStore();

  const FREE_DELIVERY_THRESHOLD = 3000;
  const isFreeDeliveryEligible = cartSubtotal >= FREE_DELIVERY_THRESHOLD;
  const deliveryFee = isFreeDeliveryEligible || cartCount === 0 ? 0 : 150;
  const amountNeededForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - cartSubtotal);
  const totalAmount = cartSubtotal + deliveryFee;

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    cartCount,
    cartSubtotal,
    deliveryFee,
    totalAmount,
    isFreeDeliveryEligible,
    amountNeededForFreeDelivery,
    freeDeliveryThreshold: FREE_DELIVERY_THRESHOLD,
    isCartOpen,
    setIsCartOpen,
    formatPrice,
  };
}
