import {useFieldArray, useForm} from "react-hook-form";
import {
    PassengerFormType,
    PassengersArrayFormType,
    passengersArraySchema
} from "@/lib/types/schema/passengerReservationSchema";
import {zodResolver} from "@hookform/resolvers/zod";

export function useReservationStep2(selectedSeats: number[], setStep: (step: number)=>void, setPassengers: (param: PassengerFormType[])=>void)
{

    /*** ZOD VALIDATION ***/
    const { register, control, handleSubmit, formState: { errors, isValid }, watch } = useForm<PassengersArrayFormType>({
        resolver: zodResolver(passengersArraySchema),
        defaultValues: {
            passengers: selectedSeats.map((seat) => ({
                numeroPieceIdentific: "",
                nom: "",
                genre: "Male",
                age: 0,
                nbrBaggage: 0,
                placeChoisis: seat
            }))
        },
        mode: "onTouched"
    });

    /*** ZOD ARRAY MANAGER ***/
    const { fields } = useFieldArray({
        control,
        name: "passengers"
    });

    /*** DATA SUBMISSION ***/
    function onContinue(data: PassengersArrayFormType) {
        console.log("Données validées: ", data);
        const passengers: PassengerFormType[] = data.passengers
        setPassengers(passengers);

        // ✅ Suppression du calcul manuel de totalLuggage
        // Il sera calculé automatiquement dans le hook useReservation
        // via useMemo basé sur passengersData

        console.log("Total luggage will be calculated automatically");
        setStep(3);
    }

    /*** REAL TIME DATA ***/
    const watchedPassengers = watch("passengers");

    return{
        register,
        onContinue,
        handleSubmit,
        errors,
        isValid,
        fields,
        watchedPassengers,
    }
}