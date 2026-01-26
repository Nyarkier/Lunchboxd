import { useState } from "react";
import { useNavigate } from "react-router";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import { RestaurantCard } from "../components/RestaurantCard";
import { Search, Filter, Plus, Minus, X, ArrowLeft } from "lucide-react";
import confetti from "canvas-confetti";
import { useRestaurants } from "../hooks/useApi";
import type { Restaurant } from "../types/types";
import type { FilterState } from "../components/CategoryFilter";
import FilterPanel from "../components/CategoryFilter";
import logo from "../assets/logo.svg";

// --- Constants ---
const WHEEL_COLORS = [
  "#2F532F", // Forest Green
  "#F5A623", // Bright Orange
  "#D9534F", // Burnt Red
  "#F8E71C", // Yellow
  "#4A90E2", // Blue
  "#E67E22", // Pumpkin
];

const BACKGROUNDS = [
  "bg-[#F3F6F1]",
  "bg-[#FFF8E1]",
  "bg-[#E0F7FA]",
  "bg-[#FFEBEE]",
];

export function Spin() {
  // --- Data & State ---
  const navigate = useNavigate();
  const { data: allRestaurants, isLoading } = useRestaurants();
  const [wheelItems, setWheelItems] = useState<Restaurant[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<Restaurant | null>(null);

  // Physics State
  const [rotation, setRotation] = useState(0);
  const [bgIndex, setBgIndex] = useState(0);

  // Filter & Search State
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilters, setActiveFilters] = useState<FilterState | null>(null);

  // --- Logic ---

  const toggleAddToWheel = (restaurant: Restaurant) => {
    const exists = wheelItems.find((i) => i.id === restaurant.id);
    if (exists) {
      setWheelItems(wheelItems.filter((i) => i.id !== restaurant.id));
    } else {
      if (wheelItems.length >= 12) {
        alert("Wheel is full! (Max 12 items for readability)");
        return;
      }
      setWheelItems([...wheelItems, restaurant]);
    }
  };

  const handleSpin = () => {
    if (wheelItems.length < 2) {
      alert("Please add at least 2 items to spin!");
      return;
    }

    setIsSpinning(true);
    setWinner(null);

    const total = wheelItems.length;
    const winnerIndex = Math.floor(Math.random() * total);
    const winningRestaurant = wheelItems[winnerIndex];

    const segmentAngle = 360 / total;
    // Align winner to top (0 degrees).
    const targetAngle = winnerIndex * segmentAngle + segmentAngle / 2;
    const stopAngle = 360 * 10 + (360 - targetAngle);

    const randomOffset = (Math.random() - 0.5) * (segmentAngle * 0.8);
    const finalRotation = rotation + stopAngle + randomOffset;

    setRotation(finalRotation);

    setTimeout(() => {
      setIsSpinning(false);
      setWinner(winningRestaurant);

      let newBgIndex;
      do {
        newBgIndex = Math.floor(Math.random() * BACKGROUNDS.length);
      } while (newBgIndex === bgIndex);
      setBgIndex(newBgIndex);

      triggerConfetti();
    }, 5000);
  };

  const triggerConfetti = () => {
    const duration = 3000;
    const end = Date.now() + duration;
    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: WHEEL_COLORS,
      });
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: WHEEL_COLORS,
      });
      if (Date.now() < end) requestAnimationFrame(frame);
    };
    frame();
  };

  const getWheelBackground = () => {
    if (wheelItems.length === 0) return "#E5E7EB";
    if (wheelItems.length === 1) return WHEEL_COLORS[0];

    const percentage = 100 / wheelItems.length;
    let gradientStr = "conic-gradient(";
    wheelItems.forEach((_, index) => {
      const color = WHEEL_COLORS[index % WHEEL_COLORS.length];
      const start = index * percentage;
      const end = (index + 1) * percentage;
      gradientStr += `${color} ${start}% ${end}%, `;
    });
    return gradientStr.slice(0, -2) + ")";
  };

  // Filter Logic
  const filteredRestaurants = (allRestaurants || []).filter((r) => {
    const matchesSearch = r.name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    let matchesBudget = true;
    if (activeFilters?.budget)
      matchesBudget = r.budgetRange === activeFilters.budget;
    let matchesSides = true;
    if (activeFilters?.sides && activeFilters.sides.length > 0)
      matchesSides = activeFilters.sides.includes(r.sides);
    return matchesSearch && matchesBudget && matchesSides;
  });

  return (
    <>
      <Header />

      <div
        className={`min-h-screen ${BACKGROUNDS[bgIndex]} transition-colors duration-1000 py-6 px-4 md:px-8 font-sans overflow-hidden flex flex-col`}
      >
        <style>{`
          .no-scrollbar::-webkit-scrollbar { display: none; }
          .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
          @keyframes bounce-sm { 0%, 100% { transform: translateY(0); } 50% { transform: translateY(-5px); } }
          .animate-bounce-sm { animation: bounce-sm 2s infinite; }
          
          @keyframes spin-glow {
            0%, 100% { box-shadow: 0 0 20px 5px rgba(47, 83, 47, 0.3), inset 0 0 20px rgba(0,0,0,0.2); border-color: #2F532F; }
            50% { box-shadow: 0 0 40px 15px rgba(245, 166, 35, 0.6), inset 0 0 30px rgba(0,0,0,0.3); border-color: #F5A623; }
          }
          .spinning-active { animation: spin-glow 1.5s ease-in-out infinite alternate; }
        `}</style>

        <div className="max-w-2xl mx-auto w-full flex-grow flex flex-col">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#2F532F] hover:text-[#1a331a] font-semibold mb-4 transition-colors self-start"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-4xl md:text-5xl font-extrabold text-[#2F532F] mb-2 tracking-tight drop-shadow-sm">
              Spin the Wheel
            </h1>
            <p className="text-gray-700 text-sm md:text-base font-medium max-w-sm mx-auto leading-relaxed">
              Load your cravings, spin the board, and let destiny decide your
              next meal.
            </p>
          </div>

          {isLoading && (
            <div className="flex-grow flex flex-col items-center justify-center py-20">
              <div className="w-12 h-12 border-4 border-[#2F532F] border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-[#2F532F] font-bold animate-pulse">
                Setting up the wheel...
              </p>
            </div>
          )}

          {!isLoading && (
            <>
              {/* --- WHEEL SECTION --- */}
              <div className="relative w-full flex flex-col items-center mb-8">
                <div className="relative">
                  {/* Pointer */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-5 z-30 pointer-events-none drop-shadow-lg">
                    <div className="relative flex flex-col items-center">
                      <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-[#2F532F] -mb-[1px]"></div>
                      <div className="w-14 h-14 bg-white rounded-full border-[4px] border-[#2F532F] flex items-center justify-center relative">
                        <div className="w-4 h-4 bg-[#2F532F] rounded-full opacity-20"></div>
                      </div>
                    </div>
                  </div>

                  {/* The Spinning Wheel Container */}
                  <div
                    className={`relative w-[85vw] h-[85vw] max-w-[320px] max-h-[320px] rounded-full border-[8px] border-[#2F532F] overflow-hidden transition-transform duration-[5000ms] cubic-bezier(0.25, 0.1, 0.25, 1) ${
                      isSpinning
                        ? "spinning-active"
                        : "shadow-[0_10px_30px_-10px_rgba(0,0,0,0.3)]"
                    }`}
                    style={{
                      background: getWheelBackground(),
                      transform: `rotate(${rotation}deg)`,
                      boxShadow: isSpinning
                        ? "none"
                        : "inset 0 0 20px rgba(0,0,0,0.2)",
                    }}
                  >
                    {/* Radial Text Labels */}
                    {wheelItems.map((item, index) => {
                      const total = wheelItems.length;
                      const segmentAngle = 360 / total;
                      const rotateAngle =
                        segmentAngle * index + segmentAngle / 2;

                      return (
                        <div
                          key={item.id}
                          className="absolute top-0 left-1/2 h-[50%] -ml-[25px] w-[50px] origin-bottom z-20 pointer-events-none flex flex-col justify-center items-center pt-6 pb-16"
                          style={{
                            transform: `rotate(${rotateAngle}deg)`,
                          }}
                        >
                          <span
                            className="text-white font-black uppercase tracking-wide drop-shadow-md text-center block"
                            style={{
                              writingMode: "vertical-rl",
                              textOrientation: "mixed",
                              // Reduced font size for cleaner look
                              fontSize: total > 8 ? "10px" : "12px",
                              lineHeight: "1.1",
                              whiteSpace: "normal",
                              wordBreak: "break-word",
                              maxHeight: "100%",
                            }}
                          >
                            {item.name}
                          </span>
                        </div>
                      );
                    })}

                    {/* Center Hub with Logo */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-white rounded-full shadow-[inset_0_2px_5px_rgba(0,0,0,0.2)] border-[3px] border-[#2F532F] z-30 flex items-center justify-center overflow-hidden">
                      <img
                        src={logo}
                        alt="Logo"
                        className="w-10 h-10 object-contain"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* 2. Action Button */}
              <div className="flex justify-center mb-8">
                <button
                  onClick={handleSpin}
                  disabled={isSpinning || wheelItems.length < 2}
                  className={`
                    px-10 py-3.5 rounded-full text-lg md:text-xl font-black uppercase tracking-widest shadow-[0_6px_0_rgb(30,60,30)] transform transition-all active:translate-y-[3px] active:shadow-[0_2px_0_rgb(30,60,30)] border-2
                    ${
                      isSpinning || wheelItems.length < 2
                        ? "bg-gray-300 text-gray-500 border-gray-300 shadow-none cursor-not-allowed"
                        : "bg-[#2F532F] text-white border-[#234223] hover:bg-[#244024] animate-bounce-sm"
                    }
                  `}
                >
                  {isSpinning ? "Spinning..." : "SPIN IT!"}
                </button>
              </div>

              {/* 3. Search & Filter Bar */}
              <div className="flex items-center gap-2 mb-4 md:mb-6">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Find a store..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-11 pr-4 py-3 rounded-2xl border-2 border-gray-200 focus:border-[#2F532F] focus:outline-none focus:ring-0 shadow-sm bg-white text-gray-700 placeholder-gray-400 font-bold transition-colors text-sm"
                  />
                  <Search
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </div>
                <button
                  onClick={() => setIsFilterOpen(true)}
                  className="bg-white p-3 rounded-2xl border-2 border-gray-200 hover:border-[#2F532F] hover:text-[#2F532F] shadow-sm transition-colors text-gray-500"
                >
                  <Filter size={22} strokeWidth={2.5} />
                </button>
              </div>

              {/* 4. Horizontal Restaurant List */}
              <div className="flex-grow pb-8">
                <div className="flex items-baseline justify-between mb-3 px-2">
                  <h3 className="text-[#2F532F] font-extrabold text-lg">
                    Add Options
                  </h3>
                  <span
                    className={`text-xs font-black px-2.5 py-1 rounded-full shadow-sm border ${
                      wheelItems.length >= 12
                        ? "bg-red-100 text-red-600 border-red-200"
                        : "bg-white text-gray-500 border-gray-200"
                    }`}
                  >
                    {wheelItems.length}/12
                  </span>
                </div>

                <div className="flex overflow-x-auto gap-4 pb-6 snap-x snap-mandatory no-scrollbar px-1 min-h-[260px] items-stretch">
                  {filteredRestaurants.length === 0 && (
                    <div className="w-full flex flex-col items-center justify-center text-gray-400 font-bold italic bg-white/50 rounded-3xl border-3 border-dashed border-gray-200 p-8">
                      <Search size={40} className="mb-2 opacity-50" />
                      No restaurants match.
                    </div>
                  )}

                  {filteredRestaurants.map((restaurant) => {
                    const isAdded = wheelItems.some(
                      (i) => i.id === restaurant.id
                    );
                    return (
                      <div
                        key={restaurant.id}
                        className="min-w-[260px] w-[75%] md:w-[280px] snap-center relative pt-3 pl-1"
                      >
                        <div
                          className={`relative h-full transition-all duration-300 ${
                            isAdded
                              ? "scale-95 opacity-75 grayscale-[30%]"
                              : "scale-100 hover:-translate-y-1"
                          }`}
                        >
                          <RestaurantCard restaurant={restaurant} />
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleAddToWheel(restaurant);
                            }}
                            className={`absolute -top-3 -right-1 w-11 h-11 rounded-full border-4 border-[#F3F6F1] flex items-center justify-center shadow-lg z-10 transition-all active:scale-90 ${
                              isAdded
                                ? "bg-[#D9534F] text-white rotate-0"
                                : "bg-[#2F532F] text-white hover:bg-[#244024] rotate-90 hover:rotate-180"
                            }`}
                          >
                            {isAdded ? (
                              <Minus size={22} strokeWidth={4} />
                            ) : (
                              <Plus size={22} strokeWidth={4} />
                            )}
                          </button>
                          {isAdded && (
                            <div className="absolute inset-0 bg-[#2F532F]/10 rounded-[1.3rem] pointer-events-none border-[3px] border-[#2F532F]" />
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>

        {/* --- MODALS --- */}
        <FilterPanel
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          onApply={(filters) => setActiveFilters(filters)}
        />

        {/* WINNER POPUP */}
        {winner && (
          <div
            className="fixed inset-0 z-50 flex items-end md:items-center justify-center px-4 pb-6 md:pb-0 bg-black/60 backdrop-blur-md animate-fade-in"
            onClick={() => setWinner(null)}
          >
            <div
              className="bg-[#FFFBE6] w-full max-w-sm rounded-[2.5rem] p-1.5 text-center shadow-2xl relative border-[6px] border-[#2F532F] animate-bounce-in transform transition-all mx-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-white rounded-[2rem] p-6 pb-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_#2F532F_2px,_transparent_2px)] bg-[length:20px_20px]"></div>

                {/* Interactive Close Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setWinner(null);
                  }}
                  className="absolute top-5 right-5 text-gray-400 hover:text-gray-800 bg-gray-100/80 backdrop-blur-sm rounded-full p-1.5 transition-colors z-50 cursor-pointer"
                  type="button"
                >
                  <X size={22} />
                </button>

                <div className="mb-5 relative z-10">
                  <span className="inline-block px-4 py-1.5 bg-[#E9C46A] text-[#2F532F] text-xs font-black uppercase tracking-wider rounded-full mb-3 shadow-sm">
                    ✨ Destiny Has Chosen ✨
                  </span>
                  <h2 className="text-3xl md:text-4xl font-extrabold text-[#2F532F] leading-tight mb-1">
                    {winner.name}
                  </h2>
                  <p className="text-gray-600 text-sm font-bold flex items-center justify-center gap-2">
                    <span>📍 {winner.location}</span>
                    <span>•</span>
                    <span>{winner.cuisine}</span>
                  </p>
                </div>

                <div className="mb-6 rounded-2xl overflow-hidden shadow-xl border-[3px] border-white transform -rotate-2 relative z-10">
                  <button
                    onClick={() => navigate(`/store/${winner.id}`)}
                    className="w-full h-full cursor-pointer hover:opacity-90 transition-opacity"
                  >
                    <RestaurantCard restaurant={winner} />
                  </button>
                </div>

                <div className="flex gap-3 relative z-10">
                  <button
                    onClick={() => setWinner(null)}
                    className="flex-1 py-4 rounded-full bg-gray-200 text-[#2F532F] font-black text-lg uppercase tracking-wider shadow-[0_4px_0_#cccccc] hover:bg-gray-300 active:translate-y-[2px] active:shadow-[0_2px_0_#cccccc] transition-all cursor-pointer"
                  >
                    Spin Again
                  </button>
                  <button
                    onClick={() => navigate(`/store/${winner.id}`)}
                    className="flex-1 py-4 rounded-full bg-[#2F532F] text-white font-black text-lg uppercase tracking-wider shadow-[0_4px_0_#1a331a] hover:bg-[#244024] active:translate-y-[2px] active:shadow-[0_2px_0_#1a331a] transition-all cursor-pointer"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
}
