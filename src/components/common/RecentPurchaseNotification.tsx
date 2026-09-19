import React, { useState, useEffect } from 'react';
import { useShopStore } from '../../store/shopStore';
import { Sparkles, X, HeartHandshake, ShoppingBag } from 'lucide-react';

// Pool of customer identifiers featuring user4484 prominently as requested, plus occasional authentic names
const BUYER_NAMES = [
  'user4484',
  'Prerana Shrestha',
  'user4484',
  'user7291',
  'Sunita Gurung',
  'user4484',
  'Pooja Karki',
  'user1043',
  'Aayusha Bajracharya',
  'user8820',
  'Dikshya Maharjan',
  'user4484',
];

const RECENT_TIMES = ['Just now', '2 mins ago', '5 mins ago', '9 mins ago', '14 mins ago', '18 mins ago'];

export const RecentPurchaseNotification: React.FC = () => {
  const { language, products, formatPrice, pageView, recentPurchases, setActiveDetailProduct } = useShopStore();

  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const [isDismissedByUser, setIsDismissedByUser] = useState<boolean>(false);

  // Don't clutter checkout page during active payment typing
  if (pageView === 'checkout') {
    return null;
  }

  // Initial timer
  useEffect(() => {
    if (products.length === 0 || isDismissedByUser) return;

    // Initial delay before showing first subtle notification
    const initialTimer = setTimeout(() => {
      setIsVisible(true);
    }, 3500);

    return () => clearTimeout(initialTimer);
  }, [isDismissedByUser, products.length]);

  // Subtle Looping Interval:
  // Visible for 6.5 seconds, hidden for 16 seconds, then advances to next item from products list
  useEffect(() => {
    if (isDismissedByUser || products.length === 0) return;

    let hideTimer: ReturnType<typeof setTimeout>;
    let loopTimer: ReturnType<typeof setTimeout>;

    if (isVisible) {
      hideTimer = setTimeout(() => {
        setIsVisible(false);
      }, 6500);
    } else {
      loopTimer = setTimeout(() => {
        setCurrentIndex((prev) => prev + 1);
        setIsVisible(true);
      }, 16000);
    }

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(loopTimer);
    };
  }, [isVisible, isDismissedByUser, products.length]);

  if (!isVisible || products.length === 0 || isDismissedByUser) {
    return null;
  }

  // Check if there is a real self-purchase submitted in this session
  const selfPurchase = recentPurchases.find((rp) => rp.isSelf);
  const showSelf = Boolean(selfPurchase && currentIndex % 3 === 0);

  // Pick actual product from the store's current active product list (never generic image)
  const product = products[currentIndex % products.length];
  if (!product) return null;

  const buyerName = showSelf && selfPurchase
    ? selfPurchase.customerName
    : BUYER_NAMES[currentIndex % BUYER_NAMES.length];

  const productImage = showSelf && selfPurchase
    ? selfPurchase.productImage
    : (product.images && product.images.length > 0 ? product.images[0] : 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80');

  const productTitle = showSelf && selfPurchase
    ? selfPurchase.productName
    : product.title[language];

  const productPrice = showSelf && selfPurchase
    ? selfPurchase.price
    : product.price;

  const timeAgo = showSelf && selfPurchase
    ? selfPurchase.timeAgo
    : RECENT_TIMES[currentIndex % RECENT_TIMES.length];

  const handleNotificationClick = () => {
    if (product) {
      setActiveDetailProduct(product);
    }
  };

  return (
    <aside
      id="recent-purchase-indicator-toast"
      role="status"
      aria-live="polite"
      className="fixed bottom-20 sm:bottom-6 left-3 sm:left-6 z-40 max-w-[340px] sm:max-w-[380px] pointer-events-auto animate-in slide-in-from-bottom-5 fade-in duration-400"
    >
      <div
        className={`relative flex items-center gap-3 p-3 sm:p-3.5 rounded-2xl shadow-xl backdrop-blur-md border transition-all ${
          showSelf
            ? 'bg-[#FFF8F0] border-[#8B3A3A] ring-2 ring-[#8B3A3A]/25'
            : 'bg-white/95 border-[#EADCCE] hover:border-[#8B3A3A]/50'
        }`}
      >
        {/* Product Thumbnail from Real Product List */}
        <button
          type="button"
          onClick={handleNotificationClick}
          title="View this product"
          className="relative w-14 h-16 rounded-xl overflow-hidden shrink-0 border border-[#EADCCE] bg-[#FAF2E9] group cursor-pointer text-left"
        >
          <img
            src={productImage}
            alt={productTitle}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
            referrerPolicy="no-referrer"
          />
          {showSelf ? (
            <span className="absolute bottom-0 inset-x-0 bg-[#8B3A3A] text-white text-[8px] font-bold text-center py-0.5 leading-none">
              YOU
            </span>
          ) : (
            <div className="absolute inset-0 bg-black/10 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ShoppingBag className="w-3.5 h-3.5 text-white drop-shadow-md" />
            </div>
          )}
        </button>

        {/* Text Content with personalized Thank You message */}
        <div className="flex-1 min-w-0 pr-4">
          <div className="flex items-center gap-1.5 mb-1">
            {showSelf ? (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8B3A3A] bg-[#8B3A3A]/10 px-1.5 py-0.5 rounded-md">
                <Sparkles className="w-2.5 h-2.5 text-[#D4AF37]" />
                {language === 'np' ? 'तपाईंको अर्डर पुष्टि भयो' : 'Your Verified Order'}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#8B3A3A] bg-[#8B3A3A]/10 px-1.5 py-0.5 rounded-md">
                <HeartHandshake className="w-2.5 h-2.5 text-[#8B3A3A]" />
                <span>
                  {language === 'np'
                    ? `धन्यवाद ${buyerName}!`
                    : `Thank you ${buyerName}!`}
                </span>
              </span>
            )}
            <span className="text-[10px] text-[#6B564C] font-mono">
              • {timeAgo}
            </span>
          </div>

          <p className="text-[11px] text-[#6B564C] leading-snug mb-0.5">
            {language === 'np'
              ? 'हामीसँग किनमेल गर्नुभएकोमा धन्यवाद:'
              : 'Thank you for buying with us:'}
          </p>

          <button
            type="button"
            onClick={handleNotificationClick}
            className="text-xs font-bold text-[#2B1810] hover:text-[#8B3A3A] truncate block w-full text-left transition-colors"
          >
            {productTitle}
          </button>

          <div className="flex items-center justify-between text-[11px] text-[#6B564C] mt-1">
            <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded-sm">
              {language === 'np' ? 'सफलतापूर्वक खरिद' : 'Order Placed'}
            </span>
            <span className="font-bold text-[#8B3A3A] font-mono ml-2 shrink-0">
              {formatPrice(productPrice)}
            </span>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsDismissedByUser(true)}
          aria-label="Dismiss purchase notification"
          className="absolute top-2 right-2 p-1 text-[#6B564C] hover:text-[#2B1810] rounded-full hover:bg-black/5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
};
