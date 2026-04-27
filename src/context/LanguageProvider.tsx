'use client';

import React, {JSX, useEffect, useState} from 'react';
import { I18nextProvider } from 'react-i18next';
import i18next from '@/lib/services/i18n-services/i18nService';
import Loading from "@/app/loading";
import {ReactNodeProps} from "@/lib/types/common";




export default function LanguageProvider({ children }: ReactNodeProps): JSX.Element {

    const [isLoaded, setIsLoaded] = useState<boolean>(false);

    useEffect(() => {
        const savedLang = localStorage.getItem('language') || 'en';
        i18next.changeLanguage(savedLang).then(() => {
            setIsLoaded(true);
        });
    }, []);

    if (!isLoaded) return <Loading/>;
    return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
}
