import { useState } from "react";
import { X } from "lucide-react";

interface FilterPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onApply?: (filters: FilterState) => void;
}

export interface FilterState {
  budget: string | null;
  types: string[];
  sides: string[];
}

const FilterPanel = ({ isOpen, onClose, onApply }: FilterPanelProps) => {
  const [selectedBudget, setSelectedBudget] = useState<string | null>(null);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);

  const budgetOptions = ["₱10-50", "₱50-150", "₱150-500", "₱500-1,000"];
  const typeOptions = ["Food", "Drink"];
  const sideOptions = [
    "Main Gate",
    "North Gate",
    "Gate Six",
    "Hospital Gate",
    "Inside the School",
    "Building 2",
  ];

  const toggleSelection = (
    item: string,
    currentList: string[],
    setFunction: (list: string[]) => void
  ) => {
    if (currentList.includes(item)) {
      setFunction(currentList.filter((i: string) => i !== item));
    } else {
      setFunction([...currentList, item]);
    }
  };

  const handleApply = () => {
    if (onApply) {
      onApply({
        budget: selectedBudget,
        types: selectedTypes,
        sides: selectedSides,
      });
    }
    onClose();
  };

  const handleClear = () => {
    setSelectedBudget(null);
    setSelectedTypes([]);
    setSelectedSides([]);
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 backdrop-blur-sm z-40 transition-opacity"
        onClick={onClose}
      />

      {/* Modal - Responsive */}
      <div className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50">
        {/* Main Card / Container */}
        <div className="w-full sm:max-w-md bg-[#FFFBE6] rounded-t-2xl sm:rounded-2xl shadow-lg border border-[#f0eebb] relative max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="sticky top-0 bg-[#FFFBE6] flex justify-between items-center p-6 border-b border-[#f0eebb]">
            <h2 className="text-gray-700 font-bold uppercase tracking-wider text-sm">
              Filters
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-800 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Budget Section */}
            <div>
              <h3 className="text-gray-700 font-bold uppercase tracking-wider text-sm mb-4">
                Budget Range
              </h3>
              <div className="flex flex-wrap gap-3">
                {budgetOptions.map((budget) => (
                  <button
                    key={budget}
                    onClick={() =>
                      setSelectedBudget(
                        selectedBudget === budget ? null : budget
                      )
                    }
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all duration-200 ${
                      selectedBudget === budget
                        ? "bg-yellow-400 border-yellow-500 text-black shadow-sm"
                        : "bg-white border-transparent text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {budget}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Section */}
            <div>
              <h3 className="text-gray-700 font-bold uppercase tracking-wider text-sm mb-4">
                Type
              </h3>
              <div className="flex gap-6">
                {typeOptions.map((type) => (
                  <label
                    key={type}
                    className="flex items-center gap-3 cursor-pointer group"
                  >
                    <div
                      className={`w-6 h-6 rounded border flex items-center justify-center transition-colors ${
                        selectedTypes.includes(type)
                          ? "bg-yellow-400 border-yellow-500"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {selectedTypes.includes(type) && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedTypes.includes(type)}
                      onChange={() =>
                        toggleSelection(type, selectedTypes, setSelectedTypes)
                      }
                    />
                    <span className="text-gray-700 font-medium">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Side Section */}
            <div>
              <h3 className="text-gray-700 font-bold uppercase tracking-wider text-sm mb-4">
                Side
              </h3>
              <div className="grid grid-cols-2 gap-y-4 gap-x-2">
                {sideOptions.map((side) => (
                  <label
                    key={side}
                    className="flex items-center gap-3 cursor-pointer"
                  >
                    <div
                      className={`w-6 h-6 rounded border flex items-center justify-center transition-colors shrink-0 ${
                        selectedSides.includes(side)
                          ? "bg-yellow-400 border-yellow-500"
                          : "bg-white border-gray-300"
                      }`}
                    >
                      {selectedSides.includes(side) && (
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={3}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      )}
                    </div>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={selectedSides.includes(side)}
                      onChange={() =>
                        toggleSelection(side, selectedSides, setSelectedSides)
                      }
                    />
                    <span className="text-gray-700 font-medium text-sm">
                      {side}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Footer with Action Buttons */}
          <div className="sticky bottom-0 bg-[#FFFBE6] border-t border-[#f0eebb] p-6 space-y-3">
            <button
              onClick={handleApply}
              className="w-full py-3 px-4 bg-forest-mid text-white font-bold rounded-full hover:bg-[#5a7a1e] transition-colors"
            >
              Apply Filters
            </button>
            <button
              onClick={handleClear}
              className="w-full py-3 px-4 border-2 border-forest-mid text-forest-mid font-bold rounded-full hover:bg-forest-mid hover:text-white transition-colors"
            >
              Clear All
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default FilterPanel;
