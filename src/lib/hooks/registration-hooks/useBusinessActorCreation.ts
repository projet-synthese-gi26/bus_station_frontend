import {useEffect, useState} from "react";
import {BusinessActor} from "@/lib/types/models/BusinessActor";
import {createBusinessActor} from "@/lib/services/businessActor-service";
import {AxiosError} from "axios";
import {BusinessActorFormType, businessActorSchema} from "@/lib/types/schema/businessActorSchema";
import {decryptDataWithAES, encryptDataWithAES} from "@/lib/services/encryption-service";
import {Option} from "@/ui/SelectField";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";



interface FieldErrors
{
    email?: string,
    first_name?: string,
    last_name?: string,
    phone_number?: string,
    username?: string,
    other?:string
}



export default function useBusinessActorCreation(changeStep: (step:number)=> void)
{

    /*** BUSINESS-ACTOR VARIABLES ***/
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [currentBusinessActor, setCurrentBusinessActor] = useState<BusinessActorFormType>({
        gender: "MALE",
        role:  ["USAGER"],
        confirmPassword: "",
        email: "",
        first_name: "",
        last_name: "",
        password: "",
        phone_number: "",
        username: "",
        age: 0
    });
    const [axiosErrors, setAxiosErrors] = useState<FieldErrors|null>(null);
    const userGenderOption: Option[] = [
        {
            value: "MALE",
            label: "Male"
        },
        {
            value: "FEMALE",
            label: "Female"
        }
    ];


    /**** ZOD VALIDATION VARIABLES ***/
    const {register, handleSubmit,reset, formState: { errors }} = useForm<BusinessActorFormType>(
        {
            resolver: zodResolver(businessActorSchema),
            defaultValues: currentBusinessActor,
        });


    useEffect(() => {
        if (currentBusinessActor) {
            reset(currentBusinessActor);
        }
    }, [currentBusinessActor, reset]);





    /*** ENCRYPTION AND DECRYPTION FUNCTIONS ***/

    useEffect(() => {
        async function storeData()
        {
            await storeCurrentBusinessActor();
        }
        const data: string|null = sessionStorage.getItem("currentBusinessActor");
        if(data)  storeData();
    }, []);




    async function saveCurrentBusinessActor(data: BusinessActorFormType): Promise<void>
    {
        setCurrentBusinessActor(data);
        await encryptDataWithAES(data)
            .then((result: string): void => {
                sessionStorage.setItem("currentBusinessActor", result);
            })
            .catch((error): void => {
                console.error(error);
                throw new Error("Error while saving data in the session storage");
            })
    }


    async function saveCreatedBusinessActor(data: BusinessActor): Promise<void>
    {
        await encryptDataWithAES(data)
            .then((result: string): void => {
                sessionStorage.setItem("createdBusinessActor", result);
            })
            .catch((error): void => {
                console.error(error);
                throw new Error("Error while saving data in the session storage");
            })
    }


    async function storeCurrentBusinessActor(): Promise<void>
    {
        const encryptedData = sessionStorage.getItem("currentBusinessActor") as string;
        if(encryptedData === "") throw new Error("No user present in the session storage");
        await decryptDataWithAES(encryptedData)
            .then((result): void => {
                if(result)
                {
                    const businessActor = result as BusinessActorFormType;
                    setCurrentBusinessActor(businessActor);
                }
            })
            .catch((error)=> {
                console.error(error);
                throw new Error("Error during data decryption");
            })
    }





    /*** BUSINESS-ACTOR CREATION ***/
    async function handleCreateBusinessActor(data: BusinessActorFormType): Promise<void>
    {
        setIsLoading(true);
        setAxiosErrors(null);
        await saveCurrentBusinessActor(data);
        await createBusinessActor(data)
            .then(async (result: BusinessActor|null): Promise<void> => {
                if(result)
                {
                    await saveCreatedBusinessActor(result);
                    changeStep(2);
                }
            })
            .catch((error: AxiosError) =>
            {
                if(error.status === 400 || error.status === 409)
                {
                    const badRequestError = error?.response?.data as FieldErrors;
                    Object.entries(badRequestError).forEach(([key, value]:[string,string]): void => {
                        setAxiosErrors((prevState) => ({
                            ...prevState,
                            [key]: value,
                            other:"An account already exists with some of the identifiers you provided, please change them!"
                        }));
                    })
                }
                else
                {
                    setAxiosErrors(
                        {
                        ...axiosErrors,
                        other:"An error occurred while creating your user account, please try again later.",
                    })
                }
            })
            .finally(()=> setIsLoading(false));
    }


    return {
        isLoading,
        handleCreateBusinessActor,
        currentBusinessActor,
        axiosErrors,
        userGenderOption,
        register,
        handleSubmit,
        errors
    }
}