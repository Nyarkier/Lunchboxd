interface CategoryTabsProps {
  selectedCategory: string | null;
  onCategoryChange: (category: string | null) => void;
}

const categories = [
  { id: "Rice Meal", name: "Rice Meal", emoji: "🍚" },
  { id: "Cafe", name: "Cafe", emoji: "☕" },
  { id: "Chicken", name: "Chicken", emoji: "🍗" },
  { id: "Fast Food", name: "Fast Food", emoji: "🍔" },
  { id: "Noodles", name: "Noodles", emoji: "🍜" },
  { id: "Bread", name: "Bread", emoji: "🥖" },
];

function CategoryTabs({
  selectedCategory,
  onCategoryChange,
}: CategoryTabsProps) {
  return (
    <div className="w-full overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-min px-3 sm:px-6 lg:px-8">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() =>
              onCategoryChange(
                selectedCategory === category.id ? null : category.id
              )
            }
            className={`flex flex-col items-center gap-2 px-6 py-4 rounded-2xl transition-all duration-200 whitespace-nowrap shrink-0 ${
              selectedCategory === category.id
                ? "bg-[#FFFBE6] border-2 border-[#f0eebb] shadow-md"
                : "bg-[#FFFBE6]/60 hover:bg-[#FFFBE6] border-2 border-transparent"
            }`}
          >
            <span className="text-4xl">{category.emoji}</span>
            <span className="text-sm font-semibold text-gray-900">
              {category.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

export { CategoryTabs };
