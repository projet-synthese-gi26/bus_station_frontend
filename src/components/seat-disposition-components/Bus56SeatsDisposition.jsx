'use client';

import {useEffect} from "react";
import {useSeatManager} from "@/lib/hooks/market-place/useSeatManager";

export default function Bus56SeatsDisposition({setSeats, _reservedSeats, tripId}) {

    const {
        selectedSeats,
        temporaryReservedSeats,
        permanentOccupiedSeats,
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
            <div className="grid grid-cols-2 w-fit gap-12 min-h-screen overflow-y-auto">
                {/* Premiere rangee */}
                <div className="grid gap-2 w-fit grid-cols-2 min-h-screen p-2">
                    <div className="col-span-2 border-2 border-gray-400 flex justify-center items-center rounded-lg font-bold h-12  mt-1">
                        <p className="text-xl text-reservation-color">Driver</p>
                    </div>
                    {Array.from({length: 30}, (_, index) => {
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

                {/* Deuxieme rangee */}
                <div className="grid grid-cols-2 w-fit gap-2 p-2">
                    <div className="col-span-2 border-2 border-gray-400 flex justify-center items-center rounded-lg font-bold h-12  mt-1">
                        <p className="text-xl text-reservation-color">Hostess</p>
                    </div>
                    {Array.from({length: 12}, (_, index) => {
                        const seatNumber = index + 31;
                        const isDoor = seatNumber === 37 || seatNumber === 38;
                        const isToilet = seatNumber === 35 || seatNumber === 36;
                        const displayNumber = isDoor ? "Door" : isToilet ? "Toilet" : seatNumber >= 35 ? (seatNumber - 4) : seatNumber;
                        const isSpecial = isDoor || isToilet;
                        const isDisabled = isSpecial || permanentOccupiedSeats.includes(displayNumber) || temporaryReservedSeats.includes(displayNumber);

                        return (
                            <button
                                disabled={isDisabled}
                                key={index}
                                onClick={() => !isSpecial && handleSeatClick(displayNumber)}
                                className={`${isSpecial ? "lg:w-12 lg:h-12 w-10 h-10 border-2 border-gray-300 rounded-lg bg-gray-100 text-xs font-bold text-gray-500" : getSeatClass(displayNumber)}`}
                            >
                                {displayNumber}
                            </button>
                        )
                    })}
                    {Array.from({length: 20}, (_, index) => {
                        const seatNumber = index + 39;
                        const isDoor = seatNumber === 49 || seatNumber === 50;
                        const displayNumber = isDoor ? "Door" : seatNumber >= 49 ? (seatNumber - 2) : seatNumber;
                        const isDisabled = isDoor || permanentOccupiedSeats.includes(displayNumber) || temporaryReservedSeats.includes(displayNumber);

                        return (
                            <button
                                disabled={isDisabled}
                                key={index}
                                onClick={() => !isDoor && handleSeatClick(displayNumber)}
                                className={`${isDoor ? "lg:w-12 lg:h-12 w-10 h-10 border-2 border-gray-300 rounded-lg bg-gray-100 text-xs font-bold text-gray-500" : getSeatClass(displayNumber)}`}
                            >
                                {displayNumber}
                            </button>
                        )
                    })}
                </div>
            </div>
        </div>
    );
};