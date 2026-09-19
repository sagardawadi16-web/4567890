import React from 'react';
import { ProductCard } from './ProductCard';
import { ProductSkeleton } from './ProductSkeleton';
import { useShopStore } from '../../store/shopStore';
import {
  Sparkles,
  SlidersHorizontal,
  RefreshCw,
  ArrowUpDown,
} from 'lucide-react';
import { SortOption } from '../../types';

export const ProductGrid: React.FC = () => {
  const {
    language,
    filteredProducts,
    categories,
    selectedCategory,
    setSelectedCategory,
    searchQuery,
    catalogMaxPrice,
    catalogMinPrice,
    priceRange,
    setPriceRange,
    sortBy,
    setSortBy,
    selectedSizeFilter,
    setSelectedSizeFilter,
    resetFilters,
    toggleFilterDrawer,
    formatPrice,
    isProductGridLoading,
  } = useShopStore();

  const activeCategoryObj = categories.find((c) => c.slug === selectedCategory);

  const sortOptions: Array<{ value: SortOption; label: { en: string; np: string } }> = [
    { value: 'featured', label: { en: 'Featured Collection', np: 'उत्कृष्ट सिफारिस' } },
    { value: 'price-low', label: { en: 'Price: Low to High', np: 'मूल्य: सस्तो देखि महँगो' } },
    { value: 'price-high', label: { en: 'Price: High to Low', np: 'मूल्य: महँगो देखि सस्तो' } },
    { value: 'rating', label: { en: 'Top Rated', np: 'उत्कृष्ट मूल्याङ्कन' } },
    { value: 'newest', label: { en: 'New Arrivals', np: 'नयाँ आगमन' } },
  ];

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    priceRange.max < catalogMaxPrice ||
    priceRange.min > catalogMinPrice ||
    selectedSizeFilter !== 'ALL' ||
    sortBy !== 'featured' ||
    Boolean(searchQuery);

  return (
    <section
      id="all-collections-catalog-section"
      data-anchor="products-section"
      className="py-6 sm:py-10 px-3 sm:px-6 lg:px-8 max-w-7xl mx-auto scroll-mt-20"
    >
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-3 border-b border-[#EADCCE] pb-4">
        <div>
          <div className="flex items-center gap-1.5 text-xs font-bold text-[#8B3A3A] uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
            <span>{language === 'np' ? 'हाम्रो फेसन संग्रह' : 'Curated Nepali Collection'}</span>
          </div>

          <h2 className="font-serif-luxury text-2xl sm:text-3xl lg:text-4xl font-bold text-[#2B1810]">
            {activeCategoryObj
              ? activeCategoryObj.name[language]
              : language === 'np'
              ? 'सम्पूर्ण संग्रह'
              : 'All Collections'}
          </h2>

          <p className="text-xs sm:text-sm text-[#6B564C] mt-1 max-w-xl">
            {activeCategoryObj?.description
              ? activeCategoryObj.description[language]
              : language === 'np'
              ? 'शुद्ध रेशम, मुस्ताङ च्याङ्ग्रा पश्मिना, बनारसी साडी र आधुनिक नेपाली पहिरनको उत्कृष्ट संगम।'
              : 'Pure Silks, Mustang Chyangra Cashmere, Banarasi Drapes, and handcrafted ensembles.'}
          </p>
        </div>

        {/* Results Count & Mobile Filter Trigger */}
        <div className="flex items-center justify-between md:justify-end gap-2.5 pt-2 md:pt-0">
          <div className="text-xs font-semibold text-[#6B564C] bg-white px-3.5 py-2.5 rounded-xl border border-[#EADCCE] shadow-2xs">
            <span className="text-[#8B3A3A] font-bold">{filteredProducts.length}</span>{' '}
            {language === 'np' ? 'सामान उपलब्ध' : 'Products'}
          </div>

          {/* MOBILE FILTER BUTTON (Triggers Bottom Slide-Over Drawer with min 48px tap target) */}
          <button
            id="mobile-filter-drawer-btn"
            onClick={toggleFilterDrawer}
            aria-label="Open Filter and Sort Menu"
            className="md:hidden min-h-[48px] px-4 py-2.5 bg-[#8B3A3A] text-white rounded-xl text-xs font-bold shadow-md flex items-center gap-2 active:scale-[0.97] transition-all"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{language === 'np' ? 'फिल्टर तथा क्रमबद्ध' : 'Filter & Sort'}</span>
            {hasActiveFilters && (
              <span className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
            )}
          </button>
        </div>
      </div>

      {/* DESKTOP FILTER BAR & Category Chips */}
      <div className="hidden md:flex flex-col gap-4 mb-6 bg-white p-4 rounded-2xl border border-[#EADCCE] shadow-2xs">
        {/* Category Filter Pills */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.slug;
              return (
                <button
                  key={cat.id}
                  id={`filter-pill-${cat.slug}`}
                  onClick={() => setSelectedCategory(cat.slug)}
                  className={`min-h-[44px] px-3.5 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 active:scale-[0.97] ${
                    isSelected
                      ? 'bg-[#8B3A3A] text-white shadow-xs'
                      : 'bg-[#FAF2E9] text-[#2B1810] hover:bg-[#EADCCE] border border-[#EADCCE]'
                  }`}
                >
                  <span>{cat.name[language]}</span>
                  {cat.productCount && (
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                        isSelected
                          ? 'bg-[#561F1F] text-[#D4AF37]'
                          : 'bg-white text-[#6B564C]'
                      }`}
                    >
                      {cat.productCount}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Desktop Sort Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-[#6B564C] font-semibold flex items-center gap-1">
              <ArrowUpDown className="w-3.5 h-3.5" />
              {language === 'np' ? 'क्रमबद्ध:' : 'Sort:'}
            </span>
            <select
              id="desktop-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="bg-[#FAF2E9] text-xs font-bold text-[#2B1810] border border-[#EADCCE] rounded-xl px-3 py-2.5 min-h-[44px] outline-hidden cursor-pointer"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label[language]}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Desktop Secondary Filters: Price Slider & Size Selector */}
        <div className="flex items-center justify-between gap-6 pt-3 border-t border-[#EADCCE]/60 flex-wrap">
          {/* Price Range Slider */}
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B564C]">
              {language === 'np' ? 'अधिकतम मूल्य:' : 'Max Price:'}
            </span>
            <input
              id="desktop-price-slider"
              type="range"
              min={catalogMinPrice}
              max={catalogMaxPrice}
              step="500"
              value={priceRange.max}
              onChange={(e) =>
                setPriceRange({ min: priceRange.min, max: Number(e.target.value) })
              }
              className="w-36 lg:w-48 accent-[#8B3A3A] h-1.5 bg-[#FAF2E9] rounded-lg cursor-pointer"
            />
            <span className="text-xs font-bold text-[#8B3A3A] font-mono min-w-[75px]">
              {formatPrice(priceRange.max)}
            </span>
          </div>

          {/* Size Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-[#6B564C] mr-1">
              {language === 'np' ? 'साइज:' : 'Size:'}
            </span>
            {(['ALL', 'XS', 'S', 'M', 'L', 'XL', 'Free Size'] as const).map((s) => {
              const isSelected = selectedSizeFilter === s;
              return (
                <button
                  key={s}
                  onClick={() => setSelectedSizeFilter(s)}
                  className={`min-h-[40px] min-w-[40px] px-2 py-1 text-xs font-bold rounded-lg transition-all active:scale-[0.97] ${
                    isSelected
                      ? 'bg-[#8B3A3A] text-white shadow-2xs'
                      : 'bg-[#FAF2E9] text-[#2B1810] hover:bg-[#EADCCE] border border-[#EADCCE]'
                  }`}
                >
                  {s}
                </button>
              );
            })}
          </div>

          {/* Reset button if active filters */}
          {hasActiveFilters && (
            <button
              id="desktop-reset-filters-btn"
              onClick={resetFilters}
              className="min-h-[40px] px-2 text-xs text-[#8B3A3A] hover:underline font-bold flex items-center gap-1 ml-auto active:scale-[0.97]"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'np' ? 'सबै रिसेट' : 'Reset All'}</span>
            </button>
          )}
        </div>
      </div>

      {/* MOBILE Category Pills Horizontal Scroll (min 48px touch targets) */}
      <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-3 mb-4 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat.slug;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.slug)}
              className={`min-h-[48px] px-4 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all shrink-0 active:scale-[0.97] ${
                isSelected
                  ? 'bg-[#8B3A3A] text-white shadow-xs'
                  : 'bg-white text-[#2B1810] border border-[#EADCCE]'
              }`}
            >
              {cat.name[language]}
            </button>
          );
        })}
      </div>

      {/* Active Filter Chips readout */}
      {hasActiveFilters && (
        <div className="flex items-center gap-2 flex-wrap mb-4 pb-2 text-xs text-[#6B564C]">
          <span className="font-semibold">{language === 'np' ? 'लागू फिल्टर:' : 'Active:'}</span>
          {selectedCategory !== 'all' && (
            <span className="bg-[#FAF2E9] border border-[#EADCCE] px-2.5 py-1 rounded-full text-[#8B3A3A] font-bold">
              {activeCategoryObj?.name[language]}
            </span>
          )}
          {priceRange.max < catalogMaxPrice && (
            <span className="bg-[#FAF2E9] border border-[#EADCCE] px-2.5 py-1 rounded-full text-[#8B3A3A] font-bold">
              &le; {formatPrice(priceRange.max)}
            </span>
          )}
          {selectedSizeFilter !== 'ALL' && (
            <span className="bg-[#FAF2E9] border border-[#EADCCE] px-2.5 py-1 rounded-full text-[#8B3A3A] font-bold">
              Size: {selectedSizeFilter}
            </span>
          )}
          <button
            onClick={resetFilters}
            className="min-h-[40px] px-2 text-[#8B3A3A] hover:underline font-bold text-xs ml-1 flex items-center active:scale-[0.97]"
          >
            {language === 'np' ? 'हटाउनुहोस् ✕' : 'Clear All ✕'}
          </button>
        </div>
      )}

      {/* MASS PRODUCT LISTING GRID:
          2 COLUMNS ON MOBILE, 3 ON TABLET, 4 ON DESKTOP.
          Exact-shape skeletons rendered during isProductGridLoading
      */}
      {isProductGridLoading ? (
        <div
          id="products-skeleton-grid"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {Array.from({ length: 8 }).map((_, index) => (
            <ProductSkeleton key={index} />
          ))}
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white rounded-3xl border border-[#EADCCE] p-8 sm:p-12 text-center max-w-md mx-auto my-8 shadow-xs">
          <div className="w-16 h-16 bg-[#FAF2E9] text-[#8B3A3A] rounded-full flex items-center justify-center mx-auto mb-4 border border-[#EADCCE]">
            <SlidersHorizontal className="w-8 h-8 stroke-1" />
          </div>
          <h3 className="font-serif-luxury text-lg font-bold text-[#2B1810] mb-2">
            {language === 'np' ? 'कुनै सामान भेटिएन' : 'No Matching Products'}
          </h3>
          <p className="text-xs text-[#6B564C] mb-6 leading-relaxed">
            {language === 'np'
              ? 'तपाईंले छान्नुभएको मूल्य दायरा वा साइज अनुसार कुनै सामान छैन। कृपया फिल्टर रिसेट गरी हेर्नुहोस्।'
              : 'No items match your selected filters. Please adjust the price range or clear your selections.'}
          </p>
          <button
            id="reset-filter-empty-state-btn"
            onClick={resetFilters}
            className="min-h-[48px] inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#8B3A3A] text-white text-xs font-bold rounded-xl hover:bg-[#722E2E] transition-all shadow-md active:scale-[0.97]"
          >
            <RefreshCw className="w-4 h-4" />
            <span>{language === 'np' ? 'सबै संग्रह देखाउनुहोस्' : 'Reset All Filters'}</span>
          </button>
        </div>
      ) : (
        <div
          id="mass-products-grid"
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
