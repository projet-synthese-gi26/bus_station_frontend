"use client"

import { motion } from "framer-motion"
import { useInView } from "react-intersection-observer"
import { Users, Calendar } from "lucide-react"
import {fadeInUp, staggerContainer} from "@/lib/animations/animationTool";
import {JSX} from "react";
import {useTranslation} from "react-i18next";
import {useNavigation} from "@/lib/hooks/useNavigation";

export default function CTASection():JSX.Element {



    const [ctaRef, ctaInView] = useInView({
        triggerOnce: false,
        threshold: 0.1,
    })

    const [t] = useTranslation();

    function translate(key: string): string
    {
        return t("landingPage.CTASection."+key);
    }

    const navigation = useNavigation();


    return (
        <motion.div
            ref={ctaRef}
            initial="hidden"
            animate={ctaInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="bg-base-color w-full py-20 overflow-hidden"
        >
            <div className="container">
                <motion.div variants={fadeInUp} className="max-w-3xl mx-auto text-center">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 leading-tight text-primary">
                        {translate("title")}
                    </h2>

                    <p className="text-xl mb-8 text-gray-700 mx-auto">
                        {translate("slogan")}
                    </p>

                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={navigation.onGoToLogin}
                            className="cursor-pointer px-8 py-4 bg-base-color border-2 border-primary text-primary font-bold rounded-full hover:text-base-color hover:bg-primary duration-500 transition-all flex items-center gap-2"
                        >
                            <Calendar size={20}/>
                            {translate("planATrip")}
                        </button>

                        <button onClick={navigation.onGoToRegister}
                            className="cursor-pointer px-8 py-4 bg-primary text-base-color font-bold rounded-full hover:bg-start-color transition-all duration-500 flex items-center gap-2"
                        >
                            <Users size={20}/>
                            {t("landingPage.heroSection.registerText")}
                        </button>
                    </div>
                </motion.div>
            </div>
        </motion.div>
    )
}
