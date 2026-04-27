"use client";

import React from "react";
import { useTranslation } from "react-i18next";
import { AlertCircle, RefreshCw, TrendingUp, Users, Calendar as CalendarIcon, DollarSign } from 'lucide-react';
import PageHeader from "@/components/dashboard/PageHeader";
import DateNavigation from "@/components/dashboard/calendar/DateNavigation";
import CleanCalendarView from "@/components/dashboard/calendar/CleanCalendarView";
import Loader from "@/modals/Loader";
import ProfessionalTimelineView from "@/components/dashboard/calendar/ProfesionnalTimelineView";
import {useEnhancedTripCalendar} from "@/lib/hooks/dasboard/useEnhancedTripCalendar";
import {EnhancedTripDetailModal} from "@/components/dashboard/calendar/EnchancedTripDetailModal";

const StatCard: React.FC<{
    icon: React.ElementType;
    title: string;
    value: string | number;
    subtitle: string;
    trend?: string;
    colorClass: string;
}> = ({ icon: Icon, title, value, subtitle, trend, colorClass }) => (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
                <p className={`text-3xl font-bold ${colorClass} mb-1`}>{value}</p>
                <p className="text-sm text-gray-500">{subtitle}</p>
                {trend && (
                    <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-green-600 font-medium">{trend}</span>
                    </div>
                )}
            </div>
            <div className={`p-4 rounded-xl ${colorClass.replace('text-', 'bg-').replace('-600', '-100')}`}>
                <Icon className={`h-8 w-8 ${colorClass}`} />
            </div>
        </div>
    </div>
);

