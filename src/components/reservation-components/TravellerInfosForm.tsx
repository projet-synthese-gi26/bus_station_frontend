import {Users } from "lucide-react";
import InputField from "@/ui/InputField";
import SelectField from "@/ui/SelectField";
import { UseFormRegister, FieldErrors } from "react-hook-form";
import { PassengersArrayFormType } from "@/lib/types/schema/passengerReservationSchema";
import {JSX} from "react";

export interface TravellerInfosFormProps {
    seatNumber: number;
    index: number;
    register: UseFormRegister<PassengersArrayFormType>;
    errors: FieldErrors<PassengersArrayFormType>;
}

const genderOptions = [
    { label: "Homme", value: "Male" },
    { label: "Femme", value: "Female" }
];

export default function TravellerInfosForm({seatNumber, index, register, errors}: TravellerInfosFormProps): JSX.Element
{

   
    const passengerErrors = errors.passengers?.[index];

    return (
        <div className="rounded-lg border-2 border-gray-200 p-4 mb-6 shadow-sm hover:shadow-md transition-shadow duration-300">
            <h3 className="text-md font-semibold text-primary mb-4 flex items-center">
                <Users className="mr-2 h-6 w-6"/>
                Siège {seatNumber}
            </h3>

            <div className="space-y-4">
                {/* Nom et Genre */}
                <div className="flex flex-row space-x-4">
                    <div className="flex-grow">
                        <InputField
                            id={`nom-${seatNumber}`}
                            name={`passengers.${index}.nom`}
                            label="Nom complet du voyageur"
                            placeholder="Nom complet du voyageur"
                            register={register(`passengers.${index}.nom`)}
                            error={passengerErrors?.nom?.message}
                        />
                    </div>
                    <div className="w-1/4">
                        <SelectField
                            id={`genre-${seatNumber}`}
                            name={`passengers.${index}.genre`}
                            label="Genre"
                            options={genderOptions}
                            register={register(`passengers.${index}.genre`)}
                            error={passengerErrors?.genre?.message}
                        />
                    </div>
                </div>

                {/* Âge, Bagages et Pièce d'identité */}
                <div className="flex flex-row space-x-4">
                    <div className="w-1/3">
                        <InputField
                            id={`age-${seatNumber}`}
                            label="Âge"
                            placeholder={"12 ans"}
                            type="number"
                            register={register(`passengers.${index}.age`, { valueAsNumber: true })}
                            error={passengerErrors?.age?.message}
                        />
                    </div>
                    <div className="w-1/3">
                        <InputField
                            id={`baggage-${seatNumber}`}
                            label="Nombre de Bagages"
                            placeholder={"1 bagage"}
                            type="number"
                            register={register(`passengers.${index}.nbrBaggage`, { valueAsNumber: true })}
                            error={passengerErrors?.nbrBaggage?.message}
                        />
                    </div>
                    <div className="w-1/3">
                        <InputField
                            id={`id-${seatNumber}`}
                            name={`passengers.${index}.numeroPieceIdentific`}
                            label="Pièce d'identité"
                            type="text"
                            register={register(`passengers.${index}.numeroPieceIdentific`)}
                            error={passengerErrors?.numeroPieceIdentific?.message}
                        />
                    </div>
                </div>

                {/* Champ caché pour placeChoisis */}
                <input
                    type="hidden"
                    {...register(`passengers.${index}.placeChoisis`, { valueAsNumber: true })}
                    value={seatNumber}
                />
            </div>
        </div>
    );
}