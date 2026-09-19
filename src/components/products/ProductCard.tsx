import React, { useState } from 'react';
import { ShoppingBag, Eye, Star, Check, Sparkles, MessageCircle } from 'lucide-react';
import { Product, ProductSize } from '../../types';
import { useShopStore } from '../../store/shopStore';

interface ProductCardProps {
  product: Product;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const {
    language,
    addToCart,
    formatPrice,
    setActiveDetailProduct,
    getWhatsAppProductOrderUrl,
  } = useShopStore();

  // Pick first available size
  const [selectedSize, setSelectedSize] = useState<ProductSize>(() => {
    const firstInStock = product.availableSizes.find((s) => {
      const stock = product.sizeStock?.[s];
      return stock === undefined || stock > 0;
    });
    return firstInStock || product.availableSizes[0];
  });
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!selectedSize) return;
    addToCart(product, selectedSize, 1);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 1800);
  };

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const currentStock = product.sizeStock?.[selectedSize];
  const isOutOfStock = currentStock === 0;

  return (
    <div
      id={`product-card-${product.id}`}
      className="group relative bg-white rounded-2xl border border-[#EADCCE] overflow-hidden flex flex-col justify-between hover:shadow-xl hover:border-[#D4AF37]/60 transition-all duration-300"
    >
      {/* Image & Overlay Triggers */}
      <div
        className="relative aspect-[3/4] overflow-hidden bg-[#FAF2E9] cursor-pointer"
        onClick={() => setActiveDetailProduct(product)}
      >
        <img
          src={product.images[0]}
          alt={product.title[language]}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 sm:top-2.5 sm:left-2.5 flex flex-col gap-1 z-10 pointer-events-none">
          {product.isNewArrival && (
            <span className="bg-[#8B3A3A] text-white text-[9px] sm:text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full shadow-xs">
              {language === 'np' ? 'नयाँ' : 'NEW'}
            </span>
          )}
          {discountPercent > 0 && (
            <span className="bg-[#D4AF37] text-[#2B1810] text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
              {discountPercent}% OFF
            </span>
          )}
        </div>

        {/* Quick View / Inspect Button (min 48px tap target) */}
        <button
          id={`quick-view-btn-${product.id}`}
          onClick={(e) => {
            e.stopPropagation();
            setActiveDetailProduct(product);
          }}
          aria-label={`View details of ${product.title[language]}`}
          className="absolute bottom-2 right-2 sm:bottom-3 sm:right-3 min-h-[48px] min-w-[48px] p-3 bg-white/95 hover:bg-white text-[#8B3A3A] rounded-full shadow-md backdrop-blur-xs flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
        >
          <Eye className="w-5 h-5" />
        </button>

        {/* Origin tag */}
        {product.origin && (
          <div className="absolute bottom-2 left-2 hidden sm:block pointer-events-none">
            <span className="text-[10px] bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded-md flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
              {product.origin[language]}
            </span>
          </div>
        )}
      </div>

      {/* Product Information */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Category & Rating */}
          <div className="flex items-center justify-between text-xs text-[#6B564C] mb-1">
            <span className="font-semibold text-[#8B3A3A] tracking-wider uppercase text-[10px] sm:text-[11px] truncate max-w-[65%]">
              {product.categoryName[language]}
            </span>
            <div className="flex items-center gap-1 shrink-0">
              <Star className="w-3 h-3 sm:w-3.5 sm:h-3.5 fill-[#D4AF37] text-[#D4AF37]" />
              <span className="font-bold text-[#2B1810] text-[11px]">{product.rating}</span>
            </div>
          </div>

          {/* Title */}
          <h3
            onClick={() => setActiveDetailProduct(product)}
            className="font-serif-luxury text-sm sm:text-base font-bold text-[#2B1810] hover:text-[#8B3A3A] cursor-pointer line-clamp-1 transition-colors"
            title={product.title[language]}
          >
            {product.title[language]}
          </h3>

          {/* Price */}
          <div className="flex items-baseline gap-1.5 sm:gap-2 mt-1.5 sm:mt-2">
            <span className="text-sm sm:text-base font-bold text-[#8B3A3A] font-serif-luxury">
              {formatPrice(product.price)}
            </span>
            {product.originalPrice && (
              <span className="text-[11px] sm:text-xs text-[#6B564C] line-through font-mono">
                {formatPrice(product.originalPrice)}
              </span>
            )}
          </div>
        </div>

        {/* Size Selection & Actions */}
        <div className="mt-3 pt-2.5 border-t border-[#FAF2E9] space-y-2.5">
          {/* Visual Size Selector (Touch friendly) */}
          <div>
            <div className="flex items-center justify-between text-[11px] text-[#6B564C] mb-1">
              <span>{language === 'np' ? 'साइज:' : 'Size:'}</span>
              <span className="font-bold text-[#8B3A3A]">{selectedSize}</span>
            </div>
            <div className="flex flex-wrap gap-1">
              {product.availableSizes.map((size) => {
                const isSelected = selectedSize === size;
                const stock = product.sizeStock?.[size];
                const sizeOutOfStock = stock === 0;

                return (
                  <button
                    key={size}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedSize(size);
                    }}
                    disabled={sizeOutOfStock}
                    className={`min-h-[40px] min-w-[40px] px-2.5 py-1 text-[11px] font-bold rounded-lg transition-all active:scale-[0.97] ${
                      isSelected
                        ? 'bg-[#8B3A3A] text-white shadow-xs'
                        : sizeOutOfStock
                        ? 'bg-gray-100 text-gray-400 line-through cursor-not-allowed'
                        : 'bg-[#FAF2E9] text-[#2B1810] hover:bg-[#EADCCE] border border-[#EADCCE]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Row: Primary Add to Bag + Quick WhatsApp Order */}
          <div className="flex items-center gap-1.5 pt-1">
            {/* Add to Bag Button (min 48px tap target) */}
            <button
              id={`add-to-cart-btn-${product.id}`}
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              className={`flex-1 min-h-[48px] py-2 px-2.5 sm:px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all duration-200 shadow-xs active:scale-[0.97] ${
                isAdded
                  ? 'bg-emerald-700 text-white'
                  : isOutOfStock
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                  : 'bg-[#8B3A3A] hover:bg-[#722E2E] text-white'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>{language === 'np' ? 'थपियो' : 'Added'}</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span className="truncate">{language === 'np' ? 'झोलामा थप्नुहोस्' : 'Add to Bag'}</span>
                </>
              )}
            </button>

            {/* Direct WhatsApp Quick Order Button (min 48px tap target) */}
            <a
              id={`quick-whatsapp-btn-${product.id}`}
              href={getWhatsAppProductOrderUrl(product, selectedSize, 1)}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              title={language === 'np' ? 'व्हाट्सएपबाट सिधै किन्नुहोस्' : 'Order via WhatsApp'}
              aria-label="Order via WhatsApp"
              className="min-h-[48px] min-w-[48px] p-2.5 rounded-xl bg-[#25D366] hover:bg-[#1EBE5B] text-white shadow-xs flex items-center justify-center transition-all hover:scale-105 active:scale-[0.97] shrink-0"
            >
              <MessageCircle className="w-5 h-5 fill-white" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
