import React, { useCallback, useState } from 'react';
import AuthLayout from 'core/container/AuthLayout';
import { useNavigate } from 'react-router-dom';
import { checkLengthValidation, LengthRegex, validateEmail } from 'shared/service/ValidationService';
import useInput from 'shared/hooks/use-input';
import { signUp } from 'core/services/AuthAPISerivce';
import GoogleSignIn from 'shared/components/google_sign_in/GoogleSignIn';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';
import { getEncrytedString } from 'shared/service/AuthService';
import { MAXVIEW, MINVIEW, NAME_MAX_LENGTH, NAME_MIN_LENGTH, ToastVariant } from 'shared/utils/Constants';
import CustomInput from 'shared/components/input/CustomInput';
import AuthButton from 'shared/components/buttons/AuthButton';
import reCAPTCHA from 'shared/components/reCaptcha';
import MultiplePassword from 'shared/components/multiplePassword/MultiplePassword';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { useDispatch } from 'react-redux';

const Register = () => {
    const [isLoading, setIsLoading] = useState(false);
    const { t } = useTranslation();
    const [selectedOrganization, setSelectedOrganization] = useState(false);
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordValid, setUserPasswordValid] = useState(false);
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const recaptcha = new reCAPTCHA(import.meta.env.VITE_RECAPTCHA_SITE_KEY!, 'importantAction');
    const [checkEmailScreen, setCheckEmailScreen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const {
        value: name,
        hasError: nameHasError,
        valueChangeHandler: nameChagehandler,
        inputBlurHandler: nameBlurHandler,
        isValid: nameIsValid,
    } = useInput((value: any) => checkLengthValidation(value, LengthRegex(NAME_MIN_LENGTH, NAME_MAX_LENGTH)));

    const {
        value: bussinessEmailId,
        hasError: bussinessEmailIdHasError,
        valueChangeHandler: bussinessEmailIdChagehandler,
        inputBlurHandler: bussinessEmailIdBlurHandler,
        isValid: bussinessEmailIdIsValid,
    } = useInput(validateEmail);

    const onSignup = async (event: any) => {
        event.preventDefault();
        if (!nameIsValid) {
            nameBlurHandler();
            return;
        }
        if (!bussinessEmailIdIsValid) {
            bussinessEmailIdBlurHandler();
            return;
        }
        if (nameIsValid && bussinessEmailIdIsValid && userPasswordValid) {
            setIsLoading(true);
            const token: string = await recaptcha.getToken();
            const body = {
                name: name.trim(),
                email: bussinessEmailId.trim(),
                password: await getEncrytedString(userPassword.trim()),
                recap: token,
            };
            signUp(body)
                .then(() => {
                    setIsLoading(false);
                    dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'Sign-up process is now complete.'));
                    setCheckEmailScreen(true);
                })
                .catch(() => {
                    setIsLoading(false);
                });
        }
    };

    const isGoogleLoginLoading = (loading: boolean) => {
        setIsLoading(loading);
    };

    const isSelectOrganisation = (value: any) => {
        setSelectedOrganization(value);
    };

    const isPasswordValid = useCallback(
        (callback: () => boolean) => {
            if (bussinessEmailIdIsValid) {
                if (callback()) {
                    setUserPasswordValid(true);
                } else {
                    setUserPasswordValid(false);
                }
            }
        },
        [bussinessEmailId],
    );
    return (
        <AuthLayout withIcon={checkEmailScreen} columSize={checkEmailScreen ? MINVIEW : MAXVIEW}>
            {checkEmailScreen ? (
                <div>
                    <div className="h1 font-weight-bold">{t('check_your_email')}</div>
                    <div className="font-large">
                        {t('email_sent_text_1')} {bussinessEmailId}
                        {t('email_sent_text_2')}
                    </div>
                    <div className="mt-2  font-small d-flex">
                        <div>{t('wrong_email')} </div>
                        <button onClick={() => setCheckEmailScreen(false)} className="btn btn-link px-1 py-0">
                            <div className="btn-custom btn-link font-weight-normal">{t('re_enter_email')}</div>
                        </button>
                    </div>
                </div>
            ) : (
                <div className="d-flex">
                    <div className="col-md-6 jus">
                        <img src={require('assets/images/Logo.png')} alt="Logo" />
                        <div className="h2 mt-4">{t('tagline')}</div>
                        <div className="font-medium mt-4">{t('tagline_text')}</div>
                    </div>
                    <div className="col-md-6">
                        {!selectedOrganization && (
                            <>
                                <form onSubmit={onSignup}>
                                    <div className="h5 mb-2">{t('create_account_text')}</div>
                                    <CustomInput
                                        autoComplete="name"
                                        value={name}
                                        onChange={nameChagehandler}
                                        placeHolder={'*' + t('name')}
                                        hasError={nameHasError}
                                        onBlur={nameBlurHandler}
                                        errorMessage={
                                            nameHasError && name
                                                ? name.length < NAME_MIN_LENGTH
                                                    ? t('min_length') + ' ' + NAME_MIN_LENGTH + '.'
                                                    : t('max_length') + ' ' + NAME_MAX_LENGTH + '.'
                                                : t('name_required') + ''
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
                                            bussinessEmailId
                                                ? t('bussiness_email_invalid') + ''
                                                : t('email_required') + ''
                                        }
                                    />
                                    <MultiplePassword
                                        t={t}
                                        onChangeValue={(val) => setUserPassword(val)}
                                        checkValid={isPasswordValid}
                                    />
                                    <div className="d-flex justify-content-center align-items-center">
                                        <AuthButton
                                            title={t('sign_up')}
                                            onClick={onSignup}
                                            isLoading={isLoading}
                                            buttonType="md"
                                            className="w-70"
                                        />
                                    </div>
                                </form>
                                <div className="d-flex align-items-center justify-content-center mt-1 font-small">
                                    <span>{t('already_have_account')}?</span>
                                    <button onClick={() => navigate('/login')} className="btn btn-link px-1">
                                        <div className="btn-custom btn-link font-weight-normal">{t('sign_in')}</div>
                                    </button>
                                </div>
                            </>
                        )}
                        <div className="d-flex align-items-center justify-content-center mt-1">
                            <GoogleSignIn
                                isSelectOrganisation={isSelectOrganisation}
                                onFailure={(error) => console.log(error)}
                                setLoading={isGoogleLoginLoading}
                            />
                        </div>
                        <div className="font-x-small-medium mt-3">
                            <span>{t('recaptch_site_text')}</span>
                            <a
                                href="https://policies.google.com/privacy"
                                className="mx-1"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t('policies')}
                            </a>
                            <span>{t('and')}</span>
                            <a
                                className="mx-1"
                                href="https://policies.google.com/terms"
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t('terms_and_service')}
                            </a>
                            <span>{t('apply')}.</span>
                        </div>
                    </div>
                </div>
            )}
        </AuthLayout>
    );
};

export default Register;
