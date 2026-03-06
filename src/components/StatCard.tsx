import type { KeyboardEvent } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  onClick: () => void;
  ariaLabel: string;
}

export function StatCard({ label, value, unit, onClick, ariaLabel }: StatCardProps) {
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  const valueColour = value === 0 ? 'text-dusty-tan' : 'text-espresso';

  return (
    <div
      role="button"
      tabIndex={0}
      aria-label={ariaLabel}
      onClick={onClick}
      onKeyDown={handleKeyDown}
      className="bg-warm-linen rounded-lg p-4 min-h-[44px] flex flex-col gap-1 cursor-pointer transition-colors hover:bg-rose-blush active:bg-rose-blush"
    >
      <span className="text-section-label font-semibold text-warm-stone uppercase tracking-wide">
        {label}
      </span>
      <span className={`text-[2.25rem] font-bold leading-none ${valueColour}`}>
        {value}
      </span>
      <span className="text-section-label text-warm-stone">
        {unit}
      </span>
    </div>
  );
}
