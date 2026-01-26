import { useState, Suspense } from "react";
import { Search, ChevronLeft, ChevronRight, Filter, Map } from "lucide-react";
import { Header } from "../layouts/Header";
import { Footer } from "../layouts/Footer";
import FilterPanel, { type FilterState } from "../components/CategoryFilter";
import { CategoryTabs } from "../components/CategoryTabs";
import { RestaurantCard } from "../components/RestaurantCard";
import { useRestaurants, useFilterOptions } from "../hooks/useApi";

const ITEMS_PER_PAGE = 12;

export function Directory() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBudgets, setSelectedBudgets] = useState<string[]>([]);
  const [selectedSides, setSelectedSides] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "map">("grid");

  // Fetch restaurants using the custom hook
  const { data: restaurants, isLoading } = useRestaurants({
    searchQuery,
    category: selectedCategory || undefined,
    budgets: selectedBudgets.length > 0 ? selectedBudgets : undefined,
    sides: selectedSides.length > 0 ? selectedSides : undefined,
  });

  // Fetch filter options using the custom hook
  useFilterOptions();

  const totalPages = Math.ceil(restaurants.length / ITEMS_PER_PAGE);
  const paginatedRestaurants = restaurants.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const filterCount = selectedBudgets.length;

  const handleApplyFilters = (filters: FilterState) => {
    setSelectedBudgets(filters.budget ? [filters.budget] : []);
    setSelectedSides(filters.sides);
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />

      <main className="flex-1 max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 py-6">
        {/* Title */}
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-6 ">
          Directory
        </h1>

        {/* Category Tabs */}
        <div className="mb-8">
          <CategoryTabs
            selectedCategory={selectedCategory}
            onCategoryChange={(category) => {
              setSelectedCategory(category);
              setCurrentPage(1);
            }}
          />
        </div>

        {/* Search Bar with Filters */}
        <div className="flex gap-2 mb-6">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Looking for something to eat?"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full h-10 pl-10 pr-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder:text-gray-500 focus:outline-none focus:ring-2 focus:ring-forest-mid"
            />
          </div>

          {/* Filter Button - Desktop */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="hidden md:flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
          >
            <Filter size={18} />
            <span className="text-sm font-medium">Filters</span>
            {filterCount > 0 && (
              <span className="bg-forest-mid text-white text-xs px-2 py-0.5 rounded-full">
                {filterCount}
              </span>
            )}
          </button>

          {/* View Mode Toggle - Desktop */}
          <div className="hidden md:flex items-center gap-2 border border-gray-300 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 rounded transition-colors text-sm font-medium ${
                viewMode === "grid"
                  ? "bg-forest-mid text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              Grid
            </button>
            <button
              onClick={() => setViewMode("map")}
              className={`px-3 py-1 rounded transition-colors text-sm font-medium flex items-center gap-1 ${
                viewMode === "map"
                  ? "bg-forest-mid text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Map size={16} />
              Map
            </button>
          </div>

          {/* Filter Button - Mobile */}
          <button
            onClick={() => setShowFilterModal(true)}
            className="md:hidden flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 active:scale-95 transition-all"
          >
            <Filter size={18} />
            {filterCount > 0 && (
              <span className="bg-forest-mid text-white text-xs px-2 py-0.5 rounded-full">
                {filterCount}
              </span>
            )}
          </button>
        </div>

        {/* Filter Modal */}
        <FilterPanel
          isOpen={showFilterModal}
          onClose={() => setShowFilterModal(false)}
          onApply={handleApplyFilters}
        />

        {/* Content View */}
        {viewMode === "map" ? (
          <Suspense
            fallback={
              <div className="h-96 md:h-125 rounded-xl bg-white border border-gray-300 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <Map
                    size={48}
                    className="mx-auto mb-2 opacity-50 animate-pulse"
                  />
                  <p>Loading map...</p>
                </div>
              </div>
            }
          >
            {/* MapView component will be added here */}
            <div className="h-96 md:h-125 rounded-xl bg-white border border-gray-300 flex items-center justify-center text-gray-500">
              <p>Map view coming soon</p>
            </div>
          </Suspense>
        ) : (
          <>
            {/* Restaurant Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 p-3">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white rounded-lg animate-pulse overflow-hidden"
                  >
                    <div className="h-32 bg-gray-200 rounded-t-lg" />
                    <div className="p-3 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4" />
                      <div className="h-3 bg-gray-200 rounded w-1/2" />
                    </div>
                  </div>
                ))}
              </div>
            ) : paginatedRestaurants.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No restaurants found</p>
                <p className="text-gray-500 text-sm mt-1">
                  Try adjusting your filters or search
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 md:grid-cols-3 gap-4 p-3">
                {paginatedRestaurants.map((restaurant) => (
                  <RestaurantCard key={restaurant.id} restaurant={restaurant} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="text-sm text-gray-600 px-4">
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() =>
                    setCurrentPage((p) => Math.min(totalPages, p + 1))
                  }
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg bg-white border border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
