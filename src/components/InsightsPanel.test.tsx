import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { InsightsPanel } from './InsightsPanel';
import type { Entry } from '../types';

let entryIdCounter = 0;
function makeEntry(overrides: Partial<Entry> = {}): Entry {
  return {
    id: `test-id-${++entryIdCounter}`,
    calories: 400,
    sugar: 12,
    timestamp: new Date().toISOString(),
    ...overrides,
  };
}

describe('InsightsPanel', () => {
  it('shows empty state message when no entries', () => {
    render(<InsightsPanel entries={[]} />);
    expect(screen.getByText('Insights will appear after your first entry')).toBeInTheDocument();
  });

  it('shows PillSelector with all 5 pills in empty state', () => {
    render(<InsightsPanel entries={[]} />);
    expect(screen.getByText('1d')).toBeInTheDocument();
    expect(screen.getByText('3d')).toBeInTheDocument();
    expect(screen.getByText('7d')).toBeInTheDocument();
    expect(screen.getByText('30d')).toBeInTheDocument();
    expect(screen.getByText('90d')).toBeInTheDocument();
  });

  it('does not show average values in empty state', () => {
    render(<InsightsPanel entries={[]} />);
    expect(screen.queryByText('Avg daily calories')).not.toBeInTheDocument();
    expect(screen.queryByText('Avg daily sugar')).not.toBeInTheDocument();
  });

  it('shows average values when entries exist', () => {
    const entries = [makeEntry({ calories: 900, sugar: 30 })];
    render(<InsightsPanel entries={entries} />);
    // Default 3d period: 900/3 = 300 kcal avg
    expect(screen.getByText('300 kcal')).toBeInTheDocument();
    expect(screen.getByText('10 g')).toBeInTheDocument();
  });

  it('shows label text for average values', () => {
    render(<InsightsPanel entries={[makeEntry()]} />);
    expect(screen.getByText('Avg daily calories')).toBeInTheDocument();
    expect(screen.getByText('Avg daily sugar')).toBeInTheDocument();
  });

  it('rounds average values to nearest integer', () => {
    // 700/3 = 233.33... → 233
    const entries = [makeEntry({ calories: 700, sugar: 10 })];
    render(<InsightsPanel entries={entries} />);
    expect(screen.getByText('233 kcal')).toBeInTheDocument();
  });

  it('updates values when pill selection changes', () => {
    const entries = [makeEntry({ calories: 700, sugar: 14 })];
    render(<InsightsPanel entries={entries} />);
    // Default 3d: 700/3 ≈ 233
    fireEvent.click(screen.getByRole('tab', { name: '7d' }));
    // 7d: 700/7 = 100
    expect(screen.getByText('100 kcal')).toBeInTheDocument();
  });

  it('values container has aria-live polite', () => {
    const entries = [makeEntry()];
    render(<InsightsPanel entries={entries} />);
    const liveRegion = screen.getByText(/kcal/).closest('[aria-live]');
    expect(liveRegion).toHaveAttribute('aria-live', 'polite');
  });

  it('empty state message has aria-live polite', () => {
    render(<InsightsPanel entries={[]} />);
    const emptyMsg = screen.getByText('Insights will appear after your first entry');
    expect(emptyMsg).toHaveAttribute('aria-live', 'polite');
  });

  it('default period is 3d (3d pill is selected)', () => {
    render(<InsightsPanel entries={[]} />);
    expect(screen.getByRole('tab', { name: '3d' })).toHaveAttribute('aria-selected', 'true');
  });

  it('selected pill changes when clicked', () => {
    render(<InsightsPanel entries={[]} />);
    fireEvent.click(screen.getByRole('tab', { name: '30d' }));
    expect(screen.getByRole('tab', { name: '30d' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tab', { name: '3d' })).toHaveAttribute('aria-selected', 'false');
  });
});
