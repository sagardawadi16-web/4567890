import React from 'react';
import { Phone, Mail, MapPin, Sparkles, Settings } from 'lucide-react';
import { useShopStore } from '../../store/shopStore';
import { EmailOptInCard } from '../newsletter/EmailOptInCard';

export const Footer: React.FC = () => {
  const { language, categories, setSelectedCategory, siteContent, setIsAdminOpen } = useShopStore();

  return (
    <footer id="main-footer" className="bg-[#561F1F] text-[#FFF8F0] border-t-2 border-[#D4AF37] pt-12 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* VIP Email Drop & New Arrivals Opt-In Banner */}
        <div className="mb-10">
          <EmailOptInCard variant="footer" source="footer" />
        </div>

        {/* Main 4-Column Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b border-[#722E2E]">
          {/* Col 1: Brand & Craftsmanship */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rotate-45 bg-[#D4AF37]" />
              <span className="font-serif-luxury text-2xl font-bold tracking-widest text-[#FFF8F0] uppercase">
                DAWOSTI
              </span>
              <span className="w-2.5 h-2.5 rotate-45 bg-[#D4AF37]" />
            </div>

            <p className="text-xs sm:text-sm text-[#FFF8F0]/80 leading-relaxed max-w-sm">
              {siteContent.footerAbout[language] || siteContent.footerAbout.en}
            </p>

            <div className="flex items-center gap-2 text-xs text-[#D4AF37] font-semibold">
              <Sparkles className="w-4 h-4" />
              <span>
                {language === 'np' ? 'काठमाडौँमा हस्तनिर्मित बुटिक फेसन' : 'Handcrafted in Kathmandu, Nepal'}
              </span>
            </div>
          </div>

          {/* Col 2: Categories */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              {language === 'np' ? 'फेसन संग्रह' : 'Collections'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#FFF8F0]/80">
              {categories.map((cat) => (
                <li key={cat.id}>
                  <button
                    onClick={() => {
                      setSelectedCategory(cat.slug);
                      const s = document.getElementById('products-section');
                      if (s) s.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="hover:text-[#D4AF37] hover:underline transition-colors text-left"
                  >
                    {cat.name[language]}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Customer Care & Order Help */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              {language === 'np' ? 'ग्राहक सेवा' : 'Customer Care'}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#FFF8F0]/80">
              <li>
                <span className="hover:text-[#D4AF37] cursor-pointer">
                  {language === 'np' ? 'साइज गाइड' : 'Size Guide'}
                </span>
              </li>
              <li>
                <span className="hover:text-[#D4AF37] cursor-pointer">
                  {language === 'np' ? 'डेलिभरी र भुक्तानी' : 'Delivery & Payment'}
                </span>
              </li>
              <li>
                <span className="hover:text-[#D4AF37] cursor-pointer">
                  {language === 'np' ? 'हेरचाह तथा साइज सहयोग' : 'Care & Fit Assistance'}
                </span>
              </li>
              <li>
                <span className="hover:text-[#D4AF37] cursor-pointer">
                  {language === 'np' ? 'पश्मिना स्याहार' : 'Pashmina Care'}
                </span>
              </li>
              <li>
                <button
                  id="footer-open-admin-btn"
                  onClick={() => setIsAdminOpen(true)}
                  className="text-left text-[#D4AF37] hover:underline flex items-center gap-1.5 pt-1 text-xs font-semibold"
                >
                  <Settings className="w-3.5 h-3.5" />
                  <span>{language === 'np' ? 'मर्चेन्ट व्यवस्थापन (Admin)' : 'Merchant Admin Panel'}</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Boutique Location & Contact */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="font-serif-luxury text-sm font-bold uppercase tracking-wider text-[#D4AF37]">
              {language === 'np' ? 'काठमाडौँ बुटिक' : 'Kathmandu Boutique'}
            </h4>
            <div className="space-y-2.5 text-xs text-[#FFF8F0]/80">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#D4AF37] shrink-0 mt-0.5" />
                <span>New Road (Opposite Bishal Bazar), Kathmandu, Nepal</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="tel:+977970825194" className="hover:text-white transition-colors">
                  +977 970825194
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#D4AF37] shrink-0" />
                <a href="mailto:contact.dawosti@gmail.com" className="hover:text-white transition-colors">
                  contact.dawosti@gmail.com
                </a>
              </div>
            </div>

            {/* Accepted Payments in Nepal */}
            <div className="pt-2">
              <p className="text-[11px] text-[#FFF8F0]/60 mb-1.5 uppercase tracking-wider">
                {language === 'np' ? 'स्वीकृत भुक्तानी' : 'Accepted Payments'}
              </p>
              <div className="flex flex-wrap gap-1.5">
                <span className="px-2 py-0.5 bg-[#722E2E] text-white text-[10px] font-bold rounded border border-[#D4AF37]/30">
                  Cash on Delivery
                </span>
                <span className="px-2 py-0.5 bg-[#4B9B48] text-white text-[10px] font-bold rounded">
                  eSewa
                </span>
                <span className="px-2 py-0.5 bg-[#5D2E8E] text-white text-[10px] font-bold rounded">
                  Khalti
                </span>
                <span className="px-2 py-0.5 bg-[#D4AF37] text-[#2B1810] text-[10px] font-bold rounded">
                  Fonepay
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Sub-Footer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#FFF8F0]/70">
          <p>
            © {new Date().getFullYear()} DAWOSTI Nepal. {language === 'np' ? 'सर्वाधिकार सुरक्षित।' : 'All rights reserved.'}
          </p>

          <p className="text-[11px] text-[#FFF8F0]/60 text-center sm:text-right max-w-md">
            {siteContent.carePolicy[language] || siteContent.carePolicy.en}
          </p>
        </div>
      </div>
    </footer>
  );
};
