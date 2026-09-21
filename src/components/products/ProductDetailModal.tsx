import React, { useState, useEffect } from 'react';
import {
  X,
  Star,
  ShoppingBag,
  MessageCircle,
  Truck,
  RotateCcw,
  Check,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Info,
  Globe,
} from 'lucide-react';
import { useShopStore } from '../../store/shopStore';
import { ProductSize } from '../../types';

export const ProductDetailModal: React.FC = () => {
  const {
    language,
    activeDetailProduct,
    setActiveDetailProduct,
    addToCart,
    formatPrice,
    getWhatsAppProductOrderUrl,
  } = useShopStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState<ProductSize | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Reset state when active product changes
  useEffect(() => {
    if (activeDetailProduct) {
      setSelectedImageIndex(0);
      setQuantity(1);
      setAddedAnimation(false);
      // Select first in-stock size by default
      const firstAvailable = activeDetailProduct.availableSizes.find((size) => {
        const stock = activeDetailProduct.sizeStock?.[size];
        return stock === undefined || stock > 0;
      });
      setSelectedSize(firstAvailable || activeDetailProduct.availableSizes[0]);
    }
  }, [activeDetailProduct]);

  if (!activeDetailProduct) return null;

  const product = activeDetailProduct;
  const currentImages = product.images.length > 0 ? product.images : [
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
  ];

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % currentImages.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + currentImages.length) % currentImages.length);
  };

  const handleAddToCart = () => {
    if (!selectedSize) return;
    addToCart(product, selectedSize, quantity);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
    }, 1800);
  };

  const getStockStatusForSize = (size: ProductSize) => {
    const count = product.sizeStock?.[size];
    if (count === undefined) {
      return { status: 'in-stock', text: language === 'np' ? 'स्टक छ' : 'In Stock' };
    }
    if (count === 0) {
      return { status: 'out-of-stock', text: language === 'np' ? 'सकियो' : 'Out of Stock' };
    }
    if (count <= 2) {
      return {
        status: 'low-stock',
        text: language === 'np' ? `२ वटा मात्र बाँकी` : `Only ${count} left`,
      };
    }
    return {
      status: 'in-stock',
      text: language === 'np' ? `उपलब्ध (${count})` : `In Stock (${count})`,
    };
  };

  const currentSizeStock = selectedSize ? getStockStatusForSize(selectedSize) : null;
  const isSelectedSizeOutOfStock = currentSizeStock?.status === 'out-of-stock';

  return (
    <div
      id="product-detail-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-0 sm:p-4 md:p-6 overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-label={product.title[language]}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
        onClick={() => setActiveDetailProduct(null)}
      />

      {/* Modal Card */}
      <div className="relative w-full max-w-4xl bg-[#FFF8F0] sm:rounded-3xl shadow-2xl border border-[#EADCCE] z-10 flex flex-col md:flex-row max-h-[100dvh] sm:max-h-[90vh] overflow-hidden">
        
        {/* Close Button */}
        <button
          id="close-product-detail-modal-btn"
          onClick={() => setActiveDetailProduct(null)}
          aria-label="Close Product Detail"
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-white/90 hover:bg-white text-[#2B1810] shadow-md border border-[#EADCCE] transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <X className="w-5 h-5" />
        </button>

        {/* LEFT: Large Main Image + Touch-Swipe Thumbnail Gallery */}
        <div className="w-full md:w-1/2 bg-[#F4E9DC] p-4 sm:p-6 flex flex-col justify-between shrink-0">
          
          {/* Main Large Image Container */}
          <div className="relative aspect-4/5 w-full rounded-2xl overflow-hidden bg-white shadow-inner flex items-center justify-center group">
            <img
              src={currentImages[selectedImageIndex]}
              alt={product.title[language]}
              className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
            />

            {/* Badges */}
            <div className="absolute top-3 left-3 flex flex-col gap-1.5">
              {product.isNewArrival && (
                <span className="bg-[#8B3A3A] text-white text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs tracking-wide">
                  {language === 'np' ? 'नयाँ आगमन' : 'NEW'}
                </span>
              )}
              {product.isFeatured && (
                <span className="bg-[#D4AF37] text-[#2B1810] text-[11px] font-bold px-2.5 py-1 rounded-full shadow-xs tracking-wide">
                  {language === 'np' ? 'विशेष शिल्पकला' : 'FEATURED'}
                </span>
              )}
            </div>

            {/* Navigation Arrows for Gallery */}
            {currentImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  aria-label="Previous Image"
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#2B1810] shadow-md min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  aria-label="Next Image"
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-[#2B1810] shadow-md min-h-[44px] min-w-[44px] flex items-center justify-center"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Image Counter Indicator */}
            <div className="absolute bottom-3 right-3 px-2 py-0.5 rounded-full bg-black/60 text-white text-[11px] font-mono">
              {selectedImageIndex + 1} / {currentImages.length}
            </div>
          </div>

          {/* Touch-Friendly Thumbnail Strip */}
          {currentImages.length > 1 && (
            <div className="flex gap-2.5 mt-4 overflow-x-auto pb-1 pt-1 scrollbar-none">
              {currentImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`relative w-16 h-20 rounded-xl overflow-hidden shrink-0 border-2 transition-all min-h-[48px] ${
                    selectedImageIndex === idx
                      ? 'border-[#8B3A3A] ring-2 ring-[#8B3A3A]/20 scale-105 shadow-xs'
                      : 'border-[#EADCCE] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Heritage Trust Badge */}
          <div className="mt-4 pt-3 border-t border-[#EADCCE] hidden md:flex items-center justify-between text-xs text-[#6B564C]">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-4 h-4 text-[#8B3A3A]" />
              {language === 'np' ? '१००% मौलिक नेपाली हस्तकला' : '100% Authentic Handloom'}
            </span>
            <span>{product.origin?.[language] || 'Kathmandu, Nepal'}</span>
          </div>
        </div>

        {/* RIGHT: Product Details, Visual Size Selector, CTA Actions */}
        <div className="w-full md:w-1/2 p-5 sm:p-8 overflow-y-auto flex flex-col justify-between space-y-5">
          
          {/* Header Info */}
          <div>
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-xs uppercase tracking-widest text-[#8B3A3A] font-bold">
                {product.categoryName[language]}
              </span>
              <span className="text-[#6B564C]">•</span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#FAF2E9] border border-[#EADCCE] text-[10px] font-bold text-[#8B3A3A]">
                <Globe className="w-3 h-3 text-[#8B3A3A]" />
                <span>{language === 'np' ? 'वेबसाइटमा किन्नुहोस्' : 'Buy in Website'}</span>
              </span>
              <span className="text-[#6B564C]">•</span>
              <div className="flex items-center gap-1 text-xs text-[#D4AF37] font-bold">
                <Star className="w-3.5 h-3.5 fill-[#D4AF37]" />
                <span>{product.rating}</span>
                <span className="text-[#6B564C] font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>

            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold text-[#2B1810] leading-snug">
              {product.title[language]}
            </h2>

            {/* Price section */}
            <div className="flex items-baseline gap-3 mt-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#8B3A3A] font-serif-luxury">
                {formatPrice(product.price)}
              </span>
              {product.originalPrice && (
                <span className="text-sm sm:text-base text-[#6B564C] line-through font-mono">
                  {formatPrice(product.originalPrice)}
                </span>
              )}
              {product.originalPrice && (
                <span className="text-xs font-bold text-[#D4AF37] bg-[#D4AF37]/15 px-2 py-0.5 rounded-md">
                  {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-[#4A3B32] mt-3 leading-relaxed">
              {product.description[language]}
            </p>
          </div>

          {/* VISUAL SIZE SELECTORS with Stock Availability */}
          <div className="border-t border-b border-[#EADCCE] py-4 my-2">
            <div className="flex justify-between items-center mb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-[#2B1810]">
                {language === 'np' ? 'साइज छान्नुहोस्:' : 'Select Size:'}{' '}
                <span className="text-[#8B3A3A] font-extrabold">{selectedSize}</span>
              </span>
              
              {/* Stock availability indicator for selected size */}
              {currentSizeStock && (
                <span
                  className={`text-xs font-semibold px-2 py-0.5 rounded-md ${
                    currentSizeStock.status === 'out-of-stock'
                      ? 'bg-red-100 text-red-700'
                      : currentSizeStock.status === 'low-stock'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-emerald-100 text-emerald-800'
                  }`}
                >
                  {currentSizeStock.text}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2.5">
              {product.availableSizes.map((size) => {
                const stockInfo = getStockStatusForSize(size);
                const isOutOfStock = stockInfo.status === 'out-of-stock';
                const isSelected = selectedSize === size;

                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    disabled={isOutOfStock}
                    aria-label={`Select size ${size}`}
                    className={`relative min-h-[48px] min-w-[54px] px-3.5 py-2.5 rounded-xl font-bold text-xs flex flex-col items-center justify-center transition-all ${
                      isSelected
                        ? 'bg-[#8B3A3A] text-white shadow-md ring-2 ring-[#8B3A3A]/30 scale-105'
                        : isOutOfStock
                        ? 'bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed line-through'
                        : 'bg-white text-[#2B1810] border border-[#EADCCE] hover:border-[#8B3A3A] hover:bg-[#FAF2E9]'
                    }`}
                  >
                    <span>{size}</span>
                    {stockInfo.status === 'low-stock' && !isSelected && (
                      <span className="text-[9px] text-amber-700 leading-none mt-0.5">
                        {language === 'np' ? 'थोरै छ' : 'Few left'}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Quantity Controller (min 48px touch targets) */}
            <div className="flex items-center gap-4 mt-4 pt-3 border-t border-[#EADCCE]/60">
              <span className="text-xs font-bold text-[#6B564C] uppercase tracking-wider">
                {language === 'np' ? 'संख्या (Quantity):' : 'Quantity:'}
              </span>
              <div className="flex items-center border border-[#EADCCE] rounded-xl bg-white overflow-hidden shadow-xs">
                <button
                  type="button"
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  disabled={quantity <= 1}
                  aria-label="Decrease quantity"
                  className="min-h-[48px] min-w-[48px] flex items-center justify-center text-[#2B1810] hover:bg-[#FAF2E9] disabled:opacity-30 disabled:cursor-not-allowed transition-colors text-base font-bold"
                >
                  -
                </button>
                <span className="min-w-[40px] text-center font-bold text-sm font-mono text-[#2B1810]">
                  {quantity}
                </span>
                <button
                  type="button"
                  onClick={() => setQuantity((q) => q + 1)}
                  aria-label="Increase quantity"
                  className="min-h-[48px] min-w-[48px] flex items-center justify-center text-[#2B1810] hover:bg-[#FAF2E9] transition-colors text-base font-bold"
                >
                  +
                </button>
              </div>
            </div>
          </div>

          {/* BUY IN WEBSITE & WHATSAPP ACTIONS */}
          <div className="space-y-3 pt-2">
            {/* Buy in Website Heading */}
            <div className="flex items-center justify-between pb-1.5 border-b border-[#EADCCE]/70">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-[#8B3A3A]" />
                <h4 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[#2B1810]">
                  {language === 'np' ? 'वेबसाइटमा किन्नुहोस् (Buy in Website)' : 'Buy in Website / Order Options'}
                </h4>
              </div>
              <span className="text-[10px] sm:text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Truck className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'np' ? 'नेपालका ७७ वटै जिल्लामा डेलिभरी' : 'All 77 Districts Delivery'}</span>
              </span>
            </div>
            
            {/* Primary "Add to Bag" Button */}
            <button
              id="detail-add-to-cart-btn"
              onClick={handleAddToCart}
              disabled={!selectedSize || isSelectedSizeOutOfStock}
              className={`w-full min-h-[50px] py-3.5 px-6 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2.5 transition-all active:scale-[0.97] ${
                addedAnimation
                  ? 'bg-emerald-700 text-white'
                  : isSelectedSizeOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#8B3A3A] hover:bg-[#722E2E] text-white'
              }`}
            >
              {addedAnimation ? (
                <>
                  <Check className="w-5 h-5 shrink-0" />
                  <span>{language === 'np' ? 'झोलामा थपियो!' : 'Added to Bag!'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-5 h-5 shrink-0" />
                  <span>
                    {language === 'np'
                      ? `झोलामा थप्नुहोस् (Add to Bag) • ${formatPrice(product.price * quantity)}`
                      : `Add to Bag • ${formatPrice(product.price * quantity)}`}
                  </span>
                </>
              )}
            </button>

            {/* Direct "Order via WhatsApp" Button with WhatsApp Logo */}
            <a
              id="detail-whatsapp-order-btn"
              href={
                selectedSize
                  ? getWhatsAppProductOrderUrl(product, selectedSize, quantity)
                  : '#'
              }
              target="_blank"
              rel="noopener noreferrer"
              className="w-full min-h-[50px] py-3.5 px-6 rounded-xl font-bold text-sm bg-[#25D366] hover:bg-[#1EBE5B] text-white shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all active:scale-[0.97]"
            >
              <MessageCircle className="w-5 h-5 fill-white text-white shrink-0" />
              <span>
                {language === 'np'
                  ? 'व्हाट्सएपबाट सिधै अर्डर गर्नुहोस् (Order via WhatsApp)'
                  : 'Order via WhatsApp'}
              </span>
            </a>
          </div>

          {/* Nepal Delivery & Craft Features */}
          <div className="pt-3 border-t border-[#EADCCE] grid grid-cols-2 gap-3 text-[11px] text-[#6B564C]">
            <div className="flex items-center gap-2 bg-white/60 p-2.5 rounded-xl border border-[#EADCCE]">
              <Truck className="w-4 h-4 text-[#8B3A3A] shrink-0" />
              <span>
                {language === 'np'
                  ? 'नेपालभर क्यास अन डेलिभरी (COD)'
                  : 'All Nepal COD Delivery'}
              </span>
            </div>
            <div className="flex items-center gap-2 bg-white/60 p-2.5 rounded-xl border border-[#EADCCE]">
              <ShieldCheck className="w-4 h-4 text-[#D4AF37] shrink-0" />
              <span>
                {language === 'np'
                  ? 'निःशुल्क साइज परामर्श तथा सहयोग'
                  : 'Bespoke Size Consultation'}
              </span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
