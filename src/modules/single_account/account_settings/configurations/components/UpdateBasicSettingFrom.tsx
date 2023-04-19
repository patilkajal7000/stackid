import UserCredential from 'modules/cloud_accounts/add_cloud_account/account_type/aws/user_credential/UserCredential';
import UserRole from 'modules/cloud_accounts/add_cloud_account/account_type/aws/user_role/UserRole';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import AuthButton from 'shared/components/buttons/AuthButton';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import useInput from 'shared/hooks/use-input';
import { AccountConfig, BasicCofigPayload, ConfigType } from 'shared/models/CloudAccountModel';
import { emptyStringValidation } from 'shared/service/ValidationService';
import 'translation/i18n';

type UpdateBasicSettingFromProps = {
    config: AccountConfig;
    onUpdate: (accountConfig: AccountConfig | BasicCofigPayload) => void;
    isLoading: boolean;
    cloudProvider: 'AWS' | 'GCP';
};
const UpdateBasicSettingFrom = (props: UpdateBasicSettingFromProps) => {
    const [, setIsUpdateClicked] = useState(false);
    const [enableUpdateButton, setEnableUpdateButton] = useState<boolean>(false);
    const [assumRoleArn, setAssumeRoleArn] = useState<any>();
    const [assumeRoleUpdated, setAssumeRoleUpdated] = useState<boolean>(false);
    const [accessKeyId, setAccessKeyId] = useState<any>('');
    const [secretaccesskey, setSecretaccesskey] = useState<any>('');
    const [passwordUpdateButton, setPasswordUpdateButton] = useState<boolean>(false);
    const [scanningInterval, setScanningInterval] = useState<string>(`${props?.config?.config_value}`);
    const { t } = useTranslation();

    const { hasError: scanningIntervalHasError, inputBlurHandler: scanningIntervalBlurHandler } =
        useInput(emptyStringValidation);

    useEffect(() => {
        if (props.config.config_name == ConfigType.SCANNING_INTERVAL && scanningInterval) {
            setEnableUpdateButton(true);
        }
    }, [scanningInterval]);

    const onConfirmUpdate = (event: any) => {
        event.preventDefault();
        setIsUpdateClicked(true);
        if (props.config.config_name == ConfigType.SCANNING_INTERVAL && scanningInterval) {
            const scanningIntervalInMin = +scanningInterval * 60;
            const updatedConfig: BasicCofigPayload = { discovery_interval: scanningIntervalInMin };
            props.onUpdate(updatedConfig);
        }
        if (passwordUpdateButton) {
            if (props.cloudProvider && accessKeyId && secretaccesskey) {
                const updatedConfig: BasicCofigPayload = {
                    cloud_provider: props.cloudProvider,
                    connection_details: {
                        accesskeyid: accessKeyId,
                        secretaccesskey: secretaccesskey,
                    },
                };
                props.onUpdate(updatedConfig);
            }
        }
        if (assumeRoleUpdated) {
            if (assumRoleArn) {
                const updatedConfig: BasicCofigPayload = {
                    cloud_provider: props.cloudProvider,
                    connection_details: assumRoleArn,
                };
                props.onUpdate(updatedConfig);
            }
        }
    };

    const updateSecretAccessKey = (accessKeyId: string | null, secretAccessKey: string | null) => {
        setAccessKeyId(accessKeyId);
        setSecretaccesskey(secretAccessKey);
        setEnableUpdateButton(false);
        setPasswordUpdateButton(true);
        if (props.cloudProvider && accessKeyId && secretAccessKey) {
            // const updatedConfig: BasicCofigPayload = {
            //     cloud_provider: props.cloudProvider,
            //     connection_details: {
            //         accesskeyid: accessKeyId,
            //         secretaccesskey: secretAccessKey,
            //     },
            // };
            setEnableUpdateButton(true);
            // props.onUpdate(updatedConfig);
            // enableUpdateButton ? props.onUpdate(updatedConfig) : null;
        }
    };

    // const isFormValid = (callback: () => void) => {
    //     const val = callback();
    //     if (val != null && val) {
    //         setEnableUpdateButton(true);
    //     } else {
    //         setEnableUpdateButton(false);
    //     }
    // };
    const updateAssumeRoleArn = (role: string | null) => {
        setAssumeRoleUpdated(true);
        if (role) {
            setAssumeRoleArn({ assume_role: role });
            setEnableUpdateButton(true);
        } else {
            setAssumeRoleArn(null);
        }
    };

    return (
        <form onSubmit={onConfirmUpdate}>
            {props.config.config_name == ConfigType.SECRET_ACCESS_KEY && (
                <UserCredential translate={t} setValues={updateSecretAccessKey} />
            )}

            {props.config.config_name == 'ASSUME_ROLE' && (
                <UserRole translate={t} setValues={updateAssumeRoleArn} previousAssumeRoleArn={''} />
            )}

            {props.config.config_name == ConfigType.SCANNING_INTERVAL && (
                <CustomInputWithLabel
                //key
                    autoComplete="scanningInterval"
                    value={scanningInterval}
                    onChange={setScanningInterval}
                    placeHolder={t('SCANNING_INTERVAL')}
                    hasError={scanningIntervalHasError}
                    onBlur={scanningIntervalBlurHandler}
                    errorMessage={t('required') + ''}
                    label={'*' + t('SCANNING_INTERVAL')}
                    customClass={'mb-2'}
                    customDropdownClass={'md-label'}
                    isDropdown
                    dropdownValues={['8', '16', '24']}
                />
            )}

            <div className="d-flex justify-content-center align-items-center mx-5 mt-5" data-si-qa-key={`configuration-update-basic-settings`}>
                <AuthButton
                    title={t('update')}
                    buttonType="md"
                    onClick={onConfirmUpdate}
                    isLoading={props.isLoading}
                    enable={enableUpdateButton}
                />
            </div>
        </form>
    );
};

export default UpdateBasicSettingFrom;
