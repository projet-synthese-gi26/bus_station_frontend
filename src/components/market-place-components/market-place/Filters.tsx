import {Filter} from "lucide-react";


export type FilterProps = {
    activeFilter: string;
    setActiveFilter: (filter: string) => void;
}


export default function Filters({activeFilter, setActiveFilter}: FilterProps)
{

    function applyFilterStyle()
    {
        return "cursor-pointer px-4 py-2 rounded-full font-semibold transition-all duration-300 shadow-sm hover:shadow-md transform hover:scale-105"
    }
    return (
        <div className="flex flex-wrap justify-center lg:justify-end gap-3 mb-8">
            <button
                onClick={() => setActiveFilter("all")}
                className={`${applyFilterStyle()} ${
                    activeFilter === "all"
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200"
                }`}
            >
                All Trips
            </button>
            {["Douala", "Yaoundé", "Limbé", "Kribi"].map((city) => (
                <button
                    key={city}
                    onClick={() => setActiveFilter(city)}
                    className={`${applyFilterStyle()} ${
                        activeFilter === city
                            ? "bg-blue-600 text-white"
                            : "bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 border-2 border-gray-200"
                    }`}
                >
                    {city}
                </button>
            ))}
            <button
                className="cursor-pointer px-4 py-2 rounded-full bg-white text-gray-600 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200 shadow-sm flex items-center gap-2 border-2 border-gray-200">
                <Filter className="h-4 w-4"/>
                More Filters
            </button>
        </div>
    )
}