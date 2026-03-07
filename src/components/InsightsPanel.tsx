import { useState } from 'react';
import type { Entry, InsightPeriod } from '../types';
import { getAverages } from '../utils/calculations';
import { PillSelector } from './PillSelector';

const DEFAULT_PERIOD: InsightPeriod = 3;

interface InsightsPanelProps {
  entries: Entry[];
  inert?: boolean;
}

export function InsightsPanel({ entries, inert }: InsightsPanelProps) {
  const [period, setPeriod] = useState<InsightPeriod>(DEFAULT_PERIOD);
  const averages = getAverages(entries, period);
  const hasEntries = entries.length > 0;

  return (
    <div className="fixed bottom-0 inset-x-0 bg-warm-linen border-t border-sand-mist" inert={inert}>
      <div className="max-w-[480px] mx-auto px-6 py-4 flex flex-col gap-3">
        <PillSelector selected={period} onChange={setPeriod} />
        {hasEntries ? (
          <div className="flex gap-8" aria-live="polite">
            <div>
              <p className="text-section-label text-warm-stone">Avg daily calories</p>
              <p className="text-entry-value font-medium text-espresso">
                {Math.round(averages.calories)} kcal
              </p>
            </div>
            <div>
              <p className="text-section-label text-warm-stone">Avg daily sugar</p>
              <p className="text-entry-value font-medium text-espresso">
                {Math.round(averages.sugar)} g
              </p>
            </div>
          </div>
        ) : (
          <p aria-live="polite" className="text-dusty-tan text-center text-sm">
            Insights will appear after your first entry
          </p>
        )}
      </div>
    </div>
  );
}
