import React from "react";

interface FiltersPanelProps {
    selectedAgency: string;
    selectedStatus: string;
    selectedDate: string;
    onAgencyChange: (agency: string) => void;
    onStatusChange: (status: string) => void;
    onDateChange: (date: string) => void;
    onClearFilters: () => void;
}

const agencies = [
    "All Agencies",
    "Voyage Express Premium",
    "Coastal Travel Co.",
    "Beach Express"
];

const statusOptions = [
    "All Status",
    "Confirmed & Paid",
    "Confirmed",
    "Pending Payment"
];

export default function FiltersPanel({selectedAgency, selectedStatus, selectedDate, onAgencyChange, onStatusChange, onDateChange, onClearFilters}: FiltersPanelProps) {
    return (
        <div className="mt-4 p-4 bg-white rounded-lg border border-primary">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Agency Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Agency
                    </label>
                    <select
                        value={selectedAgency}
                        onChange={(e) => onAgencyChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    >
                        {agencies.map((agency) => (
                            <option key={agency} value={agency}>
                                {agency}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                    </label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => onStatusChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    >
                        {statusOptions.map((status) => (
                            <option key={status} value={status}>
                                {status}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Filter */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Departure Date
                    </label>
                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => onDateChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:border-primary focus:outline-none transition-colors"
                    />
                </div>

                {/* Clear Filters Button */}
                <div className="flex items-end">
                    <button
                        onClick={onClearFilters}
                        className="w-full px-4 py-2 bg-primary cursor-pointer text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Clear Filters
                    </button>
                </div>
            </div>
        </div>
    );
}