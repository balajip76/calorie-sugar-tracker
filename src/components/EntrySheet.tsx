import { useEffect, useRef, useState } from 'react';
import { useEntries } from '../context/EntriesContext';

interface EntrySheetProps {
  isOpen: boolean;
  onClose: () => void;
  lastFocusedRef: React.RefObject<HTMLElement | null>;
}

export function EntrySheet({ isOpen, onClose, lastFocusedRef }: EntrySheetProps) {
  const { addEntry } = useEntries();
  const [calories, setCalories] = useState('');
  const [sugar, setSugar] = useState('');
  const [isClosing, setIsClosing] = useState(false);
  // Ref mirrors isClosing for synchronous reads in the animationend listener
  const isClosingRef = useRef(false);
  // Ref keeps onClose stable across renders without needing it in effect deps
  const onCloseRef = useRef(onClose);
  onCloseRef.current = onClose;
  const sheetPanelRef = useRef<HTMLDivElement>(null);
  const caloriesRef = useRef<HTMLInputElement>(null);
  const sugarRef = useRef<HTMLInputElement>(null);
  const logButtonRef = useRef<HTMLButtonElement>(null);

  // Reset state and auto-focus calories input on open
  useEffect(() => {
    if (isOpen) {
      isClosingRef.current = false;
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsClosing(false);
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setCalories('');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSugar('');
      const timeoutId = setTimeout(() => {
        caloriesRef.current?.focus();
      }, 50);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen]);

  // Return focus to trigger element on close
  useEffect(() => {
    if (!isOpen) {
      lastFocusedRef.current?.focus();
    }
  }, [isOpen, lastFocusedRef]);

  // Keyboard: Escape to start dismiss animation, Tab for focus trap
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        isClosingRef.current = true;
        setIsClosing(true);
        return;
      }
      if (e.key === 'Tab') {
        const focusable = [
          caloriesRef.current,
          sugarRef.current,
          logButtonRef.current,
        ].filter((el): el is HTMLElement => el !== null);
        const first = focusable[0];
        const last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  // Direct animationend listener on the panel element — bypasses React event
  // delegation so dispatchEvent works reliably in both browser and jsdom tests.
  useEffect(() => {
    const el = sheetPanelRef.current;
    if (!el) return;
    const handler = () => {
      if (isClosingRef.current) {
        isClosingRef.current = false;
        onCloseRef.current();
      }
    };
    el.addEventListener('animationend', handler);
    return () => el.removeEventListener('animationend', handler);
  }, [isOpen]); // re-attach whenever the sheet opens (isOpen drives mount)

  // Start dismiss animation; onClose called after slide-down animation ends
  const handleClose = () => {
    isClosingRef.current = true;
    setIsClosing(true);
  };

  const handleLog = () => {
    addEntry(Number(calories) || 0, Number(sugar) || 0);
    handleClose();
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Add entry"
      className="fixed inset-0 z-50"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-espresso/20"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Sheet panel */}
      <div
        ref={sheetPanelRef}
        data-testid="sheet-panel"
        className={`fixed bottom-0 left-0 right-0 max-w-[480px] mx-auto bg-cream rounded-t-lg shadow-sheet max-h-[60vh] overflow-y-auto flex flex-col p-6 gap-4 ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}
      >
        {/* Handle bar */}
        <div className="w-10 h-1 bg-sand-mist rounded-pill mx-auto -mt-2 mb-2" aria-hidden="true" />

        {/* Calories input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="entry-calories" className="text-section-label font-semibold text-warm-stone">
            Calories
          </label>
          <input
            ref={caloriesRef}
            id="entry-calories"
            inputMode="numeric"
            placeholder="e.g. 450"
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            className="bg-warm-linen border border-sand-mist rounded-sm px-4 py-3 text-input-field font-medium text-espresso placeholder:text-dusty-tan focus:outline-none focus:border-soft-terracotta transition-colors"
          />
        </div>

        {/* Sugar input */}
        <div className="flex flex-col gap-1">
          <label htmlFor="entry-sugar" className="text-section-label font-semibold text-warm-stone">
            Sugar (g)
          </label>
          <input
            ref={sugarRef}
            id="entry-sugar"
            inputMode="numeric"
            placeholder="e.g. 12"
            value={sugar}
            onChange={(e) => setSugar(e.target.value)}
            className="bg-warm-linen border border-sand-mist rounded-sm px-4 py-3 text-input-field font-medium text-espresso placeholder:text-dusty-tan focus:outline-none focus:border-soft-terracotta transition-colors"
          />
        </div>

        {/* Log button */}
        <button
          ref={logButtonRef}
          type="button"
          onClick={handleLog}
          className="w-full bg-soft-terracotta text-cream text-button font-semibold rounded-pill py-3 hover:bg-deep-terracotta active:scale-[0.97] transition-all"
        >
          Log
        </button>
      </div>
    </div>
  );
}
