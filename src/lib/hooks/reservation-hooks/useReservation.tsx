"use client";

import { useMemo, useState} from "react";
import {FaHouse} from "react-icons/fa6";
import {FaCalendar, FaMoneyBill} from "react-icons/fa";
import {formatDateOnly} from "@/lib/services/date-services";
import {MapPin} from "lucide-react";
import {Trip} from "@/lib/types/models/Trip";
import {PassengerFormType} from "@/lib/types/schema/passengerReservationSchema";
import {useBusStation} from "@/context/Provider";
import {ReservationCreationSchema} from "@/lib/types/schema/reservationCreationSchema";
import {createReservation} from "@/lib/services/reservation-service";
import {encryptDataWithAES} from "@/lib/services/encryption-service";
import {Reservation} from "@/lib/types/models/Reservation";


export function useReservation(setCanOpenPaymentModal: (param:boolean) => void, tripDetails: Trip, onClose: ()=>void, setReservationSuccessMessage: (param: string)=> void) {

    const [step, setStep] = useState<number>(1);
    const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
    const [passengersData, setPassengersData] = useState<PassengerFormType[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const { userData } = useBusStation();


    const totalPassengers: number = useMemo(() => {
        return selectedSeats.length;
    }, [selectedSeats.length]);


    const totalLuggage: number = useMemo((): number => {
        return passengersData.reduce((total: number, passenger: PassengerFormType) => {
            return total + (passenger.nbrBaggage || 0);
        }, 0);
    }, [passengersData]);


    const subTotalPrice: number = useMemo(() => {
        if (selectedSeats.length > 0 && tripDetails?.prix) {
            return selectedSeats.length * tripDetails.prix;
        }
        return 0;
    }, [selectedSeats.length, tripDetails?.prix]);

    const serviceFee: number = useMemo(() => {
        // 2% service fee
        return subTotalPrice * 0.02;
    }, [subTotalPrice]);

    const totalPrice: number = useMemo(() => {
        return subTotalPrice + serviceFee;
    }, [subTotalPrice, serviceFee]);


    const reservationDetails = [
        { icon: FaHouse, label: "Travel agency", value: tripDetails?.nomAgence },
        { icon: FaCalendar, label: "Travel date", value: formatDateOnly(tripDetails?.dateDepartPrev || "")},
        { icon: MapPin, label: "Departure location", value: tripDetails?.lieuDepart },
        { icon: MapPin, label: "Arrival Location", value: tripDetails?.lieuArrive },
        { icon: FaMoneyBill, label: "Unit price", value: tripDetails?.prix + " FCFA" },
    ];

    function onBack(): void {
        setStep(1);
    }

    function continueToStep2() {
        setStep(2);
    }

    async function saveCreatedReservation(reservation: Reservation): Promise<void> {
        if(reservation) {
            await encryptDataWithAES(reservation)
                .then((result: string):void=> {
                    sessionStorage.setItem("createdReservation", result);
                })
                .catch((error): void => {
                    console.error(error);
                    throw new Error("Error while saving data in the session storage");
                })
        } else {
            throw new Error("Any reservation found");
        }
    }

    async function bookTrip(): Promise<void> {
        setIsLoading(true);
        const data: ReservationCreationSchema = {
            nbrPassager: totalPassengers,
            montantPaye: 0,
            idUser: userData?.userId || "",
            idVoyage: tripDetails.idVoyage ,
            passagerDTO: passengersData,
        }
        console.log(data);
        await createReservation(data)
            .then(async (result: Reservation|null): Promise<void> => {
                if (result)
                {
                    await saveCreatedReservation(result);
                    setReservationSuccessMessage("🎊🎉 Your reservation has been successfully registered and is awaiting your confirmation.");
                    onClose();
                    setCanOpenPaymentModal(true);
                } else {
                    setErrorMessage("Something went wrong during your reservation, please retry !!");
                    setReservationSuccessMessage("");
                    setCanOpenPaymentModal(false);
                }
            })
            .catch((): void => {
                setErrorMessage("An error occurred during your booking, please retry !!");
                setReservationSuccessMessage("");
                setCanOpenPaymentModal(false);
            })
            .finally((): void => setIsLoading(false));
    }


    return {
        step,
        onBack,
        setStep,
        bookTrip,
        isLoading,
        totalPrice,
        serviceFee,
        subTotalPrice,
        setIsLoading,
        totalLuggage,
        errorMessage,
        selectedSeats,
        passengersData,
        continueToStep2,
        setErrorMessage,
        totalPassengers,
        setSelectedSeats,
        setPassengersData,
        reservationDetails,
    }
}