'use client';

import {useEffect} from "react";
import {useSeatManager} from "@/lib/hooks/market-place/useSeatManager";

export default function Bus80SeatsDisposition({setSeats, _reservedSeats, tripId}) {

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
                <div className="grid gap-2 w-fit grid-cols-3 min-h-screen p-2">
                    <div className="col-span-3 border-2 border-gray-400 flex justify-center items-center rounded-lg font-bold h-12  mt-1">
                        <p className="text-xl text-reservation-color">Driver</p>
                    </div>
                    {Array.from({length: 48}, (_, index) => {
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
                    {Array.from({length: 12}, (_, index) => {
                        const seatNumber = index + 49;
                        const isDoor = seatNumber === 53 || seatNumber === 54;
                        const displayNumber = isDoor ? "Porte" : seatNumber >= 53 ? (seatNumber - 2) : seatNumber;
                        const isDisabled = isDoor || permanentOccupiedSeats.includes(displayNumber) || temporaryReservedSeats.includes(displayNumber);

                        return (
                            <button
                                disabled={isDisabled}
                                key={index}
                                onClick={() => !isDoor && handleSeatClick(displayNumber)}
                                className={`${isDoor ? "lg:w-12 lg:h-12 w-10 h-10 border-2 border-gray-300 rounded-lg bg-gray-100 text-xs font-bold text-gray-500" : getSeatClass(displayNumber)}`}
                            >
                                {isDoor ? "Porte" : displayNumber}
                            </button>
                        )
                    })}
                    {Array.from({length: 18}, (_, index) => {
                        const seatNumber = index + 59;
                        const isDoor = seatNumber === 71 || seatNumber === 72;
                        const displayNumber = isDoor ? "Porte" : seatNumber >= 71 ? (seatNumber - 2): seatNumber;
                        const isDisabled = isDoor || permanentOccupiedSeats.includes(displayNumber) || temporaryReservedSeats.includes(displayNumber);

                        return (
                            <button
                                disabled={isDisabled}
                                key={index}
                                onClick={() => !isDoor && handleSeatClick(displayNumber)}
                                className={`${isDoor ? "lg:w-12 lg:h-12 w-10 h-10 border-2 border-gray-300 rounded-lg bg-gray-100 text-xs font-bold text-gray-500" : getSeatClass(displayNumber)}`}
                            >
                                {isDoor ? "Porte" : displayNumber}
                            </button>
                        )
                    })}
                </div>
            </div>

            {/*  Dernier banc avec 6 places  */}
            <div className="grid gap-2 w-fit grid-cols-6 p-2">
                {Array.from({length: 6}, (_, index) => {
                    const seatNumber = index + 75;
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