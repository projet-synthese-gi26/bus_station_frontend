"use client"

import { motion } from "framer-motion"
import {JSX} from "react"
import NotFoundAnimation from "@/components/not-found-components/NotFoundAnimation";
import {containerVariants} from "@/lib/animations/animationTool";
import TextContent from "@/components/not-found-components/TextContent";
import ActionButton from "@/components/not-found-components/ActionButton";
import {useTranslation} from "react-i18next";



export default function NotFound(): JSX.Element {

    const {t} = useTranslation();
    return (
        <div
            className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-4">
            <motion.div
                className="max-w-3xl w-full text-center"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <NotFoundAnimation/>
                <TextContent t={t}/>
                <ActionButton t={t}/>
            </motion.div>
        </div>
    )
}
