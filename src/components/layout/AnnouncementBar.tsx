import React, { useState } from 'react';
import { Sparkles, Truck, Phone, X, Gift } from 'lucide-react';
import { useShopStore } from '../../store/shopStore';

export const AnnouncementBar: React.FC = () => {
  const { language, siteContent, themeSettings } = useShopStore();
  const [isVisible, setIsVisible] = useState<boolean>(true);

  if (!isVisible) return null;

  const isDashain = themeSettings.isDashainTheme;

  return (
    <div
      id="announcement-bar"
      className={`relative z-50 text-[#FFF8F0] text-xs sm:text-sm py-2 px-3 sm:px-6 shadow-xs border-b transition-all duration-300 ${
        isDashain
          ? 'bg-linear-to-r from-[#7D1E1E] via-[#8B3A3A] to-[#B83824] border-[#D4AF37]/60'
          : 'bg-[#8B3A3A] border-[#D4AF37]/30'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
        {/* Left: Kathmandu Customer Care (desktop) */}
        <div className="hidden lg:flex items-center gap-2 text-[#FFF8F0]/80 text-xs">
          <Phone className="w-3.5 h-3.5 text-[#D4AF37]" />
          <span>+977 01-4422990 | New Road, Kathmandu</span>
        </div>

        {/* Center: Main Announcement or Festive Dashain Offer */}
        <div className="flex-1 flex items-center justify-center gap-2 text-center font-medium">
          {isDashain ? (
            <>
              <Gift className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 animate-bounce" />
              <span className="leading-tight font-semibold">
                {themeSettings.bannerText[language] || themeSettings.bannerText.en}
              </span>
              <span className="hidden md:inline-block ml-1.5 px-2 py-0.5 bg-[#D4AF37] text-[#2B1810] rounded-full text-[11px] font-extrabold uppercase tracking-wider">
                {themeSettings.couponCode} (-{themeSettings.discountPercentage}%)
              </span>
            </>
          ) : (
            <>
              <Truck className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 animate-pulse hidden xs:inline-block" />
              <span className="leading-tight">
                {siteContent.announcementText[language] || siteContent.announcementText.en}
              </span>
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37] shrink-0 hidden sm:inline-block" />
            </>
          )}
        </div>

        {/* Right: Currency note & dismiss */}
        <div className="flex items-center gap-3 shrink-0">
          <span className="hidden sm:inline-block text-[11px] font-semibold text-[#D4AF37] bg-[#561F1F] px-2 py-0.5 rounded-full border border-[#D4AF37]/30">
            NPR (रु)
          </span>
          <button
            id="dismiss-announcement-btn"
            onClick={() => setIsVisible(false)}
            aria-label="Dismiss announcement"
            className="p-1 hover:bg-[#722E2E] rounded-md text-[#FFF8F0]/70 hover:text-[#FFF8F0] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

