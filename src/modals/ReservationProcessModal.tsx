import React from "react"
import ReservationStep1 from "../components/reservation-components/ReservationStep1"
import ReservationStep2 from "../components/reservation-components/ReservationStep2"
import ReservationStep3 from "../components/reservation-components/ReservationStep3"
import {Trip} from "@/lib/types/models/Trip";
import {useReservation} from "@/lib/hooks/reservation-hooks/useReservation";


export interface ReservationProcessModalPropsInterface {
    onCloseAction: ()=>void,
    tripDetails: Trip,
    setCanOpenPaymentModal: (param: boolean) => void,
    setReservationSuccessMessage: (param: string) => void
}

export default function ReservationProcessModal({  onCloseAction, tripDetails, setCanOpenPaymentModal, setReservationSuccessMessage }: ReservationProcessModalPropsInterface) {

    const reservationManager = useReservation(setCanOpenPaymentModal,tripDetails, onCloseAction, setReservationSuccessMessage);

    return (
        <>
            <div className="bg-white relative lg:rounded-xl  rounded-xl lg:max-w-5xl md:max-w-[1000px] sm:max-w-[370px] max-w-[330px] lg:h-[90vh] h-[75vh] overflow-y-auto">
                {reservationManager.step === 1 && (
                    <ReservationStep1
                        totalPrice={reservationManager.totalPrice}
                        tripDetails={tripDetails}
                        setSelectedSeats={reservationManager.setSelectedSeats}
                        selectedSeats={reservationManager.selectedSeats}
                        onClose={onCloseAction}
                        onContinue={() => reservationManager.continueToStep2()}
                    />
                )}
                {reservationManager.step === 2 && (
                    <ReservationStep2
                        onBack={reservationManager.onBack}
                        onClose={() => {
                            onCloseAction();
                            reservationManager.setStep(1);
                        }}
                        selectedSeats={reservationManager.selectedSeats}
                        setStep={reservationManager.setStep}
                        tripDetails={tripDetails}
                        setPassengers={reservationManager.setPassengersData}
                    />
                )}
                {reservationManager.step === 3 && (
                    <ReservationStep3
                        selectedSeats={reservationManager.selectedSeats}
                        tripDetails={tripDetails}
                        onClose={onCloseAction}
                        passengersData={reservationManager.passengersData}
                        setStep={reservationManager.setStep}
                        totalPrice={reservationManager.totalPrice}
                        subTotalPrice={reservationManager.subTotalPrice}
                        serviceFee={reservationManager.serviceFee}
                        totalLuggage={reservationManager.totalLuggage}
                        totalPassengers={reservationManager.totalPassengers}
                        onBookTrip={reservationManager.bookTrip}
                        isLoading={reservationManager.isLoading}
                        errorMessage = {reservationManager.errorMessage}
                    />
                )}
            </div>
        </>
    )
}