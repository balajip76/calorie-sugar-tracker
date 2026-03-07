import { useEffect, useRef, useState } from 'react';
import type { KeyboardEvent } from 'react';

interface StatCardProps {
  label: string;
  value: number;
  unit: string;
  onClick: () => void;
  ariaLabel: string;
}

export function StatCard({ label, value, unit, onClick, ariaLabel }: StatCardProps) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const from = prevValueRef.current;
    const to = value;
    prevValueRef.current = to;

    if (from === to) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setDisplayValue(to);
      return;
    }

    const duration = 300;
    const start = performance.now();
    let rafId: number;

    const animate = (timestamp: number) => {
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(from + (to - from) * eased));
      if (progress < 1) {
        rafId = requestAnimationFrame(animate);
      } else {
        setDisplayValue(to);
      }
    };

    rafId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(rafId);
  }, [value]);

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
        {displayValue}
      </span>
      <span className="text-section-label text-warm-stone">
        {unit}
      </span>
    </div>
  );
}
