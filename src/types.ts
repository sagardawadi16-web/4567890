/**
 * Dawosti - Women's Fashion Nepal
 * TypeScript Definitions
 * 
 * Strict type definitions without 'any'.
 */

export type Language = 'en' | 'np';

export type ProductSize = 'XS' | 'S' | 'M' | 'L' | 'XL' | 'XXL' | 'Free Size';

export interface LocalizedString {
  en: string;
  np: string;
}

export interface Category {
  id: string;
  slug: string;
  name: LocalizedString;
  description?: LocalizedString;
  image?: string;
  productCount?: number;
}

export interface Product {
  id: string;
  slug: string;
  title: LocalizedString;
  description: LocalizedString;
  price: number; // in Nepalese Rupee (NPR)
  originalPrice?: number;
  categoryId: string;
  categoryName: LocalizedString;
  images: string[];
  availableSizes: ProductSize[];
  sizeStock?: Partial<Record<ProductSize, number>>;
  inStock: boolean;
  rating: number;
  reviewCount: number;
  tags: string[];
  fabric?: LocalizedString;
  origin?: LocalizedString;
  isNewArrival?: boolean;
  isFeatured?: boolean;
}

export interface CartItem {
  product: Product;
  selectedSize: ProductSize;
  quantity: number;
  addedAt: string;
}

export interface PriceRange {
  min: number;
  max: number;
}

export type SortOption = 'featured' | 'price-low' | 'price-high' | 'rating' | 'newest';

export interface FilterState {
  categorySlug: string;
  priceRange: PriceRange;
  selectedSize: ProductSize | 'ALL';
  sortBy: SortOption;
  inStockOnly: boolean;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email?: string;
  alternatePhone?: string;
  addressLine: string;
  city: string;
  province: string;
  postalCode?: string;
}

export type PaymentMethod = 'cod' | 'esewa' | 'khalti' | 'fonepay';
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'preparing' | 'shipped' | 'out-for-delivery' | 'delivered' | 'cancelled';
export type PageView = 'home' | 'checkout' | 'order-confirmation';

export interface EsewaPayload {
  amt: number;
  psc: number;
  pdc: number;
  txAmt: number;
  tAmt: number;
  pid: string;
  scd: string;
  su: string;
  fu: string;
}

export interface KhaltiPaymentResult {
  idx: string;
  token: string;
  mobile: string;
  amount: number;
}

export interface FonepayProof {
  referenceId: string;
  screenshotUrl?: string;
  screenshotName?: string;
  payerBank?: string;
  uploadedAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  subtotalAmount: number;
  discountAmount: number;
  deliveryFee: number;
  totalAmount: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: OrderStatus;
  createdAt: string;
  notes?: string;
  courierName?: string;
  courierPartner?: string;
  trackingNumber?: string;
  packagingStatus?: string;
  dispatchDate?: string;
  logisticsNotes?: string;
  acknowledgedByAdmin?: boolean;
  customerLoginName?: string;
  paymentDetails?: {
    transactionId?: string;
    esewaPid?: string;
    khaltiToken?: string;
    fonepayProof?: FonepayProof;
    paidAt?: string;
  };
}

export interface ThemeColors {
  primary: string; // #8B3A3A (Maroon)
  primaryHover: string;
  primaryDark: string;
  accent: string; // #D4AF37 (Gold)
  accentHover: string;
  accentLight: string;
  creamBackground: string; // #FFF8F0 (Cream)
  surface: string;
  surfaceMuted: string;
  textPrimary: string;
  textSecondary: string;
  border: string;
}

export interface TypographyTokens {
  fontFamilySerif: string;
  fontFamilySans: string;
  fontFamilyDevanagari: string;
  sizes: {
    xs: string;
    sm: string;
    base: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
    '4xl': string;
  };
  weights: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
}

export interface SpacingTokens {
  xs: string;
  sm: string;
  md: string;
  lg: string;
  xl: string;
  '2xl': string;
  '3xl': string;
}

