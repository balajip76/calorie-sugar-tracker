import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, afterEach } from 'vitest';
import { StatCard } from './StatCard';

function renderCard(overrides: Partial<{
  label: string;
  value: number;
  unit: string;
  onClick: () => void;
  ariaLabel: string;
}> = {}) {
  const onClick = overrides.onClick ?? vi.fn();
  const props = {
    label: 'Calories',
    value: 500,
    unit: 'kcal',
    onClick,
    ariaLabel: "Add entry. Today's calories: 500 kcal",
    ...overrides,
  };
  render(<StatCard {...props} />);
  return { onClick };
}

describe('StatCard', () => {
  it('renders label, value, and unit', () => {
    renderCard();
    expect(screen.getByText('Calories')).toBeInTheDocument();
    expect(screen.getByText('500')).toBeInTheDocument();
    expect(screen.getByText('kcal')).toBeInTheDocument();
  });

  it('has role="button"', () => {
    renderCard();
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('has correct aria-label', () => {
    renderCard();
    expect(screen.getByRole('button')).toHaveAttribute(
      'aria-label',
      "Add entry. Today's calories: 500 kcal"
    );
  });

  it('is keyboard focusable (tabIndex=0)', () => {
    renderCard();
    expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0');
  });

  it('value 0 has text-dusty-tan class', () => {
    renderCard({ value: 0 });
    const valueEl = screen.getByText('0');
    expect(valueEl.className).toContain('text-dusty-tan');
  });

  it('positive value has text-espresso class', () => {
    renderCard({ value: 500 });
    const valueEl = screen.getByText('500');
    expect(valueEl.className).toContain('text-espresso');
  });

  it('negative value (correcting entry, FR6) has text-espresso class', () => {
    renderCard({ value: -100 });
    const valueEl = screen.getByText('-100');
    expect(valueEl.className).toContain('text-espresso');
  });

  it('calls onClick when clicked', () => {
    const { onClick } = renderCard();
    fireEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Enter key is pressed', () => {
    const { onClick } = renderCard();
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Enter' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('calls onClick when Space key is pressed', () => {
    const { onClick } = renderCard();
    fireEvent.keyDown(screen.getByRole('button'), { key: ' ' });
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick for other keys', () => {
    const { onClick } = renderCard();
    fireEvent.keyDown(screen.getByRole('button'), { key: 'Tab' });
    expect(onClick).not.toHaveBeenCalled();
  });
});

describe('count-up animation', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('animates to final value after value change', () => {
    // Mock rAF to fire immediately with a far-future timestamp so progress = 1
    vi.stubGlobal('requestAnimationFrame', (cb: FrameRequestCallback) => {
      cb(performance.now() + 1000);
      return 0;
    });
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const { rerender } = render(
      <StatCard label="Calories" value={0} unit="kcal" onClick={vi.fn()} ariaLabel="test" />
    );
    expect(screen.getByText('0')).toBeInTheDocument();

    rerender(
      <StatCard label="Calories" value={500} unit="kcal" onClick={vi.fn()} ariaLabel="test" />
    );
    expect(screen.getByText('500')).toBeInTheDocument();
  });

  it('updates instantly when prefers-reduced-motion is active', () => {
    const mockRaf = vi.fn();
    vi.stubGlobal('matchMedia', vi.fn().mockReturnValue({ matches: true }));
    vi.stubGlobal('requestAnimationFrame', mockRaf);
    vi.stubGlobal('cancelAnimationFrame', vi.fn());

    const { rerender } = render(
      <StatCard label="Calories" value={0} unit="kcal" onClick={vi.fn()} ariaLabel="test" />
    );
    rerender(
      <StatCard label="Calories" value={500} unit="kcal" onClick={vi.fn()} ariaLabel="test" />
    );

    expect(mockRaf).not.toHaveBeenCalled();
    expect(screen.getByText('500')).toBeInTheDocument();
  });
});
