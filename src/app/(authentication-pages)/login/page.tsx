"use client"

import React, { JSX } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Lock, User } from "lucide-react";
import { useNavigation } from "@/lib/hooks/useNavigation";
import AnimateCircle from "@/ui/AnimateCircle";
import InputField from "@/ui/InputField";
import SocialConnexionButton from "@/components/authentication-pages-components/SocialConnexionButton";
import { useBusStation } from "@/context/Provider";
import TransparentModal from "@/modals/TransparentModal";
import Loader from "@/modals/Loader";
import LanguageSwitch from "@/components/authentication-pages-components/LanguageSwitch";
import { SupportedLanguage } from "@/lib/types/common";
import { useTranslation } from "react-i18next";
import { changeLanguage } from "@/lib/services/i18n-services/languageService";
import { useRouter } from "next/navigation";
import { LoginSchemaType } from "@/lib/types/schema/loginSchema";

export default function LoginPage(): JSX.Element {
    const { login, axiosErrors, isLoading, ...zodParams } = useBusStation();
    const navigation = useNavigation();
    const router = useRouter();
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [t, i18n] = useTranslation(); // Corrigé : _t pour variable non utilisée

    function updateLangage() {
        if (i18n.language === "fr") {
            changeLanguage("en");
        } else {
            changeLanguage("fr");
        }
    }

    const handleLoginSubmit = async (data: LoginSchemaType) => {
        const userRoles = await login(data);
        if (userRoles) {
            if  (userRoles.includes("ORGANISATION") || userRoles.includes("AGENCE_VOYAGE")) {
                navigation.onGoToDashboard();
            } else if (userRoles.includes("USAGER")) {
                navigation.onGoToMarketPlace();
            } else {
                router.push('/');
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white flex flex-col justify-center items-center p-4 md:p-8">
            <AnimateCircle />
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden"
            >
                <div onClick={navigation.goToHome} className="cursor-pointer bg-blue-600 p-6 text-white text-center">
                    <div className="flex justify-center mb-4">
                        <div className="bg-white w-12 h-12 rounded-lg flex items-center justify-center">
                            <span className="font-bold text-2xl text-blue-600">B</span>
                        </div>
                    </div>
                    <h1 className="text-2xl font-bold">Login to Bus Station</h1>
                    <p className="text-blue-100 mt-2">Accédez à votre espace personnel</p>
                </div>
                <div className="flex justify-end mr-6 mt-4">
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <LanguageSwitch language={i18n.language as SupportedLanguage} onToggle={updateLangage} />
                    </motion.div>
                </div>
                {axiosErrors && <p className="text-sm text-red-500 font-semibold m-2 text-center">{axiosErrors}</p>}
                <div className="p-6 md:p-8">
                    {isLoading && (
                        <TransparentModal isOpen={isLoading}>
                            <Loader />
                        </TransparentModal>
                    )}
                    <form onSubmit={zodParams.handleSubmit(handleLoginSubmit)}>
                        <div className="space-y-6 ">
                            <InputField
                                id={"username"}
                                label={"Username"}
                                placeholder={"Enter your username here"}
                                icon={<User className="h-5 w-5 text-gray-400" />}
                                register={zodParams.register("username")}
                                error={zodParams.errors.username?.message}
                            />
                            <InputField
                                id={"password"}
                                label={"Password"}
                                placeholder={"Enter your password here"}
                                icon={<Lock className="h-5 w-5 text-gray-400" />}
                                register={zodParams.register("password")}
                                error={zodParams.errors.password?.message}
                            />
                            <div className="flex items-center justify-end mb-6">
                                <div className="text-sm">
                                    <Link href="/forgot-password" className="text-blue-600 hover:text-blue-800 font-medium">
                                        Forgotten password ?
                                    </Link>
                                </div>
                            </div>
                        </div>
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full bg-primary text-base-color py-3 px-4 rounded-lg font-semibold cursor-pointer hover:bg-blue-700 transition-colors flex items-center justify-center"
                            disabled={isLoading}
                        >
                            {isLoading ? "Connexion..." : "Login"}
                        </motion.button>
                    </form>
                    <div className="mt-8 text-center">
                        <p className="text-gray-600">
                            You don&#39;t have an account yet ?{" "}
                            <Link href="/register" className="text-blue-600 hover:text-blue-800 font-medium">
                                Register
                            </Link>
                        </p>
                    </div>
                    <SocialConnexionButton />
                </div>
            </motion.div>
            <p className="mt-8 text-center text-gray-500 text-sm">
                © {new Date().getFullYear()} Bus Station. Tous droits réservés.
            </p>
        </div>
    );
}