export interface ThemeConfig {
  name: string;
  colors: ThemeColors;
  typography: TypographyTokens;
  spacing: SpacingTokens;
}

export interface SearchFilterState {
  query: string;
  selectedCategory: string | null;
  selectedSize: ProductSize | null;
  sortBy: 'featured' | 'price-low' | 'price-high' | 'rating';
}

export interface MerchantSettings {
  useStaticQrByDefault: boolean;
  staticQrImage: string; // URL or base64 data URI
  merchantName: string;
  merchantPan: string;
  merchantPhone: string;
  bankName: string;
  accountNumber: string;
  qrInstructionsEn: string;
  qrInstructionsNp: string;
}

export interface TrustPillarContent {
  id: string;
  iconName: 'Sparkles' | 'ShieldCheck' | 'Truck' | 'HeartHandshake' | 'MapPin' | 'RefreshCw';
  title: LocalizedString;
  desc: LocalizedString;
}

export interface SiteContentConfig {
  storeName?: string;
  storeTagline?: LocalizedString;
  announcementText: LocalizedString;
  offerCode: string;
  heroBadge: LocalizedString;
  heroTitle: LocalizedString;
  heroSubtitle: LocalizedString;
  heroExploreBtn: LocalizedString;
  pashminaBtn: LocalizedString;
  trustPillars: TrustPillarContent[];
  footerAbout: LocalizedString;
  carePolicy: LocalizedString;
  deliveryTimeNote: LocalizedString;
}

export type ThemePreset = 'dashain' | 'heritage' | 'tihar' | 'minimal';

export interface ThemeSettings {
  activePreset?: ThemePreset;
  isDashainTheme: boolean;
  dashainBannerEnabled?: boolean;
  discountPercentage: number;
  dashainDiscountPercent?: number;
  couponCode: string;
  dashainDiscountCode?: string;
  bannerText: LocalizedString;
  dashainOfferText?: LocalizedString;
  accentColor?: string;
}

export interface GoogleUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isLoggedIn: boolean;
}

export interface AdminSecuritySettings {
  requirePasscode: boolean;
  passcode: string;
}

export interface RecentPurchaseNotificationItem {
  id: string;
  customerName: string;
  city: string;
  productName: string;
  productImage: string;
  price: number;
  timeAgo: string;
  isSelf?: boolean;
  orderNumber?: string;
}

export type FrontpageDisplayMode = 'curated' | 'catalog';

export interface MaintenanceSettings {
  isMaintenanceActive: boolean; // Full maintenance mode: Stop what you are doing
  warning10MinActive: boolean; // 10-minute warning alert
  warningTargetTime?: number; // Target timestamp in milliseconds when maintenance starts
  warningDurationMinutes: number; // Duration in minutes (default 10)
  messageEn?: string;
  messageNp?: string;
  emergencyPhone: string; // '9708251494'
  lastUpdatedBy: string; // e.g. 'Head Admin' or agent ID
  lastUpdatedAt: string;
}

export interface CrossAgentSyncMessage {
  type: 'MAINTENANCE_CHANGE' | 'SETTINGS_CHANGE' | 'PRODUCTS_CHANGE' | 'FORCE_RELOAD' | 'PING';
  senderId: string;
  senderRole: 'head_admin' | 'independent_admin' | 'customer';
  timestamp: number;
  data?: any;
}

export interface EmailSubscriber {
  id: string;
  email: string;
  name?: string;
  subscribedAt: string;
  source: 'footer' | 'checkout' | 'banner' | 'admin_manual';
  status: 'active' | 'unsubscribed';
}

export interface EmailCampaign {
  id: string;
  subject: string;
  productId: string;
  productName: string;
  productBio: string;
  productPrice: number;
  productImageUrl?: string;
  sentAt: string;
  recipientCount: number;
  recipients: string[];
  status: 'sent' | 'simulated';
  bodyText: string;
}

