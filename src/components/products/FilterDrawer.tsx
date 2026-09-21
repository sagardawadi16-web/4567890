import React, { useState } from 'react';
import { X, SlidersHorizontal, RotateCcw, Check } from 'lucide-react';
import { useShopStore } from '../../store/shopStore';
import { ProductSize, SortOption } from '../../types';

export const FilterDrawer: React.FC = () => {
  const {
    language,
    categories,
    selectedCategory,
    setSelectedCategory,
    priceRange,
    setPriceRange,
    selectedSizeFilter,
    setSelectedSizeFilter,
    catalogMaxPrice,
    catalogMinPrice,
    sortBy,
    setSortBy,
    inStockOnly,
    setInStockOnly,
    resetFilters,
    isFilterDrawerOpen,
    setIsFilterDrawerOpen,
    filteredProducts,
    formatPrice,
  } = useShopStore();

  // Mobile swipe down to dismiss gesture state
  const [touchStartY, setTouchStartY] = useState<number | null>(null);
  const [translateY, setTranslateY] = useState<number>(0);

  if (!isFilterDrawerOpen) return null;

  const sizesList: Array<ProductSize | 'ALL'> = ['ALL', 'XS', 'S', 'M', 'L', 'XL', 'Free Size'];

  const sortOptions: Array<{ value: SortOption; label: { en: string; np: string } }> = [
    { value: 'featured', label: { en: 'Featured / Best Handcraft', np: 'उत्कृष्ट सिफारिस' } },
    { value: 'price-low', label: { en: 'Price: Low to High', np: 'मूल्य: कम देखि धेरै' } },
    { value: 'price-high', label: { en: 'Price: High to Low', np: 'मूल्य: धेरै देखि कम' } },
    { value: 'rating', label: { en: 'Highest Customer Rating', np: 'उत्कृष्ट ग्राहक मूल्याङ्कन' } },
    { value: 'newest', label: { en: 'New Arrivals First', np: 'नयाँ आगमन पहिलो' } },
  ];

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartY(e.touches[0].clientY);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartY === null) return;
    const currentY = e.touches[0].clientY;
    const diff = currentY - touchStartY;
    if (diff > 0) {
      setTranslateY(diff);
    }
  };

  const handleTouchEnd = () => {
    if (translateY > 75) {
      setIsFilterDrawerOpen(false);
    }
    setTranslateY(0);
    setTouchStartY(null);
  };

  return (
    <div
      id="mobile-filter-drawer-container"
      className="fixed inset-0 z-50 flex flex-col justify-end"
      role="dialog"
      aria-modal="true"
      aria-label="Product Filters"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={() => setIsFilterDrawerOpen(false)}
      />

      {/* Bottom Slide-Over Drawer Sheet with swipe to dismiss */}
      <div
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{
          transform: translateY > 0 ? `translateY(${translateY}px)` : undefined,
          transition: translateY > 0 ? 'none' : 'transform 0.25s ease-out',
        }}
        className="relative w-full max-h-[85vh] bg-[#FFF8F0] rounded-t-3xl shadow-2xl border-t border-[#EADCCE] z-10 flex flex-col overflow-hidden animate-in slide-in-from-bottom duration-300"
      >
        {/* Grab Handle for Touch Feedback & swipe affordance */}
        <div className="pt-2.5 pb-1 flex flex-col items-center justify-center bg-[#FAF2E9] cursor-grab active:cursor-grabbing">
          <div className="w-12 h-1 bg-[#EADCCE] rounded-full mb-1" />
          <span className="text-[10px] text-[#6B564C]/70">
            {language === 'np' ? 'तल तानेर बन्द गर्नुहोस्' : 'Swipe down to close'}
          </span>
        </div>

        {/* Drawer Header */}
        <div className="px-5 py-3 border-b border-[#EADCCE] bg-[#FAF2E9] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-5 h-5 text-[#8B3A3A]" />
            <h3 className="font-serif-luxury text-lg font-bold text-[#2B1810]">
              {language === 'np' ? 'फिल्टर तथा क्रमबद्धता' : 'Filters & Sorting'}
            </h3>
            <span className="text-xs bg-[#8B3A3A] text-white px-2 py-0.5 rounded-full font-bold">
              {filteredProducts.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={resetFilters}
              aria-label="Reset all filters"
              className="min-h-[44px] px-3 text-xs text-[#8B3A3A] font-semibold hover:underline flex items-center gap-1 active:scale-[0.97]"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{language === 'np' ? 'रिसेट' : 'Reset'}</span>
            </button>
            <button
              id="close-filter-drawer-btn"
              onClick={() => setIsFilterDrawerOpen(false)}
              aria-label="Close filters"
              className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full text-[#6B564C] hover:text-[#8B3A3A] hover:bg-white active:scale-[0.97] transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Scrollable Filter Options */}
        <div className="flex-1 overflow-y-auto p-5 space-y-6">
          
          {/* 1. Category Filter */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B564C] mb-2.5">
              {language === 'np' ? 'फेसन विधा (Category)' : 'Categories'}
            </label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => {
                const isSelected = selectedCategory === cat.slug;
                return (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.slug)}
                    className={`min-h-[48px] px-4 py-2 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-all active:scale-[0.97] ${
                      isSelected
                        ? 'bg-[#8B3A3A] text-white shadow-xs'
                        : 'bg-white text-[#2B1810] border border-[#EADCCE] hover:bg-[#FAF2E9]'
                    }`}
                  >
                    <span>{cat.name[language]}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-[#D4AF37]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Price Range Slider */}
          <div className="bg-white p-4 rounded-2xl border border-[#EADCCE]">
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C]">
                {language === 'np' ? 'मूल्य दायरा (Price Range)' : 'Price Range'}
              </label>
              <span className="text-xs font-bold text-[#8B3A3A]">
                {formatPrice(priceRange.min)} – {formatPrice(priceRange.max)}
              </span>
            </div>

            <div className="space-y-3 pt-2">
              <input
                id="filter-price-slider"
                type="range"
                min={catalogMinPrice}
                max={catalogMaxPrice}
                step="500"
                value={priceRange.max}
                onChange={(e) =>
                  setPriceRange({ min: priceRange.min, max: Number(e.target.value) })
                }
                className="w-full accent-[#8B3A3A] h-2 bg-[#FAF2E9] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[11px] text-[#6B564C] font-mono">
                <span>{formatPrice(catalogMinPrice)}</span>
                <span className="font-bold text-[#8B3A3A]">Max: {formatPrice(priceRange.max)}</span>
                <span>{formatPrice(catalogMaxPrice)}</span>
              </div>
            </div>
          </div>

          {/* 3. Available Sizes */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B564C] mb-2.5">
              {language === 'np' ? 'साइज (Available Size)' : 'Size'}
            </label>
            <div className="flex flex-wrap gap-2">
              {sizesList.map((size) => {
                const isSelected = selectedSizeFilter === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSizeFilter(size)}
                    className={`min-h-[48px] min-w-[48px] px-3.5 py-2 text-xs font-bold rounded-xl transition-all active:scale-[0.97] ${
                      isSelected
                        ? 'bg-[#8B3A3A] text-white shadow-xs'
                        : 'bg-white text-[#2B1810] border border-[#EADCCE] hover:bg-[#FAF2E9]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 4. Sort By Option */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-[#6B564C] mb-2.5">
              {language === 'np' ? 'क्रमबद्ध गर्नुहोस् (Sort By)' : 'Sort Order'}
            </label>
            <div className="grid grid-cols-1 gap-2">
              {sortOptions.map((opt) => {
                const isSelected = sortBy === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => setSortBy(opt.value)}
                    className={`min-h-[48px] px-4 py-2.5 rounded-xl text-left text-xs font-semibold flex items-center justify-between border transition-all active:scale-[0.97] ${
                      isSelected
                        ? 'bg-[#8B3A3A]/10 border-[#8B3A3A] text-[#8B3A3A]'
                        : 'bg-white border-[#EADCCE] text-[#2B1810] hover:bg-[#FAF2E9]'
                    }`}
                  >
                    <span>{opt.label[language]}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#8B3A3A]" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. In Stock Only Toggle */}
          <div className="flex items-center justify-between p-3.5 bg-white rounded-xl border border-[#EADCCE]">
            <div>
              <p className="text-xs font-bold text-[#2B1810]">
                {language === 'np' ? 'स्टकमा उपलब्ध मात्र' : 'In Stock Only'}
              </p>
              <p className="text-[11px] text-[#6B564C]">
                {language === 'np' ? 'तत्काल डेलिभरी हुने सामानहरू' : 'Hide temporarily sold out items'}
              </p>
            </div>
            <button
              type="button"
              role="switch"
              aria-checked={inStockOnly}
              onClick={() => setInStockOnly(!inStockOnly)}
              className={`min-h-[44px] min-w-[48px] flex items-center justify-center`}
            >
              <span
                className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                  inStockOnly ? 'bg-[#8B3A3A]' : 'bg-[#EADCCE]'
                }`}
              >
                <span
                  className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                    inStockOnly ? 'translate-x-6' : 'translate-x-0'
                  }`}
                />
              </span>
            </button>
          </div>

        </div>

        {/* Bottom CTA to Apply Filters */}
        <div className="p-4 border-t border-[#EADCCE] bg-[#FAF2E9]">
          <button
            id="apply-filters-btn"
            onClick={() => setIsFilterDrawerOpen(false)}
            className="w-full min-h-[48px] py-3.5 px-4 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-[0.97] transition-all"
          >
            <span>
              {language === 'np'
                ? `${filteredProducts.length} वटा सामान हेर्नुहोस्`
                : `View ${filteredProducts.length} Products`}
            </span>
          </button>
        </div>

      </div>
    </div>
  );
};
