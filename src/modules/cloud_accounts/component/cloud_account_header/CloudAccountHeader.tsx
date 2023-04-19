import { CImage } from '@coreui/react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';

const CloudAccountHeader = () => {
    const { t } = useTranslation();
    return (
        <div className="d-flex justify-content-between">
            <div>
                <CImage
                    src={require('assets/images/Cloud_Settings.png')}
                    style={{ height: '69px', width: '69px', position: 'absolute', marginLeft: '-80px' }}
                />
                <div>
                    <h1>{t('welcome')}</h1>
                    <h4>{t('free_heading')}</h4>
                </div>
            </div>
        </div>
    );
};

export default CloudAccountHeader;

CloudAccountHeader.defaultProps = {
    enableNext: false,
    onClickNext: () => null,
    isLoading: false,
};
