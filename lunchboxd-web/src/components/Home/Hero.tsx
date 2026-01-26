import { useNavigate } from "react-router";
import ImageLeft from "../../assets/images/hero-left.png";
import ImageRight from "../../assets/images/hero-right.png";

export function Hero() {
  const navigate = useNavigate();
  return (
    <section className="relative bg-off-white min-h-175 md:min-h-screen overflow-hidden flex items-center justify-center py-20 md:py-0">
      {/* =========================================
          2. LEFT IMAGE (Lunchboxes)
         ========================================= */}
      <div
        className="absolute z-0 pointer-events-none
                      /* Mobile: Cornered and smaller */
                      -top-50  w-230 -left-50 scale-y-[-1] rotate-90 opacity-30
                      /* Desktop: MASSIVE & Pushed far left */
                      /* We use huge negative values to keep the text clear */
                      md:top-1/2 md:-translate-y-1/2 
                      md:-left-64 lg:-left-130 xl:-left-125 2xl:-left-150
                      md:w-175 lg:w-300 xl:w-325 2xl:w-375
                      transition-all duration-500 md:opacity-100 md:rotate-0"
      >
        <img
          src={ImageLeft}
          alt="Lunchboxes Left"
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
      </div>

      {/* =========================================
          3. RIGHT IMAGE (Lunchboxes)
         ========================================= */}
      <div
        className="absolute z-0 pointer-events-none
                      /* Mobile: Cornered and smaller */
                      -bottom-30 opacity-30   w-200 rotate-270
                      /* Desktop: MASSIVE & Pushed far right */
                      md:top-90 md:-translate-y-1/2 
                      md:-right-64 lg:-right-140 xl:-right-125 2xl:-right-150
                      md:w-175 lg:w-300 xl:w-325 2xl:w-375
                      transition-all duration-500 md:opacity-100 md:rotate-0"
      >
        <img
          src={ImageRight}
          alt="Lunchboxes Right"
          className="w-full h-auto object-contain drop-shadow-2xl"
        />
      </div>

      {/* =========================================
          4. CENTER CONTENT
         ========================================= */}
      <div className="relative z-10 flex flex-col items-center justify-center px-4 sm:px-8 text-center max-w-5xl mx-auto">
        <h1 className="text-7xl sm:text-8xl md:text-9xl lg:text-[10rem] xl:text-[12rem] font-bold mb-0 leading-none tracking-[-0.05em]">
          <span
            className="bg-linear-to-r from-forest-dark via-sand to-[#E67E22] bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(90deg, #628141 0%, #628141 53%, #E5C287 75%, #E67E22 98%)",
            }}
          >
            lunchboxd
          </span>
        </h1>

        <h2 className="text-forest-dark text-2xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold mb-6 md:mb-8 max-w-4xl tracking-tight">
          Looking for something to eat today?
        </h2>

        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto px-6 sm:px-0">
          <button
            onClick={() => navigate("/directory")}
            className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-white bg-forest-dark rounded-full hover:bg-[#5a7a1e] hover:scale-105 transition-all duration-300 shadow-lg tracking-wide"
          >
            DIRECTORY
          </button>
          <button
            onClick={() => navigate("/cant-decide")}
            className="w-full sm:w-auto px-8 sm:px-10 py-3 sm:py-3.5 text-sm sm:text-base font-bold text-forest-dark bg-off-white border-2 border-forest-dark rounded-full hover:bg-forest-dark hover:text-white hover:scale-105 transition-all duration-300 shadow-lg tracking-wide"
          >
            CAN'T DECIDE?
          </button>
        </div>
      </div>
    </section>
  );
}
