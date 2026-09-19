import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import {
  Product,
  CartItem,
  Category,
  Language,
  ProductSize,
  SortOption,
  PriceRange,
  PageView,
  Order,
  MerchantSettings,
  SiteContentConfig,
  AdminSecuritySettings,
  RecentPurchaseNotificationItem,
  FrontpageDisplayMode,
  OrderStatus,
} from '../types';
import {
  mockCategories,
  mockProducts,
  defaultMerchantSettings,
  defaultSiteContent,
  defaultInitialOrdersLog,
} from './mockData';

const WHATSAPP_PHONE_NUMBER = '9779801234567'; // Dawosti Kathmandu Boutique Official WhatsApp

export const defaultAdminSecuritySettings: AdminSecuritySettings = {
  requirePasscode: true,
  passcode: '1234', // Default easy passcode for merchant
};

export const defaultInitialRecentPurchases: RecentPurchaseNotificationItem[] = [
  {
    id: 'rp-1',
    customerName: 'Prerana Shrestha',
    city: 'Lalitpur, Nepal',
    productName: 'Royal Crimson Heritage Kurtha Set',
    productImage: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    price: 4850,
    timeAgo: '4 mins ago',
    isSelf: false,
  },
  {
    id: 'rp-2',
    customerName: 'Bikram Karki',
    city: 'Pokhara, Nepal',
    productName: 'Chyangra Cashmere Pashmina Shawl',
    productImage: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    price: 8900,
    timeAgo: '12 mins ago',
    isSelf: false,
  },
  {
    id: 'rp-3',
    customerName: 'Aayusha Bajracharya',
    city: 'Kathmandu (Baneshwor)',
    productName: 'Zari Banarasi Bridal Drape Saree',
    productImage: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    price: 18500,
    timeAgo: '23 mins ago',
    isSelf: false,
  },
  {
    id: 'rp-4',
    customerName: 'Sadhana Gurung',
    city: 'Biratnagar, Nepal',
    productName: 'Embroidered Velvet Festive Lehenga',
    productImage: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    price: 24500,
    timeAgo: '35 mins ago',
    isSelf: false,
  },
];

