import {SupportedLanguage} from "@/lib/types/common";
import { useState} from "react";
import {changeLanguage} from "@/lib/services/i18n-services/languageService";

export  type LanguageType = {
    code: SupportedLanguage,
    name: string,
    flag:string
}



export function useLanguage()
{

    const languages: LanguageType[] = [
        { code: 'fr', name: 'Français', flag: '🇫🇷' },
        { code: 'en', name: 'English', flag: '🇺🇸' },
    ];
    const currentLang = localStorage.getItem("language") as SupportedLanguage;
    const initialLanguage = languages.find((lang) => lang.code === currentLang) || languages[0];
    const [currentLanguage, setCurrentLanguage] = useState<LanguageType>(initialLanguage);
    const [isLanguageOpen, setIsLanguageOpen] = useState(false);




    function handleLanguageChange  (language: LanguageType)
    {
        changeLanguage(language.code);
        setCurrentLanguage(language);
        setIsLanguageOpen(false);
        console.log('Language changed to:', language.code);
    }



    return {
        currentLanguage,
        setCurrentLanguage,
        languages,
        handleLanguageChange,
        isLanguageOpen,
        setIsLanguageOpen
    }
}