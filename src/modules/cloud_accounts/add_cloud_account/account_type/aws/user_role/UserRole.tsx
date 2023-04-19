import React, { useEffect } from 'react';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import useInput from 'shared/hooks/use-input';
import { checkLengthValidation, LengthRegex } from 'shared/service/ValidationService';

const MIN_VAL = 20;
const MAX_VAL = 2048;

type UserRoleProps = {
    setValues: (role: string | null) => void;
    translate: any;
    previousAssumeRoleArn: string | null;
};

const UserRole = (props: UserRoleProps) => {
    const {
        value: role,
        hasError: roleHasError,
        valueChangeHandler: roleChagehandler,
        inputBlurHandler: roleBlurHandler,
        isValid: roleIsValid,
    } = useInput((value: any) => checkLengthValidation(value, LengthRegex(MIN_VAL, MAX_VAL)));

    useEffect(() => {
        if (props.previousAssumeRoleArn) {
            roleChagehandler(props.previousAssumeRoleArn);
        }
    }, []);

    useEffect(() => {
        if (roleIsValid) {
            props.setValues(role);
        } else {
            props.setValues(null);
        }
    }, [role]);

    return (
        <div>
            <div className="font-small-semibold">
                {props.translate('step')} 1: {props.translate('login_aws')}{' '}
            </div>
            <div className="font-x-small-medium mb-3 mt-1">{props.translate('login_aws_text')}</div>
            <div className="font-small-semibold">
                {props.translate('step')} 2: {props.translate('step2_title')}
            </div>
            <div className="font-x-small-medium mt-1">{props.translate('step2_decs')}</div>

            <div className="font-small-semibold mt-3">
                {props.translate('step')} 3: {props.translate('step3_title')}
            </div>
            <div className="font-x-small-medium mt-1 mb-3">{props.translate('step3_decs')}</div>

            <CustomInputWithLabel
                autoComplete="siRoleArn"
                value={role}
                onChange={roleChagehandler}
                placeHolder={props.translate('enter_here')}
                hasError={roleHasError}
                onBlur={roleBlurHandler}
                errorMessage={
                    role.length == 0
                        ? props.translate('si_role_arn') + ' is ' + props.translate('required' + '.')
                        : props.translate('si_role_arn_invalid') +
                          MIN_VAL +
                          ' ' +
                          props.translate('to') +
                          ' ' +
                          MAX_VAL +
                          '.'
                }
                label={'*' + props.translate('si_role_arn')}
            />
        </div>
    );
};

export default React.memo(UserRole);
