import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface Category {
  id: string;
  label: string;
}

interface CategorySliderProps {
  categories: Category[];
  selectedCategory: string;
  onCategoryChange: (categoryId: string) => void;
}

const CategorySlider = ({
  categories,
  selectedCategory,
  onCategoryChange,
}: CategorySliderProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(true);

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowLeftArrow(scrollLeft > 0);
      setShowRightArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative flex items-center gap-2 max-w-full">
      {/* Left Arrow */}
      {showLeftArrow && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 p-1.5 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-md hover:bg-muted transition-colors hidden md:flex"
          aria-label="Scroll left"
        >
          <ChevronLeft className="h-4 w-4 text-foreground" />
        </button>
      )}

      {/* Scrollable Categories */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        className="flex items-center gap-1.5 md:gap-2 overflow-x-auto scrollbar-hide px-1 py-1 md:px-8"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              "px-3 md:px-4 py-1.5 md:py-2 rounded-full text-xs md:text-sm font-medium whitespace-nowrap transition-all duration-200",
              selectedCategory === category.id
                ? "bg-primary text-primary-foreground shadow-md"
                : "bg-secondary/80 text-secondary-foreground hover:bg-secondary hover:shadow-sm"
            )}
          >
            {category.label}
          </button>
        ))}
      </div>

      {/* Right Arrow */}
      {showRightArrow && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 p-1.5 bg-background/95 backdrop-blur-sm border border-border rounded-full shadow-md hover:bg-muted transition-colors hidden md:flex"
          aria-label="Scroll right"
        >
          <ChevronRight className="h-4 w-4 text-foreground" />
        </button>
      )}
    </div>
  );
};

export default CategorySlider;