interface ShopContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  
  // Navigation / Page View
  pageView: PageView;
  setPageView: (view: PageView) => void;
  frontpageDisplayMode: FrontpageDisplayMode;
  setFrontpageDisplayMode: (mode: FrontpageDisplayMode) => void;
  
  // Products & Categories (Dynamic & Editable)
  products: Product[];
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (categorySlug: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  // Category Modifications (Admin can change headings, add new head categories, sub categories)
  addCategory: (newCategory: Category) => void;
  updateCategory: (categoryId: string, updated: Partial<Category>) => void;
  deleteCategory: (categoryId: string) => void;
  resetCategoriesToDefault: () => void;

  // Catalog Modifications (Admin can add/edit listings from scratch)
  addProduct: (newProduct: Product) => void;
  updateProduct: (productId: string, updated: Partial<Product>) => void;
  deleteProduct: (productId: string) => void;
  resetProductsToDefault: () => void;
  
  // Dynamic Catalog Limits
  catalogMaxPrice: number;
  catalogMinPrice: number;

  // Filters & Sorting
  priceRange: PriceRange;
  setPriceRange: (range: PriceRange) => void;
  selectedSizeFilter: ProductSize | 'ALL';
  setSelectedSizeFilter: (size: ProductSize | 'ALL') => void;
  sortBy: SortOption;
  setSortBy: (sort: SortOption) => void;
  inStockOnly: boolean;
  setInStockOnly: (val: boolean) => void;
  resetFilters: () => void;
  filteredProducts: Product[];

  // Filter Drawer on Mobile
  isFilterDrawerOpen: boolean;
  setIsFilterDrawerOpen: (open: boolean) => void;
  toggleFilterDrawer: () => void;

  // Cart Management (with localStorage persistence)
  cart: CartItem[];
  addToCart: (product: Product, size: ProductSize, quantity?: number) => void;
  removeFromCart: (productId: string, size: ProductSize) => void;
  updateQuantity: (productId: string, size: ProductSize, delta: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartSubtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;

  // Orders & Checkout & Logistics Tracking Log
  latestOrder: Order | null;
  setLatestOrder: (order: Order | null) => void;
  placeOrder: (orderData: Partial<Order>) => Order;
  ordersLog: Order[];
  updateOrderStatus: (
    orderId: string,
    status: OrderStatus,
    trackingInfo?: { courierName?: string; trackingNumber?: string; logisticsNotes?: string }
  ) => void;
  deleteOrderFromLog: (orderId: string) => void;
  clearOrdersLog: () => void;
  addManualOrderToLog: (order: Order) => void;

  // Mobile Navigation Drawer
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: (open: boolean) => void;
  toggleMobileMenu: () => void;

  // Product Detail View Modal
  activeDetailProduct: Product | null;
  setActiveDetailProduct: (product: Product | null) => void;
  activeQuickViewProduct: Product | null;
  setActiveQuickViewProduct: (product: Product | null) => void;

  // Formatting & WhatsApp URL Generation
  formatPrice: (amount: number) => string;
  getWhatsAppCartOrderUrl: () => string;
  getWhatsAppProductOrderUrl: (product: Product, selectedSize: ProductSize, quantity: number) => string;

  // Phase 5 & 6: Merchant Admin Settings & Passcode Security
  isAdminOpen: boolean;
  setIsAdminOpen: (open: boolean) => void;
  toggleAdmin: () => void;
  merchantSettings: MerchantSettings;
  updateMerchantSettings: (settings: Partial<MerchantSettings>) => void;
  resetMerchantSettings: () => void;
  siteContent: SiteContentConfig;
  updateSiteContent: (content: Partial<SiteContentConfig>) => void;
  resetSiteContent: () => void;

  // Admin Passcode Lock & Security
  adminSecuritySettings: AdminSecuritySettings;
  updateAdminSecuritySettings: (settings: Partial<AdminSecuritySettings>) => void;
  isAdminAuthenticated: boolean;
  unlockAdmin: (enteredPin: string) => boolean;
  lockAdmin: () => void;

  // Perceived Performance Skeletons
  isProductGridLoading: boolean;
  setIsProductGridLoading: (loading: boolean) => void;

  // Realistic Subtle "Bought" Loop with Self-Purchase Confirmation
  recentPurchases: RecentPurchaseNotificationItem[];
  addSelfPurchase: (details: {
    productName: string;
    price: number;
    orderNumber: string;
    productImage: string;
    customerName?: string;
  }) => void;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const NEPALI_DIGITS: { [key: string]: string } = {
  '0': '०',
  '1': '१',
  '2': '२',
  '3': '३',
  '4': '४',
  '5': '५',
  '6': '६',
  '7': '७',
  '8': '८',
  '9': '९',
};

// Automatic Browser Language Detector
const detectInitialLanguage = (): Language => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem('dawosti_language');
    if (saved === 'en' || saved === 'np') return saved;
    const browserLang = (
      navigator.language ||
      (navigator as unknown as { userLanguage?: string }).userLanguage ||
      ''
    ).toLowerCase();
    if (browserLang.includes('ne') || browserLang.includes('np')) {
      return 'np';
    }
    return 'en';
  }
  return 'en';
};

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(detectInitialLanguage);
  const [pageView, setPageView] = useState<PageView>('home');
  const [frontpageDisplayMode, setFrontpageDisplayMode] = useState<FrontpageDisplayMode>('curated');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Dynamic Products Catalog persisted in localStorage
  const [products, setProducts] = useState<Product[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dawosti_custom_products_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Failed to parse custom products', e);
      }
    }
    return mockProducts;
  });

  // Save products to localStorage on edit
  const saveProductsToStorage = (updatedProducts: Product[]) => {
    setProducts(updatedProducts);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dawosti_custom_products_v2', JSON.stringify(updatedProducts));
      } catch (e) {
        console.error('Failed to save products to localStorage', e);
      }
    }
  };

  const addProduct = (newProduct: Product) => {
    const updated = [newProduct, ...products];
    saveProductsToStorage(updated);
  };

  const updateProduct = (productId: string, updated: Partial<Product>) => {
    const updatedList = products.map((p) => (p.id === productId ? { ...p, ...updated } : p));
    saveProductsToStorage(updatedList);
  };

  const deleteProduct = (productId: string) => {
    const updatedList = products.filter((p) => p.id !== productId);
    saveProductsToStorage(updatedList);
  };

  const resetProductsToDefault = () => {
    setProducts(mockProducts);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dawosti_custom_products_v2');
    }
  };

  // Dynamic Categories Catalog persisted in localStorage
  const [categories, setCategories] = useState<Category[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dawosti_custom_categories_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) return parsed;
        }
      } catch (e) {
        console.error('Failed to parse custom categories', e);
      }
    }
    return mockCategories;
  });

  const saveCategoriesToStorage = (updatedCategories: Category[]) => {
    setCategories(updatedCategories);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dawosti_custom_categories_v2', JSON.stringify(updatedCategories));
      } catch (e) {
        console.error('Failed to save categories to localStorage', e);
      }
    }
  };

  const addCategory = (newCat: Category) => {
    const updated = [...categories, newCat];
    saveCategoriesToStorage(updated);
  };

  const updateCategory = (catId: string, updated: Partial<Category>) => {
    const updatedList = categories.map((c) => (c.id === catId || c.slug === catId ? { ...c, ...updated } : c));
    saveCategoriesToStorage(updatedList);
  };

  const deleteCategory = (catId: string) => {
    if (catId === 'all' || catId === 'cat-all') return;
    const updatedList = categories.filter((c) => c.id !== catId && c.slug !== catId);
    saveCategoriesToStorage(updatedList);
  };

  const resetCategoriesToDefault = () => {
    setCategories(mockCategories);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dawosti_custom_categories_v2');
    }
  };

  // Dynamically compute live productCount for each category based on current products
  const computedCategories = useMemo(() => {
    return categories.map((cat) => {
      if (cat.slug === 'all') {
        return { ...cat, productCount: products.length };
      }
      const count = products.filter(
        (p) => p.categoryId === cat.id || p.categoryId === cat.slug
      ).length;
      return { ...cat, productCount: count };
    });
  }, [categories, products]);

  // Logistics & Orders Log persisted in localStorage
  const [ordersLog, setOrdersLog] = useState<Order[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dawosti_orders_log_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.error('Failed to parse orders log', e);
      }
    }
    return defaultInitialOrdersLog;
  });

  const saveOrdersLogToStorage = (updatedOrders: Order[]) => {
    setOrdersLog(updatedOrders);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dawosti_orders_log_v2', JSON.stringify(updatedOrders));
      } catch (e) {
        console.error('Failed to save orders log to localStorage', e);
      }
    }
  };

  const updateOrderStatus = (
    orderId: string,
    status: OrderStatus,
    trackingInfo?: { courierName?: string; trackingNumber?: string; logisticsNotes?: string }
  ) => {
    const updatedList = ordersLog.map((ord) => {
      if (ord.id === orderId || ord.orderNumber === orderId) {
        return {
          ...ord,
          status,
          ...(trackingInfo || {}),
          ...(status === 'shipped' && !ord.dispatchDate ? { dispatchDate: new Date().toISOString() } : {}),
        };
      }
      return ord;
    });
    saveOrdersLogToStorage(updatedList);
  };

  const deleteOrderFromLog = (orderId: string) => {
    const updatedList = ordersLog.filter((ord) => ord.id !== orderId && ord.orderNumber !== orderId);
    saveOrdersLogToStorage(updatedList);
  };

  const clearOrdersLog = () => {
    saveOrdersLogToStorage([]);
  };

  const addManualOrderToLog = (order: Order) => {
    const updated = [order, ...ordersLog];
    saveOrdersLogToStorage(updated);
  };

  // Dynamic Catalog Max and Min Price calculation based on live products
  const catalogMaxPrice = useMemo(() => {
    const maxP = products.reduce((max, p) => Math.max(max, p.price), 0);
    return Math.max(10000, maxP);
  }, [products]);

  const catalogMinPrice = useMemo(() => {
    const minP = products.reduce((min, p) => Math.min(min, p.price), Infinity);
    return Math.min(2000, minP);
  }, [products]);
  
  // Filtering & Sorting states
  const [priceRange, setPriceRange] = useState<PriceRange>(() => ({
    min: 2000,
    max: 50000,
  }));
  const [selectedSizeFilter, setSelectedSizeFilter] = useState<ProductSize | 'ALL'>('ALL');
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  // Orders
  const [latestOrder, setLatestOrder] = useState<Order | null>(null);

  // Phase 5 Admin & Merchant Settings with localStorage persistence
  const [merchantSettings, setMerchantSettings] = useState<MerchantSettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dawosti_merchant_settings_v1');
        if (saved) return { ...defaultMerchantSettings, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse merchant settings', e);
      }
    }
    return defaultMerchantSettings;
  });

  const updateMerchantSettings = (newSettings: Partial<MerchantSettings>) => {
    setMerchantSettings((prev) => {
      const updated = { ...prev, ...newSettings };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('dawosti_merchant_settings_v1', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save merchant settings', e);
        }
      }
      return updated;
    });
  };

  const resetMerchantSettings = () => {
    setMerchantSettings(defaultMerchantSettings);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dawosti_merchant_settings_v1');
    }
  };

  // Bilingual Site Content Editor with live reactive sync
  const [siteContent, setSiteContent] = useState<SiteContentConfig>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dawosti_site_content_v1');
        if (saved) return { ...defaultSiteContent, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse site content', e);
      }
    }
    return defaultSiteContent;
  });

  const updateSiteContent = (newContent: Partial<SiteContentConfig>) => {
    setSiteContent((prev) => {
      const updated = { ...prev, ...newContent };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('dawosti_site_content_v1', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save site content', e);
        }
      }
      return updated;
    });
  };

  const resetSiteContent = () => {
    setSiteContent(defaultSiteContent);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('dawosti_site_content_v1');
    }
  };

  // Admin Security & Passcode Lock
  const [adminSecuritySettings, setAdminSecuritySettings] = useState<AdminSecuritySettings>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dawosti_admin_security_v1');
        if (saved) return { ...defaultAdminSecuritySettings, ...JSON.parse(saved) };
      } catch (e) {
        console.error('Failed to parse admin security settings', e);
      }
    }
    return defaultAdminSecuritySettings;
  });

  const updateAdminSecuritySettings = (settings: Partial<AdminSecuritySettings>) => {
    setAdminSecuritySettings((prev) => {
      const updated = { ...prev, ...settings };
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('dawosti_admin_security_v1', JSON.stringify(updated));
        } catch (e) {
          console.error('Failed to save admin security', e);
        }
      }
      return updated;
    });
  };

  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(() => {
    // If passcode is not required, start authenticated
    return !defaultAdminSecuritySettings.requirePasscode;
  });

  const unlockAdmin = (enteredPin: string): boolean => {
    if (!adminSecuritySettings.requirePasscode) {
      setIsAdminAuthenticated(true);
      return true;
    }
    if (enteredPin.trim() === adminSecuritySettings.passcode.trim()) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const lockAdmin = () => {
    setIsAdminAuthenticated(false);
  };

  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const toggleAdmin = () => setIsAdminOpen((prev) => !prev);

  // Perceived performance: brief skeleton state on category/filter switch
  const [isProductGridLoading, setIsProductGridLoading] = useState<boolean>(false);

  // Overlays
  const [isFilterDrawerOpen, setIsFilterDrawerOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [activeDetailProduct, setActiveDetailProduct] = useState<Product | null>(null);

  // Realistic Subtle "Bought" Loop with Personalized Self-Purchase Booster
  const [recentPurchases, setRecentPurchases] = useState<RecentPurchaseNotificationItem[]>(
    defaultInitialRecentPurchases
  );

  const addSelfPurchase = (details: {
    productName: string;
    price: number;
    orderNumber: string;
    productImage: string;
    customerName?: string;
  }) => {
    const selfItem: RecentPurchaseNotificationItem = {
      id: `self-${Date.now()}`,
      customerName: details.customerName || 'You (Verified Buyer)',
      city: 'Kathmandu / Nepal',
      productName: details.productName,
      productImage: details.productImage,
      price: details.price,
      timeAgo: 'Just now',
      isSelf: true,
      orderNumber: details.orderNumber,
    };

    setRecentPurchases((prev) => [selfItem, ...prev]);
  };

  // Cart with localStorage persistence
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem('dawosti_cart_v2');
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch (e) {
        console.error('Failed to load cart from localStorage', e);
      }
    }
    return [
      {
        product: mockProducts[0],
        selectedSize: 'M',
        quantity: 1,
        addedAt: new Date().toISOString(),
      },
    ];
  });

  // Save cart to localStorage on change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dawosti_cart_v2', JSON.stringify(cart));
      } catch (e) {
        console.error('Failed to save cart to localStorage', e);
      }
    }
  }, [cart]);

  // Lock background scroll when overlays are active
  useEffect(() => {
    if (isMobileMenuOpen || isCartOpen || isFilterDrawerOpen || activeDetailProduct || isAdminOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen, isCartOpen, isFilterDrawerOpen, activeDetailProduct, isAdminOpen]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('dawosti_language', lang);
      } catch (e) {
        console.error('Failed to save language preference', e);
      }
    }
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'np' : 'en';
    setLanguage(nextLang);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  const toggleFilterDrawer = () => {
    setIsFilterDrawerOpen((prev) => !prev);
  };

  const resetFilters = () => {
    setSelectedCategory('all');
    setPriceRange({ min: catalogMinPrice, max: catalogMaxPrice });
    setSelectedSizeFilter('ALL');
    setSortBy('featured');
    setInStockOnly(false);
    setSearchQuery('');
  };

  // Place order implementation with automatic Self-Purchase loop booster & Logistics Log
  const placeOrder = (orderData: Partial<Order>): Order => {
    const orderId = orderData.id || `order_${Date.now()}`;
    const orderNumber = orderData.orderNumber || `DAW-${Math.floor(100000 + Math.random() * 900000)}`;
    const fee = orderData.deliveryFee ?? (cartSubtotal >= 3000 ? 0 : 150);
    const discount = orderData.discountAmount || 0;
    const finalTotal = orderData.totalAmount !== undefined 
      ? orderData.totalAmount 
      : Math.max(0, cartSubtotal - discount + fee);

    const newOrder: Order = {
      id: orderId,
      orderNumber,
      items: orderData.items && orderData.items.length > 0 ? [...orderData.items] : [...cart],
      subtotalAmount: cartSubtotal,
      discountAmount: discount,
      deliveryFee: fee,
      totalAmount: finalTotal,
      shippingAddress: orderData.shippingAddress || {
        fullName: '',
        phone: '',
        addressLine: '',
        city: 'Kathmandu',
        province: 'Bagmati',
      },
      paymentMethod: orderData.paymentMethod || 'cod',
      status: 'confirmed',
      createdAt: new Date().toISOString(),
      notes: orderData.notes,
      paymentDetails: orderData.paymentDetails,
    };

    // Save to Logistics Log
    addManualOrderToLog(newOrder);

    // Personal purchase confidence booster: Add this purchase to the local notification loop!
    if (cart.length > 0) {
      const mainItem = cart[0];
      addSelfPurchase({
        productName: language === 'np' ? mainItem.product.title.np : mainItem.product.title.en,
        price: finalTotal,
        orderNumber,
        productImage: mainItem.product.images[0] || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
        customerName: orderData.shippingAddress?.fullName ? `${orderData.shippingAddress.fullName.split(' ')[0]} (You)` : 'You (Verified Buyer)',
      });
    }

    setLatestOrder(newOrder);
    clearCart();
    setPageView('order-confirmation');
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    return newOrder;
  };

  // Cart operations
  const addToCart = (product: Product, size: ProductSize, quantity: number = 1) => {
    setCart((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === size
      );

      if (existingIndex > -1) {
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
        };
        return updated;
      }

      return [
        ...prev,
        {
          product,
          selectedSize: size,
          quantity,
          addedAt: new Date().toISOString(),
        },
      ];
    });

    setIsCartOpen(true);
  };

  const removeFromCart = (productId: string, size: ProductSize) => {
    setCart((prev) =>
      prev.filter(
        (item) => !(item.product.id === productId && item.selectedSize === size)
      )
    );
  };

  const updateQuantity = (productId: string, size: ProductSize, delta: number) => {
    setCart((prev) => {
      return prev
        .map((item) => {
          if (item.product.id === productId && item.selectedSize === size) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter((item): item is CartItem => item !== null);
    });
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  }, [cart]);

  const cartSubtotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  // Mass Product Listing filter & sort calculation based on dynamic products
  const filteredProducts = useMemo(() => {
    const list = products.filter((product) => {
      // 1. Category Filter
      const matchesCategory =
        selectedCategory === 'all' || product.categoryId === selectedCategory;
      if (!matchesCategory) return false;

      // 2. Price Range Filter
      if (product.price < priceRange.min || product.price > priceRange.max) {
        return false;
      }

      // 3. Size Filter
      if (selectedSizeFilter !== 'ALL') {
        const hasSize = product.availableSizes.includes(selectedSizeFilter);
        if (!hasSize) return false;
      }

      // 4. In-Stock Filter
      if (inStockOnly && !product.inStock) {
        return false;
      }

      // 5. Search Query
      const trimmedQuery = searchQuery.trim().toLowerCase();
      if (trimmedQuery) {
        const matchesEnTitle = product.title.en.toLowerCase().includes(trimmedQuery);
        const matchesNpTitle = product.title.np.toLowerCase().includes(trimmedQuery);
        const matchesEnDesc = product.description.en.toLowerCase().includes(trimmedQuery);
        const matchesNpDesc = product.description.np.toLowerCase().includes(trimmedQuery);
        const matchesTags = product.tags.some((t) => t.toLowerCase().includes(trimmedQuery));
        if (!matchesEnTitle && !matchesNpTitle && !matchesEnDesc && !matchesNpDesc && !matchesTags) {
          return false;
        }
      }

      return true;
    });

    // Sort order
    return list.sort((a, b) => {
      if (sortBy === 'price-low') return a.price - b.price;
      if (sortBy === 'price-high') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'newest') return (b.isNewArrival ? 1 : 0) - (a.isNewArrival ? 1 : 0);
      return (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0);
    });
  }, [products, selectedCategory, searchQuery, priceRange, selectedSizeFilter, sortBy, inStockOnly]);

  // Currency Formatter
  const formatPrice = (amount: number): string => {
    const formatted = amount.toLocaleString('en-US');
    if (language === 'np') {
      const nepaliNumber = formatted.replace(/[0-9]/g, (digit) => NEPALI_DIGITS[digit] || digit);
      return `रु ${nepaliNumber}`;
    }
    return `NPR ${formatted}`;
  };

  // Direct WhatsApp Ordering URL for Full Cart
  const getWhatsAppCartOrderUrl = (): string => {
    if (cart.length === 0) return `https://wa.me/${WHATSAPP_PHONE_NUMBER}`;

    const FREE_DELIVERY_THRESHOLD = 3000;
    const isFreeDelivery = cartSubtotal >= FREE_DELIVERY_THRESHOLD;
    const deliveryFee = isFreeDelivery ? 0 : 150;
    const finalTotal = cartSubtotal + deliveryFee;

    const itemsSummary = cart
      .map((item, i) => {
        const name = language === 'np' ? item.product.title.np : item.product.title.en;
        return `${i + 1}. *${name}*\n   Size: ${item.selectedSize} | Qty: ${item.quantity} | ${formatPrice(item.product.price * item.quantity)}`;
      })
      .join('\n\n');

    const message =
      language === 'np'
        ? `🙏 *नमस्ते DAWOSTI (दावोस्ती) Kathmandu!*

म तल दिइएका सामानहरू अर्डर गर्न चाहन्छु:

${itemsSummary}

--------------------------------
💰 *जम्मा रकम (Subtotal):* ${formatPrice(cartSubtotal)}
🚚 *डेलिभरी शुल्क (नेपालभर):* ${deliveryFee === 0 ? 'निःशुल्क (FREE)' : formatPrice(deliveryFee)}
✨ *कुल भुक्तानी रकम (Total):* ${formatPrice(finalTotal)}
--------------------------------

📍 *मेरो ग्राहक तथा डेलिभरी विवरण:*
- नाम (Full Name): 
- फोन नम्बर (Phone): 
- डेलिभरी ठेगाना (City / District): 
- भुक्तानी माध्यम (Payment): Cash on Delivery (COD) / eSewa

कृपया मेरो अर्डर पुष्टि गरिदिनुहोला!`
        : `🙏 *Namaste DAWOSTI Kathmandu!*

I would like to place an order for the following items:

${itemsSummary}

--------------------------------
💰 *Subtotal:* ${formatPrice(cartSubtotal)}
🚚 *Delivery Fee (All Nepal):* ${deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}
✨ *Total Amount:* ${formatPrice(finalTotal)}
--------------------------------

📍 *Customer & Shipping Details:*
- Full Name: 
- Phone Number: 
- Delivery Address (City / District): 
- Preferred Payment: Cash on Delivery (COD) / eSewa

Please confirm my order dispatch. Thank you!`;

    return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  // Direct WhatsApp Ordering URL for Single Product
  const getWhatsAppProductOrderUrl = (
    product: Product,
    selectedSize: ProductSize,
    quantity: number
  ): string => {
    const title = language === 'np' ? product.title.np : product.title.en;
    const total = product.price * quantity;

    const message =
      language === 'np'
        ? `🙏 *नमस्ते DAWOSTI Kathmandu!*

म यो सामान सिधै अर्डर गर्न चाहन्छु:

👗 *उत्पादन:* ${title}
📏 *साइज:* ${selectedSize}
🔢 *परिमाण:* ${quantity}
💰 *मूल्य:* ${formatPrice(total)}

📍 *मेरो विवरण:*
- नाम: 
- फोन: 
- डेलिभरी ठेगाना (सहर/जिल्ला): 
- भुक्तानी: क्यास अन डेलिभरी (COD) / eSewa

कृपया अर्डर पुष्टि गरिदिनुहोला!`
        : `🙏 *Namaste DAWOSTI Kathmandu!*

I would like to order this item directly via WhatsApp:

👗 *Product:* ${title}
📏 *Size:* ${selectedSize}
🔢 *Quantity:* ${quantity}
💰 *Price:* ${formatPrice(total)}

📍 *Customer Details:*
- Full Name: 
- Phone: 
- Delivery Address (City / District): 
- Payment: Cash on Delivery (COD) / eSewa

Please confirm my order. Thank you!`;

    return `https://wa.me/${WHATSAPP_PHONE_NUMBER}?text=${encodeURIComponent(message)}`;
  };

  return (
    <ShopContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        pageView,
        setPageView,
        frontpageDisplayMode,
        setFrontpageDisplayMode,
        products,
        categories: computedCategories,
        selectedCategory,
        setSelectedCategory,
        searchQuery,
        setSearchQuery,
        addCategory,
        updateCategory,
        deleteCategory,
        resetCategoriesToDefault,
        addProduct,
        updateProduct,
        deleteProduct,
        resetProductsToDefault,
        catalogMaxPrice,
        catalogMinPrice,
        priceRange,
        setPriceRange,
        selectedSizeFilter,
        setSelectedSizeFilter,
        sortBy,
        setSortBy,
        inStockOnly,
        setInStockOnly,
        resetFilters,
        filteredProducts,
        isFilterDrawerOpen,
        setIsFilterDrawerOpen,
        toggleFilterDrawer,
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartSubtotal,
        isCartOpen,
        setIsCartOpen,
        latestOrder,
        setLatestOrder,
        placeOrder,
        ordersLog,
        updateOrderStatus,
        deleteOrderFromLog,
        clearOrdersLog,
        addManualOrderToLog,
        isMobileMenuOpen,
        setIsMobileMenuOpen,
        toggleMobileMenu,
        activeDetailProduct,
        setActiveDetailProduct,
        activeQuickViewProduct: activeDetailProduct,
        setActiveQuickViewProduct: setActiveDetailProduct,
        formatPrice,
        getWhatsAppCartOrderUrl,
        getWhatsAppProductOrderUrl,
        // Merchant Settings & Admin Panel
        isAdminOpen,
        setIsAdminOpen,
        toggleAdmin,
        merchantSettings,
        updateMerchantSettings,
        resetMerchantSettings,
        siteContent,
        updateSiteContent,
        resetSiteContent,
        // Admin Passcode Security Lock
        adminSecuritySettings,
        updateAdminSecuritySettings,
        isAdminAuthenticated,
        unlockAdmin,
        lockAdmin,
        // Perceived Performance Skeletons
        isProductGridLoading,
        setIsProductGridLoading,
        // Social Proof Looping Notifications
        recentPurchases,
        addSelfPurchase,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShopStore = (): ShopContextType => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShopStore must be used within a ShopProvider');
  }
  return context;
};
