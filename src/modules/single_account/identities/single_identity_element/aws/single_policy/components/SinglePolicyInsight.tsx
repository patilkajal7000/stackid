import { cilArrowLeft } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate } from 'react-router';
import { IdentityType, LevelOfAccess, SinglePolicyInsightsDetails } from 'shared/models/IdentityAccessModel';

type InsightProps = {
    data: SinglePolicyInsightsDetails | undefined;
    isLoading: boolean;
    translate: any;
    riskScore: number;
};

const SinglePolicyInsight = ({ data, riskScore, isLoading, translate }: InsightProps) => {
    const navigate = useNavigate();

    return (
        <div className="mt-3">
            {isLoading ? (
                <div className="container w-100 d-flex justify-content-between mt-5">
                    <div className="w-25">
                        <Skeleton height={10} />
                        <Skeleton height={10} />
                    </div>
                    <div className="w-25">
                        <Skeleton height={10} />
                        <Skeleton height={10} />
                    </div>
                </div>
            ) : (
                data && (
                    <div className="w-100">
                        <div className="custom-shadow p-3">
                            <div className="container">
                                <div className="d-flex">
                                    <CIcon
                                        icon={cilArrowLeft}
                                        className="me-2 cursor-pointer text-primary"
                                        size="xl"
                                        onClick={() => navigate(-1)}
                                    />
                                    <div className="h4"> {data.policyName}</div>
                                </div>
                                <div className="h6">
                                    {translate('risk_score')}: {riskScore}
                                </div>
                                <div className="h6">{translate(data.policyType)}</div>
                                <div className="d-flex flex-row justify-content-between my-3">
                                    <div className="d-flex flex-row ">
                                        <div className="font-small-semibold">{translate('Identities Attached')} </div>
                                        <div className="d-flex flex-column px-2">
                                            <div className="custom-count-badge">
                                                <span> {translate(IdentityType.AwsIAMUser)} </span>
                                                <span> {data?.identities[IdentityType.AwsIAMUser] || 0} </span>
                                            </div>
                                            <div className="custom-count-badge">
                                                <span> {translate(IdentityType.AwsIAMRole)} </span>
                                                <span> {data?.identities[IdentityType.AwsIAMRole] || 0} </span>
                                            </div>
                                            <div className="custom-count-badge">
                                                <span> {translate(IdentityType.AwsIAMGroup)} </span>
                                                <span> {data?.identities[IdentityType.AwsIAMGroup] || 0} </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="d-flex flex-row">
                                        <div className="font-small-semibold ms-auto">{translate('permissions')}</div>
                                        <div className="d-flex flex-row flex-wrap w-65 px-2 align-content-start">
                                            {/* <div className="custom-count-badge m-1">
                                                <span> {translate('admin') + ' ' + translate('permission')} </span>
                                                <span> {data?.permissions?.[LevelOfAccess.Admin] || 0} </span>
                                            </div> */}
                                            <div className="custom-count-badge m-1">
                                                <span> {translate(LevelOfAccess.PermissionsManagement)} </span>
                                                <span>
                                                    {data?.permissions?.[LevelOfAccess.PermissionsManagement] || 0}
                                                </span>
                                            </div>
                                            <div className="custom-count-badge m-1">
                                                <span> {translate(LevelOfAccess.List)} </span>
                                                <span> {data?.permissions?.[LevelOfAccess.List] || 0} </span>
                                            </div>
                                            <div className="custom-count-badge m-1">
                                                <span> {translate(LevelOfAccess.Write)} </span>
                                                <span> {data?.permissions?.[LevelOfAccess.Write] || 0} </span>
                                            </div>
                                            <div className="custom-count-badge m-1">
                                                <span> {translate(LevelOfAccess.Read)} </span>
                                                <span> {data?.permissions?.[LevelOfAccess.Read] || 0} </span>
                                            </div>
                                            <div className="custom-count-badge m-1">
                                                <span> {translate(LevelOfAccess.Tagging)} </span>
                                                <span> {data?.permissions?.[LevelOfAccess.Tagging] || 0} </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default React.memo(SinglePolicyInsight);
