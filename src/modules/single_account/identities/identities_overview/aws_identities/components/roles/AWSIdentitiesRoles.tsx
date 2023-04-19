import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IdentitiesInsights, IdentityDetails, IdentityType } from 'shared/models/IdentityAccessModel';
import { NAV_TABS_VALUE } from 'shared/utils/Constants';
import { useNavigate } from 'react-router';
import { useParams } from 'react-router-dom';
import { getRolesInsights } from 'core/services/IdentitiesAPIService';
import { BadgeData } from 'shared/models/GenericModel';
import IdentitiesInsight from './../users/IdentitiesInsight';
import IdentitiesTableView from './../users/IdentitiesTableView';
import { useDispatch, useSelector } from 'react-redux';
import { AppState } from 'store/store';
import { SetIdentitiesRolesAction } from 'store/actions/IdentitiesRolesAction';

const AWSIdentitiesRoles = (props: any) => {
    const { t } = useTranslation();
    const [roleDetailsList, setRoleDetailsList] = useState<IdentityDetails[]>([]);
    const [roleInsight, setRoleInsight] = useState<IdentitiesInsights>();
    const [isRoleAPILoading, setIsRoleAPILoading] = useState(false);
    const [currentPage] = useState(1);
    const [data] = useState<any>({});
    const navigate = useNavigate();
    const params = useParams<any>();
    const dispatch = useDispatch();
    const cloudAccountType: string | undefined | any = params?.cloudAccountType;
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const identitiesRolesState = useSelector((state: AppState) => state.identitiesRoles?.data);

    useEffect(() => {
        setIsRoleAPILoading(true);

        /* TODO: Check server level caching, caching handled at UI store level,
         * browser refresh will fetch from API again otherwise it will show the cached data from the UI store only
         */
        if (identitiesRolesState) {
            setResponse(identitiesRolesState);
            return;
        }

        getRolesInsights(cloudAccountId, IdentityType.AwsIAMRole, 1, 1000).then((response: any) => {
            setResponse(response);
        });
    }, []);

    const setResponse = (response: any) => {
        setIsRoleAPILoading(false);
        setRoleDetailsList(response.overview_data);
        setRoleInsight(formatInsight(response.insight_details));
        dispatch(SetIdentitiesRolesAction(response));
    };

    const formatInsight = (insightDetails: any) => {
        return {
            permissions: {
                title: 'Permissions',
                badgeData: insightDetails.permissions as BadgeData[],
            },
            accessType: {
                title: 'Access Type',
                badgeData: insightDetails.access_types as BadgeData[],
            },
            identitiesUsed: {
                title: '',
                badgeData: [] as BadgeData[],
            },
        };
    };

    const naviagateToSingleRoleScreen = (identityId: string) => {
        // navigate(IdentityType.AwsIAMRole + '/' + identityId + '/' + NAV_TABS_VALUE.RISK);
        navigate(
            `/accounts/${cloudAccountId}/${cloudAccountType}/identities/${IdentityType.AwsIAMRole}/${identityId}/${NAV_TABS_VALUE.RISK}`,
        );
    };

    return (
        <div>
            <div className="custom-shadow p-3">
                <div className="container">
                    <IdentitiesInsight
                        identityType={IdentityType.AwsIAMRole}
                        data={roleInsight}
                        isLoading={isRoleAPILoading}
                        translate={t}
                    />
                </div>
            </div>
            <IdentitiesTableView
                tabCount={data}
                currentPage={currentPage}
                headerTitle={'Risky'}
                isLoading={isRoleAPILoading}
                data={roleDetailsList}
                cloudAccountId={cloudAccountId}
                onClickRow={naviagateToSingleRoleScreen}
                identityType={IdentityType.AwsIAMRole}
                accessCounts={props.accessCounts}
                getSummaryDetails={props.getSummaryDetails}
                accessType={props.accessType}
                identityNames={props.identityNames}
            />
        </div>
    );
};

export default AWSIdentitiesRoles;
