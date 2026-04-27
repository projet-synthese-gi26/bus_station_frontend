// src/components/dashboard/calendar/ProfessionalTimelineView.tsx
"use client";

import React, { useState } from 'react';
import { ArrowLeft, Plus, Clock, MapPin, Users, DollarSign, Filter, MoreHorizontal } from 'lucide-react';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { CalendarEvent } from '@/lib/types/calendar';

interface ProfessionalTimelineViewProps {
    date: Date;
    events: CalendarEvent[];
    onEventSelect: (event: CalendarEvent) => void;
    onCreateEvent: (date: Date) => void;
    onBack: () => void;
    getStatusColor: (status: string) => string;
    getStatusDotColor: (status: string) => string;
}

const ProfessionalTimelineView: React.FC<ProfessionalTimelineViewProps> = ({
                                                                               date,
                                                                               events,
                                                                               onEventSelect,
                                                                               onCreateEvent,
                                                                               onBack,
                                                                               getStatusColor,
                                                                               getStatusDotColor
                                                                           }) => {
    const [selectedFilter, setSelectedFilter] = useState<string>('all');

    // Générer les créneaux horaires de 6h à 23h
    const timeSlots = Array.from({ length: 18 }, (_, i) => i + 6);

    const getEventsForHour = (hour: number) => {
        return events.filter(event => {
            const eventHour = event.start.getHours();
            return eventHour === hour;
        });
    };

    const getStatusBadgeStyle = (status: string) => {
        const styles = {
            PUBLIE: 'bg-blue-100 text-blue-700 border-blue-200',
            EN_COURS: 'bg-green-100 text-green-700 border-green-200',
            EN_ATTENTE: 'bg-amber-100 text-amber-700 border-amber-200',
            TERMINE: 'bg-gray-100 text-gray-700 border-gray-200',
            ANNULE: 'bg-red-100 text-red-700 border-red-200',
        };
        return styles[status as keyof typeof styles] || styles.EN_ATTENTE;
    };

    const TimeSlot: React.FC<{ hour: number }> = ({ hour }) => {
        const hourEvents = getEventsForHour(hour);
        const timeString = `${hour.toString().padStart(2, '0')}:00`;

        return (
            <div className="flex border-b border-gray-100 last:border-b-0 min-h-[70px]">
                {/* Colonne heure */}
                <div className="w-20 flex-shrink-0 p-4 bg-gray-50/50 border-r border-gray-200 flex items-center justify-center">
                    <div className="text-sm font-semibold text-gray-600">{timeString}</div>
                </div>

                {/* Colonne événements */}
                <div className="flex-1 p-3 relative bg-white hover:bg-gray-50/30 transition-colors">
                    {hourEvents.length === 0 ? (
                        <button
                            onClick={() => {
                                const newDate = new Date(date);
                                newDate.setHours(hour, 0, 0, 0);
                                onCreateEvent(newDate);
                            }}
                            className="w-full h-full min-h-[46px] border-2 border-dashed border-gray-300 rounded-xl flex items-center justify-center text-gray-400 hover:border-primary hover:text-primary hover:bg-primary/5 transition-all duration-200 group"
                        >
                            <Plus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
                            <span className="text-sm font-medium">Ajouter un voyage à {timeString}</span>
                        </button>
                    ) : (
                        <div className="space-y-2">
                            {hourEvents.map((event, index) => (
                                <ProfessionalEventCard
                                    key={event.id}
                                    event={event}
                                    onSelect={onEventSelect}
                                    getStatusColor={getStatusColor}
                                    getStatusDotColor={getStatusDotColor}
                                    getStatusBadgeStyle={getStatusBadgeStyle}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    };

    const filters = [
        { value: 'all', label: 'Tous', count: events.length },
        { value: 'PUBLIE', label: 'Publié', count: events.filter(e => e.status === 'PUBLIE').length },
        { value: 'EN_COURS', label: 'En cours', count: events.filter(e => e.status === 'EN_COURS').length },
        { value: 'EN_ATTENTE', label: 'En attente', count: events.filter(e => e.status === 'EN_ATTENTE').length }
    ];

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
            {/* En-tête moderne */}
            <div className="bg-gradient-to-r from-white via-gray-50/50 to-white border-b border-gray-200 p-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={onBack}
                            className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            title="Retour au calendrier"
                        >
                            <ArrowLeft className="h-5 w-5 text-gray-600" />
                        </button>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">
                                {format(date, 'EEEE dd MMMM yyyy', { locale: fr })}
                            </h2>
                            <p className="text-sm text-gray-600 mt-1">
                                Planning détaillé • {events.length} voyage{events.length > 1 ? 's' : ''} programmé{events.length > 1 ? 's' : ''}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        {/* Filtres */}
                        <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
                            {filters.map((filter) => (
                                <button
                                    key={filter.value}
                                    onClick={() => setSelectedFilter(filter.value)}
                                    className={`px-3 py-2 text-sm rounded-lg transition-colors ${
                                        selectedFilter === filter.value
                                            ? 'bg-white text-primary shadow-sm font-medium'
                                            : 'text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    {filter.label} {filter.count > 0 && `(${filter.count})`}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => onCreateEvent(date)}
                            className="inline-flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-xl hover:bg-primary/90 transition-colors font-medium shadow-lg hover:shadow-xl"
                        >
                            <Plus className="h-4 w-4" />
                            Nouveau voyage
                        </button>
                    </div>
                </div>
            </div>

            {/* Timeline */}
            <div className="max-h-[650px] overflow-y-auto">
                {timeSlots.map(hour => (
                    <TimeSlot key={hour} hour={hour} />
                ))}
            </div>

            {/* Footer avec statistiques */}
            {events.length > 0 && (
                <div className="border-t border-gray-200 bg-gradient-to-r from-gray-50/30 via-white to-gray-50/30 p-5">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <p className="text-xl font-bold text-primary">{events.length}</p>
                            <p className="text-xs text-gray-500 mt-1">Voyages</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <p className="text-xl font-bold text-green-600">
                                {events.reduce((sum, e) => sum + (e.totalSeats || 0), 0)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Places totales</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <p className="text-xl font-bold text-amber-600">
                                {events.reduce((sum, e) => sum + (e.availableSeats || 0), 0)}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Disponibles</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <p className="text-xl font-bold text-blue-600">
                                {Math.round(events.reduce((sum, e) => sum + (((e.totalSeats || 0) - (e.availableSeats || 0)) / (e.totalSeats || 1)) * 100, 0) / events.length) || 0}%
                            </p>
                            <p className="text-xs text-gray-500 mt-1">Occupation moy.</p>
                        </div>
                        <div className="bg-white rounded-xl p-4 border border-gray-100">
                            <p className="text-xl font-bold text-purple-600">
                                {events.reduce((sum, e) => sum + (e.price || 0) * ((e.totalSeats || 0) - (e.availableSeats || 0)), 0).toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">FCFA générés</p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

const ProfessionalEventCard: React.FC<{
    event: CalendarEvent;
    onSelect: (event: CalendarEvent) => void;
    getStatusColor: (status: string) => string;
    getStatusDotColor: (status: string) => string;
    getStatusBadgeStyle: (status: string) => string;
}> = ({ event, onSelect, getStatusColor, getStatusDotColor, getStatusBadgeStyle }) => {
    return (
        <div
            onClick={() => onSelect(event)}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md hover:border-primary/30 transition-all duration-200 cursor-pointer group relative overflow-hidden"
        >
            {/* Barre de couleur à gauche */}
            <div className={`absolute left-0 top-0 bottom-0 w-1 ${getStatusDotColor(event.status)}`} />

            <div className="flex items-start justify-between mb-3">
                <div className="flex-1 pr-3">
                    <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                            {event.title}
                        </h3>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-2">
                        <Clock className="h-4 w-4" />
                        <span className="font-medium">{format(event.start, 'HH:mm', { locale: fr })}</span>
                        {event.end && event.start.getTime() !== event.end.getTime() && (
                            <>
                                <span>→</span>
                                <span>{format(event.end, 'HH:mm', { locale: fr })}</span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2">
          <span className={`inline-flex px-3 py-1 rounded-full text-xs font-medium border ${getStatusBadgeStyle(event.status)}`}>
            {event.status.replace('_', ' ')}
          </span>
                    <button className="p-1 hover:bg-gray-100 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <MoreHorizontal className="h-4 w-4 text-gray-400" />
                    </button>
                </div>
            </div>

            <div className="space-y-2">
                {event.description && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span className="truncate">{event.description}</span>
                    </div>
                )}

                <div className="flex items-center justify-between text-sm">
                    {event.totalSeats && (
                        <div className="flex items-center gap-1 text-gray-600">
                            <Users className="h-4 w-4" />
                            <span>{(event.totalSeats - (event.availableSeats || 0))} / {event.totalSeats}</span>
                            <span className="text-green-600 font-medium ml-1">
                ({event.availableSeats} libres)
              </span>
                        </div>
                    )}

                    {event.price && (
                        <div className="flex items-center gap-1 font-semibold text-primary">
                            <DollarSign className="h-4 w-4" />
                            <span>{event.price.toLocaleString()} FCFA</span>
                        </div>
                    )}
                </div>

                {/* Barre de progression compacte */}
                {event.totalSeats && (
                    <div className="mt-3">
                        <div className="w-full bg-gray-200 rounded-full h-2">
                            <div
                                className="bg-gradient-to-r from-primary to-primary/80 rounded-full h-2 transition-all duration-500"
                                style={{
                                    width: `${((event.totalSeats - (event.availableSeats || 0)) / event.totalSeats) * 100}%`
                                }}
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Effet de hover */}
            <div className="absolute inset-0 bg-primary/3 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none" />
        </div>
    );
};

export default ProfessionalTimelineView;