import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import JsonViewer from 'shared/components/json_viewer/JsonViwer';
import { AWS_COLUD_ACCOUNT_ID } from 'shared/utils/Constants';
import { AppState } from 'store/store';

type UserRoleProps = {
    translate: any;
    assumeRoleArn: string;
};

const UserRoleNextStep = (props: UserRoleProps) => {
    const userDetails = useSelector((state: AppState) => state.authState.user);

    const [trustPolicy, setTrustPolicy] = useState<any>();

    useEffect(() => {
        window.scrollTo(0, 0);
        const orgId = userDetails?.org.organisation_id;
        if (orgId) {
            setTrustPolicy({
                Version: '2012-10-17',
                Statement: [
                    {
                        Effect: 'Allow',
                        Principal: {
                            AWS: 'arn:aws:iam::' + AWS_COLUD_ACCOUNT_ID + ':user/si_' + orgId,
                        },
                        Action: 'sts:AssumeRole',
                    },
                ],
            });
        }
    }, []);

    return (
        <div className="col-md-8 mx-5">
            <div className="font-small-semibold mt-3">
                {props.translate('step')} 4: {props.translate('step4_title')}
            </div>
            <div className="font-x-small-medium mt-1 mb-1">{props.translate('step4_decs')}</div>
            <div className="font-small-semibold mb-3">
                {' '}
                {props.translate('si_role_arn')} : {props.assumeRoleArn}
            </div>
            <JsonViewer data={trustPolicy} />
        </div>
    );
};

export default React.memo(UserRoleNextStep);
