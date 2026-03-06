import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Entry, StorageStatus } from '../types';
import { loadEntries, saveEntries } from '../services/storageService';

interface EntriesContextValue {
  entries: Entry[];
  addEntry: (calories: number, sugar: number) => void;
  storageStatus: StorageStatus;
}

const EntriesContext = createContext<EntriesContextValue | null>(null);

export function EntriesProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ entries: Entry[]; storageStatus: StorageStatus }>(() => {
    const { entries: loaded, status } = loadEntries();
    return { entries: loaded, storageStatus: status };
  });

  const { entries, storageStatus } = state;

  const addEntry = (calories: number, sugar: number) => {
    const newEntry: Entry = {
      id: crypto.randomUUID(),
      calories,
      sugar,
      timestamp: new Date().toISOString(),
    };
    const updatedEntries = [...entries, newEntry];
    const saveStatus = saveEntries(updatedEntries);
    setState({
      entries: updatedEntries,
      storageStatus: saveStatus !== 'available' ? saveStatus : storageStatus,
    });
  };

  return (
    <EntriesContext.Provider value={{ entries, addEntry, storageStatus }}>
      {children}
    </EntriesContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useEntries(): EntriesContextValue {
  const context = useContext(EntriesContext);
  if (context === null) {
    throw new Error('useEntries must be used within an EntriesProvider');
  }
  return context;
}
