import { ArrowLeft, X } from "lucide-react";
import TravellerInfosForm from "./TravellerInfosForm";
import TicketPreview from "./TicketPreview";
import { Trip } from "@/lib/types/models/Trip";
import { PassengerFormType } from "@/lib/types/schema/passengerReservationSchema";
import {useReservationStep2} from "@/lib/hooks/reservation-hooks/useReservationStep2";
import {Tooltip} from "antd";

interface ReservationStep2PropsInterface {
    selectedSeats: number[];
    tripDetails: Trip;
    onBack: () => void;
    onClose: () => void;
    setStep: (param: number) => void;
    setPassengers: (param: PassengerFormType[]) => void;
}

export default function ReservationStep2({
                                             selectedSeats,
                                             tripDetails,
                                             onBack,
                                             onClose,
                                             setStep,
                                             setPassengers
                                         }: ReservationStep2PropsInterface) {

    const {handleSubmit, onContinue, register, errors, fields, isValid, watchedPassengers} = useReservationStep2(selectedSeats, setStep, setPassengers);

    return (
        <form onSubmit={handleSubmit(onContinue)} className="flex flex-col lg:flex-row h-full">

            {/* Fist section - passenger form */}
            <div className="w-full lg:w-1/2 p-4 lg:p-6 lg:overflow-y-auto lg:h-full">
                <div className="lg:mt-0 mt-2 flex justify-between items-center mb-6">
                    <div className="flex items-center gap-4">
                        <Tooltip placement={"top"} title={"go back"}>
                            <button
                                onClick={onBack}
                                className="cursor-pointer flex justify-center items-center lg:w-10 lg:h-10 w-8 h-8 bg-green-100 text-green-600 p-2 rounded-full hover:bg-green-200 transition-all duration-300"
                            >
                                <ArrowLeft/>
                            </button>
                        </Tooltip>
                        <h2 className="text-2xl font-semibold text-primary">Informations voyageurs</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex justify-center items-center lg:w-10 lg:h-10 w-8 h-8 text-red-500 cursor-pointer lg:hidden bg-red-100 rounded-full p-2"
                    >
                        <X/>
                    </button>
                </div>
                {/* Formulaires pour chaque siège */}
                {fields.map((field, index: number) => (
                    <TravellerInfosForm
                        key={field.id}
                        seatNumber={selectedSeats[index]}
                        index={index}
                        register={register}
                        errors={errors}
                    />
                ))}
                <div className="flex justify-center mt-6  ">
                    <button
                        type="submit"
                        disabled={!isValid}
                        className="bg-primary hover:bg-blue-800 transition-all duration-300 cursor-pointer text-white py-3 px-6 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed hidden sm:block"
                    >
                        Continuer vers le résumé
                    </button>
                </div>
            </div>

            {/* Second section - Ticket preview */}
            <div className="w-full lg:w-1/2 bg-gray-50 p-4 lg:p-6 lg:overflow-y-auto lg:h-full">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold text-primary">Aperçu des tickets</h2>
                    <Tooltip placement={"top"} title={"close"}>
                        <button
                            onClick={onClose}
                            className="cursor-pointer lg:cursor-pointer lg:w-10 lg:h-10 lg:bg-red-100 lg:text-red-600 lg:p-2 lg:rounded-full lg:hover:bg-red-200 lg:transition-all lg:duration-300"
                        >
                            <X className="text-transparent lg:text-red-500"/>
                        </button>
                    </Tooltip>
                </div>
                {watchedPassengers?.map((passenger, index: number) => (
                    <TicketPreview
                        tripDetails={tripDetails}
                        key={selectedSeats[index]}
                        seatNumber={selectedSeats[index]}
                        passengerData={passenger}
                    />
                ))}
                {/* Continue button for mobile view */}
                <div className="flex justify-center mt-6 lg:hidden ">
                    <button
                        type="submit"
                        disabled={!isValid}
                        className="bg-primary hover:bg-blue-800 transition-all duration-300 cursor-pointer text-white py-3 px-6 rounded-lg font-semibold disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                        Continuer vers le résumé
                    </button>
                </div>
            </div>
        </form>
    )
}