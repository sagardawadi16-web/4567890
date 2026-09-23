import { Product, Category, MerchantSettings, SiteContentConfig, Order, ThemeSettings } from '../types';

export const mockCategories: Category[] = [
  {
    id: 'cat-all',
    slug: 'all',
    name: {
      en: 'All Collections',
      np: 'सबै संग्रहहरू',
    },
    description: {
      en: 'Explore our complete Nepali women fashion collection',
      np: 'नेपाली महिलाहरूको सम्पूर्ण फेसन संग्रह हेर्नुहोस्',
    },
    productCount: 17,
  },
  {
    id: 'cat-kurthas',
    slug: 'kurthas-suits',
    name: {
      en: 'Kurthas & Sets',
      np: 'कुर्ता तथा सेटहरू',
    },
    description: {
      en: 'Handloom silks, hand-embroidered, and daily luxury kurta sets',
      np: 'हातेतान सिल्क, हातको बुट्टा र दैनिक कुर्ता सेटहरू',
    },
    image: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80',
    productCount: 5,
  },
  {
    id: 'cat-sarees',
    slug: 'sarees',
    name: {
      en: 'Heritage Sarees',
      np: 'साडी संग्रह',
    },
    description: {
      en: 'Banarasi, Tussar silk, and festive drape sarees',
      np: 'बनारसी, टसर सिल्क तथा चाडपर्वका आकर्षक साडीहरू',
    },
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=600&q=80',
    productCount: 4,
  },
  {
    id: 'cat-lehengas',
    slug: 'lehengas',
    name: {
      en: 'Bridal & Lehengas',
      np: 'लेहेंगा र विवाह पहिरन',
    },
    description: {
      en: 'Royal crimson velvets, zardozi work, and festive grandeur',
      np: 'शाही मखमली, जरदोजी बुट्टा र विशेष उत्सवका लेहेंगाहरू',
    },
    image: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=600&q=80',
    productCount: 4,
  },
  {
    id: 'cat-pashmina',
    slug: 'pashmina-shawls',
    name: {
      en: 'Chyangra Pashmina',
      np: 'च्याङ्ग्रा पश्मिना',
    },
    description: {
      en: 'Pure 100% Himalayan cashmere wraps & sozni embroidered shawls',
      np: '१००% शुद्ध हिमाली च्याङ्ग्रा पश्मिना तथा कसिदा दोसल्लाहरू',
    },
    image: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=600&q=80',
    productCount: 4,
  },
];

