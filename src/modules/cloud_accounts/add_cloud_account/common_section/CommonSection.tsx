import CloudAccountHeader from 'modules/cloud_accounts/component/cloud_account_header/CloudAccountHeader';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import SelectionCard from 'shared/components/selection-card/SelectionCard';
import useInput from 'shared/hooks/use-input';
import { CloudAccountProvider } from 'shared/models/CloudAccountModel';
import { checkLengthValidation, LengthRegex } from 'shared/service/ValidationService';
import { NAME_MAX_LENGTH, NAME_MIN_LENGTH } from 'shared/utils/Constants';
import 'translation/i18n';

type CommonSectionProps = {
    setValues: (selectedOption: CloudAccountProvider, cloudName: string | null) => void;
    previousState: { cloud_provider: string; name: string | null } | null;
};

const CommonSection = (props: CommonSectionProps) => {
    const [selectedOption, setSelectedOption] = useState<CloudAccountProvider>(CloudAccountProvider.AWS);
    const { t } = useTranslation();

    const {
        value: cloudName,
        hasError: cloudNameHasError,
        valueChangeHandler: cloudNameChagehandler,
        inputBlurHandler: cloudNameBlurHandler,
        isValid: cloudNameIsValid,
    } = useInput((value: any) => checkLengthValidation(value, LengthRegex(NAME_MIN_LENGTH, NAME_MAX_LENGTH)));

    useEffect(() => {
        if (props.previousState && props.previousState.name) {
            cloudNameChagehandler(props.previousState.name);
        } else {
            cloudNameChagehandler('');
        }
    }, []);

    useEffect(() => {
        if (cloudNameIsValid) {
            props.setValues(selectedOption, cloudName);
        } else {
            props.setValues(selectedOption, null);
        }
    }, [selectedOption, cloudName]);

    return (
        <div className="col-md-8 mx-5 mt-4">
            <CloudAccountHeader />
            <h5 className="mt-3">{t('cloud_account_provider')}</h5>
            <div className="d-flex mt-3">
                <SelectionCard
                    itemKey={CloudAccountProvider.AWS}
                    isSelected={selectedOption === CloudAccountProvider.AWS}
                    onChangeSelection={() => setSelectedOption(CloudAccountProvider.AWS)}
                    content={t('amazon')}
                    withImage
                    type="amazon"
                />
                <SelectionCard
                    itemKey={CloudAccountProvider.KUBERNETES}
                    isSelected={selectedOption === CloudAccountProvider.KUBERNETES}
                    onChangeSelection={() => setSelectedOption(CloudAccountProvider.AWS)}
                    content={t('kubernetes')}
                    withImage
                    type="kubernetes"
                />
                <SelectionCard
                    itemKey={CloudAccountProvider.GCP}
                    isSelected={selectedOption === CloudAccountProvider.GCP}
                    onChangeSelection={() => setSelectedOption(CloudAccountProvider.GCP)}
                    content={t('google_cloud')}
                    withImage
                    type="google_cloud"
                />
                <SelectionCard
                    itemKey={CloudAccountProvider.AZURE}
                    isSelected={selectedOption === CloudAccountProvider.AZURE}
                    onChangeSelection={() => setSelectedOption(CloudAccountProvider.AWS)}
                    content={t('azure')}
                    withImage
                    type="azure"
                />
                <SelectionCard
                    itemKey={CloudAccountProvider.SNOWFLAKE}
                    isSelected={selectedOption === CloudAccountProvider.SNOWFLAKE}
                    onChangeSelection={() => setSelectedOption(CloudAccountProvider.SNOWFLAKE)}
                    content={t('snowflake')}
                    withImage
                    type="snowflake"
                />
                <SelectionCard
                    itemKey={CloudAccountProvider.GIT}
                    isSelected={selectedOption === CloudAccountProvider.GIT}
                    onChangeSelection={() => setSelectedOption(CloudAccountProvider.GIT)}
                    content={t('git')}
                    withImage
                    type="git"
                />
            </div>
            <h5 className="mt-2">{t('account_name')}</h5>
            <CustomInputWithLabel
                autoComplete="cloudName"
                value={cloudName}
                onChange={cloudNameChagehandler}
                placeHolder={t('friendly_cloud_account')}
                hasError={cloudNameHasError}
                onBlur={cloudNameBlurHandler}
                errorMessage={
                    cloudNameHasError && cloudName
                        ? cloudName.length < NAME_MIN_LENGTH
                            ? t('min_length') + ' ' + NAME_MIN_LENGTH + '.'
                            : t('max_length') + ' ' + NAME_MAX_LENGTH + '.'
                        : t('cloud_name_required') + ''
                }
                label={'*' + t('cloud_name')}
                customClass={'mb-2'}
            />
        </div>
    );
};

export default React.memo(CommonSection);
