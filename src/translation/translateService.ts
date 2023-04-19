import { useTranslation } from 'react-i18next';
import 'translation/i18n';

export const translate = (text: string) => {
    const { t } = useTranslation();
    return t(text);
};
