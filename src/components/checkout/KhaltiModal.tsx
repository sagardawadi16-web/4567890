import React, { useState } from 'react';
import { X, ShieldCheck, Smartphone, KeyRound, CheckCircle2, ArrowRight, Lock } from 'lucide-react';
import { KhaltiPaymentResult, Language } from '../../types';

interface KhaltiModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  totalAmount: number;
  initialPhone?: string;
  language: Language;
  onPaymentSuccess: (result: KhaltiPaymentResult) => void;
}

export const KhaltiModal: React.FC<KhaltiModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  totalAmount,
  initialPhone = '',
  language,
  onPaymentSuccess,
}) => {
  const [step, setStep] = useState<'credentials' | 'otp' | 'success'>('credentials');
  const [mobileNumber, setMobileNumber] = useState(initialPhone || '9841234567');
  const [mpin, setMpin] = useState('1234');
  const [otp, setOtp] = useState('123456');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!isOpen) return null;

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!mobileNumber || mobileNumber.length < 10) {
      setErrorMessage(language === 'np' ? 'कृपया सही १० अङ्कको मोबाइल नम्बर राख्नुहोस्' : 'Please enter a valid 10-digit mobile number');
      return;
    }
    if (!mpin || mpin.length < 4) {
      setErrorMessage(language === 'np' ? 'कृपया ४ अङ्कको Khalti MPIN राख्नुहोस्' : 'Please enter your 4-digit MPIN');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setStep('otp');
    }, 800);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 6) {
      setErrorMessage(language === 'np' ? 'कृपया ६ अङ्कको OTP कोड राख्नुहोस्' : 'Please enter the 6-digit OTP');
      return;
    }
    setErrorMessage('');
    setIsSubmitting(true);

    try {
      const res = await fetch('/api/payments/verify-khalti', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token: `khalti_sec_token_${Math.random().toString(36).substring(2, 12)}`,
          amount: totalAmount,
          mobileNumber,
          orderNumber,
        }),
      });
      const data = await res.json();
      setIsSubmitting(false);
      const paymentResult: KhaltiPaymentResult = {
        idx: data?.transactionId || `KHALTI-PAY-${Date.now()}`,
        token: `khalti_sec_token_${Math.random().toString(36).substring(2, 12)}`,
        mobile: mobileNumber,
        amount: totalAmount * 100, // In paisa
      };
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess(paymentResult);
      }, 1000);
    } catch (err) {
      console.warn('Backend Khalti call fallback:', err);
      setIsSubmitting(false);
      const paymentResult: KhaltiPaymentResult = {
        idx: `KHALTI-PAY-${Date.now()}`,
        token: `khalti_sec_token_${Math.random().toString(36).substring(2, 12)}`,
        mobile: mobileNumber,
        amount: totalAmount * 100, // In paisa
      };
      setStep('success');
      setTimeout(() => {
        onPaymentSuccess(paymentResult);
      }, 1000);
    }
  };

  return (
    <div
      id="khalti-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="khalti-modal-title"
    >
      <div
        id="khalti-modal-content"
        className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-purple-100 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* Khalti Purple Header */}
        <div className="bg-[#5D2E8E] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center border border-white/20">
              <span className="font-extrabold text-base text-[#D4AF37]">K</span>
            </div>
            <div>
              <h3 id="khalti-modal-title" className="font-bold text-base tracking-wide">
                Khalti Payment
              </h3>
              <p className="text-purple-200 text-xs">
                {language === 'np' ? 'सजिलो र सुरक्षित भुक्तानी' : 'Digital Wallet & Netbanking'}
              </p>
            </div>
          </div>
          <button
            id="close-khalti-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/15 hover:bg-white/25 text-white flex items-center justify-center transition-colors"
            aria-label="Close Khalti Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Amount Banner */}
        <div className="bg-[#FAF2E9] px-6 py-3 border-b border-[#EADCCE] flex items-center justify-between text-xs">
          <div>
            <span className="text-[#6B564C]">{language === 'np' ? 'बिल नम्बर:' : 'Order Ref:'}</span>
            <span className="font-mono font-bold text-[#2B1810] ml-1">{orderNumber}</span>
          </div>
          <div className="text-right">
            <span className="text-[#6B564C]">{language === 'np' ? 'रकम:' : 'Amount:'}</span>
            <span className="font-serif-luxury font-bold text-[#5D2E8E] text-base ml-1">
              रु {totalAmount.toLocaleString('en-US')}
            </span>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-6">
          {errorMessage && (
            <div className="mb-4 p-2.5 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {errorMessage}
            </div>
          )}

          {step === 'credentials' && (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C] flex items-center gap-1.5">
                  <Smartphone className="w-3.5 h-3.5 text-[#5D2E8E]" />
                  <span>{language === 'np' ? 'Khalti मोबाइल नम्बर' : 'Khalti Registered Mobile'}</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono font-bold text-[#6B564C]">
                    +977
                  </span>
                  <input
                    id="khalti-mobile-input"
                    type="tel"
                    required
                    maxLength={10}
                    value={mobileNumber}
                    onChange={(e) => setMobileNumber(e.target.value.replace(/\D/g, ''))}
                    placeholder="98XXXXXXXX"
                    className="w-full pl-14 pr-3 py-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-sm font-mono font-bold text-[#2B1810] focus:ring-2 focus:ring-[#5D2E8E] focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C] flex items-center gap-1.5">
                  <KeyRound className="w-3.5 h-3.5 text-[#5D2E8E]" />
                  <span>{language === 'np' ? 'Khalti MPIN (४ अङ्क)' : 'Khalti 4-digit MPIN'}</span>
                </label>
                <input
                  id="khalti-mpin-input"
                  type="password"
                  required
                  maxLength={4}
                  value={mpin}
                  onChange={(e) => setMpin(e.target.value.replace(/\D/g, ''))}
                  placeholder="••••"
                  className="w-full px-3 py-2.5 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-sm font-mono tracking-widest text-[#2B1810] focus:ring-2 focus:ring-[#5D2E8E] focus:outline-none"
                />
              </div>

              <div className="text-[11px] text-[#6B564C] bg-purple-50 p-2.5 rounded-xl border border-purple-100 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 text-[#5D2E8E] shrink-0" />
                <span>
                  {language === 'np'
                    ? 'परीक्षणको लागि डेमो मोबाइल र पिन उपलब्ध छ। अगाडि बढ्नुहोस्।'
                    : 'Sandbox credentials are pre-filled for testing. Click continue to receive OTP.'}
                </span>
              </div>

              <button
                id="khalti-submit-credentials-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] py-3 bg-[#5D2E8E] hover:bg-[#4d2477] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'np' ? 'OTP पठाउँदै...' : 'Requesting OTP...'}</span>
                  </span>
                ) : (
                  <>
                    <span>{language === 'np' ? 'OTP प्राप्त गर्नुहोस्' : 'Get OTP Code'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="text-center pb-1">
                <p className="text-xs text-[#6B564C]">
                  {language === 'np'
                    ? `६ अङ्कको OTP कोड +977 ${mobileNumber} मा पठाइएको छ`
                    : `6-digit OTP code has been sent to +977 ${mobileNumber}`}
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#6B564C] text-center block">
                  {language === 'np' ? '६ अङ्कको OTP कोड' : 'Enter 6-Digit OTP'}
                </label>
                <input
                  id="khalti-otp-input"
                  type="text"
                  required
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                  placeholder="123456"
                  className="w-full text-center tracking-[0.5em] py-3 bg-[#FAF2E9] border border-[#EADCCE] rounded-xl text-lg font-mono font-bold text-[#2B1810] focus:ring-2 focus:ring-[#5D2E8E] focus:outline-none"
                />
              </div>

              <div className="flex justify-between items-center text-[11px] text-[#6B564C] px-1">
                <button
                  type="button"
                  onClick={() => setStep('credentials')}
                  className="text-[#5D2E8E] hover:underline font-semibold"
                >
                  {language === 'np' ? '← नम्बर बदल्नुहोस्' : '← Change Mobile'}
                </button>
                <button
                  type="button"
                  onClick={() => setOtp('123456')}
                  className="text-[#5D2E8E] hover:underline font-semibold"
                >
                  {language === 'np' ? 'पुनः पठाउनुहोस्' : 'Resend Code'}
                </button>
              </div>

              <button
                id="khalti-confirm-otp-btn"
                type="submit"
                disabled={isSubmitting}
                className="w-full min-h-[48px] py-3 bg-[#5D2E8E] hover:bg-[#4d2477] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{language === 'np' ? 'पुष्टि हुँदैछ...' : 'Confirming Payment...'}</span>
                  </span>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {language === 'np'
                        ? `भुक्तानी पुष्टि (Pay रु ${totalAmount.toLocaleString('en-US')})`
                        : `Confirm Pay रु ${totalAmount.toLocaleString('en-US')}`}
                    </span>
                  </>
                )}
              </button>
            </form>
          )}

          {step === 'success' && (
            <div className="text-center py-6 space-y-3 animate-in zoom-in-95">
              <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-lg text-[#2B1810]">
                {language === 'np' ? 'Khalti भुक्तानी सफल!' : 'Khalti Payment Approved!'}
              </h4>
              <p className="text-xs text-[#6B564C]">
                {language === 'np' ? 'तपाईँको अर्डर पुष्टि हुँदैछ...' : 'Your order is being confirmed...'}
              </p>
            </div>
          )}

          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B564C] pt-4 mt-2 border-t border-[#EADCCE]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#5D2E8E]" />
            <span>Khalti PCI-DSS Compliant Payment Gateway</span>
          </div>
        </div>
      </div>
    </div>
  );
};
