import { EntriesProvider, useEntries } from './context/EntriesContext';
import { getDailyTotal } from './utils/calculations';
import { StatCard } from './components/StatCard';
import { DateStreakRow } from './components/DateStreakRow';

function AppContent() {
  const { entries } = useEntries();
  const dailyTotal = getDailyTotal(entries);

  const handleOpenSheet = () => {
    // EntrySheet will be implemented in Story 2.4
  };

  return (
    <main className="max-w-[480px] mx-auto px-6 md:px-8 flex flex-col gap-6 pt-6">
      <DateStreakRow />
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
    </main>
  );
}

function App() {
  return (
    <EntriesProvider>
      <AppContent />
    </EntriesProvider>
  );
}

export default App;
