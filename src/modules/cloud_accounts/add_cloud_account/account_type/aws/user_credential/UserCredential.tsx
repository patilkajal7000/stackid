import React, { useEffect } from 'react';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import useInput from 'shared/hooks/use-input';
import { checkLengthValidation, LengthRegex } from 'shared/service/ValidationService';

type UserCredentialProps = {
    setValues: (accessKeyId: string | null, secretAccessKey: string | null) => void;

    translate: any;
};

const MIN_VAL = 16;
const MAX_VAL = 256;
const UserCredential = (props: UserCredentialProps) => {
    const {
        value: accessKeyId,
        hasError: accessKeyIdHasError,
        valueChangeHandler: accessKeyIdChagehandler,
        inputBlurHandler: accessKeyIdBlurHandler,
        isValid: accessKeyIdIsValid,
    } = useInput((value: any) => checkLengthValidation(value, LengthRegex(MIN_VAL, MAX_VAL)));
    const {
        value: secretAccessKey,
        hasError: secretAccessKeyHasError,
        valueChangeHandler: secretAccessKeyChagehandler,
        inputBlurHandler: secretAccessKeyBlurHandler,
        isValid: secretAccessKeyIsValid,
    } = useInput((value: any) => checkLengthValidation(value, LengthRegex(MIN_VAL, MAX_VAL)));

    useEffect(() => {
        if (accessKeyIdIsValid && secretAccessKeyIsValid) {
            props.setValues(accessKeyId, secretAccessKey);
        } else {
            props.setValues(null, null);
        }
    }, [accessKeyId, secretAccessKey]);

    return (
        <div>
            <div className="font-small-semibold">
                {props.translate('step')} 1: {props.translate('login_aws')}{' '}
            </div>
            <div className="font-x-small-medium mb-3 mt-1">{props.translate('login_aws_text')}</div>
            <div className="font-small-semibold">
                {props.translate('step')} 2: {props.translate('create_iam_user')}
            </div>
            <div className="font-x-small-medium mt-1">{props.translate('create_iam_user_decs')}</div>

            <div className="font-small-semibold mt-3 mb-3">
                {props.translate('step')} 3: {props.translate('access_key_secret_key_id_text')}
            </div>

            <CustomInputWithLabel
                autoComplete="cloudName"
                value={accessKeyId}
                onChange={accessKeyIdChagehandler}
                placeHolder={props.translate('access_key_id')}
                hasError={accessKeyIdHasError}
                onBlur={accessKeyIdBlurHandler}
                errorMessage={
                    accessKeyIdHasError && accessKeyId
                        ? accessKeyId.length == 0
                            ? props.translate('access_key_id_required')
                            : props.translate('access_key_id_not_valid') +
                              MIN_VAL +
                              ' ' +
                              props.translate('to') +
                              ' ' +
                              MAX_VAL +
                              '.'
                        : props.translate('access_key_id_required')
                }
                label={'*' + props.translate('access_key_id')}
                isPassword
                showButton={false}
            />
            <CustomInputWithLabel
                autoComplete="cloudName"
                value={secretAccessKey}
                onChange={secretAccessKeyChagehandler}
                placeHolder={props.translate('secret_access_key')}
                hasError={secretAccessKeyHasError}
                onBlur={secretAccessKeyBlurHandler}
                errorMessage={
                    secretAccessKey && secretAccessKey
                        ? secretAccessKey.length == 0
                            ? props.translate('secret_access_key_required')
                            : props.translate('secret_access_key_not_valid') +
                              MIN_VAL +
                              ' ' +
                              props.translate('to') +
                              ' ' +
                              MAX_VAL +
                              '.'
                        : props.translate('secret_access_key_required')
                }
                label={'*' + props.translate('secret_access_key')}
                isPassword
                showButton={false}
            />
        </div>
    );
};

export default React.memo(UserCredential);
