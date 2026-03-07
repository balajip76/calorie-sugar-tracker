import type { Entry } from '../types';

interface EntryCardProps {
  entry: Entry;
}

export function EntryCard({ entry }: EntryCardProps) {
  const formattedTime = new Date(entry.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <li
      aria-label={`${formattedTime}, ${entry.calories} kilocalories, ${entry.sugar} grams sugar`}
      className="flex items-center justify-between bg-warm-linen rounded-md p-4 animate-card-fade-in"
    >
      <time dateTime={entry.timestamp} className="text-entry-meta text-warm-stone">
        {formattedTime}
      </time>
      <div className="flex gap-3 text-entry-value font-medium text-espresso" aria-hidden="true">
        <span>{entry.calories} kcal</span>
        <span>{entry.sugar} g</span>
      </div>
    </li>
  );
}
