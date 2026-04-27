import {JSX} from "react";
import {motion} from "framer-motion";
import {itemVariants} from "@/lib/animations/animationTool";
import Link from "next/link";
import {ArrowLeft, Compass, Home} from "lucide-react";
import {TranslationProps} from "@/lib/types/common";



export default function ActionButton({t}: TranslationProps): JSX.Element
{
    return (
        <div>
            <motion.div className="flex flex-col md:flex-row gap-4 justify-center" variants={itemVariants}>
                <Link href="/public">
                    <motion.button
                        className="cursor-pointer px-6 py-3 bg-primary text-white font-bold rounded-2xl hover:bg-blue-700 transition-colors duration-500 flex items-center justify-center gap-2"
                        whileHover={{scale: 1.05}}
                        whileTap={{scale: 0.95}}
                    >
                        <Home size={18}/>
                        {t("notFound.backToHome")}
                    </motion.button>
                </Link>

                <button
                    onClick={() => window.history.back()}
                    className="cursor-pointer px-6 py-3 border border-blue-600 text-blue-600 font-bold rounded-2xl hover:bg-blue-50 transition-colors duration-500 flex items-center justify-center gap-2"
                >
                    <ArrowLeft size={18}/>
                    {t("notFound.goBack")}
                </button>
            </motion.div>

            {/*Animated Compass */}
            <motion.div className="mt-12 flex justify-center" variants={itemVariants}>
                <motion.div
                    animate={{
                        rotate: 360,
                        transition: {
                            duration: 20,
                            ease: "linear",
                            repeat: Number.POSITIVE_INFINITY,
                        },
                    }}
                >
                    <Compass size={40} className="text-blue-600 opacity-70"/>
                </motion.div>
            </motion.div>
        </div>
    )
}