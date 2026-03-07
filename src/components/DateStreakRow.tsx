interface DateStreakRowProps {
  streak: number;
}

export function DateStreakRow({ streak }: DateStreakRowProps) {
  const now = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const dateTimeAttr = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
  const displayDate = now.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="flex items-center justify-between">
      <time dateTime={dateTimeAttr} className="font-sans text-section-label font-medium text-espresso">
        {displayDate}
      </time>
      <span className="text-streak font-medium text-warm-amber">🔥{streak}</span>
    </div>
  );
}
