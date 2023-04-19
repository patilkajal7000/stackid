import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { SelectedLink } from 'shared/models/GraphModels';
import { CImage } from '@coreui/react';
import { setToastMessageAction } from 'store/actions/SingleActions';
import { ToastVariant } from 'shared/utils/Constants';
import { useDispatch } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom';
import { IdentityType } from 'shared/models/IdentityAccessModel';
import CIcon from '@coreui/icons-react';
import { cilArrowBottom } from '@coreui/icons';

enum LinkType {
    IAM = 'IAM',
    Network = 'Network',
}

type LinkDetailsProps = {
    data: SelectedLink | undefined;
    isLoading: boolean;
};
const LinkDetails = ({ data }: LinkDetailsProps) => {
    const [selectedTab, setSelectedTab] = useState<LinkType>(LinkType.IAM);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const { t } = useTranslation();

    const onTabClick = (identityType: LinkType) => {
        setSelectedTab(identityType);
    };

    const setClipboardText = (identity_name: string) => {
        navigator.clipboard.writeText(identity_name);
        dispatch(setToastMessageAction(ToastVariant.SUCCESS, 'Identity name copied to clipboard.'));
    };

    const navigateToPolicy = (policy: any) => {
        const text: string = location.pathname;

        const path: string = text.substring(0, text.lastIndexOf('/data_assets/aws_S3/'));

        localStorage.setItem('searchByName', policy);
        const url = `${path}/identities/${IdentityType.AWsIAMPolicy}`;
        navigate({
            pathname: url,
        });
    };

    const navigateToIdentity = (identity: any) => {
        const text: string = location.pathname;

        const path: string = text.substring(0, text.lastIndexOf('/data_assets/aws_S3/'));
        const url = `${path}/identities/${identity.identity_type}/${identity.identity_id}/resources`;
        navigate({
            pathname: url,
        });
    };

    return (
        <div className="container-fluid p-0">
            <div className="d-flex flex-row">
                <div className="d-flex align-items-center">
                    {' '}
                    <CIcon icon={cilArrowBottom} className="font-32" />{' '}
                </div>
                <div className="d-flex flex-column ms-2">
                    <div>
                        <div className="font-small">Source - {data?.source?.type}</div>
                        <div className="h5 text-neutral-50"> {data?.source?.title} </div>
                    </div>
                    <div>
                        <div className="font-small">Target - {data?.target?.type} </div>
                        <div className="h5 text-neutral-50"> {data?.target?.title} </div>
                    </div>
                </div>
            </div>

            <nav className="nav nav-custom nav-box text-center my-3">
                <span
                    className={`nav-link h6 ${selectedTab === LinkType.IAM ? 'active' : ''} `}
                    onClick={() => onTabClick(LinkType.IAM)}
                    role="presentation"
                >
                    {t('iam')}
                </span>
                <span
                    className={`nav-link h6 ${selectedTab === LinkType.Network ? 'active' : ''} `}
                    onClick={() => onTabClick(LinkType.Network)}
                    role="presentation"
                >
                    {t('network')}
                </span>
            </nav>

            {selectedTab === LinkType.IAM && (
                <div>
                    {data && data.accessData && data.accessData.identityAccess.length > 0 ? (
                        data.accessData.identityAccess.map((identity, index) => (
                            <div key={index}>
                                <div className="h5 text-black">
                                    <span
                                        className="pointer"
                                        onClick={() => navigateToIdentity(identity)}
                                        role="presentation"
                                    >
                                        {' '}
                                        Identity name: {identity.identity_name}
                                    </span>
                                    <CImage
                                        src={require('assets/images/copy.png')}
                                        style={{
                                            height: '25px',
                                            width: '25px',
                                            padding: '5px',
                                            cursor: 'copy',
                                        }}
                                        onClick={() => {
                                            setClipboardText(identity.identity_name);
                                        }}
                                    />
                                </div>
                                <div className="card custom-card table-card  mt-2 ">
                                    <table className="table custom-table details-table">
                                        <thead>
                                            <tr>
                                                <th> {t('permission_type')}</th>
                                                <th> {t('policies')}</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {identity.access_type_policies_mapping &&
                                                Object.keys(identity.access_type_policies_mapping).map(
                                                    (levelOfAccess: string, index: number) => (
                                                        <tr key={index}>
                                                            <td> {levelOfAccess} </td>
                                                            <td>
                                                                {identity.access_type_policies_mapping[
                                                                    levelOfAccess
                                                                ].map((policy: string, i: number) => (
                                                                    <span
                                                                        role="presentation"
                                                                        key={i}
                                                                        className="pointer"
                                                                        onClick={() => navigateToPolicy(policy)}
                                                                    >
                                                                        <span> {policy}</span>
                                                                        {i <=
                                                                            identity.access_type_policies_mapping[
                                                                                levelOfAccess
                                                                            ].length -
                                                                                2 && <span>, </span>}
                                                                    </span>
                                                                ))}
                                                            </td>
                                                        </tr>
                                                    ),
                                                )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="card custom-card table-card  mt-2 ">
                            <table className="table custom-table details-table">
                                <thead>
                                    <tr>
                                        <th className="w-40"> {t('permission_type')}</th>
                                        <th> {t('policies')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="text-center">
                                        <td colSpan={2}>{t('no_records_available')}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}

            {selectedTab === LinkType.Network && (
                <div>
                    <div>
                        <div className="card custom-card table-card  mt-2 ">
                            <table className="table custom-table details-table">
                                <thead>
                                    <tr>
                                        <th className="w-40"> {t('accessible_port')}</th>
                                        <th> {t('protocol')}</th>
                                        <th>{t('direction')}</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data && data.accessData && data.accessData.networkAccess.length > 0 ? (
                                        data.accessData.networkAccess.map((networkDetails, index) => (
                                            <tr key={index}>
                                                <td> {networkDetails.accessible_port} </td>
                                                <td> {networkDetails.protocol} </td>
                                                <td>{networkDetails.direction}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr className="text-center">
                                            <td colSpan={3}>{t('no_records_available')}</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LinkDetails;
