import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import App from './App';
import * as storageService from './services/storageService';
import type { Entry } from './types';

vi.mock('./services/storageService');

const TODAY_ENTRY: Entry = {
  id: 'test-1',
  calories: 500,
  sugar: 12,
  timestamp: new Date().toISOString(),
};

beforeEach(() => {
  vi.clearAllMocks();
  // Mock rAF to fire immediately so count-up animation completes synchronously in tests
  vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
    cb(performance.now() + 1000);
    return 0;
  });
  vi.stubGlobal('cancelAnimationFrame', vi.fn());
  vi.mocked(storageService.loadEntries).mockReturnValue({ entries: [], status: 'available' });
  vi.mocked(storageService.saveEntries).mockReturnValue('available');
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('App', () => {
  it('renders the base layout with a main element', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).toBeInTheDocument();
    expect(main).toHaveClass('max-w-[480px]', 'mx-auto', 'px-6', 'md:px-8');
  });

  it('renders the date row with a time element', () => {
    render(<App />);
    expect(screen.getByRole('time')).toBeInTheDocument();
  });

  it('renders two stat card buttons and the FAB (pills are tabs, not buttons)', () => {
    render(<App />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(3);
  });

  it('renders Calories and Sugar labels', () => {
    render(<App />);
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('Sugar')).toBeInTheDocument();
  });

  it('shows zero totals in zero state', () => {
    render(<App />);
    const zeros = screen.getAllByText('0');
    expect(zeros.length).toBeGreaterThanOrEqual(2);
  });

  it('shows correct totals when entries exist for today', () => {
    vi.mocked(storageService.loadEntries).mockReturnValue({
      entries: [TODAY_ENTRY],
      status: 'available',
    });
    render(<App />);
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('12')).toBeInTheDocument();
  });

  it('does not show EntrySheet dialog on initial render', () => {
    render(<App />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('clicking a StatCard opens the EntrySheet dialog', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('entering values and tapping Log saves an entry and closes the sheet', () => {
    render(<App />);
    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.change(screen.getByPlaceholderText('e.g. 450'), { target: { value: '300' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 12'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('button', { name: /log/i }));
    fireEvent(screen.getByTestId('sheet-panel'), new Event('animationend', { bubbles: true }));
    expect(storageService.saveEntries).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('main element has inert attribute while sheet is open', () => {
    render(<App />);
    const main = screen.getByRole('main');
    expect(main).not.toHaveAttribute('inert');
    fireEvent.click(screen.getAllByRole('button')[0]);
    expect(main).toHaveAttribute('inert');
  });

  it('renders no history list when there are no entries', () => {
    render(<App />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
  });

  it('renders an entry card after logging an entry', () => {
    render(<App />);
    expect(screen.queryByRole('list')).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button')[0]);
    fireEvent.change(screen.getByPlaceholderText('e.g. 450'), { target: { value: '500' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 12'), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /log/i }));
    fireEvent(screen.getByTestId('sheet-panel'), new Event('animationend', { bubbles: true }));
    expect(screen.getByRole('list')).toBeInTheDocument();
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('renders the FAB button', () => {
    render(<App />);
    expect(screen.getByRole('button', { name: 'Add entry' })).toBeInTheDocument();
  });

  it('clicking the FAB opens the EntrySheet dialog', () => {
    render(<App />);
    fireEvent.click(screen.getByRole('button', { name: 'Add entry' }));
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('shows storage unavailable message when storage cannot save', () => {
    vi.mocked(storageService.loadEntries).mockReturnValue({
      entries: [],
      status: 'unavailable',
    });
    render(<App />);
    expect(screen.getByText(/can't save data right now/i)).toBeInTheDocument();
  });

  it('shows storage unavailable message when quota is exceeded', () => {
    vi.mocked(storageService.loadEntries).mockReturnValue({
      entries: [],
      status: 'quota-exceeded',
    });
    render(<App />);
    expect(screen.getByText(/can't save data right now/i)).toBeInTheDocument();
  });

  it('does not show storage message when storage is available', () => {
    render(<App />);
    expect(screen.queryByText(/can't save data right now/i)).not.toBeInTheDocument();
  });

  it('displays the streak counter as 🔥0 in zero state', () => {
    render(<App />);
    expect(screen.getByText('🔥0')).toBeInTheDocument();
  });

  it('displays correct streak for entries spanning multiple consecutive days', () => {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    vi.mocked(storageService.loadEntries).mockReturnValue({
      entries: [
        { id: '1', calories: 100, sugar: 10, timestamp: new Date().toISOString() },
        { id: '2', calories: 200, sugar: 20, timestamp: yesterday.toISOString() },
      ],
      status: 'available',
    });
    render(<App />);
    expect(screen.getByText('🔥2')).toBeInTheDocument();
  });

  it('renders InsightsPanel with empty state when no entries', () => {
    render(<App />);
    expect(screen.getByText('Insights will appear after your first entry')).toBeInTheDocument();
  });

  it('renders PillSelector in InsightsPanel', () => {
    render(<App />);
    expect(screen.getByRole('tablist', { name: 'Insight period' })).toBeInTheDocument();
    expect(screen.getByRole('tab', { name: '3d' })).toBeInTheDocument();
  });

  it('renders InsightsPanel with average values when entries exist', () => {
    vi.mocked(storageService.loadEntries).mockReturnValue({
      entries: [TODAY_ENTRY],
      status: 'available',
    });
    render(<App />);
    expect(screen.getByText('Avg daily calories')).toBeInTheDocument();
    expect(screen.getByText('Avg daily sugar')).toBeInTheDocument();
  });

  it('renders entries in reverse chronological order', () => {
    const now = new Date();
    const earlier = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0, 0);
    const later = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0, 0);
    const entry1: Entry = {
      id: 'e1',
      calories: 100,
      sugar: 5,
      timestamp: earlier.toISOString(),
    };
    const entry2: Entry = {
      id: 'e2',
      calories: 200,
      sugar: 10,
      timestamp: later.toISOString(),
    };
    vi.mocked(storageService.loadEntries).mockReturnValue({
      entries: [entry1, entry2],
      status: 'available',
    });
    render(<App />);
    const items = screen.getAllByRole('listitem');
    expect(items).toHaveLength(2);
    // Most recent (entry2, 200 kcal) should be first
    expect(items[0]).toHaveAttribute('aria-label', expect.stringContaining('200 kilocalories'));
  });
});
