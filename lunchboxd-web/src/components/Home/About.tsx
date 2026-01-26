import { useNavigate } from "react-router";
import leftImage from "../../assets/images/about-left.png";
import rightImage from "../../assets/images/about-right.png";

const AboutSection = () => {
  const navigate = useNavigate();
  return (
    <div className="w-full bg-transparent">
      <section
        className="relative w-full min-h-screen lg:min-h-175 flex flex-col justify-center overflow-hidden bg-forest-light"
        style={{
          // Mask for the "dissolving" fade effect at top and bottom
          maskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
          WebkitMaskImage:
            "linear-gradient(to bottom, transparent, black 15%, black 85%, transparent)",
        }}
      >
        {/* --- NOISE TEXTURE --- */}
        <div
          className="absolute inset-0 z-0 opacity-20 mix-blend-multiply pointer-events-none"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
            backgroundSize: "180px 180px",
          }}
        ></div>

        {/* --- Left Image (Ramen) --- */}
        <div
          className="absolute z-20 
                        /* Mobile: Top-Left corner */
                        -top-20 -left-24 w-80 h-80
                        /* Desktop: Pushed WAY out to the side (-left-80) to clear text */
                        lg:top-1/2 lg:-left-80 lg:-translate-y-1/2 lg:w-175 lg:h-175
                        rounded-full overflow-hidden border-4 border-off-white/30 shadow-2xl transition-all duration-500"
        >
          <img
            src={leftImage}
            alt="Ramen bowl"
            className="w-full h-full object-cover"
          />
        </div>

        {/* --- Center Text --- */}
        <div className="relative z-30 container mx-auto flex flex-col items-center text-center max-w-4xl px-4">
          <h2 className="text-5xl lg:text-8xl font-bold text-brand-orange mb-6 drop-shadow-sm tracking-tight lowercase font-sans">
            about <br className="lg:hidden" /> lunchboxd
          </h2>

          <p className="text-black  text-lg lg:text-3xl leading-relaxed mb-10 max-w-md lg:max-w-3xl drop-shadow-sm">
            Lunchboxd is food directory for Wesleyanians{" "}
            <br className="hidden lg:block" />
            by Wesleyanians. This project is especially for those who{" "}
            <br className="hidden lg:block" />
            can't decide where to eat or drink at lunch.
          </p>

          <div className="flex flex-col lg:flex-row gap-4 w-full justify-center items-center">
            <button
              onClick={() => navigate("/add-restaurant")}
              className="bg-off-white text-brand-orange hover:bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 py-4 px-8 rounded-2xl font-extrabold uppercase tracking-widest text-base lg:text-lg shadow-md w-72 lg:w-auto"
            >
              Add a Restaurant
            </button>

            <button
              onClick={() => navigate("/talk-with-us")}
              className="bg-off-white text-brand-orange hover:bg-white hover:scale-105 hover:shadow-xl transition-all duration-300 py-4 px-8 rounded-2xl font-extrabold uppercase tracking-widest text-base lg:text-lg shadow-md w-72 lg:w-auto"
            >
              Talk with Us
            </button>
          </div>
        </div>

        {/* --- Right Image (Healthy Bowl) --- */}
        <div
          className="absolute z-20
                        /* Mobile: Bottom-Right corner */
                        -bottom-24 -right-24 w-80 h-80
                        /* Desktop: Pushed WAY out to the side (-right-80) to clear buttons */
                        lg:top-1/2 lg:-right-80 lg:bottom-auto lg:-translate-y-1/2 lg:w-175 lg:h-175
                        rounded-full overflow-hidden border-4 border-off-white/30 shadow-2xl transition-all duration-500"
        >
          <img
            src={rightImage}
            alt="Healthy food bowl"
            className="w-full h-full object-cover"
          />
        </div>
      </section>
    </div>
  );
};

export default AboutSection;
