export interface Entry {
  id: string;
  calories: number;
  sugar: number;
  timestamp: string;
}

export type InsightPeriod = 1 | 3 | 7 | 30 | 90;

export type StorageStatus = 'available' | 'unavailable' | 'quota-exceeded';
