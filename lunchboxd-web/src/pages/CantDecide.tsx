import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import Random from ".././assets/images/random.png";
import Spin from ".././assets/images/spin.png";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";

export function CantDecide() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <div className="min-h-screen bg-[#F3F6F1] py-8 md:py-12 px-4 sm:px-6 lg:px-8 font-sans overflow-hidden">
        <div className="max-w-5xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-[#2F532F] hover:text-[#1a331a] font-semibold mb-6 transition-colors"
          >
            <ArrowLeft size={20} />
            Back
          </button>

          {/* Section Heading */}
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-6xl font-extrabold text-[#2F532F] mb-4 md:mb-6 tracking-tight">
              Can't Decide?
            </h1>
            <p className="max-w-3xl mx-auto text-gray-800 text-sm md:text-base font-medium px-2 leading-relaxed">
              Too many menus, too little time? Let's narrow it down. Engage the
              Randomizer for a quick suggestion based on what's nearby, or
              customize the Wheel with your specific cravings.
            </p>
          </div>

          {/* Cards Container:
            - 'items-stretch': Crucial! This forces all children to match the height of the tallest item.
            - 'pb-8': Adds bottom padding for the mobile scrollbar area.
          */}
          <div className="flex md:grid md:grid-cols-2 gap-5 md:gap-8 overflow-x-auto snap-x snap-mandatory pb-8 md:pb-0 no-scrollbar items-stretch">
            {/* Card 1: Randomize */}
            <div className="shrink-0 w-[85%] md:w-auto snap-center">
              <div className="bg-white rounded-4xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                {/* 1. Header Section (Fixed at top) */}
                <div className="w-full text-left mb-4">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#2F532F] mb-2">
                    Randomize a Mystery Plate
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base font-medium leading-normal">
                    One tap pulls a surprise from our directory to help you
                    discover a hidden gem near campus.
                  </p>
                </div>

                {/* 2. Image Section (Flexible - Takes up remaining space) */}
                <div className="flex-1 flex items-center justify-center py-6 min-h-50">
                  <img
                    src={Random}
                    alt="Randomize Cube"
                    className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* 3. Button Section (Fixed at bottom) */}
                <div className="mt-auto w-full">
                  <button
                    className="w-full md:w-auto px-8 py-3 rounded-full border-[3px] border-[#2F532F] text-[#2F532F] font-bold text-lg hover:bg-[#2F532F] hover:text-white transition-all duration-300 transform active:scale-95 cursor-pointer"
                    onClick={() => navigate("/Randomizer")}
                  >
                    Surprise Me
                  </button>
                </div>
              </div>
            </div>

            {/* Card 2: Spin the Wheel */}
            <div className="shrink-0 w-[85%] md:w-auto snap-center">
              <div className="bg-white rounded-4xl p-6 md:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300 h-full flex flex-col">
                {/* 1. Header Section */}
                <div className="w-full text-left mb-4">
                  <h2 className="text-2xl md:text-3xl font-extrabold text-[#2F532F] mb-2">
                    Give Destiny a Spin
                  </h2>
                  <p className="text-gray-600 text-sm md:text-base font-medium leading-normal">
                    Load your top cravings onto the board and let the needle
                    crown the winner for your next food run.
                  </p>
                </div>

                {/* 2. Image Section (Flexible) */}
                <div className="flex-1 flex items-center justify-center py-6 min-h-50">
                  <img
                    src={Spin}
                    alt="Spin the Wheel"
                    className="w-40 h-40 md:w-56 md:h-56 object-contain drop-shadow-sm transition-transform duration-300 hover:scale-105"
                  />
                </div>

                {/* 3. Button Section */}
                <div className="mt-auto w-full">
                  <button
                    className="w-full md:w-auto px-8 py-3 rounded-full border-[3px] border-[#2F532F] text-[#2F532F] font-bold text-lg hover:bg-[#2F532F] hover:text-white transition-all duration-300 transform active:scale-95 cursor-pointer"
                    onClick={() => navigate("/Spin")}
                  >
                    Spin the Wheel
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Scroll Indicators */}
          <div className="flex md:hidden justify-center space-x-2 mt-2">
            <div className="w-2.5 h-2.5 bg-[#2F532F] rounded-full opacity-80"></div>
            <div className="w-2.5 h-2.5 bg-gray-300 rounded-full"></div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
