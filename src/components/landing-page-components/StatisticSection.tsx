"use client";
import {JSX} from "react";
import {motion} from "framer-motion";
import {fadeInLeft, fadeInRight, fadeInUp} from "@/lib/animations/animationTool";
import {useInView} from "react-intersection-observer";
import {FcCancel, FcStatistics} from "react-icons/fc";
import {HiDocumentReport} from "react-icons/hi";
import {useTranslation} from "react-i18next";

export default function StatisticSection(): JSX.Element

{
    const [statsRef, statsInView] = useInView({
        triggerOnce: false,
        threshold: 0.1,
    })

    const [t] = useTranslation();

    function translate(key: string): string
    {
        return t("landingPage.statisticSection."+key);
    }

    return (
        <motion.div
            ref={statsRef}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="relative text-base-color py-20 md:py-52 statistic-section"
        >
            <div className="container">
                <motion.div variants={fadeInUp} className="text-center mb-16">
                    <h2 className="-mt-28 text-3xl md:text-5xl font-bold mb-6 text-base-color">{translate("title")}</h2>
                    <p className="text-xl text-base-color max-w-3xl mx-auto">
                        {translate("slogan")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    <motion.div variants={fadeInLeft} className="bg-base-color/90 p-8 rounded-xl shadow-xl hover:transform hover:-translate-y-6 transition duration-500">
                        <div className="flex justify-center mb-5">
                            <FcStatistics className="text-7xl "/>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-center text-gray-900">{translate("followUpReservationTitle")}</h3>
                        <p className="text-gray-600 text-center">
                            {translate("followUpReservationText")}
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInUp}
                                className="bg-base-color/90 p-8 rounded-xl shadow-xl hover:transform hover:-translate-y-6 transition duration-500">

                        <div className="flex justify-center mb-5">
                            <FcCancel className="text-7xl"/>
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-center text-gray-900"> {translate("cancellationAnalyticsTitle")}</h3>
                        <p className="text-gray-600  text-center">
                            {translate("cancellationAnalyticsText")}
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInRight}
                                className="bg-base-color/90 p-8 rounded-xl shadow-xl hover:transform hover:-translate-y-6 transition duration-500">

                        <div className="flex justify-center mb-5">
                            <HiDocumentReport className="text-7xl text-blue-600"/>
                        </div>

                        <h3 className="text-2xl font-bold mb-4 text-center text-gray-900"> {translate("commerceCustomTitle")}</h3>
                        <p className="text-gray-600 text-center">
                            {translate("commerceCustomText")}

                        </p>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}