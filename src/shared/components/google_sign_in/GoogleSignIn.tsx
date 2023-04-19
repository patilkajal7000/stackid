import { goole_login } from 'core/services/AuthAPISerivce';
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuthTokens } from 'store/actions/AuthActions';
import { useTranslation } from 'react-i18next';
import 'translation/i18n';
import AuthButton from '../buttons/AuthButton';
import CustomInput from '../input/CustomInput';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import { CImage } from '@coreui/react';

type GoogleSignInProps = {
    onFailure: (error: any) => void;
    setLoading: (isLoading: boolean) => void;
    isSelectOrganisation: (val: any) => void;
};

const GoogleSignIn = (props: GoogleSignInProps) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [selectedOrganization, setSelectedOrganization] = useState('');
    const [organiztionValues, setOrganiztionValues] = useState<string[]>([]);
    const [userData, setUserData] = useState<any>();
    const { t } = useTranslation();

    useEffect(() => {
        const onPageLoad = () => {
            try {
                if (google) {
                    google.accounts.id.initialize({
                        callback: handleCredentialResponse,
                        client_id: import.meta.env.VITE_GOOGLE_CLIENT_KEY,
                    });
                    if (document.getElementById('gSignIn')) {
                        google.accounts.id.renderButton(
                            document.getElementById('gSignIn') as HTMLElement,
                            { theme: 'outline', size: 'large', type: 'standard' }, // customization attributes
                        );
                        // To display the One Tap dialog
                        // google.accounts.id.prompt();
                    }
                }
            } catch (error) {
                // console.info(error);
            }
        };

        // Check if the page has already loaded
        if (document.readyState === 'complete') {
            onPageLoad();
        } else {
            window.addEventListener('loadend', onPageLoad);
            // Remove the event listener when component unmounts
            return () => window.removeEventListener('loadend', onPageLoad);
        }
    }, []);

    const handleCredentialResponse = (response: any) => {
        const res = {
            id_details: { idtoken: response.credential },
            provider: 'Google',
        };
        signInWithGoogle(res);
    };

    const signInWithGoogle = (data: any) => {
        props.setLoading(true);
        goole_login(data)
            .then((res: any) => {
                props.setLoading(false);
                if (res && res.access_token) {
                    userLoggedIn(res);
                } else {
                    props.onFailure('Something went wrong');
                }
            })
            .catch((err: any) => {
                if (err && err.response && err.response.data && err.response.data.id_details) {
                    setUserData(err.response?.data);

                    setOrganiztionValues(err.response?.data.user_organisations);
                    setSelectedOrganization(err.response?.data.user_organisations[0]);
                    props.isSelectOrganisation(true);
                }
                props.setLoading(false);
                props.onFailure(err);
            });
    };

    const loginWithOrganisatioName = () => {
        signInWithGoogle({ ...userData, organisation: selectedOrganization });
    };

    const userLoggedIn = (data: any) => {
        const user_data = {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            user: data.user,
            status: data.status,
        };
        dispatch(setAuthTokens(user_data));
        navigate(CLOUDACCOUNT);
    };

    return (
        <>
            {organiztionValues.length === 0 ? (
                <button id="gSignIn" className="d-flex justify-content-center align-items-center border-0 p-0">
                    <div className="g-signin2" data-gapiscan="true" data-onload="true"></div>
                    <CImage src={require('assets/images/sign_in_google_image.png')} height="80%" />
                </button>
            ) : (
                <div className="d-flex flex-column w-100">
                    <div className="h5">{t('select_organisation')}</div>
                    <CustomInput
                        autoComplete="organisationName"
                        value={selectedOrganization}
                        onChange={(e: any) => setSelectedOrganization(e)}
                        placeHolder={t('select_organization_name') + '*'}
                        errorMessage={t('organisation_name_required') + ''}
                        isDropdown
                        dropdownValues={organiztionValues}
                    />
                    <div className="d-flex justify-content-center mt-3 align-items-center">
                        <AuthButton title={t('continue')} buttonType="lg" onClick={loginWithOrganisatioName} />
                    </div>
                </div>
            )}
        </>
    );
};

export default GoogleSignIn;
