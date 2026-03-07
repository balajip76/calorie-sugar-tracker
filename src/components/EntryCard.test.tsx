import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EntryCard } from './EntryCard';
import type { Entry } from '../types';

const mockEntry: Entry = {
  id: 'test-1',
  calories: 620,
  sugar: 14,
  timestamp: new Date('2026-03-06T12:34:00').toISOString(),
};

function renderCard(entry: Entry = mockEntry) {
  return render(
    <ul>
      <EntryCard entry={entry} />
    </ul>
  );
}

describe('EntryCard', () => {
  it('renders a list item', () => {
    renderCard();
    expect(screen.getByRole('listitem')).toBeInTheDocument();
  });

  it('displays the formatted time', () => {
    renderCard();
    const formattedTime = new Date(mockEntry.timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    expect(screen.getByText(formattedTime)).toBeInTheDocument();
  });

  it('displays the calories value', () => {
    renderCard();
    expect(screen.getByText(/620/)).toBeInTheDocument();
  });

  it('displays the sugar value', () => {
    renderCard();
    expect(screen.getByText(/14 g/)).toBeInTheDocument();
  });

  it('aria-label contains "kilocalories"', () => {
    renderCard();
    const listitem = screen.getByRole('listitem');
    expect(listitem).toHaveAttribute('aria-label', expect.stringContaining('kilocalories'));
  });

  it('aria-label contains "grams sugar"', () => {
    renderCard();
    const listitem = screen.getByRole('listitem');
    expect(listitem).toHaveAttribute('aria-label', expect.stringContaining('grams sugar'));
  });

  it('applies the card fade-in animation class', () => {
    renderCard();
    const listitem = screen.getByRole('listitem');
    expect(listitem).toHaveClass('animate-card-fade-in');
  });
});
