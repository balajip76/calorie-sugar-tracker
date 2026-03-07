import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { useRef, useState } from 'react';
import { EntrySheet } from './EntrySheet';
import { EntriesProvider } from '../context/EntriesContext';
import * as storageService from '../services/storageService';

vi.mock('../services/storageService');

function renderSheet(isOpen = true, onClose = vi.fn()) {
  function Wrapper() {
    const lastFocusedRef = useRef<HTMLElement | null>(null);
    return (
      <EntriesProvider>
        <EntrySheet isOpen={isOpen} onClose={onClose} lastFocusedRef={lastFocusedRef} />
      </EntriesProvider>
    );
  }
  return render(<Wrapper />);
}

beforeEach(() => {
  vi.clearAllMocks();
  vi.mocked(storageService.loadEntries).mockReturnValue({ entries: [], status: 'available' });
  vi.mocked(storageService.saveEntries).mockReturnValue('available');
});

describe('EntrySheet', () => {
  it('renders nothing when isOpen is false', () => {
    renderSheet(false);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('renders the dialog when isOpen is true', () => {
    renderSheet();
    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('has role="dialog" and aria-modal="true"', () => {
    renderSheet();
    const dialog = screen.getByRole('dialog');
    expect(dialog).toHaveAttribute('aria-modal', 'true');
  });

  it('renders Calories and Sugar inputs via labels', () => {
    renderSheet();
    expect(screen.getByLabelText(/calories/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/sugar/i)).toBeInTheDocument();
  });

  it('calories input has placeholder "e.g. 450"', () => {
    renderSheet();
    expect(screen.getByPlaceholderText('e.g. 450')).toBeInTheDocument();
  });

  it('sugar input has placeholder "e.g. 12"', () => {
    renderSheet();
    expect(screen.getByPlaceholderText('e.g. 12')).toBeInTheDocument();
  });

  it('renders Log button', () => {
    renderSheet();
    expect(screen.getByRole('button', { name: /log/i })).toBeInTheDocument();
  });

  it('typing in calories updates the input value', () => {
    renderSheet();
    const input = screen.getByPlaceholderText('e.g. 450');
    fireEvent.change(input, { target: { value: '450' } });
    expect(input).toHaveValue('450');
  });

  it('typing in sugar updates the input value', () => {
    renderSheet();
    const input = screen.getByPlaceholderText('e.g. 12');
    fireEvent.change(input, { target: { value: '12' } });
    expect(input).toHaveValue('12');
  });

  it('clicking Log calls onClose after slide-down animation', () => {
    const onClose = vi.fn();
    renderSheet(true, onClose);
    fireEvent.click(screen.getByRole('button', { name: /log/i }));
    fireEvent(screen.getByTestId('sheet-panel'), new Event('animationend', { bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('clicking Log saves entry with entered values via addEntry', () => {
    renderSheet();
    fireEvent.change(screen.getByPlaceholderText('e.g. 450'), { target: { value: '500' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 12'), { target: { value: '15' } });
    fireEvent.click(screen.getByRole('button', { name: /log/i }));
    expect(storageService.saveEntries).toHaveBeenCalledTimes(1);
    const saved = vi.mocked(storageService.saveEntries).mock.calls[0][0];
    expect(saved[0].calories).toBe(500);
    expect(saved[0].sugar).toBe(15);
  });

  it('clicking Log with empty fields saves entry with 0, 0', () => {
    renderSheet();
    fireEvent.click(screen.getByRole('button', { name: /log/i }));
    expect(storageService.saveEntries).toHaveBeenCalledTimes(1);
    const saved = vi.mocked(storageService.saveEntries).mock.calls[0][0];
    expect(saved[0].calories).toBe(0);
    expect(saved[0].sugar).toBe(0);
  });

  it('clicking backdrop calls onClose after slide-down animation', () => {
    const onClose = vi.fn();
    renderSheet(true, onClose);
    const dialog = screen.getByRole('dialog');
    const backdrop = dialog.querySelector('[aria-hidden="true"]') as HTMLElement;
    fireEvent.click(backdrop);
    fireEvent(screen.getByTestId('sheet-panel'), new Event('animationend', { bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('pressing Escape calls onClose after slide-down animation', () => {
    const onClose = vi.fn();
    renderSheet(true, onClose);
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent(screen.getByTestId('sheet-panel'), new Event('animationend', { bubbles: true }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('pressing Escape does not save an entry', () => {
    renderSheet();
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(storageService.saveEntries).not.toHaveBeenCalled();
  });

  it('Tab from Log button wraps focus to Smart Search input', () => {
    renderSheet();
    const logButton = screen.getByRole('button', { name: /log/i });
    logButton.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: false });
    expect(document.activeElement).toBe(screen.getByPlaceholderText('Search food (e.g. chicken rice)'));
  });

  it('Shift+Tab from Smart Search input wraps focus to Log button', () => {
    renderSheet();
    const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
    searchInput.focus();
    fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: /log/i }));
  });

  it('renders smart search field with correct placeholder', () => {
    renderSheet();
    expect(screen.getByPlaceholderText('Search food (e.g. chicken rice)')).toBeInTheDocument();
  });

  it('smart search field has an accessible label', () => {
    renderSheet();
    expect(screen.getByLabelText(/search food/i)).toBeInTheDocument();
  });

  it('pressing Enter in smart search opens Google with URL-encoded query', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderSheet();
    const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
    fireEvent.change(searchInput, { target: { value: 'chicken rice' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    expect(openSpy).toHaveBeenCalledWith(
      `https://www.google.com/search?q=${encodeURIComponent('chicken rice')}`,
      '_blank',
      'noopener,noreferrer'
    );
    openSpy.mockRestore();
  });

  it('clicking search icon button opens Google with URL-encoded query', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderSheet();
    const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
    fireEvent.change(searchInput, { target: { value: 'banana' } });
    fireEvent.click(screen.getByRole('button', { name: /search google/i }));
    expect(openSpy).toHaveBeenCalledWith(
      `https://www.google.com/search?q=${encodeURIComponent('banana')}`,
      '_blank',
      'noopener,noreferrer'
    );
    openSpy.mockRestore();
  });

  it('smart search with empty field does not open new tab', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderSheet();
    const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it('smart search with whitespace-only query does not open new tab', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderSheet();
    const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
    fireEvent.change(searchInput, { target: { value: '   ' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    expect(openSpy).not.toHaveBeenCalled();
    openSpy.mockRestore();
  });

  it('smart search field value is preserved while user fills in calories and sugar', () => {
    renderSheet();
    const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
    fireEvent.change(searchInput, { target: { value: 'salmon fillet' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 450'), { target: { value: '350' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 12'), { target: { value: '0' } });
    expect(searchInput).toHaveValue('salmon fillet');
  });

  it('logging an entry works correctly regardless of smart search field content', () => {
    renderSheet();
    fireEvent.change(screen.getByPlaceholderText('Search food (e.g. chicken rice)'), {
      target: { value: 'pizza slice' },
    });
    fireEvent.change(screen.getByPlaceholderText('e.g. 450'), { target: { value: '600' } });
    fireEvent.change(screen.getByPlaceholderText('e.g. 12'), { target: { value: '8' } });
    fireEvent.click(screen.getByRole('button', { name: /log/i }));
    expect(storageService.saveEntries).toHaveBeenCalledTimes(1);
    const saved = vi.mocked(storageService.saveEntries).mock.calls[0][0];
    expect(saved[0].calories).toBe(600);
    expect(saved[0].sugar).toBe(8);
  });

  it('smart search field resets to empty when sheet reopens', () => {
    function ToggleWrapper() {
      const [open, setOpen] = useState(true);
      const lastFocusedRef = useRef<HTMLElement | null>(null);
      return (
        <EntriesProvider>
          <button onClick={() => setOpen((o) => !o)}>Toggle</button>
          <EntrySheet isOpen={open} onClose={() => setOpen(false)} lastFocusedRef={lastFocusedRef} />
        </EntriesProvider>
      );
    }
    render(<ToggleWrapper />);

    // Type into search field
    const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
    fireEvent.change(searchInput, { target: { value: 'pizza' } });
    expect(searchInput).toHaveValue('pizza');

    // Close the sheet via Escape + animationend
    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent(screen.getByTestId('sheet-panel'), new Event('animationend', { bubbles: true }));
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();

    // Reopen the sheet
    fireEvent.click(screen.getByRole('button', { name: /toggle/i }));
    expect(screen.getByPlaceholderText('Search food (e.g. chicken rice)')).toHaveValue('');
  });

  it('search URL-encodes special characters correctly', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);
    renderSheet();
    const searchInput = screen.getByPlaceholderText('Search food (e.g. chicken rice)');
    fireEvent.change(searchInput, { target: { value: 'café & croissant #1' } });
    fireEvent.keyDown(searchInput, { key: 'Enter' });
    expect(openSpy).toHaveBeenCalledWith(
      `https://www.google.com/search?q=${encodeURIComponent('café & croissant #1')}`,
      '_blank',
      'noopener,noreferrer'
    );
    openSpy.mockRestore();
  });
});
