import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { DateStreakRow } from './DateStreakRow';

describe('DateStreakRow', () => {
  afterEach(() => {
    vi.useRealTimers();
  });

  it('renders a time element', () => {
    render(<DateStreakRow streak={0} />);
    expect(screen.getByRole('time')).toBeInTheDocument();
  });

  it('time element has a YYYY-MM-DD dateTime attribute', () => {
    render(<DateStreakRow streak={0} />);
    const timeEl = screen.getByRole('time');
    expect(timeEl.getAttribute('dateTime')).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('displays date in weekday, month day format', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-06T12:00:00Z'));
    render(<DateStreakRow streak={0} />);
    // March 6, 2026 is a Friday
    expect(screen.getByRole('time')).toHaveTextContent('Friday, March 6');
  });

  it('dateTime attribute equals the local calendar date', () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-03-06T12:00:00Z'));
    render(<DateStreakRow streak={0} />);
    // Compute expected local date the same way the component does
    const now = new Date();
    const pad = (n: number) => String(n).padStart(2, '0');
    const expectedDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
    expect(screen.getByRole('time')).toHaveAttribute('dateTime', expectedDate);
  });

  it('displays streak with fire emoji prefix', () => {
    render(<DateStreakRow streak={5} />);
    expect(screen.getByText('🔥5')).toBeInTheDocument();
  });

  it('displays zero streak as 🔥0 with no special treatment', () => {
    render(<DateStreakRow streak={0} />);
    expect(screen.getByText('🔥0')).toBeInTheDocument();
  });

  it('streak element has text-warm-amber class', () => {
    render(<DateStreakRow streak={3} />);
    const streakEl = screen.getByText('🔥3');
    expect(streakEl).toHaveClass('text-warm-amber');
  });
});
