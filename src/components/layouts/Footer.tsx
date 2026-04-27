"use client"

import React, { JSX, useState } from "react"
import Link from "next/link"
import {MapPin, Mail, Phone, Globe, ChevronDown, Clock,} from "lucide-react"
import {FiFacebook, FiInstagram, FiLinkedin, FiTwitter} from "react-icons/fi";
import {useTranslation} from "react-i18next";
import {changeLanguage} from "@/lib/services/i18n-services/languageService";
import {LinkListProps, SocialLinkProps} from "@/lib/types/ui";
import {SupportedLanguage} from "@/lib/types/common";




const FooterLink = ( linkList : LinkListProps) => (
    <li>
        <Link href={linkList.link} className="text-gray-400 hover:text-blue-400 transition-colors flex items-center">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-2"></span>
            {linkList.name}
        </Link>
    </li>
)



const SocialLink = ({ href, icon: Icon, color }: SocialLinkProps) => (
    <Link
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`bg-gray-800 ${color} w-10 h-10 rounded-full flex items-center justify-center transition-colors`}
    >
        <Icon size={18} />
    </Link>
)




export default function Footer(): JSX.Element {

    const [t, i18n] = useTranslation();
    const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState<boolean>(false);
    const languages: SupportedLanguage[] = ["fr", "en"]


    function updateLanguage(lang:SupportedLanguage):void
    {
        changeLanguage(lang);
        setIsLanguageMenuOpen(false);
    }

    function translate(key:string):string
    {
        return t("footer." + key);
    }

    const quickLinks = [
        {name: translate("trip"), link: "/market-place"},
        {name:translate("agency"), link:"/agency"},
        {name:translate("about-us"), link:"/about"},
        {name:translate("contact-us"), link:"/contact-us"},
    ];
    const legalLinks = [
        { name: translate("terms-and-condition"), link: "/term-and-conditions" },
        { name: translate("privacy-policy"), link: "/privacy-policy" },
        { name: translate("cookies"), link: "/cookies" },
        { name: translate("faq"), link: "/faq" },
    ];

    const socialMedia = [
        { href: "https://facebook.com", icon:  FiFacebook, color: "hover:bg-primary" },
        { href: "https://twitter.com", icon: FiTwitter, color: "hover:bg-primary" },
        { href: "https://instagram.com", icon: FiInstagram, color: "hover:bg-primary" },
        { href: "https://linkedin.com", icon: FiLinkedin, color: "hover:bg-primary" }
    ];

    const contactInfo = [
        { icon: MapPin, text: "BP 9878, 75001 Yaounde, Cameroon" },
        { icon: Mail, text: "contact@busstation.com", link: "mailto:contact@busstation.com" },
        { icon: Phone, text: "+237 6 98 45 67 89" },
        { icon: Clock, text: translate("schedule") }
    ];






    const LanguageOption = ({ lang }: { lang: SupportedLanguage }) => (
        <button onClick={()=> updateLanguage(lang)} className="block w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-gray-700 hover:text-white">
            {lang}
        </button>
    )

    return (
        <footer className="bg-gray-900 text-base-color py-20">
            <div className="container">
                {/* Haut du footer */}
                <div className="flex flex-col md:flex-row justify-between mb-12">
                    <div className="mb-8 md:mb-0 md:max-w-sm">
                        <div className="flex items-center mb-4">
                            <div className="bg-primary w-10 h-10 rounded-lg flex items-center justify-center mr-3">
                                <span className="font-bold text-xl">B</span>
                            </div>
                            <h2 className="text-2xl font-bold">Bus Station</h2>
                        </div>
                        <p className="text-gray-400 mb-6">
                            {translate("slogan")}
                        </p>

                        <div>
                            <h4 className="font-semibold mb-3 text-sm uppercase tracking-wider">{translate("followUs")}</h4>
                            <div className="flex space-x-4">
                                {socialMedia.map((s, i) => (
                                    <SocialLink key={i} {...s} />
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Colonnes de liens */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 md:ml-10">
                        <div>
                            <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">{translate("quickLink")}</h3>
                            <ul className="space-y-2">
                                {quickLinks.map((item, index) => <FooterLink key={index}   link={item.link} name={item.name}/>)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">{translate("legal")}</h3>
                            <ul className="space-y-2">
                                {legalLinks.map((item, index) => <FooterLink key={index}   link={item.link} name={item.name} />)}
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold mb-4 border-b border-gray-800 pb-2">{translate("contact")}</h3>
                            <ul className="space-y-3">
                                {contactInfo.map(({ icon: Icon, text, link }, i) => (
                                    <li key={i} className="flex items-start text-gray-400">
                                        <Icon className="h-5 w-5 mr-2 text-blue-500 flex-shrink-0 mt-0.5" />
                                        {link ? (
                                            <a href={link} className="hover:text-blue-400 transition-colors">{text}</a>
                                        ) : (
                                            <span>{text}</span>
                                        )}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bas du footer */}
                <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
                    <p className="text-gray-400 mb-4 md:mb-0">
                        &copy; {new Date().getFullYear()} {translate("allRight")}
                    </p>

                    {/* Sélecteur de langue */}
                    <div className="relative">
                        <button
                            onClick={() => setIsLanguageMenuOpen(!isLanguageMenuOpen)}
                            className="flex items-center text-gray-400 hover:text-white transition-colors px-3 py-2 rounded-md border border-gray-700 hover:border-gray-600"
                        >
                            <Globe className="h-4 w-4 mr-2" />
                            <span className="mr-1">{i18n.language}</span>
                            <ChevronDown className="h-3 w-3" />
                        </button>

                        {isLanguageMenuOpen && (
                            <div className="absolute right-0 bottom-full mb-2 w-40 bg-gray-800 border border-gray-700 rounded-md shadow-lg z-50">
                                <div className="py-1">
                                    {languages.map((lang, i) => (
                                        <LanguageOption  key={i} lang={lang} />
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </footer>
    )
}
