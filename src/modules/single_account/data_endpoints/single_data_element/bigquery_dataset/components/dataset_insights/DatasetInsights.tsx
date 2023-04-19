import React from 'react';
import { useTranslation } from 'react-i18next';
import { CContainer, CImage } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTag } from '@coreui/icons';

type DatasetInsightsProps = {
    id: string;
    name: string;
    project_name: string;
    is_encrypted: string;
    is_public: string;
    tags: any;
};

const DatasetInsights = (props: DatasetInsightsProps) => {
    const { t } = useTranslation();

    return (
        <CContainer fluid className="shadow-7 p-3 mx-2">
            <CContainer>
                <div className="d-flex justify-content-between">
                    <div className="me-auto">
                        <div className="opacity-09">{props.name} </div>
                        <div className="h6 opacity-08">
                            {t('project_name')} : {props.project_name}
                        </div>
                    </div>
                    <div className="d-flex flex-row align-items-center justify-content-center">
                        {props.is_encrypted ? (
                            <div className="m-1 p-2  icon-bg-circle" title={t('encryption_enabled') + ''}>
                                <em className="icon icon-alert-danger icon-lock font-20" />
                            </div>
                        ) : (
                            <div
                                className="m-1 p-2 icon-bg-circle icon-danger"
                                title={t('encryption_not_enabled') + ''}
                            >
                                <em className="icon icon-alert-danger icon-unlock font-20" />
                            </div>
                        )}

                        {props.is_public ? (
                            <div className="mx-1 icon-bg-circle icon-danger" title={t('public') + ''}>
                                <CImage
                                    src={require('assets/images/visibility_on.svg')}
                                    style={{
                                        filter: 'invert(57%) sepia(76%) saturate(2618%) hue-rotate(314deg) brightness(102%) contrast(101%)',
                                    }}
                                />
                            </div>
                        ) : (
                            <div className="mx-1 icon-bg-circle" title={t('not_public') + ''}>
                                <CImage
                                    src={require('assets/images/visibility_off.svg')}
                                    style={{
                                        filter: 'invert(61%) sepia(18%) saturate(758%) hue-rotate(138deg) brightness(91%) contrast(87%)',
                                    }}
                                />
                            </div>
                        )}

                        {props.tags && Object.keys(props.tags).length > 1 ? (
                            <div
                                className="m-1 icon-bg-circle"
                                title={Object.keys(props.tags).length + t('tag_applied')}
                            >
                                <CIcon icon={cilTag} size="xl" className="tag-icon" />
                            </div>
                        ) : (
                            <div className="m-1 icon-bg-circle icon-danger" title={t('tags_not_found') + ''}>
                                <CImage
                                    src={require('assets/images/outline-label-off.svg')}
                                    width="24px"
                                    className="tag-icon"
                                    style={{
                                        filter: 'invert(57%) sepia(76%) saturate(2618%) hue-rotate(314deg) brightness(102%) contrast(101%)',
                                    }}
                                />
                            </div>
                        )}
                    </div>
                </div>
            </CContainer>
        </CContainer>
    );
};

export default DatasetInsights;
