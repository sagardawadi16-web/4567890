import React, { useState, useMemo } from 'react';
import {
  ArrowLeft,
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  Tag,
  Check,
  AlertCircle,
  ShoppingBag,
  MessageCircle,
  MapPin,
  ExternalLink,
  Navigation,
  Compass,
} from 'lucide-react';
import { useShopStore } from '../store/shopStore';
import { PaymentMethod, ShippingAddress, EsewaPayload, KhaltiPaymentResult, FonepayProof } from '../types';
import { EsewaModal } from '../components/checkout/EsewaModal';
import { KhaltiModal } from '../components/checkout/KhaltiModal';
import { FonepayModal } from '../components/checkout/FonepayModal';
import { OrderConfirmationView } from '../components/checkout/OrderConfirmationView';
import { NEPAL_PROVINCES, NepalProvince, NepalCity } from '../data/nepalLocations';

export const CheckoutPage: React.FC = () => {
  const {
    language,
    setLanguage,
    cart,
    cartSubtotal,
    formatPrice,
    setPageView,
    placeOrder,
    latestOrder,
    pageView,
  } = useShopStore();

  // Shipping form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [selectedProvinceId, setSelectedProvinceId] = useState<string>('bagmati');
  const [selectedCityId, setSelectedCityId] = useState<string>('ktm');
  const [addressLine, setAddressLine] = useState('');
  const [deliveryNotes, setDeliveryNotes] = useState('');

  // Selected province and city objects
  const selectedProvince = useMemo(() => {
    return NEPAL_PROVINCES.find((p) => p.id === selectedProvinceId) || NEPAL_PROVINCES[0];
  }, [selectedProvinceId]);

  const selectedCity = useMemo(() => {
    return (
      selectedProvince.cities.find((c) => c.id === selectedCityId) ||
      selectedProvince.cities[0]
    );
  }, [selectedProvince, selectedCityId]);

  const handleProvinceChange = (newProvinceId: string) => {
    setSelectedProvinceId(newProvinceId);
    const prov = NEPAL_PROVINCES.find((p) => p.id === newProvinceId) || NEPAL_PROVINCES[0];
    setSelectedCityId(prov.defaultCityId);
  };

  // Payment method
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('esewa');

  // Coupon / Promo Code
  const [couponCode, setCouponCode] = useState('');
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [couponMessage, setCouponMessage] = useState<{ text: string; isError: boolean } | null>(null);

  // Form validation errors
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Payment Modals State
  const [isEsewaModalOpen, setIsEsewaModalOpen] = useState(false);
  const [isKhaltiModalOpen, setIsKhaltiModalOpen] = useState(false);
  const [isFonepayModalOpen, setIsFonepayModalOpen] = useState(false);
  const [generatedOrderRef, setGeneratedOrderRef] = useState(`DAW-${Math.floor(100000 + Math.random() * 900000)}`);

  // If on order confirmation view and latestOrder exists, render the receipt
  if (pageView === 'order-confirmation' && latestOrder) {
    return <OrderConfirmationView order={latestOrder} language={language} />;
  }

  // Delivery calculations
  const deliveryFee = cartSubtotal >= 3000 ? 0 : 150;
  const totalPayable = Math.max(0, cartSubtotal - appliedDiscount + deliveryFee);

  // Coupon code handler
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    if (code === 'DAWOSTI10') {
      const discount = Math.round(cartSubtotal * 0.1);
      setAppliedDiscount(discount);
      setCouponMessage({
        text: language === 'np' ? '१०% बुटिक छुट लागू भयो!' : '10% Boutique Discount Applied!',
        isError: false,
      });
    } else if (code === 'NEPAL500') {
      const discount = Math.min(500, cartSubtotal);
      setAppliedDiscount(discount);
      setCouponMessage({
        text: language === 'np' ? 'रु ५०० विशेष छुट लागू भयो!' : 'NPR 500 Festive Voucher Applied!',
        isError: false,
      });
    } else {
      setCouponMessage({
        text: language === 'np' ? 'अमान्य कुपन कोड। कृपया DAWOSTI10 प्रयास गर्नुहोस्' : 'Invalid coupon code. Try DAWOSTI10',
        isError: true,
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};
    if (!fullName.trim()) {
      errors.fullName = language === 'np' ? 'कृपया तपाईँको पूरा नाम राख्नुहोस्' : 'Please enter your full name';
    }
    if (!phone.trim()) {
      errors.phone = language === 'np' ? 'कृपया फोन नम्बर राख्नुहोस्' : 'Please enter your phone number';
    } else if (phone.replace(/\D/g, '').length < 10) {
      errors.phone = language === 'np' ? 'कृपया १० अङ्कको मान्य फोन नम्बर राख्नुहोस्' : 'Please enter a valid 10-digit number';
    }
    if (!addressLine.trim()) {
      errors.addressLine = language === 'np' ? 'कृपया चोक वा गल्ली ठेगाना राख्नुहोस्' : 'Please enter street / landmark address';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const getShippingAddress = (): ShippingAddress => ({
    fullName: fullName.trim(),
    phone: phone.trim(),
    alternatePhone: alternatePhone.trim() || undefined,
    province: language === 'np' ? selectedProvince.nameNp : selectedProvince.nameEn,
    city: language === 'np' ? selectedCity.nameNp : selectedCity.nameEn,
    addressLine: addressLine.trim(),
  });

  // Handle Primary Checkout Action Button Click
  const handleProceedPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to the first error
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    const orderRef = `DAW-${Math.floor(100000 + Math.random() * 900000)}`;
    setGeneratedOrderRef(orderRef);

    if (paymentMethod === 'esewa') {
      setIsEsewaModalOpen(true);
    } else if (paymentMethod === 'khalti') {
      setIsKhaltiModalOpen(true);
    } else if (paymentMethod === 'fonepay') {
      setIsFonepayModalOpen(true);
    } else {
      // Cash on Delivery
      placeOrder({
        orderNumber: orderRef,
        shippingAddress: getShippingAddress(),
        paymentMethod: 'cod',
        discountAmount: appliedDiscount,
        deliveryFee,
        totalAmount: totalPayable,
        notes: deliveryNotes.trim() || undefined,
      });
    }
  };

  // Payment Callbacks
  const handleEsewaSuccess = (transactionId: string, payload: EsewaPayload) => {
    setIsEsewaModalOpen(false);
    placeOrder({
      orderNumber: generatedOrderRef,
      shippingAddress: getShippingAddress(),
      paymentMethod: 'esewa',
      discountAmount: appliedDiscount,
      deliveryFee,
      totalAmount: totalPayable,
      notes: deliveryNotes.trim() || undefined,
      paymentDetails: {
        transactionId,
        esewaPid: payload.pid,
        paidAt: new Date().toISOString(),
      },
    });
  };

  const handleKhaltiSuccess = (result: KhaltiPaymentResult) => {
    setIsKhaltiModalOpen(false);
    placeOrder({
      orderNumber: generatedOrderRef,
      shippingAddress: getShippingAddress(),
      paymentMethod: 'khalti',
      discountAmount: appliedDiscount,
      deliveryFee,
      totalAmount: totalPayable,
      notes: deliveryNotes.trim() || undefined,
      paymentDetails: {
        transactionId: result.idx,
        khaltiToken: result.token,
        paidAt: new Date().toISOString(),
      },
    });
  };

  const handleFonepaySuccess = (proof: FonepayProof) => {
    setIsFonepayModalOpen(false);
    placeOrder({
      orderNumber: generatedOrderRef,
      shippingAddress: getShippingAddress(),
      paymentMethod: 'fonepay',
      discountAmount: appliedDiscount,
      deliveryFee,
      totalAmount: totalPayable,
      notes: deliveryNotes.trim() || undefined,
      paymentDetails: {
        transactionId: proof.referenceId,
        fonepayProof: proof,
        paidAt: new Date().toISOString(),
      },
    });
  };

  if (cart.length === 0) {
    return (
      <div id="checkout-empty-cart" className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <div className="w-16 h-16 rounded-full bg-[#FAF2E9] border border-[#EADCCE] text-[#8B3A3A] flex items-center justify-center mx-auto shadow-xs">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="font-serif-luxury text-2xl font-bold text-[#2B1810]">
          {language === 'np' ? 'तपाईँको झोला खाली छ' : 'Your Shopping Bag is Empty'}
        </h2>
        <p className="text-xs sm:text-sm text-[#6B564C] max-w-sm mx-auto">
          {language === 'np'
            ? 'कृपया चेकआउट गर्न पहिले हाम्रो मौलिक फेसन संग्रहबाट सामान छान्नुहोस्।'
            : 'Please add handloom items from our Nepali collections before proceeding to checkout.'}
        </p>
        <button
          onClick={() => setPageView('home')}
          className="px-6 py-3 bg-[#8B3A3A] hover:bg-[#722E2E] text-white rounded-xl text-xs sm:text-sm font-bold shadow-md transition-all"
        >
          {language === 'np' ? 'फेसन संग्रह हेर्नुहोस्' : 'Explore Collections'}
        </button>
      </div>
    );
  }

  return (
    <div id="checkout-page-container" className="min-h-screen bg-[#FFF8F0] pb-16">
      
      {/* Checkout Navbar */}
      <header className="sticky top-0 z-30 bg-[#FFF8F0]/95 backdrop-blur-md border-b border-[#EADCCE]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <button
            onClick={() => setPageView('home')}
            className="flex items-center gap-1.5 text-xs font-bold text-[#6B564C] hover:text-[#8B3A3A] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="hidden sm:inline">
              {language === 'np' ? 'किनमेलमा फर्कनुहोस्' : 'Back to Shop'}
            </span>
            <span className="sm:hidden">{language === 'np' ? 'पछाडि' : 'Back'}</span>
          </button>

          {/* Logo */}
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rotate-45 bg-[#D4AF37]" />
            <span className="font-serif-luxury text-xl sm:text-2xl font-bold tracking-[0.18em] text-[#8B3A3A] uppercase">
              DAWOSTI
            </span>
            <span className="w-2 h-2 rotate-45 bg-[#D4AF37]" />
          </div>

          {/* Language Switch */}
          <div className="flex items-center bg-[#FAF2E9] p-0.5 rounded-full border border-[#EADCCE]">
            <button
              onClick={() => setLanguage('np')}
              className={`px-2 py-0.5 text-xs font-semibold rounded-full transition-all ${
                language === 'np' ? 'bg-[#8B3A3A] text-white shadow-2xs' : 'text-[#6B564C]'
              }`}
            >
              नेपाली
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`px-2 py-0.5 text-xs font-semibold rounded-full transition-all ${
                language === 'en' ? 'bg-[#8B3A3A] text-white shadow-2xs' : 'text-[#6B564C]'
              }`}
            >
              EN
            </button>
          </div>
        </div>
      </header>

      {/* Main Checkout Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-10">
        
        {/* Page Title & Trust Badges */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#EADCCE] pb-4">
          <div>
            <h1 className="font-serif-luxury text-2xl sm:text-3xl font-bold text-[#2B1810]">
              {language === 'np' ? 'सुरक्षित चेकआउट' : 'Streamlined Checkout'}
            </h1>
            <p className="text-xs text-[#6B564C] mt-0.5">
              {language === 'np'
                ? 'काठमाडौँ तथा नेपालभर छिटो डेलिभरी र सुरक्षित भुक्तानी'
                : 'Fast delivery across Nepal with verified local payment options'}
            </p>
          </div>
          <div className="flex items-center gap-3 text-[11px] text-[#6B564C] bg-[#FAF2E9] px-3 py-1.5 rounded-xl border border-[#EADCCE] shrink-0 self-start sm:self-auto">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>256-Bit SSL Encrypted</span>
          </div>
        </div>

        {/* Two-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* LEFT COLUMN: Customer Details, Address, and Payment Options (7 cols on lg) */}
          <div className="lg:col-span-7 space-y-6">
            
            {/* Step 1: Customer Information & Delivery Address Form */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EADCCE] shadow-xs space-y-5">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#FAF2E9]">
                <div className="w-7 h-7 rounded-full bg-[#8B3A3A] text-white text-xs font-bold flex items-center justify-center">
                  1
                </div>
                <h2 className="text-base sm:text-lg font-bold text-[#2B1810]">
                  {language === 'np' ? 'ग्राहक तथा डेलिभरी ठेगाना' : 'Contact & Shipping Address'}
                </h2>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C] flex justify-between">
                    <span>{language === 'np' ? 'पूरा नाम (Full Name) *' : 'Full Name *'}</span>
                    {formErrors.fullName && (
                      <span className="text-red-600 text-[11px] normal-case flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.fullName}
                      </span>
                    )}
                  </label>
                  <input
                    id="checkout-fullname-input"
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => {
                      setFullName(e.target.value);
                      if (formErrors.fullName) setFormErrors((p) => ({ ...p, fullName: '' }));
                    }}
                    placeholder={language === 'np' ? 'उदा. सिता शर्मा' : 'e.g. Sita Sharma'}
                    className={`w-full px-3.5 py-2.5 bg-[#FAF2E9] border rounded-xl text-sm font-semibold text-[#2B1810] focus:ring-2 focus:ring-[#8B3A3A] focus:outline-none transition-all ${
                      formErrors.fullName ? 'border-red-400 bg-red-50/40' : 'border-[#EADCCE]'
                    }`}
                  />
                </div>

                {/* Mobile Phone Numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C] flex justify-between">
                      <span>{language === 'np' ? 'सम्पर्क फोन / मोबाइल *' : 'Mobile Phone *'}</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#6B564C]">
                        +977
                      </span>
                      <input
                        id="checkout-phone-input"
                        type="tel"
                        required
                        maxLength={10}
                        value={phone}
                        onChange={(e) => {
                          setPhone(e.target.value.replace(/\D/g, ''));
                          if (formErrors.phone) setFormErrors((p) => ({ ...p, phone: '' }));
                        }}
                        placeholder="98XXXXXXXX"
                        className={`w-full pl-14 pr-3 py-2.5 bg-[#FAF2E9] border rounded-xl text-sm font-mono font-bold text-[#2B1810] focus:ring-2 focus:ring-[#8B3A3A] focus:outline-none transition-all ${
                          formErrors.phone ? 'border-red-400 bg-red-50/40' : 'border-[#EADCCE]'
                        }`}
                      />
                    </div>
                    {formErrors.phone && (
                      <p className="text-red-600 text-[11px] mt-0.5">{formErrors.phone}</p>
                    )}
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C]">
                      <span>{language === 'np' ? 'वैकल्पिक फोन / व्हाट्सएप' : 'Alt / WhatsApp Phone'}</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#6B564C]">
                        +977
                      </span>
                      <input
                        id="checkout-altphone-input"
                        type="tel"
                        maxLength={10}
                        value={alternatePhone}
                        onChange={(e) => setAlternatePhone(e.target.value.replace(/\D/g, ''))}
                        placeholder="98XXXXXXXX"
                        className="w-full pl-14 pr-3 py-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-sm font-mono font-bold text-[#2B1810] focus:ring-2 focus:ring-[#8B3A3A] focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Province & City Selection (Dynamic & Validated per Nepal Province) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C] flex items-center justify-between">
                      <span>{language === 'np' ? 'प्रदेश (Province) *' : 'Province *'}</span>
                      <span className="text-[10px] text-[#8B3A3A] font-medium lowercase">7 genuine provinces</span>
                    </label>
                    <select
                      id="checkout-province-select"
                      value={selectedProvinceId}
                      onChange={(e) => handleProvinceChange(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-xs sm:text-sm font-semibold text-[#2B1810] focus:ring-2 focus:ring-[#8B3A3A] focus:outline-none cursor-pointer"
                    >
                      {NEPAL_PROVINCES.map((p) => (
                        <option key={p.id} value={p.id}>
                          {language === 'np' ? `${p.nameNp} (${p.nameEn})` : `${p.nameEn} (${p.nameNp})`}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C] flex items-center justify-between">
                      <span>{language === 'np' ? 'सहर / जिल्ला (City / District) *' : 'City / District *'}</span>
                      <span className="text-[10px] text-[#8B3A3A] font-medium lowercase">
                        {selectedProvince.cities.length} verified zones
                      </span>
                    </label>
                    <select
                      id="checkout-city-select"
                      value={selectedCityId}
                      onChange={(e) => setSelectedCityId(e.target.value)}
                      className="w-full px-3 py-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-xs sm:text-sm font-semibold text-[#2B1810] focus:ring-2 focus:ring-[#8B3A3A] focus:outline-none cursor-pointer"
                    >
                      {selectedProvince.cities.map((c) => (
                        <option key={c.id} value={c.id}>
                          {language === 'np' ? `${c.nameNp} (${c.nameEn})` : `${c.nameEn} (${c.nameNp})`}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Google Map Narrowing & Courier Logistics Transit Hub Card */}
                <div className="bg-[#FAF2E9]/70 rounded-2xl border border-[#EADCCE] p-3 sm:p-4 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-lg bg-[#8B3A3A] text-[#FAF2E9] flex items-center justify-center">
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <span className="text-xs font-bold text-[#2B1810] block">
                          {language === 'np' ? 'गुगल म्याप लोकेसन तथा डेलिभरी मार्ग' : 'Google Map Narrowing & Dispatch Transit'}
                        </span>
                        <span className="text-[11px] text-[#6B564C]">
                          {selectedCity.nameEn} ({selectedCity.districtEn}), {selectedProvince.nameEn}
                        </span>
                      </div>
                    </div>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(selectedCity.mapQuery)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-[#8B3A3A] hover:underline inline-flex items-center gap-1 bg-[#FFF9F3] px-2.5 py-1 rounded-lg border border-[#EADCCE]"
                    >
                      <span>{language === 'np' ? 'ठूलो नक्सा खोल्नुहोस्' : 'Open in Maps'}</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {/* Interactive Embedded Google Map */}
                  <div className="relative w-full h-36 sm:h-44 rounded-xl overflow-hidden border border-[#EADCCE] bg-[#E8DEC8]/40 shadow-inner">
                    <iframe
                      title={`Google Map - ${selectedCity.nameEn}`}
                      width="100%"
                      height="100%"
                      loading="lazy"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent(
                        `${selectedCity.mapQuery}, Nepal`
                      )}&t=&z=12&ie=UTF8&iwloc=&output=embed`}
                      className="border-0 w-full h-full filter contrast-95 opacity-90"
                    />
                    <div className="absolute bottom-2 left-2 right-2 bg-[#2B1810]/85 backdrop-blur-sm text-white px-3 py-1.5 rounded-lg text-[11px] flex items-center justify-between pointer-events-none">
                      <div className="flex items-center gap-1.5 truncate">
                        <Compass className="w-3.5 h-3.5 text-[#D4AF37] flex-shrink-0 animate-spin-slow" />
                        <span className="truncate font-medium">
                          Kathmandu Atelier Hub ➔ {selectedCity.nameEn}
                        </span>
                      </div>
                      <span className="text-[#D4AF37] font-bold whitespace-nowrap ml-2">
                        {language === 'np' ? selectedCity.estimatedDeliveryNp : selectedCity.estimatedDelivery}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-[11px] pt-0.5">
                    <div className="bg-[#FFF9F3] p-2 rounded-xl border border-[#EADCCE]">
                      <span className="text-[#6B564C] block font-medium">{language === 'np' ? 'कुरियर सेवा' : 'Logistics Route'}</span>
                      <span className="font-bold text-[#2B1810]">
                        {selectedCity.id.includes('jumla') || selectedCity.id.includes('dolpa') || selectedCity.id.includes('mugu') || selectedCity.id.includes('humla') || selectedCity.id.includes('manang') || selectedCity.id.includes('mustang') ? 'Himalayan Air/Surface Post' : 'Direct Express Cargo'}
                      </span>
                    </div>
                    <div className="bg-[#FFF9F3] p-2 rounded-xl border border-[#EADCCE]">
                      <span className="text-[#6B564C] block font-medium">{language === 'np' ? 'अनुमानित समय' : 'Estimated Arrival'}</span>
                      <span className="font-bold text-[#8B3A3A]">
                        {language === 'np' ? selectedCity.estimatedDeliveryNp : selectedCity.estimatedDelivery}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Street Address / Landmark */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C] flex justify-between">
                    <span>{language === 'np' ? 'ठेगाना तथा नजिकको चोक/ल्याण्डमार्क *' : 'Street Address & Nearest Landmark *'}</span>
                    {formErrors.addressLine && (
                      <span className="text-red-600 text-[11px] normal-case flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" /> {formErrors.addressLine}
                      </span>
                    )}
                  </label>
                  <input
                    id="checkout-address-input"
                    type="text"
                    required
                    value={addressLine}
                    onChange={(e) => {
                      setAddressLine(e.target.value);
                      if (formErrors.addressLine) setFormErrors((p) => ({ ...p, addressLine: '' }));
                    }}
                    placeholder={
                      language === 'np'
                        ? 'उदा. नयाँ बानेश्वर, पानी ट्याङ्की नजिक घर नं. १२'
                        : 'e.g. Near Patan Dhoka, Ward 5, House #12'
                    }
                    className={`w-full px-3.5 py-2.5 bg-[#FAF2E9] border rounded-xl text-sm font-semibold text-[#2B1810] focus:ring-2 focus:ring-[#8B3A3A] focus:outline-none transition-all ${
                      formErrors.addressLine ? 'border-red-400 bg-red-50/40' : 'border-[#EADCCE]'
                    }`}
                  />
                </div>

                {/* Delivery Notes */}
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C]">
                    {language === 'np' ? 'डेलिभरी निर्देशन (वैकल्पिक)' : 'Delivery Instructions (Optional)'}
                  </label>
                  <input
                    id="checkout-notes-input"
                    type="text"
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder={
                      language === 'np'
                        ? 'उदा. दिउँसो २ बजेपछि ल्याउनुहोला / फोन गरेर आउनुहोला'
                        : 'e.g. Please call before arrival / Deliver after 2 PM'
                    }
                    className="w-full px-3.5 py-2 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-xs text-[#2B1810] focus:ring-2 focus:ring-[#8B3A3A] focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Step 2: Local Nepali Payment Options */}
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EADCCE] shadow-xs space-y-4">
              <div className="flex items-center gap-2.5 pb-2 border-b border-[#FAF2E9]">
                <div className="w-7 h-7 rounded-full bg-[#8B3A3A] text-white text-xs font-bold flex items-center justify-center">
                  2
                </div>
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-[#2B1810]">
                    {language === 'np' ? 'नेपाली भुक्तानी माध्यम छान्नुहोस्' : 'Select Local Nepali Payment Method'}
                  </h2>
                  <p className="text-xs text-[#6B564C]">
                    {language === 'np'
                      ? 'eSewa, Khalti, Fonepay QR वा क्यास अन डेलिभरी'
                      : 'Verified local wallets, instant QR scan, or Cash on Delivery'}
                  </p>
                </div>
              </div>

              {/* Payment Method Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                
                {/* 1. eSewa */}
                <div
                  id="pay-method-esewa-card"
                  onClick={() => setPaymentMethod('esewa')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'esewa'
                      ? 'border-[#60BB46] bg-emerald-50/60 shadow-xs'
                      : 'border-[#EADCCE] hover:border-[#60BB46]/50 bg-[#FAF2E9]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#60BB46] text-white flex items-center justify-center font-bold text-base shadow-2xs">
                        e
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#2B1810]">eSewa ePay</h4>
                        <span className="text-[11px] text-emerald-700 font-semibold">
                          {language === 'np' ? 'नेपालको प्रमुख वालेट' : 'Digital Wallet & Netbanking'}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'esewa'
                          ? 'border-[#60BB46] bg-[#60BB46] text-white'
                          : 'border-[#EADCCE]'
                      }`}
                    >
                      {paymentMethod === 'esewa' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6B564C] mt-2.5 leading-relaxed">
                    {language === 'np'
                      ? 'eSewa फारम पेलोड जेनेरेटर सहित तत्काल भुक्तानी।'
                      : 'Auto-generates verified eSewa ePay gateway form payload.'}
                  </p>
                </div>

                {/* 2. Khalti */}
                <div
                  id="pay-method-khalti-card"
                  onClick={() => setPaymentMethod('khalti')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'khalti'
                      ? 'border-[#5D2E8E] bg-purple-50/60 shadow-xs'
                      : 'border-[#EADCCE] hover:border-[#5D2E8E]/50 bg-[#FAF2E9]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#5D2E8E] text-[#D4AF37] flex items-center justify-center font-bold text-base shadow-2xs">
                        K
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#2B1810]">Khalti Wallet</h4>
                        <span className="text-[11px] text-purple-700 font-semibold">
                          {language === 'np' ? 'पपअप चेकआउट' : 'Instant Checkout Popup'}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'khalti'
                          ? 'border-[#5D2E8E] bg-[#5D2E8E] text-white'
                          : 'border-[#EADCCE]'
                      }`}
                    >
                      {paymentMethod === 'khalti' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6B564C] mt-2.5 leading-relaxed">
                    {language === 'np'
                      ? 'Khalti पपअप विजेट, मोबाइल र MPIN/OTP मार्फत भुक्तानी।'
                      : 'Interactive modal with mobile number and Khalti OTP simulation.'}
                  </p>
                </div>

                {/* 3. Fonepay QR */}
                <div
                  id="pay-method-fonepay-card"
                  onClick={() => setPaymentMethod('fonepay')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'fonepay'
                      ? 'border-[#D92525] bg-red-50/60 shadow-xs'
                      : 'border-[#EADCCE] hover:border-[#D92525]/50 bg-[#FAF2E9]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#D92525] text-white flex items-center justify-center shadow-2xs">
                        <QrCode className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#2B1810]">Fonepay QR</h4>
                        <span className="text-[11px] text-red-700 font-semibold">
                          {language === 'np' ? 'सबै बैंक एपबाट स्क्यान' : 'Any Mobile Banking App'}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'fonepay'
                          ? 'border-[#D92525] bg-[#D92525] text-white'
                          : 'border-[#EADCCE]'
                      }`}
                    >
                      {paymentMethod === 'fonepay' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6B564C] mt-2.5 leading-relaxed">
                    {language === 'np'
                      ? 'डायनामिक QR कोड र भुक्तानी स्क्रिनसट प्रमाण अपलोड।'
                      : 'Dynamic QR modal with bank receipt screenshot proof upload.'}
                  </p>
                </div>

                {/* 4. Cash on Delivery (COD) */}
                <div
                  id="pay-method-cod-card"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-[#8B3A3A] bg-[#FAF2E9] shadow-xs'
                      : 'border-[#EADCCE] hover:border-[#8B3A3A]/50 bg-[#FAF2E9]/40'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2.5">
                      <div className="w-9 h-9 rounded-xl bg-[#8B3A3A] text-white flex items-center justify-center shadow-2xs">
                        <Banknote className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-[#2B1810]">Cash on Delivery</h4>
                        <span className="text-[11px] text-[#8B3A3A] font-semibold">
                          {language === 'np' ? 'घरमै नगद भुक्तानी' : 'Pay at Doorstep'}
                        </span>
                      </div>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        paymentMethod === 'cod'
                          ? 'border-[#8B3A3A] bg-[#8B3A3A] text-white'
                          : 'border-[#EADCCE]'
                      }`}
                    >
                      {paymentMethod === 'cod' && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                  <p className="text-[11px] text-[#6B564C] mt-2.5 leading-relaxed">
                    {language === 'np'
                      ? 'सामान हातमा आएपछि मात्र नगद वा मोबाइल QR मार्फत तिर्नुहोस्।'
                      : 'Pay upon delivery at your doorstep via cash or delivery rider QR.'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: Order Summary Card (5 cols on lg) */}
          <div className="lg:col-span-5 space-y-6">
            
            <div className="bg-white rounded-3xl p-5 sm:p-7 border border-[#EADCCE] shadow-lg sticky top-24 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-[#FAF2E9]">
                <h3 className="font-bold text-base text-[#2B1810] flex items-center gap-2">
                  <ShoppingBag className="w-4 h-4 text-[#8B3A3A]" />
                  <span>{language === 'np' ? 'अर्डर सारांश' : 'Order Summary'}</span>
                </h3>
                <span className="text-xs font-bold text-[#6B564C]">
                  {cart.length} {language === 'np' ? 'थान सामान' : 'items'}
                </span>
              </div>

              {/* Scrollable Items List */}
              <div className="max-h-60 overflow-y-auto divide-y divide-[#FAF2E9] space-y-2.5 pr-1">
                {cart.map((item, idx) => (
                  <div key={idx} className="pt-2.5 first:pt-0 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title[language]}
                        className="w-12 h-12 object-cover rounded-xl border border-[#EADCCE] shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#2B1810] truncate max-w-[170px] sm:max-w-[200px]">
                          {item.product.title[language]}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5 text-[11px] text-[#6B564C]">
                          <span className="font-bold text-[#8B3A3A] bg-[#FAF2E9] px-1.5 py-0.5 rounded">
                            {item.selectedSize}
                          </span>
                          <span>Qty: {item.quantity}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <span className="font-serif-luxury font-bold text-xs sm:text-sm text-[#2B1810]">
                        {formatPrice(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Code Input */}
              <form onSubmit={handleApplyCoupon} className="pt-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="w-3.5 h-3.5 text-[#6B564C] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      id="checkout-coupon-input"
                      type="text"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      placeholder={language === 'np' ? 'कुपन कोड (उदा. DAWOSTI10)' : 'Promo Code (e.g. DAWOSTI10)'}
                      className="w-full pl-9 pr-3 py-2 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-xs font-mono uppercase font-bold text-[#2B1810] focus:ring-2 focus:ring-[#8B3A3A] focus:outline-none"
                    />
                  </div>
                  <button
                    id="apply-coupon-btn"
                    type="submit"
                    className="px-3.5 py-2 bg-[#2B1810] hover:bg-[#8B3A3A] text-white text-xs font-bold rounded-xl transition-colors shadow-2xs"
                  >
                    {language === 'np' ? 'लागू' : 'Apply'}
                  </button>
                </div>
                {couponMessage && (
                  <p
                    className={`text-[11px] mt-1.5 ${
                      couponMessage.isError ? 'text-red-600' : 'text-emerald-700 font-semibold'
                    }`}
                  >
                    {couponMessage.text}
                  </p>
                )}
              </form>

              {/* Calculations Breakdown */}
              <div className="space-y-2 pt-3 border-t border-[#EADCCE] text-xs">
                <div className="flex justify-between text-[#6B564C]">
                  <span>{language === 'np' ? 'सामानको रकम (Subtotal)' : 'Subtotal'}</span>
                  <span className="font-bold font-mono text-[#2B1810]">{formatPrice(cartSubtotal)}</span>
                </div>

                {appliedDiscount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-semibold">
                    <span>{language === 'np' ? 'कुपन छुट (Discount)' : 'Promo Discount'}</span>
                    <span className="font-mono">-{formatPrice(appliedDiscount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-[#6B564C]">
                  <span>{language === 'np' ? 'डेलिभरी शुल्क' : 'Delivery across Nepal'}</span>
                  <span>
                    {deliveryFee === 0 ? (
                      <span className="text-emerald-700 font-bold">
                        {language === 'np' ? 'निःशुल्क (FREE)' : 'FREE'}
                      </span>
                    ) : (
                      <span className="font-mono">{formatPrice(deliveryFee)}</span>
                    )}
                  </span>
                </div>

                <div className="flex justify-between text-base font-bold text-[#2B1810] pt-2 border-t border-[#EADCCE]">
                  <span>{language === 'np' ? 'कुल भुक्तानी रकम' : 'Total Payable'}</span>
                  <span className="text-xl font-serif-luxury text-[#8B3A3A]">
                    {formatPrice(totalPayable)}
                  </span>
                </div>
              </div>

              {/* Main Submit Button matching chosen payment method */}
              <button
                id="checkout-submit-order-btn"
                type="button"
                onClick={handleProceedPayment}
                className={`w-full min-h-[50px] py-3.5 px-6 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 transition-all active:scale-[0.97] text-white ${
                  paymentMethod === 'esewa'
                    ? 'bg-[#60BB46] hover:bg-[#50a339]'
                    : paymentMethod === 'khalti'
                    ? 'bg-[#5D2E8E] hover:bg-[#4d2477]'
                    : paymentMethod === 'fonepay'
                    ? 'bg-[#D92525] hover:bg-[#b01818]'
                    : 'bg-[#8B3A3A] hover:bg-[#722E2E]'
                }`}
              >
                {paymentMethod === 'esewa' && (
                  <>
                    <span>{language === 'np' ? `eSewa बाट तिर्नुहोस् (${formatPrice(totalPayable)})` : `Pay with eSewa (${formatPrice(totalPayable)})`}</span>
                  </>
                )}
                {paymentMethod === 'khalti' && (
                  <>
                    <span>{language === 'np' ? `Khalti बाट तिर्नुहोस् (${formatPrice(totalPayable)})` : `Pay with Khalti (${formatPrice(totalPayable)})`}</span>
                  </>
                )}
                {paymentMethod === 'fonepay' && (
                  <>
                    <QrCode className="w-4 h-4" />
                    <span>{language === 'np' ? `Fonepay QR स्क्यान (${formatPrice(totalPayable)})` : `Scan Fonepay QR (${formatPrice(totalPayable)})`}</span>
                  </>
                )}
                {paymentMethod === 'cod' && (
                  <>
                    <Truck className="w-4 h-4" />
                    <span>{language === 'np' ? `अर्डर पुष्टि गर्नुहोस् (${formatPrice(totalPayable)})` : `Confirm COD Order (${formatPrice(totalPayable)})`}</span>
                  </>
                )}
              </button>

              {/* Secondary WhatsApp Fallback */}
              <div className="text-center pt-2">
                <a
                  href={`https://wa.me/977970825194?text=${encodeURIComponent(
                    `🙏 *Namaste DAWOSTI Boutique Kathmandu!*
📞 Helpline: +977 970825194

🇬🇧 *English:*
Hi, I need help with checkout. My name is ${fullName || 'Customer'}. Total payable is ${formatPrice(totalPayable)}. Please guide me!

🇳🇵 *नेपाली:*
नमस्ते, मलाई चेकआउटमा सहयोग चाहिएको छ। मेरो नाम ${fullName || 'ग्राहक'} हो र जम्मा रकम ${formatPrice(totalPayable)} छ। कृपया मलाई गाइड गरिदिनुहोला!`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-[#25D366] hover:underline font-bold inline-flex items-center gap-1.5"
                >
                  <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
                  <span>{language === 'np' ? 'व्हाट्सएप (९७०८२५१९४) बाट अर्डर सहायता लिनुहोस्' : 'Need help? WhatsApp Guide (+977 970825194)'}</span>
                </a>
              </div>

              {/* Security note */}
              <div className="text-[11px] text-[#6B564C] text-center pt-2 border-t border-[#FAF2E9]">
                <span>
                  {language === 'np'
                    ? 'काठमाडौँ उपत्यकामा २४ घण्टा भित्र डेलिभरी • १००% गुणस्तर ग्यारेन्टी'
                    : '24-hour delivery inside Kathmandu valley • 100% Nepali Handloom'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Local Payment Integration Modals */}
      <EsewaModal
        isOpen={isEsewaModalOpen}
        onClose={() => setIsEsewaModalOpen(false)}
        orderNumber={generatedOrderRef}
        subtotal={cartSubtotal}
        deliveryFee={deliveryFee}
        discountAmount={appliedDiscount}
        totalAmount={totalPayable}
        cart={cart}
        language={language}
        onPaymentSuccess={handleEsewaSuccess}
      />

      <KhaltiModal
        isOpen={isKhaltiModalOpen}
        onClose={() => setIsKhaltiModalOpen(false)}
        orderNumber={generatedOrderRef}
        totalAmount={totalPayable}
        initialPhone={phone}
        language={language}
        onPaymentSuccess={handleKhaltiSuccess}
      />

      <FonepayModal
        isOpen={isFonepayModalOpen}
        onClose={() => setIsFonepayModalOpen(false)}
        orderNumber={generatedOrderRef}
        totalAmount={totalPayable}
        language={language}
        onPaymentSuccess={handleFonepaySuccess}
      />
    </div>
  );
};
