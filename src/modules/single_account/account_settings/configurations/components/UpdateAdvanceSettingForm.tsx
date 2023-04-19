import { useMutation, useQuery } from '@tanstack/react-query';
import { http_get } from 'core/services/BaseURLAxios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import AuthButton from 'shared/components/buttons/AuthButton';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import useInput from 'shared/hooks/use-input';
import { AccountConfig, ConfigType } from 'shared/models/CloudAccountModel';
import { emptyStringValidation, validateEmail } from 'shared/service/ValidationService';
import { AppState } from 'store/store';
import 'translation/i18n';
import { ToastVariant } from 'shared/utils/Constants';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { UpdateRiskConfig } from 'core/services/CloudaccountsAPIService';
const DEFAULT_INTERVAL = 1440;
type UpdateAdvanceSettingFormProps = {
    config: AccountConfig;
    onUpdate: (accountConfig: AccountConfig) => void;
    isLoading: boolean;
};

export function getPagerdutySettings(orgId: any, accountId: any): any {
    return useQuery({
        queryKey: [`allPagerdutySettings`, orgId, accountId],
        queryFn: async () => {
            const data: any = await http_get(
                'notifications/configure/org/' + orgId + '/account/' + accountId + '/pagerduty',
            );
            return data;
        },
        onError: (error) => {
            console.log('Fetching all pagerduty settings API Error: ', error);
        },
        enabled: false,
    });
}

