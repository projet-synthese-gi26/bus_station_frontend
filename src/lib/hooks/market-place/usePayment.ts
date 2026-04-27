import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Reservation} from "@/lib/types/models/Reservation";
import {decryptDataWithAES} from "@/lib/services/encryption-service";
import {PaymentRequestFormType, paymentRequestSchema} from "@/lib/types/schema/paymentRequestSchema";
import {createPayment} from "@/lib/services/reservation-service";

export function usePayment(reservation?: Reservation) {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [axiosPaymentError, setAxiosPaymentError] = useState<string>("");
    const [canOpenSuccessModal, setCanOpenSuccessModal] = useState<boolean>(false);
    const [successMessage, setSuccessMessage] = useState<string>("");
    const [step, setStep] = useState(1);
    const [canOpenPaymentModal, setCanOpenPaymentModal] = useState<boolean>(false);


    const [currentReservation, setCurrentReservation] = useState<Reservation>(reservation || {
        dateConfirmation: "",
        dateReservation: "",
        idReservation: "",
        idUser: "",
        idVoyage: "",
        montantPaye: 0,
        nbrPassager: 0,
        prixTotal: 0,
        statutPayement: "PENDING",
        statutReservation: "RESERVER",
        transactionCode: ""
    });


    const [amount, setAmount] = useState<number>(() => {
        if (reservation) {
            return Number(reservation.prixTotal - reservation.montantPaye);
        }
        return 0;
    });


    const {register, handleSubmit, formState: { errors }, setValue} = useForm<PaymentRequestFormType>({
        resolver: zodResolver(paymentRequestSchema),
        defaultValues: {
            mobilePhone: "",
            mobilePhoneName: "",
            amount: 0,
            userId: "",
            reservationId: ""
        },
        mode: "onTouched",
    });

    useEffect(() => {
        if (currentReservation.idReservation) {
            setValue("reservationId", currentReservation.idReservation);
            setValue("amount", amount);
        }
    }, [currentReservation, amount, setValue]);


    function handleConfirmPayment() {
        setStep(2);
    }

    useEffect(() => {
        const encryptedData = sessionStorage.getItem("createdReservation");
        if (encryptedData && encryptedData !== "") {
            storeCreatedReservation()
                .then(() => console.log("data stored successfully"))
                .catch((error) => console.error("Error storing reservation:", error));
        }
    }, []);




    async function storeCreatedReservation(): Promise<void> {
        const encryptedData = sessionStorage.getItem("createdReservation");
        if (!encryptedData) {
            throw new Error("No reservation present in the session storage");
        }

        try {
            const result = await decryptDataWithAES(encryptedData);
            if (result) {
                const reservation = result as Reservation;
                setCurrentReservation(reservation);
                setAmount(reservation.prixTotal - reservation.montantPaye);
            }
        } catch (error) {
            console.error(error);
            throw new Error("Error during data decryption");
        }
    }


    useEffect(() => {
        console.log("error ", axiosPaymentError);
    }, [axiosPaymentError]);

    async function handleSubmitPayment(data: PaymentRequestFormType)
    {
        setIsLoading(true);
        setAxiosPaymentError("");
        await createPayment(data)
            .then((result)=> {
                if(typeof result === "string")
                {
                    sessionStorage.removeItem("createdReservation");
                    setSuccessMessage("Transaction initiated successfully, follow steps on your phone to complete the transaction");
                    setAxiosPaymentError("");
                    setCanOpenSuccessModal(true);
                }
                else
                {
                    setSuccessMessage("");
                    setCanOpenSuccessModal(false);
                    setAxiosPaymentError("An error occurred during the payment process, retry please !");
                }
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            .catch((error)=> {
                setSuccessMessage("");
                setCanOpenSuccessModal(false);
                setAxiosPaymentError("An error occurred during the payment process, retry please !");
            })
            .finally(()=> setIsLoading(false))
    }


    return {
        isLoading,
        axiosPaymentError,
        step,
        amount,
        canOpenPaymentModal,
        canOpenSuccessModal,
        successMessage,
        currentReservation,
        setStep,
        handleConfirmPayment,
        handleSubmitPayment,
        setCanOpenPaymentModal,
        register,
        handleSubmit,
        errors
    };
}