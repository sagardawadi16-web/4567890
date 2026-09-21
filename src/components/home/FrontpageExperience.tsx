import React from 'react';
import { useShopStore } from '../../store/shopStore';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Truck,
  RotateCcw,
  ShoppingBag,
  Heart,
  ChevronDown,
  ExternalLink,
  Star,
  Globe,
  MessageCircle,
} from 'lucide-react';
import { DawostiBrandLogo } from '../common/DawostiBrandLogo';

export const FrontpageExperience: React.FC = () => {
  const {
    language,
    siteContent,
    products,
    categories,
    setSelectedCategory,
    setFrontpageDisplayMode,
    addToCart,
    setActiveDetailProduct,
    formatPrice,
    getWhatsAppProductOrderUrl,
  } = useShopStore();

  const handleJumpToCategory = (slug: string) => {
    setSelectedCategory(slug);
    const catalogSection = document.getElementById('all-collections-catalog-section');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreAll = () => {
    setSelectedCategory('all');
    const catalogSection = document.getElementById('all-collections-catalog-section');
    if (catalogSection) {
      catalogSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // 3 Curated Spotlight Products for the unique frontpage
  const spotlightProducts = products.filter((p) => p.isFeatured).slice(0, 3);
  const displaySpotlight = spotlightProducts.length > 0 ? spotlightProducts : products.slice(0, 3);

  return (
    <div id="unique-frontpage-experience" className="space-y-12 sm:space-y-16 pb-6">
      
      {/* 1. EDITORIAL HERO SHOWCASE */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#FAF2E9] via-[#FFF8F0] to-[#FAF2E9] border-b border-[#EADCCE]">
        {/* Subtle Decorative Aura */}
        <div className="absolute top-0 right-0 w-[480px] h-[480px] bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#8B3A3A]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 lg:py-18">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            
            {/* Left Brand Identity & Story */}
            <div className="lg:col-span-7 space-y-5 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-[#8B3A3A]/20 shadow-2xs">
                <Sparkles className="w-4 h-4 text-[#D4AF37]" />
                <span className="text-xs font-bold text-[#8B3A3A] uppercase tracking-wider">
                  {siteContent?.heroBadge?.[language] ||
                    (language === 'np' ? 'काठमाडौँ मौलिक बुटिक फेसन' : 'Kathmandu Boutique Atelier')}
                </span>
              </div>

              <div className="space-y-2">
                <h1 className="font-serif-luxury text-3xl sm:text-5xl lg:text-6xl font-bold text-[#2B1810] tracking-tight leading-[1.12]">
                  {siteContent?.heroTitle?.[language] ||
                    (language === 'np'
                      ? 'परम्परागत लालित्य र आधुनिक पहिरन'
                      : 'Where Himalayan Heritage Meets Modern Elegance')}
                </h1>
                <p className="text-sm sm:text-base text-[#6B564C] max-w-xl mx-auto lg:mx-0 leading-relaxed">
                  {siteContent?.heroSubtitle?.[language] ||
                    (language === 'np'
                      ? 'हातेतानबाट निर्मित शुद्ध सिल्क, च्यांग्रा पश्मिना तथा विलासी नेपाली पहिरन। सिधै काठमाडौँ बुटिकबाट नेपालका ७७ वटै जिल्लामा सुरक्षित डेलिभरी।'
                      : 'Handcrafted Mulberry silk sarees, authentic Chyangra cashmere, and tailored festive lehengas. Dispatched directly from Kathmandu with express delivery across all 77 districts.')}
                </p>
              </div>

              {/* Guiding Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3 pt-2">
                <button
                  id="frontpage-explore-all-btn"
                  onClick={handleExploreAll}
                  className="w-full sm:w-auto min-h-[48px] px-8 py-3.5 bg-[#8B3A3A] hover:bg-[#722E2E] text-white font-bold text-sm rounded-2xl shadow-md hover:shadow-xl flex items-center justify-center gap-2.5 transition-all duration-150 active:scale-[0.97] group"
                >
                  <span>
                    {siteContent?.heroExploreBtn?.[language] ||
                      (language === 'np' ? 'सम्पूर्ण संग्रह हेर्नुहोस्' : 'Browse All Collections')}
                  </span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => handleJumpToCategory('pashmina-shawls')}
                  className="w-full sm:w-auto min-h-[48px] px-6 py-3.5 bg-white hover:bg-[#FAF2E9] text-[#2B1810] font-bold text-sm rounded-2xl border border-[#EADCCE] hover:border-[#8B3A3A] shadow-xs flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.97]"
                >
                  <span>
                    {siteContent?.pashminaBtn?.[language] ||
                      (language === 'np' ? 'च्यांग्रा पश्मिना हेर्नुहोस्' : 'Chyangra Pashmina')}
                  </span>
                </button>
              </div>

              {/* Trust Micro-Badges */}
              <div className="pt-4 grid grid-cols-3 gap-2 sm:gap-4 max-w-lg mx-auto lg:mx-0 border-t border-[#EADCCE]">
                <div className="text-center lg:text-left">
                  <p className="text-base sm:text-lg font-bold font-serif-luxury text-[#8B3A3A]">100%</p>
                  <p className="text-[11px] text-[#6B564C] font-medium">
                    {language === 'np' ? 'शुद्ध हातेतान' : 'Pure Handloom'}
                  </p>
                </div>
                <div className="text-center lg:text-left border-x border-[#EADCCE] px-2 sm:px-4">
                  <p className="text-base sm:text-lg font-bold font-serif-luxury text-[#8B3A3A]">77</p>
                  <p className="text-[11px] text-[#6B564C] font-medium">
                    {language === 'np' ? 'जिल्लामा डेलिभरी' : 'Nepal Districts'}
                  </p>
                </div>
                <div className="text-center lg:text-left">
                  <p className="text-base sm:text-lg font-bold font-serif-luxury text-[#8B3A3A]">QR / COD</p>
                  <p className="text-[11px] text-[#6B564C] font-medium">
                    {language === 'np' ? 'Fonepay र क्यास' : 'Fonepay & COD'}
                  </p>
                </div>
              </div>
            </div>

            {/* Right Curated Visual Feature */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-sm sm:max-w-md lg:max-w-none">
                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-[#FAF2E9] group">
                  <img
                    src="https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1000&q=80"
                    alt="Dawosti Women Fashion Collection"
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Floating Verified Boutique Seal */}
                  <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-[#EADCCE] shadow-md flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-[10px] font-bold text-[#2B1810] uppercase tracking-wider">
                      Kathmandu Flagship
                    </span>
                  </div>

                  {/* Bottom Highlight Overlay */}
                  <div className="absolute bottom-4 left-4 right-4 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#EADCCE] shadow-xl">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-[10px] font-bold tracking-widest text-[#8B3A3A] uppercase">
                          {language === 'np' ? 'विशेष चाडपर्व संग्रह' : 'Atelier Signature'}
                        </span>
                        <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#2B1810]">
                          {language === 'np' ? 'शाही कातान सिल्क साडी' : 'Royal Katan Silk Saree'}
                        </h4>
                      </div>
                      <div className="text-right">
                        <span className="font-bold text-[#8B3A3A] text-sm sm:text-base font-mono">
                          {formatPrice(18900)}
                        </span>
                        <p className="text-[10px] text-emerald-700 font-bold">In Stock</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CURATED BOUTIQUE COLLECTIONS PORTAL */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B3A3A]">
            {language === 'np' ? 'हाम्रा मुख्य संग्रहहरू' : 'Curated Departments'}
          </span>
          <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2B1810] mt-1">
            {language === 'np' ? 'मनपर्ने वर्ग छानेर किनमेल गर्नुहोस्' : 'Explore By Textile & Occasion'}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
          {categories
            .filter((c) => c.slug !== 'all')
            .map((cat) => {
              const matchedProducts = products.filter((p) => p.categoryId === cat.id);
              const minPrice = matchedProducts.length > 0
                ? Math.min(...matchedProducts.map((p) => p.price))
                : 3500;

              return (
                <div
                  key={cat.id}
                  onClick={() => handleJumpToCategory(cat.slug)}
                  className="group cursor-pointer bg-white rounded-2xl sm:rounded-3xl p-3 sm:p-4 border border-[#EADCCE] hover:border-[#8B3A3A] shadow-xs hover:shadow-lg transition-all duration-200 active:scale-[0.98]"
                >
                  <div className="relative aspect-3/4 rounded-xl sm:rounded-2xl overflow-hidden bg-[#FAF2E9] mb-3">
                    <img
                      src={cat.image}
                      alt={cat.name[language]}
                      className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                    <span className="absolute bottom-2.5 left-2.5 right-2.5 text-white text-xs sm:text-sm font-bold truncate">
                      {cat.name[language]}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#6B564C] px-1">
                    <span>{matchedProducts.length} {language === 'np' ? 'उत्पादनहरू' : 'Pieces'}</span>
                    <span className="font-bold text-[#8B3A3A] font-mono">
                      From {formatPrice(minPrice)}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </section>

      {/* 3. ATELIER SPOTLIGHT: SIGNATURE HANDPICKED PIECES */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rotate-45 bg-[#D4AF37]" />
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B3A3A]">
                {language === 'np' ? 'बुटिकको विशेष छनोट' : 'Signature Spotlight'}
              </span>
            </div>
            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2B1810] mt-1">
              {language === 'np' ? 'हाम्रा सर्वाधिक रुचाइएका वस्त्रहरू' : 'Crafted For Life’s Great Celebrations'}
            </h2>
          </div>

          <button
            onClick={handleExploreAll}
            className="min-h-[44px] px-5 py-2.5 bg-[#FAF2E9] hover:bg-[#EADCCE] text-[#8B3A3A] rounded-xl text-xs font-bold flex items-center gap-2 border border-[#EADCCE] transition-all self-start sm:self-auto active:scale-[0.97]"
          >
            <span>{language === 'np' ? 'सबै हेर्नुहोस् (All Catalog)' : 'View All In Catalog'}</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {displaySpotlight.map((prod) => (
            <div
              key={prod.id}
              className="bg-white rounded-3xl border border-[#EADCCE] p-4 shadow-sm hover:shadow-xl transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div
                  onClick={() => setActiveDetailProduct(prod)}
                  className="relative aspect-3/4 rounded-2xl overflow-hidden bg-[#FAF2E9] cursor-pointer group mb-4"
                >
                  <img
                    src={prod.images[0]}
                    alt={prod.title[language]}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  {prod.isNewArrival && (
                    <span className="absolute top-3 left-3 bg-[#8B3A3A] text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                      NEW ARRIVAL
                    </span>
                  )}
                  <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#2B1810] text-[11px] font-bold px-2 py-0.5 rounded-lg border border-[#EADCCE] shadow-xs">
                    {prod.categoryName[language]}
                  </span>
                </div>

                <div className="space-y-1.5 px-1">
                  <div className="flex items-center gap-1 text-[#D4AF37]">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-bold text-[#2B1810]">4.9</span>
                    <span className="text-[11px] text-[#6B564C]">(18 verified orders)</span>
                  </div>

                  <h3
                    onClick={() => setActiveDetailProduct(prod)}
                    className="font-serif-luxury text-base font-bold text-[#2B1810] hover:text-[#8B3A3A] cursor-pointer truncate"
                  >
                    {prod.title[language]}
                  </h3>

                  <p className="text-xs text-[#6B564C] line-clamp-2 leading-relaxed">
                    {prod.description[language]}
                  </p>

                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="text-base font-bold text-[#8B3A3A] font-mono">
                      {formatPrice(prod.price)}
                    </span>
                    {prod.originalPrice && (
                      <span className="text-xs text-[#6B564C] line-through font-mono">
                        {formatPrice(prod.originalPrice)}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* "Buy in Website" Heading & Order Actions */}
              <div className="pt-3 mt-3 border-t border-[#EADCCE] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold text-[#2B1810]">
                  <div className="flex items-center gap-1.5 text-[#8B3A3A]">
                    <Globe className="w-3.5 h-3.5 text-[#8B3A3A]" />
                    <span className="uppercase tracking-wider text-[10px] font-extrabold">
                      {language === 'np' ? 'वेबसाइटमा किन्नुहोस्' : 'Buy in Website'}
                    </span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                    {language === 'np' ? 'सिधै डेलिभरी' : 'Fast Delivery'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => addToCart(prod, prod.availableSizes[0] || 'Free Size', 1)}
                    className="min-h-[48px] py-2 px-3 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.97]"
                  >
                    <ShoppingBag className="w-4 h-4 shrink-0" />
                    <span>{language === 'np' ? 'झोलामा थप्नुहोस्' : 'Add to Bag'}</span>
                  </button>

                  <a
                    href={getWhatsAppProductOrderUrl(prod, prod.availableSizes[0] || 'Free Size', 1)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[48px] py-2 px-3 bg-[#25D366] hover:bg-[#1EBE5B] text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-[0.97]"
                  >
                    <MessageCircle className="w-4 h-4 fill-white text-white shrink-0" />
                    <span>WhatsApp</span>
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. GUIDED ROADMAP TO "ALL COLLECTIONS ON THE BACK" */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="bg-[#FAF2E9] rounded-3xl p-6 sm:p-10 border border-[#EADCCE] text-center relative overflow-hidden">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-[#8B3A3A] bg-[#8B3A3A]/10 px-3 py-1 rounded-full">
              {language === 'np' ? 'नेपालभर डेलिभरी' : 'Guaranteed Countrywide Delivery'}
            </span>

            <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2B1810]">
              {language === 'np'
                ? 'सम्पूर्ण क्याटलग र उत्पादन सूचीहरू'
                : 'Browse Further Listings & Complete Collections'}
            </h3>

            <p className="text-xs sm:text-sm text-[#6B564C] leading-relaxed">
              {language === 'np'
                ? 'तल स्क्रोल गरेर सम्पूर्ण साडी, पश्मिना, लेहेंगा तथा कुर्ता सेटहरू फिल्टर र साइज अनुसार सजिलै हेर्नुहोस् र अर्डर गर्नुहोस्।'
                : 'Scroll below to explore our entire boutique catalog with price filters, size selection, instant Fonepay QR, and Cash on Delivery.'}
            </p>

            <div className="pt-2">
              <button
                id="frontpage-scroll-to-catalog-btn"
                onClick={handleExploreAll}
                className="min-h-[48px] px-8 py-3.5 bg-[#2B1810] hover:bg-[#3D251B] text-[#FFF8F0] font-bold text-sm rounded-2xl shadow-lg flex items-center justify-center gap-2 mx-auto transition-all active:scale-[0.97]"
              >
                <span>{language === 'np' ? 'सम्पूर्ण क्याटलग खोल्नुहोस् ↓' : 'Explore All Collections Below ↓'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
