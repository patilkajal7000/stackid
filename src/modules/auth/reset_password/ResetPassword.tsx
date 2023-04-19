import React, { useCallback, useEffect, useState } from 'react';
import AuthLayout from 'core/container/AuthLayout';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthButton from 'shared/components/buttons/AuthButton';
import { resetPassword, verifyResetPasswordLink } from 'core/services/AuthAPISerivce';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';
import { IS_VALID, ToastVariant } from 'shared/utils/Constants';
import { getEncrytedString } from 'shared/service/AuthService';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { useDispatch } from 'react-redux';
import MultiplePassword from 'shared/components/multiplePassword/MultiplePassword';

const ResetPassword = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const tk = new URLSearchParams(location.search).get('tk');
    const verify = new URLSearchParams(location.search).get('verify');
    const [checkCode, setCheckCode] = useState();
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordValid, setUserPasswordValid] = useState(false);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (tk && verify) {
            verifyLink();
        } else {
            navigate('/');
        }
    }, []);

    const isPasswordValid = useCallback((callback: () => boolean) => {
        if (callback()) {
            setUserPasswordValid(true);
        } else {
            setUserPasswordValid(false);
        }
    }, []);

    const verifyLink = () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        verifyResetPasswordLink(tk!, location.search)
            .then((res: any) => {
                if (res?.status === IS_VALID) {
                    setCheckCode(res.check);
                } else {
                    navigate('/');
                }
            })
            .catch(() => {
                navigate('/');
            });
    };

    const onResetPassword = async (event: any) => {
        event.preventDefault();
        if (userPasswordValid && checkCode) {
            const body = {
                password: await getEncrytedString(userPassword.trim()),
                check: checkCode,
            };
            setIsLoading(true);
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            resetPassword(body, tk!, location.search)
                .then((res: any) => {
                    dispatch(setToastMessageAction(ToastVariant.SUCCESS, res?.message));
                    navigate('/');
                })
                .catch(() => setIsLoading(false));
        }
    };
    return (
        <AuthLayout>
            <div className="h1 font-weight-bold">{t('reset_password')}</div>
            <div className="font-large mb-4">{t('reset_password_tagline')}</div>

            <form onSubmit={onResetPassword}>
                <MultiplePassword t={t} onChangeValue={(val) => setUserPassword(val)} checkValid={isPasswordValid} />

                <div className="d-flex justify-content-center align-items-center">
                    <AuthButton title={t('reset')} onClick={onResetPassword} isLoading={isLoading} />
                </div>
            </form>
            <div className="d-flex align-items-center justify-content-center mb-2 mt-1">
                <Link to="/login">
                    <div className="btn-custom btn-link"> {t('cancel')}</div>
                </Link>
            </div>
        </AuthLayout>
    );
};

export default ResetPassword;