export const mockProducts: Product[] = [
  {
    id: 'dawosti-01',
    slug: 'royal-crimson-heritage-kurtha-set',
    title: {
      en: 'Royal Crimson Artisan Heritage Kurtha Set',
      np: 'शाही क्रिमसन मौलिक हेरिटेज कुर्ता सुरुवाल सेट',
    },
    description: {
      en: 'Authentic hand-embroidered yoke with pure cotton kurtha, matching tailored cigarette pants, and hand-loomed sheer dupatta. Accented with subtle golden zari borders.',
      np: 'हातले भरिएको मौलिक बुट्टा, शुद्ध सुती कपडाको कुर्ता, म्याचिङ सिगरेट पाइन्ट र हातेतान पातलो दोपट्टा। सुनौलो जरी किनारले सजिएको।',
    },
    price: 4850,
    originalPrice: 5800,
    categoryId: 'cat-kurthas',
    categoryName: {
      en: 'Kurthas & Sets',
      np: 'कुर्ता तथा सेटहरू',
    },
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733975-00c2834b6e51?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    sizeStock: {
      XS: 2,
      S: 5,
      M: 8,
      L: 3,
      XL: 0,
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 42,
    tags: ['Handloom', 'Artisan Silk', 'Bestseller', 'Nepali Traditional'],
    fabric: {
      en: '100% Cotton & Pure Hand-spun Silk Zari',
      np: '१००% सुती र मौलिक हातेतान जरी रेशम',
    },
    origin: {
      en: 'Kathmandu Valley, Nepal',
      np: 'काठमाडौँ उपत्यका, नेपाल',
    },
    isNewArrival: true,
    isFeatured: true,
  },
  {
    id: 'dawosti-02',
    slug: 'chyangra-cashmere-sozni-pashmina-shawl',
    title: {
      en: 'Himalayan Chyangra Cashmere Sozni Shawl',
      np: 'हिमाली च्याङ्ग्रा पश्मिना सोजनी बुट्टा दोसल्ला',
    },
    description: {
      en: 'Feather-light Grade-A authentic mountain goat cashmere, hand-spun in Mustang and detailed with delicate needlepoint sozni embroidery in crimson maroon and gilded amber thread.',
      np: 'मुस्ताङको हिमाली च्याङ्ग्राबाट तयार पारिएको ग्रेड-ए शुद्ध पश्मिना। हातको मसिनो सोजनी सियो बुट्टा र सुनौलो धागोको आकर्षक किनारा भएको राजसी दोसल्ला।',
    },
    price: 12500,
    originalPrice: 15000,
    categoryId: 'cat-pashmina',
    categoryName: {
      en: 'Chyangra Pashmina',
      np: 'च्याङ्ग्रा पश्मिना',
    },
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['Free Size'],
    sizeStock: {
      'Free Size': 4,
    },
    inStock: true,
    rating: 5.0,
    reviewCount: 38,
    tags: ['GI Certified', 'Pashmina', 'Mustang Wool', 'Luxury'],
    fabric: {
      en: '100% Certified Mountain Chyangra Cashmere (14-16 Microns)',
      np: '१००% प्रमाणित हिमाली च्याङ्ग्रा पश्मिना',
    },
    origin: {
      en: 'Mustang & Lalitpur, Nepal',
      np: 'मुस्ताङ तथा ललितपुर, नेपाल',
    },
    isNewArrival: false,
    isFeatured: true,
  },
  {
    id: 'dawosti-03',
    slug: 'crimson-maroon-bridal-banarasi-saree',
    title: {
      en: 'Crimson Maroon Heritage Banarasi Silk Saree',
      np: 'शाही सिन्दूरे रातो बनारसी सिल्क साडी',
    },
    description: {
      en: 'Royal crimson red Katan silk featuring intricate antique gold brocade weave inspired by traditional Newari and Nepalese royal courtyard motifs. Includes unstitched blouse piece.',
      np: 'नेपाली विवाह तथा विशेष उत्सवका लागि तयार पारिएको उच्च कोटिको कातान सिल्क साडी। प्राचीन सुनौलो जरी बुट्टा र सुन्दर पल्लु सहितको शाही सिन्दूरे रातो साडी।',
    },
    price: 18900,
    originalPrice: 22500,
    categoryId: 'cat-sarees',
    categoryName: {
      en: 'Heritage Sarees',
      np: 'साडी संग्रह',
    },
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['Free Size'],
    sizeStock: {
      'Free Size': 6,
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 56,
    tags: ['Bridal', 'Silk Saree', 'Gold Zari', 'Festive'],
    fabric: {
      en: 'Pure Katan Silk with Metallic Gold Weave',
      np: 'शुद्ध कातान सिल्क तथा सुनौलो जरी बुनाइ',
    },
    origin: {
      en: 'Boutique Weavers, Kathmandu',
      np: 'काठमाडौँ बुटिक संग्रह',
    },
    isNewArrival: true,
    isFeatured: true,
  },
  {
    id: 'dawosti-04',
    slug: 'raw-silk-tussar-embroidered-kurti',
    title: {
      en: 'Raw Tussar Silk Hand-Embroidered Kurti',
      np: 'टसर सिल्क हाते-बुट्टा भएको आधुनिक कुर्ती',
    },
    description: {
      en: 'Natural texture Tussar raw silk in warm cream, adorned with maroon thread needlework along the neckline, paired with side slits for an effortless contemporary silhouette.',
      np: 'प्राकृतिक टसर सिल्कबाट निर्मित हल्का क्रिम रङको कुर्ती। घाँटीमा रातो मखमली धागोको हातको आकर्षक बुट्टा भएको आरामदायी आधुनिक पहिरन।',
    },
    price: 3650,
    originalPrice: 4200,
    categoryId: 'cat-kurthas',
    categoryName: {
      en: 'Kurthas & Sets',
      np: 'कुर्ता तथा सेटहरू',
    },
    images: [
      'https://images.unsplash.com/photo-1583391733975-00c2834b6e51?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1589810635657-232948472d98?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    sizeStock: {
      XS: 1,
      S: 3,
      M: 5,
      L: 2,
      XL: 0,
    },
    inStock: true,
    rating: 4.7,
    reviewCount: 29,
    tags: ['Daily Luxury', 'Office Wear', 'Tussar Silk'],
    fabric: {
      en: '100% Wild Tussar Silk',
      np: '१००% प्राकृतिक टसर सिल्क',
    },
    origin: {
      en: 'Dharan & Kathmandu, Nepal',
      np: 'धरान तथा काठमाडौँ',
    },
    isNewArrival: true,
    isFeatured: false,
  },
  {
    id: 'dawosti-05',
    slug: 'royal-maroon-zardozi-velvet-lehenga',
    title: {
      en: 'Royal Maroon Velvet Zardozi Lehenga',
      np: 'शाही मखमली जरदोजी लेहेंगा चोली सेट',
    },
    description: {
      en: 'Plush deep maroon micro-velvet kalidar skirt accented with hand-crafted dabka, kora, and sequin work. Complemented with a grand net dupatta and tailored velvet blouse.',
      np: 'गहिरो रातो मखमली कपडामा परम्परागत दबका, कोरा र सिताराको हस्तकला भएको आकर्षक लेहेंगा। सुनौलो किनारा भएको नेट पछ्यौरा र चोली सहित।',
    },
    price: 24500,
    originalPrice: 28000,
    categoryId: 'cat-lehengas',
    categoryName: {
      en: 'Bridal & Lehengas',
      np: 'लेहेंगा र विवाह पहिरन',
    },
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733975-00c2834b6e51?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    sizeStock: {
      S: 2,
      M: 3,
      L: 1,
      XL: 0,
    },
    inStock: true,
    rating: 5.0,
    reviewCount: 19,
    tags: ['Bridal', 'Velvet', 'Festive', 'Zardozi'],
    fabric: {
      en: 'Micro Velvet & Hand-dyed Silk Organza',
      np: 'माइक्रो भेलभेट र हातले रङ्गाइएको सिल्क ओर्गेन्जा',
    },
    origin: {
      en: 'Kathmandu Master Artisans',
      np: 'काठमाडौँका कुशल कारीगर',
    },
    isNewArrival: false,
    isFeatured: true,
  },
  {
    id: 'dawosti-06',
    slug: 'chiffon-floral-anarkali-suit-dupatta',
    title: {
      en: 'Flowing Chiffon Floral Anarkali Set',
      np: 'फ्लोरल शिफन अनारकली सुट तथा दोपट्टा',
    },
    description: {
      en: 'Airy floral printed pure chiffon 32-kali flared silhouette with delicate gota-patti border, churidar leggings, and a feather-soft printed dupatta with tasselled corners.',
      np: 'हल्का शिफन कपडामा फूलको मनमोहक प्रिन्ट र ३२ कली भएको लामो अनारकली। गोता-पट्टी किनारा, सुरुवाल र फुर्का भएको सुन्दर दोपट्टा।',
    },
    price: 5200,
    originalPrice: 6200,
    categoryId: 'cat-kurthas',
    categoryName: {
      en: 'Kurthas & Sets',
      np: 'कुर्ता तथा सेटहरू',
    },
    images: [
      'https://images.unsplash.com/photo-1589810635657-232948472d98?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    sizeStock: {
      XS: 4,
      S: 6,
      M: 5,
      L: 2,
      XL: 3,
    },
    inStock: true,
    rating: 4.8,
    reviewCount: 31,
    tags: ['Anarkali', 'Party Wear', 'Floral'],
    fabric: {
      en: 'Pure Viscose Chiffon with Butter Crepe Lining',
      np: 'शुद्ध भिस्कोस शिफन तथा बटर क्रेप अस्तर',
    },
    origin: {
      en: 'Pokhara & Kathmandu',
      np: 'पोखरा तथा काठमाडौँ',
    },
    isNewArrival: true,
    isFeatured: false,
  },
  {
    id: 'dawosti-07',
    slug: 'handloom-organic-cotton-daily-kurta',
    title: {
      en: 'Nepali Handloom Organic Cotton Daily Kurta',
      np: 'नेपाली हातेतान अग्र्यानिक सुती दैनिक कुर्ता',
    },
    description: {
      en: 'Breathable mountain cotton woven on traditional pit looms in western Nepal. Features wooden coconut-shell buttons, hidden dual side pockets, and relaxed straight cut.',
      np: 'परम्परागत हातेतानमा बुनिएको प्राकृतिक सुती कुर्ता। नरिवलको खबटाको प्राकृतिक टाँक, दुवैतिर भित्री खल्ती र दैनिक प्रयोगका लागि अत्यन्त आरामदायी डिजाइन।',
    },
    price: 2650,
    originalPrice: 3200,
    categoryId: 'cat-kurthas',
    categoryName: {
      en: 'Kurthas & Sets',
      np: 'कुर्ता तथा सेटहरू',
    },
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733975-00c2834b6e51?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    sizeStock: {
      S: 8,
      M: 10,
      L: 6,
      XL: 4,
    },
    inStock: true,
    rating: 4.6,
    reviewCount: 48,
    tags: ['Organic', 'Eco-friendly', 'Daily Wear', 'Handloom'],
    fabric: {
      en: '100% Organic Hand-spun Cotton',
      np: '१००% अग्र्यानिक हातेतान सुती',
    },
    origin: {
      en: 'Dang & Butwal, Nepal',
      np: 'दाङ तथा बुटवल, नेपाल',
    },
    isNewArrival: false,
    isFeatured: false,
  },
  {
    id: 'dawosti-08',
    slug: 'heritage-pashmina-fringed-jacquard-wrap',
    title: {
      en: 'Heritage Jacquard Pattern Pashmina Wrap',
      np: 'हेरिटेज ज्याकार्ड बुनाइ पश्मिना र्‍याप',
    },
    description: {
      en: 'Reversible dual-tone pashmina blend wrap featuring ancient Himalayan medallion patterns in warm gold and royal maroon, completed with hand-twisted fringed hems.',
      np: 'दुवैतर्फबाट ओढ्न मिल्ने सुनौलो र शाही रातो रङको ज्याकार्ड बुनाइ भएको पश्मिना र्‍याप। चिसो मौसम र साँझपखको औपचारिक जमघटका लागि सर्वोत्तम।',
    },
    price: 6900,
    originalPrice: 8500,
    categoryId: 'cat-pashmina',
    categoryName: {
      en: 'Chyangra Pashmina',
      np: 'च्याङ्ग्रा पश्मिना',
    },
    images: [
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['Free Size'],
    sizeStock: {
      'Free Size': 5,
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 27,
    tags: ['Pashmina', 'Jacquard', 'Winter Luxury', 'Reversible'],
    fabric: {
      en: '70% Himalayan Cashmere, 30% Mulberry Silk',
      np: '७०% हिमाली पश्मिना, ३०% मलबेरी सिल्क',
    },
    origin: {
      en: 'Kathmandu Valley Weavers',
      np: 'काठमाडौँ उपत्यका',
    },
    isNewArrival: true,
    isFeatured: true,
  },
  {
    id: 'dawosti-09',
    slug: 'mustang-raw-cashmere-travel-stole',
    title: {
      en: 'Mustang Pure Raw Cashmere Travel Stole',
      np: 'मुस्ताङ कच्चा पश्मिना ट्राभल स्टोल',
    },
    description: {
      en: 'Undyed natural cream Cashmere harvested ethically in Upper Mustang. Ultra-breathable, folds into compact pouch size, perfect for Himalayan travels.',
      np: 'माथिल्लो मुस्ताङबाट संकलित प्राकृतिक क्रिम रङको कच्चा पश्मिना। हलुका, न्यानो र यात्राका लागि सहजै झोलामा अटाउने विशेष स्टोल।',
    },
    price: 8800,
    originalPrice: 10500,
    categoryId: 'cat-pashmina',
    categoryName: {
      en: 'Chyangra Pashmina',
      np: 'च्याङ्ग्रा पश्मिना',
    },
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['Free Size'],
    sizeStock: {
      'Free Size': 8,
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 21,
    tags: ['Natural Wool', 'Eco', 'Mustang', 'Travel'],
    fabric: {
      en: '100% Unbleached Mountain Cashmere',
      np: '१००% प्राकृतिक नधोइएको हिमाली पश्मिना',
    },
    origin: {
      en: 'Lo Manthang, Mustang',
      np: 'लो मान्थाङ, मुस्ताङ',
    },
    isNewArrival: false,
    isFeatured: false,
  },
  {
    id: 'dawosti-10',
    slug: 'emerald-gold-festive-paithani-saree',
    title: {
      en: 'Emerald Gold Zari Festive Silk Saree',
      np: 'हरियो पन्ना सुनौलो जरी चाडपर्व साडी',
    },
    description: {
      en: 'Lustrous deep forest emerald silk with peacock-inspired golden pallu embroidery and gold foil butta all over the body. Includes running blouse fabric.',
      np: 'गहिरो हरियो सिल्क कपडामा मयूर बुट्टा र सुनौलो जरीले सजिएको चाडपर्व तथा विशेष पूजाका लागि उपयुक्त साडी।',
    },
    price: 14200,
    originalPrice: 16800,
    categoryId: 'cat-sarees',
    categoryName: {
      en: 'Heritage Sarees',
      np: 'साडी संग्रह',
    },
    images: [
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['Free Size'],
    sizeStock: {
      'Free Size': 3,
    },
    inStock: true,
    rating: 4.8,
    reviewCount: 34,
    tags: ['Zari', 'Teej Special', 'Festive Silk'],
    fabric: {
      en: 'Art Silk with Pure Metallic Weave',
      np: 'सिल्क तथा सुनौलो जरी बुनाइ',
    },
    origin: {
      en: 'Boutique Studios, Patan',
      np: 'पाटन, ललितपुर',
    },
    isNewArrival: true,
    isFeatured: false,
  },
  {
    id: 'dawosti-11',
    slug: 'champagne-organza-embroidered-saree',
    title: {
      en: 'Champagne Gold Hand-Cut Organza Saree',
      np: 'स्याम्पेन गोल्ड अर्गेन्जा कसीदा साडी',
    },
    description: {
      en: 'Sheer gossamer silk organza in subtle champagne gold with scalloped floral borders, hand-stitched pearl sequins, and lightweight drape.',
      np: 'हल्का सुनौलो स्याम्पेन रङको पातलो सिल्क अर्गेन्जा साडी। मोती र सिताराको मसिनो बुट्टा तथा आकर्षक कटवर्क किनारा भएको आधुनिक पहिरन।',
    },
    price: 11500,
    originalPrice: 13500,
    categoryId: 'cat-sarees',
    categoryName: {
      en: 'Heritage Sarees',
      np: 'साडी संग्रह',
    },
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733975-00c2834b6e51?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['Free Size'],
    sizeStock: {
      'Free Size': 7,
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 16,
    tags: ['Organza', 'Modern Drapes', 'Cocktail'],
    fabric: {
      en: '100% Silk Organza with Pearl Work',
      np: 'शुद्ध सिल्क अर्गेन्जा तथा मोती बुट्टा',
    },
    origin: {
      en: 'Kathmandu Couture',
      np: 'काठमाडौँ',
    },
    isNewArrival: false,
    isFeatured: true,
  },
  {
    id: 'dawosti-12',
    slug: 'crimson-gulab-embroidered-kali-lehenga',
    title: {
      en: 'Crimson Rose Embroidered Kali Lehenga',
      np: 'गुलाबी रातो बुट्टेदार कली लेहेंगा सेट',
    },
    description: {
      en: 'A 24-kali flared raw silk lehenga with Kashmiri tilla work along the hemline, heavy can-can attachment for majestic volume, and sweet-heart neckline blouse.',
      np: '२४ कली भएको प्राकृतिक सिल्क लेहेंगा। काश्मीरी तिल्ला बुट्टा, भित्र ठूलो क्यान-क्यान् घेरा र हातले सिलाइएको ब्लाउज सहितको आकर्षक सेट।',
    },
    price: 21800,
    originalPrice: 25000,
    categoryId: 'cat-lehengas',
    categoryName: {
      en: 'Bridal & Lehengas',
      np: 'लेहेंगा र विवाह पहिरन',
    },
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['XS', 'S', 'M', 'L'],
    sizeStock: {
      XS: 1,
      S: 3,
      M: 2,
      L: 0,
    },
    inStock: true,
    rating: 5.0,
    reviewCount: 22,
    tags: ['Wedding', 'Festive', 'CanCan Flare'],
    fabric: {
      en: 'Raw Silk Skirt with Silk Net Dupatta',
      np: 'प्राकृतिक सिल्क घेरा र सिल्क पछ्यौरा',
    },
    origin: {
      en: 'Kathmandu Artisans',
      np: 'काठमाडौँ',
    },
    isNewArrival: true,
    isFeatured: true,
  },
  {
    id: 'dawosti-13',
    slug: 'blush-pink-mirrorwork-party-lehenga',
    title: {
      en: 'Blush Pink Real Mirror-work Party Lehenga',
      np: 'हल्का गुलाबी ऐना बुट्टा भएको पार्टी लेहेंगा',
    },
    description: {
      en: 'Contemporary pastel blush organza embellished with genuine foil mirrors and thread work. Designed for sangeet nights, receptions, and family celebrations.',
      np: 'हल्का गुलाबी रङको पार्टी लेहेंगा। वास्तविक ऐना र धागोको मनमोहक बुट्टा भएको आधुनिक डिजाइन।',
    },
    price: 17500,
    originalPrice: 20000,
    categoryId: 'cat-lehengas',
    categoryName: {
      en: 'Bridal & Lehengas',
      np: 'लेहेंगा र विवाह पहिरन',
    },
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['S', 'M', 'L'],
    sizeStock: {
      S: 4,
      M: 3,
      L: 1,
    },
    inStock: true,
    rating: 4.8,
    reviewCount: 15,
    tags: ['Mirrorwork', 'Party Wear', 'Pastel'],
    fabric: {
      en: 'Georgette & Shimmer Organza',
      np: 'जर्जेट र सिमर अर्गेन्जा',
    },
    origin: {
      en: 'Boutique Kathmandu',
      np: 'काठमाडौँ',
    },
    isNewArrival: false,
    isFeatured: false,
  },
  {
    id: 'dawosti-14',
    slug: 'indigo-block-print-khadi-kurta-pants',
    title: {
      en: 'Hand-dyed Indigo Cotton Khadi Kurta Set',
      np: 'इन्डिगो प्राकृतिक रङको खादी कुर्ता सेट',
    },
    description: {
      en: 'Traditional wooden block printed botanical motifs using natural herbal indigo dye. Tailored straight cut kurta with tapered ankle pants and cotton scarf.',
      np: 'प्राकृतिक इन्डिगो रङ र काठको ठप्पाले छापिएको खादी कुर्ता सुरुवाल। गर्मी मौसम र कार्यालयका लागि शीतलता प्रदान गर्ने शुद्ध सुती पहिरन।',
    },
    price: 3200,
    originalPrice: 3800,
    categoryId: 'cat-kurthas',
    categoryName: {
      en: 'Kurthas & Sets',
      np: 'कुर्ता तथा सेटहरू',
    },
    images: [
      'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1583391733975-00c2834b6e51?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['XS', 'S', 'M', 'L', 'XL'],
    sizeStock: {
      XS: 3,
      S: 6,
      M: 8,
      L: 5,
      XL: 2,
    },
    inStock: true,
    rating: 4.7,
    reviewCount: 39,
    tags: ['Natural Indigo', 'Khadi', 'Breathable'],
    fabric: {
      en: '100% Handspun Khadi Cotton',
      np: '१००% हातेतान खादी सुती',
    },
    origin: {
      en: 'Chitwan & Kathmandu',
      np: 'चितवन तथा काठमाडौँ',
    },
    isNewArrival: false,
    isFeatured: false,
  },
  {
    id: 'dawosti-15',
    slug: 'royal-navy-maroon-silk-pashmina-wrap',
    title: {
      en: 'Dual Weave Navy & Maroon Silk Pashmina',
      np: 'नेभी निलो र मखमली रातो सिल्क पश्मिना',
    },
    description: {
      en: 'Dual-tone luxury Himalayan wrap that plays between midnight navy and regal maroon depending on light. Soft hand-brushed fringe finish.',
      np: 'प्रकाश अनुसार रङ बदलिने निलो र शाही रातो सिल्क पश्मिना दोसल्ला। औपचारिक समारोह र साँझको जमघटका लागि अत्यन्त गरिमामय।',
    },
    price: 7400,
    originalPrice: 8900,
    categoryId: 'cat-pashmina',
    categoryName: {
      en: 'Chyangra Pashmina',
      np: 'च्याङ्ग्रा पश्मिना',
    },
    images: [
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['Free Size'],
    sizeStock: {
      'Free Size': 6,
    },
    inStock: true,
    rating: 4.9,
    reviewCount: 18,
    tags: ['Dual Tone', 'Himalayan Luxury'],
    fabric: {
      en: '80% Chyangra Cashmere, 20% Mulberry Silk',
      np: '८०% च्याङ्ग्रा पश्मिना, २०% मलबेरी सिल्क',
    },
    origin: {
      en: 'Kathmandu valley',
      np: 'काठमाडौँ',
    },
    isNewArrival: false,
    isFeatured: false,
  },
  {
    id: 'dawosti-16',
    slug: 'mustang-amber-winter-pashmina-poncho',
    title: {
      en: 'Mustang Amber Cashmere Fringe Poncho',
      np: 'मुस्ताङ एम्बर कश्मीरी पोन्चो दोसल्ला',
    },
    description: {
      en: 'Open front tailored draped poncho crafted from thick mountain cashmere yarn in warm amber gold. Cozy neck collar and hand-knotted tassels.',
      np: 'अगाडि खुला भएको एम्बर सुनौलो रङको कश्मीरी पोन्चो। जाडो मौसममा कोट वा साडी माथि ओढ्न सहज र न्यानो।',
    },
    price: 9900,
    originalPrice: 11900,
    categoryId: 'cat-pashmina',
    categoryName: {
      en: 'Chyangra Pashmina',
      np: 'च्याङ्ग्रा पश्मिना',
    },
    images: [
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['Free Size'],
    sizeStock: {
      'Free Size': 3,
    },
    inStock: true,
    rating: 5.0,
    reviewCount: 12,
    tags: ['Poncho', 'Mustang Cashmere', 'Winter'],
    fabric: {
      en: '100% Himalayan Chyangra Cashmere',
      np: '१००% हिमाली च्याङ्ग्रा पश्मिना',
    },
    origin: {
      en: 'Mustang, Nepal',
      np: 'मुस्ताङ, नेपाल',
    },
    isNewArrival: true,
    isFeatured: false,
  },
  {
    id: 'dawosti-17',
    slug: 'swarna-mahal-royal-24k-zari-bridal-lehenga',
    title: {
      en: 'Swarna Mahal 24K Gold Zari Royal Bridal Lehenga',
      np: 'स्वर्ण महल २४ क्यारेट जरी शाही विवाह लेहेंगा',
    },
    description: {
      en: 'Couture bridal masterpiece featuring authentic 24-carat pure gold zari hand-embroidery on royal crimson mulberry silk velvet. Embellished with Newari peacock motifs and heritage craftsmanship.',
      np: 'शुद्ध रेशमी मखमली कपडामा २४ क्यारेट सुनको जरी र हातको परम्परागत मयूर बुट्टाले सजिएको शाही विवाह लेहेंगा। विशेष दुलही पहिरन।',
    },
    price: 50000,
    originalPrice: 58000,
    categoryId: 'cat-lehengas',
    categoryName: {
      en: 'Bridal & Lehengas',
      np: 'लेहेंगा र विवाह पहिरन',
    },
    images: [
      'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ],
    availableSizes: ['S', 'M', 'L', 'XL'],
    sizeStock: {
      S: 1,
      M: 2,
      L: 1,
      XL: 1,
    },
    inStock: true,
    rating: 5.0,
    reviewCount: 42,
    tags: ['Bridal', '24K Gold Zari', 'Velvet', 'Royal Couture'],
    fabric: {
      en: 'Mulberry Silk Velvet with Pure Gold Zari & Dabka',
      np: 'मलबेरी सिल्क भेलभेट र सुनौलो जरी दबका',
    },
    origin: {
      en: 'Kathmandu Royal Atelier',
      np: 'काठमाडौँ शाही बुटिक',
    },
    isNewArrival: true,
    isFeatured: true,
  },
];

// Default Official Fonepay Static QR Image (crisp standalone merchant standee SVG)
export const DEFAULT_STATIC_FONEPAY_QR_SVG = `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="520" viewBox="0 0 400 520"><rect width="400" height="520" fill="%23fdfcf9" rx="20"/><rect x="15" y="15" width="370" height="490" fill="%23ffffff" stroke="%23eadcce" stroke-width="2" rx="16"/><path d="M 15 15 L 385 15 A 16 16 0 0 1 385 85 L 15 85 Z" fill="%23D92525"/><circle cx="50" cy="50" r="22" fill="%23ffffff"/><text x="50" y="55" font-family="sans-serif" font-weight="900" font-size="14" fill="%23D92525" text-anchor="middle">fone</text><text x="85" y="44" font-family="sans-serif" font-weight="800" font-size="16" fill="%23ffffff">FONEPAY MERCHANT QR</text><text x="85" y="62" font-family="sans-serif" font-size="11" fill="%23ffcccc">DAWOSTI KATHMANDU BOUTIQUE</text><rect x="50" y="105" width="300" height="300" fill="%23ffffff" stroke="%23D92525" stroke-width="3" rx="12"/><rect x="70" y="125" width="56" height="56" fill="%23D92525" rx="6"/><rect x="80" y="135" width="36" height="36" fill="%23ffffff" rx="3"/><rect x="88" y="143" width="20" height="20" fill="%23D92525" rx="2"/><rect x="274" y="125" width="56" height="56" fill="%23D92525" rx="6"/><rect x="284" y="135" width="36" height="36" fill="%23ffffff" rx="3"/><rect x="292" y="143" width="20" height="20" fill="%23D92525" rx="2"/><rect x="70" y="329" width="56" height="56" fill="%23D92525" rx="6"/><rect x="80" y="339" width="36" height="36" fill="%23ffffff" rx="3"/><rect x="88" y="347" width="20" height="20" fill="%23D92525" rx="2"/><g fill="%232B1810"><rect x="140" y="130" width="12" height="12" rx="2"/><rect x="160" y="130" width="20" height="12" rx="2"/><rect x="190" y="130" width="12" height="12" rx="2"/><rect x="210" y="130" width="24" height="12" rx="2"/><rect x="245" y="130" width="14" height="12" rx="2"/><rect x="135" y="150" width="18" height="12" rx="2"/><rect x="165" y="150" width="12" height="12" rx="2"/><rect x="185" y="150" width="28" height="12" rx="2"/><rect x="225" y="150" width="14" height="12" rx="2"/><rect x="250" y="150" width="12" height="12" rx="2"/><rect x="70" y="200" width="24" height="12" rx="2"/><rect x="105" y="200" width="14" height="12" rx="2"/><rect x="130" y="200" width="28" height="12" rx="2"/><rect x="170" y="200" width="16" height="12" rx="2"/><rect x="215" y="200" width="20" height="12" rx="2"/><rect x="245" y="200" width="28" height="12" rx="2"/><rect x="285" y="200" width="20" height="12" rx="2"/><rect x="315" y="200" width="15" height="12" rx="2"/><rect x="70" y="225" width="14" height="12" rx="2"/><rect x="95" y="225" width="30" height="12" rx="2"/><rect x="135" y="225" width="18" height="12" rx="2"/><rect x="245" y="225" width="24" height="12" rx="2"/><rect x="280" y="225" width="16" height="12" rx="2"/><rect x="305" y="225" width="25" height="12" rx="2"/><rect x="70" y="250" width="28" height="12" rx="2"/><rect x="110" y="250" width="14" height="12" rx="2"/><rect x="135" y="250" width="22" height="12" rx="2"/><rect x="240" y="250" width="15" height="12" rx="2"/><rect x="265" y="250" width="28" height="12" rx="2"/><rect x="305" y="250" width="25" height="12" rx="2"/><rect x="70" y="275" width="16" height="12" rx="2"/><rect x="95" y="275" width="24" height="12" rx="2"/><rect x="130" y="275" width="14" height="12" rx="2"/><rect x="175" y="275" width="28" height="12" rx="2"/><rect x="215" y="275" width="15" height="12" rx="2"/><rect x="240" y="275" width="30" height="12" rx="2"/><rect x="280" y="275" width="18" height="12" rx="2"/><rect x="310" y="275" width="20" height="12" rx="2"/><rect x="70" y="300" width="20" height="12" rx="2"/><rect x="100" y="300" width="20" height="12" rx="2"/><rect x="135" y="300" width="25" height="12" rx="2"/><rect x="170" y="300" width="18" height="12" rx="2"/><rect x="200" y="300" width="24" height="12" rx="2"/><rect x="235" y="300" width="16" height="12" rx="2"/><rect x="260" y="300" width="25" height="12" rx="2"/><rect x="295" y="300" width="35" height="12" rx="2"/><rect x="140" y="330" width="18" height="12" rx="2"/><rect x="170" y="330" width="25" height="12" rx="2"/><rect x="210" y="330" width="30" height="12" rx="2"/><rect x="250" y="330" width="18" height="12" rx="2"/><rect x="280" y="330" width="25" height="12" rx="2"/><rect x="315" y="330" width="15" height="12" rx="2"/><rect x="140" y="355" width="28" height="12" rx="2"/><rect x="180" y="355" width="18" height="12" rx="2"/><rect x="210" y="355" width="22" height="12" rx="2"/><rect x="245" y="355" width="28" height="12" rx="2"/><rect x="285" y="355" width="18" height="12" rx="2"/><rect x="315" y="355" width="15" height="12" rx="2"/><rect x="140" y="375" width="20" height="12" rx="2"/><rect x="170" y="375" width="32" height="12" rx="2"/><rect x="215" y="375" width="15" height="12" rx="2"/><rect x="240" y="375" width="25" height="12" rx="2"/><rect x="275" y="375" width="20" height="12" rx="2"/><rect x="305" y="375" width="25" height="12" rx="2"/></g><circle cx="200" cy="240" r="28" fill="%23ffffff" stroke="%23D92525" stroke-width="3"/><circle cx="200" cy="240" r="24" fill="%23D92525"/><text x="200" y="246" font-family="sans-serif" font-weight="900" font-size="13" fill="%23ffffff" text-anchor="middle">DAWOSTI</text><text x="200" y="430" font-family="sans-serif" font-weight="700" font-size="13" fill="%238B3A3A" text-anchor="middle">PAN: 609124819 | NIC ASIA BANK</text><text x="200" y="450" font-family="sans-serif" font-size="11" fill="%236B564C" text-anchor="middle">A/C: 0192847192837001 (Dawosti Fashion)</text><text x="200" y="480" font-family="sans-serif" font-weight="600" font-size="10" fill="%2394a3b8" text-anchor="middle">Scan via any Nepali Mobile Banking / eSewa / Khalti</text></svg>`;

export const defaultMerchantSettings: MerchantSettings = {
  useStaticQrByDefault: false,
  staticQrImage: DEFAULT_STATIC_FONEPAY_QR_SVG,
  merchantName: 'DAWOSTI KATHMANDU BOUTIQUE',
  merchantPan: '609124819',
  merchantPhone: '+977 9708251494',
  bankName: 'NIC Asia Bank Ltd.',
  accountNumber: '0192847192837001',
  qrInstructionsEn: 'Scan this official Merchant QR via any Nepali bank mobile banking app (NIC Asia, Nabil, Global IME, Everest, Sanima, eSewa, Khalti), enter the exact bill amount, and attach your reference ID & receipt screenshot.',
  qrInstructionsNp: 'कुनै पनि नेपाली बैंकको मोबाइल बैंकिङ (एनआईसी एशिया, नबिल, ग्लोबल आईएमई, ईसेवा, खल्ती) बाट यो आधिकारिक मर्चेन्ट QR स्क्यान गरी ठीक रकम भुक्तानी गर्नुहोस् र प्राप्त बिलको स्क्रिनसट तल अपलोड गर्नुहोस्।',
};

export const defaultSiteContent: SiteContentConfig = {
  storeName: 'DAWOSTI',
  storeTagline: {
    en: "Women's Fashion Nepal",
    np: 'नेपाली नारी फेसन बुटिक',
  },
  announcementText: {
    en: 'Free Delivery on orders over NPR 3,000 across Nepal | Use code DAWOSTI10 for 10% OFF',
    np: 'रु ३,००० भन्दा माथिका सबै अर्डरमा नेपालभर निःशुल्क डेलिभरी | कोड DAWOSTI10 प्रयोग गरी १०% छुट पाउनुहोस्',
  },
  offerCode: 'DAWOSTI10',
  heroBadge: {
    en: 'Authentic Nepali Women’s Heritage Fashion',
    np: 'नेपालको मौलिक नारी फेसन तथा हस्तकला',
  },
  heroTitle: {
    en: 'Regal Himalayan Heritage, Modern Grace.',
    np: 'परम्पराको राजसी चमक, आधुनिक सौन्दर्य।',
  },
  heroSubtitle: {
    en: 'Hand-woven heritage silks, Mustang Chyangra Cashmere, royal crimson bridal sarees, and tailored kurthas designed for celebrations and everyday grace.',
    np: 'हातले बुनेको मौलिक रेशम, मुस्ताङको १००% शुद्ध च्याङ्ग्रा पश्मिना, शाही बनारसी साडी र चाडपर्वका आकर्षक लेहेंगाहरूको विशेष संग्रह।',
  },
  heroExploreBtn: {
    en: 'Explore Collections',
    np: 'संग्रह अवलोकन गर्नुहोस्',
  },
  pashminaBtn: {
    en: 'Chyangra Pashmina',
    np: 'च्याङ्ग्रा पश्मिना',
  },
  trustPillars: [
    {
      id: 'pillar-1',
      iconName: 'Sparkles',
      title: {
        en: 'Artisan Handloom Silks',
        np: 'मौलिक रेशम तथा शिल्पकला',
      },
      desc: {
        en: 'Handcrafted on traditional wooden looms by experienced women artisans in Nepal.',
        np: 'नेपालका अनुभवी महिला शिल्पीहरूद्वारा परम्परागत काठेतानमा बुनिएको।',
      },
    },
    {
      id: 'pillar-2',
      iconName: 'ShieldCheck',
      title: {
        en: '100% Chyangra Cashmere',
        np: '१००% शुद्ध च्याङ्ग्रा पश्मिना',
      },
      desc: {
        en: 'Certified Himalayan high-altitude wool, ultra-soft, warm, and featherweight.',
        np: 'मुस्ताङका हिमाली च्याङ्ग्राबाट संकलित शुद्ध, हलुका र न्यानो पश्मिना।',
      },
    },
    {
      id: 'pillar-3',
      iconName: 'Truck',
      title: {
        en: '77 Districts Doorstep Delivery',
        np: '७७ जिल्लामा घरदैलो डेलिभरी',
      },
      desc: {
        en: 'Fast express courier with Cash on Delivery (COD) everywhere in Nepal.',
        np: 'काठमाडौँ उपत्यका सहित नेपालका सबै ७७ जिल्लामा घरदैलो क्यास अन डेलिभरी।',
      },
    },
    {
      id: 'pillar-4',
      iconName: 'HeartHandshake',
      title: {
        en: 'Kathmandu Studio Guarantee',
        np: 'काठमाडौँ बुटिक ग्यारेन्टी',
      },
      desc: {
        en: '100% Quality inspection, bespoke size alterations, and dedicated stylist support.',
        np: 'गुणस्तर प्रमाणीकरण, साइज मिलाउने सेवा तथा काठमाडौँ बुटिकबाट प्रत्यक्ष सहयोग।',
      },
    },
  ],
  footerAbout: {
    en: 'Dawosti celebrates the timeless grace of Nepali women through pure handwoven silks, Himalayan cashmere, and festive ethnic drapes.',
    np: 'दावोस्तीले शुद्ध हातेतान रेशम, हिमाली च्याङ्ग्रा पश्मिना तथा चाडपर्वका परम्परागत पहिरनमार्फत नेपाली नारीको अनुपम सौन्दर्यलाई सम्मान गर्दछ।',
  },
  carePolicy: {
    en: 'Care & Fit Assistance: Our Kathmandu atelier provides doorstep size alterations, fabric care guidelines, and responsive customer styling support.',
    np: 'हेरचाह तथा साइज सहयोग: हाम्रो काठमाडौँ बुटिकले साइज मिलाउने सेवा, कपडाको उचित हेरचाह र प्रत्यक्ष ग्राहक सेवा प्रदान गर्दछ।',
  },
  deliveryTimeNote: {
    en: 'Kathmandu (within 24 hours) | Other 77 Districts (2 to 4 days)',
    np: 'काठमाडौँ उपत्यकामा २४ घण्टाभित्र | अन्य जिल्लामा २ देखि ४ दिनमा डेलिभरी',
  },
};

export const defaultThemeSettings: ThemeSettings = {
  activePreset: 'dashain',
  isDashainTheme: true,
  dashainBannerEnabled: true,
  discountPercentage: 15,
  dashainDiscountPercent: 15,
  couponCode: 'DASHAIN15',
  dashainDiscountCode: 'DASHAIN15',
  bannerText: {
    en: '🇳🇵 Dashain Bada Mahotsav Offer: Flat 15% OFF on all Festive Silks & Sarees! Use Code: DASHAIN15',
    np: '🇳🇵 बडा दशैँ विशेष महाधमाका: सबै सिल्क, कुर्ता र साडीमा सिधै १५% छुट! कुपन: DASHAIN15',
  },
  dashainOfferText: {
    en: '🇳🇵 Dashain Bada Mahotsav Offer: Flat 15% OFF on all Festive Silks & Sarees! Use Code: DASHAIN15',
    np: '🇳🇵 बडा दशैँ विशेष महाधमाका: सबै सिल्क, कुर्ता र साडीमा सिधै १५% छुट! कुपन: DASHAIN15',
  },
  accentColor: '#8B3A3A',
};

export const defaultInitialOrdersLog: Order[] = [];

