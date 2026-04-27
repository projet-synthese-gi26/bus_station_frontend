"use client";

import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface DateNavigationProps {
    currentDate: Date;
    onPreviousMonth: () => void;
    onNextMonth: () => void;
    onToday: () => void;
    onDateChange: (date: Date) => void;
    viewType: 'month' | 'week' | 'day' | 'agenda';
    onViewChange: (view: 'month' | 'week' | 'day' | 'agenda') => void;
}

const DateNavigation: React.FC<DateNavigationProps> = ({
                                                           currentDate,
                                                           onPreviousMonth,
                                                           onNextMonth,
                                                           onToday,
                                                           onDateChange,
                                                           viewType,
                                                           onViewChange
                                                       }) => {
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [selectedYear, setSelectedYear] = useState(currentDate.getFullYear());
    const [selectedMonth, setSelectedMonth] = useState(currentDate.getMonth());
    const datePickerRef = useRef<HTMLDivElement>(null);

    const months = [
        'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
        'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
    ];

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

    const viewOptions = [
        { value: 'month', label: 'Mois' },
        { value: 'week', label: 'Semaine' },
        { value: 'day', label: 'Jour' },
        { value: 'agenda', label: 'Agenda' }
    ];

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (datePickerRef.current && !datePickerRef.current.contains(event.target as Node)) {
                setShowDatePicker(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleDateSelect = () => {
        const newDate = new Date(selectedYear, selectedMonth, 1);
        onDateChange(newDate);
        setShowDatePicker(false);
    };

    const formatCurrentDate = () => {
        switch (viewType) {
            case 'month':
                return format(currentDate, 'MMMM yyyy', { locale: fr });
            case 'week':
                return `Semaine du ${format(currentDate, 'dd MMMM yyyy', { locale: fr })}`;
            case 'day':
                return format(currentDate, 'EEEE dd MMMM yyyy', { locale: fr });
            default:
                return format(currentDate, 'MMMM yyyy', { locale: fr });
        }
    };

    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 bg-white border-b border-gray-200">
            {/* Navigation principale */}
            <div className="flex items-center gap-4">
                {/* Boutons navigation */}
                <div className="flex items-center gap-1">
                    <button
                        onClick={onPreviousMonth}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        title="Mois précédent"
                    >
                        <ChevronLeft className="h-4 w-4 text-gray-600" />
                    </button>

                    <button
                        onClick={onNextMonth}
                        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
                        title="Mois suivant"
                    >
                        <ChevronRight className="h-4 w-4 text-gray-600" />
                    </button>
                </div>

                {/* Sélecteur de date */}
                <div className="relative" ref={datePickerRef}>
                    <button
                        onClick={() => setShowDatePicker(!showDatePicker)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                    >
                        <Calendar className="h-4 w-4" />
                        <span className="font-medium capitalize">{formatCurrentDate()}</span>
                    </button>

                    {showDatePicker && (
                        <div className="absolute top-full left-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 min-w-[300px]">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Année
                                    </label>
                                    <select
                                        value={selectedYear}
                                        onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                                    >
                                        {years.map(year => (
                                            <option key={year} value={year}>{year}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Mois
                                    </label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {months.map((month, index) => (
                                            <button
                                                key={index}
                                                onClick={() => setSelectedMonth(index)}
                                                className={`p-2 text-xs rounded-md transition-colors ${
                                                    selectedMonth === index
                                                        ? 'bg-primary text-white'
                                                        : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                                                }`}
                                            >
                                                {month}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-2 pt-2 border-t">
                                    <button
                                        onClick={handleDateSelect}
                                        className="flex-1 bg-primary text-white py-2 px-4 rounded-md hover:bg-primary/90 transition-colors"
                                    >
                                        Confirmer
                                    </button>
                                    <button
                                        onClick={() => setShowDatePicker(false)}
                                        className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 transition-colors"
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Bouton Aujourd'hui */}
                <button
                    onClick={onToday}
                    className="flex items-center gap-2 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                    <Calendar className="h-4 w-4" />
                    Aujourd&#39;hui
                </button>
            </div>

            {/* Sélecteur de vue */}
            <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
                {viewOptions.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onViewChange(option.value as any)}
                        className={`px-3 py-1.5 text-sm rounded-md transition-colors ${
                            viewType === option.value
                                ? 'bg-white text-primary shadow-sm font-medium'
                                : 'text-gray-600 hover:text-gray-900'
                        }`}
                    >
                        {option.label}
                    </button>
                ))}
            </div>
        </div>
    );
};

export default DateNavigation;