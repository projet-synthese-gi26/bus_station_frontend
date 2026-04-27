"use client";
import { Filter, Grid3X3, List, Search } from "lucide-react";
import FiltersPanel from "@/components/my-reservation-components/FilterPanel";
import { useState } from "react";

interface HeaderProps {
    hook: ReturnType<typeof import("@/lib/hooks/reservation-hooks/useMyReservation").useMyReservation>;
}

export default function MyReservationHeader({ hook }: HeaderProps) {
    const [showFilters, setShowFilters] = useState<boolean>(false);
    const [selectedAgency, setSelectedAgency] = useState<string>("All Agencies");
    const [selectedStatus, setSelectedStatus] = useState<string>("All Status");
    const [selectedDate, setSelectedDate] = useState<string>("");

    const handleClearFilters = () => {
        setSelectedAgency("All Agencies");
        setSelectedStatus("All Status");
        setSelectedDate("");
        hook.clearAllFilters();
    };

    return (
        <div className="bg-gray-100 rounded-2xl shadow-md mb-10">
            <div className="max-w-7xl mx-auto p-4">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-4 gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-primary">My Booked Trips</h1>
                        <p className="text-gray-600">Manage your reservations and track your journeys</p>
                    </div>
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-primary h-4 w-4" />
                        <input
                            type="text"
                            placeholder="Search trips..."
                            value={hook.searchQuery}
                            onChange={(e) => hook.setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border-2 border-primary rounded-lg focus:border-primary focus:outline-none"
                        />
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        onClick={() => setShowFilters(!showFilters)}
                        className={`cursor-pointer flex items-center gap-2 px-3 py-2 rounded-lg border transition-colors ${
                            showFilters ? "bg-primary text-white" : "bg-white text-gray-600 hover:bg-gray-50"
                        }`}
                    >
                        <Filter className="h-4 w-4" />
                        <span className="hidden sm:inline">Filters</span>
                    </button>

                    <div className="flex bg-gray-100 rounded-lg p-1">
                        {["grid", "list"].map((mode) => (
                            <button
                                key={mode}
                                onClick={() => hook.setViewMode(mode as "grid" | "list")}
                                className={`cursor-pointer p-2 rounded-md transition-colors ${
                                    hook.viewMode === mode ? "bg-white text-primary shadow-sm" : "text-gray-600"
                                }`}
                            >
                                {mode === "grid" ? <Grid3X3 className="h-4 w-4" /> : <List className="hidden lg:block h-4 w-4" />}
                            </button>
                        ))}
                    </div>
                </div>

                {showFilters && (
                    <div className="mt-4">
                        <FiltersPanel
                            selectedAgency={selectedAgency}
                            selectedStatus={selectedStatus}
                            selectedDate={selectedDate}
                            onAgencyChange={(agency) => { setSelectedAgency(agency); hook.filterByAgency(agency); }}
                            onStatusChange={(status) => { setSelectedStatus(status); hook.filterByStatus(status); }}
                            onDateChange={(date) => { setSelectedDate(date); hook.filterByDate(date); }}
                            onClearFilters={handleClearFilters}
                        />
                    </div>
                )}
            </div>
        </div>
    );
}