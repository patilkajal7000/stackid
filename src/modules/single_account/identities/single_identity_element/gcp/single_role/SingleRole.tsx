import { getSingleGCPRoleIdentites, getSingleGCPRoleInsights } from 'core/services/IdentitiesAPIService';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { GCPRoleIdentity, GCPSingleRoleInsightsDetails } from 'shared/models/IdentityAccessModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { NAV_TABS_VALUE } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import RoleIdentities from './components/RoleIdentities';

import SingleRoleInsight from './components/SingleRoleInsight';

const SingleRole = () => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState<'identities' | 'policies'>('identities');
    const [isInsightAPILoading, setIsInsightAPILoading] = useState(false);
    const [isIdentitiesAPILoading, setIdentitiesAPILoading] = useState(false);

    const [roleInsight, setRoleInsight] = useState<GCPSingleRoleInsightsDetails>();
    const [identities, setIdentities] = useState<GCPRoleIdentity[]>([]);

    const dispatch = useDispatch();
    const params = useParams<any>();

    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;

    const cloudAccountType = params?.cloudAccountType;
    const type = params?.type;
    const roleId = params?.rid ? params?.rid : '';

    useEffect(() => {
        /*------------------------------------------------ */
        // Added to show breadcrumb & tabs of reload
        // Todo - Refactore this code to call below api only once
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                {
                    name: 'Roles',
                    path:
                        CLOUDACCOUNT +
                        '/' +
                        cloudAccountId +
                        '/' +
                        cloudAccountType +
                        '/' +
                        NAV_TABS_VALUE.IDENTITIES +
                        '/' +
                        type,
                },
                { name: roleId, path: '' },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });

        /*------------------------------------------------ */
        setIsInsightAPILoading(true);
        getSingleGCPRoleInsights(cloudAccountId, roleId)
            .then((response: any) => {
                setRoleInsight(response);
            })
            .finally(() => setIsInsightAPILoading(false));

        setIdentitiesAPILoading(true);
        getSingleGCPRoleIdentites(cloudAccountId, roleId)
            .then((response: any) => {
                setIdentities(response);
            })
            .finally(() => setIdentitiesAPILoading(false));

        // setPermissionsAPILoading(true);
        // getSingleGCPRolePermissions(cloudAccountId, roleId).then((response: any) => {
        //     setPermissions(response);
        // }).finally(() => setPermissionsAPILoading(false));
    }, []);

    const onTabClick = (tabName: 'identities' | 'policies') => {
        setSelectedTab(tabName);
    };

    return (
        <div>
            <SingleRoleInsight data={roleInsight} isLoading={isInsightAPILoading} translate={t} />
            <div className="container">
                <nav className="nav nav-custom nav-box text-center my-5">
                    <span
                        className={`nav-link font-small-semibold ${selectedTab == 'identities' ? 'active' : ''} `}
                        onClick={() => onTabClick('identities')}
                        role="presentation"
                    >
                        {t('identities')}{' '}
                    </span>
                    {/* <a className={`nav-link font-small-semibold ${selectedTab == 'policies' ? 'active' : ''} `}
                        onClick={() => onTabClick('policies')}>
                        {t('permissions')}
                    </a> */}
                </nav>
                {selectedTab == 'identities' && (
                    <div>
                        <RoleIdentities data={identities} isLoading={isIdentitiesAPILoading} translate={t} />
                    </div>
                )}
                {/* {selectedTab == 'policies' && <div>
                    <div className="h5"> {t('resource')}</div>
                    <RolePermissions data={permissions} isLoading={isPermissionsAPILoading} translate={t} />
                </div>} */}
            </div>
        </div>
    );
};

export default SingleRole;
