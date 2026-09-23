import React, { useState } from 'react';
import {
  ShieldAlert,
  Clock,
  Radio,
  RefreshCw,
  Zap,
  Users,
  AlertTriangle,
  Phone,
  FileText,
  CheckCircle2,
  ExternalLink,
} from 'lucide-react';
import { useShopStore } from '../../store/shopStore';
import { CURRENT_AGENT_ID } from '../../services/crossAgentSync';

export const MultiAgentMaintenanceTab: React.FC = () => {
  const {
    maintenanceSettings,
    updateMaintenanceSettings,
    toggle10MinMaintenanceWarning,
    toggleFullMaintenance,
    triggerAgentForceReload,
    autoReloadAgentsOnUpdate,
    setAutoReloadAgentsOnUpdate,
    currentAgentRole,
    setCurrentAgentRole,
    language,
  } = useShopStore();

  const [testPingNotice, setTestPingNotice] = useState<string | null>(null);
  const [customPhone, setCustomPhone] = useState<string>(
    maintenanceSettings.emergencyPhone || '9708251494'
  );
  const [customMsgEn, setCustomMsgEn] = useState<string>(maintenanceSettings.messageEn || '');
  const [customMsgNp, setCustomMsgNp] = useState<string>(maintenanceSettings.messageNp || '');
  const [isSaved, setIsSaved] = useState<boolean>(false);

  const handleSaveContactAndMessages = () => {
    updateMaintenanceSettings({
      emergencyPhone: customPhone.trim() || '9708251494',
      messageEn: customMsgEn.trim() || undefined,
      messageNp: customMsgNp.trim() || undefined,
    });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleSendTestPing = () => {
    triggerAgentForceReload();
    setTestPingNotice('Broadcast ping & auto-reload signal dispatched to all independent agent sessions!');
    setTimeout(() => setTestPingNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Notice */}
      <div className="bg-[#FAF2E9] border border-[#EADCCE] p-4 rounded-2xl flex items-start gap-3">
        <div className="p-2 bg-[#8B3A3A] text-white rounded-xl shrink-0">
          <Radio className="w-5 h-5 animate-pulse" />
        </div>
        <div className="space-y-1 text-xs">
          <h4 className="font-bold text-sm text-[#2B1810]">
            Multi-Agent Real-Time Synchronization & Maintenance Control
          </h4>
          <p className="text-[#6B564C] leading-relaxed">
            All updates made by the Head Admin are instantly broadcast via{' '}
            <strong>BroadcastChannel</strong> (sub-millisecond local tabs) and{' '}
            <strong>Firestore Cloud Listener</strong> (remote devices). When maintenance is
            triggered, all connected shoppers and independent staff receive the change in real-time.
          </p>
        </div>
      </div>

      {/* 1. Multi-Agent Role & Auto-Reload Test Station */}
      <div className="bg-white border border-[#EADCCE] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EADCCE]/60 pb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-[#8B3A3A]" />
            <h3 className="font-bold text-sm text-[#2B1810]">Multi-Agent Verification & Auto-Reload</h3>
          </div>
          <span className="text-[11px] font-mono bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            Mesh Synced (Agent ID: {CURRENT_AGENT_ID})
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Role Selector */}
          <div className="bg-[#FAF2E9] p-3.5 rounded-xl border border-[#EADCCE]">
            <label className="font-bold text-[#2B1810] block mb-1">
              Active Agent Testing Role:
            </label>
            <div className="flex items-center gap-2 mt-2">
              <button
                type="button"
                onClick={() => setCurrentAgentRole('head_admin')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                  currentAgentRole === 'head_admin'
                    ? 'bg-[#8B3A3A] text-white shadow-xs'
                    : 'bg-white text-[#2B1810] border border-[#EADCCE]'
                }`}
              >
                👑 Head Admin (Controller)
              </button>
              <button
                type="button"
                onClick={() => setCurrentAgentRole('independent_admin')}
                className={`flex-1 py-2 px-3 rounded-lg font-bold text-xs transition-all ${
                  currentAgentRole === 'independent_admin'
                    ? 'bg-[#2B1810] text-white shadow-xs'
                    : 'bg-white text-[#2B1810] border border-[#EADCCE]'
                }`}
              >
                🧑‍💼 Independent Admin (Observer)
              </button>
            </div>
            <p className="text-[11px] text-[#6B564C] mt-2">
              {currentAgentRole === 'head_admin'
                ? 'You have primary authority. Any toggle you switch immediately updates all independent admins and shoppers.'
                : 'You are testing as an independent agent. You will receive live sync notifications and auto-reloads from the Head Admin.'}
            </p>
          </div>

          {/* Auto Reload Toggle & Actions */}
          <div className="bg-[#FAF2E9] p-3.5 rounded-xl border border-[#EADCCE] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#2B1810]">
                  Auto-Reload Independent Admins on Updates:
                </span>
                <button
                  type="button"
                  onClick={() => setAutoReloadAgentsOnUpdate(!autoReloadAgentsOnUpdate)}
                  className={`w-11 h-6 rounded-full transition-colors relative ${
                    autoReloadAgentsOnUpdate ? 'bg-[#8B3A3A]' : 'bg-stone-300'
                  }`}
                >
                  <span
                    className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${
                      autoReloadAgentsOnUpdate ? 'translate-x-6' : 'translate-x-1'
                    }`}
                  />
                </button>
              </div>
              <p className="text-[11px] text-[#6B564C] mt-1.5">
                When enabled, saving products or settings automatically instructs all other connected
                admin tabs to refresh their state!
              </p>
            </div>

            <div className="flex items-center gap-2 mt-3 pt-3 border-t border-[#EADCCE]/60">
              <button
                type="button"
                onClick={handleSendTestPing}
                className="flex-1 py-2 px-3 bg-[#8B3A3A] hover:bg-[#6D2828] text-white font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-xs transition-all active:scale-95"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Test Broadcast Ping & Reload</span>
              </button>
            </div>
          </div>
        </div>

        {testPingNotice && (
          <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-xl flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{testPingNotice}</span>
          </div>
        )}
      </div>

      {/* 2. Maintenance Toggles Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Toggle A: 10-Minute Maintenance Warning Alert */}
        <div className="bg-white border border-[#EADCCE] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-amber-100 text-amber-800 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2B1810]">
                    Maintenance in 10 Minutes Warning
                  </h3>
                  <span className="text-[11px] text-[#6B564C]">
                    Countdown alert broadcast to everyone
                  </span>
                </div>
              </div>

              <button
                type="button"
                id="toggle-10min-maintenance-warning"
                onClick={() => toggle10MinMaintenanceWarning()}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  maintenanceSettings.warning10MinActive ? 'bg-amber-600' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${
                    maintenanceSettings.warning10MinActive ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-[#4A3B32] leading-relaxed">
              When toggled ON, an urgent top banner with a <strong>live 10:00 countdown timer</strong> appears across every customer and admin screen:
              <br />
              <em className="text-[11px] text-amber-900 block mt-1 bg-amber-50 p-2 rounded-lg border border-amber-200">
                "⚠️ Maintenance in 10 minutes: Please complete your checkout or save current work. Scheduled maintenance will pause services shortly."
              </em>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EADCCE] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#6B564C]">Current Warning Status:</span>
            <span
              className={`font-bold px-2.5 py-0.5 rounded-full ${
                maintenanceSettings.warning10MinActive
                  ? 'bg-amber-100 text-amber-800 animate-pulse'
                  : 'bg-stone-100 text-stone-600'
              }`}
            >
              {maintenanceSettings.warning10MinActive ? '🔴 BROADCASTING LIVE (10-MIN)' : '⚪ INACTIVE'}
            </span>
          </div>
        </div>

        {/* Toggle B: Full System Maintenance ("Stop What You Are Doing") */}
        <div className="bg-white border border-[#EADCCE] rounded-2xl p-5 shadow-xs flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-red-100 text-red-800 rounded-xl">
                  <ShieldAlert className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-[#2B1810]">
                    Full Maintenance Mode
                  </h3>
                  <span className="text-[11px] text-red-700 font-semibold">
                    "Please stop what you are doing" screen
                  </span>
                </div>
              </div>

              <button
                type="button"
                id="toggle-full-system-maintenance"
                onClick={() => toggleFullMaintenance()}
                className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                  maintenanceSettings.isMaintenanceActive ? 'bg-red-700' : 'bg-stone-300'
                }`}
              >
                <span
                  className={`block w-4 h-4 rounded-full bg-white transition-transform transform ${
                    maintenanceSettings.isMaintenanceActive ? 'translate-x-7' : 'translate-x-1'
                  }`}
                />
              </button>
            </div>

            <p className="text-xs text-[#4A3B32] leading-relaxed">
              When toggled ON, the entire site locks immediately and renders the full-screen emergency maintenance notice:
              <br />
              <em className="text-[11px] text-red-950 block mt-1 bg-red-50 p-2 rounded-lg border border-red-200">
                "Please Stop What You Are Doing / कृपया आफ्नो काम रोक्नुहोस् — DAWOSTI Atelier is currently undergoing scheduled maintenance."
              </em>
            </p>
          </div>

          <div className="mt-4 pt-3 border-t border-[#EADCCE] flex items-center justify-between text-xs">
            <span className="font-semibold text-[#6B564C]">Storefront State:</span>
            <span
              className={`font-bold px-2.5 py-0.5 rounded-full ${
                maintenanceSettings.isMaintenanceActive
                  ? 'bg-red-700 text-white animate-bounce'
                  : 'bg-emerald-100 text-emerald-800'
              }`}
            >
              {maintenanceSettings.isMaintenanceActive ? '🚨 STORE LOCKED (MAINTENANCE)' : '🟢 STORE OPEN & ACTIVE'}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Emergency Contact & Custom Messages Customizer */}
      <div className="bg-white border border-[#EADCCE] rounded-2xl p-5 shadow-xs space-y-4">
        <div className="flex items-center gap-2 border-b border-[#EADCCE]/60 pb-3">
          <Phone className="w-4 h-4 text-[#8B3A3A]" />
          <h3 className="font-bold text-sm text-[#2B1810]">
            Emergency WhatsApp Contact & Custom Maintenance Text
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
          <div>
            <label className="font-bold text-[#2B1810] block mb-1">
              Emergency WhatsApp Phone:
            </label>
            <input
              type="text"
              value={customPhone}
              onChange={(e) => setCustomPhone(e.target.value)}
              placeholder="9708251494"
              className="w-full px-3 py-2 border border-[#EADCCE] rounded-xl text-xs bg-[#FAF2E9] text-[#2B1810] font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
            />
            <span className="text-[10px] text-[#6B564C] mt-1 block">
              Directs shoppers to WhatsApp while maintenance is active.
            </span>
          </div>

          <div>
            <label className="font-bold text-[#2B1810] block mb-1">
              Custom Message (English):
            </label>
            <textarea
              value={customMsgEn}
              onChange={(e) => setCustomMsgEn(e.target.value)}
              placeholder="DAWOSTI Atelier Kathmandu is currently undergoing scheduled system maintenance..."
              rows={3}
              className="w-full px-3 py-2 border border-[#EADCCE] rounded-xl text-xs bg-[#FAF2E9] text-[#2B1810] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
            />
          </div>

          <div>
            <label className="font-bold text-[#2B1810] block mb-1">
              Custom Message (नेपाली):
            </label>
            <textarea
              value={customMsgNp}
              onChange={(e) => setCustomMsgNp(e.target.value)}
              placeholder="दावोस्ती बुटिकमा हाल प्राविधिक मर्मत भइरहेको छ। कृपया केही समय धैर्य गरिदिनुहोला..."
              rows={3}
              className="w-full px-3 py-2 border border-[#EADCCE] rounded-xl text-xs bg-[#FAF2E9] text-[#2B1810] focus:outline-none focus:ring-1 focus:ring-[#8B3A3A]"
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-3 border-t border-[#EADCCE]/60">
          {isSaved ? (
            <span className="text-xs text-emerald-700 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" />
              Saved & Broadcasted to all connected agents!
            </span>
          ) : (
            <span className="text-xs text-[#6B564C]">
              Changes are immediately applied to the maintenance screens.
            </span>
          )}

          <button
            type="button"
            onClick={handleSaveContactAndMessages}
            className="px-4 py-2 bg-[#8B3A3A] hover:bg-[#6D2828] text-white font-bold text-xs rounded-xl shadow-xs transition-all active:scale-95"
          >
            Save & Broadcast Settings
          </button>
        </div>
      </div>
    </div>
  );
};
