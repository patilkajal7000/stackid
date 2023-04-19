import React, { useEffect, useState } from 'react';
import BaseLayout from 'core/container/BaseLayout';
import { getAllCloudAccountsWithDiscoveryStatus } from 'core/services/CloudaccountsAPIService';
import { useDispatch, useSelector } from 'react-redux';
import { CloudAccountModel } from 'shared/models/CloudAccountModel';
import { setCloudAccountsAction } from 'store/actions/CloudAccountActions';
import CloudAccountHeader from '../component/cloud_account_header/CloudAccountHeader';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import useInput from 'shared/hooks/use-input';
import { checkLengthValidation, LengthRegex } from 'shared/service/ValidationService';
import { ORGNAME_MAX_LENGTH, ORGNAME_MIN_LENGTH, ToastVariant } from 'shared/utils/Constants';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';
import AuthButton from 'shared/components/buttons/AuthButton';
import { useNavigate } from 'react-router';
import { CLOUDACCOUNT, CLOUDACCOUNTADD } from '..';
import { addSandboxAccount } from 'core/services/AuthAPISerivce';
import { AppState } from 'store/store';
import { getCurrentUser, updateOrgName } from 'core/services/userManagementAPIService';
import { setAuthTokens, updateUser } from 'store/actions/AuthActions';
import { setToastMessageAction } from 'store/actions/SingleActions';

const OWN_ACCOUNT = 'ONBOARD_OWN_ACCOUNT';
const SANDBOX_ACCOUNT = 'SANDBOX_ACCOUNT';

