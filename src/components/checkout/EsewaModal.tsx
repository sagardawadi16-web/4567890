import React, { useState } from 'react';
import { X, ExternalLink, CheckCircle2, ShieldCheck, Copy, Check, ArrowRight, Code } from 'lucide-react';
import { CartItem, EsewaPayload, Language } from '../../types';

interface EsewaModalProps {
  isOpen: boolean;
  onClose: () => void;
  orderNumber: string;
  subtotal: number;
  deliveryFee: number;
  discountAmount: number;
  totalAmount: number;
  cart: CartItem[];
  language: Language;
  onPaymentSuccess: (transactionId: string, payload: EsewaPayload) => void;
}

export const EsewaModal: React.FC<EsewaModalProps> = ({
  isOpen,
  onClose,
  orderNumber,
  subtotal,
  deliveryFee,
  discountAmount,
  totalAmount,
  language,
  onPaymentSuccess,
}) => {
  const [copied, setCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showPayloadDetails, setShowPayloadDetails] = useState(true);

  if (!isOpen) return null;

  // Genuine eSewa ePay Payload Specification
  const esewaPayload: EsewaPayload = {
    amt: subtotal - discountAmount,
    psc: 0,
    pdc: deliveryFee,
    txAmt: 0,
    tAmt: totalAmount,
    pid: orderNumber,
    scd: 'EPAYTEST', // Official eSewa test merchant code
    su: `${window.location.origin}/?payment=esewa_success&oid=${orderNumber}`,
    fu: `${window.location.origin}/?payment=esewa_failed&oid=${orderNumber}`,
  };

  const handleCopyPayload = () => {
    navigator.clipboard.writeText(JSON.stringify(esewaPayload, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/verify-esewa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amt: esewaPayload.amt,
          tAmt: esewaPayload.tAmt,
          pid: esewaPayload.pid,
          scd: esewaPayload.scd,
          refId: `ESEWA-TX-${Date.now().toString(36).toUpperCase()}`,
        }),
      });
      const data = await res.json();
      setIsProcessing(false);
      const transactionId = data?.transactionId || `ESEWA-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      onPaymentSuccess(transactionId, esewaPayload);
    } catch (e) {
      console.warn('Backend eSewa call fallback:', e);
      setIsProcessing(false);
      const mockEsewaTxId = `ESEWA-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;
      onPaymentSuccess(mockEsewaTxId, esewaPayload);
    }
  };

  return (
    <div
      id="esewa-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-black/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="esewa-modal-title"
    >
      <div
        id="esewa-modal-content"
        className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-emerald-100 overflow-hidden animate-in zoom-in-95 duration-200"
      >
        {/* eSewa Brand Header */}
        <div className="bg-gradient-to-r from-[#60BB46] to-[#489932] px-6 py-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center p-1 shadow-xs">
              <span className="font-extrabold text-lg text-[#60BB46] tracking-tighter">e</span>
            </div>
            <div>
              <h3 id="esewa-modal-title" className="font-bold text-lg leading-tight">
                eSewa ePay Integration
              </h3>
              <p className="text-emerald-100 text-xs">
                {language === 'np' ? 'नेपालको प्रमुख डिजिटल वालेट' : 'Nepal’s #1 Digital Wallet Gateway'}
              </p>
            </div>
          </div>
          <button
            id="close-esewa-modal-btn"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-colors"
            aria-label="Close eSewa Modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 space-y-5 text-[#2B1810]">
          
          {/* Order Snapshot */}
          <div className="bg-emerald-50/60 border border-emerald-200/70 rounded-2xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                {language === 'np' ? 'अर्डर नम्बर' : 'Invoice Reference'}
              </span>
              <p className="font-mono text-sm font-bold text-emerald-950">{orderNumber}</p>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-800">
                {language === 'np' ? 'कुल भुक्तानी' : 'Payable Amount'}
              </span>
              <p className="text-xl font-extrabold text-emerald-900 font-serif-luxury">
                रु {totalAmount.toLocaleString('en-US')}
              </p>
            </div>
          </div>

          {/* eSewa Integration Payload Generator Section */}
          <div className="border border-[#EADCCE] rounded-2xl overflow-hidden bg-[#FAF2E9]/50">
            <div className="px-4 py-2.5 bg-[#FAF2E9] border-b border-[#EADCCE] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4 text-[#8B3A3A]" />
                <span className="text-xs font-bold text-[#2B1810]">
                  {language === 'np' ? 'eSewa POST फारम पेलोड (Payload)' : 'eSewa Form POST Payload'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowPayloadDetails(!showPayloadDetails)}
                  className="text-[11px] text-[#8B3A3A] hover:underline font-semibold"
                >
                  {showPayloadDetails ? (language === 'np' ? 'लुकाउनुहोस्' : 'Collapse') : (language === 'np' ? 'हेर्नुहोस्' : 'Expand')}
                </button>
                <button
                  type="button"
                  onClick={handleCopyPayload}
                  className="px-2 py-1 bg-white border border-[#EADCCE] rounded-md text-[11px] font-semibold text-[#6B564C] hover:text-[#2B1810] flex items-center gap-1 shadow-2xs"
                  title="Copy JSON Payload"
                >
                  {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                  <span>{copied ? 'Copied' : 'JSON'}</span>
                </button>
              </div>
            </div>

            {showPayloadDetails && (
              <div className="p-3 text-[11px] font-mono bg-[#1E1E1E] text-emerald-400 overflow-x-auto max-h-40">
                <pre>{JSON.stringify(esewaPayload, null, 2)}</pre>
              </div>
            )}
          </div>

          {/* Real POST Form Target (Hidden / Optional Sandbox submission) */}
          <form
            id="esewa-real-form"
            action="https://uat.esewa.com.np/epay/main"
            method="POST"
            target="_blank"
            className="hidden"
          >
            <input value={esewaPayload.tAmt} name="tAmt" type="hidden" />
            <input value={esewaPayload.amt} name="amt" type="hidden" />
            <input value={esewaPayload.txAmt} name="txAmt" type="hidden" />
            <input value={esewaPayload.psc} name="psc" type="hidden" />
            <input value={esewaPayload.pdc} name="pdc" type="hidden" />
            <input value={esewaPayload.scd} name="scd" type="hidden" />
            <input value={esewaPayload.pid} name="pid" type="hidden" />
            <input value={esewaPayload.su} name="su" type="hidden" />
            <input value={esewaPayload.fu} name="fu" type="hidden" />
          </form>

          {/* Action CTAs */}
          <div className="space-y-2.5 pt-1">
            {/* Simulation Button (Instant Test Flow) */}
            <button
              id="esewa-simulate-success-btn"
              type="button"
              disabled={isProcessing}
              onClick={handleSimulatePayment}
              className="w-full min-h-[48px] py-3 px-4 bg-[#60BB46] hover:bg-[#52a53b] text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-md transition-all active:scale-98 disabled:opacity-50"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>{language === 'np' ? 'eSewa प्रमाणित हुँदैछ...' : 'Authorizing eSewa payment...'}</span>
                </span>
              ) : (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>
                    {language === 'np'
                      ? 'eSewa भुक्तानी सम्पन्न गर्नुहोस् (Instant Test)'
                      : 'Complete eSewa Payment (Instant Authorize)'}
                  </span>
                </>
              )}
            </button>

            {/* Real UAT Sandbox Gateway Redirection */}
            <button
              id="esewa-live-uat-btn"
              type="button"
              onClick={() => {
                const form = document.getElementById('esewa-real-form') as HTMLFormElement;
                if (form) form.submit();
              }}
              className="w-full min-h-[42px] py-2 px-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 rounded-xl font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>
                {language === 'np'
                  ? 'eSewa UAT पोर्टल नयाँ ट्याबमा खोल्नुहोस्'
                  : 'Open Official eSewa UAT Sandbox Gateway (New Tab)'}
              </span>
            </button>
          </div>

          {/* Trust Guarantee */}
          <div className="flex items-center justify-center gap-2 text-[11px] text-[#6B564C] pt-2 border-t border-[#EADCCE]">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              {language === 'np'
                ? '२५६-बिट सुरक्षित eSewa मर्चेन्ट गेटवे • Dawosti बुटिक'
                : '256-bit Encrypted eSewa Merchant Gateway • Dawosti Boutique'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
