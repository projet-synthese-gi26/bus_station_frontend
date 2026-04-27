"use client";


import {JSX} from "react";
import {motion} from "framer-motion";
import {fadeInLeft, fadeInRight, fadeInUp, staggerContainer} from "@/lib/animations/animationTool";
import Image from "next/image";
import {useInView} from "react-intersection-observer";
import {Search, CreditCard, CalendarDays} from "lucide-react";
import {useTranslation} from "react-i18next";


export default function CustomerSection(): JSX.Element
{
    const [customerRef, customerInView] = useInView({
        triggerOnce: false,
        threshold: 0.1,
    })


    const [t] = useTranslation();
    
    function translate(key: string): string
    {
        return t("landingPage.customerSection."+key);
    }
    
    return (
        <motion.div
            ref={customerRef}
            initial="hidden"
            animate={customerInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="py-5 bg-base-color flex flex-col"
        >
            <div className="container ">
                <motion.div variants={fadeInUp} className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-bold mb-6 text-gray-900">{translate("title")}</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        {translate("slogan")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <motion.div variants={fadeInLeft}>
                        <div className="relative h-[500px] w-full rounded-lg overflow-hidden shadow-xl">
                            <Image
                                src="/guest-filling-registration-forms.jpg"
                                alt="Interface voyageur"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInRight}>
                        <div className="space-y-8">
                            <div className="flex items-start">
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                    <Search className="h-6 w-6 text-primary"/>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">{translate("freeSearchTitle")}</h3>
                                    <p className="text-gray-600">
                                        {translate("freeSearchText")}

                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                    <CreditCard className="h-6 w-6 text-blue-600"/>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">{translate("flexiblePaymentTitle")}</h3>
                                    <p className="text-gray-600">
                                        {translate("flexiblePaymentText")}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start">
                                <div
                                    className="flex-shrink-0 w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                                    <CalendarDays className="h-6 w-6 text-blue-600"/>
                                </div>
                                <div>
                                    <h3 className="text-xl font-bold mb-2 text-gray-900">{translate("reservationManagementTitle")}</h3>
                                    <p className="text-gray-600">
                                        {translate("reservationManagementText")}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

        </motion.div>
    )
}