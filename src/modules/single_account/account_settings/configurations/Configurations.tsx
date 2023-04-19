import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Skeleton from 'react-loading-skeleton';
import { AccountConfig, ConfigType } from 'shared/models/CloudAccountModel';
import 'translation/i18n';

type ConfigurationsProps = {
    configData: AccountConfig[];
    onUpdate: (accountConfig: AccountConfig, tableTyle: 'advance' | 'basic') => void;
    onDelete?: (accountConfig: AccountConfig) => void;
    isLoading: boolean;
    tableType: 'advance' | 'basic';
};

const Configurations = (props: ConfigurationsProps) => {
    const [configurations, setConfigurations] = useState<AccountConfig[]>([]);
    const { t } = useTranslation();

    useEffect(() => {
        setConfigurations(props.configData);
    }, [props.configData]);

    const getConfigValue = (configValue: any, configName: string) => {
        if (configValue == null) {
            return <div className="mt-1">********</div>;
        } else if (configValue && typeof configValue == 'object') {
            if (configName == ConfigType.LOG_GROUP_DETAILS) {
                return configValue?.log_group_name || '-';
            } else if (configName == ConfigType.APP_NAME_TAG_CONFIG) {
                return configValue?.key || '-';
            } else if (configName == ConfigType.DATA_CLASSIFICATION_TAG) {
                return configValue?.key || '-';
            } else if (configName == ConfigType.SLACK_WORKSPACE_NAME) {
                return configValue?.name || '-';
            } else if (configName == ConfigType.SLACK_WORKFLOW_WEB_HOOK) {
                return configValue?.url || '-';
            } else if (configName == ConfigType.SLACK_WEB_HOOK) {
                return configValue?.url || '-';
            } else if (configName == ConfigType.GCP_PUB_SUB) {
                return configValue?.pub_sub || '-';
            } else if (configName == ConfigType.GCP_TAG_KEY) {
                return configValue?.key || '-';
            } else if (configName == ConfigType.CLOUDTRAIL_S3_BUCKET) {
                return configValue?.bucket_name || '-';
            } else if (configName == ConfigType.JIRA_INTEGRATION) {
                return configValue?.email || '-';
            } else if (configName == ConfigType.PAGERDUTY_AUTH_INFO) {
                return configValue?.default_from || '-';
            } else if (configName == ConfigType.PAGERDUTY_SETTINGS) {
                return '-';
            } else if (configName == ConfigType.RISK_ASSESMENT_REPORT_CONFIGURATION) {
                return configValue?.email || '-';
            }

            return '-';
        }
        return configValue || '-';
    };

    return (
        <div>
            <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                <thead className="font-medium border-bottom">
                    <tr>
                        <th className="text-start ps-4 w-40">{t('name')}</th>
                        <th className="text-start w-40">{t('value')}</th>
                        <th className="text-start ps-3">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="font-small">
                    {props.isLoading ? (
                        <tr>
                            <td colSpan={3} className="w-20">
                                <Skeleton count={3} height={48} />
                            </td>
                        </tr>
                    ) : (
                        configurations.map((config: AccountConfig) => (
                            <tr key={'config_' + config.id}>
                                <td className="text-start ps-4 w-40"> {t(config.config_name)}</td>
                                <td className="text-start w-40">
                                    {getConfigValue(config.config_value, config.config_name)}
                                </td>
                                <td className="text-start pl-2p">
                                    <button
                                        data-si-qa-key={`configuration-actions-edit`}
                                        type="button"
                                        className="btn btn-custom btn-link"
                                        onClick={() => {
                                            props.onUpdate(config, props.tableType);
                                        }}
                                    >
                                        {t('edit')}
                                    </button>
                                    {props.onDelete && (
                                        <button
                                            data-si-qa-key={`configuration-actions-delete`}
                                            type="button"
                                            className="btn btn-custom btn-link"
                                            onClick={() => {
                                                props.onDelete && props.onDelete(config);
                                            }}
                                        >
                                            {t('delete')}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default Configurations;
