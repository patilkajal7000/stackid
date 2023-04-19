import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthLayout from 'core/container/AuthLayout';
import CustomInput from 'shared/components/input/CustomInput';
import { useCookies } from 'react-cookie';
import useInput from 'shared/hooks/use-input';
import { login } from 'core/services/AuthAPISerivce';
import { useDispatch } from 'react-redux';
import { setAuthTokens } from 'store/actions/AuthActions';
import AuthButton from 'shared/components/buttons/AuthButton';
import {
    checkLengthValidation,
    emptyStringValidation,
    LengthRegex,
    validateEmail,
} from 'shared/service/ValidationService';
import GoogleSignIn from 'shared/components/google_sign_in/GoogleSignIn';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';
import { getEncrytedString } from 'shared/service/AuthService';
import { ORGANIZATION_NAME_COOKIE, ORGNAME_MAX_LENGTH, ORGNAME_MIN_LENGTH } from 'shared/utils/Constants';

const Login = () => {
    const navigate = useNavigate();
    const [cookies] = useCookies();
    const [selectedOrganization, setSelectedOrganization] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const domainName = window.location.hostname;
    const {
        value: organisationName,
        hasError: organisationNameHasError,
        valueChangeHandler: organisationNameChagehandler,
        inputBlurHandler: organisationNameBlurHandler,
        isValid: organisationNameIsValid,
    } = useInput((value: any) => checkLengthValidation(value, LengthRegex(ORGNAME_MIN_LENGTH, ORGNAME_MAX_LENGTH)));

    const {
        value: bussinessEmailId,
        hasError: bussinessEmailIdHasError,
        valueChangeHandler: bussinessEmailIdChagehandler,
        inputBlurHandler: bussinessEmailIdBlurHandler,
        isValid: bussinessEmailIdIsValid,
    } = useInput(validateEmail);

    const {
        value: userPassword,
        hasError: passwordHasError,
        valueChangeHandler: passwordChagehandler,
        inputBlurHandler: passwordBlurHandler,
        isValid: passwordIsValid,
    } = useInput(emptyStringValidation);

    const [isLoading, setIsLoading] = useState(false);

    const onLogin = async (event: any) => {
        event.preventDefault();
        if (!organisationNameIsValid) organisationNameBlurHandler();
        if (!bussinessEmailIdIsValid) bussinessEmailIdBlurHandler();
        if (!passwordIsValid) passwordBlurHandler();
        if (organisationNameIsValid && bussinessEmailIdIsValid && passwordIsValid) {
            setIsLoading(true);
            const body = {
                organisation: organisationName.trim(),
                email: bussinessEmailId.trim(),
                password: await getEncrytedString(userPassword.trim()),
            };

            login(body)
                .then((res: any) => {
                    setIsLoading(false);
                    if (res && res.access_token) {
                        const user_data = {
                            accessToken: res.access_token,
                            refreshToken: res.refresh_token,
                            user: res.user,
                            status: res.status,
                        };

                        dispatch(setAuthTokens(user_data));

                        navigate('/');
                    }
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    };

    useEffect(() => {
        if (cookies && cookies[ORGANIZATION_NAME_COOKIE]) {
            organisationNameChagehandler(cookies[ORGANIZATION_NAME_COOKIE]);
        }
    }, []);

    const isGoogleLoginLoading = (loading: boolean) => {
        setIsLoading(loading);
    };

    const isSelectOrganisation = (value: any) => {
        setSelectedOrganization(value);
    };

    return (
        <AuthLayout>
            <div className="h1">{t('welcome')}</div>
            <div className="font-large mb-3">{t('tagline')}</div>
            {!selectedOrganization && (
                <>
                    <form onSubmit={onLogin}>
                        <CustomInput
                            autoComplete="organisationName"
                            value={organisationName}
                            onChange={organisationNameChagehandler}
                            placeHolder={'*' + t('organisation_name')}
                            hasError={organisationNameHasError}
                            onBlur={organisationNameBlurHandler}
                            errorMessage={
                                organisationNameHasError && organisationName
                                    ? organisationName.length < ORGNAME_MIN_LENGTH
                                        ? t('min_length') + ' ' + ORGNAME_MIN_LENGTH + '.'
                                        : t('max_length') + ' ' + ORGNAME_MAX_LENGTH + '.'
                                    : t('organisation_name_required') + ''
                            }
                        />
                        <CustomInput
                            autoComplete="emailId"
                            value={bussinessEmailId}
                            onChange={bussinessEmailIdChagehandler}
                            placeHolder={'*' + t('bussiness_email')}
                            hasError={bussinessEmailIdHasError}
                            onBlur={bussinessEmailIdBlurHandler}
                            errorMessage={
                                bussinessEmailId ? t('bussiness_email_invalid') + '' : t('email_required') + ''
                            }
                        />
                        <CustomInput
                            autoComplete="userPassword"
                            value={userPassword}
                            onChange={passwordChagehandler}
                            onBlur={passwordBlurHandler}
                            placeHolder={'*' + t('user_password')}
                            isPassword
                            hasError={passwordHasError}
                            errorMessage={t('password_required') + ''}
                        />
                        <div className="w-100 d-flex mb-4 mt-2 font-small">
                            <div>{t('forgot_password')}? </div>
                            <button
                                tabIndex={-1}
                                type="button"
                                onClick={() => navigate('/forgot-password')}
                                className="btn btn-link px-1 py-0"
                            >
                                <div className="btn-custom btn-link font-weight-normal">{t('reset_password_here')}</div>
                            </button>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <AuthButton
                                title={t('login')}
                                onClick={onLogin}
                                isLoading={isLoading}
                                buttonType="md"
                                className="w-70"
                            />
                        </div>
                    </form>

                    {/* Enabled User Registration for Dev and QA  */}

                    {domainName === 'staging-portal.acs.stackidentity.com' ||
                    domainName === 'portal.acs.stackidentity.com' ? null : (
                        <div className="d-flex align-items-center justify-content-center mt-2 font-small">
                            <div>{t('dont_have_account')}? </div>
                            <button onClick={() => navigate('/register')} className="btn btn-link px-1 py-0">
                                <div className="btn-custom btn-link font-weight-normal">{t('sign_up')}</div>
                            </button>
                        </div>
                    )}
                </>
            )}
            <div className="d-flex align-items-center justify-content-center mt-2">
                <GoogleSignIn
                    isSelectOrganisation={isSelectOrganisation}
                    onFailure={() => null}
                    setLoading={isGoogleLoginLoading}
                />
            </div>
        </AuthLayout>
    );
};

export default Login;
