import { useMutation } from '@tanstack/react-query';
import BaseLayout from 'core/container/BaseLayout';
import {
    addCloudAccount,
    addGitCloudAccount,
    addSnowflakeCloudAccount,
    createSIIAMUser,
    uploadCloudAccountFile,
} from 'core/services/CloudaccountsAPIService';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import AuthButton from 'shared/components/buttons/AuthButton';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import useInput from 'shared/hooks/use-input';
import {
    AddCloudAccountPayload,
    AssumeRole,
    CloudAccountProvider,
    IAMCredentials,
    SnowflakeCredentials,
} from 'shared/models/CloudAccountModel';
import { emptyStringValidation } from 'shared/service/ValidationService';
import { ToastVariant, USER_CREDENTIALS, USER_ROLE_CREDENTIALS } from 'shared/utils/Constants';
import { setToastMessageAction } from 'store/actions/SingleActions';
import 'translation/i18n';
import { CLOUDACCOUNT } from '..';
import AWSCredentials from './account_type/aws/AWSCredentials';
import UserRoleNextStep from './account_type/aws/user_role/UserRoleNextStep';
import UploadCredentialsFile from './account_type/gcp/UploadCredentialsFile';
import AddSnowflakeCredentials from './account_type/snowflake/AddSnowflakeCredentials';
import AdvancedSettings from './common_section/AdvancedSettings';
import CommonSection from './common_section/CommonSection';

