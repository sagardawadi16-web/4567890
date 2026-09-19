import React, { useState, useRef, useEffect } from 'react';
import { Search, ShoppingBag, Menu, X, Settings, Sparkles, LayoutGrid } from 'lucide-react';
import { useShopStore } from '../../store/shopStore';
import { DawostiBrandLogo } from '../common/DawostiBrandLogo';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    cartCount,
    setIsCartOpen,
    isMobileMenuOpen,
    toggleMobileMenu,
    searchQuery,
    setSearchQuery,
    categories,
    selectedCategory,
    setSelectedCategory,
    filteredProducts,
    setActiveQuickViewProduct,
    setIsAdminOpen,
    frontpageDisplayMode,
    setFrontpageDisplayMode,
  } = useShopStore();

  const [isSearchExpanded, setIsSearchExpanded] = useState<boolean>(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState<boolean>(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setShowSearchDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setShowSearchDropdown(true);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setShowSearchDropdown(false);
  };

  return (
    <header
      id="main-header"
      className="sticky top-0 z-40 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#EADCCE] transition-all duration-200"
    >
      {/* Primary Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20 gap-2 sm:gap-4">
          {/* Mobile Menu Button (visible under 768px) */}
          <div className="flex items-center md:hidden">
            <button
              id="mobile-menu-toggle-btn"
              onClick={toggleMobileMenu}
              aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={isMobileMenuOpen}
              className="min-h-[48px] min-w-[48px] flex items-center justify-center -ml-2 rounded-xl text-[#2B1810] hover:bg-[#FAF2E9] focus:outline-hidden active:scale-[0.97] transition-all"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6 text-[#8B3A3A]" />
              ) : (
                <Menu className="w-6 h-6 text-[#2B1810]" />
              )}
            </button>

            {/* Mobile Search Icon Toggle */}
            <button
              id="mobile-search-toggle-btn"
              onClick={() => setIsSearchExpanded(!isSearchExpanded)}
              aria-label="Toggle search bar"
              className="min-h-[48px] min-w-[48px] flex items-center justify-center text-[#2B1810] hover:text-[#8B3A3A] rounded-xl hover:bg-[#FAF2E9] transition-all active:scale-[0.97]"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo & Heritage Mark matching user's official uploaded artwork */}
          <div className="flex items-center">
            <a
              id="brand-logo-link"
              href="#home"
              onClick={(e) => {
                e.preventDefault();
                setFrontpageDisplayMode('curated');
                setSelectedCategory('all');
                setSearchQuery('');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="focus:outline-hidden active:scale-[0.98] transition-transform"
            >
              <DawostiBrandLogo size="md" />
            </a>
          </div>

          {/* Desktop Search Bar */}
          <div
            ref={searchContainerRef}
            className="hidden md:flex flex-1 max-w-md mx-4 lg:mx-8 relative"
          >
            <div className="relative w-full">
              <input
                id="desktop-search-input"
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => setShowSearchDropdown(true)}
                placeholder={
                  language === 'np'
                    ? 'साडी, सिल्क, पश्मिना, लेहेंगा खोज्नुहोस्...'
                    : 'Search sarees, silks, pashmina, lehenga...'
                }
                className="w-full bg-[#FAF2E9] text-[#2B1810] placeholder-[#6B564C]/70 text-sm rounded-full pl-10 pr-9 py-2.5 border border-[#EADCCE] focus:border-[#8B3A3A] focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-[#8B3A3A] transition-all"
              />
              <Search className="w-4 h-4 text-[#8B3A3A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />

              {searchQuery && (
                <button
                  id="clear-search-btn"
                  onClick={handleClearSearch}
                  aria-label="Clear search input"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B564C] hover:text-[#8B3A3A] p-1 rounded-full active:scale-[0.97]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Dynamic Search Dropdown Preview */}
            {showSearchDropdown && searchQuery.trim().length > 0 && (
              <div
                id="desktop-search-results-dropdown"
                className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-[#EADCCE] py-3 px-2 z-50 max-h-80 overflow-y-auto"
              >
                <div className="px-3 py-1 text-xs font-semibold text-[#6B564C] uppercase tracking-wider flex justify-between">
                  <span>{language === 'np' ? 'मिलदो नतिजा' : 'Matched Products'}</span>
                  <span className="text-[#8B3A3A] font-bold">
                    {filteredProducts.length} {language === 'np' ? 'भेटियो' : 'found'}
                  </span>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="p-4 text-center text-sm text-[#6B564C]">
                    {language === 'np'
                      ? `"${searchQuery}" सँग मिल्ने फेसन भेटिएन`
                      : `No products found matching "${searchQuery}"`}
                  </div>
                ) : (
                  <div className="divide-y divide-[#FAF2E9] mt-1">
                    {filteredProducts.slice(0, 5).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => {
                          setActiveQuickViewProduct(product);
                          setShowSearchDropdown(false);
                        }}
                        className="p-2 flex items-center gap-3 hover:bg-[#FAF2E9] rounded-lg cursor-pointer transition-colors"
                      >
                        <img
                          src={product.images[0]}
                          alt={product.title[language]}
                          className="w-10 h-12 object-cover rounded-md border border-[#EADCCE]"
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-bold text-[#2B1810] truncate">
                            {product.title[language]}
                          </p>
                          <p className="text-[11px] font-bold text-[#8B3A3A]">
                            रु {product.price.toLocaleString('en-US')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Action Icons: View Toggle, Language, Admin Settings, Cart */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            {/* View Mode Switcher: Curated Frontpage vs All Collections Catalog */}
            <div className="hidden sm:flex items-center bg-[#FAF2E9] p-0.5 rounded-full border border-[#EADCCE]">
              <button
                onClick={() => setFrontpageDisplayMode('curated')}
                title="Boutique Highlights & Story"
                className={`min-h-[36px] px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 transition-all duration-200 active:scale-[0.97] ${
                  frontpageDisplayMode === 'curated'
                    ? 'bg-[#8B3A3A] text-white shadow-xs'
                    : 'text-[#6B564C] hover:text-[#2B1810]'
                }`}
              >
                <Sparkles className="w-3 h-3 text-[#D4AF37]" />
                <span className="hidden lg:inline">{language === 'np' ? 'हाइलाइट्स' : 'Highlights'}</span>
              </button>

              <button
                onClick={() => {
                  setFrontpageDisplayMode('catalog');
                  const catalogElem = document.getElementById('all-collections-catalog-section');
                  if (catalogElem) {
                    catalogElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                title="All Collections Catalog"
                className={`min-h-[36px] px-2.5 py-1 text-xs font-semibold rounded-full flex items-center gap-1 transition-all duration-200 active:scale-[0.97] ${
                  frontpageDisplayMode === 'catalog'
                    ? 'bg-[#8B3A3A] text-white shadow-xs'
                    : 'text-[#6B564C] hover:text-[#2B1810]'
                }`}
              >
                <LayoutGrid className="w-3 h-3" />
                <span className="hidden lg:inline">{language === 'np' ? 'सबै संग्रह' : 'All Collections'}</span>
              </button>
            </div>

            {/* Language Toggle Button (NP / EN) */}
            <div className="flex items-center bg-[#FAF2E9] p-0.5 rounded-full border border-[#EADCCE]">
              <button
                id="lang-np-btn"
                onClick={() => setLanguage('np')}
                aria-label="Switch to Nepali language"
                className={`min-h-[36px] px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 active:scale-[0.97] ${
                  language === 'np'
                    ? 'bg-[#8B3A3A] text-white shadow-xs'
                    : 'text-[#6B564C] hover:text-[#2B1810]'
                }`}
              >
                नेपाली
              </button>
              <button
                id="lang-en-btn"
                onClick={() => setLanguage('en')}
                aria-label="Switch to English language"
                className={`min-h-[36px] px-2.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 active:scale-[0.97] ${
                  language === 'en'
                    ? 'bg-[#8B3A3A] text-white shadow-xs'
                    : 'text-[#6B564C] hover:text-[#2B1810]'
                }`}
              >
                EN
              </button>
            </div>

            {/* Merchant Admin Modal Toggle (Header Shortcut) */}
            <button
              id="header-admin-btn"
              onClick={() => setIsAdminOpen(true)}
              aria-label="Open Merchant Admin Panel"
              title="Merchant Settings & QR Management"
              className="min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full text-[#2B1810] hover:text-[#8B3A3A] hover:bg-[#FAF2E9] focus:outline-hidden transition-all active:scale-[0.97]"
            >
              <Settings className="w-5 h-5" />
            </button>

            {/* Shopping Cart Button with Dynamic Item Counter Badge */}
            <button
              id="header-cart-btn"
              onClick={() => setIsCartOpen(true)}
              aria-label={`Shopping Bag with ${cartCount} items`}
              className="relative min-h-[48px] min-w-[48px] flex items-center justify-center rounded-full text-[#2B1810] hover:text-[#8B3A3A] hover:bg-[#FAF2E9] focus:outline-hidden transition-all active:scale-[0.97]"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" />

              {/* Dynamic Badge Counter */}
              {cartCount > 0 && (
                <span
                  id="cart-badge-counter"
                  className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-[#8B3A3A] text-[#FFF8F0] text-[11px] font-bold rounded-full flex items-center justify-center shadow-md animate-scaleUp border-2 border-[#FFF8F0]"
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Collapsible Mobile Search Input */}
        {isSearchExpanded && (
          <div className="md:hidden pb-3 pt-1 border-t border-[#EADCCE]/50">
            <div className="relative">
              <input
                id="mobile-search-input"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                placeholder={
                  language === 'np'
                    ? 'साडी, सिल्क, पश्मिना खोज्नुहोस्...'
                    : 'Search sarees, silks, pashmina...'
                }
                autoFocus
                className="w-full bg-[#FAF2E9] text-[#2B1810] placeholder-[#6B564C]/70 text-sm rounded-xl pl-10 pr-9 py-2.5 border border-[#EADCCE] focus:border-[#8B3A3A] focus:outline-hidden"
              />
              <Search className="w-4 h-4 text-[#8B3A3A] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#6B564C] p-2 min-h-[44px] min-w-[44px] flex items-center justify-center active:scale-[0.97]"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Desktop Category Navigation Links */}
        <nav
          id="desktop-category-nav"
          className="hidden md:flex items-center justify-center gap-1 lg:gap-3 py-2.5 border-t border-[#EADCCE]/60 overflow-x-auto scrollbar-none"
        >
          {categories.map((cat) => {
            const isActive = selectedCategory === cat.slug;
            return (
              <button
                key={cat.id}
                id={`nav-link-${cat.slug}`}
                onClick={() => {
                  setSelectedCategory(cat.slug);
                  // Scroll down to catalog view
                  const catalogElem = document.getElementById('all-collections-catalog-section');
                  if (catalogElem) {
                    catalogElem.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className={`relative px-3.5 py-1.5 text-xs lg:text-sm font-medium tracking-wider whitespace-nowrap rounded-md transition-all duration-200 active:scale-[0.97] ${
                  isActive
                    ? 'text-[#8B3A3A] font-bold bg-[#8B3A3A]/10'
                    : 'text-[#6B564C] hover:text-[#2B1810] hover:bg-[#FAF2E9]'
                }`}
              >
                {cat.name[language]}
                {isActive && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#8B3A3A] rounded-full" />
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
