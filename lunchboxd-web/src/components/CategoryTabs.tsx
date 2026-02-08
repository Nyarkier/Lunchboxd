import breads from "../assets/images/breads.png";
import cafe from "../assets/images/cafe.png";
import chicken from "../assets/images/chicken.png";
import fastFood from "../assets/images/fast-food.png";
import noodles from "../assets/images/noodles.png";
import riceMeal from "../assets/images/rice-meal.png";

interface CategoryTabsProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { id: "Rice Meal", name: "Rice Meal", emoji: riceMeal },
  { id: "Cafe", name: "Cafe", emoji: cafe },
  { id: "Chicken", name: "Chicken", emoji: chicken },
  { id: "Fast Food", name: "Fast Food", emoji: fastFood },
  { id: "Noodles", name: "Noodles", emoji: noodles },
  { id: "Bread", name: "Bread", emoji: breads },
];

function CategoryTabs({
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-3 sm:gap-4 md:gap-6 min-w-min px-3 sm:px-6 lg:px-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() =>
              onCategoryChange(
                selectedCategory === category.id ? null : category.id,
              )
            }
            className={`flex flex-row md:flex-col items-center gap-3 sm:gap-4 md:gap-2 px-6 sm:px-8 md:px-4 py-4 sm:py-5 md:py-5 rounded-2xl sm:rounded-3xl md:rounded-3xl transition-all duration-200 whitespace-nowrap md:whitespace-normal shrink-0 ${
              selectedCategory === category.id
                ? "bg-green-100 border-2 border-forest-mid shadow-md"
                : "bg-[#FFFBE6]/60 hover:bg-[#FFFBE6] border-2 border-transparent"
            }`}
          >
            <img
              src={category.emoji}
              alt={category.name}
              className="w-20 sm:w-24 md:w-32 h-20 sm:h-24 md:h-32 object-contain flex-shrink-0"
            />
            <span className="text-base sm:text-lg md:text-base font-bold text-gray-900 md:text-center">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { CategoryTabs };
