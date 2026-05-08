import { SlidersHorizontal } from "lucide-react";

export type FilterProps = {
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
};

const CITIES = ["Douala", "Yaoundé", "Bafoussam", "Limbé", "Kribi", "Ngaoundéré"];

export default function Filters({ activeFilter, setActiveFilter }: FilterProps) {
  return (
    <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => setActiveFilter("all")}
        className={`cursor-pointer shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
          activeFilter === "all"
            ? "bg-blue-600 text-white shadow-md"
            : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
        }`}
      >
        Tous les voyages
      </button>

      {CITIES.map((city) => (
        <button
          key={city}
          onClick={() => setActiveFilter(city)}
          className={`cursor-pointer shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-all ${
            activeFilter === city
              ? "bg-blue-600 text-white shadow-md"
              : "bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600"
          }`}
        >
          {city}
        </button>
      ))}

      <button className="cursor-pointer shrink-0 ml-auto flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium bg-white text-gray-600 border border-gray-200 hover:border-blue-300 hover:text-blue-600 transition-all">
        <SlidersHorizontal className="h-3.5 w-3.5" />
        Filtres
      </button>
    </div>
  );
}
