import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { NAV_TABS_VALUE } from 'shared/utils/Constants';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { useLocation, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import SinglePolicyInsight from './components/SinglePolicyInsight';
import IdentitiesTableComponent from './components/IdentitiesTableComponent';
import { Identity, SinglePolicyInsightsDetails, Permissions } from 'shared/models/IdentityAccessModel';
import PermissionsAccordianConponent from './components/PermissionsAccordianConponent';
import { getPolicyIdentities, getPolicyInsights, getPolicyPermissions } from 'core/services/IdentitiesAPIService';

const SinglePolicy = () => {
    const { t } = useTranslation();
    const [selectedTab, setSelectedTab] = useState<'identities' | 'policies'>('identities');
    const [isInsightAPILoading, setIsInsightAPILoading] = useState(false);
    const [isIdentitiesAPILoading, setIdentitiesAPILoading] = useState(false);
    const [isPermissionsAPILoading, setPermissionsAPILoading] = useState(false);
    const [policyInsight, setPolicyInsight] = useState<SinglePolicyInsightsDetails>();
    const [identities, setIdentities] = useState<Identity[]>([]);
    const [permissions, setPermissions] = useState<Permissions>();
    const dispatch = useDispatch();
    const params = useParams<any>();

    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;

    const cloudAccountType = params?.cloudAccountType;
    const type = params?.type;
    const policyId = params?.rid ? params?.rid : '';
    const { state } = useLocation();
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
                    name: 'Policies',
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
                { name: policyId, path: '' },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });

        /*------------------------------------------------ */
        setIsInsightAPILoading(true);
        getPolicyInsights(cloudAccountId, policyId).then((response: any) => {
            setPolicyInsight(response);
            setIsInsightAPILoading(false);
        });

        setIdentitiesAPILoading(true);
        getPolicyIdentities(cloudAccountId, policyId).then((response: any) => {
            setIdentities(response);
            setIdentitiesAPILoading(false);
        });

        setPermissionsAPILoading(true);
        getPolicyPermissions(cloudAccountId, policyId).then((response: any) => {
            setPermissions(response);
            setPermissionsAPILoading(false);
        });
    }, []);

    const onTabClick = (tabName: 'identities' | 'policies') => {
        setSelectedTab(tabName);
    };

    return (
        <div>
            <SinglePolicyInsight
                data={policyInsight}
                riskScore={state?.policy?.si_risk_score}
                isLoading={isInsightAPILoading}
                translate={t}
            />
            <div className="container">
                <nav className="nav nav-custom nav-box text-center my-5">
                    <span
                        className={`nav-link font-small-semibold ${selectedTab == 'identities' ? 'active' : ''} `}
                        onClick={() => onTabClick('identities')}
                        role="presentation"
                    >
                        {t('identities')}
                    </span>
                    <span
                        className={`nav-link font-small-semibold ${selectedTab == 'policies' ? 'active' : ''} `}
                        onClick={() => onTabClick('policies')}
                        role="presentation"
                    >
                        {t('permissions')}
                    </span>
                </nav>
                {selectedTab == 'identities' && (
                    <div>
                        <IdentitiesTableComponent data={identities} isLoading={isIdentitiesAPILoading} translate={t} />
                    </div>
                )}
                {selectedTab == 'policies' && (
                    <div>
                        <div className="h5"> {t('service/resource')}</div>
                        <PermissionsAccordianConponent
                            data={permissions}
                            isLoading={isPermissionsAPILoading}
                            translate={t}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default SinglePolicy;
