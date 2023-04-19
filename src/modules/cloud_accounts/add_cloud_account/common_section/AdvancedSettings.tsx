import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import useInput from 'shared/hooks/use-input';
import { CloudAccountProvider, ConfigType } from 'shared/models/CloudAccountModel';
import 'translation/i18n';

type AdvancedSettingsProps = {
    setValues: (configObj: { [key: string]: any } | null) => void;
    previousState: { [key: string]: any } | null;
    cloudAccountType: CloudAccountProvider;
};

const AdvancedSettings = (props: AdvancedSettingsProps) => {
    const [isAdvancedSettingChecked, setIsAdvancedSettingChecked] = useState(false);
    const { t } = useTranslation();

    const {
        value: oktaToken,
        hasError: oktaTokenHasError,
        valueChangeHandler: oktaTokenChangehandler,
        inputBlurHandler: oktaTokenBlurHandler,
        isValid: oktaTokenIsValid,
        reset: resetOktaToken,
    } = useInput(() => {
        return true;
    });

    const {
        value: appNameTag,
        hasError: appNameTagHasError,
        valueChangeHandler: appNameTagChangehandler,
        inputBlurHandler: appNameTagBlurHandler,
        isValid: appNameTagIsValid,
        reset: resetAppNameTag,
    } = useInput(() => {
        return true;
    });

    const {
        value: dataClassificationTag,
        hasError: dataClassificationTagHasError,
        valueChangeHandler: dataClassificationTagChangehandler,
        inputBlurHandler: dataClassificationTagHandler,
        isValid: dataClassificationTagIsValid,
        reset: resetdataClassificationTag,
    } = useInput(() => {
        return true;
    });

    const {
        value: gcpPubSub,
        hasError: gcpPubSubHasError,
        valueChangeHandler: gcpPubSubChangehandler,
        inputBlurHandler: gcpPubSubBlurHandler,
        isValid: gcpPubSubIsValid,
        reset: resetGcpPubSub,
    } = useInput(() => {
        return true;
    });

    const {
        value: gcpTagKey,
        hasError: gcpTagKeyHasError,
        valueChangeHandler: gcpTagKeyChangehandler,
        inputBlurHandler: gcpTagKeyBlurHandler,
        isValid: gcpTagKeyIsValid,
        reset: resetGcpTagKey,
    } = useInput(() => {
        return true;
    });
    const {
        value: gcpslackurl,
        hasError: gcpslackurlHasError,
        valueChangeHandler: gcpSlackUrlChangehandler,
        inputBlurHandler: gcpSlackUrlBlurHandler,
        isValid: gcpSlackUrlIsValid,
        // reset: resetgcpSlackUrl,
    } = useInput(() => {
        return true;
    });

    useEffect(() => {
        // set previous state
        if (props.previousState) {
            if (props.previousState[ConfigType.OKTA_IDP_CONFIG]) {
                oktaTokenChangehandler(props.previousState[ConfigType.OKTA_IDP_CONFIG].api_token);
            } else {
                resetOktaToken();
            }
            setIsAdvancedSettingChecked(true);
        } else {
            setIsAdvancedSettingChecked(false);
            resetOktaToken();
        }
    }, []);

    useEffect(() => {
        const configs: any = {};
        if (oktaToken && oktaTokenIsValid) {
            configs[ConfigType.OKTA_IDP_CONFIG] = {
                provider: 'Okta',
                api_token: oktaToken,
            };
        }

        if (appNameTag && appNameTagIsValid) {
            configs[ConfigType.APP_NAME_TAG_CONFIG] = {
                key: appNameTag,
            };
        }

        if (dataClassificationTag && dataClassificationTagIsValid) {
            configs[ConfigType.DATA_CLASSIFICATION_TAG] = {
                key: dataClassificationTag,
            };
        }

        if (gcpPubSub && gcpPubSubIsValid) {
            configs[ConfigType.GCP_PUB_SUB] = {
                pub_sub: gcpPubSub,
            };
        }

        if (gcpTagKey && gcpTagKeyIsValid) {
            configs[ConfigType.GCP_TAG_KEY] = {
                key: gcpTagKey,
            };
        }
        if (gcpslackurl && gcpSlackUrlIsValid) {
            configs[ConfigType.SLACK_WEB_HOOK] = {
                key: gcpslackurl,
            };
        }

        if (Object.keys(configs).length > 0) {
            props.setValues(configs);
        } else {
            props.setValues(null);
        }
    }, [oktaToken, appNameTag, gcpPubSub, gcpTagKey, gcpslackurl, dataClassificationTag]);

    const onAdvancedSettingCheck = () => {
        setIsAdvancedSettingChecked(!isAdvancedSettingChecked);
        if (!isAdvancedSettingChecked) {
            resetOktaToken();
            resetAppNameTag();
            resetdataClassificationTag();
            resetGcpPubSub();
            resetGcpTagKey();
        }
    };

    const getAWSAdvancedConfigs = () => {
        return (
            <div className="pb-5">
                <CustomInputWithLabel
                    autoComplete="oktaToken"
                    value={oktaToken}
                    onChange={oktaTokenChangehandler}
                    placeHolder={t('OKTA_IDP_CONFIG')}
                    hasError={oktaTokenHasError}
                    onBlur={oktaTokenBlurHandler}
                    errorMessage={oktaTokenHasError || !oktaToken ? t('oktaToken_required') + '' : ''}
                    label={t('OKTA_IDP_CONFIG')}
                    customClass={'mt-2 mb-2'}
                />
                <CustomInputWithLabel
                    autoComplete="appNameTag"
                    value={appNameTag}
                    onChange={appNameTagChangehandler}
                    placeHolder={t('APP_NAME_TAG_CONFIG')}
                    hasError={appNameTagHasError}
                    onBlur={appNameTagBlurHandler}
                    errorMessage={appNameTagHasError || !appNameTag ? t('appNameTag_required') + '' : ''}
                    label={t('APP_NAME_TAG_CONFIG')}
                    customClass={'mb-2'}
                />
                <CustomInputWithLabel
                    autoComplete="dataClassificationTag"
                    value={dataClassificationTag}
                    onChange={dataClassificationTagChangehandler}
                    placeHolder={t('data_classification_tag')}
                    hasError={dataClassificationTagHasError}
                    onBlur={dataClassificationTagHandler}
                    errorMessage={
                        dataClassificationTagHasError || !dataClassificationTag
                            ? t('dataClassificationTag_required') + ''
                            : ''
                    }
                    label={t('data_classification_tag')}
                    customClass={'mb-2'}
                />
            </div>
        );
    };

    const getGCPAdvancedConfigs = () => {
        return (
            <div className="pb-5">
                <CustomInputWithLabel
                    autoComplete="gcpPubSub"
                    value={gcpPubSub}
                    onChange={gcpPubSubChangehandler}
                    placeHolder={t('GCP_PUB_SUB')}
                    hasError={gcpPubSubHasError}
                    onBlur={gcpPubSubBlurHandler}
                    errorMessage={!gcpPubSub ? t('loggroupName_required') + '' : ''}
                    label={t('GCP_PUB_SUB')}
                    customClass={'mb-2 mt-2'}
                />

                <CustomInputWithLabel
                    autoComplete="gcpTagKey"
                    value={gcpTagKey}
                    onChange={gcpTagKeyChangehandler}
                    placeHolder={t('GCP_TAG_KEY')}
                    hasError={gcpTagKeyHasError}
                    onBlur={gcpTagKeyBlurHandler}
                    errorMessage={gcpTagKeyHasError || !gcpTagKey ? t('loggroupName_required') + '' : ''}
                    label={t('GCP_TAG_KEY')}
                    customClass={'mb-2 mt-2'}
                />
                <CustomInputWithLabel
                    autoComplete="gcpslackurl"
                    value={gcpslackurl}
                    onChange={gcpSlackUrlChangehandler}
                    placeHolder={t('GCP_SLACK_URL')}
                    hasError={gcpslackurlHasError}
                    onBlur={gcpSlackUrlBlurHandler}
                    errorMessage={gcpslackurlHasError || !gcpslackurl ? t('loggroupName_required') + '' : ''}
                    label={t('GCP_SLACK_URL')}
                    customClass={'mb-2 mt-2'}
                />
            </div>
        );
    };

    return (
        <div className="col-md-8 mx-5 pb-4">
            <div className="d-flex ps-2 ">
                <input
                    type="checkbox"
                    className="form-check-input mt-2 cursor-pointer"
                    checked={isAdvancedSettingChecked}
                    onChange={() => onAdvancedSettingCheck()}
                />
                <label
                    className="font-small px-2 pt-1 cursor-pointer"
                    onClick={() => onAdvancedSettingCheck()}
                    role="presentation"
                >
                    {t('advanced_configurations')}
                </label>
            </div>
            {isAdvancedSettingChecked && props.cloudAccountType == CloudAccountProvider.AWS && getAWSAdvancedConfigs()}
            {isAdvancedSettingChecked && props.cloudAccountType == CloudAccountProvider.GCP && getGCPAdvancedConfigs()}
        </div>
    );
};

export default React.memo(AdvancedSettings);