const AddCloudAccount = () => {
    const [basicDetails, setBasicDetails] = useState<{ cloud_provider: string; name: string | null } | null>(null);
    const [file, setFile] = useState<any>();
    const [connectionDetails, setConnectionDetails] = useState<IAMCredentials | AssumeRole | null>(null);
    const [snowflakeConnectionDetails, setSnowflakeConnectionDetails] = useState<SnowflakeCredentials | null>(null);
    const [selectedAWSTab, setSelectedAWSTab] = useState<typeof USER_CREDENTIALS | typeof USER_ROLE_CREDENTIALS>(
        USER_CREDENTIALS,
    );
    const [advancedConfigs, setAdvancedConfigs] = useState<{ [key: string]: any } | null>(null);
    const [enableNextButton, setEnableNextButton] = useState(false);
    const [isNextClicked, setIsNextClicked] = useState(false);
    const [isAssumeRoleNextClicked, setIsAssumeRoleNextClicked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { t } = useTranslation();
    const {
        value: token,
        hasError: tokenHasError,
        valueChangeHandler: tokenChangeHandler,
        inputBlurHandler: tokenBlurHandler,
    } = useInput(emptyStringValidation);

    const dispatch = useDispatch();

    useEffect(() => {
        // reset
        setConnectionDetails(null);
        setAdvancedConfigs(null);
    }, [basicDetails?.cloud_provider]);

    const saveAWSAccountDetails = (body: any) => {
        setIsLoading(true);
        addCloudAccount(body)
            .then(() => {
                navigate(CLOUDACCOUNT);
                dispatch(setToastMessageAction(ToastVariant.SUCCESS, t('cloudaccount_added_successfully')));
            })
            .catch(() => {
                setIsNextClicked(false), setIsLoading(false);
            });
    };

    //snowflake account creation api
    const snowflakeMutation = useMutation({
        mutationFn: (body: any) => {
            return addSnowflakeCloudAccount(body);
        },
        onSuccess: () => {
            navigate(CLOUDACCOUNT);
            dispatch(setToastMessageAction(ToastVariant.SUCCESS, t('cloudaccount_added_successfully')));
        },
        onError: () => {
            setIsNextClicked(false), setIsLoading(false);
        },
    });
    //git account creation api
    const gitConfigMutation = useMutation({
        mutationFn: (body: any) => {
            return addGitCloudAccount(body);
        },
        onSuccess: () => {
            navigate(CLOUDACCOUNT);
            dispatch(setToastMessageAction(ToastVariant.SUCCESS, t('cloudaccount_added_successfully')));
        },
        onError: () => {
            setIsNextClicked(false), setIsLoading(false);
        },
    });

    const saveSnowflakeAccountDetails = (body: any) => {
        setIsLoading(true);
        snowflakeMutation.mutate(body);
    };
    const saveGitAccountDetails = (body: any) => {
        gitConfigMutation.mutate(body);
    };
    const saveGCPAccountDetails = (body: { file: any; name: string; configs: any }) => {
        const subscription_id = body?.configs?.GCP_PUB_SUB?.pub_sub;
        const bigquery_tag_key: any = body?.configs?.GCP_TAG_KEY?.key;
        const slack_web_url: any = body?.configs?.SLACK_WEB_HOOK?.key;

        setIsLoading(true);
        uploadCloudAccountFile(body.file, body.name, subscription_id, bigquery_tag_key, slack_web_url)
            .then(() => {
                navigate(CLOUDACCOUNT);
                dispatch(setToastMessageAction(ToastVariant.SUCCESS, t('cloudaccount_added_successfully')));
            })
            .catch(() => {
                setIsNextClicked(false), setIsLoading(false);
            });
    };

    const createSIIAMRole = (cloudAccountName: string, assumeRoleArn: string) => {
        const body: { cloud_account_name: string; assume_role: string } = {
            cloud_account_name: cloudAccountName,
            assume_role: assumeRoleArn,
        };
        setIsLoading(true);
        createSIIAMUser(body)
            .then((res: any) => {
                setIsLoading(false);
                if (res) {
                    setEnableNextButton(true);
                }
            })
            .catch(() => {
                setIsNextClicked(false), setIsLoading(false);
            });
    };

    const onAssumeRoleNextClicked = () => {
        if (basicDetails && basicDetails?.name && connectionDetails) {
            setIsAssumeRoleNextClicked(true);
            setEnableNextButton(false);
            createSIIAMRole(basicDetails?.name, (connectionDetails as AssumeRole).assume_role);
        }
    };

    const onPrevClicked = () => {
        setIsAssumeRoleNextClicked(false);
        setEnableNextButton(false);
    };

    const onNextClicked = () => {
        // If Assume role tab is selected and its step in not done
        if (
            basicDetails?.cloud_provider == CloudAccountProvider.AWS &&
            (connectionDetails as AssumeRole).assume_role &&
            !isAssumeRoleNextClicked
        ) {
            onAssumeRoleNextClicked();
        } else {
            setIsNextClicked(true);
            addAccount();
        }
    };

    const addAccount = () => {
        if (basicDetails && basicDetails.cloud_provider && basicDetails.name) {
            switch (basicDetails.cloud_provider) {
                case CloudAccountProvider.AWS:
                    if (connectionDetails) {
                        const body: AddCloudAccountPayload = {
                            cloud_provider: basicDetails?.cloud_provider,
                            name: basicDetails?.name,
                            connection_details: connectionDetails,
                        };
                        if (advancedConfigs) {
                            body.configs = advancedConfigs;
                        }
                        saveAWSAccountDetails(body);
                    }
                    break;
                case CloudAccountProvider.SNOWFLAKE:
                    if (snowflakeConnectionDetails) {
                        const body: AddCloudAccountPayload = {
                            cloud_provider: basicDetails?.cloud_provider,
                            name: basicDetails?.name,
                            connection_details: snowflakeConnectionDetails,
                        };
                        saveSnowflakeAccountDetails(body);
                    }
                    break;
                case CloudAccountProvider.GCP:
                    if (file) {
                        const body: any = { file: file, name: basicDetails.name, configs: null };
                        if (advancedConfigs) {
                            body.configs = advancedConfigs;
                        }
                        saveGCPAccountDetails(body);
                    }
                    break;
                case CloudAccountProvider.GIT:
                    {
                        const body = {
                            cloud_provider: 'GITHUB',
                            name: basicDetails.name,
                            connection_details: {
                                AccessToken: token,
                            },
                        };

                        saveGitAccountDetails(body);
                    }

                    break;
                default:
                    console.log('GCP or Kubernetes selected');
                    break;
            }
        }

        return null;
    };

    const getCloudNameAndType = (selectedOption: CloudAccountProvider, cloudName: string | null) => {
        setBasicDetails({
            cloud_provider: CloudAccountProvider[selectedOption] as string,
            name: cloudName,
        });
    };

    const getGCPCredentials = (file: any) => {
        setFile(file);
    };

    const getAWSCredentials = (connection_details: IAMCredentials | AssumeRole | null) => {
        setConnectionDetails(connection_details);
    };

    const getSnowflakeCredentials = (connection_details: SnowflakeCredentials | null) => {
        setSnowflakeConnectionDetails(connection_details);
    };

    const getSelctedTab = (selectedTab: typeof USER_CREDENTIALS | typeof USER_ROLE_CREDENTIALS) => {
        setSelectedAWSTab(selectedTab);
        setConnectionDetails(null);
    };

    const getAdvancedConfigs = (configObj: { [key: string]: any } | null) => {
        setAdvancedConfigs(configObj);
    };

    useEffect(() => {
        let isFormValid = false;
        if (basicDetails && basicDetails.cloud_provider && basicDetails.name) {
            switch (basicDetails.cloud_provider) {
                case CloudAccountProvider.AWS:
                    if (connectionDetails) {
                        if (
                            (connectionDetails as IAMCredentials).accesskeyid &&
                            (connectionDetails as IAMCredentials).secretaccesskey
                        ) {
                            isFormValid = true;
                        } else if ((connectionDetails as AssumeRole).assume_role) {
                            isFormValid = true;
                        } else {
                            isFormValid = false;
                        }
                    } else {
                        isFormValid = false;
                    }
                    break;
                case CloudAccountProvider.SNOWFLAKE:
                    if (snowflakeConnectionDetails) {
                        if (
                            snowflakeConnectionDetails.userName !== '' &&
                            snowflakeConnectionDetails.password !== '' &&
                            snowflakeConnectionDetails.accountIdentifier !== '' &&
                            snowflakeConnectionDetails.defaultRole !== '' &&
                            snowflakeConnectionDetails.warehouse !== ''
                        ) {
                            isFormValid = true;
                        } else isFormValid = false;
                    } else {
                        isFormValid = false;
                    }
                    break;
                case CloudAccountProvider.GCP:
                    file ? (isFormValid = true) : (isFormValid = false);
                    break;
                case CloudAccountProvider.GIT:
                    token ? (isFormValid = true) : (isFormValid = false);
                    break;
                default:
                    console.log('GCP or Kubernetes selected');
                    break;
            }
        }

        if (isFormValid) {
            setEnableNextButton(true);
        } else {
            setEnableNextButton(false);
        }
    }, [basicDetails, file, connectionDetails, snowflakeConnectionDetails, advancedConfigs]);

    const getButtonTitle = () => {
        return selectedAWSTab == USER_ROLE_CREDENTIALS && !isAssumeRoleNextClicked ? t('next') : t('submit');
    };

    return (
        <>
            <BaseLayout columnSize="8" classes="mb-4">
                {isAssumeRoleNextClicked ? (
                    <>
                        <UserRoleNextStep
                            translate={t}
                            assumeRoleArn={(connectionDetails as AssumeRole)?.assume_role}
                        />
                    </>
                ) : (
                    <>
                        <CommonSection setValues={getCloudNameAndType} previousState={basicDetails} />
                        {basicDetails?.cloud_provider == CloudAccountProvider.GCP && (
                            <>
                                <UploadCredentialsFile
                                    setValues={getGCPCredentials}
                                    selectedOption={basicDetails?.cloud_provider}
                                />
                                <AdvancedSettings
                                    setValues={getAdvancedConfigs}
                                    previousState={advancedConfigs}
                                    cloudAccountType={basicDetails?.cloud_provider}
                                />
                            </>
                        )}
                        {basicDetails?.cloud_provider == CloudAccountProvider.AWS && (
                            <>
                                <AWSCredentials
                                    setValues={getAWSCredentials}
                                    selectedOption={basicDetails?.cloud_provider}
                                    previousState={connectionDetails}
                                    setSelectedTab={getSelctedTab}
                                />
                                <AdvancedSettings
                                    setValues={getAdvancedConfigs}
                                    previousState={advancedConfigs}
                                    cloudAccountType={basicDetails?.cloud_provider}
                                />
                            </>
                        )}
                        {basicDetails?.cloud_provider == CloudAccountProvider.SNOWFLAKE && (
                            <AddSnowflakeCredentials
                                setValues={getSnowflakeCredentials}
                                selectedOption={basicDetails?.cloud_provider}
                            />
                        )}
                        {basicDetails?.cloud_provider == CloudAccountProvider.GIT && (
                            <div className="col-md-8 mx-5 pb-4">
                                <div className="pb-5">
                                    <CustomInputWithLabel
                                        autoComplete="Token"
                                        value={token}
                                        onChange={tokenChangeHandler}
                                        placeHolder={t('token')}
                                        hasError={tokenHasError}
                                        onBlur={tokenBlurHandler}
                                        errorMessage={tokenHasError || !token ? t('token_required') + '' : ''}
                                        label={'*' + t('token')}
                                        customClass={'mt-2 mb-2'}
                                    />
                                </div>
                            </div>
                        )}
                    </>
                )}
            </BaseLayout>
            <div className="bottom-fixed-bar">
                <AuthButton
                    title={getButtonTitle()}
                    buttonType="md"
                    onClick={() => onNextClicked()}
                    isLoading={isLoading}
                    enable={enableNextButton}
                    className="float-end d-inline mx-2 mt-1"
                />
                {isAssumeRoleNextClicked && (
                    <div className="d-flex align-items-center align-content-around">
                        <div className="w-95 font-small-semibold text-center">
                            <div className="pe-3 me-3"> {isLoading && !isNextClicked ? t('wait_text') : ''} </div>
                        </div>

                        <AuthButton
                            title={t('prev')}
                            buttonType="md"
                            onClick={() => onPrevClicked()}
                            className="float-end mx-2 mt-1"
                            enable={!isLoading}
                        />
                    </div>
                )}
            </div>
        </>
    );
};

export default AddCloudAccount;
