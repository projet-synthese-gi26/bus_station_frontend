import {JSX} from "react";
import {motion} from "framer-motion";
import {useTranslation} from "react-i18next";

export default function LoadingText(): JSX.Element
{
    const {t} = useTranslation();
    return (
        <div className="text-center">
            <p className="text-blue-600 font-medium text-lg mb-2">{t("loadingPage.loadingText")}</p>
            <div className="flex justify-center items-center space-x-1">
                <motion.div
                    className="w-2 h-2 bg-blue-600 rounded-full"
                    initial={{opacity: 0.3}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0}}
                />
                <motion.div
                    className="w-2 h-2 bg-blue-600 rounded-full"
                    initial={{opacity: 0.3}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.2}}
                />
                <motion.div
                    className="w-2 h-2 bg-blue-600 rounded-full"
                    initial={{opacity: 0.3}}
                    animate={{opacity: 1}}
                    transition={{duration: 0.6, repeat: Number.POSITIVE_INFINITY, repeatType: "reverse", delay: 0.4}}
                />
            </div>
        </div>


    )
}