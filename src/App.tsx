import { useRef, useState } from 'react';
import { EntriesProvider, useEntries } from './context/EntriesContext';
import { getTodayEntries, getStreak } from './utils/calculations';
import { StatCard } from './components/StatCard';
import { DateStreakRow } from './components/DateStreakRow';
import { EntrySheet } from './components/EntrySheet';
import { EntryCard } from './components/EntryCard';
import { FAB } from './components/FAB';
import { InsightsPanel } from './components/InsightsPanel';
import { ErrorBoundary } from './components/ErrorBoundary';

function AppContent() {
  const { entries, storageStatus } = useEntries();
  const todayEntries = getTodayEntries(entries);
  const dailyTotal = todayEntries.reduce(
    (acc, entry) => ({ calories: acc.calories + entry.calories, sugar: acc.sugar + entry.sugar }),
    { calories: 0, sugar: 0 }
  );
  const streak = getStreak(entries);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const lastFocusedRef = useRef<HTMLElement | null>(null);

  const handleOpenSheet = () => {
    lastFocusedRef.current = document.activeElement as HTMLElement;
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => setIsSheetOpen(false);

  return (
    <>
      <main
        className="max-w-[480px] mx-auto px-6 md:px-8 flex flex-col gap-6 pt-6 pb-[180px]"
        inert={isSheetOpen ? true : undefined}
      >
        <DateStreakRow streak={streak} />
        <div className="grid grid-cols-2 gap-4">
          <StatCard
            label="Calories"
            value={dailyTotal.calories}
            unit="kcal"
            onClick={handleOpenSheet}
            ariaLabel={`Add entry. Today's calories: ${dailyTotal.calories} kcal`}
          />
          <StatCard
            label="Sugar"
            value={dailyTotal.sugar}
            unit="g"
            onClick={handleOpenSheet}
            ariaLabel={`Add entry. Today's sugar: ${dailyTotal.sugar} g`}
          />
        </div>
        {storageStatus !== 'available' && (
          <p role="status" className="text-dusty-tan text-center text-sm">
            Your browser can't save data right now. Try opening this page in a regular browser window.
          </p>
        )}
        {todayEntries.length > 0 && (
          <ul className="flex flex-col gap-2">
            {[...todayEntries].reverse().map(entry => (
              <EntryCard key={entry.id} entry={entry} />
            ))}
          </ul>
        )}
        <FAB onClick={handleOpenSheet} bottomClass="bottom-[148px]" />
      </main>
      <InsightsPanel
        entries={entries}
        inert={isSheetOpen ? true : undefined}
      />
      <EntrySheet
        isOpen={isSheetOpen}
        onClose={handleCloseSheet}
        lastFocusedRef={lastFocusedRef}
      />
    </>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <EntriesProvider>
        <AppContent />
      </EntriesProvider>
    </ErrorBoundary>
  );
}

export default App;
