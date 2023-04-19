import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setTabsAction } from 'store/actions/TabsStateActions';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';
import AuthButton from 'shared/components/buttons/AuthButton';
import CustomInputWithLabel from 'shared/components/input/CustomInputWithLabel';
import useInput from 'shared/hooks/use-input';
import { emptyStringValidation, validateEmail } from 'shared/service/ValidationService';
import Pagination from 'shared/components/pagination/Pagination';
import {
    CAccordion,
    CAccordionBody,
    CAccordionHeader,
    CAccordionItem,
    CCardBody,
    CDropdown,
    CDropdownToggle,
    CDropdownMenu,
    CDropdownItem,
} from '@coreui/react';
import {
    deleteUser,
    getAlldeactivatedUser,
    getAllOrgAndRoles,
    inviteUser,
    reInviteUser,
    transferOwmner,
    updateMemberOfOrg,
    updateUserRole,
} from 'core/services/userManagementAPIService';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { OWNER, ToastVariant, USERS_ROLE_VALUE, USER_STATUS } from 'shared/utils/Constants';
import { User } from 'shared/models/AuthModel';
import Skeleton from 'react-loading-skeleton';
import SearchInput from 'shared/components/search_input/SearchInput';

import BaseLayout from 'core/container/BaseLayout';
import CustomModal from 'shared/components/custom_modal/CustomModal';
import { useNavigate } from 'react-router-dom';
import { AppState } from 'store/store';
import { CLOUDACCOUNTINITIALSETUP } from 'modules/cloud_accounts';
import { getAllCloudAccountsWithDiscoveryStatus } from 'core/services/CloudaccountsAPIService';
import { setCloudAccountsAction } from 'store/actions/CloudAccountActions';
import { CloudAccountModel } from 'shared/models/CloudAccountModel';

import MultiplePassword from 'shared/components/multiplePassword/MultiplePassword';
import { getEncrytedString } from 'shared/service/AuthService';
import CIcon from '@coreui/icons-react';
import { cibMacys, cilMinus, cilPlus } from '@coreui/icons';
import dayjs from 'dayjs';
import { getErrorValue } from 'core/services/AxiosService';

