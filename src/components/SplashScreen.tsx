import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish?: () => void;
  streak?: number;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish, streak = 0 }) => {
  const [isFadingOut, setIsFadingOut] = useState(false);
  const [progress, setProgress] = useState(15);

  useEffect(() => {
    // Progress bar animation
    const progressInterval = setInterval(() => {
      setProgress((p) => {
        if (p >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return p + Math.floor(Math.random() * 25) + 15;
      });
    }, 180);

    // Fade out after 1.1s
    const fadeTimer = setTimeout(() => {
      setIsFadingOut(true);
    }, 1100);

    // Remove from DOM after transition
    const finishTimer = setTimeout(() => {
      if (onFinish) onFinish();
    }, 1500);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#FFFFF0] transition-all duration-500 ease-out select-none ${
        isFadingOut ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
      }`}
    >
      {/* Background Radial Glow */}
      <div className="absolute w-80 h-80 rounded-full bg-gradient-to-tr from-[#FF5B04]/10 via-[#075056]/5 to-transparent blur-3xl pointer-events-none" />

      {/* Main Center Content */}
      <div className="relative flex flex-col items-center text-center px-6 z-10 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Logo Emblem with Glow */}
        <div className="relative mb-6">
          {/* Subtle pulsating aura */}
          <div className="absolute inset-0 rounded-3xl bg-[#FF5B04]/20 blur-xl animate-pulse" />
          
          <div className="relative w-24 h-24 rounded-3xl bg-[#16232B] p-4 flex items-center justify-center shadow-[0_16px_36px_rgba(22,35,43,0.18)] border border-white/10">
            <img
              src="/logo-white.png"
              alt="DAILY/FIT"
              className="w-full h-full object-contain filter drop-shadow-sm"
            />
          </div>
        </div>

        {/* Wordmark */}
        <div className="flex items-baseline space-x-2">
          <span className="font-display text-3xl tracking-widest text-[#16232B]">DAILY</span>
          <span className="font-display text-3xl tracking-widest text-[#FF5B04]">/ FIT</span>
        </div>

        {/* Athletic Tagline Badge */}
        <div className="mt-2.5 px-3 py-1 rounded-full bg-white border border-[#E8E3D5] shadow-2xs">
          <span className="font-label text-[11px] text-[#56646E] tracking-widest uppercase">
            Progress, Not Perfection
          </span>
        </div>

        {/* Streak indicator if active */}
        {streak > 0 && (
          <div className="mt-3 flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#FFF0E8] border border-[#FF5B04]/30 text-[#FF5B04] text-xs font-bold font-caption">
            <span>🔥</span>
            <span>{streak} DAY STREAK ACTIVE</span>
          </div>
        )}

        {/* Slim Progress Bar */}
        <div className="mt-8 w-36 h-1 rounded-full bg-[#E8E3D5] overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-[#FF5B04] to-[#FF7529] rounded-full transition-all duration-200 ease-out"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </div>

      </div>

      {/* Bottom Footer Note */}
      <div className="absolute bottom-8 text-center">
        <span className="font-caption text-[11px] text-[#56646E]/70 uppercase tracking-widest">
          Private · Local-First · Google Sheets Synced
        </span>
      </div>
    </div>
  );
};
