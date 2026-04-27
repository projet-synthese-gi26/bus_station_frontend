import React, {JSX} from "react";
import {AtSign, Lock, Phone, User} from "lucide-react";
import Continue from "@/components/authentication-pages-components/Continue";
import {BusinessActorFormProps} from "@/lib/types/formProps";
import InputField from "@/ui/InputField";
import useBusinessActorCreation from "@/lib/hooks/registration-hooks/useBusinessActorCreation";
import TransparentModal from "@/modals/TransparentModal";
import Loader from "@/modals/Loader";
import SelectField from "@/ui/SelectField";




export default function BusinessActorForm({changeStep,...continueProps}:BusinessActorFormProps):JSX.Element
{

    const {isLoading, handleCreateBusinessActor, axiosErrors, userGenderOption, ...zodParams} = useBusinessActorCreation(changeStep);

    return (
        <form onSubmit={zodParams.handleSubmit(handleCreateBusinessActor)}>
            {isLoading && (
                <TransparentModal isOpen={isLoading}>
                    <Loader/>
                </TransparentModal>
            )}
            {axiosErrors?.other && <p className="text-red-500 font-semibold text-sm mb-5">{axiosErrors?.other}</p>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <>
                    <InputField
                        id="first_name"
                        label="First Name"
                        placeholder="Jean"
                        icon={<User className="h-5 w-5 text-gray-400"/>}
                        register={zodParams.register && zodParams.register("first_name")}
                        error={axiosErrors?.first_name || zodParams.errors?.first_name?.message}
                    />

                    <InputField
                        id="last_name"
                        label="Last Name"
                        placeholder="Dupont"
                        icon={<User className="h-5 w-5 text-gray-400"/>}
                        register={zodParams.register && zodParams.register("last_name")}
                        error={axiosErrors?.last_name || zodParams.errors?.last_name?.message}
                    />

                    <InputField
                        id="username"
                        label="Username"
                        placeholder="dupont123"
                        icon={<User className="h-5 w-5 text-gray-400"/>}
                        register={zodParams.register && zodParams.register("username")}
                        error={axiosErrors?.username || zodParams.errors?.username?.message}
                    />

                    <InputField
                        id="age"
                        label="Age"
                        placeholder="25"
                        type="number"
                        icon={<User className="h-5 w-5 text-gray-400"/>}
                        register={zodParams.register && zodParams.register("age")}
                        error={zodParams.errors?.age?.message}
                    />

                    <SelectField
                        id="gender"
                        label="Select your gender"
                        icon={<User className="h-5 w-5 text-gray-400" />}
                        options={userGenderOption}
                        register={zodParams.register && zodParams.register("gender")}
                        error={zodParams.errors?.gender?.message}
                    />

                    <InputField
                        id="email"
                        label="Email"
                        placeholder="jean.dupont@example.com"
                        type="email"
                        icon={<AtSign className="h-5 w-5 text-gray-400"/>}
                        register={zodParams.register ? zodParams.register("email") : undefined}
                        error={axiosErrors?.email || zodParams.errors?.email?.message}
                    />

                    <InputField
                        id="phone_number"
                        label="Phone Number"
                        placeholder="+33 6 12 34 56 78"
                        type="tel"
                        icon={<Phone className="h-5 w-5 text-gray-400"/>}
                        register={zodParams.register && zodParams.register("phone_number")}
                        error={axiosErrors?.phone_number || zodParams.errors?.phone_number?.message}
                    />


                    <InputField
                        id="password"
                        label="Password"
                        placeholder="••••••••"
                        icon={<Lock className="h-5 w-5 text-gray-400"/>}
                        toggleVisibility={true}
                        register={zodParams.register && zodParams.register("password")}
                        error={zodParams.errors?.password?.message}
                    />

                    <InputField
                        id="confirmPassword"
                        label="Confirm your password"
                        placeholder="••••••••"
                        icon={<Lock className="h-5 w-5 text-gray-400"/>}
                        toggleVisibility={true}
                        register={zodParams.register && zodParams.register("confirmPassword")}
                        error={zodParams.errors?.confirmPassword?.message}

                    />
                </>
            </div>
            <Continue agreeTerms={continueProps.agreeTerms} step={continueProps.step} goBack={continueProps.goBack}
                      setAgreeTerms={continueProps.setAgreeTerms} createAgency={continueProps.createAgency}/>
        </form>
    )
}