import {ChevronDown} from "lucide-react";
import {LanguageType} from "@/lib/hooks/useLanguage";
import {useTranslation} from "react-i18next";


export interface LanguageSelectorComponentProps {
    isLanguageOpen: boolean,
    setIsLanguageOpen: (isLanguageOpen: boolean)=> void,
    currentLanguage: LanguageType,
    languages:LanguageType[],
    handleLanguageChange: (language: LanguageType)=>void
}

export default function LanguageSelector({isLanguageOpen, setIsLanguageOpen, currentLanguage, languages, handleLanguageChange}: LanguageSelectorComponentProps)
{
    const {i18n} = useTranslation();
    return (
        <div className="relative">
            <button
                className="flex items-center gap-2 p-2 bg-blue-200 cursor-pointer rounded-lg transition-colors duration-200 group"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
            >
                <span className="hidden sm:flex items-center gap-1 text-sm font-medium text-gray-700">
                    <span className="text-base">{i18n.language === "fr" ? '🇫🇷' : '🇺🇸'}</span>
                    <span className="hidden md:block">{i18n.language}</span>
                    <ChevronDown className="h-3 w-3 text-gray-500"/>
                </span>
            </button>

            {/* Language Dropdown */}
            {isLanguageOpen && (
                <div
                    className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
                    {languages.map((language) => (
                        <button
                            key={language.code}
                            className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${currentLanguage.code === language.code ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700'}`}
                            onClick={() => handleLanguageChange(language)}
                        >
                            <span className="text-lg">{language.flag}</span>
                            <span>{language.name}</span>
                            {currentLanguage.code === language.code && (<div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>)}
                        </button>
                    ))}
                </div>
            )}
        </div>
    )
}