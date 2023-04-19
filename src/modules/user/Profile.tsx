import BaseLayout from 'core/container/BaseLayout';
import React, { useCallback, useEffect, useState } from 'react';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import useInput from 'shared/hooks/use-input';
import { checkLengthValidation, emptyStringValidation, LengthRegex } from 'shared/service/ValidationService';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';
import AuthButton from 'shared/components/buttons/AuthButton';
import {
    NAME_MAX_LENGTH,
    NAME_MIN_LENGTH,
    ORGNAME_MAX_LENGTH,
    ORGNAME_MIN_LENGTH,
    Responsibilities,
    USERS_ROLE_VALUE,
} from 'shared/utils/Constants';
import MultiplePassword from 'shared/components/multiplePassword/MultiplePassword';
import { getCurrentUser, updateCurrentUser, updateOrgName } from 'core/services/userManagementAPIService';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store/store';
import { updateUser } from 'store/actions/AuthActions';
import CustomModal from 'shared/components/custom_modal/CustomModal';
import { getEncrytedString } from 'shared/service/AuthService';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import CIcon from '@coreui/icons-react';
import { cilPencil } from '@coreui/icons';
import { CAvatar } from '@coreui/react';
import { getInitials } from 'shared/utils/Services';

const Profile = () => {
    const { t } = useTranslation();
    const user = useSelector((state: AppState) => state.authState.user);
    const dispatch = useDispatch();
    const [userPassword, setUserPassword] = useState('');
    const [userPasswordValid, setUserPasswordValid] = useState(false);
    const [responsibilitiesChangeModal, setResponsibilitiesChangeModal] = useState(false);
    const [nameChangeModal, setNameChangeModal] = useState(false);
    const [orgNameChangeModal, setOrgNameChangeModal] = useState(false);
    const [passwordModalSHow, setPasswordModalSHow] = useState(false);
    const {
        value: name,
        hasError: nameHasError,
        valueChangeHandler: nameChagehandler,
        inputBlurHandler: nameBlurHandler,
        isValid: nameIsValid,
    } = useInput((value: any) => checkLengthValidation(value, LengthRegex(NAME_MIN_LENGTH, NAME_MAX_LENGTH)));

    const {
        value: orgName,
        hasError: orgNameHasError,
        valueChangeHandler: orgNameChagehandler,
        inputBlurHandler: orgNameBlurHandler,
        isValid: orgNameIsValid,
    } = useInput((value: any) => checkLengthValidation(value, LengthRegex(ORGNAME_MIN_LENGTH, ORGNAME_MAX_LENGTH)));
    const {
        value: responsibilities,
        hasError: responsibilitiesHasError,
        valueChangeHandler: responsibilitiesChagehandler,
        inputBlurHandler: responsibilitiesBlurHandler,
        isValid: responsibilitiesIsValid,
    } = useInput(emptyStringValidation);
    const {
        value: userCurrentPassword,
        hasError: userCurrentPasswordError,
        valueChangeHandler: userCurrentPasswordChagehandler,
        inputBlurHandler: userCurrentPasswordBlurHandler,
        isValid: userCurrentPasswordIsValid,
        reset: resetUserCurrentPassword,
    } = useInput(emptyStringValidation);

    const isPasswordValid = useCallback((callback: () => boolean) => {
        if (callback()) {
            setUserPasswordValid(true);
        } else {
            setUserPasswordValid(false);
        }
    }, []);

    useEffect(() => {
        dispatch(setTabsAction('', '')); //to hide subheader
        dispatch(setBreadcrumbAction([])); //to hide breadcrumb
        nameChagehandler(user?.name);
        user?.responsibilities && responsibilitiesChagehandler(user?.responsibilities.toString());
        user?.org.name && orgNameChagehandler(user.org.name);
    }, [user]);

    const getUser = () => {
        getCurrentUser().then((res: any) => {
            dispatch(updateUser(res));
        });
    };

    const onUpdateName = () => {
        if (!nameIsValid) {
            nameBlurHandler();
            return;
        }

        onChangeUserProfile({ name: name }, () => setNameChangeModal(false));
    };
    const onUpdateResponsibilities = () => {
        if (!responsibilitiesIsValid) {
            responsibilitiesBlurHandler();
            return;
        }
        onChangeUserProfile({ responsibilities: responsibilities.split(',') }, () =>
            setResponsibilitiesChangeModal(false),
        );
    };
    const onUpdateOrgName = () => {
        if (!orgNameIsValid) {
            orgNameBlurHandler();
            return;
        }

        updateOrgName({ name: orgName.trim() }).then(() => {
            setOrgNameChangeModal(false), getUser();
        });
    };
    const onChangePasword = async () => {
        if (!userCurrentPasswordIsValid) {
            userCurrentPasswordBlurHandler();
            return;
        }
        if (!userPasswordValid) {
            return;
        }
        onChangeUserProfile(
            {
                currentPassword: await getEncrytedString(userCurrentPassword.trim()),
                password: await getEncrytedString(userPassword.trim()),
            },
            () => setPasswordModalSHow(false),
        );
    };
    const onChangeUserProfile = (body: any, callback: () => void) => {
        updateCurrentUser(body).then(() => {
            callback();
            getUser();
        });
    };

    return (
        <BaseLayout>
            <div className="h5 text-primary mb-4">{t('welcome_your_profile')}</div>
            <div className="d-flex">
                <div className="card custom-card profile-card">
                    <CIcon
                        icon={cilPencil}
                        size="xxl"
                        onClick={() => setNameChangeModal(true)}
                        className="custom-icon-outline position-absolute m-2 cursor-pointer"
                    />
                    <div className="d-flex flex-column justify-content-between align-items-center p-5">
                        <div className="profile-image p-2">
                            <CAvatar color="primary" textColor="white" size="lg">
                                {user?.name && getInitials(user?.name)}
                            </CAvatar>
                        </div>
                        <div className="mt-2">
                            <div className="h3 text-primary text-nowrap">{user?.name}</div>
                        </div>
                        <div className="h5">
                            {user?.roles.map((user: typeof USERS_ROLE_VALUE) => USERS_ROLE_VALUE[user])}
                        </div>
                    </div>
                </div>
                <div className="d-flex flex-column justify-content-around flex-fill mx-5">
                    <div className="d-flex justify-content-between">
                        <GetHeadingWithValue
                            title={t('organisation_name')}
                            onClick={() => setOrgNameChangeModal(true)}
                            withIcon
                            value={user?.org.name}
                        />
                        <GetHeadingWithValue title={t('email')} value={user?.email} />
                    </div>
                    <GetHeadingWithValue
                        title={t('responsibilities')}
                        onClick={() => setResponsibilitiesChangeModal(true)}
                        withIcon
                        value={user?.responsibilities && user.responsibilities.toString().replaceAll(',', ', ')}
                    />
                    <div className="d-flex">
                        <AuthButton
                            title={`${t('reset_password')}`}
                            buttonType="md"
                            onClick={() => setPasswordModalSHow(true)}
                            className="mx-0"
                        />
                    </div>
                </div>
            </div>
            <CustomModal show={responsibilitiesChangeModal} onHide={() => setResponsibilitiesChangeModal(false)}>
                <div className="d-flex flex-column">
                    <div className="h5 mt-2">
                        {t('edit')} {t('responsibilities')}
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <CustomInputWithLabel
                            autoComplete="responsibilities"
                            value={responsibilities}
                            onChange={responsibilitiesChagehandler}
                            placeHolder={t('responsibilities')}
                            hasError={responsibilitiesHasError}
                            onBlur={responsibilitiesBlurHandler}
                            errorMessage={t('required') + ''}
                            label={'*' + t('responsibilities')}
                            isDropdown
                            dropdownValues={Responsibilities}
                            isMultiple
                        />
                        <AuthButton title={`${t('save')}`} buttonType="md" onClick={onUpdateResponsibilities} />
                    </div>
                </div>
            </CustomModal>
            <CustomModal show={nameChangeModal} onHide={() => setNameChangeModal(false)}>
                <div className="d-flex flex-column">
                    <div className="h5 mt-2">
                        {t('edit')} {t('name')}
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <CustomInputWithLabel
                            autoComplete="name"
                            value={name}
                            onChange={nameChagehandler}
                            placeHolder={t('name')}
                            hasError={nameHasError}
                            onBlur={nameBlurHandler}
                            errorMessage={
                                nameHasError && name
                                    ? name.length < NAME_MIN_LENGTH
                                        ? t('min_length') + ' ' + NAME_MIN_LENGTH + '.'
                                        : t('max_length') + ' ' + NAME_MAX_LENGTH + '.'
                                    : t('name_required') + ''
                            }
                            label={'*' + t('name')}
                        />
                        <AuthButton title={`${t('save')}`} buttonType="md" onClick={onUpdateName} />
                    </div>
                </div>
            </CustomModal>

            <CustomModal show={orgNameChangeModal} onHide={() => setOrgNameChangeModal(false)}>
                <div className="d-flex flex-column">
                    <div className="h5 mt-2">
                        {t('edit')} {t('organisation_name')}
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <CustomInputWithLabel
                            autoComplete="orgName"
                            value={orgName}
                            onChange={orgNameChagehandler}
                            placeHolder={t('organisation_name')}
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

                        <AuthButton title={`${t('save')}`} buttonType="md" onClick={onUpdateOrgName} />
                    </div>
                </div>
            </CustomModal>

            <CustomModal
                show={passwordModalSHow}
                onHide={() => {
                    resetUserCurrentPassword();
                    setPasswordModalSHow(false);
                }}
            >
                <div className="d-flex flex-column">
                    <div className="h5 mt-2">
                        {t('change')} {t('user_password')}
                    </div>
                    <div className="d-flex flex-column align-items-center">
                        <CustomInputWithLabel
                            autoComplete="off"
                            value={userCurrentPassword}
                            onChange={userCurrentPasswordChagehandler}
                            onBlur={userCurrentPasswordBlurHandler}
                            placeHolder={t('current') + ' ' + t('user_password')}
                            isPassword
                            hasError={userCurrentPasswordError}
                            errorMessage={t('password_required') + ''}
                            label={'*' + t('current') + ' ' + t('user_password')}
                        />
                        <MultiplePassword
                            t={t}
                            onChangeValue={(val) => setUserPassword(val)}
                            checkValid={isPasswordValid}
                            withLabel
                        />

                        <AuthButton
                            title={`${t('change')} ${t('user_password')}`}
                            buttonType="md"
                            onClick={onChangePasword}
                        />
                    </div>
                </div>
            </CustomModal>
        </BaseLayout>
    );
};

export default Profile;

const GetHeadingWithValue = ({ onClick, withIcon, value, title }: any) => {
    return (
        <div>
            <div className="d-flex">
                <div className="font-small-semibold text-neutral-400">{title}</div>
                {withIcon && (
                    <CIcon icon={cilPencil} size="lg" className="text-primary cursor-pointer ms-2" onClick={onClick} />
                )}
            </div>
            <div className="h5">{value && value}</div>
        </div>
    );
};
