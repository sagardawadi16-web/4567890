import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, MessageCircle } from 'lucide-react';
import { useShopStore } from '../../store/shopStore';

export const MaintenanceBanner: React.FC = () => {
  const { maintenanceSettings, language } = useShopStore();
  const [timeLeft, setTimeLeft] = useState<string>('10:00');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(600);

  useEffect(() => {
    if (!maintenanceSettings.warning10MinActive) return;

    const calculateRemaining = () => {
      if (maintenanceSettings.warningTargetTime) {
        const diff = Math.max(0, Math.floor((maintenanceSettings.warningTargetTime - Date.now()) / 1000));
        setSecondsRemaining(diff);
        const mins = Math.floor(diff / 60);
        const secs = diff % 60;
        setTimeLeft(`${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`);
      } else {
        // Fallback default 10 minutes
        setTimeLeft('10:00');
      }
    };

    calculateRemaining();
    const interval = setInterval(calculateRemaining, 1000);
    return () => clearInterval(interval);
  }, [maintenanceSettings.warning10MinActive, maintenanceSettings.warningTargetTime]);

  if (!maintenanceSettings.warning10MinActive || maintenanceSettings.isMaintenanceActive) {
    return null;
  }

  const phone = maintenanceSettings.emergencyPhone || '970825194';

  return (
    <div
      id="maintenance-warning-banner"
      className="relative z-50 bg-gradient-to-r from-[#8B1E1E] via-[#A82E2E] to-[#8B1E1E] text-white px-4 py-2.5 shadow-md border-b-2 border-amber-400/50"
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm">
        {/* Urgent Icon & Countdown */}
        <div className="flex items-center gap-2.5 font-bold">
          <div className="p-1.5 bg-amber-400 text-red-950 rounded-lg animate-pulse flex items-center justify-center">
            <AlertTriangle className="w-4 h-4" />
          </div>
          <div className="flex items-center gap-1.5 bg-black/25 px-2.5 py-1 rounded-md border border-amber-400/40 text-amber-200 font-mono text-sm tracking-wider">
            <Clock className="w-3.5 h-3.5" />
            <span>{timeLeft}</span>
          </div>
          <span className="bg-amber-400/20 text-amber-200 border border-amber-400/40 px-2 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-widest hidden sm:inline-block">
            {language === 'np' ? 'महत्त्वपूर्ण सूचना' : 'Urgent Notice'}
          </span>
        </div>

        {/* Message */}
        <div className="flex-1 min-w-[260px] text-center sm:text-left text-xs sm:text-sm">
          {language === 'np' ? (
            <span>
              <strong>१० मिनेटमा सिस्टम मर्मत सुरु हुँदैछ:</strong> कृपया आफ्नो अर्डर वा काम तुरुन्त पूरा गर्नुहोस्। केही समयमा सेवा अस्थायी रूपमा रोकिनेछ।
            </span>
          ) : (
            <span>
              <strong>Maintenance in {timeLeft}:</strong> Please complete your checkout or save current work. Scheduled maintenance will pause services shortly.
            </span>
          )}
        </div>

        {/* Action Button */}
        <div className="flex items-center gap-2">
          <a
            href={`https://wa.me/977${phone.replace(/\D/g, '')}?text=${encodeURIComponent(
              language === 'np'
                ? 'नमस्ते, दावोस्तीको सिस्टम मर्मतको सूचना पाएँ। मलाई अर्डर गर्न सहयोग चाहिएको छ।'
                : 'Hi DAWOSTI, I saw the upcoming maintenance notice. Please assist me with my order.'
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-[#25D366] hover:bg-[#1EBE5D] text-white rounded-lg font-bold text-xs shadow-sm transition-all active:scale-95"
          >
            <MessageCircle className="w-3.5 h-3.5 fill-current" />
            <span>{language === 'np' ? 'ह्वाट्सएपमा सम्पर्क' : 'WhatsApp Support'}</span>
          </a>
        </div>
      </div>
    </div>
  );
};
