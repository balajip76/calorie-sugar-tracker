import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { FAB } from './FAB';

describe('FAB', () => {
  it('renders a button with aria-label "Add entry"', () => {
    render(<FAB onClick={vi.fn()} />);
    expect(screen.getByRole('button', { name: 'Add entry' })).toBeInTheDocument();
  });

  it('calls onClick when clicked', () => {
    const onClick = vi.fn();
    render(<FAB onClick={onClick} />);
    fireEvent.click(screen.getByRole('button', { name: 'Add entry' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('has fixed positioning and stacking classes', () => {
    render(<FAB onClick={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Add entry' });
    expect(btn).toHaveClass('fixed', 'bottom-6', 'right-6', 'z-10');
  });

  it('is a circle shape with correct size', () => {
    render(<FAB onClick={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Add entry' });
    expect(btn).toHaveClass('rounded-full', 'w-14', 'h-14');
  });

  it('has soft-terracotta background', () => {
    render(<FAB onClick={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Add entry' });
    expect(btn).toHaveClass('bg-soft-terracotta');
  });

  it('displays a + icon', () => {
    render(<FAB onClick={vi.fn()} />);
    expect(screen.getByText('+')).toBeInTheDocument();
  });

  it('applies custom bottomClass when provided', () => {
    render(<FAB onClick={vi.fn()} bottomClass="bottom-[148px]" />);
    const btn = screen.getByRole('button', { name: 'Add entry' });
    expect(btn).toHaveClass('bottom-[148px]');
    expect(btn).not.toHaveClass('bottom-6');
  });

  it('uses default bottom-6 class when bottomClass is not provided', () => {
    render(<FAB onClick={vi.fn()} />);
    const btn = screen.getByRole('button', { name: 'Add entry' });
    expect(btn).toHaveClass('bottom-6');
  });
});
