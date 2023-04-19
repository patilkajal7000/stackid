import BaseLayout from 'core/container/BaseLayout';
import {
    addCloudAccountConfig,
    deleteCloudAccountConfig,
    getCloudAccount,
    getCloudAccountConfigs,
    updateCloudAccount,
    updateCloudAccountConfig,
} from 'core/services/CloudaccountsAPIService';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import CustomModal from 'shared/components/custom_modal/CustomModal';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import {
    AccountConfig,
    BasicCofigPayload,
    CloudAccountModel,
    CloudAccountProvider,
} from 'shared/models/CloudAccountModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { SCREEN_NAME, ToastVariant } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { setTabsAction } from 'store/actions/TabsStateActions';
import 'translation/i18n';
import AddNewConfigForm from './configurations/components/AddNewConfigForm';
import Configurations from './configurations/Configurations';
import AuthButton from 'shared/components/buttons/AuthButton';
import UpdateBasicSettingFrom from './configurations/components/UpdateBasicSettingFrom';
import UpdateAdvanceSettingForm from './configurations/components/UpdateAdvanceSettingForm';
import { cilPlus } from '@coreui/icons';

import CIcon from '@coreui/icons-react';
import { CTooltip } from '@coreui/react';
const AccountSettings = () => {
    const [basicSettings, setBasicSettings] = useState<AccountConfig[]>([]);
    const [advanceSettings, setAdvanceSettings] = useState<AccountConfig[]>([]);
    const [selectedConfig, setSelectedConfig] = useState<AccountConfig>();
    const [selectedTableType, setSelectedTableType] = useState<'advance' | 'basic'>();
    const [cloudProvider, setCloudProvider] = useState<'AWS' | 'GCP'>();
    const [addModalshow, setAddModalshow] = useState(false);
    const [isAddConfigLoading, setIsAddConfigLoading] = useState(false);
    const [updateModalshow, setUpdateModalshow] = useState(false);
    const [isUpdateConfigLoading, setIsUpdateConfigLoading] = useState(false);
    const [deleteModalShow, setDeleteModalShow] = useState(false);
    const [isDeleteConfigLoading, setIsDeleteConfigLoading] = useState(false);

    const params = useParams<any>();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const type = params?.type ? params?.type : 'aws_S3';
    const cloudAccountType: string | any = (params && params?.cloudAccountType) || CloudAccountProvider.AWS;
    const dispatch = useDispatch();
    const { t } = useTranslation();

    useEffect(() => {
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                { name: 'Configurations', path: '' },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
        dispatch(setTabsAction(SCREEN_NAME.DATA_ENDPOINTS_SUMMARY, '', ''));

        fetchBasicSettings();
        fetchAdvancedSettings();
    }, []);

    const fetchAdvancedSettings = () => {
        setAdvanceSettings([]);
        getCloudAccountConfigs(cloudAccountId).then((response: any) => {
            if (response && response.configs && response.configs.length > 0) {
                setAdvanceSettings(response.configs);
            }
        });
    };

    const fetchBasicSettings = () => {
        getCloudAccount(cloudAccountId).then((response: any) => {
            const basicSettingsList = getBasicSettingsList(response);
            setBasicSettings(basicSettingsList);
            setCloudProvider(response?.cloud_provider);
        });
    };

    const getBasicSettingsList = (accountDetails: CloudAccountModel): AccountConfig[] => {
        const basicSettingsList: AccountConfig[] = [];
        if (accountDetails) {
            if (accountDetails.cloud_provider == 'AWS' && !accountDetails.assume_role_account) {
                const secretAccessKeyconfig: AccountConfig = {
                    id: -1,
                    config_name: 'SECRET_ACCESS_KEY',
                    config_value: null,
                };
                basicSettingsList.push(secretAccessKeyconfig);
            }
            if (accountDetails.assume_role_account) {
                const assumeRoleConfig: AccountConfig = {
                    id: -1,
                    config_name: 'ASSUME_ROLE',
                    config_value: null,
                };
                basicSettingsList.push(assumeRoleConfig);
            }

            if (accountDetails.discovery_interval) {
                const scanningIntervalConfig = {
                    id: -2,
                    config_name: 'SCANNING_INTERVAL',
                    config_value: accountDetails.discovery_interval / 60,
                };
                basicSettingsList.push(scanningIntervalConfig);
            }
        }
        return basicSettingsList;
    };

    const onUpdateConfig = (accountConfig: AccountConfig, tableTyle: 'advance' | 'basic') => {
        setSelectedConfig(accountConfig);
        setUpdateModalshow(true);
        setSelectedTableType(tableTyle);
    };

    const onConfirmUpdateConfig = (accountConfig: AccountConfig | BasicCofigPayload) => {
        setIsUpdateConfigLoading(true);
        if (selectedTableType == 'advance') {
            updateAdvancedConfig(accountConfig as AccountConfig);
        } else {
            updateBasicConfig(accountConfig as BasicCofigPayload);
        }
    };

    const updateAdvancedConfig = (accountConfig: AccountConfig) => {
        if (accountConfig) {
            const config = { config_name: accountConfig.config_name, config_value: accountConfig.config_value };
            updateCloudAccountConfig(cloudAccountId, accountConfig.id, config)
                .then((response: any) => {
                    if (response) {
                        const msg = t(accountConfig.config_name) + ' ' + t('updated_successfully');
                        dispatch(setToastMessageAction(ToastVariant.SUCCESS, msg));
                        setIsUpdateConfigLoading(false);
                        setUpdateModalshow(false);
                        fetchAdvancedSettings();
                    }
                })
                .catch(() => {
                    setIsUpdateConfigLoading(false);
                    setUpdateModalshow(false);
                });
        }
    };

    const updateBasicConfig = (accountConfig: BasicCofigPayload) => {
        if (accountConfig) {
            updateCloudAccount(cloudAccountId, accountConfig)
                .then((response: any) => {
                    if (response) {
                        dispatch(setToastMessageAction(ToastVariant.SUCCESS, response));
                        setIsUpdateConfigLoading(false);
                        setUpdateModalshow(false);
                        fetchBasicSettings();
                    }
                })
                .catch(() => {
                    setIsUpdateConfigLoading(false);
                    setUpdateModalshow(false);
                });
        }
    };

    const onDelete = (accountConfig: AccountConfig) => {
        setSelectedConfig(accountConfig);
        setDeleteModalShow(true);
    };

    const onConfirmDeleteConfig = (accountConfig: AccountConfig) => {
        if (accountConfig.id) {
            setIsDeleteConfigLoading(true);
            deleteCloudAccountConfig(cloudAccountId, accountConfig.id)
                .then((response: any) => {
                    if (response) {
                        const msg = t('successfully_deleted_config') + ' ' + t(accountConfig.config_name);
                        dispatch(setToastMessageAction(ToastVariant.SUCCESS, msg));
                        setIsDeleteConfigLoading(false);
                        setDeleteModalShow(false);
                        fetchAdvancedSettings();
                    }
                })
                .catch(() => {
                    setIsDeleteConfigLoading(false);
                    setDeleteModalShow(false);
                });
        }
    };

    const onAddNewConfig = () => {
        setAddModalshow(true);
    };

    const createNewConfig = (accountConfig: AccountConfig) => {
        if (accountConfig) {
            const config = { config_name: accountConfig.config_name, config_value: accountConfig.config_value };
            setIsAddConfigLoading(true);
            addCloudAccountConfig(cloudAccountId, config)
                .then((response: any) => {
                    if (response) {
                        const msg = t(accountConfig.config_name) + ' ' + t('added_successfully');
                        dispatch(setToastMessageAction(ToastVariant.SUCCESS, msg));
                        setIsAddConfigLoading(false);
                        setAddModalshow(false);
                        fetchAdvancedSettings();
                    }
                })
                .catch(() => {
                    setIsAddConfigLoading(false);
                });
        }
    };

    return (
        <BaseLayout>
            <div>
                <div className="h5 text-primary mt-2">{t('basic_settings')}</div>
                <div className="text-center mt-4">
                    <Configurations
                        configData={basicSettings}
                        isLoading={false}
                        onUpdate={onUpdateConfig}
                        tableType={'basic'}
                    />
                </div>
            </div>
            <div className="mt-3">
                <div className="d-flex justify-content-between mt-5">
                    <div className="h5 text-primary ">{t('advanced_settings')}</div>
                    <div>
                        <CTooltip trigger="hover" placement="bottom" content={t('add_new_config')}>
                            <button
                                data-si-qa-key={`configuration-add-config`}
                                type="button"
                                className="btn btn-custom-link ps-4 position-relative text-white"
                                onClick={onAddNewConfig}
                            >
                                <span className=" position-absolute ms--20 t-8">
                                    <CIcon icon={cilPlus} size="lg" />
                                </span>
                                {t('add_new_config')}
                            </button>
                        </CTooltip>
                    </div>
                </div>
                <div className="text-center mt-4">
                    <Configurations
                        configData={advanceSettings}
                        isLoading={false}
                        onUpdate={onUpdateConfig}
                        onDelete={onDelete}
                        tableType={'advance'}
                    />
                </div>
            </div>

            <CustomModal show={addModalshow} onHide={() => setAddModalshow(false)}>
                <div className="h1 mt-2 mb-4">{t('add_new_config')}</div>
                <AddNewConfigForm
                    data-si-qa-key={`configuration-add-new-config`}
                    onAdd={createNewConfig}
                    isLoading={isAddConfigLoading}
                    cloudAccountType={cloudAccountType}
                />
            </CustomModal>

            {selectedConfig && (
                <>
                    <CustomModal show={updateModalshow} onHide={() => setUpdateModalshow(false)}>
                        <div
                            className="h1 mt-2 mb-4"
                            data-si-qa-key={`configuration-update-config-settings-${selectedConfig?.id}`}
                        >
                            {t('update')} {t(selectedConfig?.config_name)}
                        </div>
                        {selectedTableType == 'basic' && cloudProvider && (
                            <UpdateBasicSettingFrom
                                config={selectedConfig}
                                onUpdate={onConfirmUpdateConfig}
                                isLoading={isUpdateConfigLoading}
                                cloudProvider={cloudProvider}
                            />
                        )}
                        {selectedTableType == 'advance' && (
                            <UpdateAdvanceSettingForm
                                config={selectedConfig}
                                onUpdate={onConfirmUpdateConfig}
                                isLoading={isUpdateConfigLoading}
                            />
                        )}
                    </CustomModal>

                    <CustomModal show={deleteModalShow} onHide={() => setDeleteModalShow(false)}>
                        <div className="d-flex flex-column">
                            <div className="h1">{t('sure_prompt')}</div>
                            <div className="h4 mt-2 mt-4">
                                {t('delete_sure_text')} {t('setting for')} : {t(selectedConfig?.config_name)}
                            </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-center mt-5">
                            <AuthButton
                                data-si-qa-key={`configuration-setting-cancel`}
                                title={t('cancel')}
                                buttonType="sm"
                                onClick={() => setDeleteModalShow(false)}
                                className="mx-1"
                            />
                            <AuthButton
                                data-si-qa-key={`configuration-setting-delete`}
                                title={t('delete')}
                                buttonType="sm"
                                onClick={() => onConfirmDeleteConfig(selectedConfig)}
                                className="mx-1"
                                isLoading={isDeleteConfigLoading}
                                type="secondary"
                            />
                        </div>
                    </CustomModal>
                </>
            )}
        </BaseLayout>
    );
};

export default AccountSettings;
