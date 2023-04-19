import { getIdentityResourceOverview } from 'core/services/IdentitiesAPIService';
import React, { useEffect, useState } from 'react';
import { RiskChartDetails } from 'shared/models/IdentityAccessModel';
import SingleRisks from '../../../aws/single_user/risks/SingleRisks';

type AWSRisksProps = {
    cloudAccountId: number;
    identitiyId: string;
    identityType: string;
};

const AWSRisks = (props: AWSRisksProps) => {
    const [risks, setRisks] = useState<RiskChartDetails>();
    useEffect(() => {
        getIdentityResourceOverview(props.cloudAccountId, props.identitiyId).then((response: any) => {
            if (response) {
                setRisks(response);
            }
        });
    }, []);

    return <div className="container px-0">{risks && <SingleRisks data={risks} type="unused_access" />}</div>;
};

export default AWSRisks;
