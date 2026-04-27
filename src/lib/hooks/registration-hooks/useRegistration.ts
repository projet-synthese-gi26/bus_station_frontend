import {useEffect, useState} from "react";

export function useRegistration()
{

    const [step, setStep] = useState<number>(Number(localStorage.getItem("registrationStep") as string));
    const [createAgency, setCreateAgency] = useState<boolean>(false);
    const [agreeTerms, setAgreeTerms] = useState<boolean>(false);


    useEffect(() => {
        const newStep: number = Number(localStorage.getItem("registrationStep") as string);
        setStep(newStep);
    }, [step]);


    function changeStep(step: number): void
    {
        setStep(step);
        localStorage.setItem("registrationStep", String(step));
    }


    function goBack () :void
    {
        if (step > 1)
        {
            setStep(step - 1);
            localStorage.setItem("registrationStep", String(step - 1));
        }
    }


    return {
        step,
        changeStep,
        goBack,
        createAgency,
        agreeTerms,
        setAgreeTerms,
        setCreateAgency
    }
}