const FinalCalendarPage = () => {
    const { t } = useTranslation();
    const {
        // États
        isLoading,
        apiError,
        currentDate,
        selectedDate,
        viewType,
        showTimelineView,
        calendarMonth,
        calendarEvents,
        isModalOpen,
        selectedTrip,

        // Getters
        getEventsForDate,
        getStatusColor,
        getStatusDotColor,

        // Navigation
        goToNextMonth,
        goToPreviousMonth,
        goToToday,
        goToDate,
        setViewType,

        // Actions
        handleDateSelect,
        handleEventSelect,
        handleCreateEvent,
        closeModal,
        closeTimelineView,
        handleEdit,
        handleCancel,
        handleDelete,
    } = useEnhancedTripCalendar();

    // Calculs des statistiques
    const totalTrips = calendarEvents.length;
    const totalSeats = calendarEvents.reduce((sum, e) => sum + (e.totalSeats || 0), 0);
    const availableSeats = calendarEvents.reduce((sum, e) => sum + (e.availableSeats || 0), 0);
    const bookedSeats = totalSeats - availableSeats;
    const totalRevenue = calendarEvents.reduce((sum, e) => sum + (e.price || 0) * ((e.totalSeats || 0) - (e.availableSeats || 0)), 0);
    const potentialRevenue = calendarEvents.reduce((sum, e) => sum + (e.price || 0) * (e.totalSeats || 0), 0);
    const occupancyRate = totalSeats > 0 ? Math.round((bookedSeats / totalSeats) * 100) : 0;

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex justify-center items-center py-20">
                    <div className="text-center">
                        <Loader  message={"Chargement du calendrier..."}/>
                    </div>
                </div>
            );
        }

        if (apiError) {
            return (
                <div className="p-10 text-center text-red-600 bg-red-50 rounded-xl border border-red-200 mx-4">
                    <AlertCircle className="mx-auto h-12 w-12 text-red-400 mb-4" />
                    <h3 className="text-lg font-semibold mb-2">Erreur de chargement</h3>
                    <p className="text-sm mb-6">{apiError}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
                    >
                        <RefreshCw className="h-4 w-4" />
                        Réessayer
                    </button>
                </div>
            );
        }

        // Vue Timeline quand on clique sur une date
        if (showTimelineView && selectedDate) {
            const dayEvents = getEventsForDate(selectedDate);

            return (
                <ProfessionalTimelineView
                    date={selectedDate}
                    events={dayEvents}
                    onEventSelect={handleEventSelect}
                    onCreateEvent={handleCreateEvent}
                    onBack={closeTimelineView}
                    getStatusColor={getStatusColor}
                    getStatusDotColor={getStatusDotColor}
                />
            );
        }

        return (
            <div className="space-y-8">
                {/* Statistiques en premier */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard
                        icon={CalendarIcon}
                        title="Voyages ce mois"
                        value={totalTrips}
                        subtitle="Voyages programmés"
                        trend={totalTrips > 0 ? "+12% vs mois dernier" : undefined}
                        colorClass="text-primary"
                    />
                    <StatCard
                        icon={Users}
                        title="Taux d'occupation"
                        value={`${occupancyRate}%`}
                        subtitle={`${bookedSeats} / ${totalSeats} places`}
                        trend={occupancyRate > 70 ? "Excellent taux" : occupancyRate > 50 ? "Bon taux" : "À améliorer"}
                        colorClass="text-green-600"
                    />
                    <StatCard
                        icon={Users}
                        title="Places disponibles"
                        value={availableSeats}
                        subtitle="Places à réserver"
                        colorClass="text-amber-600"
                    />
                    <StatCard
                        icon={DollarSign}
                        title="Revenus actuels"
                        value={`${totalRevenue.toLocaleString()}`}
                        subtitle={`/ ${potentialRevenue.toLocaleString()} FCFA max`}
                        trend={potentialRevenue > 0 ? `${Math.round((totalRevenue / potentialRevenue) * 100)}% du potentiel` : undefined}
                        colorClass="text-blue-600"
                    />
                </div>

                {/* Navigation du calendrier */}
                <DateNavigation
                    currentDate={currentDate}
                    onPreviousMonth={goToPreviousMonth}
                    onNextMonth={goToNextMonth}
                    onToday={goToToday}
                    onDateChange={goToDate}
                    viewType={viewType}
                    onViewChange={setViewType}
                />

                {/* Vue principale du calendrier */}
                {viewType === 'month' && (
                    <CleanCalendarView
                        calendarMonth={calendarMonth}
                        onDateSelect={handleDateSelect}
                        onEventSelect={handleEventSelect}
                        getStatusColor={getStatusColor}
                        getStatusDotColor={getStatusDotColor}
                    />
                )}

                {/* Vue agenda simplifiée */}
                {viewType === 'agenda' && (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                            <CalendarIcon className="h-5 w-5 text-primary" />
                            Agenda - {currentDate.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}
                        </h3>

                        {calendarEvents.length === 0 ? (
                            <div className="text-center py-12">
                                <CalendarIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                                <p className="text-gray-500 text-lg mb-2">Aucun voyage programmé ce mois-ci</p>
                                <p className="text-gray-400">Créez votre premier voyage pour commencer</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {calendarEvents
                                    .sort((a, b) => a.start.getTime() - b.start.getTime())
                                    .map((event) => (
                                        <div
                                            key={event.id}
                                            onClick={() => handleEventSelect(event)}
                                            className="flex items-center gap-4 p-4 border border-gray-200 rounded-xl hover:shadow-md hover:border-primary/50 cursor-pointer transition-all group"
                                        >
                                            <div className={`w-4 h-4 rounded-full ${getStatusDotColor(event.status)}`} />
                                            <div className="flex-1">
                                                <div className="flex items-center justify-between mb-1">
                                                    <h4 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                                        {event.title}
                                                    </h4>
                                                    <span className="text-sm text-gray-500 font-medium">
                            {event.start.toLocaleDateString('fr-FR')} à {event.start.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </span>
                                                </div>
                                                <p className="text-sm text-gray-600">{event.description}</p>
                                                {event.price && (
                                                    <p className="text-sm font-medium text-primary mt-1">
                                                        {event.price.toLocaleString()} FCFA
                                                    </p>
                                                )}
                                            </div>
                                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(event.status)}`}>
                        {event.status.replace('_', ' ')}
                      </span>
                                        </div>
                                    ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Analyse rapide si il y a des voyages */}
                {calendarEvents.length > 0 && (
                    <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl p-6 border border-primary/20">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            Analyse rapide
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                            <div className="bg-white/80 rounded-lg p-4">
                                <p className="text-gray-600 mb-1">Performance</p>
                                <p className="font-semibold text-primary">
                                    {occupancyRate >= 80 ? "Excellente" : occupancyRate >= 60 ? "Bonne" : occupancyRate >= 40 ? "Moyenne" : "À améliorer"}
                                </p>
                            </div>
                            <div className="bg-white/80 rounded-lg p-4">
                                <p className="text-gray-600 mb-1">Recommandation</p>
                                <p className="font-semibold text-primary">
                                    {availableSeats > totalSeats * 0.5 ? "Intensifier la promotion" : "Maintenir le rythme"}
                                </p>
                            </div>
                            <div className="bg-white/80 rounded-lg p-4">
                                <p className="text-gray-600 mb-1">Potentiel restant</p>
                                <p className="font-semibold text-primary">
                                    {(potentialRevenue - totalRevenue).toLocaleString()} FCFA
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto">
                <PageHeader
                    title={t("dashboard.calendar.title")}
                    subtitle={t("dashboard.calendar.subtitle")}
                />

                <div className="p-6">
                    {renderContent()}
                </div>
            </div>

            {/* Modal de détail des voyages */}
            <EnhancedTripDetailModal
                isOpen={isModalOpen}
                trip={selectedTrip}
                onClose={closeModal}
                onEdit={handleEdit}
                onCancel={handleCancel}
                onDelete={handleDelete}
            />
        </div>
    );
};

export default FinalCalendarPage;