import React, { useEffect, useState } from 'react';
import AuthLayout from 'core/container/AuthLayout';
import { Link, useNavigate } from 'react-router-dom';
import CustomInput from 'shared/components/input/CustomInput';
import useInput from 'shared/hooks/use-input';
import { checkLengthValidation, LengthRegex, validateEmail } from 'shared/service/ValidationService';
import AuthButton from 'shared/components/buttons/AuthButton';
import reCAPTCHA from 'shared/components/reCaptcha';
import { forgotPassword } from 'core/services/AuthAPISerivce';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';
import { useCookies } from 'react-cookie';
import { ORGANIZATION_NAME_COOKIE, ORGNAME_MAX_LENGTH, ORGNAME_MIN_LENGTH, ToastVariant } from 'shared/utils/Constants';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { useDispatch } from 'react-redux';

const ForgotPassword = () => {
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const recaptcha = new reCAPTCHA(import.meta.env.VITE_RECAPTCHA_SITE_KEY!, 'importantAction');
    const { t } = useTranslation();
    const [cookies] = useCookies();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const {
        value: registeredEmailId,
        hasError: registeredEMailIdError,
        valueChangeHandler: registeredEMailIdChagehandler,
        inputBlurHandler: registeredEMailIdBlurHandler,
        isValid: registeredEMailIdIsValid,
    } = useInput(validateEmail);
    const {
        value: organisationName,
        hasError: organisationNameHasError,
        valueChangeHandler: organisationNameChagehandler,
        inputBlurHandler: organisationNameBlurHandler,
        isValid: organisationNameIsValid,
    } = useInput((value: any) => checkLengthValidation(value, LengthRegex(ORGNAME_MIN_LENGTH, ORGNAME_MAX_LENGTH)));

    const dispatch = useDispatch();

    const onForrgotPassword = async (event: any) => {
        event.preventDefault();
        if (!registeredEMailIdIsValid) registeredEMailIdBlurHandler();
        if (!organisationNameIsValid) organisationNameBlurHandler();

        if (registeredEMailIdIsValid && organisationNameIsValid) {
            setIsLoading(true);
            const token: string = await recaptcha.getToken();
            const body = {
                recap: token,
                email: registeredEmailId.trim(),
                organisation: organisationName.trim(),
            };
            forgotPassword(body)
                .then((res: any) => {
                    dispatch(
                        setToastMessageAction(
                            ToastVariant.SUCCESS,
                            res?.message ? res.message : 'Password reset mail sent',
                        ),
                    );
                    navigate('/');
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
    return (
        <AuthLayout>
            <div className="h1 font-weight-bold">
                {t('enter')} {t('register_email_id')}
            </div>
            <div className="font-large mb-4">{t('email_will_send_text')}</div>
            <form onSubmit={onForrgotPassword}>
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
                    value={registeredEmailId}
                    onChange={registeredEMailIdChagehandler}
                    placeHolder={'*' + t('register_email_id')}
                    hasError={registeredEMailIdError}
                    onBlur={registeredEMailIdBlurHandler}
                    errorMessage={registeredEmailId ? t('bussiness_email_invalid') + '' : t('email_required') + ''}
                />
                <div className="d-flex justify-content-center align-items-center mt-4">
                    <AuthButton title="Send Email" onClick={onForrgotPassword} isLoading={isLoading} />
                </div>
            </form>
            <div className="d-flex align-items-center justify-content-center">
                <Link to="/login">
                    <div className="btn-custom btn-link"> {t('cancel')}</div>
                </Link>
            </div>
            <div className="mt-2 font-small">
                <span>{t('recaptch_site_text')}</span>
                <a className="mx-1" href="https://policies.google.com/privacy" target="_blank" rel="noreferrer">
                    {t('policies')}
                </a>
                <span>{t('and')}</span>
                <a className="mx-1" href="https://policies.google.com/terms" target="_blank" rel="noreferrer">
                    {t('terms_and_service')}
                </a>
                <span>{t('apply')}.</span>
            </div>
        </AuthLayout>
    );
};

export default ForgotPassword;
