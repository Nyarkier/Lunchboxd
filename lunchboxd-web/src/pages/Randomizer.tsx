import { useState } from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti"; // Import confetti
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import RandomBox from "../assets/images/random.png";
import { RestaurantCard } from "../components/RestaurantCard";
import { useRestaurants } from "../hooks/useApi";
import type { Restaurant } from "../types/types";

// 1. Define your 3+ Background "Thingies" (Colors/Gradients)
const BACKGROUNDS = [
  "bg-[#F3F6F1]", // 0: Original Greenish/Beige
  "bg-[#FFF8E1]", // 1: Light Buttery Yellow (Appetizing)
  "bg-[#E0F7FA]", // 2: Light Cyan (Fresh)
  "bg-[#FFEBEE]", // 3: Light Red (Energetic)
  "bg-[#F3E5F5]", // 4: Light Lavender (Calm)
];

export function Randomizer() {
  const navigate = useNavigate();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  // State to track current background
  const [bgIndex, setBgIndex] = useState(0);

  const { data: restaurants, isLoading } = useRestaurants();

  // Function to handle the randomization process
  const handleRandomize = () => {
    if (restaurants.length === 0) return;

    setIsAnimating(true);

    if (showResult) {
      setShowResult(false);
    }

    setTimeout(() => {
      // 1. Pick a random restaurant
      const randomIndex = Math.floor(Math.random() * restaurants.length);
      setSelectedRestaurant(restaurants[randomIndex]);

      // 2. Change Background (Pick a random one that isn't the current one)
      let newBgIndex;
      do {
        newBgIndex = Math.floor(Math.random() * BACKGROUNDS.length);
      } while (newBgIndex === bgIndex); // Ensure it changes
      setBgIndex(newBgIndex);

      // 3. Trigger Confetti
      triggerConfetti();

      setIsAnimating(false);
      setShowResult(true);
    }, 1500);
  };

  // Helper function for the confetti effect
  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: ReturnType<typeof setInterval> = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      // origin y: 0.6 means it comes from slightly below the middle of the screen
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);
  };

  return (
    <>
      <Header />

      {/* Apply the dynamic background class here.
          Added 'transition-colors duration-700' for a smooth fade effect between colors.
      */}
      <div
        className={`min-h-screen ${BACKGROUNDS[bgIndex]} transition-colors duration-700 py-8 px-4 sm:px-6 lg:px-8 font-sans flex flex-col items-center`}
      >
        {/* Back Button */}
        <div className="w-full max-w-2xl mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#2F532F] hover:text-[#1a331a] font-semibold transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>
        </div>

        <style>{`
          @keyframes shake {
            0% { transform: translate(1px, 1px) rotate(0deg); }
            10% { transform: translate(-1px, -2px) rotate(-1deg); }
            20% { transform: translate(-3px, 0px) rotate(1deg); }
            30% { transform: translate(3px, 2px) rotate(0deg); }
            40% { transform: translate(1px, -1px) rotate(1deg); }
            50% { transform: translate(-1px, 2px) rotate(-1deg); }
            60% { transform: translate(-3px, 1px) rotate(0deg); }
            70% { transform: translate(3px, 1px) rotate(-1deg); }
            80% { transform: translate(-1px, -1px) rotate(1deg); }
            90% { transform: translate(1px, 2px) rotate(0deg); }
            100% { transform: translate(1px, -2px) rotate(-1deg); }
          }
          .animate-shake {
            animation: shake 0.5s;
            animation-iteration-count: infinite;
          }
          @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out;
          }
          @keyframes bounce-slow {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-10px); }
          }
          .animate-bounce-slow {
            animation: bounce-slow 3s infinite;
          }
        `}</style>

        <div className="w-full max-w-md flex flex-col items-center h-full justify-center mt-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#2F532F] leading-tight">
              i think deserve <br />
              mo mag...
            </h1>
          </div>

          {isLoading && (
            <div className="text-center mb-8">
              <p className="text-lg text-[#2F532F]">Loading restaurants...</p>
            </div>
          )}

          <div className="w-full h-100 md:h-112.5 flex items-center justify-center mb-8 relative">
            {isAnimating && (
              <div className="animate-shake">
                <img
                  src={RandomBox}
                  alt="Randomizing..."
                  className="w-96 h-96 md:w-64 md:h-64 object-contain opacity-100 transition-opacity"
                />
              </div>
            )}

            {!isAnimating && !showResult && !isLoading && (
              <div className="animate-bounce-slow">
                <img
                  src={RandomBox}
                  alt="Mystery Box"
                  className="w-96 h-96 md:w-64 md:h-64 object-contain"
                />
              </div>
            )}

            {!isAnimating && showResult && selectedRestaurant && (
              <div className="w-full h-full animate-fade-in-up">
                <RestaurantCard restaurant={selectedRestaurant} />
              </div>
            )}
          </div>

          <button
            onClick={handleRandomize}
            disabled={isAnimating || isLoading || restaurants.length === 0}
            className={`
              px-10 py-3 rounded-full border-[3px] 
              text-xl font-bold tracking-wide shadow-md transform transition-all active:scale-95
              ${
                isAnimating || isLoading || restaurants.length === 0
                  ? "bg-gray-300 border-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-white border-[#2F532F] text-[#2F532F] hover:bg-[#2F532F] hover:text-white"
              }
            `}
          >
            {isLoading
              ? "LOADING..."
              : isAnimating
              ? "CHOOSING..."
              : showResult
              ? "ISA PA?"
              : "RANDOMIZE"}
          </button>
        </div>
      </div>
      <Footer />
    </>
  );
}
