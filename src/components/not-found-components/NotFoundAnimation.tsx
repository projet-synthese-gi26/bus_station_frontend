import {JSX} from "react";
import {motion} from "framer-motion";
import {MapPin} from "lucide-react";
import {cloudVariants, pathVariants, planeVariants} from "@/lib/animations/animationTool";

export default function NotFoundAnimation(): JSX.Element {


    return (
        <motion.div
        className="w-full h-64 md:h-80 mb-8 relative"
        initial={{opacity: 0}}
        animate={{opacity: 1}}
        transition={{duration: 0.5}}
        >
            {/* Background Elements */}
            <motion.svg viewBox="0 0 800 300" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                {/* Clouds */}
                <motion.g variants={cloudVariants}>
                    <path
                        d="M170,100 Q190,60 220,90 Q240,60 270,80 Q290,70 300,90 Q330,80 340,100 Q360,90 370,110 Q350,130 320,120 Q310,140 280,130 Q260,150 230,130 Q210,140 190,120 Q170,130 170,100"
                        fill="#E6F0FF"
                        stroke="#D1E3FF"
                        strokeWidth="2"
                    />
                </motion.g>

                <motion.g variants={cloudVariants}>
                    <path
                        d="M570,70 Q590,30 620,60 Q640,30 670,50 Q690,40 700,60 Q730,50 740,70 Q760,60 770,80 Q750,100 720,90 Q710,110 680,100 Q660,120 630,100 Q610,110 590,90 Q570,100 570,70"
                        fill="#E6F0FF"
                        stroke="#D1E3FF"
                        strokeWidth="2"
                    />
                </motion.g>

                {/* Path/Road */}
                <motion.path
                    d="M100,280 C200,250 300,290 400,240 C500,190 600,220 700,200"
                    fill="none"
                    stroke="#2563EB"
                    strokeWidth="4"
                    strokeDasharray="8 4"
                    variants={pathVariants}
                />

                {/* 404 Text */}
                <motion.text
                    x="400"
                    y="150"
                    textAnchor="middle"
                    fontSize="80"
                    fontWeight="bold"
                    fill="#2563EB"
                    initial={{opacity: 0, scale: 0.5}}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        transition: {
                            duration: 0.8,
                            ease: "easeOut",
                        },
                    }}
                >
                    404
                </motion.text>

                {/* Airplane */}
                <motion.g variants={planeVariants} whileHover="hover">
                    <path d="M650,120 L670,110 L680,120 L670,130 Z" fill="#2563EB"/>
                    <path d="M655,120 L640,115 L630,120 L640,125 Z" fill="#2563EB"/>
                    <path d="M650,110 L650,130" stroke="#2563EB" strokeWidth="1"/>
                </motion.g>
            </motion.svg>

            {/* Pin Drop Animation */}
            <motion.div
                // variants={pinVariants}
                className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2"
                initial="initial"
                animate="animate"

            >
                <MapPin size={48} className="text-red-500 drop-shadow-md"/>
            </motion.div>
    </motion.div>)
}