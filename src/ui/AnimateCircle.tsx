import React, {JSX} from "react";
import {motion} from "framer-motion";

export default function AnimateCircle(): JSX.Element
{
    return (
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
            <motion.div
                className="absolute top-20 left-[10%] w-64 h-64 rounded-full bg-blue-200 opacity-20"
                animate={{
                    y: [0, 20, 0],
                }}
                transition={{duration: 8, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut"}}
            />
            <motion.div
                className="absolute bottom-20 right-[10%] w-80 h-80 rounded-full bg-blue-300 opacity-10"
                animate={{
                    y: [0, -30, 0],
                }}
                transition={{duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut"}}
            />
        </div>
    )
}