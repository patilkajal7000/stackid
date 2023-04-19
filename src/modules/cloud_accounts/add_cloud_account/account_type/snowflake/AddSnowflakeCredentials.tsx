import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import useInput from 'shared/hooks/use-input';
import { SnowflakeCredentials } from 'shared/models/CloudAccountModel';
import { emptyStringValidation } from 'shared/service/ValidationService';

type SnowflakeCredentialsProps = {
    setValues: (connection_details: SnowflakeCredentials | null) => void;
    selectedOption: string;
};

const AddSnowflakeCredentials = (props: SnowflakeCredentialsProps) => {
    const { t } = useTranslation();
    const {
        value: username,
        hasError: usernameHasError,
        valueChangeHandler: usernameChangeHandler,
        inputBlurHandler: usernameBlurHandler,
        isValid: usernameIsValid,
    } = useInput(emptyStringValidation);

    const {
        value: password,
        hasError: passwordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
        isValid: passwordIsValid,
    } = useInput(emptyStringValidation);

    const {
        value: accountIdentifier,
        hasError: accountIdentifierHasError,
        valueChangeHandler: accountIdentifierChangeHandler,
        inputBlurHandler: accountIdentifierBlurHandler,
        isValid: accountIdentifierIsValid,
    } = useInput(emptyStringValidation);

    const {
        value: defaultRole,
        hasError: defaultRoleHasError,
        valueChangeHandler: defaultRoleChangeHandler,
        inputBlurHandler: defaultRoleBlurHandler,
        isValid: defaultRoleIsValid,
    } = useInput(emptyStringValidation);

    const {
        value: warehouse,
        hasError: warehouseHasError,
        valueChangeHandler: warehouseChangeHandler,
        inputBlurHandler: warehouseBlurHandler,
        isValid: warehouseIsValid,
    } = useInput(emptyStringValidation);

    useEffect(() => {
        if (
            (username && usernameIsValid) ||
            (password && passwordIsValid) ||
            (accountIdentifier && accountIdentifierIsValid) ||
            (defaultRole && defaultRoleIsValid) ||
            (warehouse && warehouseIsValid)
        ) {
            props.setValues({
                userName: username,
                password: password,
                accountIdentifier: accountIdentifier,
                defaultRole: defaultRole,
                warehouse: warehouse,
            });
        }
    }, [username, password, accountIdentifier, defaultRole, warehouse]);

    return (
        <div className="col-md-8 mx-5 pb-4">
            <h5 className="mt-2">{t('snowflake_credentials')}</h5>
            <div className="pb-5">
                <CustomInputWithLabel
                    autoComplete="UserName"
                    value={username}
                    onChange={usernameChangeHandler}
                    placeHolder={t('username')}
                    hasError={usernameHasError}
                    onBlur={usernameBlurHandler}
                    errorMessage={usernameHasError || !username ? t('username_required') + '' : ''}
                    label={'*' + t('username')}
                    customClass={'mt-2 mb-2'}
                />
                <CustomInputWithLabel
                    autoComplete="Password"
                    value={password}
                    onChange={passwordChangeHandler}
                    placeHolder={t('user_password')}
                    hasError={passwordHasError}
                    onBlur={passwordBlurHandler}
                    errorMessage={passwordHasError || !password ? t('user_password_required') + '' : ''}
                    label={'*' + t('user_password')}
                    customClass={'mt-2 mb-2'}
                    isPassword={true}
                />
                <CustomInputWithLabel
                    autoComplete="AccountIdentifier"
                    value={accountIdentifier}
                    onChange={accountIdentifierChangeHandler}
                    placeHolder={t('account_identifier')}
                    hasError={accountIdentifierHasError}
                    onBlur={accountIdentifierBlurHandler}
                    errorMessage={
                        accountIdentifierHasError || !accountIdentifier ? t('account_identifier_required') + '' : ''
                    }
                    label={'*' + t('account_identifier')}
                    customClass={'mt-2 mb-2'}
                />
                <CustomInputWithLabel
                    autoComplete="DefaultRole"
                    value={defaultRole}
                    onChange={defaultRoleChangeHandler}
                    placeHolder={t('default_role')}
                    hasError={defaultRoleHasError}
                    onBlur={defaultRoleBlurHandler}
                    errorMessage={defaultRoleHasError || !defaultRole ? t('default_role_required') + '' : ''}
                    label={'*' + t('default_role')}
                    customClass={'mt-2 mb-2'}
                />
                <CustomInputWithLabel
                    autoComplete="Warehouse"
                    value={warehouse}
                    onChange={warehouseChangeHandler}
                    placeHolder={t('warehouse')}
                    hasError={warehouseHasError}
                    onBlur={warehouseBlurHandler}
                    errorMessage={warehouseHasError || !warehouse ? t('warehouse_required') + '' : ''}
                    label={'*' + t('warehouse')}
                    customClass={'mt-2 mb-2'}
                />
            </div>
        </div>
    );
};

export default AddSnowflakeCredentials;
