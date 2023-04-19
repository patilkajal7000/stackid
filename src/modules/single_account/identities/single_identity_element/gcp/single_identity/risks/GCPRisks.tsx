import { getGCPIdentityRisks } from 'core/services/IdentitiesAPIService';
import React, { useEffect, useState } from 'react';
import { RiskChartMap } from 'shared/models/IdentityAccessModel';
import SingleRisks from '../../../aws/single_user/risks/SingleRisks';

type GCPRisksProps = {
    cloudAccountId: number;
    identitiyId: string;
    identityType: string;
};

const GCPRisks = (props: GCPRisksProps) => {
    const [risks, setRisks] = useState<RiskChartMap>();
    useEffect(() => {
        getGCPIdentityRisks(props.cloudAccountId, props.identityType, props.identitiyId).then((response: any) => {
            if (response) {
                setRisks(response);
            }
        });
    }, []);

    return (
        <div className="container px-0 w-100">
            {risks && (
                <div className="d-flex">
                    <div className="flex-fill">
                        {' '}
                        {risks.unused_access && <SingleRisks type="unused_access" data={risks.unused_access} />}{' '}
                    </div>
                    <div className="flex-fill">
                        {' '}
                        {risks.excessive_access && (
                            <SingleRisks type="excessive_access" data={risks.excessive_access} />
                        )}{' '}
                    </div>
                </div>
            )}
        </div>
    );
};

export default GCPRisks;
