import { JSX } from "react"
import Link from "next/link";
import { motion } from "framer-motion";
import {ArrowLeft, ArrowRight} from "lucide-react";
import {ContinueProps} from "@/lib/types/formProps";


export default function Continue({agreeTerms, step, goBack,  setAgreeTerms, createAgency}:ContinueProps): JSX.Element
{
    return (
        <>
            <div className="mt-8">
                <div className="flex items-start">
                    <div className="flex items-center h-5">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            checked={agreeTerms}
                            onChange={() => setAgreeTerms(!agreeTerms)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            required
                        />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="terms" className="text-gray-700">
                            I accept {" "}
                            <Link href="/term-and-conditions" className="text-blue-600 hover:text-blue-800 font-medium">
                                 the terms of use
                            </Link>{" "}
                            et la{" "}
                            <Link href="/privacy-policy" className="text-blue-600 hover:text-blue-800 font-medium">
                                the privacy policy
                            </Link>
                        </label>
                    </div>
                </div>
            </div>

            {/* Navigation Buttons */}
            <div className="mt-8 flex justify-between">
                {step > 1 ? (
                    <motion.button
                        type="button"
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                        onClick={goBack}
                        className="flex items-center px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Go Back
                    </motion.button>
                ) : (
                    <div></div>
                )}

                <motion.button
                    type="submit"
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                    disabled={!agreeTerms}
                    className={`flex items-center px-6 py-3 rounded-lg font-medium cursor-pointer ${
                        agreeTerms
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    } transition-colors`}
                >
                    {step === 3 || (step === 2 && !createAgency) ? "Créer mon compte" : "Continuer"}
                    <ArrowRight className="ml-2 h-4 w-4"/>
                </motion.button>
            </div>
        </>
    )
}