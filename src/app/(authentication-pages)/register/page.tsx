"use client"

import React from "react";
import { motion } from "framer-motion";
import {useNavigation} from "@/lib/hooks/useNavigation";
import ProgressStepBar from "@/components/authentication-pages-components/ProgressStepBar";
import AnimateCircle from "@/ui/AnimateCircle";
import RegistrationForm from "@/components/authentication-pages-components/RegistrationForm";
import {useRegistration} from "@/lib/hooks/registration-hooks/useRegistration";




export default function RegisterPage() {

    const {step, changeStep, goBack} = useRegistration();
    const navigation = useNavigation();


    return (
        <div className={`min-h-screen bg-gradient-to-br from-blue-50 to-white py-12 px-4 sm:px-6 lg:px-8`}>
            <AnimateCircle/>
            <div className="max-w-4xl mx-auto">
                <ProgressStepBar step={step}/>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, ease: "easeOut" }}
                    className="bg-white rounded-2xl shadow-xl overflow-hidden"
                >
                    <div onClick={navigation.goToHome} className="cursor-pointer bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white text-center">
                        <div className="flex justify-center mb-4">
                            <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center">
                                <span className="font-bold text-2xl text-blue-600">M</span>
                            </div>
                        </div>
                        <h1 className="text-2xl font-bold">Create an account on Bus Station</h1>
                        <p className="mt-2 font-semibold text-white">Join our community of travelers and agencies</p>
                        <p className="text-white mt-2">
                            {step === 1 && "Let's start with your personal information."}
                            {step === 2 && "Choose your account type"}
                            {step === 3 && "Set up your travel agency"}
                        </p>
                    </div>
                <RegistrationForm step={step} goBack={goBack} changeStep={changeStep}/>
                </motion.div>
                <p className="mt-8 text-center text-gray-500 text-sm">
                    &copy; {new Date().getFullYear()} All rights reserved.
                </p>
            </div>
        </div>
    )
}
