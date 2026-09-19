import { useShopStore } from '../store/shopStore';

export const translations = {
  announcement: {
    en: '🇳🇵 Free Delivery across Nepal on orders above NPR 3,000 | Festive Special: 10% OFF with code DAWOSTI10',
    np: '🇳🇵 रु ३,००० भन्दा माथिको अर्डरमा नेपालभर निःशुल्क डेलिभरी | विशेष छुट: कोड DAWOSTI10 प्रयोग गर्नुहोस्',
  },
  header: {
    searchPlaceholder: {
      en: 'Search authentic sarees, kurthas, pashmina...',
      np: 'साडी, फेस्टिभ कुर्ता, च्याङ्ग्रा पश्मिना खोज्नुहोस्...',
    },
    languageLabel: {
      en: 'नेपाली',
      np: 'English',
    },
    cart: {
      en: 'Cart',
      np: 'झोला',
    },
    wishlist: {
      en: 'Wishlist',
      np: 'इच्छासूची',
    },
    menu: {
      en: 'Menu',
      np: 'मेनु',
    },
    account: {
      en: 'Account',
      np: 'खाता',
    },
  },
  nav: {
    home: {
      en: 'Home',
      np: 'गृहपृष्ठ',
    },
    all: {
      en: 'All Collections',
      np: 'सम्पूर्ण संग्रह',
    },
    kurthas: {
      en: 'Kurthas & Sets',
      np: 'कुर्ता सुरुवाल',
    },
    sarees: {
      en: 'Heritage Sarees',
      np: 'साडी संग्रह',
    },
    lehengas: {
      en: 'Bridal & Lehengas',
      np: 'लेहेंगा',
    },
    pashmina: {
      en: 'Chyangra Pashmina',
      np: 'च्याङ्ग्रा पश्मिना',
    },
    newArrivals: {
      en: 'New Arrivals',
      np: 'नयाँ आगमन',
    },
    about: {
      en: 'Our Story',
      np: 'हाम्रो कथा',
    },
    contact: {
      en: 'Kathmandu Boutique',
      np: 'काठमाडौँ बुटिक',
    },
  },
  cartDrawer: {
    title: {
      en: 'Shopping Bag',
      np: 'तपाईंको सपिङ झोला',
    },
    emptyMessage: {
      en: 'Your shopping bag is empty',
      np: 'तपाईंको झोला हाल खाली छ',
    },
    emptySubtext: {
      en: 'Discover our handcrafted Nepali women fashion collection.',
      np: 'हाम्रा मौलिक नेपाली महिला पहिरनहरू हेर्नुहोस्।',
    },
    exploreButton: {
      en: 'Explore Collections',
      np: 'संग्रह हेर्नुहोस्',
    },
    subtotal: {
      en: 'Subtotal',
      np: 'जम्मा रकम',
    },
    delivery: {
      en: 'Delivery (All Nepal)',
      np: 'डेलिभरी (नेपालभर)',
    },
    freeDeliveryEligible: {
      en: '🎉 You unlocked FREE Delivery across Nepal!',
      np: '🎉 तपाईंले नेपालभर निःशुल्क डेलिभरी पाउनुभयो!',
    },
    freeDeliveryRemaining: {
      en: 'Add {amount} more for FREE Delivery across Nepal',
      np: 'निःशुल्क डेलिभरीका लागि थप {amount} को सामान थप्नुहोस्',
    },
    checkoutButton: {
      en: 'Proceed to Checkout (COD / eSewa)',
      np: 'अर्डर प्रक्रिया अगाडि बढाउनुहोस् (COD / eSewa)',
    },
    size: {
      en: 'Size',
      np: 'साइज',
    },
    remove: {
      en: 'Remove',
      np: 'हटाउनुहोस्',
    },
  },
  products: {
    addToCart: {
      en: 'Add to Bag',
      np: 'झोलामा हाल्नुहोस्',
    },
    addedToCart: {
      en: 'Added to Bag',
      np: 'झोलामा थपियो',
    },
    selectSize: {
      en: 'Select Size',
      np: 'साइज छान्नुहोस्',
    },
    fabric: {
      en: 'Fabric & Origin',
      np: 'कपडा र उत्पत्ति',
    },
    inStock: {
      en: 'In Stock',
      np: 'स्टकमा उपलब्ध',
    },
    outOfStock: {
      en: 'Sold Out',
      np: 'सकिएको छ',
    },
    quickView: {
      en: 'Quick View',
      np: 'छिटो हेर्नुहोस्',
    },
    resultsCount: {
      en: 'Showing {count} handcrafted designs',
      np: '{count} वटा मौलिक डिजाइनहरू प्रदर्शन हुँदै',
    },
    filterAll: {
      en: 'All Styles',
      np: 'सबै डिजाइन',
    },
  },
  badges: {
    authenticNepal: {
      en: '100% Nepali Craftsmanship',
      np: '१००% नेपाली हस्तकला',
    },
    pashminaGI: {
      en: 'Mustang Chyangra Cashmere',
      np: 'मुस्ताङ च्याङ्ग्रा पश्मिना',
    },
    codAvailable: {
      en: 'Cash on Delivery (77 Districts)',
      np: 'क्यास अन डेलिभरी (७७ जिल्ला)',
    },
    artisanSilks: {
      en: 'Artisan Heritage Silks',
      np: 'मौलिक नेपाली शिल्पकला',
    },
  },
};

export const useTranslation = () => {
  const { language } = useShopStore();

  const t = <T extends Record<string, any>>(section: T): any => {
    return section;
  };

  return {
    language,
    t: translations,
  };
};
