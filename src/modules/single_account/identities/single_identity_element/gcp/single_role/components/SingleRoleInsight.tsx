import React from 'react';
import Skeleton from 'react-loading-skeleton';
import { GCPSingleRoleInsightsDetails } from 'shared/models/IdentityAccessModel';

type InsightProps = {
    data: GCPSingleRoleInsightsDetails | undefined;
    isLoading: boolean;
    translate: any;
};

const SingleRoleInsight = ({ data, isLoading, translate }: InsightProps) => {
    return (
        <div className="mt-3">
            {isLoading ? (
                <div className="container w-100 d-flex justify-content-between mt-5">
                    <div className="w-25">
                        <Skeleton height={10} />
                        <Skeleton height={10} />
                    </div>
                    {/* <div className="w-25">
                        <Skeleton height={10} />
                        <Skeleton height={10} />
                    </div> */}
                </div>
            ) : (
                data && (
                    <div className="w-100">
                        <div className="custom-shadow p-3">
                            <div className="container">
                                <div className="h4"> {data.role_name}</div>
                                <div className="h6"> {translate(data.role_type)}</div>

                                <div className="d-flex flex-row justify-content-between my-3">
                                    <div className="d-flex flex-row ">
                                        <div className="font-small-semibold">{translate('identities_attached')} </div>
                                        <div className="d-flex flex-column px-2">
                                            <div className="custom-count-badge">
                                                <span> {translate('human_identities')} </span>
                                                <span> {data?.identities['gcp_IAMUser'] || 0} </span>
                                            </div>
                                            <div className="custom-count-badge">
                                                <span> {translate('application_identities')} </span>
                                                <span> {data?.identities['gcp_IAMServiceAccount'] || 0} </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* <div className="d-flex flex-row">
                                        <div className="font-small-semibold ms-auto">{translate('permissions')}</div>
                                        <div className="d-flex flex-row flex-wrap w-65 px-2 align-content-start">
                                            <div className="custom-count-badge m-1">
                                                <span> {translate('owner')} </span>
                                                <span> {data?.permissions?.[LevelOfAccess.Write] || 0} </span>
                                            </div>
                                            <div className="custom-count-badge m-1">
                                                <span> {translate('editor')} </span>
                                                <span> {data?.permissions?.[LevelOfAccess.Read] || 0} </span>
                                            </div>
                                            <div className="custom-count-badge m-1">
                                                <span> {translate('viewer')} </span>
                                                <span> {data?.permissions?.[LevelOfAccess.Tagging] || 0} </span>
                                            </div>
                                        </div>
                                    </div> */}
                                </div>
                            </div>
                        </div>
                    </div>
                )
            )}
        </div>
    );
};

export default React.memo(SingleRoleInsight);
