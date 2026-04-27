import {JSX} from "react";
import {motion} from "framer-motion";
import {itemVariants} from "@/lib/animations/animationTool";
import {TranslationProps} from "@/lib/types/common";






export default function TextContent({t}: TranslationProps): JSX.Element
{

    return (
        <div>
            <motion.h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4" variants={itemVariants}>
                 {t("notFound.title")}
            </motion.h1>

            <motion.p className="text-xl text-gray-600 mb-8 max-w-lg mx-auto" variants={itemVariants}>
                {t("notFound.slogan")}
            </motion.p>
        </div>
    )
}