const FilterItems: any = [
    { id: 0, name: 'None' },
    // { id: 1, name: 'Activate' },
    // { id: 2, name: 'Deactivated' },
];
const PageSize = 15;
const Settings = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [inviteUserModal, setInviteUserModal] = useState(false);
    const [deletePrompt, setDeletePrompt] = useState(false);
    const [deactivatedUser, setDeactivatedUser] = useState<User[]>([]);
    const [updateUserModalshow, setUpdateUserModalshow] = useState(false);
    const [transferOwnerShipModalshow, setTransferOwnerShipModalshow] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInviteUserLoading, setIsInviteUserLoading] = useState(false);
    const [isDeleteUserLoading, setIsDeleteUserLoading] = useState(false);
    const [isUpdateUserLoading, setIsUpdateUserLoading] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User>();
    const [users, setUsers] = useState<User[]>([]);
    const [confirmedUsers, setConfirmedUsers] = useState<User[]>([]);
    const [selectedFilerValue, setSelectedFilerValue] = useState(FilterItems[0].id);
    const [displayUsers, setDisplayUsers] = useState<User[]>([]);
    const [searchValue, setSearchValue] = useState('');
    const [password, setPassword] = useState('');
    const [userPasswordValid, setUserPasswordValid] = useState(false);
    const [checked, setChecked] = useState(false);
    const [confirmedMember, setConfirmedMember] = useState(false);
    const set_details = checked;
    const withLabel = checked;
    const [arrow, setArrow] = useState<any>(false);
    const [currentPage, setCurrentPage] = useState(0);
    const {
        value: selectedUserOwnership,
        hasError: selectedUserOwnershipHasError,
        valueChangeHandler: selectedUserOwnershipChagehandler,
        inputBlurHandler: selectedUserOwnershiplBlurHandler,
    } = useInput(emptyStringValidation);
    const {
        value: email,
        hasError: emailHasError,
        valueChangeHandler: emailChagehandler,
        inputBlurHandler: emailBlurHandler,
        isValid: emailIsValid,
        reset: resetEmail,
    } = useInput(validateEmail);
    const {
        value: role,
        hasError: roleHasError,
        valueChangeHandler: roleChagehandler,
        inputBlurHandler: roleBlurHandler,
    } = useInput(emptyStringValidation);
    const {
        value: name,
        hasError: nameHasError,
        valueChangeHandler: nameChagehandler,
        inputBlurHandler: nameBlurHandler,
        isValid: nameIsValid,
        reset: resetName,
    } = useInput(emptyStringValidation);

    const handleChangeCheckBox = () => {
        setChecked(!checked);
    };

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
        [nameIsValid],
    );

    useEffect(() => {
        if (!checked) {
            resetName();
        }
        if (emailIsValid && !checked) {
            setConfirmedMember(true);
        } else if (checked && userPasswordValid) {
            setConfirmedMember(true);
        } else {
            setConfirmedMember(false);
        }
    }, [emailIsValid, checked, userPasswordValid]);

    useEffect(() => {
        dispatch(setTabsAction('', '', '')); //to hide subheader
        dispatch(setBreadcrumbAction([])); //to hide breadcrumb
        getAllOrg();
    }, []);

    useEffect(() => {
        onSearch(searchValue);
    }, [users]);

    const getAllOrg = () => {
        const includeInactive = true;
        setIsLoading(true);
        //Active Data
        getAllOrgAndRoles()
            .then((res: any) => {
                setIsLoading(false);
                const owners = res
                    .filter((x: any) => x.roles.includes('org_owner'))
                    .sort((a: any, b: any) => (a.name < b.name ? -1 : 1));
                const nonOwners = res
                    .filter((x: any) => !x.roles.includes('org_owner'))
                    .sort((a: any, b: any) => (a.name < b.name ? -1 : 1));
                setUsers([...owners, ...nonOwners]);
                const activeUsers = res.filter((x: any) => x.status_text.includes('CONFIRMED'));
                setConfirmedUsers(activeUsers);
            })
            .catch((err) => {
                setIsLoading(false);
                dispatch(
                    setToastMessageAction(
                        ToastVariant.DANGER,
                        err.response?.data
                            ? getErrorValue(err.response?.data)
                            : 'Something went wrong, Please try again',
                    ),
                );
            });
        //deactivated data
        getAlldeactivatedUser(includeInactive)
            .then((res: any) => {
                setIsLoading(false);
                const deactivated = res.filter((x: any) => x.status_text === 'ARCHIVED');
                deactivated.sort((a: any, b: any) => (a.email < b.email ? -1 : 1));
                setDeactivatedUser(deactivated);
            })
            .catch(() => setIsLoading(false));
    };

    const lastActive = (lastScan: any) => {
        return dayjs(lastScan).format('DD MMM YYYY | hh:mm a');
    };

    const inviteAgain = (userId: any, email: any) => {
        //reInviteUser User
        reInviteUser(userId, email)
            .then(() => {
                setIsLoading(false);
                getAllOrg();
            })
            .catch(() => setIsLoading(false));
    };

    useEffect(() => {
        if (deactivatedUser && deactivatedUser.length > 0) {
            currentPage ? setCurrentPage(currentPage) : setCurrentPage(1);
        }
    }, [deactivatedUser]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return deactivatedUser?.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, deactivatedUser]);

    const onSubmitInviteNewUser = async (event: any) => {
        event.preventDefault();
        if (!emailIsValid) {
            emailBlurHandler();
            return;
        }
        const encryptedPassword = await getEncrytedString(password.trim());
        setIsInviteUserLoading(true);
        checked
            ? inviteUser(email.trim(), set_details, name.trim(), encryptedPassword)
                  .then((res: any) => {
                      setIsInviteUserLoading(false);
                      getAllOrg();
                      dispatch(setToastMessageAction(ToastVariant.SUCCESS, res?.message));
                      setInviteUserModal(false);
                  })
                  .catch(() => setIsInviteUserLoading(false))
            : inviteUser(email.trim())
                  .then((res: any) => {
                      setIsInviteUserLoading(false);
                      getAllOrg();
                      dispatch(setToastMessageAction(ToastVariant.SUCCESS, res?.message));
                      setInviteUserModal(false);
                  })
                  .catch(() => setIsInviteUserLoading(false));
    };

    const onConfirmUpdateUser = (event: any) => {
        event.preventDefault();
        if (!nameIsValid) {
            nameBlurHandler();
            return;
        }
        setIsUpdateUserLoading(true);
        if (selectedUser?.name !== name) {
            updateMemberOfOrg(selectedUser?.id, {
                name: name.trim(),
            })
                .then((res: any) => {
                    dispatch(setToastMessageAction(ToastVariant.SUCCESS, res?.message));
                })
                .catch(() => setIsUpdateUserLoading(false));
        }
        const currentselectedRole: any = Object.keys(USERS_ROLE_VALUE).find((key) => USERS_ROLE_VALUE[key] === role);
        if (currentselectedRole && !selectedUser?.roles.includes(currentselectedRole)) {
            updateUserRole(selectedUser?.id, {
                new_role: Object.keys(USERS_ROLE_VALUE).find((key) => USERS_ROLE_VALUE[key] === role),
            })
                .then((res: any) => {
                    setIsUpdateUserLoading(false);
                    setUpdateUserModalshow(false);
                    dispatch(setToastMessageAction(ToastVariant.SUCCESS, res?.message));
                    getAllOrg();
                })
                .catch(() => setIsUpdateUserLoading(false));
        } else {
            setIsUpdateUserLoading(false);
            setUpdateUserModalshow(false);
        }
    };

    const onConfirmDeleteUser = () => {
        setIsDeleteUserLoading(true);
        selectedUser &&
            deleteUser(selectedUser.id)
                .then((res: any) => {
                    setIsDeleteUserLoading(false);
                    setDeletePrompt(false);
                    dispatch(setToastMessageAction(ToastVariant.SUCCESS, res?.message));
                    getAllOrg();
                })
                .catch(() => setIsDeleteUserLoading(false));
    };

    const onTransferOwnerConfirm = () => {
        const transferOwnerUser = users.find((user: User) => user.name === selectedUserOwnership);
        transferOwnerUser &&
            transferOwmner(transferOwnerUser.id, transferOwnerUser.email).then((res: any) => {
                setTransferOwnerShipModalshow(false);
                dispatch(setToastMessageAction(ToastVariant.SUCCESS, res?.message));
                getAllOrg();
            });
    };

    const onUpdateUserClicked = (user: User) => {
        setSelectedUser(user);
        user.name ? nameChagehandler(user.name) : resetName();
        roleChagehandler(USERS_ROLE_VALUE['org_member']);
        setUpdateUserModalshow(true);
    };

    const onSearch = (searchString: string) => {
        setSearchValue(searchString);
        if (searchString.length > 0) {
            const selectedUser = users?.filter(
                (user: User) => user?.name?.includes(searchString) || user?.email?.includes(searchString),
            );
            if (selectedUser && selectedUser.length > 0) {
                setDisplayUsers(selectedUser);
            } else {
                setDisplayUsers([]);
            }
        } else {
            setDisplayUsers(users);
        }
    };

    const navigate = useNavigate();
    const cloudAccountsState = useSelector((state: AppState) => state.cloudAccountState);
    // const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        dispatch(setTabsAction('', '', '')); //to hide subheader
        dispatch(setBreadcrumbAction([])); //to hide breadcrumb
        /** If we dont have cloudaccounts in our account the user should directly land of the initial setup screen  */
        if (!cloudAccountsState.getDataCalled) {
            getCloudAccounts();
        } else if (cloudAccountsState.cloudAccounts.length === 0) {
            navigate(CLOUDACCOUNTINITIALSETUP);
        }
    }, []);

    const getCloudAccounts = () => {
        setIsLoading(true);
        getAllCloudAccountsWithDiscoveryStatus()
            .then((response: any) => {
                const cloudAccounts = response as CloudAccountModel[];
                dispatch(setCloudAccountsAction(cloudAccounts));
                setIsLoading(false);
            })
            .catch(() => {
                setIsLoading(false);
            });
    };

    return (
        <BaseLayout>
            <div className="h5 text-primary mt-2">
                {t('user')} {t('management')}
            </div>
            <div className="d-flex justify-content-between my-2">
                <div className="d-flex align-items-center mx-0 w-60">
                    <div className="d-flex align-items-center me-1 px-2 border-neutral-700 w-20 filter-dropdown rounded">
                        <div className="font-x-small-bold">{t('filter')}</div>
                        <div className="w-100">
                            <CDropdown placement="bottom" className="mx-1 p-2 w-100">
                                <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 py-1 w-100">
                                    <div className="pe-2  m-0">{FilterItems[selectedFilerValue].name}</div>
                                </CDropdownToggle>
                                <CDropdownMenu>
                                    {FilterItems.map((item: any, index: number) => (
                                        <CDropdownItem key={index} onClick={() => setSelectedFilerValue(item.id)}>
                                            {item.name}
                                        </CDropdownItem>
                                    ))}
                                </CDropdownMenu>
                            </CDropdown>
                        </div>
                    </div>
                    <SearchInput minLength={0} onSearch={onSearch} placeholder="Search user" />
                </div>
                <div className="d-flex">
                    <AuthButton
                        title={t('change_owner')}
                        buttonType="sm"
                        onClick={() => setTransferOwnerShipModalshow(true)}
                        className="mx-2"
                        type="secondary"
                    />
                    <AuthButton
                        title={t('invite_user')}
                        buttonType="sm"
                        onClick={() => {
                            resetEmail();
                            setInviteUserModal(true);
                        }}
                        className=""
                    />
                </div>
            </div>
            <div className="container-fluid header-background mt-4 mb-2">
                <div className="d-flex justify-content-between">
                    <div className="py-2 font-small-semibold">
                        {t('active_user')} ({confirmedUsers.length > 0 ? confirmedUsers.length : '0'})
                    </div>
                </div>
            </div>
            <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                <thead className="font-medium border-bottom">
                    <tr>
                        <th className="w-30">
                            {t('SI')} {t('user_name')}
                        </th>
                        <th className="w-40">{t('email')}</th>
                        <th className="w-10">{t('role')}</th>

                        <th className="w-20 px-3">{t('actions')}</th>
                    </tr>
                </thead>
                <tbody className="font-small setting-table">
                    {isLoading ? (
                        <tr>
                            <td colSpan={5} className="w-20">
                                <Skeleton count={5} height={48} />
                            </td>
                        </tr>
                    ) : (
                        displayUsers.map((user: User) => (
                            <tr key={'user_' + user.id}>
                                <td>
                                    <div className="d-flex align-items-center">
                                        {user?.roles && user.roles.includes(OWNER) && (
                                            <CIcon icon={cibMacys} className="text-success me-2" />
                                        )}
                                        {user.name}
                                    </div>
                                </td>
                                <td>
                                    <div className="d-flex flex-column">
                                        <div>{user.email}</div>
                                        <div className="font-x-small text-primary font-italic">
                                            {`  ${
                                                user.status_text !== USER_STATUS.INVITED
                                                    ? 'Last Login: ' + lastActive(user.last_login)
                                                    : ''
                                            }`}
                                        </div>
                                        <div>
                                            {user.status_text === USER_STATUS.INVITED && (
                                                <div className="font-x-small text-primary font-italic">
                                                    {t('pending_confirmation')}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </td>

                                <td>
                                    {user.roles.length > 0 &&
                                        user.roles.map((role: typeof USERS_ROLE_VALUE) => USERS_ROLE_VALUE[role])}
                                </td>
                                <td className="pl-2p">
                                    {user.status_text === USER_STATUS.INVITED ||
                                    (user?.roles && user.roles.includes(OWNER)) ? (
                                        <button
                                            disabled
                                            type="button"
                                            className="btn btn-custom btn-link"
                                            onClick={() => onUpdateUserClicked(user)}
                                        >
                                            {t('edit')}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-custom btn-link"
                                            onClick={() => onUpdateUserClicked(user)}
                                        >
                                            {t('edit')}
                                        </button>
                                    )}

                                    {user?.roles && user.roles.includes(OWNER) ? (
                                        <button
                                            disabled
                                            type="button"
                                            className="btn btn-custom btn-link"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setDeletePrompt(true);
                                            }}
                                        >
                                            {t('Deactivate')}
                                        </button>
                                    ) : (
                                        <button
                                            type="button"
                                            className="btn btn-custom btn-link"
                                            onClick={() => {
                                                setSelectedUser(user);
                                                setDeletePrompt(true);
                                            }}
                                        >
                                            {t('Deactivate')}
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                    {displayUsers?.length == 0 && (
                        <tr className="text-center">
                            <td colSpan={5}>{t('no_records_available')} </td>
                        </tr>
                    )}
                </tbody>
            </table>

            <CAccordion className="no-arrow-accordion mt-3">
                <CAccordionItem className="border-0 p-0" itemKey="0">
                    <CAccordionHeader
                        className="border-0 master-btn px--12p accordion-toggle w-100 bg-transparent p-0 mb-2"
                        onClick={() => setArrow(!arrow)}
                    >
                        <div className="container-fluid d-flex justify-content-between p-0">
                            <div className=" py-2 p-0 font-small-semibold">
                                {t('deactivated_user')} ({deactivatedUser.length > 0 ? deactivatedUser.length : '0'})
                            </div>
                            <div className="pt-2 p-0">
                                <span className="plus-minus">
                                    {arrow ? <CIcon icon={cilMinus}></CIcon> : <CIcon icon={cilPlus}></CIcon>}
                                </span>
                            </div>
                        </div>
                    </CAccordionHeader>
                    <CAccordionBody className="p-0">
                        <CCardBody className="p-0 pb-1 ">
                            <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                                <thead className="font-medium border-bottom">
                                    <tr>
                                        <th className="w-30">
                                            {t('SI')} {t('user_name')}
                                        </th>
                                        <th className="w-40">{t('email')}</th>
                                        <th className="w-10">{t('role')}</th>

                                        <th className="w-20 px-3">{t('actions')}</th>
                                    </tr>
                                </thead>
                                <tbody className="font-small setting-table">
                                    {isLoading ? (
                                        <tr>
                                            <td colSpan={5} className="w-20">
                                                <Skeleton count={5} height={48} />
                                            </td>
                                        </tr>
                                    ) : (
                                        currentTableData?.length > 0 &&
                                        currentTableData?.map((user: User) => (
                                            <tr key={'user_' + user.id}>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        {user?.roles && user.roles.includes(OWNER) && (
                                                            <CIcon icon={cibMacys} className="text-success me-2" />
                                                        )}
                                                        {user.name}
                                                    </div>
                                                </td>
                                                <td>
                                                    <div className="d-flex flex-column">
                                                        <div>{user.email}</div>
                                                        <div className="font-x-small text-primary font-italic">
                                                            {`  ${
                                                                user.status_text !== USER_STATUS.INVITED &&
                                                                user.last_login
                                                                    ? 'Last Login: ' + lastActive(user.last_login)
                                                                    : ''
                                                            }`}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td>
                                                    {user.roles.length > 0 &&
                                                        user.roles.map(
                                                            (role: typeof USERS_ROLE_VALUE) => USERS_ROLE_VALUE[role],
                                                        )}
                                                </td>
                                                <td className="pl-2p">
                                                    <button
                                                        type="button"
                                                        className="btn btn-custom btn-link"
                                                        onClick={() => inviteAgain(user.id, user.email)}
                                                    >
                                                        {t('invite_again')}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                    {currentTableData?.length == 0 && (
                                        <tr className="text-center">
                                            <td colSpan={5}>{t('no_records_available')} </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                            <Pagination
                                className="pagination-bar justify-content-end"
                                currentPage={currentPage}
                                totalCount={deactivatedUser?.length}
                                pageSize={PageSize}
                                siblingCount={1}
                                onPageChange={(page: number) => setCurrentPage(page)}
                            />
                        </CCardBody>
                    </CAccordionBody>
                </CAccordionItem>
            </CAccordion>

            <CustomModal show={inviteUserModal} onHide={() => setInviteUserModal(false)}>
                <div className="d-flex flex-column">
                    <div className="h1 mt-2">
                        {t('invite')} {t('user')}
                    </div>
                </div>
                <form onSubmit={onSubmitInviteNewUser}>
                    <CustomInputWithLabel
                        autoComplete="email"
                        value={email}
                        onChange={emailChagehandler}
                        placeHolder={t('email')}
                        hasError={emailHasError}
                        onBlur={emailBlurHandler}
                        errorMessage={email ? t('bussiness_email_invalid') + '' : t('email_required') + ''}
                        label={'*' + t('email')}
                        customClass={'mb-2'}
                    />

                    <label className="invite-user-pop-up mb-2">
                        <input type="checkbox" checked={checked} onChange={handleChangeCheckBox} />
                        {!checked && <p className="font-small mb-1"> {t('send_invite_user_text')} </p>}
                        <svg
                            className={`checkbox ${checked ? 'checkbox--active' : ''}`}
                            role="presentation"
                            viewBox="0 0 15 11"
                            fill="none"
                        >
                            <path d="M1 4.5L5 9L14 1" strokeWidth="2" stroke={checked ? '#fff' : 'none'} />
                        </svg>{' '}
                        <span className="font-small"> {t('add_member_text')} </span>
                    </label>
                    {checked && (
                        <>
                            <CustomInputWithLabel
                                autoComplete="name"
                                value={name}
                                onChange={nameChagehandler}
                                placeHolder={t('name')}
                                hasError={nameHasError}
                                onBlur={nameBlurHandler}
                                errorMessage={'Name field is required.'}
                                label={'*' + t('name')}
                                customClass={'mb-2'}
                            />
                            <MultiplePassword
                                withLabel={withLabel}
                                t={t}
                                onChangeValue={(val) => setPassword(val)}
                                checkValid={isPasswordValid}
                            />
                        </>
                    )}

                    <div className="d-flex justify-content-center align-items-center mx-5 mt-5">
                        <AuthButton
                            title={checked ? t('add_member') : t('invite')}
                            buttonType="md"
                            onClick={onSubmitInviteNewUser}
                            isLoading={isInviteUserLoading}
                            enable={confirmedMember}
                        />
                    </div>
                </form>
            </CustomModal>
            <CustomModal show={deletePrompt} onHide={() => setDeletePrompt(false)}>
                <div className="d-flex flex-column">
                    <div className="h1">{t('sure_prompt')}</div>
                    <div className="h4 mt-2 mb-4">
                        {t('delete_sure_text')} {t('user')} : {selectedUser?.email}
                    </div>
                </div>
                <div className="d-flex align-items-center justify-content-center mt-5">
                    <AuthButton
                        title={t('cancel')}
                        buttonType="sm"
                        onClick={() => setDeletePrompt(false)}
                        className="mx-1"
                    />
                    <AuthButton
                        title={t('Deactivate')}
                        buttonType="sm"
                        onClick={onConfirmDeleteUser}
                        className="mx-1"
                        isLoading={isDeleteUserLoading}
                        type="secondary"
                    />
                </div>
            </CustomModal>
            <CustomModal show={updateUserModalshow} onHide={() => setUpdateUserModalshow(false)}>
                <div className="h1 mt-2">
                    {t('edit')} a {t('user')}
                </div>

                <form onSubmit={onConfirmUpdateUser}>
                    <CustomInputWithLabel
                        autoComplete="name"
                        value={name}
                        onChange={nameChagehandler}
                        placeHolder={t('user_name')}
                        hasError={nameHasError}
                        onBlur={nameBlurHandler}
                        errorMessage={t('required') + ''}
                        label={'*' + t('user_name')}
                        customClass={'mb-2'}
                    />

                    <CustomInputWithLabel
                        autoComplete="role"
                        value={role}
                        onChange={roleChagehandler}
                        placeHolder={t('friendly_cloud_account')}
                        hasError={roleHasError}
                        onBlur={roleBlurHandler}
                        errorMessage={t('required') + ''}
                        label={'*' + t('role')}
                        customClass={'mb-2'}
                        isDropdown
                        dropdownValues={[USERS_ROLE_VALUE.org_member, USERS_ROLE_VALUE.org_admin]}
                    />
                    <div className="d-flex justify-content-center align-items-center mx-5 mt-5">
                        <AuthButton
                            title={t('save')}
                            buttonType="md"
                            onClick={onConfirmUpdateUser}
                            isLoading={isUpdateUserLoading}
                        />
                    </div>
                </form>
            </CustomModal>
            <CustomModal show={transferOwnerShipModalshow} onHide={() => setTransferOwnerShipModalshow(false)}>
                <div className="h1 mt-2">{t('transfer_ownership')}</div>
                <CustomInputWithLabel
                    autoComplete="userName"
                    value={selectedUserOwnership}
                    onChange={selectedUserOwnershipChagehandler}
                    placeHolder={t('transfer_to')}
                    hasError={selectedUserOwnershipHasError}
                    onBlur={selectedUserOwnershiplBlurHandler}
                    errorMessage={t('required') + ''}
                    label={'*' + t('user') + ' ' + t('name')}
                    customClass={'mb-2'}
                    isDropdown
                    dropdownValues={users
                        .filter((user: User) => !user.roles.includes(OWNER))
                        .map((user: User) => user.name)}
                />
                <div className="d-flex justify-content-center mx-5 mt-5">
                    <AuthButton
                        title={t('confirm')}
                        buttonType="md"
                        onClick={onTransferOwnerConfirm}
                        isLoading={isUpdateUserLoading}
                    />
                </div>
            </CustomModal>
        </BaseLayout>
    );
};

export default Settings;
