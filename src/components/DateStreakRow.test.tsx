import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DateStreakRow } from './DateStreakRow';

describe('DateStreakRow', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a time element', () => {
    render(<DateStreakRow />);
    expect(screen.getByRole('time')).toBeInTheDocument();
  });

  it('time element has a YYYY-MM-DD dateTime attribute', () => {
    render(<DateStreakRow />);
    const timeEl = screen.getByRole('time');
    expect(timeEl.getAttribute('dateTime')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('displays date in weekday, month day format', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-06T12:00:00Z'));
    render(<DateStreakRow />);
    // March 6, 2026 is a Friday
    expect(screen.getByRole('time')).toHaveTextContent('Friday, March 6');
  });

  it('dateTime attribute equals the local calendar date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-06T12:00:00Z'));
    render(<DateStreakRow />);
    // Compute expected local date the same way the component does
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const expectedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    expect(screen.getByRole('time')).toHaveAttribute('dateTime', expectedDate);
  });
});
