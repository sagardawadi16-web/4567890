import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useShopStore } from '../../store/shopStore';

export const HeroBanner: React.FC = () => {
  const { language, setSelectedCategory, siteContent } = useShopStore();

  const handleExplore = (categorySlug: string = 'all') => {
    setSelectedCategory(categorySlug);
    const section = document.getElementById('products-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero-banner" className="relative overflow-hidden bg-[#FAF2E9] border-b border-[#EADCCE]">
      {/* Subtle decorative background glow */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#8B3A3A]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Hero Text: High contrast typography, generous negative space */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#8B3A3A]/10 border border-[#8B3A3A]/20 text-[#8B3A3A] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
              <span>{siteContent.heroBadge[language] || siteContent.heroBadge.en}</span>
            </div>

            <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2B1810] tracking-tight leading-[1.15]">
              {siteContent.heroTitle[language] || siteContent.heroTitle.en}
            </h1>

            <p className="text-sm sm:text-base text-[#6B564C] max-w-xl mx-auto lg:mx-0 leading-relaxed">
              {siteContent.heroSubtitle[language] || siteContent.heroSubtitle.en}
            </p>

            {/* CTAs with tactile active:scale-[0.97] and >= 48px tap targets */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
              <button
                id="hero-explore-collection-btn"
                onClick={() => handleExplore('all')}
                className="w-full sm:w-auto min-h-[48px] px-7 py-3.5 bg-[#8B3A3A] hover:bg-[#722E2E] text-white font-semibold text-sm rounded-xl shadow-md hover:shadow-lg flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-[0.97] group"
              >
                <span>{siteContent.heroExploreBtn[language] || siteContent.heroExploreBtn.en}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                id="hero-view-pashmina-btn"
                onClick={() => handleExplore('pashmina-shawls')}
                className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-white hover:bg-[#FAF2E9] text-[#2B1810] font-semibold text-sm rounded-xl border border-[#EADCCE] hover:border-[#8B3A3A] shadow-xs flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97]"
              >
                <span>{siteContent.pashminaBtn[language] || siteContent.pashminaBtn.en}</span>
              </button>
            </div>

            {/* Highlights Bar */}
            <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 border-t border-[#EADCCE]/80">
              <div className="text-center lg:text-left">
                <p className="text-lg sm:text-xl font-bold font-serif-luxury text-[#8B3A3A]">100%</p>
                <p className="text-[11px] text-[#6B564C] font-medium">
                  {language === 'np' ? 'शुद्ध हातेतान' : 'Pure Handloom'}
                </p>
              </div>
              <div className="text-center lg:text-left border-x border-[#EADCCE]/80 px-2 sm:px-4">
                <p className="text-lg sm:text-xl font-bold font-serif-luxury text-[#8B3A3A]">77</p>
                <p className="text-[11px] text-[#6B564C] font-medium">
                  {language === 'np' ? 'जिल्ला डेलिभरी' : 'Districts Delivery'}
                </p>
              </div>
              <div className="text-center lg:text-left">
                <p className="text-lg sm:text-xl font-bold font-serif-luxury text-[#8B3A3A]">NPR</p>
                <p className="text-[11px] text-[#6B564C] font-medium">
                  {language === 'np' ? 'सुलभ नेपाली मूल्य' : 'Transparent Pricing'}
                </p>
              </div>
            </div>
          </div>

          {/* Right Hero Visual: Curated High-Fashion Nepal Collection Collage */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
              {/* Main Fashion Featured Image */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#FAF2E9]">
                <img
                  src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                  alt="Dawosti Women Fashion Collection"
                  className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EADCCE] shadow-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] font-bold tracking-widest text-[#8B3A3A] uppercase">
                        {language === 'np' ? 'चाडपर्व विशेष' : 'Festive Edit'}
                      </span>
                      <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#2B1810]">
                        {language === 'np' ? 'शाही कातान सिल्क साडी' : 'Royal Katan Silk Saree'}
                      </h4>
                    </div>
                    <span className="font-bold text-[#8B3A3A] text-sm sm:text-base">
                      {language === 'np' ? 'रु १८,९००' : 'NPR 18,900'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Floating Nepal Certificate Tag */}
              <div className="absolute -top-3 -left-3 sm:-top-5 sm:-left-5 bg-[#8B3A3A] text-white p-3 sm:p-4 rounded-2xl shadow-xl border-2 border-[#D4AF37] flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#D4AF37] text-[#2B1810] flex items-center justify-center font-bold text-xs">
                  🇳🇵
                </div>
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-[#D4AF37]">
                    DAWOSTI
                  </p>
                  <p className="text-xs font-semibold">
                    {language === 'np' ? 'नेपाली हस्तकला' : 'Nepal Heritage'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
