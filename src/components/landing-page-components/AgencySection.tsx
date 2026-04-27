"use client"

import type { JSX } from "react"
import { motion } from "framer-motion"
import { fadeInLeft, fadeInRight, fadeInUp, staggerContainer } from "@/lib/animations/animationTool"
import { useInView } from "react-intersection-observer"
import { ClipboardList, Calendar, CheckCircle, Globe, Users, TrendingUp, Shield } from "lucide-react"
import {useTranslation} from "react-i18next";

const FeatureItem = ({ icon: Icon, title, description }: { icon: JSX.Element; title: string; description: string }) => (
    <div className="flex items-start p-6 rounded-lg">
        <div className="flex-shrink-0 w-14 h-14 rounded-full bg-white flex items-center justify-center mr-5">
            {Icon}
        </div>
        <div>
            <h3 className="text-2xl font-bold mb-3">{title}</h3>
            <p className="text-white tracking-wide leading-snug">{description}</p>
        </div>
    </div>
)

const AdvantageItem = ({ icon: Icon, title, description }: { icon: JSX.Element; title: string; description: string }) => (
    <div className="flex items-center">
        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white flex items-center justify-center mr-4">
            {Icon}
        </div>
        <div>
            <h4 className="font-semibold text-xl">{title}</h4>
            <p className="text-white text-sm tracking-wide leading-snug">{description}</p>
        </div>
    </div>
)

export default function AgencySection(): JSX.Element {

    const [agencyRef, agencyInView] = useInView({
        triggerOnce: false,
        threshold: 0.1 }
    )

    const [t] = useTranslation();

    function translate(key: string): string {
        return t("landingPage.agencySection." + key);
    }

    const features = [
        {
            icon: <ClipboardList className="h-7 w-7 text-primary" />,
            title: translate("features.planning.title"),
            description: translate("features.planning.description"),
        },
        {
            icon: <Calendar className="h-7 w-7 text-blue-600" />,
            title: translate("features.publishing.title"),
            description: translate("features.publishing.description"),
        },
        {
            icon: <CheckCircle className="h-7 w-7 text-blue-600" />,
            title: translate("features.tickets.title"),
            description: translate("features.tickets.description"),
        },
    ];

    const advantages = [
        {
            icon: <Globe className="h-5 w-5 text-blue-600" />,
            title: translate("advantages.visibility.title"),
            description: translate("advantages.visibility.description"),
        },
        {
            icon: <Users className="h-5 w-5 text-blue-600" />,
            title: translate("advantages.customers.title"),
            description: translate("advantages.customers.description"),
        },
        {
            icon: <TrendingUp className="h-5 w-5 text-blue-600" />,
            title: translate("advantages.analytics.title"),
            description: translate("advantages.analytics.description"),
        },
        {
            icon: <Shield className="h-5 w-5 text-blue-600" />,
            title: translate("advantages.security.title"),
            description: translate("advantages.security.description"),
        },
    ];


    return (
        <motion.div
            ref={agencyRef}
            initial="hidden"
            animate={agencyInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="py-20 bg-primary relative agency-section text-base-color"
        >
            <div className="container z-10">
                <motion.div variants={fadeInUp} className="text-center mb-16">
                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-base-color">{translate("title")}</h2>
                    <p className="text-xl text-white max-w-3xl mx-auto">
                        {translate("slogan")}
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center text-white">
                    <motion.div variants={fadeInLeft} className="order-2 md:order-1">
                        <div className="space-y-6">
                            {features.map((feature, index) => (
                                <FeatureItem key={index} {...feature} />
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInRight} className="order-1 md:order-2">
                        <div className="p-8 rounded-lg">
                            <h3 className="text-3xl font-extrabold mb-6 text-center">{translate("exclusiveBenefits")}</h3>
                            <div className="space-y-12">
                                {advantages.map((advantage, index) => (
                                    <AdvantageItem key={index} {...advantage} />
                                ))}
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    )
}
