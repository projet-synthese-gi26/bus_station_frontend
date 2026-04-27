import {Building, Globe, Info, MapPin} from "lucide-react";
import React, {JSX} from "react";
import Continue from "@/components/authentication-pages-components/Continue";
import InputField from "@/ui/InputField";
import TextareaField from "@/ui/TextareaField";
import {TravelAgencyFormProps} from "@/lib/types/formProps";
import {useAgencyCreation} from "@/lib/hooks/registration-hooks/useAgencyCreation";
import TransparentModal from "@/modals/TransparentModal";
import Loader from "@/modals/Loader";
import {SuccessModal} from "@/modals/SuccessModal";
import {useNavigation} from "@/lib/hooks/useNavigation";


export default function TravelAgencyForm({changeStep, ...continueProps}: TravelAgencyFormProps): JSX.Element
{



    const {isLoading, axiosErrors, message, canOpenSuccessModal, setCanOpenSuccessModal,handleCreateAgency, ...zodParams} = useAgencyCreation();
    const navigation = useNavigation();


    return (
        <form onSubmit={zodParams?.handleSubmit(handleCreateAgency)}>
            {isLoading && (
                <TransparentModal isOpen={isLoading}>
                    <Loader/>
                </TransparentModal>
            )}
            {axiosErrors && <p className="text-red-500 font-semibold text-sm mb-5">{axiosErrors.other}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
                <InputField
                    id="agency_long_name"
                    type="text"
                    label="Agency Name"
                    placeholder="Extraordinary Travels"
                    icon={<Building className="h-5 w-5 text-gray-400"/>}
                    register={zodParams?.register(("long_name"))}
                    error={zodParams?.errors?.long_name?.message || axiosErrors?.long_name}
                />
                <InputField
                    id="location"
                    type="text"
                    label="Main Location"
                    placeholder="Paris, France"
                    icon={<MapPin className="h-5 w-5 text-gray-400"/>}
                    register={zodParams?.register(("location"))}
                    error={zodParams?.errors?.location?.message || axiosErrors?.location}
                />
                <TextareaField
                    id="description"
                    label="Agency Description"
                    placeholder="Describe your agency and the services you offer..."
                    register={zodParams?.register(("description"))}
                    error={zodParams?.errors?.description?.message || axiosErrors?.description}
                    icon={<Info className="h-5 w-5 text-gray-400"/>}
                />
                <TextareaField
                    id="greeting_message"
                    label="Welcome Message"
                    placeholder="Message that will be displayed to visitors of your page..."
                    register={zodParams?.register(("greeting_message"))}
                    error={zodParams?.errors?.greeting_message?.message || axiosErrors?.greeting_message}
                    icon={<Info className="h-5 w-5 text-gray-400"/>}
                />

                <TextareaField
                    id="social_network"
                    label="Social Networks (optional)"
                    placeholder="@extraordinary_travels"
                    register={zodParams?.register(("social_network"))}
                    error={zodParams?.errors?.social_network?.message || axiosErrors?.social_network}
                    icon={<Globe className="h-5 w-5 text-gray-400"/>}
                />
            </div>
            <Continue
                agreeTerms={continueProps?.agreeTerms}
                step={continueProps?.step}
                goBack={continueProps?.goBack}
                setAgreeTerms={continueProps?.setAgreeTerms}
            />

            <TransparentModal isOpen={canOpenSuccessModal}>
                <SuccessModal
                    canOpenSuccessModal={setCanOpenSuccessModal}
                    message={message || ""}
                    makeAction={()=> { navigation?.onGoToLogin(); changeStep(1) }}
                />
            </TransparentModal>
        </form>
    )
}