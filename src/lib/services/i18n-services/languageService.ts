"use client";

import i18next from './i18nService';
import {SupportedLanguage} from "@/lib/types/common";




export function changeLanguage(lang: SupportedLanguage): void {
    i18next.changeLanguage(lang)
        .then(() => {
            console.log(`Langue changée en ${lang}`);
            localStorage.setItem('language', lang);
        })
        .catch((error) => {
            console.error("Erreur lors du changement de langue", error);
        });
}
