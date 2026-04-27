// src/components/dashboard/calendar/CleanCalendarView.tsx
"use client";

import React from 'react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Plus } from 'lucide-react';
import { CalendarMonth, CalendarEvent } from '@/lib/types/calendar';

interface CleanCalendarViewProps {
    calendarMonth: CalendarMonth;
    onDateSelect: (date: Date) => void;
    onEventSelect: (event: CalendarEvent) => void;
    getStatusColor: (status: string) => string;
    getStatusDotColor: (status: string) => string;
}

const CleanCalendarView: React.FC<CleanCalendarViewProps> = ({
                                                                 calendarMonth,
                                                                 onDateSelect,
                                                                 onEventSelect,
                                                                 getStatusColor,
                                                                 getStatusDotColor
                                                             }) => {
    const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'];

    // Couleurs légères répétitives pour les cases comme Google Calendar
    const lightColors = [
        'bg-blue-50/50',
        'bg-green-50/50',
        'bg-purple-50/50',
        'bg-pink-50/50',
        'bg-indigo-50/50',
        'bg-cyan-50/50',
        'bg-teal-50/50'
    ];

    const getLightColorForDate = (date: Date) => {
        // Utilise le jour du mois pour une couleur répétitive mais variée
        const colorIndex = date.getDate() % lightColors.length;
        return lightColors[colorIndex];
    };

    const EventMarkers: React.FC<{ events: CalendarEvent[] }> = ({ events }) => {
        if (events.length === 0) return null;

        return (
            <div className="absolute bottom-2 left-2 right-2">
                <div className="flex items-center justify-between">
                    {/* Indicateurs d'événements par statut */}
                    <div className="flex gap-1 flex-wrap">
                        {events.slice(0, 5).map((event, index) => (
                            <div
                                key={event.id}
                                className={`w-2 h-2 rounded-full ${getStatusDotColor(event.status)}`}
                                title={event.title}
                            />
                        ))}
                        {events.length > 5 && (
                            <div className="w-2 h-2 rounded-full bg-gray-400" title={`+${events.length - 5} autres`} />
                        )}
                    </div>

                    {/* Compteur d'événements */}
                    <span className="text-xs font-medium text-gray-600 bg-white/80 px-2 py-0.5 rounded-full">
            {events.length}
          </span>
                </div>
            </div>
        );
    };

    const DayCell: React.FC<{ day: any }> = ({ day }) => {
        const lightColor = getLightColorForDate(day.date);

        return (
            <div
                onClick={() => onDateSelect(day.date)}
                className={`
          min-h-[140px] p-4 border border-gray-200 cursor-pointer
          transition-all duration-200 relative group
          ${day.isCurrentMonth ? `${lightColor} hover:bg-gray-100/50` : 'bg-gray-50/30 hover:bg-gray-100/50'}
          ${day.isToday ? 'ring-2 ring-primary ring-inset bg-primary/5' : ''}
          ${day.isSelected ? 'bg-primary/10 border-primary' : ''}
          hover:shadow-lg hover:scale-[1.02] hover:z-10
        `}
            >
                {/* En-tête du jour */}
                <div className="flex items-center justify-between mb-3">
          <span
              className={`
              text-xl font-semibold
              ${day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'}
              ${day.isToday ? 'text-primary font-bold text-2xl' : ''}
            `}
          >
            {format(day.date, 'd')}
          </span>

                    {/* Bouton d'ajout visible au hover */}
                    {day.events.length === 0 && (
                        <Plus className="h-5 w-5 text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                </div>

                {/* Marqueurs d'événements */}
                <EventMarkers events={day.events} />

                {/* Indicateur de jour spécial */}
                {day.isToday && (
                    <div className="absolute top-3 right-3 w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                )}

                {/* Overlay pour le hover */}
                <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg pointer-events-none" />
            </div>
        );
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Légende des statuts EN HAUT */}
            <div className="border-b border-gray-200 bg-gradient-to-r from-gray-50/50 to-white p-5">
                <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-blue-500"></span>
                        <span className="text-gray-600 font-medium">Publié</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-amber-500"></span>
                        <span className="text-gray-600 font-medium">En attente</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-green-500"></span>
                        <span className="text-gray-600 font-medium">En cours</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-red-500"></span>
                        <span className="text-gray-600 font-medium">Annulé</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-full bg-gray-500"></span>
                        <span className="text-gray-600 font-medium">Terminé</span>
                    </div>
                </div>
            </div>

            {/* En-têtes des jours */}
            <div className="grid grid-cols-7 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
                {weekDays.map((day) => (
                    <div key={day} className="p-4 text-center">
                        <span className="text-sm font-semibold text-gray-700">{day}</span>
                    </div>
                ))}
            </div>

            {/* Grille du calendrier - CASES PLUS GRANDES */}
            <div className="grid grid-cols-7 gap-0">
                {calendarMonth.weeks.flat().map((day, index) => (
                    <DayCell key={index} day={day} />
                ))}
            </div>
        </div>
    );
};

export default CleanCalendarView;