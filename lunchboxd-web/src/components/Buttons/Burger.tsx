interface BurgerProps {
  isOpen: boolean;
  toggle: () => void;
}

export function Burger({ isOpen, toggle }: BurgerProps) {
  return (
    <button
      onClick={toggle}
      className="relative flex flex-col justify-center items-center gap-1.5 w-10 h-10 border-none bg-transparent cursor-pointer z-50 group"
      aria-label="Toggle menu"
    >
      {/* Top Line */}
      <div
        className={`bg-sand h-1 w-8 rounded-full transition-all duration-300 ease-in-out origin-center ${
          isOpen ? "rotate-45 translate-y-2.5" : ""
        }`}
      ></div>

      {/* Middle Line */}
      <div
        className={`bg-sand h-1 w-8 rounded-full transition-all duration-300 ease-in-out ${
          isOpen ? "opacity-0" : "opacity-100"
        }`}
      ></div>

      {/* Bottom Line */}
      <div
        className={`bg-sand h-1 w-8 rounded-full transition-all duration-300 ease-in-out origin-center ${
          isOpen ? "-rotate-45 -translate-y-2.5" : ""
        }`}
      ></div>
    </button>
  );
}
