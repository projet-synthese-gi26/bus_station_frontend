'use client';

import {useEffect} from "react";
import {useSeatManager} from "@/lib/hooks/market-place/useSeatManager";

export default function Bus70SeatsDisposition ({setSeats, _reservedSeats, tripId}) {

    const {
        selectedSeats,
        temporaryReservedSeats,
        permanentOccupiedSeats,
        isConnecting,
        isConnected,
        setPermanentOccupiedSeats,
        handleSeatClick,
        getSeatClass
    } = useSeatManager(tripId);

    // Initialiser les places définitivement occupées DÈS LE DÉBUT
    useEffect(() => {
        if (_reservedSeats && _reservedSeats.length > 0) {
            setPermanentOccupiedSeats(_reservedSeats);
        }
    }, [_reservedSeats, setPermanentOccupiedSeats]);

    // Informer le parent des places sélectionnées
    useEffect(() => {
        setSeats(selectedSeats);
    }, [selectedSeats, setSeats]);

    return (
        <div className="p-5">
            {/* Indicateur de connexion WebSocket - Minimaliste comme WhatsApp */}
            <div className="mb-3">
                {isConnecting && (
                    <div className="flex items-center gap-2 text-blue-600 text-sm">
                        <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-blue-600"></div>
                        <span>Connexion...</span>
                    </div>
                )}
                {!isConnecting && isConnected && (
                    <div className="flex items-center gap-2 text-green-600 text-sm">
                        <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                        <span>En ligne</span>
                    </div>
                )}
                {!isConnecting && !isConnected && tripId && (
                    <div className="flex items-center gap-2 text-orange-600 text-sm">
                        <div className="w-2 h-2 bg-orange-600 rounded-full animate-pulse"></div>
                        <span>Reconnexion...</span>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-2 w-fit gap-12 min-h-screen overflow-y-auto">
                {/* Première rangée */}
                <div className="grid lg:gap-3 gap-8 w-fit grid-cols-3 min-h-screen p-2">
                    <div className="col-span-3 border-2 border-gray-400 flex justify-center items-center rounded-lg font-bold h-12 mt-1">
                        <p className="text-xl text-reservation-color">Driver</p>
                    </div>
                    {Array.from({length: 42}, (_, index) => {
                        const seatNumber = index + 1;
                        const isDisabled = permanentOccupiedSeats.includes(seatNumber) || temporaryReservedSeats.includes(seatNumber);

                        return (
                            <button
                                key={index}
                                onClick={() => handleSeatClick(seatNumber)}
                                disabled={isDisabled}
                                className={getSeatClass(seatNumber)}
                                title={
                                    permanentOccupiedSeats.includes(seatNumber) ? "Place occupée" :
                                        temporaryReservedSeats.includes(seatNumber) ? "Réservée par un autre utilisateur" :
                                            selectedSeats.includes(seatNumber) ? "Sélectionnée (cliquez pour désélectionner)" :
                                                "Disponible (cliquez pour sélectionner)"
                                }
                            >
                                {seatNumber}
                            </button>
                        );
                    })}
                </div>

                {/* Deuxième rangée */}
                <div className="grid grid-cols-2 w-fit gap-2 p-2">
                    {Array.from({length: 12}, (_, index) => {
                        const seatNumber = index + 43;
                        const isPorte = seatNumber === 47 || seatNumber === 48;
                        const displayNumber = isPorte ? "Porte" : (seatNumber >= 47 ? seatNumber - 2 : seatNumber);
                        const isDisabled = isPorte || permanentOccupiedSeats.includes(displayNumber) || temporaryReservedSeats.includes(displayNumber);

                        return (
                            <button
                                key={index}
                                onClick={() => !isPorte && handleSeatClick(displayNumber)}
                                disabled={isDisabled}
                                className={`${isPorte ? "lg:w-12 lg:h-12 w-10 h-10 border-2 border-gray-300 rounded-lg bg-gray-100 text-xs font-bold text-gray-500" : getSeatClass(displayNumber)}`}
                            >
                                {isPorte ? "Porte" : displayNumber}
                            </button>
                        );
                    })}
                    {Array.from({length: 14}, (_, index) => {
                        const seatNumber = index + 53;
                        const isPorte = seatNumber === 61 || seatNumber === 62;
                        const displayNumber = isPorte ? "Porte" : (seatNumber >= 61 ? seatNumber - 2 : seatNumber);
                        const isDisabled = isPorte || permanentOccupiedSeats.includes(displayNumber) || temporaryReservedSeats.includes(displayNumber);

                        return (
                            <button
                                key={index}
                                onClick={() => !isPorte && handleSeatClick(displayNumber)}
                                disabled={isDisabled}
                                className={`${isPorte ? "lg:w-12 lg:h-12 w-10 h-10 border-2 border-gray-300 rounded-lg bg-gray-100 text-xs font-bold text-gray-500" : getSeatClass(displayNumber)}`}
                            >
                                {isPorte ? "Porte" : displayNumber}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Dernier banc */}
            <div className="grid gap-2 w-fit grid-cols-6 p-2">
                {Array.from({length: 6}, (_, index) => {
                    const seatNumber = index + 65;
                    const isDisabled = permanentOccupiedSeats.includes(seatNumber) || temporaryReservedSeats.includes(seatNumber);

                    return (
                        <button
                            key={index}
                            onClick={() => handleSeatClick(seatNumber)}
                            disabled={isDisabled}
                            className={getSeatClass(seatNumber)}
                        >
                            {seatNumber}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};