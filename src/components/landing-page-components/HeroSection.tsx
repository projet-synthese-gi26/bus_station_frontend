"use client";

import {motion} from "framer-motion";
import {fadeInLeft, fadeInRight, fadeInUp} from "@/lib/animations/animationTool";
import {JSX} from "react";
import {useInView} from "react-intersection-observer";
import {useNavigation} from "@/lib/hooks/useNavigation";
import {useTranslation} from "react-i18next";

export default function HeroSection(): JSX.Element
{
    const [heroRef, heroInView] = useInView({
        triggerOnce: false,
        threshold: 0.1,
    });

    const{t} = useTranslation();
    const navigation = useNavigation();


    return (
        <motion.div
            ref={heroRef}
            initial="hidden"
            animate={heroInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="relative text-base-color py-32 md:py-52 hero-section "
        >
            <div className="container flex flex-col md:flex-row items-center">
                <motion.div
                    variants={fadeInLeft}
                    className="md:w-2/3 mb-10 md:mb-0">
                    <motion.h1
                        variants={fadeInUp}
                        className="text-3xl md:text-5xl font-semibold mb-6 tracking-normal leading-tight "
                    >
                        {t("landingPage.heroSection.slogan")}


                    </motion.h1>
                    <motion.p variants={fadeInUp} className="md:text-2xl text-xl mb-8 text-blue-100">
                        {t("landingPage.heroSection.fullSlogan")}
                    </motion.p>
                    <motion.div variants={fadeInUp} className="flex flex-wrap gap-4">
                        <button
                            onClick={navigation.onGoToMarketPlace}
                            className="cursor-pointer px-6 py-3 rounded-2xl bg-transparent font-bold border-2 border-base-color text-base-color hover:text-primary hover:bg-base-color duration-500 transition-all">

                            {t("landingPage.heroSection.ctaMarketPlace")}
                        </button>
                        <motion.button
                            variants={fadeInRight}
                            onClick={navigation.onGoToRegister}
                            className="cursor-pointer px-6 py-3 bg-base-color rounded-2xl  font-bold text-primary">
                            {t("landingPage.heroSection.registerText")}
                        </motion.button>
                    </motion.div>
                </motion.div>
            </div>

            {/* Séparateur ondulé */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0] transform rotate-180">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block w-full h-[60px]"
                >
                    <path
                        d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
                        fill="#ffffff"
                    ></path>
                </svg>
            </div>
        </motion.div>
    )
}