import msg from "../assets/message.svg";
import fb from "../assets/fb.svg";
import ig from "../assets/ig.svg";

export function Footer() {
  return (
    <footer className="bg-navy-dark px-4 sm:px-8 md:px-12 lg:px-20 py-6 md:py-0 md:h-37.5">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center h-full gap-4 md:gap-0 w-full">
        <div className="flex flex-col gap-1 text-left">
          <h2 className="font-inherit text-white text-3xl sm:text-4xl md:text-[50px] font-bold leading-none">
            lunchboxd
          </h2>
          <p className="text-[#888888] text-xs sm:text-sm md:text-base leading-none">
            Copyright ©2026. All rights reserved
          </p>
        </div>

        <div className="flex flex-row gap-8 md:gap-12.5">
          <a
            href="#"
            aria-label="Message us"
            className="hover:opacity-80 transition-opacity"
          >
            <img className="w-7 sm:w-8 md:w-8.75" src={msg} alt="Message" />
          </a>
          <a
            href="#"
            aria-label="Facebook"
            className="hover:opacity-80 transition-opacity"
          >
            <img className="w-7 sm:w-8 md:w-8.75" src={fb} alt="Facebook" />
          </a>
          <a
            href="#"
            aria-label="Instagram"
            className="hover:opacity-80 transition-opacity"
          >
            <img className="w-7 sm:w-8 md:w-8.75" src={ig} alt="Instagram" />
          </a>
        </div>
      </div>
    </footer>
  );
}
