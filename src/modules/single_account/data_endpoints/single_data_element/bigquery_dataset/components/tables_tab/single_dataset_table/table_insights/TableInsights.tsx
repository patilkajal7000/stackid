import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatasetTableInsights } from 'shared/models/BigQueryDatasetModels';
import { CContainer, CImage } from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilTag } from '@coreui/icons';

const TableInsights = (props: DatasetTableInsights) => {
    const { t } = useTranslation();

    return (
        <CContainer fluid className="shadow-7 p-3 mx-2">
            <CContainer>
                <div className="d-flex justify-content-between">
                    <div className="w-100">
                        <div className="opacity-09">{props.name} </div>
                        <div className="d-flex flex-row align-items-center justify-content-between">
                            <div className="h6 opacity-08">
                                {t('num_of_times_table_accessed')} : {props.num_of_times_table_accessed}
                            </div>
                            <div className="h6 opacity-08">
                                {t('num_of_times_exported')} : {props.num_of_times_exported}
                            </div>
                            <div className="h6 opacity-08">
                                {t('total_bytes_exported')} : {props.total_bytes_exported}
                            </div>
                            <div>
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
                                        />
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </CContainer>
        </CContainer>
    );
};

export default TableInsights;
