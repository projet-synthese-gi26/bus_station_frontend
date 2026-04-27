import React, {JSX} from "react";
import {motion} from "framer-motion";
import {FaArrowLeft, FaExclamationTriangle} from "react-icons/fa";
import {IoReload} from "react-icons/io5";

export default function TripDetailsLoadingError(): JSX.Element
{
    return (
        <>
            <div className="min-h-screen flex flex-col items-center justify-center text-center p-2">
                {/* Icône animée */}
                <motion.div
                    initial={{y: -10}}
                    animate={{y: 0}}
                    transition={{repeat: Infinity, repeatType: "reverse", duration: 0.6}}
                    className="text-red-500 text-8xl mb-4"
                >
                    <FaExclamationTriangle/>
                </motion.div>

                <h2 className="text-2xl font-bold text-red-600 mb-2">Oups ! Une erreur est survenue</h2>
                <p className="text-gray-600 max-w-md mb-6">
                    Impossible de charger les détails du voyage. Il se peut que le serveur ne réponde pas ou que le
                    voyage n’existe plus. Si le probleme persiste veuillez contacter le service d'assistance par mail: support@busstation-assistance.com ou au 690988778
                </p>

                <div className="flex gap-2">
                    <button
                        onClick={() => window.location.reload()}
                        className="inline-flex items-center gap-2 bg-primary text-white px-5 py-2 rounded-full hover:bg-blue-700 transition-all duration-300 cursor-pointer shadow-md"
                    >
                        <IoReload/>
                        Retry !
                    </button>

                    <button
                        onClick={() => window.history.back()}
                        className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2 rounded-full hover:bg-red-700 transition-all  cursor-pointer shadow-md"
                    >
                        <FaArrowLeft/>
                        Retour aux voyages
                    </button>
                </div>
            </div>
        </>
    )
}