const UpdateAdvanceSettingForm = (props: UpdateAdvanceSettingFormProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [bucketName, setBucketName] = useState('');
    const [region, setRegion] = useState('');
    const [path, setPath] = useState('');
    const [isOrganisationBucket, setIsOrganisationBucket] = useState(
        props?.config?.config_value?.is_organisation_bucket ? 'True' : 'False',
    );
    const [token, setToken] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [projectKey, setProjectKey] = useState('');
    const [instanceUrl, setInstanceUrl] = useState('');

    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId = userDetails?.org.organisation_id;
    const params = useParams<any>();
    const accountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;

    const {
        data: pagerdutySettings,
        isSuccess: isSuccess,
        isLoading: pagerdutySettingsLoading,
        isError: pagerdutySettingsError,
        refetch: refetchAllPagerdutySettings,
    } = getPagerdutySettings(orgId, accountId);

    const [service, setService] = useState(
        pagerdutySettings?.data?.services?.filter((setting: any) => {
            if (setting.id === props?.config?.config_value?.service) return setting?.name;
        })[0]?.name,
    );
    const [services, setServices] = useState<any[]>([]);

    const [escalation, setEscalation] = useState(
        pagerdutySettings?.data?.escalations?.filter((setting: any) => {
            if (setting.id === props?.config?.config_value?.escalation_policy) return setting?.summary;
        })[0]?.summary,
    );
    const [escalations, setEscalations] = useState<any[]>([]);

    const [priority, setPriority] = useState(
        pagerdutySettings?.data?.priorities?.filter((setting: any) => {
            if (setting.id === props?.config?.config_value?.priority) return setting?.summary;
        })[0]?.summary,
    );
    const [priorities, setPriorities] = useState<any[]>([]);
    const [interval, setInterval] = useState<any>('default');
    const {
        value: configValue,
        hasError: configValueHasError,
        valueChangeHandler: configValueChagehandler,
        inputBlurHandler: configValueBlurHandler,
        isValid: configValueIsValid,
        reset: resetConfigValue,
    } = useInput(emptyStringValidation);

    useEffect(() => {
        if (props?.config?.config_name === 'PAGERDUTY_SETTINGS') {
            refetchAllPagerdutySettings();
        }
        if (pagerdutySettings && !pagerdutySettingsLoading && isSuccess) {
            setEscalations([]);
            setPriorities([]);
            setServices([]);
            pagerdutySettings?.data?.escalations.map((setting: any) => {
                setEscalations((escalations: any) => [...escalations, setting?.summary]);
            });
            pagerdutySettings?.data?.priorities.map((setting: any) => {
                setPriorities((priorities: any) => [...priorities, setting?.summary]);
            });
            pagerdutySettings?.data?.services.map((setting: any) => {
                setServices((services: any) => [...services, setting?.name]);
            });
        } else if (pagerdutySettings && pagerdutySettingsError) {
            dispatch(setToastMessageAction(ToastVariant.DANGER, pagerdutySettingsError));
        }
    }, [props?.config?.config_name, pagerdutySettings]);

    const {
        value: email,
        hasError: emailIdHasError,
        valueChangeHandler: emailIdChangehandler,
        inputBlurHandler: emailIdBlurHandler,
    } = useInput(validateEmail);

    const {
        value: user,
        hasError: userIdHasError,
        valueChangeHandler: userIdChangehandler,
        inputBlurHandler: userIdBlurHandler,
    } = useInput(validateEmail);
    const {
        value: configEmail,
        hasError: emailconfigValueHasError,
        valueChangeHandler: emailconfigValueChagehandler,
        inputBlurHandler: emailconfigValueBlurHandler,
        isValid: emailconfigValueIsValid,
    } = useInput(validateEmail);
    const RiskUpdatemutation = useMutation({
        mutationFn: (body: any) => {
            return UpdateRiskConfig(body);
        },
        onSuccess: () => {
            const updatedConfig: AccountConfig = {
                id: props.config.id,
                config_name: props?.config?.config_name,
                config_value: {},
            };
            updatedConfig.config_value = {
                email: configEmail,
                interval: interval == 'default' ? DEFAULT_INTERVAL : interval * 60,
            };
            props.onUpdate(updatedConfig);

            dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'added risk assesment report update  successfully'));
        },
        onError: () => {
            const updatedConfig: AccountConfig = {
                id: props.config.id,
                config_name: props?.config?.config_name,
                config_value: {},
            };
            updatedConfig.config_value = {
                email: configEmail,
                interval: interval == 'default' ? DEFAULT_INTERVAL : interval * 60,
            };
            props.onUpdate(updatedConfig);
            dispatch(setToastMessageAction(ToastVariant.DANGER, 'Something went wrong'));
        },
    });
    const onConfirmUpdateUser = (event: any) => {
        event.preventDefault();
        const updatedConfig: AccountConfig = {
            id: props.config.id,
            config_name: props.config.config_name,
            config_value: {},
        };

        if (props?.config?.config_name === 'JIRA_INTEGRATION') {
            updatedConfig.config_value = {
                email: email !== '' ? email : props?.config?.config_value?.email,
                token: token !== '' ? token : props?.config?.config_value?.token,
                project_key: projectKey !== '' ? projectKey : props?.config?.config_value?.project_key,
                instance_url: instanceUrl !== '' ? instanceUrl : props?.config?.config_value?.instance_url,
            };
        }

        if (props?.config?.config_name === 'PAGERDUTY_AUTH_INFO') {
            updatedConfig.config_value = {
                default_from: user !== '' && user,
                api_key: apiKey !== '' && apiKey,
            };
        }
        if (props?.config?.config_name === 'RISK_ASSESMENT_REPORT_CONFIGURATION') {
            if (emailconfigValueIsValid && configEmail) {
                const body: any = {
                    cloud_account_id: accountId,
                    org_id: orgId,
                    job_type: 'risk_assesment_report',
                    job_config: { email: configEmail },
                    job_interval: interval == 'default' ? DEFAULT_INTERVAL : interval * 60,
                };
                RiskUpdatemutation.mutate(body);
                return;
            }
            return;
        }
        if (props?.config?.config_name === 'PAGERDUTY_SETTINGS') {
            if (pagerdutySettings) {
                let serviceId = '';
                let escalationId = '';
                let priorityId = '';
                pagerdutySettings?.data?.escalations.map((setting: any) => {
                    setEscalations((escalations: any) => [...escalations, setting?.summary]);
                    if (setting?.summary === escalation) escalationId = setting?.id;
                });
                pagerdutySettings?.data?.priorities.map((setting: any) => {
                    if (setting?.summary === priority) priorityId = setting?.id;
                });
                pagerdutySettings?.data?.services.map((setting: any) => {
                    if (setting?.name === service) serviceId = setting?.id;
                });
                updatedConfig.config_value = {
                    service: serviceId,
                    escalation_policy: escalationId,
                    priority: priorityId,
                };
            }
        }

        if (props?.config?.config_name === 'CLOUDTRAIL_S3_BUCKET') {
            updatedConfig.config_value = {
                bucket_name: bucketName !== '' ? bucketName : props?.config?.config_value?.bucket_name,
                region: region !== '' ? region : props?.config?.config_value?.region,
                path: path !== '' ? path : props?.config?.config_value?.path,
                is_organisation_bucket:
                    isOrganisationBucket !== ''
                        ? isOrganisationBucket === 'True'
                            ? true
                            : false
                        : props?.config?.config_value?.is_organisation_bucket,
            };
        }

        if (configValueIsValid && configValue) {
            switch (props.config.config_name) {
                case ConfigType.OKTA_IDP_CONFIG: {
                    updatedConfig.config_value = {
                        provider: 'Okta',
                        api_token: configValue,
                    };
                    break;
                }
                case ConfigType.LOG_GROUP_DETAILS: {
                    updatedConfig.config_value = {
                        log_group_name: configValue,
                        timestamp: Date.now(),
                    };
                    break;
                }
                case ConfigType.APP_NAME_TAG_CONFIG: {
                    updatedConfig.config_value = {
                        key: configValue,
                    };
                    break;
                }
                case ConfigType.SLACK_WORKSPACE_NAME: {
                    updatedConfig.config_value = {
                        name: configValue,
                    };
                    break;
                }
                case ConfigType.DATA_CLASSIFICATION_TAG: {
                    updatedConfig.config_value = {
                        key: configValue,
                    };
                    break;
                }
                case ConfigType.SLACK_WEB_HOOK: {
                    updatedConfig.config_value = {
                        url: configValue,
                    };
                    break;
                }
                case ConfigType.SLACK_WORKFLOW_WEB_HOOK: {
                    updatedConfig.config_value = {
                        url: configValue,
                    };
                    break;
                }
                case ConfigType.GCP_PUB_SUB: {
                    updatedConfig.config_value = {
                        pub_sub: configValue,
                    };
                    break;
                }
                case ConfigType.GCP_TAG_KEY: {
                    updatedConfig.config_value = {
                        key: configValue,
                    };
                    break;
                }
            }
        }
        props.onUpdate(updatedConfig);
        resetConfigValue();
    };

    const setPlaceholder = (configName: string) => {
        let placeholder = '-';
        switch (configName) {
            case ConfigType.OKTA_IDP_CONFIG: {
                placeholder = props?.config?.config_value?.api_token;
                break;
            }
            case ConfigType.LOG_GROUP_DETAILS: {
                placeholder = props?.config?.config_value?.log_group_name;
                break;
            }
            case ConfigType.SLACK_WEB_HOOK: {
                placeholder = props?.config?.config_value?.url;
                break;
            }
            case ConfigType.SLACK_WORKFLOW_WEB_HOOK: {
                placeholder = props?.config?.config_value?.url;
                break;
            }
            case ConfigType.RISK_ASSESMENT_REPORT_CONFIGURATION: {
                placeholder = props?.config?.config_value?.email;
                break;
            }
            case ConfigType.GCP_PUB_SUB: {
                placeholder = props?.config?.config_value?.pub_sub;
                break;
            }
            case ConfigType.SLACK_WORKSPACE_NAME: {
                placeholder = props?.config?.config_value?.name;
                break;
            }
            case ConfigType.APP_NAME_TAG_CONFIG: {
                placeholder = props?.config?.config_value?.key;
                break;
            }
            case ConfigType.DATA_CLASSIFICATION_TAG:
            case ConfigType.GCP_TAG_KEY: {
                placeholder = props?.config?.config_value?.key;
                break;
            }
        }
        return placeholder;
    };

    return (
        <form onSubmit={onConfirmUpdateUser}>
            {props?.config?.config_name === 'CLOUDTRAIL_S3_BUCKET' ? (
                <>
                    <CustomInputWithLabel
                        autoComplete="bucketName"
                        value={bucketName}
                        onChange={(event) => setBucketName(event)}
                        placeHolder={props?.config?.config_value?.bucket_name}
                        label={'*Bucket Name'}
                        customClass={'mb-2'}
                        customLabelClass={'md-label'}
                    />
                    <CustomInputWithLabel
                        autoComplete="region"
                        value={region}
                        onChange={(event) => setRegion(event)}
                        placeHolder={props?.config?.config_value?.region}
                        label={'*Region'}
                        customClass={'mb-2'}
                        customLabelClass={'md-label'}
                    />
                    <CustomInputWithLabel
                        autoComplete="path"
                        value={path}
                        onChange={(event) => setPath(event)}
                        placeHolder={props?.config?.config_value?.path}
                        label={'*path'}
                        customClass={'mb-2'}
                        customLabelClass={'md-label'}
                    />
                    <CustomInputWithLabel
                        autoComplete="isOrganisationBucket"
                        value={isOrganisationBucket}
                        onChange={(event) => setIsOrganisationBucket(event)}
                        placeHolder={props?.config?.config_value?.is_organisation_bucket}
                        label={'*Is Organisation Bucket'}
                        customClass={'mb-2'}
                        customDropdownClass={'md-label'}
                        isDropdown
                        dropdownValues={
                            props?.config?.config_value?.is_organisation_bucket ? ['True', 'False'] : ['False', 'True']
                        }
                    />
                </>
            ) : props?.config?.config_name === 'JIRA_INTEGRATION' ? (
                <>
                    <CustomInputWithLabel
                        autoComplete="Email"
                        value={email}
                        onChange={emailIdChangehandler}
                        hasError={emailIdHasError}
                        onBlur={emailIdBlurHandler}
                        placeHolder={props?.config?.config_value?.email}
                        label={'*Email Id'}
                        customClass={'mb-2'}
                        customLabelClass={'md-label'}
                    />
                    <CustomInputWithLabel
                        autoComplete="Token"
                        value={token}
                        onChange={(event) => setToken(event)}
                        placeHolder="******"
                        label={'*Token'}
                        customClass={'mb-2'}
                        customLabelClass={'md-label'}
                    />

                    <CustomInputWithLabel
                        autoComplete="project Key"
                        value={projectKey}
                        onChange={(event) => setProjectKey(event)}
                        placeHolder={props?.config?.config_value?.project_key}
                        label={'*project Key'}
                        customClass={'mb-2'}
                        customLabelClass={'md-label'}
                    />

                    <CustomInputWithLabel
                        autoComplete="Instance Url"
                        value={instanceUrl}
                        onChange={(event) => setInstanceUrl(event)}
                        placeHolder={props?.config?.config_value?.instance_url}
                        label={'*Instance Url'}
                        customClass={'mb-2'}
                        customLabelClass={'md-label'}
                    />
                </>
            ) : props?.config?.config_name === 'PAGERDUTY_AUTH_INFO' ? (
                <>
                    <CustomInputWithLabel
                        autoComplete="User"
                        value={user}
                        onChange={userIdChangehandler}
                        hasError={userIdHasError}
                        onBlur={userIdBlurHandler}
                        placeHolder={props?.config?.config_value?.user}
                        label={'*User'}
                        customClass={'mb-2'}
                        customLabelClass={'md-label'}
                    />
                    <CustomInputWithLabel
                        autoComplete="API Key"
                        value={apiKey}
                        onChange={(event) => setApiKey(event)}
                        placeHolder="******"
                        label={'*API Key'}
                        customClass={'mb-2'}
                        customLabelClass={'md-label'}
                    />
                </>
            ) : props?.config?.config_name === 'PAGERDUTY_SETTINGS' ? (
                <>
                    <CustomInputWithLabel
                        autoComplete="services"
                        value={service}
                        onChange={(event) => setService(event)}
                        placeHolder={'Service'}
                        label={'*Services'}
                        customClass={'mb-2'}
                        customDropdownClass={'md-label'}
                        isDropdown
                        dropdownValues={services}
                    />
                    <CustomInputWithLabel
                        autoComplete="escalations"
                        value={escalation}
                        onChange={(event) => setEscalation(event)}
                        placeHolder={'Escalation'}
                        label={'*Escalations'}
                        customClass={'mb-2'}
                        customDropdownClass={'md-label'}
                        isDropdown
                        dropdownValues={escalations}
                    />
                    <CustomInputWithLabel
                        autoComplete="priorities"
                        value={priority}
                        onChange={(event) => setPriority(event)}
                        placeHolder={'Priority'}
                        label={'*Priorities'}
                        customClass={'mb-2'}
                        customDropdownClass={'md-label'}
                        isDropdown
                        dropdownValues={priorities}
                    />
                </>
            ) : props?.config?.config_name === 'RISK_ASSESMENT_REPORT_CONFIGURATION' ? (
                <>
                    <CustomInputWithLabel
                        autoComplete="configEmail"
                        value={configEmail}
                        onChange={emailconfigValueChagehandler}
                        placeHolder={setPlaceholder(props.config?.config_name)}
                        label={'*Configuration email'}
                        hasError={emailconfigValueHasError}
                        onBlur={emailconfigValueBlurHandler}
                        errorMessage={t(props?.config?.config_name) + ' is ' + t('required')}
                        customClass={'mb-2'}
                        customLabelClass={'md-label'}
                    />
                    <CustomInputWithLabel
                        //key
                        autoComplete="ConfigurationInterval"
                        value={interval}
                        onChange={(event) => setInterval(event)}
                        placeHolder={t('Configuration Interval')}
                        label={t('Configuration IntervalL')}
                        customClass={'mb-2'}
                        customDropdownClass={'md-label'}
                        isDropdown
                        dropdownValues={['default', '3', '6', '12', '24']}
                    />
                </>
            ) : (
                <CustomInputWithLabel
                    autoComplete="configValue"
                    value={configValue}
                    onChange={configValueChagehandler}
                    placeHolder={setPlaceholder(props.config?.config_name)}
                    hasError={configValueHasError}
                    onBlur={configValueBlurHandler}
                    errorMessage={t(props.config?.config_name) + ' is ' + t('required')}
                    label={'*' + t(props.config?.config_name)}
                    customLabelClass={'md-label'}
                    customClass={'mb-2'}
                />
            )}

            <div
                className="d-flex justify-content-center align-items-center mx-5 mt-5"
                data-si-qa-key={`configuration-setting-update`}
            >
                <AuthButton
                    title={t('update')}
                    buttonType="md"
                    onClick={onConfirmUpdateUser}
                    isLoading={props.isLoading}
                    enable={
                        (configValue && configValue.trim().length > 0) ||
                        bucketName ||
                        region ||
                        props?.config?.config_value?.is_organisation_bucket !==
                            (isOrganisationBucket === 'True' ? true : false) ||
                        props?.config?.config_name === 'PAGERDUTY_SETTINGS'
                            ? true
                            : false
                    }
                />
            </div>
        </form>
    );
};

export default UpdateAdvanceSettingForm;
