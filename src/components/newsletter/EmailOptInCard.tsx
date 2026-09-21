import React, { useState } from 'react';
import { Mail, Sparkles, CheckCircle2, ArrowRight } from 'lucide-react';
import { useShopStore } from '../../store/shopStore';

interface EmailOptInCardProps {
  variant?: 'footer' | 'standalone' | 'inline';
  title?: string;
  subtitle?: string;
  source?: 'footer' | 'banner' | 'checkout' | 'admin_manual';
}

export const EmailOptInCard: React.FC<EmailOptInCardProps> = ({
  variant = 'footer',
  title,
  subtitle,
  source = 'footer',
}) => {
  const { language, subscribeEmail } = useShopStore();
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [feedbackMsg, setFeedbackMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setStatus('loading');
    setTimeout(() => {
      const res = subscribeEmail(emailInput.trim(), source, nameInput.trim());
      if (res.success) {
        setStatus('success');
        setFeedbackMsg(res.message);
        setEmailInput('');
        setNameInput('');
      } else {
        setStatus('error');
        setFeedbackMsg(res.message);
      }
    }, 300);
  };

  if (variant === 'footer') {
    return (
      <div id="footer-newsletter-optin" className="bg-[#421818] border border-[#D4AF37]/30 rounded-2xl p-5 sm:p-6 text-[#FFF8F0]">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-[#D4AF37]" />
          <h4 className="font-serif-luxury text-sm sm:text-base font-bold text-[#FFF8F0] tracking-wide">
            {title ||
              (language === 'np'
                ? 'नयाँ फेसन र नयाँ कलेक्सन रिलिज इमेल अलर्ट'
                : 'Exclusive Drops & New Arrival Email Alerts')}
          </h4>
        </div>

        <p className="text-xs text-[#FFF8F0]/80 mb-4 leading-relaxed">
          {subtitle ||
            (language === 'np'
              ? 'हाम्रा नयाँ हस्तनिर्मित कुर्था, साडी र लेहेंगा स्टोरमा थपिनासाथ तुरुन्त इमेल मार्फत जानकारी पाउनुहोस्।'
              : 'Be the first to know the moment new handcrafted kurtas, sarees, and festive releases launch.')}
        </p>

        {status === 'success' ? (
          <div className="p-3.5 bg-[#2E5E35] border border-emerald-400/40 rounded-xl flex items-center gap-2.5 text-xs text-emerald-100 animate-in fade-in duration-300">
            <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
            <span>{feedbackMsg}</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-2.5">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative flex-1">
                <Mail className="w-4 h-4 text-[#D4AF37] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="email"
                  required
                  value={emailInput}
                  onChange={(e) => {
                    setEmailInput(e.target.value);
                    if (status === 'error') setStatus('idle');
                  }}
                  placeholder={language === 'np' ? 'तपाईंको इमेल (your@email.com)' : 'Enter your email address'}
                  className="w-full pl-9.5 pr-3 py-2.5 bg-[#2B1810]/70 border border-[#D4AF37]/40 rounded-xl text-xs sm:text-sm text-white placeholder:text-[#FFF8F0]/40 focus:outline-none focus:ring-1 focus:ring-[#D4AF37] min-h-[44px]"
                />
              </div>

              <button
                type="submit"
                disabled={status === 'loading'}
                className="min-h-[44px] px-5 py-2.5 bg-[#D4AF37] hover:bg-[#E5C158] active:scale-[0.98] text-[#2B1810] font-bold text-xs sm:text-sm rounded-xl transition-all flex items-center justify-center gap-1.5 shrink-0 shadow-sm cursor-pointer"
              >
                {status === 'loading' ? (
                  <span>{language === 'np' ? 'दर्ता हुँदै...' : 'Subscribing...'}</span>
                ) : (
                  <>
                    <span>{language === 'np' ? 'इमेल अलर्ट लिनुहोस्' : 'Get Drop Alerts'}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {status === 'error' && (
              <p className="text-[11px] text-rose-300 pl-1">{feedbackMsg}</p>
            )}

            <p className="text-[10px] text-[#FFF8F0]/50 pl-1">
              🔒 {language === 'np' ? 'कुनै स्प्याम छैन। जुनसुकै बेला रद्द गर्न सक्नुहुन्छ।' : 'Zero spam. Only authentic boutique new arrivals & secret drops.'}
            </p>
          </form>
        )}
      </div>
    );
  }

  // Standalone variant for homepage or modals
  return (
    <div className="bg-[#FAF2E9] border border-[#EADCCE] rounded-2xl p-6 sm:p-8 text-center max-w-xl mx-auto shadow-sm">
      <div className="w-10 h-10 rounded-full bg-[#8B3A3A]/10 text-[#8B3A3A] flex items-center justify-center mx-auto mb-3">
        <Mail className="w-5 h-5" />
      </div>

      <h3 className="font-serif-luxury text-xl font-bold text-[#2B1810] mb-2">
        {title || (language === 'np' ? 'नयाँ बुटिक रिलिज इमेल अलर्ट' : 'Never Miss a New Drop')}
      </h3>
      <p className="text-xs sm:text-sm text-[#6B564C] mb-5 max-w-md mx-auto">
        {subtitle ||
          (language === 'np'
            ? 'दावोस्ती बुटिकमा नयाँ फेसन डिजाइन थपिँदा इमेल मार्फत सबैभन्दा पहिले सूचना पाउनुहोस्।'
            : 'Get exclusive email updates whenever new handcrafted pieces launch at DAWOSTI Atelier.')}
      </p>

      {status === 'success' ? (
        <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{feedbackMsg}</span>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              required
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 border border-[#EADCCE] rounded-xl text-xs sm:text-sm bg-white text-[#2B1810] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A] min-h-[44px]"
            />
            <button
              type="submit"
              disabled={status === 'loading'}
              className="min-h-[44px] px-6 py-2.5 bg-[#8B3A3A] hover:bg-[#722E2E] text-white font-bold text-xs sm:text-sm rounded-xl transition-all cursor-pointer"
            >
              {status === 'loading' ? 'Saving...' : 'Subscribe'}
            </button>
          </div>
          {status === 'error' && <p className="text-xs text-red-600">{feedbackMsg}</p>}
        </form>
      )}
    </div>
  );
};
