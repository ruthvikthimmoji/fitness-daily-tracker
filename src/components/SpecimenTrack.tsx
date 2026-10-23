import React from 'react';

interface SpecimenTrackProps {
  label: string;
  value: string | number;
  unit?: string;
  percent?: number; // 0 to 100
  color?: string;
  dotColor?: string;
}

/**
 * Editorial specimen metric row with precision indicator track
 * Modeled after the Swiss exhibition archive reference cards
 */
export const SpecimenTrack: React.FC<SpecimenTrackProps> = ({
  label,
  value,
  unit = '',
  percent,
  dotColor = '#EB5E28'
}) => {
  const clampedPct = percent !== undefined ? Math.max(4, Math.min(96, percent)) : undefined;

  return (
    <div className="flex items-center justify-between py-1 border-b border-[#D8D3C8]/50 text-[11px]">
      {/* Property Name */}
      <div className="w-28 shrink-0 uppercase tracking-wider text-[#766754] font-mono font-medium text-[10px]">
        {label}
      </div>

      {/* Value */}
      <div className="w-20 shrink-0 text-left font-mono font-bold text-[#2C2324]">
        {value} <span className="text-[9px] text-[#766754] font-normal">{unit}</span>
      </div>

      {/* Precision Track & Dot Indicator */}
      {clampedPct !== undefined ? (
        <div className="flex-1 max-w-[100px] flex items-center px-1">
          <div className="w-full relative h-[1.5px] bg-[#D8D3C8]/80 rounded-full">
            <div
              className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full transition-all duration-300"
              style={{
                left: `${clampedPct}%`,
                backgroundColor: dotColor,
                transform: 'translate(-50%, -50%)',
                boxShadow: '0 0 0 1.5px #FFFFFF'
              }}
            />
          </div>
        </div>
      ) : (
        <div className="flex-1 max-w-[100px] text-right font-mono text-[9px] text-[#766754]/60">
          --
        </div>
      )}
    </div>
  );
};
