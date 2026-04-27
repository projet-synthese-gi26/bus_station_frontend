'use client';

import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationEN from '@/translations/en/global.json';
import translationFR from '@/translations/fr/global.json';

const resources = {
    en: { global: translationEN },
    fr: { global: translationFR },
};

i18next.use(initReactI18next)
    .init({
        resources,
        fallbackLng: 'en',
        interpolation: {escapeValue: false},
        lng: 'en',
        ns: ['global'],
        defaultNS: 'global',
        react: {
            useSuspense: false,
        },
    }).then(() => {});

export default i18next;
