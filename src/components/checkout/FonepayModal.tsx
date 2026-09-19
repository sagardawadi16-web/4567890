import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  QrCode,
  Upload,
  CheckCircle2,
  ShieldCheck,
  Trash2,
  Smartphone,
  AlertCircle,
  Download,
  Maximize2,
  Copy,
  Check,
  Camera,
  Layers,
} from 'lucide-react';
import { FonepayProof, Language } from '../../types';
import { useShopStore } from '../../store/shopStore';

interface FonepayModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  totalAmount: number;
  language: Language;
  onPaymentSuccess: (proof: FonepayProof) => void;
}

export const FonepayModal: React.FC<FonepayModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  totalAmount,
  language,
  onPaymentSuccess,
}) => {
  const { merchantSettings } = useShopStore();

  // Mode: 'dynamic' (generated QR with order amount) or 'static' (uploaded/admin standee photo)
  const [qrMode, setQrMode] = useState<'dynamic' | 'static'>(
    merchantSettings.useStaticQrByDefault ? 'static' : 'dynamic'
  );

  const [referenceId, setReferenceId] = useState('');
  const [payerBank, setPayerBank] = useState('');
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isZoomModalOpen, setIsZoomModalOpen] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync mode if merchant default changes
  useEffect(() => {
    if (merchantSettings.useStaticQrByDefault) {
      setQrMode('static');
    }
  }, [merchantSettings.useStaticQrByDefault]);

  if (!isOpen) return null;

  const handleCopyText = (text: string, fieldId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldId);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const handleDownloadQr = () => {
    const link = document.createElement('a');
    link.href = merchantSettings.staticQrImage;
    link.download = `dawosti_fonepay_qr_${orderNumber}.png`;
    link.click();
  };

  const handleFileChange = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setError(
        language === 'np'
          ? 'कृपया तस्बिर (JPG, PNG) मात्र अपलोड गर्नुहोस्'
          : 'Please upload an image file (JPG, PNG, WebP)'
      );
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError(
        language === 'np'
          ? 'फाइल १० एमबी भन्दा सानो हुनुपर्छ'
          : 'File size must be under 10MB'
      );
      return;
    }
    setError('');
    setScreenshotFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!referenceId.trim()) {
      setError(
        language === 'np'
          ? 'कृपया बैंक ट्रान्जेक्सन / UTR नम्बर राख्नुहोस्'
          : 'Please enter bank transaction / UTR reference number'
      );
      return;
    }
    if (!screenshotPreview) {
      setError(
        language === 'np'
          ? 'कृपया भुक्तानीको स्क्रिनसट अपलोड गर्नुहोस्'
          : 'Please upload the payment confirmation screenshot'
      );
      return;
    }

    setError('');
    setIsSubmitting(true);

    setTimeout(() => {
      setIsSubmitting(false);
      const proof: FonepayProof = {
        referenceId: referenceId.trim().toUpperCase(),
        screenshotUrl: screenshotPreview,
        screenshotName: screenshotFileName || 'fonepay_receipt.jpg',
        payerBank: payerBank.trim() || 'Nepali Commercial Bank',
        uploadedAt: new Date().toISOString(),
      };
      onPaymentSuccess(proof);
    }, 900);
  };

  // Quick demo auto-fill
  const handleAutoFillProof = () => {
    setReferenceId(`FP-${Math.floor(10000000 + Math.random() * 90000000)}`);
    setPayerBank('NIC Asia MoBank');
    setScreenshotPreview(
      'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="180" viewBox="0 0 300 180"><rect width="300" height="180" fill="%23f0fdf4" rx="10"/><rect x="15" y="15" width="270" height="150" fill="%23ffffff" stroke="%2322c55e" stroke-width="2" rx="8"/><text x="150" y="45" font-family="sans-serif" font-weight="bold" font-size="14" fill="%2315803d" text-anchor="middle">FONEPAY PAYMENT SUCCESS</text><text x="150" y="75" font-family="sans-serif" font-size="12" fill="%23334155" text-anchor="middle">Dawosti Kathmandu Boutique</text><text x="150" y="105" font-family="sans-serif" font-weight="bold" font-size="16" fill="%230f172a" text-anchor="middle">NPR ' +
        totalAmount.toLocaleString('en-US') +
        '</text><text x="150" y="135" font-family="sans-serif" font-size="11" fill="%2364748b" text-anchor="middle">Ref: FP-VERIFIED</text></svg>'
    );
    setScreenshotFileName('fonepay_verified_slip.svg');
    setError('');
  };

  return (
    <>
      <div
        id="fonepay-modal-overlay"
        className="fixed inset-0 z-50 overflow-y-auto bg-black/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
        role="dialog"
        aria-modal="true"
        aria-labelledby="fonepay-modal-title"
      >
        <div
          id="fonepay-modal-content"
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-red-100 overflow-hidden duration-200 max-h-[94vh] flex flex-col animate-scaleUp"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-[#D92525] to-[#B01818] px-5 sm:px-6 py-4 text-white flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-xs shrink-0">
                <QrCode className="w-6 h-6 text-[#D92525]" />
              </div>
              <div>
                <h3 id="fonepay-modal-title" className="font-bold text-base tracking-wide text-white">
                  Fonepay QR Payment
                </h3>
                <p className="text-red-100 text-xs">
                  {language === 'np'
                    ? 'सबै नेपाली मोबाइल बैंकिङ र वालेटबाट सहज भुक्तानी'
                    : 'Pay via any Nepali Mobile Banking or Wallet'}
                </p>
              </div>
            </div>
            <button
              id="close-fonepay-modal-btn"
              onClick={onClose}
              className="min-h-[44px] min-w-[44px] rounded-xl bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-all active:scale-[0.97]"
              aria-label="Close Fonepay Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* QR Method Segmented Switcher (Dynamic vs Fallback Static Standee) */}
          <div className="bg-[#FAF2E9] px-4 sm:px-6 py-2.5 border-b border-[#EADCCE] flex items-center justify-between gap-2 shrink-0">
            <div className="flex p-1 bg-white rounded-xl border border-[#EADCCE] w-full">
              <button
                type="button"
                id="btn-mode-dynamic-qr"
                onClick={() => setQrMode('dynamic')}
                className={`flex-1 min-h-[40px] py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.97] ${
                  qrMode === 'dynamic'
                    ? 'bg-[#D92525] text-white shadow-xs'
                    : 'text-[#6B564C] hover:text-[#2B1810]'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                <span>{language === 'np' ? '⚡ अटो रकम QR (Dynamic)' : '⚡ Dynamic QR'}</span>
              </button>

              <button
                type="button"
                id="btn-mode-static-qr"
                onClick={() => setQrMode('static')}
                className={`flex-1 min-h-[40px] py-1.5 px-3 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 active:scale-[0.97] ${
                  qrMode === 'static'
                    ? 'bg-[#D92525] text-white shadow-xs'
                    : 'text-[#6B564C] hover:text-[#2B1810]'
                }`}
              >
                <Camera className="w-3.5 h-3.5" />
                <span>{language === 'np' ? '📷 काउन्टर स्ट्यान्डी QR (Static)' : '📷 Static Standee Photo'}</span>
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-[#2B1810]">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* QR Code Presentation Box */}
            {qrMode === 'dynamic' ? (
              /* DYNAMIC QR CARD */
              <div className="bg-[#FAF2E9] border-2 border-dashed border-[#D4AF37]/80 rounded-2xl p-4 text-center flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B3A3A]">
                    {merchantSettings.merchantName}
                  </span>
                </div>

                {/* SVG QR Code */}
                <div className="relative p-3 bg-white rounded-2xl shadow-md border border-[#EADCCE] inline-block my-1">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-44 h-44 sm:w-48 sm:h-48"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <rect width="200" height="200" fill="#ffffff" />
                    <rect x="15" y="15" width="46" height="46" fill="#D92525" rx="6" />
                    <rect x="23" y="23" width="30" height="30" fill="#ffffff" rx="3" />
                    <rect x="30" y="30" width="16" height="16" fill="#D92525" rx="2" />
                    <rect x="139" y="15" width="46" height="46" fill="#D92525" rx="6" />
                    <rect x="147" y="23" width="30" height="30" fill="#ffffff" rx="3" />
                    <rect x="154" y="30" width="16" height="16" fill="#D92525" rx="2" />
                    <rect x="15" y="139" width="46" height="46" fill="#D92525" rx="6" />
                    <rect x="23" y="147" width="30" height="30" fill="#ffffff" rx="3" />
                    <rect x="30" y="154" width="16" height="16" fill="#D92525" rx="2" />
                    <g fill="#2B1810">
                      <rect x="68" y="20" width="8" height="8" rx="1.5" />
                      <rect x="80" y="20" width="14" height="8" rx="1.5" />
                      <rect x="100" y="20" width="8" height="8" rx="1.5" />
                      <rect x="114" y="20" width="12" height="8" rx="1.5" />
                      <rect x="68" y="34" width="12" height="8" rx="1.5" />
                      <rect x="86" y="34" width="8" height="8" rx="1.5" />
                      <rect x="100" y="34" width="16" height="8" rx="1.5" />
                      <rect x="122" y="34" width="8" height="8" rx="1.5" />
                      <rect x="68" y="48" width="8" height="8" rx="1.5" />
                      <rect x="82" y="48" width="16" height="8" rx="1.5" />
                      <rect x="104" y="48" width="8" height="8" rx="1.5" />
                      <rect x="118" y="48" width="12" height="8" rx="1.5" />
                      <rect x="20" y="68" width="14" height="8" rx="1.5" />
                      <rect x="40" y="68" width="8" height="8" rx="1.5" />
                      <rect x="54" y="68" width="18" height="8" rx="1.5" />
                      <rect x="78" y="68" width="10" height="8" rx="1.5" />
                      <rect x="94" y="68" width="14" height="8" rx="1.5" />
                      <rect x="114" y="68" width="22" height="8" rx="1.5" />
                      <rect x="142" y="68" width="8" height="8" rx="1.5" />
                      <rect x="156" y="68" width="16" height="8" rx="1.5" />
                      <rect x="20" y="82" width="8" height="8" rx="1.5" />
                      <rect x="34" y="82" width="22" height="8" rx="1.5" />
                      <rect x="62" y="82" width="10" height="8" rx="1.5" />
                      <rect x="128" y="82" width="14" height="8" rx="1.5" />
                      <rect x="148" y="82" width="10" height="8" rx="1.5" />
                      <rect x="164" y="82" width="18" height="8" rx="1.5" />
                      <rect x="20" y="96" width="18" height="8" rx="1.5" />
                      <rect x="44" y="96" width="10" height="8" rx="1.5" />
                      <rect x="60" y="96" width="12" height="8" rx="1.5" />
                      <rect x="128" y="96" width="8" height="8" rx="1.5" />
                      <rect x="142" y="96" width="22" height="8" rx="1.5" />
                      <rect x="170" y="96" width="12" height="8" rx="1.5" />
                      <rect x="20" y="110" width="10" height="8" rx="1.5" />
                      <rect x="36" y="110" width="14" height="8" rx="1.5" />
                      <rect x="56" y="110" width="8" height="8" rx="1.5" />
                      <rect x="70" y="110" width="20" height="8" rx="1.5" />
                      <rect x="96" y="110" width="10" height="8" rx="1.5" />
                      <rect x="112" y="110" width="16" height="8" rx="1.5" />
                      <rect x="134" y="110" width="12" height="8" rx="1.5" />
                      <rect x="152" y="110" width="18" height="8" rx="1.5" />
                      <rect x="68" y="124" width="16" height="8" rx="1.5" />
                      <rect x="90" y="124" width="8" height="8" rx="1.5" />
                      <rect x="104" y="124" width="14" height="8" rx="1.5" />
                      <rect x="124" y="124" width="10" height="8" rx="1.5" />
                      <rect x="140" y="124" width="20" height="8" rx="1.5" />
                      <rect x="166" y="124" width="16" height="8" rx="1.5" />
                      <rect x="68" y="140" width="8" height="8" rx="1.5" />
                      <rect x="82" y="140" width="22" height="8" rx="1.5" />
                      <rect x="110" y="140" width="12" height="8" rx="1.5" />
                      <rect x="128" y="140" width="14" height="8" rx="1.5" />
                      <rect x="148" y="140" width="8" height="8" rx="1.5" />
                      <rect x="162" y="140" width="20" height="8" rx="1.5" />
                      <rect x="68" y="156" width="14" height="8" rx="1.5" />
                      <rect x="88" y="156" width="10" height="8" rx="1.5" />
                      <rect x="104" y="156" width="18" height="8" rx="1.5" />
                      <rect x="128" y="156" width="8" height="8" rx="1.5" />
                      <rect x="142" y="156" width="24" height="8" rx="1.5" />
                      <rect x="172" y="156" width="10" height="8" rx="1.5" />
                      <rect x="68" y="172" width="20" height="8" rx="1.5" />
                      <rect x="94" y="172" width="12" height="8" rx="1.5" />
                      <rect x="112" y="172" width="16" height="8" rx="1.5" />
                      <rect x="134" y="172" width="10" height="8" rx="1.5" />
                      <rect x="150" y="172" width="16" height="8" rx="1.5" />
                      <rect x="172" y="172" width="10" height="8" rx="1.5" />
                    </g>
                    <circle cx="100" cy="100" r="18" fill="#ffffff" stroke="#D92525" stroke-width="2.5" />
                    <text
                      x="100"
                      y="105"
                      font-family="sans-serif"
                      font-weight="900"
                      font-size="11"
                      fill="#D92525"
                      text-anchor="middle"
                    >
                      fone
                    </text>
                  </svg>
                </div>

                <div className="mt-2 space-y-0.5">
                  <span className="text-2xl font-extrabold text-[#8B3A3A] font-serif-luxury">
                    रु {totalAmount.toLocaleString('en-US')}
                  </span>
                  <p className="text-[11px] font-mono text-[#6B564C]">
                    {language === 'np' ? 'बिल नम्बर:' : 'Bill Ref:'}{' '}
                    <span className="font-bold text-[#2B1810]">{orderNumber}</span>
                  </p>
                </div>

                <div className="mt-2 text-[11px] text-[#6B564C] flex items-center justify-center gap-1.5 flex-wrap">
                  <Smartphone className="w-3.5 h-3.5 text-red-600" />
                  <span>NIC Asia • Nabil • Global IME • Sanima • Everest • Any Bank</span>
                </div>
              </div>
            ) : (
              /* STATIC MERCHANT STAND-IN PHOTO CARD */
              <div className="bg-[#FAF2E9] border-2 border-dashed border-[#8B3A3A] rounded-2xl p-4 text-center flex flex-col items-center">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-[#8B3A3A]">
                    Official Boutique Merchant Standee
                  </span>
                  <span className="text-[10px] bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded-full">
                    Fallback QR Photo
                  </span>
                </div>

                {/* Static Image Box with Zoom & Download buttons */}
                <div className="relative p-2 bg-white rounded-2xl shadow-md border border-[#EADCCE] inline-block my-1 max-w-[240px] group">
                  <img
                    src={merchantSettings.staticQrImage}
                    alt="Official Fonepay Merchant Standee"
                    className="w-full h-auto max-h-[250px] object-contain rounded-xl"
                  />

                  {/* Hover / Touch Quick Action Bar */}
                  <div className="flex items-center justify-center gap-2 mt-2 pt-2 border-t border-[#EADCCE]">
                    <button
                      type="button"
                      id="btn-zoom-static-qr"
                      onClick={() => setIsZoomModalOpen(true)}
                      className="min-h-[38px] px-3 rounded-lg bg-[#FAF2E9] hover:bg-[#EADCCE] text-[#2B1810] text-xs font-bold flex items-center gap-1 transition-all active:scale-[0.97]"
                      title="Zoom full screen"
                    >
                      <Maximize2 className="w-3.5 h-3.5 text-[#8B3A3A]" />
                      <span>Zoom</span>
                    </button>

                    <button
                      type="button"
                      id="btn-download-static-qr"
                      onClick={handleDownloadQr}
                      className="min-h-[38px] px-3 rounded-lg bg-[#8B3A3A] hover:bg-[#722E2E] text-white text-xs font-bold flex items-center gap-1 transition-all active:scale-[0.97]"
                      title="Download QR photo"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>

                {/* Instructions text */}
                <p className="text-xs text-[#6B564C] mt-2 max-w-sm">
                  {language === 'np'
                    ? merchantSettings.qrInstructionsNp
                    : merchantSettings.qrInstructionsEn}
                </p>

                {/* Merchant Account Details Card */}
                <div className="mt-3 w-full bg-white rounded-xl p-3 border border-[#EADCCE] text-left text-xs space-y-1.5 shadow-2xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6B564C]">Merchant:</span>
                    <span className="font-bold text-[#2B1810]">{merchantSettings.merchantName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#6B564C]">Bank:</span>
                    <span className="font-bold text-[#2B1810]">{merchantSettings.bankName}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#6B564C]">Account No:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#8B3A3A]">
                        {merchantSettings.accountNumber}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(merchantSettings.accountNumber, 'acc')}
                        className="p-1 hover:bg-[#FAF2E9] rounded-md text-[#6B564C] hover:text-[#8B3A3A] transition-colors"
                        title="Copy Account Number"
                      >
                        {copiedField === 'acc' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#6B564C]">PAN / IRD:</span>
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-[#2B1810]">
                        {merchantSettings.merchantPan}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopyText(merchantSettings.merchantPan, 'pan')}
                        className="p-1 hover:bg-[#FAF2E9] rounded-md text-[#6B564C] hover:text-[#8B3A3A] transition-colors"
                        title="Copy PAN"
                      >
                        {copiedField === 'pan' ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Form: Upload Payment Confirmation Screenshot & Reference ID */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* 1. Transaction / UTR ID */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C] flex items-center justify-between">
                  <span>
                    {language === 'np'
                      ? 'बैंक ट्रान्जेक्सन / UTR नम्बर *'
                      : 'Bank UTR / Transaction Reference ID *'}
                  </span>
                  <button
                    type="button"
                    onClick={handleAutoFillProof}
                    className="text-[11px] text-[#8B3A3A] hover:underline normal-case font-semibold"
                  >
                    {language === 'np' ? 'डेमो भर्नुहोस् (Auto-fill)' : 'Auto-fill Demo Proof'}
                  </button>
                </label>
                <input
                  id="fonepay-ref-input"
                  type="text"
                  required
                  value={referenceId}
                  onChange={(e) => setReferenceId(e.target.value)}
                  placeholder="e.g. FP-89421839 or UTR123456"
                  className="w-full min-h-[46px] px-3.5 py-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-sm font-mono font-bold text-[#2B1810] uppercase focus:ring-2 focus:ring-[#8B3A3A] focus:outline-hidden"
                />
              </div>

              {/* 2. Payer Bank (Optional) */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C]">
                  {language === 'np' ? 'तपाईँको बैंकको नाम (वैकल्पिक)' : 'Your Bank Name (Optional)'}
                </label>
                <input
                  id="fonepay-bank-input"
                  type="text"
                  value={payerBank}
                  onChange={(e) => setPayerBank(e.target.value)}
                  placeholder="e.g. NIC Asia Bank / Nabil Bank"
                  className="w-full min-h-[46px] px-3.5 py-2 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-xs font-semibold text-[#2B1810] focus:ring-2 focus:ring-[#8B3A3A] focus:outline-hidden"
                />
              </div>

              {/* 3. Screenshot Upload Box with Drag & Drop */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C]">
                  {language === 'np'
                    ? 'भुक्तानीको स्क्रिनसट प्रमाण (Screenshot Proof) *'
                    : 'Payment Screenshot Proof (Required) *'}
                </label>

                {screenshotPreview ? (
                  <div className="relative bg-[#FAF2E9] border border-[#EADCCE] rounded-2xl p-3 flex items-center justify-between">
                    <div className="flex items-center gap-3 min-w-0">
                      <img
                        src={screenshotPreview}
                        alt="Uploaded Receipt"
                        className="w-14 h-14 object-cover rounded-lg border border-[#EADCCE]"
                      />
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-[#2B1810] truncate max-w-[180px] sm:max-w-xs">
                          {screenshotFileName}
                        </p>
                        <span className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {language === 'np' ? 'स्क्रिनसट संलग्न भयो' : 'Screenshot attached'}
                        </span>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setScreenshotPreview(null);
                        setScreenshotFileName(null);
                      }}
                      className="min-h-[44px] min-w-[44px] text-[#6B564C] hover:text-red-700 rounded-lg hover:bg-white transition-colors flex items-center justify-center active:scale-[0.97]"
                      title="Remove Screenshot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-2xl p-4 text-center cursor-pointer transition-all ${
                      isDragging
                        ? 'border-[#8B3A3A] bg-[#8B3A3A]/5'
                        : 'border-[#EADCCE] hover:border-[#8B3A3A] bg-[#FAF2E9]/40 hover:bg-[#FAF2E9]'
                    }`}
                  >
                    <input
                      ref={fileInputRef}
                      id="fonepay-screenshot-file"
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileChange(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="flex flex-col items-center gap-2">
                      <div className="w-10 h-10 rounded-full bg-white border border-[#EADCCE] flex items-center justify-center text-[#8B3A3A] shadow-xs">
                        <Upload className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[#2B1810]">
                          {language === 'np'
                            ? 'यहाँ क्लिक गरी स्क्रिनसट छान्नुहोस्'
                            : 'Click to browse or drag & drop'}
                        </p>
                        <p className="text-[11px] text-[#6B564C] mt-0.5">
                          PNG, JPG, WEBP (Max 10MB)
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Submit Button (min 48px tap target + active:scale-[0.97]) */}
              <button
                id="submit-fonepay-proof-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] py-3 bg-[#D92525] hover:bg-[#b01818] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.97] disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>
                      {language === 'np'
                        ? 'प्रमाण सुरक्षित गरिँदैछ...'
                        : 'Validating Receipt Proof...'}
                    </span>
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>
                      {language === 'np'
                        ? 'भुक्तानी प्रमाण पेश गर्नुहोस् (Submit Proof)'
                        : 'Submit Fonepay Payment Proof'}
                    </span>
                  </>
                )}
              </button>
            </form>

            {/* Security Guarantee */}
            <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B564C] pt-2 border-t border-[#EADCCE]">
              <ShieldCheck className="w-3.5 h-3.5 text-red-600" />
              <span>
                {language === 'np'
                  ? 'नेपाल राष्ट्र बैंक स्वीकृत Fonepay QR मर्चेन्ट'
                  : 'Nepal Rastra Bank Certified Fonepay QR Merchant'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* FULLSCREEN STAND-IN QR ZOOM MODAL */}
      {isZoomModalOpen && (
        <div
          id="qr-zoom-modal-overlay"
          className="fixed inset-0 z-60 bg-black/90 flex flex-col items-center justify-center p-4"
          onClick={() => setIsZoomModalOpen(false)}
        >
          <div className="relative max-w-sm w-full bg-white rounded-3xl p-4 flex flex-col items-center shadow-2xl">
            <button
              onClick={() => setIsZoomModalOpen(false)}
              className="absolute top-3 right-3 min-h-[44px] min-w-[44px] rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 flex items-center justify-center"
              aria-label="Close zoom preview"
            >
              <X className="w-5 h-5" />
            </button>

            <h4 className="font-bold text-sm text-[#2B1810] mb-2 mt-1">
              {merchantSettings.merchantName}
            </h4>

            <img
              src={merchantSettings.staticQrImage}
              alt="High Res Standee QR"
              className="w-full max-h-[70vh] object-contain rounded-xl"
            />

            <button
              onClick={handleDownloadQr}
              className="mt-3 w-full min-h-[44px] bg-[#8B3A3A] hover:bg-[#722E2E] text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 transition-all active:scale-[0.97]"
            >
              <Download className="w-4 h-4" />
              <span>Download High-Res QR</span>
            </button>
          </div>
        </div>
      )}
    </>
  );
};
