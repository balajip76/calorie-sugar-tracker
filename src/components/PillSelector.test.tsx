import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { PillSelector } from './PillSelector';

describe('PillSelector', () => {
  it('renders all 5 period labels', () => {
    render(<PillSelector selected={3} onChange={vi.fn()} />);
    expect(screen.getByText('1d')).toBeInTheDocument();
    expect(screen.getByText('3d')).toBeInTheDocument();
    expect(screen.getByText('7d')).toBeInTheDocument();
    expect(screen.getByText('30d')).toBeInTheDocument();
    expect(screen.getByText('90d')).toBeInTheDocument();
  });

  it('marks selected pill with aria-selected true', () => {
    render(<PillSelector selected={7} onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '7d' })).toHaveAttribute('aria-selected', 'true');
  });

  it('marks non-selected pills with aria-selected false', () => {
    render(<PillSelector selected={3} onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '1d' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: '7d' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: '30d' })).toHaveAttribute('aria-selected', 'false');
    expect(screen.getByRole('tab', { name: '90d' })).toHaveAttribute('aria-selected', 'false');
  });

  it('has tablist container with correct role and label', () => {
    render(<PillSelector selected={3} onChange={vi.fn()} />);
    expect(screen.getByRole('tablist', { name: 'Insight period' })).toBeInTheDocument();
  });

  it('active tab has tabIndex 0 (roving tabindex)', () => {
    render(<PillSelector selected={3} onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '3d' })).toHaveAttribute('tabindex', '0');
  });

  it('inactive tabs have tabIndex -1 (roving tabindex)', () => {
    render(<PillSelector selected={3} onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '1d' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tab', { name: '7d' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tab', { name: '30d' })).toHaveAttribute('tabindex', '-1');
    expect(screen.getByRole('tab', { name: '90d' })).toHaveAttribute('tabindex', '-1');
  });

  it('calls onChange with correct period on click', () => {
    const onChange = vi.fn();
    render(<PillSelector selected={3} onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: '30d' }));
    expect(onChange).toHaveBeenCalledWith(30);
  });

  it('calls onChange with 1 when clicking 1d pill', () => {
    const onChange = vi.fn();
    render(<PillSelector selected={3} onChange={onChange} />);
    fireEvent.click(screen.getByRole('tab', { name: '1d' }));
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('active pill has bg-rose-blush class', () => {
    render(<PillSelector selected={3} onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '3d' })).toHaveClass('bg-rose-blush');
  });

  it('inactive pills do not have bg-rose-blush class', () => {
    render(<PillSelector selected={3} onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '1d' })).not.toHaveClass('bg-rose-blush');
    expect(screen.getByRole('tab', { name: '90d' })).not.toHaveClass('bg-rose-blush');
  });

  it('ArrowRight calls onChange with next period', () => {
    const onChange = vi.fn();
    render(<PillSelector selected={3} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: '3d' }), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(7);
  });

  it('ArrowLeft calls onChange with previous period', () => {
    const onChange = vi.fn();
    render(<PillSelector selected={7} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: '7d' }), { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(3);
  });

  it('ArrowRight wraps from last pill to first', () => {
    const onChange = vi.fn();
    render(<PillSelector selected={90} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: '90d' }), { key: 'ArrowRight' });
    expect(onChange).toHaveBeenCalledWith(1);
  });

  it('ArrowLeft wraps from first pill to last', () => {
    const onChange = vi.fn();
    render(<PillSelector selected={1} onChange={onChange} />);
    fireEvent.keyDown(screen.getByRole('tab', { name: '1d' }), { key: 'ArrowLeft' });
    expect(onChange).toHaveBeenCalledWith(90);
  });

  it('ArrowRight moves DOM focus to the next tab', () => {
    const onChange = vi.fn();
    render(<PillSelector selected={3} onChange={onChange} />);
    const tab3d = screen.getByRole('tab', { name: '3d' });
    tab3d.focus();
    fireEvent.keyDown(tab3d, { key: 'ArrowRight' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: '7d' }));
  });

  it('ArrowLeft moves DOM focus to the previous tab', () => {
    const onChange = vi.fn();
    render(<PillSelector selected={7} onChange={onChange} />);
    const tab7d = screen.getByRole('tab', { name: '7d' });
    tab7d.focus();
    fireEvent.keyDown(tab7d, { key: 'ArrowLeft' });
    expect(document.activeElement).toBe(screen.getByRole('tab', { name: '3d' }));
  });

  it('transition has duration-100 class for sub-100ms switch', () => {
    render(<PillSelector selected={3} onChange={vi.fn()} />);
    expect(screen.getByRole('tab', { name: '3d' })).toHaveClass('duration-100');
  });
});
