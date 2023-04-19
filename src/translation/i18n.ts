import { changeLanguage, use } from 'i18next';
import { initReactI18next } from 'react-i18next';

import { TRANSLATIONS_EN } from './en/Translation';

use(initReactI18next).init({
    resources: {
        en: {
            translation: TRANSLATIONS_EN,
        },
    },
});

changeLanguage('en');
