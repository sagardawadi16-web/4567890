import React from 'react';
import { Sparkles, Truck, ShieldCheck, RefreshCw, HeartHandshake, MapPin } from 'lucide-react';
import { useShopStore } from '../../store/shopStore';

export const HeritageTrust: React.FC = () => {
  const { language, siteContent } = useShopStore();

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Sparkles':
        return Sparkles;
      case 'ShieldCheck':
        return ShieldCheck;
      case 'Truck':
        return Truck;
      case 'HeartHandshake':
        return HeartHandshake;
      case 'MapPin':
        return MapPin;
      default:
        return Sparkles;
    }
  };

  return (
    <section id="heritage-trust-section" className="py-10 sm:py-12 bg-[#FAF2E9] border-t border-b border-[#EADCCE]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {siteContent.trustPillars.map((item, index) => {
            const Icon = getIcon(item.iconName);
            return (
              <div
                key={item.id || index}
                id={`trust-pillar-${index + 1}`}
                className="bg-white p-5 rounded-2xl border border-[#EADCCE] flex flex-col items-start hover:shadow-md transition-shadow"
              >
                <div className="w-10 h-10 rounded-xl bg-[#8B3A3A]/10 flex items-center justify-center text-[#8B3A3A] mb-3">
                  <Icon className="w-5 h-5 text-[#8B3A3A]" />
                </div>
                <h4 className="font-serif-luxury text-base font-bold text-[#2B1810] mb-1">
                  {item.title[language] || item.title.en}
                </h4>
                <p className="text-xs text-[#6B564C] leading-relaxed">
                  {item.desc[language] || item.desc.en}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
