import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
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
  vi.mocked(storageService.loadEntries).mockReturnValue({ entries: [], status: 'available' });
  vi.mocked(storageService.saveEntries).mockReturnValue('available');
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

  it('renders two stat card buttons', () => {
    render(<App />);
    const buttons = screen.getAllByRole('button');
    expect(buttons).toHaveLength(2);
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
});
