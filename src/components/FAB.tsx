interface FABProps {
  onClick: () => void;
  bottomClass?: string;
}

export function FAB({ onClick, bottomClass = 'bottom-6' }: FABProps) {
  return (
    <button
      type="button"
      aria-label="Add entry"
      onClick={onClick}
      className={`fixed ${bottomClass} right-6 z-10 w-14 h-14 rounded-full bg-soft-terracotta text-cream flex items-center justify-center text-2xl hover:bg-deep-terracotta hover:scale-[1.08] active:scale-[0.97] transition-all duration-150 ease-out`}
    >
      <span aria-hidden="true" className="leading-none">+</span>
    </button>
  );
}
