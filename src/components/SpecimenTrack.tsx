import React from 'react';

interface SpecimenTrackProps {
  label: string;
  value: string | number;
  unit?: string;
  percent?: number; // 0 to 100
  color?: string;
  dotColor?: string;
}

export const SpecimenTrack: React.FC<SpecimenTrackProps> = ({
  label,
  value,
  unit = '',
  percent,
  dotColor = '#FF5B04'
}) => {
  const clampedPct = percent !== undefined ? Math.max(4, Math.min(96, percent)) : undefined;

  return (
    <div className="flex items-center justify-between py-1.5 border-b border-[#E8E3D5]/60">
      {/* Property Name */}
      <div className="w-28 shrink-0 font-label text-[10px] text-[#526673]">
        {label}
      </div>

      {/* Value */}
      <div className="w-24 shrink-0 text-left font-stat font-semibold text-xs text-[#16232B] tabular-nums">
        {value} <span className="font-caption text-[#526673] font-normal text-[11px]">{unit}</span>
      </div>

      {/* Precision Track & Dot Indicator */}
      {clampedPct !== undefined ? (
        <div className="flex-1 max-w-[100px] flex items-center px-1">
          <div className="w-full relative h-[1.5px] bg-[#E8E3D5] rounded-full">
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
        <div className="flex-1 max-w-[100px] text-right font-caption text-[#526673]/60">
          --
        </div>
      )}
    </div>
  );
};