const InitialSetup = () => {
    const { t } = useTranslation();
    const [selectedAccountType] = useState<typeof OWN_ACCOUNT | typeof SANDBOX_ACCOUNT>(SANDBOX_ACCOUNT);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const user = useSelector((state: AppState) => state.authState.user);

    // const {
    //     value: responsibilities,
    //     hasError: responsibilitiesHasError,
    //     valueChangeHandler: responsibilitiesChagehandler,
    //     inputBlurHandler: responsibilitiesBlurHandler,
    //     isValid: responsibilitiesIsValid,
    // } = useInput(emptyStringValidation);
    const {
        value: orgName,
        hasError: orgNameHasError,
        valueChangeHandler: orgNameChagehandler,
        inputBlurHandler: orgNameBlurHandler,
        isValid: orgNameIsValid,
    } = useInput((value: any) => checkLengthValidation(value, LengthRegex(ORGNAME_MIN_LENGTH, ORGNAME_MAX_LENGTH)));

    useEffect(() => {
        //user?.responsibilities && responsibilitiesChagehandler(user?.responsibilities.toString());
        //user?.org.name && orgNameChagehandler(user.org.name);
        getCloudAccounts();
    }, []);

    const getCloudAccounts = () => {
        getAllCloudAccountsWithDiscoveryStatus().then((response: any) => {
            const cloudAccounts = response as CloudAccountModel[];
            if (cloudAccounts.length > 0) {
                navigate(CLOUDACCOUNT);
            } else {
                dispatch(setCloudAccountsAction(cloudAccounts));
            }
        });
    };

    const isValid = () => orgNameIsValid;

    const onClickProceed = () => {
        //onUpdateResponsibilities();
        onUpdateOrgName();
        if (!isValid()) {
            return;
        }
        if (selectedAccountType === OWN_ACCOUNT) {
            navigate(CLOUDACCOUNTADD);
        } else if (selectedAccountType === SANDBOX_ACCOUNT) {
            onAddSandboxAccount();
        }
    };

    // const onUpdateResponsibilities = () => {
    //     if (!responsibilitiesIsValid) {
    //         responsibilitiesBlurHandler();
    //         return;
    //     } else if (!_.isEqual(responsibilities.split(','), user?.responsibilities)) {
    //         const body = { responsibilities: responsibilities.split(',') };
    //         updateCurrentUser(body).then(() => getUser());
    //     }
    // };

    const getUser = () => {
        getCurrentUser().then((res: any) => {
            dispatch(updateUser(res));
        });
    };

    const onUpdateOrgName = () => {
        if (!orgNameIsValid) {
            orgNameBlurHandler();
            return;
        } else if (orgName !== user?.org.name.trim()) {
            updateOrgName({ name: orgName }).then(() => getUser());
        }
    };

    const onAddSandboxAccount = () => {
        const body = { sandbox: true };
        addSandboxAccount(body).then((res: any) => {
            dispatch(setToastMessageAction(ToastVariant.SUCCESS, res?.message));
            if (res && res.access_token) {
                const user_data = {
                    accessToken: res.access_token,
                    refreshToken: res.refresh_token,
                    user: res.user,
                    status: res.status,
                };
                dispatch(setAuthTokens(user_data));

                navigate(CLOUDACCOUNT);
            }
        });
    };
    return (
        <>
            <BaseLayout>
                <div className="col-md-8 mx-5 mt-4 mb-5">
                    <CloudAccountHeader />
                    <div className="h5 mt-3">{t('profile_info')}</div>
                    <div className="mt-3 ">
                        <CustomInputWithLabel
                            autoComplete="orgName"
                            value={orgName}
                            onChange={orgNameChagehandler}
                            placeHolder={t('friendly_organisation_name')}
                            hasError={orgNameHasError}
                            onBlur={orgNameBlurHandler}
                            errorMessage={
                                orgNameHasError && orgName
                                    ? orgName.length < ORGNAME_MIN_LENGTH
                                        ? t('min_length') + ' ' + ORGNAME_MIN_LENGTH + '.'
                                        : t('max_length') + ' ' + ORGNAME_MAX_LENGTH + '.'
                                    : t('organisation_name_required') + ''
                            }
                            label={'*' + t('organisation_name')}
                        />
                        {/*  8th May - remove 'responsibilities' selection from the initial login screen
                        <CustomInputWithLabel
                            autoComplete="responsibilities"
                            value={responsibilities}
                            onChange={responsibilitiesChagehandler}
                            placeHolder={t('responsibilities')}
                            hasError={responsibilitiesHasError}
                            onBlur={responsibilitiesBlurHandler}
                            errorMessage={t('required')}
                            label={'*' + t('responsibilities')}
                            isDropdown
                            dropdownValues={Responsibilities}
                            isMultiple
                        /> */}
                    </div>
                </div>
                {/* 8th May - We've decided to enable sandbox account by default.  
                <div className="col-md-12 mx-5 mt-4 mb-5">
                    <div className="h5 mt-5">{t('lets_get_started')}</div>
                    <div className="d-flex justify-content-between mb-4 mt-4">
                        <div className="d-flex flex-column w-50 custom-border-right me-5 border-right">
                            <button
                                type="button"
                                className={`w-70  btn btn-custom btn-tab justify-content-center align-items-center ${selectedAccountType === SANDBOX_ACCOUNT ? 'selected' : ''
                                    }`}
                                onClick={() => setSelectedAccountType(SANDBOX_ACCOUNT)}
                                title={t(`try_out_sandbox`)}
                            >
                                {t(`try_out_sandbox`)}
                            </button>
                            <div className="font-x-small-medium text-justify mt-3">{t(`try_out_sandbox_text`)}</div>
                            <hr className="hr-vertical h-80" />
                        </div>
                        <div className="d-flex flex-column w-50 ms-5">
                            <button
                                type="button"
                                className={`w-70 btn btn-custom btn-tab justify-content-center align-items-center ${selectedAccountType === OWN_ACCOUNT ? 'selected' : ''
                                    }`}
                                onClick={() => setSelectedAccountType(OWN_ACCOUNT)}
                                title={t('onboard_your_account')}
                            >
                                {t('onboard_your_account')}
                            </button>
                            <div className="font-x-small-medium text-justify mt-3">
                                {t('onboard_your_account_text')}
                            </div>
                        </div>
                    </div>
                </div> 
                */}
            </BaseLayout>
            <div className="bottom-fixed-bar">
                <AuthButton
                    title={t('Save and Proceed')}
                    buttonType="md"
                    onClick={onClickProceed}
                    className="float-end mx-2 mt-1"
                    enable={isValid()}
                />
            </div>
        </>
    );
};

export default InitialSetup;
