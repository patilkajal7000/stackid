import { useMutation, useQuery } from '@tanstack/react-query';
import { http_get } from 'core/services/BaseURLAxios';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import AuthButton from 'shared/components/buttons/AuthButton';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import useInput from 'shared/hooks/use-input';
import { AccountConfig, CloudAccountProvider, ConfigType } from 'shared/models/CloudAccountModel';
import { emptyStringValidation, validateEmail } from 'shared/service/ValidationService';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { AppState } from 'store/store';
import 'translation/i18n';
import { ToastVariant } from 'shared/utils/Constants';
import { addRiskConfig } from 'core/services/CloudaccountsAPIService';

type AddNewConfigFormProps = {
    onAdd: (accountConfig: AccountConfig) => void;
    isLoading: boolean;
    cloudAccountType: CloudAccountProvider;
};
const DEFAULT_INTERVAL = 1440;
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

const AddNewConfigForm = (props: AddNewConfigFormProps) => {
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const [bucketName, setBucketName] = useState('');
    const [region, setRegion] = useState('');
    const [path, setPath] = useState('');
    const [isOrganisationBucket, setIsOrganisationBucket] = useState('');
    const [token, setToken] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [interval, setInterval] = useState<any>('default');
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

    const [service, setService] = useState('');
    const [services, setServices] = useState<any[]>([]);

    const [escalation, setEscalation] = useState('');
    const [escalations, setEscalations] = useState<any[]>([]);

    const [priority, setPriority] = useState('');
    const [priorities, setPriorities] = useState<any[]>([]);

    // validation for enabling the save button
    const isEnable = () => {
        if (configType && bucketName && region && path) return true;
        return false;
    };

    const isJiraEnabled = () => {
        if (configType && email && token && projectKey && instanceUrl) return true;
        return false;
    };

    const isPagerDutyEnabled = () => {
        if (user && apiKey) return true;
        return false;
    };

    const {
        value: configType,
        hasError: configTypeHasError,
        valueChangeHandler: configTypeChagehandler,
        inputBlurHandler: configTypeBlurHandler,
    } = useInput(emptyStringValidation);

    useEffect(() => {
        if (configType === 'PAGERDUTY_SETTINGS') {
            refetchAllPagerdutySettings();
        }
        if (pagerdutySettings && !pagerdutySettingsLoading && isSuccess) {
            setEscalations([]);
            setPriorities([]);
            setServices([]);
            pagerdutySettings?.data?.escalations?.map((setting: any) => {
                setEscalations((escalations: any) => [...escalations, setting?.summary]);
            });
            pagerdutySettings?.data?.priorities?.map((setting: any) => {
                setPriorities((priorities: any) => [...priorities, setting?.summary]);
            });
            pagerdutySettings?.data?.services?.map((setting: any) => {
                setServices((services: any) => [...services, setting?.name]);
            });
        } else if (pagerdutySettings && pagerdutySettingsError) {
            dispatch(setToastMessageAction(ToastVariant.DANGER, pagerdutySettingsError));
        }
    }, [configType, pagerdutySettings]);

    const {
        value: configValue,
        hasError: configValueHasError,
        valueChangeHandler: configValueChagehandler,
        inputBlurHandler: configValueBlurHandler,
        isValid: configValueIsValid,
    } = useInput(emptyStringValidation);
    const {
        value: configEmail,
        hasError: emailconfigValueHasError,
        valueChangeHandler: emailconfigValueChagehandler,
        inputBlurHandler: emailconfigValueBlurHandler,
        isValid: emailconfigValueIsValid,
    } = useInput(validateEmail);

    const {
        value: email,
        hasError: emailIdHasError,
        valueChangeHandler: emailIdChagehandler,
        inputBlurHandler: emailIdBlurHandler,
    } = useInput(validateEmail);

    const {
        value: user,
        hasError: userIdHasError,
        valueChangeHandler: userIdChangehandler,
        inputBlurHandler: userIdBlurHandler,
    } = useInput(validateEmail);
    const Riskmutation = useMutation({
        mutationFn: (body: any) => {
            return addRiskConfig(body);
        },
        onSuccess: () => {
            const newConfig: AccountConfig = {
                id: -1,
                config_name: configType,
                config_value: {},
            };

            newConfig.config_value = {
                email: configEmail,
                interval: interval == 'default' ? DEFAULT_INTERVAL : interval * 60,
            };
            props.onAdd(newConfig);
            dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'added risk assesment report successfully'));
        },
        onError: () => {
            const newConfig: AccountConfig = {
                id: -1,
                config_name: configType,
                config_value: {},
            };
            newConfig.config_value = {
                email: configEmail,
                interval: interval == 'default' ? DEFAULT_INTERVAL : interval * 60,
            };
            props.onAdd(newConfig);
            dispatch(setToastMessageAction(ToastVariant.DANGER, 'Something went wrong'));
        },
    });

    const onConfirmAddConfig = (event: any) => {
        event.preventDefault();
        if (configType === 'RISK_ASSESMENT_REPORT_CONFIGURATION') {
            if (emailconfigValueIsValid && configEmail) {
                const body: any = {
                    cloud_account_id: accountId,
                    org_id: orgId,
                    job_type: 'risk_assesment_report',
                    job_config: { email: configEmail },
                    job_interval: interval == 'default' ? DEFAULT_INTERVAL : interval * 60,
                };
                Riskmutation.mutate(body);
                return;
            }
        }
        const newConfig: AccountConfig = {
            id: -1,
            config_name: configType,
            config_value: {},
        };

        if (configType === 'CLOUDTRAIL_S3_BUCKET') {
            newConfig.config_value = {
                bucket_name: bucketName,
                region: region,
                path: path,
                is_organisation_bucket: isOrganisationBucket === 'True' ? true : false,
            };
        }

        if (configType === 'JIRA_INTEGRATION') {
            newConfig.config_value = {
                email: email,
                token: token,
                project_key: projectKey,
                instance_url: instanceUrl,
            };
        }

        if (configType === 'PAGERDUTY_AUTH_INFO') {
            newConfig.config_value = {
                default_from: user,
                api_key: apiKey,
            };
        }

        if (configType === 'PAGERDUTY_SETTINGS') {
            if (pagerdutySettings) {
                let serviceId = '';
                let escalationId = '';
                let priorityId = '';
                pagerdutySettings?.data?.escalations?.map((setting: any) => {
                    setEscalations((escalations: any) => [...escalations, setting?.summary]);
                    if (setting?.summary === escalation) escalationId = setting?.id;
                });
                pagerdutySettings?.data?.priorities?.map((setting: any) => {
                    if (setting?.summary === priority) priorityId = setting?.id;
                });
                pagerdutySettings?.data?.services?.map((setting: any) => {
                    if (setting?.name === service) serviceId = setting?.id;
                });
                newConfig.config_value = {
                    service: service === '' ? pagerdutySettings?.data?.services[0]?.id : serviceId,
                    escalation_policy: escalation === '' ? pagerdutySettings?.data?.escalations[0]?.id : escalationId,
                    priority: priority === '' ? pagerdutySettings?.data?.priorities[0]?.id : priorityId,
                };
            }
        }

        if (configValueIsValid && configValue) {
            switch (configType) {
                case ConfigType.OKTA_IDP_CONFIG: {
                    newConfig.config_value = {
                        provider: 'Okta',
                        api_token: configValue,
                    };
                    break;
                }
                case ConfigType.LOG_GROUP_DETAILS: {
                    newConfig.config_value = {
                        log_group_name: configValue,
                        timestamp: Date.now(),
                    };
                    break;
                }
                case ConfigType.APP_NAME_TAG_CONFIG: {
                    newConfig.config_value = {
                        key: configValue,
                    };
                    break;
                }
                case ConfigType.SLACK_WORKSPACE_NAME: {
                    newConfig.config_value = {
                        name: configValue,
                    };
                    break;
                }
                case ConfigType.DATA_CLASSIFICATION_TAG: {
                    newConfig.config_value = {
                        key: configValue,
                    };
                    break;
                }
                case ConfigType.SLACK_WEB_HOOK: {
                    newConfig.config_value = {
                        url: configValue,
                    };
                    break;
                }
                case ConfigType.SLACK_WORKFLOW_WEB_HOOK: {
                    newConfig.config_value = {
                        url: configValue,
                    };
                    break;
                }
                case ConfigType.GCP_PUB_SUB: {
                    newConfig.config_value = {
                        pub_sub: configValue,
                    };
                    break;
                }
                case ConfigType.GCP_TAG_KEY: {
                    newConfig.config_value = {
                        key: configValue,
                    };
                    break;
                }
            }
        }

        props.onAdd(newConfig);
        //resetConfigValue();
    };

    const getDropdownList = () => {
        const dropdownList: string[] = [''];
        if (props.cloudAccountType == CloudAccountProvider.AWS) {
            dropdownList.push(
                ...[
                    ConfigType.OKTA_IDP_CONFIG,
                    ConfigType.LOG_GROUP_DETAILS,
                    ConfigType.CLOUDTRAIL_S3_BUCKET,
                    ConfigType.APP_NAME_TAG_CONFIG,
                    ConfigType.SLACK_WORKSPACE_NAME,
                    ConfigType.DATA_CLASSIFICATION_TAG,
                    ConfigType.RISK_ASSESMENT_REPORT_CONFIGURATION,
                ],
            );
        } else if (props.cloudAccountType == CloudAccountProvider.GCP) {
            dropdownList.push(...[ConfigType.GCP_PUB_SUB, ConfigType.GCP_TAG_KEY]);
        }
        dropdownList.push(ConfigType.SLACK_WORKFLOW_WEB_HOOK);
        dropdownList.push(ConfigType.SLACK_WEB_HOOK);
        dropdownList.push(ConfigType.JIRA_INTEGRATION);
        dropdownList.push(ConfigType.PAGERDUTY_AUTH_INFO);
        dropdownList.push(ConfigType.PAGERDUTY_SETTINGS);

        return dropdownList;
    };
    return (
        <form onSubmit={onConfirmAddConfig}>
            <CustomInputWithLabel
                autoComplete="configType"
                value={configType}
                onChange={configTypeChagehandler}
                placeHolder={t('select_config')}
                hasError={configTypeHasError}
                onBlur={configTypeBlurHandler}
                errorMessage={t('required') + ''}
                label={'*' + t('select_config')}
                customClass={'mb-2'}
                customDropdownClass={'md-label'}
                isDropdown
                dropdownValues={getDropdownList()}
                data-si-qa-key={`configuration-add-config-type-${configType}`}
            />
            {configType === 'CLOUDTRAIL_S3_BUCKET'
                ? configType && (
                      <>
                          <CustomInputWithLabel
                              autoComplete="bucketName"
                              value={bucketName}
                              onChange={(event) => setBucketName(event)}
                              placeHolder={'Enter Bucket Name'}
                              label={'*Bucket Name'}
                              customClass={'mb-2'}
                              customLabelClass={'md-label'}
                          />
                          <CustomInputWithLabel
                              autoComplete="region"
                              value={region}
                              onChange={(event) => setRegion(event)}
                              placeHolder={'Enter Region'}
                              label={'*Region'}
                              customClass={'mb-2'}
                              customLabelClass={'md-label'}
                          />
                          <CustomInputWithLabel
                              autoComplete="path"
                              value={path}
                              onChange={(event) => setPath(event)}
                              placeHolder={'<prefix_name>/AWSLogs/<O-ID>/<Account ID>/CloudTrail'}
                              label={'*Path'}
                              customClass={'mb-2'}
                              customLabelClass={'md-label'}
                          />
                          <CustomInputWithLabel
                              autoComplete="isOrganisationBucket"
                              value={isOrganisationBucket}
                              onChange={(event) => setIsOrganisationBucket(event)}
                              placeHolder={'Is Organisation Bucket?'}
                              label={'*Is Organisation Bucket'}
                              customClass={'mb-2'}
                              customDropdownClass={'md-label'}
                              isDropdown
                              dropdownValues={['False', 'True']}
                          />
                      </>
                  )
                : configType === 'JIRA_INTEGRATION'
                ? configType && (
                      <>
                          <CustomInputWithLabel
                              autoComplete="Email"
                              value={email}
                              onChange={emailIdChagehandler}
                              hasError={emailIdHasError}
                              onBlur={emailIdBlurHandler}
                              placeHolder={'Enter Email ID'}
                              label={'*Email Id'}
                              customClass={'mb-2'}
                              customLabelClass={'md-label'}
                          />
                          <CustomInputWithLabel
                              autoComplete="Token"
                              value={token}
                              onChange={(event) => setToken(event)}
                              placeHolder={'Enter Token'}
                              label={'*Token'}
                              customClass={'mb-2'}
                              customLabelClass={'md-label'}
                          />

                          <CustomInputWithLabel
                              autoComplete="project Key"
                              value={projectKey}
                              onChange={(event) => setProjectKey(event)}
                              placeHolder={'Enter project Key'}
                              label={'*project Key'}
                              customClass={'mb-2'}
                              customLabelClass={'md-label'}
                          />

                          <CustomInputWithLabel
                              autoComplete="Instance Url"
                              value={instanceUrl}
                              onChange={(event) => setInstanceUrl(event)}
                              placeHolder={'Enter Instance Url'}
                              label={'*Instance Url'}
                              customClass={'mb-2'}
                              customLabelClass={'md-label'}
                          />
                      </>
                  )
                : configType === 'PAGERDUTY_AUTH_INFO'
                ? configType && (
                      <>
                          <CustomInputWithLabel
                              autoComplete="User"
                              value={user}
                              onChange={userIdChangehandler}
                              hasError={userIdHasError}
                              onBlur={userIdBlurHandler}
                              placeHolder={'Enter User Id'}
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
                  )
                : configType === 'PAGERDUTY_SETTINGS'
                ? configType && (
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
                  )
                : configType === 'RISK_ASSESMENT_REPORT_CONFIGURATION'
                ? configType && (
                      <>
                          <CustomInputWithLabel
                              autoComplete="configEmail"
                              value={configEmail}
                              onChange={emailconfigValueChagehandler}
                              placeHolder={'Configuration email'}
                              label={'*Configuration email'}
                              hasError={emailconfigValueHasError}
                              onBlur={emailconfigValueBlurHandler}
                              errorMessage={t(configType) + ' is ' + t('required')}
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
                  )
                : configType && (
                      <CustomInputWithLabel
                          autoComplete="configValue"
                          value={configValue}
                          onChange={configValueChagehandler}
                          placeHolder={t('Enter') + ' ' + t(configType)}
                          hasError={configValueHasError}
                          onBlur={configValueBlurHandler}
                          errorMessage={t(configType) + ' is ' + t('required')}
                          label={'*' + t(configType)}
                          customClass={'mb-2'}
                          customLabelClass={'md-label'}
                      />
                  )}

            <div
                className="d-flex justify-content-center align-items-center mx-5 mt-5"
                data-si-qa-key={`configuration-add-config-save`}
            >
                <AuthButton
                    title={t('save')}
                    buttonType="md"
                    onClick={onConfirmAddConfig}
                    enable={
                        configType === 'RISK_ASSESMENT_REPORT_CONFIGURATION' && emailconfigValueIsValid
                            ? true
                            : false ||
                              configType === 'CLOUDTRAIL_S3_BUCKET' ||
                              configType === 'JIRA_INTEGRATION' ||
                              configType === 'PAGERDUTY_AUTH_INFO'
                            ? isEnable() || isJiraEnabled() || isPagerDutyEnabled()
                            : (configType && configValueIsValid) ||
                              (configType === 'PAGERDUTY_SETTINGS' && JSON.stringify(pagerdutySettings?.data) !== '{}')
                            ? true
                            : false
                    }
                    isLoading={false}
                />
            </div>
        </form>
    );
};

export default AddNewConfigForm;
