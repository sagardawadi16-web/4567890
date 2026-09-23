import React, { useState } from 'react';
import { ShieldAlert, MessageCircle, Lock, RefreshCw, KeyRound, ArrowRight } from 'lucide-react';
import { useShopStore } from '../../store/shopStore';
import { DawostiBrandLogo } from '../common/DawostiBrandLogo';

export const MaintenanceScreen: React.FC = () => {
  const {
    maintenanceSettings,
    language,
    toggleLanguage,
    setIsAdminOpen,
    unlockAdmin,
    adminSecuritySettings,
  } = useShopStore();

  const [showAdminLogin, setShowAdminLogin] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [passcodeError, setPasscodeError] = useState<string | null>(null);

  const phone = maintenanceSettings.emergencyPhone || '9708251494';

  const handleAdminUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminSecuritySettings.requirePasscode) {
      setIsAdminOpen(true);
      setShowAdminLogin(false);
      return;
    }
    const success = unlockAdmin(passcode);
    if (success) {
      setIsAdminOpen(true);
      setShowAdminLogin(false);
      setPasscode('');
      setPasscodeError(null);
    } else {
      setPasscodeError('Invalid Admin Passcode.');
    }
  };

  return (
    <div
      id="full-system-maintenance-screen"
      className="fixed inset-0 z-[99999] bg-[#FAF2E9] text-[#2B1810] flex flex-col justify-between p-4 sm:p-8 overflow-y-auto"
    >
      {/* Top Header */}
      <div className="max-w-4xl mx-auto w-full flex items-center justify-between border-b border-[#EADCCE] pb-4">
        <div className="flex items-center gap-3">
          <DawostiBrandLogo size="md" />
          <span className="text-xs bg-[#8B3A3A] text-white px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
            {language === 'np' ? 'मर्मत कार्य जारी' : 'Maintenance Mode'}
          </span>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLanguage}
            className="px-3 py-1 bg-white border border-[#EADCCE] text-[#2B1810] text-xs font-bold rounded-lg hover:bg-[#F2E5D5] transition-colors"
          >
            {language === 'en' ? 'नेपालीमा हेर्नुहोस्' : 'View in English'}
          </button>
        </div>
      </div>

      {/* Center Notice Container */}
      <div className="max-w-2xl mx-auto w-full my-auto py-10 text-center">
        {/* Animated Badge */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-[#8B1E1E]/10 border-2 border-[#8B1E1E]/30 rounded-3xl mb-6 shadow-sm">
          <ShieldAlert className="w-10 h-10 text-[#8B1E1E] animate-pulse" />
        </div>

        {/* Primary Headline */}
        <h1 className="text-2xl sm:text-4xl font-serif font-black text-[#2B1810] tracking-tight mb-3">
          {language === 'np'
            ? 'कृपया आफ्नो काम रोक्नुहोस्'
            : 'Please Stop What You Are Doing'}
        </h1>

        <p className="text-sm sm:text-base font-bold text-[#8B1E1E] mb-6">
          {language === 'np'
            ? 'दावोस्ती बुटिक सिस्टममा महत्त्वपूर्ण मर्मत कार्य भइरहेको छ'
            : 'DAWOSTI Atelier is currently undergoing scheduled system maintenance'}
        </p>

        {/* Informational Card */}
        <div className="bg-white p-6 rounded-2xl border border-[#EADCCE] shadow-sm text-left mb-8 space-y-4">
          <p className="text-xs sm:text-sm text-[#4A3B32] leading-relaxed">
            {language === 'np'
              ? (maintenanceSettings.messageNp ||
                  'हाम्रो प्राविधिक टोलीले नयाँ कलेक्सन तथा सर्भर सुधार कार्य गरिरहेको छ। ग्राहकहरूको अर्डर तथा डेटा सुरक्षाका लागि सबै अनलाइन कारोबार केही समयका लागि रोकिएको छ। तपाईंको कार्ट तथा अघिल्ला अर्डरहरू पूर्ण सुरक्षित छन्।')
              : (maintenanceSettings.messageEn ||
                  'Our atelier engineering team is currently performing scheduled system upgrades. To guarantee order integrity and data protection, online purchasing and browsing are temporarily paused. Your cart items and placed orders are safe.')}
          </p>

          <div className="bg-[#FAF2E9] p-3.5 rounded-xl border border-[#EADCCE] flex items-center justify-between text-xs font-semibold text-[#6B564C]">
            <span className="flex items-center gap-1.5">
              <RefreshCw className="w-3.5 h-3.5 animate-spin text-[#8B3A3A]" />
              {language === 'np'
                ? 'एडमिनले मर्मत समाप्त गर्नासाथ यो पृष्ठ स्वतः खुल्नेछ।'
                : 'This page will automatically refresh as soon as maintenance completes.'}
            </span>
            <span className="text-[10px] bg-[#8B3A3A]/10 text-[#8B3A3A] px-2 py-0.5 rounded font-mono font-bold">
              LIVE MESH SYNC
            </span>
          </div>
        </div>

        {/* Direct WhatsApp Ordering Alternative */}
        <div className="space-y-3">
          <p className="text-xs text-[#6B564C] font-medium">
            {language === 'np'
              ? 'तत्काल नयाँ अर्डर वा सोधपुछका लागि हाम्रो ह्वाट्सएप हेल्पलाइन खुला छ:'
              : 'Need immediate order placement or customer assistance? Contact our boutique concierge:'}
          </p>

          <a
            href={`https://wa.me/977${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
              language === 'np'
                ? 'नमस्ते दावोस्ती काठमाडौँ! मर्मत समयमा मलाई अर्डर गर्न सहयोग चाहिएको छ।'
                : 'Namaste DAWOSTI Kathmandu! I would like to place an order directly via WhatsApp during maintenance.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-xl font-bold text-sm shadow-md transition-transform active:scale-95"
          >
            <MessageCircle className="w-5 h-5 fill-current" />
            <span>
              {language === 'np'
                ? `ह्वाट्सएप हेल्पलाइन (+977 ${phone}) मा कुरा गर्नुहोस्`
                : `Chat with Atelier Concierge (+977 ${phone})`}
            </span>
          </a>
        </div>
      </div>

      {/* Bottom Footer & Staff Bypass */}
      <div className="max-w-4xl mx-auto w-full pt-6 border-t border-[#EADCCE] flex flex-wrap items-center justify-between gap-4 text-xs text-[#6B564C]">
        <span>
          DAWOSTI Women's Fashion Nepal © {new Date().getFullYear()} • Kathmandu Atelier Studio
        </span>

        {/* Staff Admin Unlock */}
        <div>
          {!showAdminLogin ? (
            <button
              onClick={() => setShowAdminLogin(true)}
              className="text-[11px] font-semibold text-[#8B3A3A] hover:underline flex items-center gap-1 opacity-70 hover:opacity-100"
            >
              <Lock className="w-3 h-3" />
              <span>Head Admin / Staff Access</span>
            </button>
          ) : (
            <form onSubmit={handleAdminUnlock} className="flex items-center gap-2">
              <div className="relative">
                <KeyRound className="w-3 h-3 absolute left-2.5 top-2 text-[#6B564C]" />
                <input
                  type="password"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  placeholder="Admin PIN"
                  className="pl-7 pr-2 py-1 text-xs border border-[#8B3A3A] rounded-lg bg-white text-[#2B1810] w-28 focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="px-2.5 py-1 bg-[#8B3A3A] text-white text-xs font-bold rounded-lg hover:bg-[#6D2828] flex items-center gap-1"
              >
                <span>Unlock</span>
                <ArrowRight className="w-3 h-3" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowAdminLogin(false);
                  setPasscodeError(null);
                }}
                className="text-xs text-[#6B564C] hover:underline px-1"
              >
                Cancel
              </button>
              {passcodeError && (
                <span className="text-[10px] text-red-600 font-bold ml-1">{passcodeError}</span>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
