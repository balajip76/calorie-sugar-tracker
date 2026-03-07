import { useRef } from 'react';
import type { InsightPeriod } from '../types';

const PERIODS: InsightPeriod[] = [1, 3, 7, 30, 90];
const LABELS: Record<InsightPeriod, string> = { 1: '1d', 3: '3d', 7: '7d', 30: '30d', 90: '90d' };

interface PillSelectorProps {
  selected: InsightPeriod;
  onChange: (period: InsightPeriod) => void;
}

export function PillSelector({ selected, onChange }: PillSelectorProps) {
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    let targetIndex: number | null = null;
    if (e.key === 'ArrowRight') {
      targetIndex = (index + 1) % PERIODS.length;
    } else if (e.key === 'ArrowLeft') {
      targetIndex = (index - 1 + PERIODS.length) % PERIODS.length;
    }
    if (targetIndex !== null) {
      onChange(PERIODS[targetIndex]);
      tabRefs.current[targetIndex]?.focus();
    }
  };

  return (
    <div role="tablist" aria-label="Insight period" className="flex gap-2">
      {PERIODS.map((period, index) => (
        <button
          key={period}
          ref={(el) => { tabRefs.current[index] = el; }}
          role="tab"
          aria-selected={period === selected}
          tabIndex={period === selected ? 0 : -1}
          onClick={() => onChange(period)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          className={`flex-1 py-1 rounded-pill text-button font-semibold border transition-colors duration-100 ${
            period === selected
              ? 'bg-rose-blush border-soft-terracotta text-soft-terracotta'
              : 'bg-transparent border-sand-mist text-warm-stone'
          }`}
        >
          {LABELS[period]}
        </button>
      ))}
    </div>
  );
}
