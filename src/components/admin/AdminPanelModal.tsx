import React, { useState, useRef } from 'react';
import { useShopStore } from '../../store/shopStore';
import {
  X,
  QrCode,
  Edit3,
  Upload,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  Building,
  CreditCard,
  Phone,
  FileText,
  Search,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Eye,
  Plus,
  Trash2,
  Image as ImageIcon,
  Lock,
  Unlock,
  KeyRound,
  Layers,
  Star,
  Tag,
  FileCode,
  Download,
  Copy,
} from 'lucide-react';
import { Product, ProductSize } from '../../types';
import { DEFAULT_STATIC_FONEPAY_QR_SVG } from '../../store/mockData';

type AdminTab = 'catalog' | 'qr' | 'content' | 'security' | 'direct-paste';

export const AdminPanelModal: React.FC = () => {
  const {
    isAdminOpen,
    setIsAdminOpen,
    language,
    products,
    categories,
    addProduct,
    updateProduct,
    deleteProduct,
    resetProductsToDefault,
    merchantSettings,
    updateMerchantSettings,
    resetMerchantSettings,
    siteContent,
    updateSiteContent,
    resetSiteContent,
    adminSecuritySettings,
    updateAdminSecuritySettings,
    isAdminAuthenticated,
    unlockAdmin,
    lockAdmin,
    formatPrice,
  } = useShopStore();

  const [activeTab, setActiveTab] = useState<AdminTab>('catalog');
  const [enteredPin, setEnteredPin] = useState('');
  const [pinError, setPinError] = useState<string | null>(null);

  const [saveSuccessNotice, setSaveSuccessNotice] = useState<string | null>(null);
  const [searchFilter, setSearchFilter] = useState('');
  const [catalogSearch, setCatalogSearch] = useState('');

  // QR Image uploads
  const [qrImageUrlInput, setQrImageUrlInput] = useState('');
  const qrFileInputRef = useRef<HTMLInputElement>(null);

  // Security tab state
  const [newPinInput, setNewPinInput] = useState(adminSecuritySettings.passcode);

  // Catalog Creator / Editor state
  const [editingProductId, setEditingProductId] = useState<string | null>(null);
  const [isCreatingNew, setIsCreatingNew] = useState<boolean>(false);

  // Form fields for product creation/editing
  const [productTitleEn, setProductTitleEn] = useState('');
  const [productTitleNp, setProductTitleNp] = useState('');
  const [productDescEn, setProductDescEn] = useState('');
  const [productDescNp, setProductDescNp] = useState('');
  const [productPrice, setProductPrice] = useState<number>(4500);
  const [productOriginalPrice, setProductOriginalPrice] = useState<number>(5500);
  const [productCategory, setProductCategory] = useState<string>('cat-kurthas');
  const [productFabricEn, setProductFabricEn] = useState('Pure Handloom Silk');
  const [productFabricNp, setProductFabricNp] = useState('शुद्ध हातेतान सिल्क');
  const [productOriginEn, setProductOriginEn] = useState('Kathmandu Atelier, Nepal');
  const [productOriginNp, setProductOriginNp] = useState('काठमाडौँ, नेपाल');
  const [productIsNew, setProductIsNew] = useState<boolean>(true);
  const [productIsFeatured, setProductIsFeatured] = useState<boolean>(false);

  // Multiple Photos state
  const [productImages, setProductImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');
  const productFileInputRef = useRef<HTMLInputElement>(null);

  // Direct JSON & Node.js File Paste state
  const [jsonPasteInput, setJsonPasteInput] = useState('');
  const [jsonImportError, setJsonImportError] = useState<string | null>(null);
  const jsonFileInputRef = useRef<HTMLInputElement>(null);

  const sampleProductSnippet = `[
  {
    "id": "dawosti-custom-${Date.now()}",
    "slug": "heritage-silk-kurtha-set",
    "title": {
      "en": "Crimson Heritage Silk Kurtha Set",
      "np": "रातो मौलिक सिल्क कुर्ता सेट"
    },
    "description": {
      "en": "Handcrafted pure silk kurtha with intricate gold zari threadwork, tailored for festive moments.",
      "np": "मौलिक शुद्ध सिल्क र सुनौलो जरी बुट्टाले सजिएको आकर्षक नेपाली फेसन।"
    },
    "price": 5400,
    "originalPrice": 6500,
    "categoryId": "cat-kurthas",
    "categoryName": {
      "en": "Kurthas & Sets",
      "np": "कुर्ता तथा सेट"
    },
    "images": [
      "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80"
    ],
    "availableSizes": ["S", "M", "L", "XL"],
    "inStock": true,
    "rating": 4.9,
    "reviewCount": 24,
    "tags": ["kurtha", "handloom", "silk"],
    "fabric": { "en": "Mulberry Silk", "np": "मलबेरी सिल्क" },
    "origin": { "en": "Kathmandu, Nepal", "np": "काठमाडौँ, नेपाल" },
    "isNewArrival": true,
    "isFeatured": true
  }
]`;

  const handleLoadSampleJson = () => {
    setJsonPasteInput(sampleProductSnippet);
    setJsonImportError(null);
  };

  const handleImportJson = () => {
    if (!jsonPasteInput.trim()) {
      setJsonImportError('Please paste valid JSON data or array of products.');
      return;
    }

    try {
      const parsed = JSON.parse(jsonPasteInput.trim());
      let itemsToAdd: Product[] = [];

      if (Array.isArray(parsed)) {
        itemsToAdd = parsed;
      } else if (typeof parsed === 'object' && parsed !== null) {
        itemsToAdd = [parsed as Product];
      }

      if (itemsToAdd.length === 0) {
        setJsonImportError('JSON parsed but contained no product items.');
        return;
      }

      itemsToAdd.forEach((item) => {
        if (!item.id) item.id = `dawosti-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
        if (!item.title || !item.title.en) {
          throw new Error('Each product must have at least title.en');
        }
        if (!item.price) item.price = 3500;
        if (!item.images || !Array.isArray(item.images) || item.images.length === 0) {
          item.images = ['https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'];
        }
        if (!item.availableSizes) item.availableSizes = ['Free Size'];
        addProduct(item);
      });

      setJsonPasteInput('');
      setJsonImportError(null);
      showToast(`Successfully imported ${itemsToAdd.length} product(s) to store!`);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : 'Invalid JSON format';
      setJsonImportError(`Error parsing JSON: ${errorMsg}`);
    }
  };

  const handleJsonFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      if (text) {
        setJsonPasteInput(text);
        setJsonImportError(null);
        showToast('JSON file loaded into editor! Click "Import to Store" to apply.');
      }
    };
    reader.readAsText(file);
  };

  const handleExportJson = () => {
    const jsonStr = JSON.stringify(products, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `dawosti_catalog_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported store catalog as JSON file!');
  };

  // Sizes and stock counts
  const allAvailableSizes: ProductSize[] = ['XS', 'S', 'M', 'L', 'XL', 'Free Size'];
  const [selectedSizes, setSelectedSizes] = useState<ProductSize[]>(['S', 'M', 'L']);
  const [sizeStock, setSizeStock] = useState<Partial<Record<ProductSize, number>>>({
    S: 5,
    M: 8,
    L: 4,
  });

  if (!isAdminOpen) return null;

  const showToast = (msg: string) => {
    setSaveSuccessNotice(msg);
    setTimeout(() => {
      setSaveSuccessNotice(null);
    }, 3200);
  };

  // Unlock Admin handler
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockAdmin(enteredPin);
    if (success) {
      setPinError(null);
      setEnteredPin('');
      showToast('Merchant Access Granted');
    } else {
      setPinError('Incorrect Passcode. Try default: 1234');
    }
  };

  // Prepopulate form to edit existing product
  const handleStartEditProduct = (prod: Product) => {
    setEditingProductId(prod.id);
    setIsCreatingNew(true);
    setProductTitleEn(prod.title.en);
    setProductTitleNp(prod.title.np);
    setProductDescEn(prod.description.en);
    setProductDescNp(prod.description.np);
    setProductPrice(prod.price);
    setProductOriginalPrice(prod.originalPrice || Math.round(prod.price * 1.2));
    setProductCategory(prod.categoryId);
    setProductFabricEn(prod.fabric?.en || 'Authentic Silk');
    setProductFabricNp(prod.fabric?.np || 'मौलिक सिल्क');
    setProductOriginEn(prod.origin?.en || 'Kathmandu, Nepal');
    setProductOriginNp(prod.origin?.np || 'काठमाडौँ, नेपाल');
    setProductIsNew(!!prod.isNewArrival);
    setProductIsFeatured(!!prod.isFeatured);
    setProductImages(prod.images.length > 0 ? [...prod.images] : []);
    setSelectedSizes([...prod.availableSizes]);
    setSizeStock(prod.sizeStock || {});
  };

  // Reset form for creating fresh product
  const handleStartNewProduct = () => {
    setEditingProductId(null);
    setIsCreatingNew(true);
    setProductTitleEn('');
    setProductTitleNp('');
    setProductDescEn('');
    setProductDescNp('');
    setProductPrice(4500);
    setProductOriginalPrice(5500);
    setProductCategory('cat-kurthas');
    setProductFabricEn('Pure Mulberry Silk & Handloom Cotton');
    setProductFabricNp('शुद्ध मलबेरी सिल्क तथा हातेतान सुती');
    setProductOriginEn('Kathmandu Atelier, Nepal');
    setProductOriginNp('काठमाडौँ, नेपाल');
    setProductIsNew(true);
    setProductIsFeatured(false);
    setProductImages([
      'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
    ]);
    setSelectedSizes(['S', 'M', 'L']);
    setSizeStock({ S: 5, M: 8, L: 4 });
  };

  // Handle multiple product photo uploads from local disk
  const handleMultipleImageFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileList = Array.from(files);
    let loadedCount = 0;
    const newBase64Images: string[] = [];

    fileList.forEach((file) => {
      if (!file.type.startsWith('image/')) return;
      const reader = new FileReader();
      reader.onload = (event) => {
        const res = event.target?.result as string;
        if (res) {
          newBase64Images.push(res);
        }
        loadedCount++;
        if (loadedCount === fileList.length) {
          setProductImages((prev) => [...prev, ...newBase64Images]);
          showToast(`Added ${newBase64Images.length} photos!`);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const handleAddImageUrl = () => {
    if (!newImageUrl.trim()) return;
    setProductImages((prev) => [...prev, newImageUrl.trim()]);
    setNewImageUrl('');
    showToast('Photo URL added to gallery!');
  };

  const handleRemovePhoto = (index: number) => {
    setProductImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMakePrimaryPhoto = (index: number) => {
    setProductImages((prev) => {
      const copy = [...prev];
      const [item] = copy.splice(index, 1);
      return [item, ...copy];
    });
    showToast('Updated primary thumbnail photo!');
  };

  // Save product (New or Edit)
  const handleSaveProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!productTitleEn.trim()) {
      alert('Please enter a product title in English');
      return;
    }

    const matchedCat = categories.find((c) => c.id === productCategory);
    const categoryName = matchedCat
      ? matchedCat.name
      : { en: 'Handloom Atelier', np: 'हातेतान पहिरन' };

    const productPayload: Product = {
      id: editingProductId || `dawosti-custom-${Date.now()}`,
      slug: (productTitleEn || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)/g, ''),
      title: {
        en: productTitleEn.trim(),
        np: productTitleNp.trim() || productTitleEn.trim(),
      },
      description: {
        en: productDescEn.trim() || 'Authentic Nepalese handloom tailored fashion.',
        np: productDescNp.trim() || 'मौलिक नेपाली हातेतान फेसन तथा पहिरन।',
      },
      price: Number(productPrice) || 3500,
      originalPrice: productOriginalPrice ? Number(productOriginalPrice) : undefined,
      categoryId: productCategory,
      categoryName,
      images: productImages.length > 0 ? productImages : [
        'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80',
      ],
      availableSizes: selectedSizes.length > 0 ? selectedSizes : ['Free Size'],
      sizeStock,
      inStock: true,
      rating: 4.9,
      reviewCount: 18,
      tags: [productCategory, 'nepali handloom', 'atelier'],
      fabric: {
        en: productFabricEn,
        np: productFabricNp,
      },
      origin: {
        en: productOriginEn,
        np: productOriginNp,
      },
      isNewArrival: productIsNew,
      isFeatured: productIsFeatured,
    };

    if (editingProductId) {
      updateProduct(editingProductId, productPayload);
      showToast(`Updated "${productPayload.title.en}" successfully!`);
    } else {
      addProduct(productPayload);
      showToast(`Created & published "${productPayload.title.en}"!`);
    }

    setIsCreatingNew(false);
    setEditingProductId(null);
  };

  // QR photo upload handlers
  const handleQrFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, or SVG)');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        updateMerchantSettings({ staticQrImage: result });
        showToast('Static QR photo updated from file upload!');
      }
    };
    reader.readAsDataURL(file);
  };

  const handleApplyQrUrl = () => {
    if (!qrImageUrlInput.trim()) return;
    updateMerchantSettings({ staticQrImage: qrImageUrlInput.trim() });
    setQrImageUrlInput('');
    showToast('Static QR photo updated from image URL!');
  };

  // Filtered products in catalog tab
  const filteredCatalogProducts = products.filter((p) => {
    if (!catalogSearch.trim()) return true;
    const q = catalogSearch.toLowerCase();
    return (
      p.title.en.toLowerCase().includes(q) ||
      p.title.np.toLowerCase().includes(q) ||
      p.categoryName.en.toLowerCase().includes(q)
    );
  });

  return (
    <div
      id="admin-panel-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/60 backdrop-blur-xs animate-fadeIn"
      onClick={(e) => {
        if (e.target === e.currentTarget) setIsAdminOpen(false);
      }}
    >
      <div
        id="admin-panel-card"
        role="dialog"
        aria-modal="true"
        aria-label="Merchant Admin Panel"
        className="bg-white rounded-3xl shadow-2xl border border-[#EADCCE] w-full max-w-5xl max-h-[94vh] flex flex-col overflow-hidden animate-scaleUp"
      >
        {/* Header Bar */}
        <div className="bg-[#2B1810] text-[#FFF8F0] px-5 sm:px-7 py-4 flex items-center justify-between border-b border-[#3D251B] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#8B3A3A] border border-[#D4AF37]/40 flex items-center justify-center text-[#D4AF37] shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-serif-luxury text-lg sm:text-xl font-bold tracking-wide text-white">
                  Dawosti Merchant Admin Panel
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#D4AF37]/20 text-[#D4AF37] border border-[#D4AF37]/30 px-2 py-0.5 rounded-full">
                  Verified Merchant
                </span>
              </div>
              <p className="text-xs text-[#FAF2E9]/70">
                {language === 'np'
                  ? 'उत्पादन सिर्जना, फोटो ग्यालरी, Fonepay QR र वेबसाइट व्यवस्थापन'
                  : 'Manage Product Catalog, Multiple Photos, Fallback QR & Site Content'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminAuthenticated && (
              <button
                onClick={() => {
                  lockAdmin();
                  showToast('Admin Panel Locked');
                }}
                title="Lock Admin Session"
                className="min-h-[40px] px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.97]"
              >
                <Lock className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">Lock Session</span>
              </button>
            )}

            <button
              id="admin-close-btn"
              onClick={() => setIsAdminOpen(false)}
              aria-label="Close Admin Settings"
              className="min-h-[44px] min-w-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all duration-150 active:scale-[0.97]"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* PASSCODE LOCK SCREEN IF LOCKED */}
        {adminSecuritySettings.requirePasscode && !isAdminAuthenticated ? (
          <div className="flex-1 p-6 sm:p-12 flex flex-col items-center justify-center text-center bg-[#FAF2E9] overflow-y-auto">
            <div className="w-16 h-16 rounded-3xl bg-[#8B3A3A] text-[#D4AF37] border-2 border-[#D4AF37]/50 flex items-center justify-center shadow-lg mb-4">
              <Lock className="w-8 h-8" />
            </div>

            <h3 className="font-serif-luxury text-2xl font-bold text-[#2B1810] mb-1">
              Merchant Passcode Required
            </h3>
            <p className="text-xs text-[#6B564C] max-w-sm mb-6 leading-relaxed">
              Enter your merchant secret PIN to edit live product listings, multiple photo galleries, and payment QR settings.
            </p>

            <form onSubmit={handleUnlock} className="w-full max-w-xs space-y-4">
              <div>
                <input
                  type="password"
                  value={enteredPin}
                  onChange={(e) => {
                    setEnteredPin(e.target.value);
                    setPinError(null);
                  }}
                  placeholder="Enter 4-digit PIN"
                  maxLength={12}
                  autoFocus
                  className="w-full px-4 py-3 bg-white border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-center text-lg tracking-widest font-mono font-bold shadow-xs outline-none"
                />
                {pinError && (
                  <p className="text-xs text-red-600 font-bold mt-1.5">{pinError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full min-h-[48px] py-3 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl font-bold text-sm shadow-md transition-all active:scale-[0.97] flex items-center justify-center gap-2"
              >
                <KeyRound className="w-4 h-4" />
                <span>Unlock Merchant Admin</span>
              </button>

              {/* Convenience Demo Helper */}
              <div className="pt-2 border-t border-[#EADCCE]">
                <button
                  type="button"
                  onClick={() => setEnteredPin(adminSecuritySettings.passcode)}
                  className="text-xs text-[#8B3A3A] hover:underline font-semibold"
                >
                  Quick Fill Default PIN ({adminSecuritySettings.passcode})
                </button>
              </div>
            </form>
          </div>
        ) : (
          <>
            {/* Tab Navigation */}
            <div className="bg-[#FAF2E9] border-b border-[#EADCCE] px-4 sm:px-7 pt-3 flex items-center gap-2 shrink-0 overflow-x-auto scrollbar-none">
              <button
                id="tab-catalog-btn"
                onClick={() => setActiveTab('catalog')}
                className={`min-h-[44px] px-4 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all duration-150 active:scale-[0.97] ${
                  activeTab === 'catalog'
                    ? 'bg-white text-[#8B3A3A] border-[#EADCCE] border-b-transparent shadow-2xs'
                    : 'text-[#6B564C] hover:text-[#2B1810] border-transparent'
                }`}
              >
                <Layers className="w-4 h-4 text-[#8B3A3A]" />
                <span>Product Catalog & Photos</span>
                <span className="text-[10px] bg-[#8B3A3A] text-white px-1.5 py-0.2 rounded-full font-bold">
                  {products.length}
                </span>
              </button>

              <button
                id="tab-static-qr-btn"
                onClick={() => setActiveTab('qr')}
                className={`min-h-[44px] px-4 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all duration-150 active:scale-[0.97] ${
                  activeTab === 'qr'
                    ? 'bg-white text-[#8B3A3A] border-[#EADCCE] border-b-transparent shadow-2xs'
                    : 'text-[#6B564C] hover:text-[#2B1810] border-transparent'
                }`}
              >
                <QrCode className="w-4 h-4 text-[#8B3A3A]" />
                <span>Fallback Static QR Photo</span>
              </button>

              <button
                id="tab-site-content-btn"
                onClick={() => setActiveTab('content')}
                className={`min-h-[44px] px-4 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all duration-150 active:scale-[0.97] ${
                  activeTab === 'content'
                    ? 'bg-white text-[#8B3A3A] border-[#EADCCE] border-b-transparent shadow-2xs'
                    : 'text-[#6B564C] hover:text-[#2B1810] border-transparent'
                }`}
              >
                <Edit3 className="w-4 h-4 text-[#8B3A3A]" />
                <span>Site Content & Texts</span>
              </button>

              <button
                id="tab-security-btn"
                onClick={() => setActiveTab('security')}
                className={`min-h-[44px] px-4 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all duration-150 active:scale-[0.97] ${
                  activeTab === 'security'
                    ? 'bg-white text-[#8B3A3A] border-[#EADCCE] border-b-transparent shadow-2xs'
                    : 'text-[#6B564C] hover:text-[#2B1810] border-transparent'
                }`}
              >
                <Lock className="w-4 h-4 text-[#8B3A3A]" />
                <span>Security & Lock Settings</span>
              </button>

              <button
                id="tab-direct-paste-btn"
                onClick={() => setActiveTab('direct-paste')}
                className={`min-h-[44px] px-4 py-2 rounded-t-xl text-xs sm:text-sm font-bold flex items-center gap-2 border-t border-x transition-all duration-150 active:scale-[0.97] ${
                  activeTab === 'direct-paste'
                    ? 'bg-white text-[#8B3A3A] border-[#EADCCE] border-b-transparent shadow-2xs'
                    : 'text-[#6B564C] hover:text-[#2B1810] border-transparent'
                }`}
              >
                <FileCode className="w-4 h-4 text-[#8B3A3A]" />
                <span>Node.js / JSON File Paste</span>
              </button>
            </div>

            {/* Success Notification Bar */}
            {saveSuccessNotice && (
              <div className="bg-emerald-50 border-b border-emerald-200 px-6 py-2.5 flex items-center gap-2 text-xs font-bold text-emerald-800 animate-fadeIn">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{saveSuccessNotice}</span>
              </div>
            )}

            {/* Content Body */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-7 bg-[#FFF8F0]/50 space-y-6">
              
              {/* TAB 1: PRODUCT CATALOG & LISTINGS CREATOR (Multiple Photos + Descriptions) */}
              {activeTab === 'catalog' && (
                <div className="space-y-6">
                  {/* Top Action Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-[#EADCCE] shadow-xs">
                    <div>
                      <h3 className="font-serif-luxury text-base sm:text-lg font-bold text-[#2B1810]">
                        Manage Boutique Catalog & Listings
                      </h3>
                      <p className="text-xs text-[#6B564C]">
                        Create custom listings from scratch with multiple photos, descriptions, and stock counts.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={resetProductsToDefault}
                        title="Restore initial boutique demo listings"
                        className="min-h-[44px] px-3.5 py-2 rounded-xl border border-[#EADCCE] text-[#6B564C] hover:text-[#8B3A3A] hover:bg-[#FAF2E9] text-xs font-semibold flex items-center gap-1.5 transition-all active:scale-[0.97]"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>Restore Demo</span>
                      </button>

                      <button
                        onClick={handleStartNewProduct}
                        className="min-h-[44px] px-4 py-2 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs font-bold flex items-center gap-2 shadow-xs transition-all active:scale-[0.97]"
                      >
                        <Plus className="w-4 h-4" />
                        <span>+ Add New Listing</span>
                      </button>
                    </div>
                  </div>

                  {/* FORM: CREATE OR EDIT LISTING */}
                  {isCreatingNew && (
                    <div className="bg-white p-5 sm:p-7 rounded-3xl border-2 border-[#8B3A3A]/40 shadow-lg space-y-5 animate-in slide-in-from-top-3 duration-200">
                      <div className="flex items-center justify-between border-b border-[#EADCCE] pb-3">
                        <div className="flex items-center gap-2">
                          <Tag className="w-5 h-5 text-[#8B3A3A]" />
                          <h4 className="font-serif-luxury text-lg font-bold text-[#2B1810]">
                            {editingProductId ? 'Edit Product Listing' : 'Create New Product From Scratch'}
                          </h4>
                        </div>
                        <button
                          onClick={() => {
                            setIsCreatingNew(false);
                            setEditingProductId(null);
                          }}
                          className="text-[#6B564C] hover:text-[#8B3A3A] p-1.5 rounded-lg hover:bg-gray-100"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveProduct} className="space-y-5">
                        
                        {/* 1. Titles & Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                              Product Title (English) *
                            </label>
                            <input
                              type="text"
                              required
                              value={productTitleEn}
                              onChange={(e) => setProductTitleEn(e.target.value)}
                              placeholder="e.g. Royal Mulberry Silk Saree"
                              className="w-full px-3.5 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm font-semibold text-[#2B1810] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                              Product Title (Nepali / नेपाली)
                            </label>
                            <input
                              type="text"
                              value={productTitleNp}
                              onChange={(e) => setProductTitleNp(e.target.value)}
                              placeholder="उदा: शाही मलबेरी सिल्क साडी"
                              className="w-full px-3.5 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm font-semibold text-[#2B1810] outline-none"
                            />
                          </div>
                        </div>

                        {/* 2. Prices & Category */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                              Selling Price (NPR रु) *
                            </label>
                            <input
                              type="number"
                              required
                              min={100}
                              value={productPrice}
                              onChange={(e) => setProductPrice(Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm font-bold font-mono text-[#8B3A3A] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                              Original Strikethrough Price (NPR)
                            </label>
                            <input
                              type="number"
                              min={100}
                              value={productOriginalPrice}
                              onChange={(e) => setProductOriginalPrice(Number(e.target.value))}
                              className="w-full px-3.5 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm font-mono text-[#6B564C] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                              Category *
                            </label>
                            <select
                              value={productCategory}
                              onChange={(e) => setProductCategory(e.target.value)}
                              className="w-full px-3.5 py-2.5 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm font-semibold text-[#2B1810] outline-none"
                            >
                              {categories
                                .filter((c) => c.slug !== 'all')
                                .map((cat) => (
                                  <option key={cat.id} value={cat.id}>
                                    {cat.name.en} ({cat.name.np})
                                  </option>
                                ))}
                            </select>
                          </div>
                        </div>

                        {/* 3. MULTIPLE PHOTOS MANAGER */}
                        <div className="bg-[#FAF2E9]/80 p-4 sm:p-5 rounded-2xl border border-[#EADCCE] space-y-3">
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div>
                              <label className="text-xs font-bold uppercase tracking-wider text-[#2B1810] flex items-center gap-1.5">
                                <ImageIcon className="w-4 h-4 text-[#8B3A3A]" />
                                <span>Product Photos Gallery ({productImages.length} photos)</span>
                              </label>
                              <p className="text-[11px] text-[#6B564C]">
                                The first photo will be used as the primary catalog thumbnail.
                              </p>
                            </div>

                            <div className="flex items-center gap-2">
                              <input
                                ref={productFileInputRef}
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={handleMultipleImageFiles}
                                className="hidden"
                              />
                              <button
                                type="button"
                                onClick={() => productFileInputRef.current?.click()}
                                className="min-h-[40px] px-3.5 py-2 bg-white hover:bg-gray-50 border border-[#EADCCE] text-[#8B3A3A] rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-2xs transition-all active:scale-[0.97]"
                              >
                                <Upload className="w-3.5 h-3.5" />
                                <span>Upload Multiple Photos</span>
                              </button>
                            </div>
                          </div>

                          {/* Quick URL Adder */}
                          <div className="flex gap-2">
                            <input
                              type="url"
                              placeholder="Or paste an image URL (Unsplash, CDN, etc.)..."
                              value={newImageUrl}
                              onChange={(e) => setNewImageUrl(e.target.value)}
                              className="flex-1 px-3 py-2 bg-white border border-[#EADCCE] rounded-xl text-xs outline-none"
                            />
                            <button
                              type="button"
                              onClick={handleAddImageUrl}
                              className="min-h-[40px] px-4 py-2 bg-[#2B1810] text-white rounded-xl text-xs font-bold hover:bg-[#3D251B] transition-all active:scale-[0.97]"
                            >
                              Add Photo
                            </button>
                          </div>

                          {/* Photo Previews Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 pt-2">
                            {productImages.map((img, idx) => (
                              <div
                                key={idx}
                                className={`relative aspect-3/4 rounded-xl overflow-hidden border-2 bg-white shadow-xs group ${
                                  idx === 0 ? 'border-[#8B3A3A] ring-2 ring-[#8B3A3A]/20' : 'border-[#EADCCE]'
                                }`}
                              >
                                <img
                                  src={img}
                                  alt={`Product ${idx}`}
                                  className="w-full h-full object-cover"
                                  referrerPolicy="no-referrer"
                                />

                                {idx === 0 && (
                                  <span className="absolute top-1.5 left-1.5 bg-[#8B3A3A] text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow-xs">
                                    Primary
                                  </span>
                                )}

                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1.5 p-1">
                                  {idx !== 0 && (
                                    <button
                                      type="button"
                                      onClick={() => handleMakePrimaryPhoto(idx)}
                                      className="px-2 py-1 bg-white text-[#2B1810] text-[10px] font-bold rounded shadow-xs hover:bg-gray-100"
                                    >
                                      Make Primary
                                    </button>
                                  )}
                                  <button
                                    type="button"
                                    onClick={() => handleRemovePhoto(idx)}
                                    className="p-1 bg-red-600 text-white rounded hover:bg-red-700"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* 4. Descriptions */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                              Full Description (English)
                            </label>
                            <textarea
                              rows={3}
                              value={productDescEn}
                              onChange={(e) => setProductDescEn(e.target.value)}
                              placeholder="Describe the weave, embroidery, drape, and styling suggestions..."
                              className="w-full p-3 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm text-[#2B1810] outline-none"
                            />
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider mb-1">
                              Full Description (Nepali / नेपाली)
                            </label>
                            <textarea
                              rows={3}
                              value={productDescNp}
                              onChange={(e) => setProductDescNp(e.target.value)}
                              placeholder="हाते बुट्टा, कपडाको गुणस्तर तथा विशेषताहरूको विवरण..."
                              className="w-full p-3 bg-[#FAF2E9]/60 border border-[#EADCCE] focus:border-[#8B3A3A] rounded-xl text-xs sm:text-sm text-[#2B1810] outline-none"
                            />
                          </div>
                        </div>

                        {/* 5. Sizes & Stock Management */}
                        <div className="bg-white p-4 rounded-2xl border border-[#EADCCE] space-y-3">
                          <label className="block text-xs font-bold text-[#6B564C] uppercase tracking-wider">
                            Available Sizes & Stock Quantities
                          </label>

                          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                            {allAvailableSizes.map((size) => {
                              const isChecked = selectedSizes.includes(size);
                              return (
                                <div
                                  key={size}
                                  className={`p-2.5 rounded-xl border transition-all ${
                                    isChecked ? 'border-[#8B3A3A] bg-[#FAF2E9]/50' : 'border-gray-200'
                                  }`}
                                >
                                  <label className="flex items-center gap-1.5 cursor-pointer mb-1.5">
                                    <input
                                      type="checkbox"
                                      checked={isChecked}
                                      onChange={(e) => {
                                        if (e.target.checked) {
                                          setSelectedSizes((prev) => [...prev, size]);
                                          setSizeStock((prev) => ({ ...prev, [size]: 5 }));
                                        } else {
                                          setSelectedSizes((prev) => prev.filter((s) => s !== size));
                                        }
                                      }}
                                      className="accent-[#8B3A3A]"
                                    />
                                    <span className="text-xs font-bold text-[#2B1810]">{size}</span>
                                  </label>

                                  {isChecked && (
                                    <input
                                      type="number"
                                      min={0}
                                      value={sizeStock[size] ?? 5}
                                      onChange={(e) =>
                                        setSizeStock((prev) => ({
                                          ...prev,
                                          [size]: Number(e.target.value),
                                        }))
                                      }
                                      placeholder="Stock"
                                      className="w-full px-2 py-1 bg-white border border-[#EADCCE] rounded text-xs font-mono font-bold text-[#2B1810]"
                                    />
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        {/* 6. Flags & Badges */}
                        <div className="flex flex-wrap items-center gap-6 pt-1">
                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2B1810]">
                            <input
                              type="checkbox"
                              checked={productIsNew}
                              onChange={(e) => setProductIsNew(e.target.checked)}
                              className="accent-[#8B3A3A] w-4 h-4"
                            />
                            <span>Mark as New Arrival (नयाँ आगमन)</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer text-xs font-bold text-[#2B1810]">
                            <input
                              type="checkbox"
                              checked={productIsFeatured}
                              onChange={(e) => setProductIsFeatured(e.target.checked)}
                              className="accent-[#8B3A3A] w-4 h-4"
                            />
                            <span>Feature on Homepage Spotlight (विशेष संग्रह)</span>
                          </label>
                        </div>

                        {/* Submit Actions */}
                        <div className="flex items-center justify-end gap-3 pt-3 border-t border-[#EADCCE]">
                          <button
                            type="button"
                            onClick={() => {
                              setIsCreatingNew(false);
                              setEditingProductId(null);
                            }}
                            className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#EADCCE] text-[#6B564C] hover:bg-gray-100 text-xs font-bold transition-all active:scale-[0.97]"
                          >
                            Cancel
                          </button>

                          <button
                            type="submit"
                            className="min-h-[48px] px-7 py-2.5 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.97] flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            <span>{editingProductId ? 'Save Product Changes' : 'Publish Listing to Store'}</span>
                          </button>
                        </div>

                      </form>
                    </div>
                  )}

                  {/* SEARCH & LIVE LISTINGS TABLE */}
                  <div className="bg-white rounded-2xl border border-[#EADCCE] overflow-hidden shadow-xs">
                    <div className="p-4 border-b border-[#EADCCE] bg-[#FAF2E9] flex items-center justify-between gap-3">
                      <div className="relative flex-1 max-w-sm">
                        <Search className="w-4 h-4 text-[#6B564C] absolute left-3 top-1/2 -translate-y-1/2" />
                        <input
                          type="text"
                          value={catalogSearch}
                          onChange={(e) => setCatalogSearch(e.target.value)}
                          placeholder="Search existing listings..."
                          className="w-full pl-9 pr-3 py-2 bg-white border border-[#EADCCE] rounded-xl text-xs outline-none focus:border-[#8B3A3A]"
                        />
                      </div>
                      <span className="text-xs text-[#6B564C] font-semibold">
                        Showing {filteredCatalogProducts.length} of {products.length} products
                      </span>
                    </div>

                    <div className="divide-y divide-[#EADCCE] max-h-[50vh] overflow-y-auto">
                      {filteredCatalogProducts.map((prod) => (
                        <div
                          key={prod.id}
                          className="p-3.5 sm:p-4 flex items-center justify-between gap-4 hover:bg-[#FAF2E9]/40 transition-colors"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <img
                              src={prod.images[0] || 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=600&q=80'}
                              alt={prod.title.en}
                              className="w-12 h-15 object-cover object-top rounded-lg border border-[#EADCCE] shrink-0"
                              referrerPolicy="no-referrer"
                            />
                            <div className="min-w-0">
                              <div className="flex items-center gap-2">
                                <h4 className="text-xs sm:text-sm font-bold text-[#2B1810] truncate">
                                  {prod.title.en}
                                </h4>
                                {prod.isFeatured && (
                                  <span className="text-[9px] bg-[#D4AF37]/20 text-[#D4AF37] px-1.5 py-0.5 rounded font-bold">
                                    FEATURED
                                  </span>
                                )}
                              </div>
                              <p className="text-[11px] text-[#6B564C] truncate">
                                {prod.categoryName.en} • {prod.images.length} photos • {prod.availableSizes.join(', ')}
                              </p>
                              <p className="text-xs font-bold text-[#8B3A3A] font-mono mt-0.5">
                                {formatPrice(prod.price)}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => handleStartEditProduct(prod)}
                              className="min-h-[40px] px-3 py-1.5 bg-[#FAF2E9] hover:bg-[#EADCCE] text-[#2B1810] rounded-lg text-xs font-bold border border-[#EADCCE] flex items-center gap-1 transition-all active:scale-[0.97]"
                            >
                              <Edit3 className="w-3.5 h-3.5 text-[#8B3A3A]" />
                              <span>Edit</span>
                            </button>

                            <button
                              onClick={() => {
                                if (confirm(`Are you sure you want to delete "${prod.title.en}"?`)) {
                                  deleteProduct(prod.id);
                                  showToast(`Deleted "${prod.title.en}"`);
                                }
                              }}
                              className="min-h-[40px] p-2 text-[#6B564C] hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors active:scale-[0.97]"
                              title="Delete Listing"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: FALLBACK STATIC QR PHOTO */}
              {activeTab === 'qr' && (
                <div className="space-y-6">
                  {/* Default Mode Selector */}
                  <div className="bg-white p-5 rounded-2xl border border-[#EADCCE] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <h4 className="text-sm font-bold text-[#2B1810] flex items-center gap-2">
                        <QrCode className="w-4 h-4 text-[#8B3A3A]" />
                        <span>Default Fonepay Presentation Mode at Checkout</span>
                      </h4>
                      <p className="text-xs text-[#6B564C] mt-1">
                        Choose whether customers see the interactive dynamic QR code by default, or your official physical QR standee photo.
                      </p>
                    </div>

                    <div className="flex items-center gap-2 bg-[#FAF2E9] p-1.5 rounded-xl border border-[#EADCCE] shrink-0">
                      <button
                        onClick={() => updateMerchantSettings({ useStaticQrByDefault: false })}
                        className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          !merchantSettings.useStaticQrByDefault
                            ? 'bg-[#8B3A3A] text-white shadow-xs'
                            : 'text-[#6B564C] hover:text-[#2B1810]'
                        }`}
                      >
                        Dynamic Payload QR
                      </button>
                      <button
                        onClick={() => updateMerchantSettings({ useStaticQrByDefault: true })}
                        className={`min-h-[40px] px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
                          merchantSettings.useStaticQrByDefault
                            ? 'bg-[#8B3A3A] text-white shadow-xs'
                            : 'text-[#6B564C] hover:text-[#2B1810]'
                        }`}
                      >
                        Physical QR Photo
                      </button>
                    </div>
                  </div>

                  {/* Fallback Static QR Photo Manager */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 rounded-3xl border border-[#EADCCE] shadow-xs">
                    {/* Left: Preview Card */}
                    <div className="lg:col-span-5 flex flex-col items-center justify-center p-5 bg-[#FAF2E9] rounded-2xl border border-[#EADCCE] text-center">
                      <div className="w-full max-w-[240px] aspect-square bg-white rounded-xl shadow-inner border border-[#EADCCE] p-3 flex items-center justify-center overflow-hidden mb-3">
                        <img
                          src={merchantSettings.staticQrImage || DEFAULT_STATIC_FONEPAY_QR_SVG}
                          alt="Merchant QR"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <span className="text-xs font-bold text-[#8B3A3A]">
                        {merchantSettings.merchantName}
                      </span>
                      <span className="text-[11px] text-[#6B564C] font-mono">
                        PAN: {merchantSettings.merchantPan} • {merchantSettings.bankName}
                      </span>
                    </div>

                    {/* Right: Upload & URLs */}
                    <div className="lg:col-span-7 space-y-4">
                      <h4 className="text-sm font-bold text-[#2B1810]">
                        Update High-Resolution Static QR Photo
                      </h4>
                      <p className="text-xs text-[#6B564C] leading-relaxed">
                        Upload an official photo of your printed Fonepay counter standee or paste a high-resolution image URL.
                      </p>

                      <div className="flex gap-2">
                        <input
                          type="url"
                          placeholder="Paste image URL..."
                          value={qrImageUrlInput}
                          onChange={(e) => setQrImageUrlInput(e.target.value)}
                          className="flex-1 px-3 py-2 bg-white border border-[#EADCCE] rounded-xl text-xs outline-none"
                        />
                        <button
                          type="button"
                          onClick={handleApplyQrUrl}
                          className="min-h-[40px] px-4 py-2 bg-[#8B3A3A] text-white rounded-xl text-xs font-bold hover:bg-[#722E2E] transition-all active:scale-[0.97]"
                        >
                          Apply URL
                        </button>
                      </div>

                      <div className="pt-2">
                        <input
                          ref={qrFileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={handleQrFileUpload}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => qrFileInputRef.current?.click()}
                          className="w-full min-h-[48px] py-2.5 px-4 rounded-xl border-2 border-dashed border-[#8B3A3A]/40 hover:border-[#8B3A3A] bg-white text-xs font-bold text-[#8B3A3A] flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
                        >
                          <Upload className="w-4 h-4" />
                          <span>Upload High-Res Standee Photo From Computer</span>
                        </button>
                      </div>

                      {/* Quick Merchant Profile Inputs */}
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        <div>
                          <label className="text-[11px] font-bold text-[#6B564C]">Merchant Name</label>
                          <input
                            type="text"
                            value={merchantSettings.merchantName}
                            onChange={(e) => updateMerchantSettings({ merchantName: e.target.value })}
                            className="w-full px-3 py-1.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-lg text-xs font-semibold"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-bold text-[#6B564C]">Merchant PAN</label>
                          <input
                            type="text"
                            value={merchantSettings.merchantPan}
                            onChange={(e) => updateMerchantSettings({ merchantPan: e.target.value })}
                            className="w-full px-3 py-1.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-lg text-xs font-mono font-semibold"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SITE CONTENT & TEXTS */}
              {activeTab === 'content' && (
                <div className="bg-white p-6 rounded-3xl border border-[#EADCCE] space-y-5">
                  <h4 className="text-sm font-bold text-[#2B1810] flex items-center gap-2 border-b border-[#EADCCE] pb-3">
                    <Edit3 className="w-4 h-4 text-[#8B3A3A]" />
                    <span>Live Bilingual Site Text & Banner Announcements</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#6B564C]">Top Announcement (English)</label>
                      <input
                        type="text"
                        value={siteContent.announcementText.en}
                        onChange={(e) =>
                          updateSiteContent({
                            announcementText: { ...siteContent.announcementText, en: e.target.value },
                          })
                        }
                        className="w-full p-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6B564C]">शीर्ष सूचना (नेपाली)</label>
                      <input
                        type="text"
                        value={siteContent.announcementText.np}
                        onChange={(e) =>
                          updateSiteContent({
                            announcementText: { ...siteContent.announcementText, np: e.target.value },
                          })
                        }
                        className="w-full p-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-xs mt-1"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#6B564C]">Hero Main Heading (English)</label>
                      <input
                        type="text"
                        value={siteContent.heroTitle.en}
                        onChange={(e) =>
                          updateSiteContent({
                            heroTitle: { ...siteContent.heroTitle, en: e.target.value },
                          })
                        }
                        className="w-full p-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-xs mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#6B564C]">प्रमुख शीर्षक (नेपाली)</label>
                      <input
                        type="text"
                        value={siteContent.heroTitle.np}
                        onChange={(e) =>
                          updateSiteContent({
                            heroTitle: { ...siteContent.heroTitle, np: e.target.value },
                          })
                        }
                        className="w-full p-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-xs mt-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: SECURITY & LOCK SETTINGS */}
              {activeTab === 'security' && (
                <div className="bg-white p-6 rounded-3xl border border-[#EADCCE] space-y-6">
                  <div className="border-b border-[#EADCCE] pb-3">
                    <h4 className="text-base font-bold text-[#2B1810] flex items-center gap-2">
                      <Lock className="w-5 h-5 text-[#8B3A3A]" />
                      <span>Admin Passcode & Lock Settings</span>
                    </h4>
                    <p className="text-xs text-[#6B564C] mt-1">
                      Prevent store visitors from modifying your listings or merchant payment credentials.
                    </p>
                  </div>

                  {/* Toggle Requirement */}
                  <div className="flex items-center justify-between p-4 bg-[#FAF2E9] rounded-2xl border border-[#EADCCE]">
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[#2B1810]">
                        Require Passcode to Open Admin Panel
                      </p>
                      <p className="text-[11px] text-[#6B564C]">
                        When enabled, clicking the admin trigger prompts for your secret PIN.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        updateAdminSecuritySettings({
                          requirePasscode: !adminSecuritySettings.requirePasscode,
                        })
                      }
                      className={`min-h-[44px] min-w-[56px] flex items-center justify-center`}
                    >
                      <span
                        className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-200 ${
                          adminSecuritySettings.requirePasscode ? 'bg-[#8B3A3A]' : 'bg-[#EADCCE]'
                        }`}
                      >
                        <span
                          className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-200 ${
                            adminSecuritySettings.requirePasscode ? 'translate-x-6' : 'translate-x-0'
                          }`}
                        />
                      </span>
                    </button>
                  </div>

                  {/* Change Passcode */}
                  <div className="p-4 bg-white rounded-2xl border border-[#EADCCE] space-y-3">
                    <label className="text-xs font-bold text-[#6B564C] uppercase tracking-wider block">
                      Change Merchant Secret Passcode / PIN
                    </label>
                    <div className="flex gap-2 max-w-sm">
                      <input
                        type="text"
                        value={newPinInput}
                        onChange={(e) => setNewPinInput(e.target.value)}
                        placeholder="e.g. 1234 or dawosti2026"
                        className="flex-1 px-3.5 py-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-sm font-mono font-bold outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (!newPinInput.trim()) {
                            alert('PIN cannot be blank');
                            return;
                          }
                          updateAdminSecuritySettings({ passcode: newPinInput.trim() });
                          showToast('Secret Passcode successfully changed!');
                        }}
                        className="min-h-[44px] px-4 py-2 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs font-bold transition-all active:scale-[0.97]"
                      >
                        Update PIN
                      </button>
                    </div>
                  </div>

                  {/* Lock Now Button */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        lockAdmin();
                        showToast('Admin Session Locked');
                      }}
                      className="min-h-[44px] px-5 py-2.5 bg-[#2B1810] hover:bg-[#3D251B] text-white rounded-xl text-xs font-bold flex items-center gap-2 transition-all active:scale-[0.97]"
                    >
                      <Lock className="w-4 h-4" />
                      <span>Lock Admin Session Now</span>
                    </button>
                  </div>
                </div>
              )}

              {/* TAB 5: DIRECT FILE & JSON DATA (Node.js Paste) */}
              {activeTab === 'direct-paste' && (
                <div className="bg-white p-6 rounded-3xl border border-[#EADCCE] space-y-6">
                  <div className="border-b border-[#EADCCE] pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-base font-bold text-[#2B1810] flex items-center gap-2">
                        <FileCode className="w-5 h-5 text-[#8B3A3A]" />
                        <span>Direct File & JSON Code Management (Node.js)</span>
                      </h4>
                      <p className="text-xs text-[#6B564C] mt-1">
                        Paste your raw JSON products data, upload a .json database file, or export your full catalog.
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleExportJson}
                        className="min-h-[40px] px-3.5 py-1.5 bg-[#FAF2E9] hover:bg-[#EADCCE] text-[#2B1810] rounded-xl text-xs font-bold border border-[#EADCCE] flex items-center gap-1.5 transition-all active:scale-[0.97]"
                      >
                        <Download className="w-3.5 h-3.5 text-[#8B3A3A]" />
                        <span>Export Catalog (.json)</span>
                      </button>

                      <input
                        ref={jsonFileInputRef}
                        type="file"
                        accept=".json,application/json"
                        onChange={handleJsonFileUpload}
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => jsonFileInputRef.current?.click()}
                        className="min-h-[40px] px-3.5 py-1.5 bg-[#FAF2E9] hover:bg-[#EADCCE] text-[#2B1810] rounded-xl text-xs font-bold border border-[#EADCCE] flex items-center gap-1.5 transition-all active:scale-[0.97]"
                      >
                        <Upload className="w-3.5 h-3.5 text-[#8B3A3A]" />
                        <span>Upload .json File</span>
                      </button>
                    </div>
                  </div>

                  {/* Actions & Sample Helper */}
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-xs font-bold text-[#6B564C] uppercase tracking-wider">
                      Paste Product JSON or Array
                    </span>
                    <button
                      type="button"
                      onClick={handleLoadSampleJson}
                      className="text-xs text-[#8B3A3A] hover:underline font-bold"
                    >
                      Fill Sample Product Template
                    </button>
                  </div>

                  {/* Textarea for JSON */}
                  <div className="relative">
                    <textarea
                      rows={12}
                      value={jsonPasteInput}
                      onChange={(e) => {
                        setJsonPasteInput(e.target.value);
                        setJsonImportError(null);
                      }}
                      placeholder={`[\n  {\n    "title": { "en": "Example Silk Kurtha", "np": "सिल्क कुर्ता" },\n    "price": 4500,\n    "categoryId": "cat-kurthas",\n    "images": ["https://..."]\n  }\n]`}
                      className="w-full p-4 bg-[#FAF2E9]/60 font-mono text-xs text-[#2B1810] border border-[#EADCCE] focus:border-[#8B3A3A] rounded-2xl outline-none leading-relaxed"
                    />
                  </div>

                  {jsonImportError && (
                    <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 font-semibold flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                      <span>{jsonImportError}</span>
                    </div>
                  )}

                  {/* Submit Button */}
                  <div className="flex items-center justify-end gap-3 pt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setJsonPasteInput('');
                        setJsonImportError(null);
                      }}
                      className="min-h-[44px] px-5 py-2.5 rounded-xl border border-[#EADCCE] text-[#6B564C] hover:bg-gray-100 text-xs font-bold transition-all active:scale-[0.97]"
                    >
                      Clear Editor
                    </button>

                    <button
                      type="button"
                      onClick={handleImportJson}
                      className="min-h-[48px] px-6 py-2.5 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs font-bold shadow-md transition-all active:scale-[0.97] flex items-center gap-2"
                    >
                      <Check className="w-4 h-4" />
                      <span>Parse, Validate & Import to Live Store</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </>
        )}

      </div>
    </div>
  );
};
