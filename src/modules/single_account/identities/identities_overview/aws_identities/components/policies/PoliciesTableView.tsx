import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';

import PoliciesTableComponent from './PoliciesTableComponent';
import SearchInput from 'shared/components/search_input/SearchInput';
import { getPoliciesOverview } from 'core/services/IdentitiesAPIService';
import { MIN_SEARCH_LENGTH, NAV_TABS_VALUE } from 'shared/utils/Constants';
import { PolicyDetails } from 'shared/models/IdentityAccessModel';
import { useSelector } from 'react-redux';
import { AppState } from 'store/store';
import { CTooltip } from '@coreui/react';

const PoliciesTableView = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [search, setSearch] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [inline, setinline] = useState<PolicyDetails[]>([]);
    const [awsManaged, setAwsManaged] = useState<PolicyDetails[]>([]);
    const [custManaged, setCustManaged] = useState<PolicyDetails[]>([]);
    const [isLoading, setIsPoliciesOverviewAPILoading] = useState(false);
    const [filteredRecords, setFilteredRecords] = useState<PolicyDetails[]>([]);
    const [tabFilteredRecords, setTabFilteredRecords] = useState<PolicyDetails[]>([]);
    const [policiesOverviewList, setPoliciesOverviewList] = useState<PolicyDetails[]>([]);
    const params = useParams<any>();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const searchParams = new URLSearchParams(location.search);
    const pageNo = searchParams.get('pageNo');
    const searchByName = localStorage.getItem('searchByName') || '';
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const orgId: any = userDetails?.org.organisation_id;

    useEffect(() => {
        if (pageNo) {
            setCurrentPage(+pageNo);
        }

        if (searchByName) {
            setSearch(searchByName);
        }

        setIsPoliciesOverviewAPILoading(true);
        getPoliciesOverview(cloudAccountId, orgId).then((response: any) => {
            setIsPoliciesOverviewAPILoading(false);
            response.map((item: any) => {
                item.identity_count = item?.identity_count?.map((e: any) => (e = e ? JSON.parse(e) : {}));
                item.si_resource_types = item?.si_resource_types ? JSON.parse(item.si_resource_types) : {};
                item.si_permission_types = item?.si_permission_types ? JSON.parse(item.si_permission_types) : {};
            });
            setPoliciesOverviewList(response);
            searchAction(response, searchByName);
            localStorage.removeItem('searchByName');
        });
    }, []);

    useEffect(() => {
        if (search && tabFilteredRecords && tabFilteredRecords.length > 0) {
            searchAction(policiesOverviewList, search);
            localStorage.removeItem('searchByName');
        }
    }, [search, policiesOverviewList]);

    useEffect(() => {
        const selectedAws_ManagedPolicy = tabFilteredRecords?.filter((data: any) => data.type === 'aws_ManagedPolicy');

        if (selectedAws_ManagedPolicy && selectedAws_ManagedPolicy.length > 0) {
            setAwsManaged(selectedAws_ManagedPolicy);
        } else {
            setAwsManaged([]);
        }

        const selectedAws_CustomerManagedPolicy = tabFilteredRecords?.filter(
            (data: any) => data.type === 'aws_CustomerManagedPolicy',
        );
        if (selectedAws_CustomerManagedPolicy && selectedAws_CustomerManagedPolicy.length > 0) {
            setCustManaged(selectedAws_CustomerManagedPolicy);
        } else {
            setCustManaged([]);
        }

        const aws_InlinePolicy = tabFilteredRecords?.filter((data: any) => data.type === 'aws_InlinePolicy');
        if (aws_InlinePolicy && aws_InlinePolicy.length > 0) {
            setinline(aws_InlinePolicy);
        } else {
            setinline([]);
        }
    }, [tabFilteredRecords]);

    const onSearchPolicies = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            return searchAction(policiesOverviewList, searchString, callback);
        },
        [policiesOverviewList],
    );

    const searchAction = (data: any = [], searchString: string, callback?: (message: string) => void) => {
        if (searchString.length >= MIN_SEARCH_LENGTH) {
            const selectedIdentities = data?.filter((data: PolicyDetails) =>
                data.name.toLowerCase().includes(searchString.toLowerCase()),
            );

            if (selectedIdentities && selectedIdentities.length > 0) {
                setFilteredRecords(selectedIdentities);
                setTabFilteredRecords(selectedIdentities);
                callback && callback('');
            } else {
                setFilteredRecords([]);
                setTabFilteredRecords([]);
                callback && callback('No Items found');
            }
        } else {
            setFilteredRecords(data);
            setTabFilteredRecords(data);
        }
    };

    const naviagateToSinglePolicyScreen = (policy: PolicyDetails) => {
        navigate(location.pathname + '/' + policy.policy_id + '/' + NAV_TABS_VALUE.RESOURCES, { state: { policy } });
    };

    return (
        <>
            <div className="container my-5">
                <div className="d-flex flex-row align-content-around w-70">
                    <button
                        type="button"
                        onClick={() => {
                            setFilteredRecords(tabFilteredRecords);
                        }}
                        className="btn btn-custom btn-filter justify-content-center align-items-center"
                    >
                        {t('all')} ({tabFilteredRecords.length || 0})
                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setFilteredRecords(awsManaged);
                        }}
                        className="btn btn-custom btn-filter justify-content-center align-items-center ms-2"
                    >
                        {/* {t('aws_ManagedPolicy')} ({awsManaged.length || 0}) */}

                        {/* added new tooltip */}
                        <CTooltip content="An AWS managed policy is a standalone policy that is created and administered by AWS" placement='bottom'>
                                <span>
                                {t('aws_ManagedPolicy')} ({awsManaged.length || 0})
                                </span>
                        </CTooltip>

                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setFilteredRecords(custManaged);
                        }}
                        className="btn btn-custom btn-filter justify-content-center align-items-center ms-2"
                    >
                        {/* {t('aws_CustomerManagedPolicy')} ({custManaged.length || 0}) */}

                        {/* added new tooltip */}
                        <CTooltip content="A customer managed policy is a standalone policy created and managed by the user" placement='bottom'>
                                <span>
                                {t('aws_CustomerManagedPolicy')} ({custManaged.length || 0})
                                </span>
                        </CTooltip>

                    </button>
                    <button
                        type="button"
                        onClick={() => {
                            setFilteredRecords(inline);
                        }}
                        className="btn btn-custom btn-filter justify-content-center align-items-center ms-2"
                    >
                        {/* {t('aws_InlinePolicy')} ({inline.length}) */}

                        {/* added new tooltip */}
                        <CTooltip content="An inline policy is a policy that's embedded in an IAM identity (a user, group, or role)" placement='bottom'>
                                <span>
                                {t('aws_InlinePolicy')} ({inline.length})
                                </span>
                        </CTooltip>

                    </button>
                </div>
                <div className="d-flex align-items-center mx-0 w-100 mt-4">
                    <SearchInput onSearch={onSearchPolicies} initialValue={search} placeholder="Search" />
                </div>

                <PoliciesTableComponent
                    translate={t}
                    isLoading={isLoading}
                    data={filteredRecords}
                    currentPageNo={currentPage}
                    onClickRow={(identity: PolicyDetails) => naviagateToSinglePolicyScreen(identity)}
                ></PoliciesTableComponent>
            </div>
        </>
    );
};

export default React.memo(PoliciesTableView);
