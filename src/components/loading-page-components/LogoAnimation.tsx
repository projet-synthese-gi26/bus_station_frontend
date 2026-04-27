import {JSX} from "react";
import {motion} from "framer-motion";

export default function LogoAnimation(): JSX.Element
{
    return (
        <motion.div
            className="flex justify-center items-center mb-8"
            initial={{scale: 0.8, opacity: 0}}
            animate={{scale: 1, opacity: 1}}
            transition={{duration: 0.8, ease: "easeOut"}}
        >
            <div className="relative h-16 w-16 mr-2 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white text-2xl font-bold">B</span>
            </div>
            <span className="text-3xl font-bold text-blue-600">Bus Station</span>
        </motion.div>
    )
}