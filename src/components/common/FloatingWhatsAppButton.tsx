import React, { useState } from 'react';
import { MessageCircle, X, Phone, CheckCircle2 } from 'lucide-react';
import { useShopStore } from '../../store/shopStore';

export const FloatingWhatsAppButton: React.FC = () => {
  const { language } = useShopStore();
  const [isTooltipOpen, setIsTooltipOpen] = useState(false);

  const phoneNumber = '9708251494';
  const whatsappUrl = `https://wa.me/9779708251494?text=${encodeURIComponent(
    language === 'np'
      ? 'नमस्ते दावोस्ती बुटिक! मलाई तपाईंको संग्रह, मूल्य र अर्डर प्रक्रियाबारे जानकारी चाहिएको छ।'
      : 'Namaste Dawosti Boutique! I would like to inquire about your collection, pricing, and orders.'
  )}`;

  return (
    <div id="floating-whatsapp-container" className="fixed bottom-6 right-5 z-40 flex flex-col items-end gap-2">
      {/* Friendly hover / click greeting popup */}
      {isTooltipOpen && (
        <div className="bg-white rounded-2xl shadow-xl border border-[#EADCCE] p-3.5 max-w-xs text-xs text-[#2B1810] space-y-2 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <div className="flex items-center justify-between border-b border-[#FAF2E9] pb-1.5">
            <div className="flex items-center gap-1.5 font-bold text-emerald-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              <span>DAWOSTI WhatsApp Live</span>
            </div>
            <button
              onClick={() => setIsTooltipOpen(false)}
              className="p-1 text-gray-400 hover:text-gray-600 rounded-md"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          <p className="text-[#6B564C] leading-relaxed">
            {language === 'np'
              ? 'नमस्ते! हामीलाई सिधै फोन वा ह्वाट्सएप ९७०८२५१४९४ मा सम्पर्क गरी अर्डर गर्न सक्नुहुन्छ।'
              : 'Namaste! Chat or call us directly at 9708251494 for instant styling assistance and direct orders.'}
          </p>

          <div className="flex items-center gap-2 pt-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-h-[36px] bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-xl flex items-center justify-center gap-1.5 transition-all shadow-xs text-[11px]"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>{language === 'np' ? 'ह्वाट्सएप च्याट' : 'Open WhatsApp'}</span>
            </a>
            <a
              href={`tel:+977${phoneNumber}`}
              className="px-3 min-h-[36px] bg-[#FAF2E9] hover:bg-[#F3E5D8] text-[#2B1810] font-bold rounded-xl border border-[#EADCCE] flex items-center justify-center gap-1 text-[11px]"
            >
              <Phone className="w-3 h-3 text-[#8B3A3A]" />
              <span>Call</span>
            </a>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsTooltipOpen((prev) => !prev)}
          className="hidden sm:flex items-center gap-1.5 bg-white/95 backdrop-blur-xs border border-[#EADCCE] hover:border-emerald-400 text-[#2B1810] font-bold text-xs px-3 py-2 rounded-full shadow-md transition-all hover:scale-105 cursor-pointer"
        >
          <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
          <span>WhatsApp 9708251494</span>
        </button>

        <a
          id="floating-whatsapp-btn"
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp +977 9708251494"
          className="w-13 h-13 sm:w-14 sm:h-14 bg-[#25D366] hover:bg-[#20bd5a] text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110 active:scale-95 group focus:outline-none focus:ring-3 focus:ring-[#25D366]/40 cursor-pointer"
        >
          <MessageCircle className="w-7 h-7 sm:w-8 sm:h-8 fill-white" />
          <span className="sr-only">WhatsApp +977 9708251494</span>
        </a>
      </div>
    </div>
  );
};
