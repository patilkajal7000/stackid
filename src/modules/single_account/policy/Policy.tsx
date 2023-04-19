import { getPolicies } from 'core/services/DataEndpointsAPIService';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import { useParams, useNavigate, useLocation } from 'react-router';
import PolicyDetailsCard from 'shared/components/policy_details_card/PolicyDetailsCard';
import { SIBreadcrumbItem } from 'shared/models/BreadcrumModel';
import { PolicyModel } from 'shared/models/PolicyModel';
import { getCloudAccountNameById } from 'shared/service/AppService';
import { SCREEN_NAME, PolicyType } from 'shared/utils/Constants';
import { setBreadcrumbAction } from 'store/actions/BreadcrumbActions';
import { setTabsAction } from 'store/actions/TabsStateActions';

const Policy = () => {
    const { t } = useTranslation();
    const [policies, setPolicies] = useState<Array<PolicyModel>>();
    const params = useParams<any>();

    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const cloudAccountType: any = params?.cloudAccountType;
    const type = params?.type ? params?.type : 'aws_S3';

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const onShowDetails = (policy: PolicyModel) => {
        navigate(location.pathname + '/' + policy.policy_name);
    };

    useEffect(() => {
        getCloudAccountNameById(cloudAccountId).then((accountName: any) => {
            const breadcrumbData: SIBreadcrumbItem[] = [
                { name: 'All cloud accounts', path: CLOUDACCOUNT },
                {
                    name: accountName as string,
                    path: CLOUDACCOUNT + '/' + cloudAccountId + '/' + cloudAccountType + '/dashboard/' + type,
                },
                { name: 'Policies', path: '' },
            ];
            dispatch(setBreadcrumbAction(breadcrumbData));
        });
        dispatch(setTabsAction(SCREEN_NAME.DATA_ENDPOINTS_SUMMARY, ''));
        getPolicies(cloudAccountId).then((res: any) => {
            const policies = res as PolicyModel[];
            setPolicies(policies);
        });
    }, []);

    return (
        <div className="container-fluid mx-0">
            <div className="container mt-3">
                {policies && policies.some((policy: PolicyModel) => policy.category === PolicyType.BEST_PRACTICES) && (
                    <div className="h2 font-weight-bold">4 Best Practice Security Policies</div>
                )}
                <div className="d-flex flex-wrap mx-0">
                    {policies &&
                        policies.map(
                            (policy: PolicyModel) =>
                                policy.category === PolicyType.BEST_PRACTICES && (
                                    <PolicyDetailsCard
                                        key={policy.policy_name}
                                        heading={policy.display_name}
                                        t={t}
                                        failedOrPassValue={policy.failure}
                                        showDetails={() => onShowDetails(policy)}
                                        category={policy.category}
                                    />
                                ),
                        )}
                </div>
                {policies && policies.some((policy: PolicyModel) => policy.category === PolicyType.COMPLIANCE) && (
                    <div className="h2 font-weight-bold">{t('compliance') + ' ' + t('policies')}</div>
                )}
                <div className="d-flex flex-wrap mx-0">
                    {policies &&
                        policies.map(
                            (policy: PolicyModel) =>
                                policy.category === PolicyType.COMPLIANCE && (
                                    <PolicyDetailsCard
                                        key={policy.policy_name}
                                        heading={policy.display_name}
                                        t={t}
                                        failedOrPassValue={policy.failure}
                                        showDetails={() => onShowDetails(policy)}
                                        category={policy.category}
                                    />
                                ),
                        )}
                </div>
            </div>
        </div>
    );
};

export default Policy;
