import React, {JSX} from "react";
import {Building, Calendar, Mail, User, Workflow} from "lucide-react";
import {motion} from "framer-motion";
import Continue from "@/components/authentication-pages-components/Continue";
import UserAccountType from "@/components/authentication-pages-components/UserAccountType";
import InputField from "@/ui/InputField";
import SelectField from "@/ui/SelectField";
import {OrganizationFormProps} from "@/lib/types/formProps";
import TextareaField from "@/ui/TextareaField";
import {useOrganizationCreation} from "@/lib/hooks/registration-hooks/useOrganizationCreation";
import TransparentModal from "@/modals/TransparentModal";
import Loader from "@/modals/Loader";
import {SuccessModal} from "@/modals/SuccessModal";
import {useNavigation} from "@/lib/hooks/useNavigation";





export default function OrganizationForm({changeStep, setCreateAgency, ...continueProps}: OrganizationFormProps): JSX.Element
{



    const {isLoading, axiosErrors, organizationTypes, handleCreateOrganization, createUser, canOpenSuccessModal, setCanOpenSuccessModal, successMessage, ...zodParams} = useOrganizationCreation(changeStep, continueProps?.createAgency);
    const navigation = useNavigation();

    return (
        <form onSubmit={!continueProps.createAgency ? createUser : zodParams?.handleSubmit(handleCreateOrganization)}>
            {isLoading && (
                <TransparentModal isOpen={isLoading}>
                    <Loader/>
                </TransparentModal>
            )}
            <UserAccountType createAgency={continueProps.createAgency} setCreateAgencyAction={setCreateAgency}/>
            {continueProps.createAgency && (
                <motion.div
                    initial={{opacity: 0, height: 0}}
                    animate={{opacity: 1, height: "auto"}}
                    transition={{duration: 0.3}}
                    className="space-y-6 mt-6 border-t-2 pt-6 border-primary "
                >
                    <div className="text-center mb-10">
                        <h3 className="text-2xl font-semibold text-primary">Organization information</h3>
                        <p className="text-gray-500 text-md mt-1">
                            Start by creating an organization. This information is necessary for the creation of your agency.
                        </p>
                    </div>

                    {axiosErrors && <p className="text-red-500 font-semibold text-sm mb-5">{axiosErrors.other}</p>}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InputField
                            id="long_name"
                            label="Name of the Organization"
                            placeholder="General Voyages"
                            icon={<Building className="h-5 w-5 text-gray-400"/>}
                            register={zodParams.register && zodParams.register("long_name")}
                            error={zodParams?.errors?.long_name?.message || axiosErrors?.long_name}
                        />
                        <InputField
                            id="ceo_name"
                            type="text"
                            label="Name of the CEO of the organization"
                            placeholder="KENFACK Adam"
                            icon={<User className="h-5 w-5 text-gray-400"/>}
                            register={zodParams?.register && zodParams?.register("ceo_name") }
                            error={zodParams?.errors?.ceo_name?.message || axiosErrors?.ceo_name}
                        />
                        <InputField
                            id="email"
                            label="Contact email"
                            placeholder="contact@voyages-extraordinaires.com"
                            type="email"
                            icon={<Mail className="h-5 w-5 text-gray-400"/>}
                            register={zodParams?.register && zodParams?.register("email")}
                            error={zodParams?.errors?.email?.message || axiosErrors?.email}
                        />
                        <InputField
                            id="year_founded"
                            type="date"
                            label="Year of foundation"
                            placeholder="2025"
                            icon={<Calendar className="h-5 w-5 text-gray-400"/>}
                            register={zodParams?.register && zodParams?.register("year_founded")}
                            error={zodParams?.errors?.year_founded?.message || axiosErrors?.year_founded}
                        />
                        <InputField
                            id="business_registration_number"
                            label="Organization registration number"
                            placeholder="IM075123456"
                            icon={<Workflow className="h-5 w-5 text-gray-400"/>}
                            register={zodParams?.register && zodParams?.register("business_registration_number")}
                            error={zodParams?.errors?.business_registration_number?.message || axiosErrors?.business_registration_number}
                        />
                        <InputField
                            id="tax_number"
                            label="Tax number of the organization"
                            placeholder="FR12345678901"
                            icon={<Workflow className="h-5 w-5 text-gray-400"/>}
                            register={zodParams?.register && zodParams?.register("tax_number")}
                            error={zodParams?.errors?.tax_number?.message || axiosErrors?.tax_number}
                        />
                        <SelectField
                            id="type"
                            label="Type of organization"
                            options={organizationTypes}
                            register={zodParams?.register && zodParams?.register("type")}
                            error={zodParams?.errors?.type?.message || axiosErrors?.type}
                        />
                        <InputField
                            id="web_site_url"
                            type="text"
                            label="Web Site (optionnal)"
                            placeholder="https://www.example.com"
                            icon={<Building className="h-5 w-5 text-gray-400"/>}
                            register={zodParams?.register && zodParams?.register("web_site_url")}
                            error={zodParams?.errors?.web_site_url?.message || axiosErrors?.web_site_url}
                        />
                        <TextareaField
                            id="descrption"
                            label="Description of the organization"
                            placeholder="Voyages Extraordinaires"
                            icon={<Building className="h-5 w-5 text-gray-400"/>}
                            register={zodParams?.register && zodParams?.register("description")}
                            error={zodParams?.errors?.description?.message || axiosErrors?.description}
                        />
                    </div>
                </motion.div>
            )
        }
        <Continue agreeTerms={continueProps.agreeTerms}
                  step={continueProps.step}
                  goBack={continueProps.goBack}
                  setAgreeTerms={continueProps.setAgreeTerms}
                  createAgency={continueProps.createAgency}
        />
        <TransparentModal isOpen={canOpenSuccessModal}>
            <SuccessModal
                canOpenSuccessModal={setCanOpenSuccessModal}
                message={successMessage || ""}
                makeAction={()=> { navigation?.onGoToLogin(); changeStep(1) }}
            />
        </TransparentModal>
        </form>
    )
}