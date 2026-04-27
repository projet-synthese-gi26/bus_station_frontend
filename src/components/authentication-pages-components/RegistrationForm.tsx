import {AnimatePresence, motion} from "framer-motion";
import BusinessActorForm from "@/components/authentication-pages-components/BusinessActorForm";
import OrganizationForm from "@/components/authentication-pages-components/OrganizationForm";
import TravelAgencyForm from "@/components/authentication-pages-components/TravelAgencyForm";
import Link from "next/link";
import React from "react";
import { JSX } from "react";
import {useRegistration} from "@/lib/hooks/registration-hooks/useRegistration";
import LanguageSwitch from "@/components/authentication-pages-components/LanguageSwitch";
import {changeLanguage} from "@/lib/services/i18n-services/languageService";
import {useTranslation} from "react-i18next";
import {SupportedLanguage} from "@/lib/types/common";


export interface RegistrationFormProps {
    step:number,
    goBack:()=>void,
    changeStep:(step:number)=>void
}


export default function RegistrationForm({step, goBack, changeStep} : RegistrationFormProps ): JSX.Element
{
   const {agreeTerms, setAgreeTerms, createAgency, setCreateAgency} = useRegistration();
  const [t,i18n] = useTranslation();

  function updateLangage()
  {
      if (i18n.language === "fr")
      {
          changeLanguage("en");
      }
      else {
          changeLanguage("fr");
      }
  }

    return (
        <div className="p-6 md:p-8">

            <div className="flex justify-end mb-6">
                <motion.div initial={{opacity: 0, y: -10}} animate={{opacity: 1, y: 0}} transition={{duration: 0.3}}>
                    <LanguageSwitch language={i18n.language as SupportedLanguage} onToggle={updateLangage}/>
                </motion.div>
            </div>

            <div>
                <AnimatePresence mode="wait">
                    <motion.div
                        key={`step-${step}`}
                        initial={{opacity: 0, x: -20}}
                        animate={{opacity: 1, x: 0}}
                        exit={{opacity: 0, x: 20}}
                        transition={{duration: 0.3}}
                        className="space-y-6"
                    >
                        {step === 1 && (
                            <BusinessActorForm
                                changeStep={changeStep}
                                agreeTerms={agreeTerms}
                                step={step}
                                setAgreeTerms={setAgreeTerms}
                                createAgency={createAgency}
                                goBack={goBack}
                            />
                        )}

                        {step === 2 && (
                            <>
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Choose your type of account</h2>
                                    <p className="text-gray-500 mt-2">
                                        You will always be able to change your account type later.
                                    </p>
                                </div>
                                <OrganizationForm
                                    changeStep={changeStep}
                                    createAgency={createAgency}
                                    setCreateAgency={setCreateAgency}
                                    agreeTerms={agreeTerms}
                                    step={step}
                                    setAgreeTerms={setAgreeTerms}
                                    goBack={goBack}
                                />
                            </>
                        )}

                        {step === 3 && (
                            <>
                                <div className="text-center mb-6">
                                    <h2 className="text-xl font-semibold text-gray-800">Details of your travel
                                        agency</h2>
                                    <p className="text-gray-500 mt-2">This information could be visible to potential
                                        customers.</p>
                                </div>
                                <TravelAgencyForm
                                    agreeTerms={agreeTerms}
                                    step={step}
                                    setAgreeTerms={setAgreeTerms}
                                    createAgency={createAgency}
                                    goBack={goBack}
                                    changeStep={changeStep}
                                />
                            </>
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
            <div className="mt-8 text-center">
                <p className="text-gray-600">
                    Do you already have an account?{" "}
                    <Link href="/login" className="text-blue-600 hover:text-blue-800 font-medium">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    )
}