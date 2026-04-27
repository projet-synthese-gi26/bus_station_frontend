"use client";


import {JSX} from "react";
import {motion} from "framer-motion";
import {fadeInLeft, fadeInRight, fadeInUp, staggerContainer} from "@/lib/animations/animationTool";
import Image from "next/image";
import {useInView} from "react-intersection-observer";

export default function SecuritySection(): JSX.Element
{

    const [securityRef, securityInView] = useInView({
        triggerOnce: false,
        threshold: 0.1,
    })


    return (
        <motion.div
            ref={securityRef}
            initial="hidden"
            animate={securityInView ? "visible" : "hidden"}
            variants={fadeInUp}
            className="py-20 bg-gray-200 relative mt-[-1px]"
        >
            <div className="container mx-auto px-4 md:px-6">
                <div className="flex flex-col md:flex-row items-center">
                    <motion.div variants={fadeInLeft} className="md:w-1/2 mb-10 md:mb-0">
                        <div className="relative h-[400px] w-full rounded-lg overflow-hidden shadow-lg">
                            <Image
                                src="/placeholder.svg?height=400&width=600"
                                alt="Sécurité Bus Station"
                                fill
                                className="object-cover"
                            />
                        </div>
                    </motion.div>
                    <motion.div variants={fadeInRight} className="md:w-1/2 md:pl-12">
                        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-900">Sécurité et fiabilité
                            garanties</h2>
                        <p className="text-lg mb-6 text-gray-700">
                            Chez Bus Station, nous prenons la sécurité très au sérieux. Notre plateforme est conçue avec
                            les plus
                            hauts standards de sécurité pour protéger vos données et vos transactions.
                        </p>

                        <motion.ul variants={staggerContainer} className="space-y-4">
                            <motion.li variants={fadeInUp} className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-gray-700">Paiements sécurisés via Orange Money et Mobile Money</p>
                            </motion.li>
                            <motion.li variants={fadeInUp} className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-gray-700">Protection des données personnelles</p>
                            </motion.li>
                            <motion.li variants={fadeInUp} className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-gray-700">Vérification des agences de voyages</p>
                            </motion.li>
                            <motion.li variants={fadeInUp} className="flex items-start">
                                <div className="mr-4 mt-1">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        className="h-6 w-6 text-blue-600"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                                        />
                                    </svg>
                                </div>
                                <p className="text-gray-700">Système d&#39;avis transparent et fiable</p>
                            </motion.li>
                        </motion.ul>
                    </motion.div>
                </div>
            </div>

            {/* Séparateur triangulaire */}
            <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 1200 120"
                    preserveAspectRatio="none"
                    className="relative block w-full h-[60px]"
                >
                    <path d="M598.97 114.72L0 0 0 120 1200 120 1200 0 598.97 114.72z" fill="#ffffff"></path>
                </svg>
            </div>
        </motion.div>
    )
}