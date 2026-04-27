"use client"

import type React from "react"

import { type JSX, useState } from "react"
import {motion} from "framer-motion"
import { useInView } from "react-intersection-observer"
import { DollarSign, MessageSquare, Star, Ticket, Shield, Layout } from "lucide-react"
import { fadeInLeft, fadeInRight, fadeInUp, staggerContainer } from "@/lib/animations/animationTool"
import {useTranslation} from "react-i18next";
import {useNavigation} from "@/lib/hooks/useNavigation";
import {FeatureCardProps} from "@/lib/types/ui";


function FeatureCard({icon: Icon, title, description, variants}: FeatureCardProps) {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            variants={variants}
            className="bg-gray-100 p-6 rounded-xl border border-gray-200 hover:border-blue-500 hover:shadow-lg hover:transform hover:-translate-y-4 transition-all duration-500"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="flex flex-col items-center text-center">
                <motion.div
                    className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4"
                    animate={isHovered ? {scale: 1.1, backgroundColor: "#dbeafe"} : {scale: 1}}
                    transition={{duration: 0.3}}
                >
                    <Icon className="h-8 w-8 text-blue-600" strokeWidth={isHovered ? 2.5 : 2}/>
                </motion.div>
                <motion.h3
                    className="text-xl font-bold mb-3 text-gray-900"
                    animate={isHovered ? {color: "#2563eb"} : {color: "#111827"}}
                    transition={{duration: 0.3}}
                >
                    {title}
                </motion.h3>
                <p className="text-gray-600">{description}</p>
            </div>
        </motion.div>
    )
}

export default function FeatureSection(): JSX.Element {

    const [featuresRef, featuresInView] = useInView({
        triggerOnce: false,
        threshold: 0.1,
    });

    const [t] = useTranslation();

    function translate(key: string): string
    {
        return t("landingPage.featureSection." + key);
    }

    const navigation = useNavigation();


    const features = [
        {
            icon: DollarSign,
            title: translate("financialManagementTitle"),
            description: translate("financialManagementDescription"),
            animation: fadeInLeft,
        },
        {
            icon: MessageSquare,
            title: translate("integratedChatTitle"),
            description: translate("integratedChatDescription"),
            animation: fadeInUp,
        },
        {
            icon: Star,
            title: translate("reviewSystemTitle"),
            description: translate("reviewSystemDescription"),
            animation: fadeInRight,
        },
        {
            icon: Ticket,
            title: translate("couponsAndPromotionsTitle"),
            description:translate("couponsAndPromotionsDescription"),
            animation: fadeInLeft,
        },
        {
            icon: Shield,
            title: translate("advancedSecurityTitle"),
            description:translate("advancedSecurityDescription"),
            animation: fadeInUp,
        },
        {
            icon: Layout,
            title: translate("intuitiveInterfaceTitle"),
            description: translate("intuitiveInterfaceDescription"),
            animation: fadeInRight,
        },
    ];

    return (
        <motion.div
            ref={featuresRef}
            initial="hidden"
            animate={featuresInView ? "visible" : "hidden"}
            variants={staggerContainer}
            className="relative bg-base-color text-white py-5"
        >
            <div className="container">
                <motion.h2 variants={fadeInUp}
                           className="text-3xl md:text-5xl font-bold text-center mb-16 text-gray-900">
                    {translate("title")}
                </motion.h2>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {features.map((feature, index) => (
                        <FeatureCard
                            key={index}
                            icon={feature.icon}
                            title={feature.title}
                            description={feature.description}
                            variants={feature.animation}
                        />
                    ))}
                </div>
            </div>

            <motion.div variants={fadeInUp} className="mt-12 text-center py-10">
                <button onClick={navigation.onGoToLogin}
                    className="px-8 py-4 bg-primary  text-base-color  font-bold rounded-3xl cursor-pointer hover:bg-start-color transition-all duration-500 animate-bounce">
                    {translate("exploreAllFeatureText")}
                </button>
            </motion.div>
        </motion.div>
    )
}



