import {motion} from "framer-motion";
import {JSX} from "react";

export default function ProgressBar(): JSX.Element
{
    return (
        <div className="w-full bg-gray-200 rounded-full h-1.5 mt-6 overflow-hidden">
            <motion.div
                className="bg-primary h-full"
                initial={{width: "0%"}}
                animate={{width: "100%"}}
                transition={{duration: 10, ease: "easeInOut"}}
            />
        </div>
    )
}