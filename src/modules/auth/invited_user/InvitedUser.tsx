import AuthLayout from 'core/container/AuthLayout';
import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';
import useInput from 'shared/hooks/use-input';
import { checkLengthValidation, LengthRegex } from 'shared/service/ValidationService';
import AuthButton from 'shared/components/buttons/AuthButton';
import CustomInput from 'shared/components/input/CustomInput';
import { IS_VALID, NAME_MAX_LENGTH, NAME_MIN_LENGTH, ToastVariant } from 'shared/utils/Constants';
import { registerInvitedUser, verifyInvitedUserUrl } from 'core/services/AuthAPISerivce';
import { getEncrytedString } from 'shared/service/AuthService';
import { useDispatch } from 'react-redux';
import { setToastMessageAction } from 'store/actions/SingleActions';
import MultiplePassword from 'shared/components/multiplePassword/MultiplePassword';

const InvitedUser = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const tk = new URLSearchParams(location.search).get('tk');
    const verify = new URLSearchParams(location.search).get('verify');
    const [isLoading, setIsLoading] = useState(false);
    const [checkCode, setCheckCode] = useState();
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordValid, setUserPasswordValid] = useState(false);
    const dispatch = useDispatch();
    const {
        value: userName,
        hasError: nameHasError,
        valueChangeHandler: nameChagehandler,
        inputBlurHandler: nameBlurHandler,
        isValid: nameIsValid,
        reset: resetName,
    } = useInput((value: any) => checkLengthValidation(value, LengthRegex(NAME_MIN_LENGTH, NAME_MAX_LENGTH)));

    const resetDetails = () => {
        resetName();
    };

    useEffect(() => {
        resetDetails();
        if (tk && verify) {
            verifyLink();
        } else {
            navigate('/');
        }
    }, []);

    const isPasswordValid = useCallback(
        (callback: () => boolean) => {
            if (nameIsValid) {
                if (callback()) {
                    setUserPasswordValid(true);
                } else {
                    setUserPasswordValid(false);
                }
            }
        },
        [userName],
    );

    const verifyLink = () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        verifyInvitedUserUrl(tk!, location.search)
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

    const onSubmit = async (event: any) => {
        event.preventDefault();
        if (!nameIsValid) nameBlurHandler();
        if (nameIsValid && userPasswordValid) {
            setIsLoading(true);
            if (checkCode && userPassword) {
                const body = {
                    name: userName.trim(),
                    password: await getEncrytedString(userPassword.trim()),
                    check: checkCode,
                };
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                registerInvitedUser(tk!, body)
                    .then((res: any) => {
                        setIsLoading(false);
                        dispatch(setToastMessageAction(ToastVariant.SUCCESS, res?.message));
                        navigate('/');
                    })
                    .catch(() => setIsLoading(false));
            } else {
                setIsLoading(false);
                dispatch(setToastMessageAction(ToastVariant.WARNING, t('something_went_wrong')));
            }
        }
    };
    return (
        <AuthLayout>
            <div className="h1 font-weight-bold">
                {t('please')} {t('create_account')}
            </div>
            <form onSubmit={onSubmit} autoComplete="off">
                <CustomInput
                    autoComplete="off"
                    value={userName}
                    onChange={nameChagehandler}
                    placeHolder={'*' + t('name')}
                    hasError={nameHasError}
                    onBlur={nameBlurHandler}
                    errorMessage={
                        nameHasError && userName
                            ? userName.length < NAME_MIN_LENGTH
                                ? t('min_length') + ' ' + NAME_MIN_LENGTH + '.'
                                : t('max_length') + ' ' + NAME_MAX_LENGTH + '.'
                            : t('name_required') + ''
                    }
                />
                <MultiplePassword t={t} onChangeValue={(val) => setUserPassword(val)} checkValid={isPasswordValid} />

                <div className="d-flex justify-content-center align-items-center">
                    <AuthButton
                        title={t('submit')}
                        onClick={onSubmit}
                        isLoading={isLoading}
                        buttonType="lg"
                        className="w-75"
                    />
                </div>
            </form>
        </AuthLayout>
    );
};

export default InvitedUser;
