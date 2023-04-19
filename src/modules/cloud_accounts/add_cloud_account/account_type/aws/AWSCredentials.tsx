import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AssumeRole, IAMCredentials } from 'shared/models/CloudAccountModel';
import { USER_CREDENTIALS, USER_ROLE_CREDENTIALS } from 'shared/utils/Constants';
import 'translation/i18n';
import UserCredential from './user_credential/UserCredential';
import UserRole from './user_role/UserRole';

type AWSCredentialsProps = {
    setValues: (connection_details: IAMCredentials | AssumeRole | null) => void;
    setSelectedTab: (selectedTab: typeof USER_ROLE_CREDENTIALS | typeof USER_CREDENTIALS) => void;
    selectedOption: string;
    previousState: IAMCredentials | AssumeRole | null;
};

const AWSCredentials = (props: AWSCredentialsProps) => {
    const [selectedAccountType, setSelectedAccountType] = useState<
        typeof USER_ROLE_CREDENTIALS | typeof USER_CREDENTIALS
    >(USER_ROLE_CREDENTIALS);
    const [previousAssumeRoleArn, setPreviousAssumeRoleArn] = useState<string | null>(null);
    const { t } = useTranslation();

    useEffect(() => {
        if (props.previousState) {
            if ((props.previousState as AssumeRole).assume_role) {
                // If user click on previous button, then set prevoius state
                setSelectedAccountType(USER_ROLE_CREDENTIALS);
                setPreviousAssumeRoleArn((props.previousState as AssumeRole).assume_role);
            } else {
                setSelectedAccountType(USER_CREDENTIALS);
                setPreviousAssumeRoleArn('');
            }
        }
    }, []);

    const getAssumeRoleArn = (role: string | null) => {
        if (role) {
            props.setValues({ assume_role: role });
        } else {
            props.setValues(null);
        }
    };

    const getIAMCredentials = (accessKeyId: string | null, secretAccessKey: string | null) => {
        if (accessKeyId && secretAccessKey) {
            props.setValues({ accesskeyid: accessKeyId, secretaccesskey: secretAccessKey });
        } else {
            props.setValues(null);
        }
    };

    const onTabClick = (selectedTab: typeof USER_ROLE_CREDENTIALS | typeof USER_CREDENTIALS) => {
        setSelectedAccountType(selectedTab);
        props.setSelectedTab(selectedTab);
    };

    return (
        <>
            <div className="col-md-8 mx-5">
                <div className="d-flex mb-4 mt-4">
                    <button
                        type="button"
                        className={`w-40 btn btn-custom btn-tab justify-content-center align-items-center ${
                            selectedAccountType === USER_ROLE_CREDENTIALS ? 'selected' : ''
                        }`}
                        onClick={() => onTabClick(USER_ROLE_CREDENTIALS)}
                        title={t('use_assume_role') + ''}
                    >
                        {t('use_assume_role')}
                    </button>
                    <button
                        type="button"
                        className={`w-40 btn btn-custom btn-tab justify-content-center align-items-center ${
                            selectedAccountType === USER_CREDENTIALS ? 'selected' : ''
                        }`}
                        onClick={() => onTabClick(USER_CREDENTIALS)}
                        title={t('iam_user_credential') + ''}
                    >
                        {t('iam_user_credential')}
                    </button>
                </div>
                {selectedAccountType === USER_CREDENTIALS ? (
                    <UserCredential translate={t} setValues={getIAMCredentials} />
                ) : (
                    <UserRole
                        translate={t}
                        setValues={getAssumeRoleArn}
                        previousAssumeRoleArn={previousAssumeRoleArn}
                    />
                )}
            </div>
        </>
    );
};
export default React.memo(AWSCredentials);
