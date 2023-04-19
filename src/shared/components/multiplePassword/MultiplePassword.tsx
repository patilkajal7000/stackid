import React, { useCallback, useEffect } from 'react';
import type { TFunction } from 'i18next';
import useInput from 'shared/hooks/use-input';
import { validatePassword, checkPasswordMatch } from 'shared/service/ValidationService';
import CustomInput from '../input/CustomInput';
import CustomInputWithLabel from '../input/CustomInputWithLabel';

type MultiplePasswordProps = {
    t: TFunction;
    onChangeValue: (value: string) => void;
    checkValid: (callback: () => any) => void;
    withLabel?: boolean;
};

const MultiplePassword = ({ t, onChangeValue, checkValid, withLabel }: MultiplePasswordProps) => {
    const {
        value: userPassword,
        hasError: passwordError,
        valueChangeHandler: passwordChagehandler,
        inputBlurHandler: passwordBlurHandler,
        isValid: passwordIsValid,
        isTouched: isPasswordTouched,
    } = useInput(validatePassword);

    const {
        value: reenterPassword,
        hasError: reenterPasswordError,
        valueChangeHandler: reenterPasswordChagehandler,
        inputBlurHandler: reenterPasswordBlurHandler,
        isValid: reenterPasswordIsValid,
    } = useInput((val: string) => checkPasswordMatch(val, userPassword));

    useEffect(() => {
        onChangeValue(userPassword);
    }, [userPassword]);

    useEffect(() => {
        checkValid(checkStatus);
    });
    const checkStatus = useCallback(() => {
        if (!isPasswordTouched) {
            return false;
        }
        if (!passwordIsValid) {
            passwordBlurHandler();
            return false;
        }
        if (!reenterPasswordIsValid) {
            reenterPasswordBlurHandler();
            return false;
        }
        return true;
    }, [reenterPassword, userPassword]);

    if (withLabel) {
        return (
            <>
                <CustomInputWithLabel
                    autoComplete="off"
                    value={userPassword}
                    onChange={passwordChagehandler}
                    onBlur={passwordBlurHandler}
                    placeHolder={t('user_password')}
                    isPassword
                    hasError={passwordError}
                    errorMessage={
                        userPassword
                            ? t('passwor_must') + ' ' + t('password_format').toLowerCase()
                            : t('password_required') + ''
                    }
                    label={'*' + t('user_password')}
                />
                <CustomInputWithLabel
                    autoComplete="off"
                    value={reenterPassword}
                    onChange={reenterPasswordChagehandler}
                    placeHolder={t('reenter_password')}
                    hasError={reenterPasswordError}
                    onBlur={reenterPasswordBlurHandler}
                    errorMessage={reenterPassword ? t('password_not_match') + '' : t('reenter_password_required') + ''}
                    isPassword
                    showButton={false}
                    label={'*' + t('reenter_password')}
                />
                <div className="w-100 d-flex mb-2 font-small">{t('password_format')}</div>
                {/* <div className="w-100 d-flex mb-3 font-small">
                    <span>{t('Terms_of_Service_format')}</span>
                    <a
                        href="https://www.stackidentity.com/docs/terms"
                        className="mx-1 btn-custom btn-link font-weight-normal"
                        target="_blank"
                        rel="noreferrer"
                    >
                        {t('Terms_of_Service')}
                    </a>
                </div> */}
            </>
        );
    }
    return (
        <>
            <CustomInput
                autoComplete="off"
                value={userPassword}
                onChange={passwordChagehandler}
                onBlur={passwordBlurHandler}
                placeHolder={'*' + t('user_password')}
                isPassword
                hasError={passwordError}
                errorMessage={
                    userPassword
                        ? t('passwor_must') + ' ' + t('password_format').toLowerCase()
                        : t('password_required') + ''
                }
            />
            <CustomInput
                autoComplete="off"
                value={reenterPassword}
                onChange={reenterPasswordChagehandler}
                placeHolder={'*' + t('reenter_password')}
                hasError={reenterPasswordError}
                onBlur={reenterPasswordBlurHandler}
                errorMessage={reenterPassword ? t('password_not_match') + '' : t('reenter_password_required') + ''}
                isPassword
                showButton={false}
            />
            <div className="w-100 d-flex mb-2 font-small">{t('password_format')}</div>
            <div className="w-100 d-flex mb-3 font-small">
                <span>{t('Terms_of_Service_format')}</span>
                <a
                    tabIndex={-1}
                    href="https://www.stackidentity.com/docs/terms"
                    className="mx-1 btn-custom btn-link font-weight-normal "
                    target="_blank"
                    rel="noreferrer"
                >
                    {t('Terms_of_Service')}
                </a>
            </div>
        </>
    );
};

export default MultiplePassword;
