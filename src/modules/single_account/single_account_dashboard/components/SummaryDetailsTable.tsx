import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';

import { NAV_TABS_VALUE } from 'shared/utils/Constants';
import IdentitiesPopupTable from './IdentitiesPopupTable';
import DataAssetsPopupTable from './DataAssetsPopupTable';
import ApplicationsPopupTable from './ApplicationsPopupTable';

const SummaryDetailsTable = (props: any) => {
    const { t } = useTranslation();
    // const classes = useStyles();
    const { type, accountId, data, idType, status, open, setOpen, loading } = props;
    const navigate = useNavigate();
    const [selectedTab, setSelectedTab] = useState<any>();
    const [title, setTitle] = useState<string>();

    const naviagateToSingleIdentityScreen = (identityId: string) => {
        navigate(
            '/accounts/' + accountId + '/AWS/identities/' + selectedTab + '/' + identityId + '/' + NAV_TABS_VALUE.RISK,
        );
    };

    const gotoSingleBucket = (bucketData: any) => {
        navigate(
            '/accounts/' +
                accountId +
                '/AWS/data_assets/' +
                bucketData.resource_type +
                '/' +
                `${bucketData.resource_id}` +
                '/' +
                NAV_TABS_VALUE.RISK_MAP,
        );
    };

    const gotoApplications = () => {
        navigate('/accounts/' + accountId + '/AWS/Applications/Overview');
    };

    useEffect(() => {
        if (type === 'identities' || type === 'risky_identities') {
            if (idType === 'human_user') {
                setTitle('Human Identities');
                setSelectedTab('aws_IAMUserHuman');
            }
            if (idType === 'app_user') {
                setTitle('Application Identities');
                setSelectedTab('aws_IAMUserApplication');
            }
            if (idType === 'federated') {
                setTitle('Federated Identities');
                setSelectedTab('AwsFederated');
            }
            if (idType === 'role') {
                setTitle('Roles');
                setSelectedTab('aws_IAMRole');
            }
        } else if (type === 'data_assets') {
            if (idType === 'aws_S3') {
                setTitle('S3 Buckets');
            }
            if (idType === 'aws_RelationalDatabaseService') {
                setTitle('RDS Instances');
            }
            if (idType === 'aws_RDSCluster') {
                setTitle('RDS Clusters');
            }
            if (idType === 'aws_RedshiftCluster') {
                setTitle('Redshift');
            }
            if (idType === 'aws_DynamoDBTable') {
                setTitle('DynamoDB Tables');
            }
            if (idType === 'aws_DynamoDBExport') {
                setTitle('DynamoDB Exports');
            }
        } else if (type === 'applications') {
            if (idType === 'compute') {
                setTitle('Compute');
            }
            if (idType === 'serverless') {
                setTitle('Serverless');
            }
        }
    }, []);

    return (
        <>
            <CModal visible={open} size="lg" onClose={() => setOpen(false)}>
                <div className="p-2">
                    <CModalHeader className="px-0">
                        <CModalTitle className="pb-0">
                            <div className="float-start">
                                {title} - {status}
                            </div>
                            <div className="float-end ms-4"></div>
                        </CModalTitle>
                    </CModalHeader>
                    <CModalBody className="p-0">
                        <div>
                            {(type === 'identities' || type === 'risky_identities') && (
                                <IdentitiesPopupTable
                                    onClickRow={(identityId: string) => naviagateToSingleIdentityScreen(identityId)}
                                    data={data}
                                    translate={t}
                                    isLoading={loading}
                                    idType={idType}
                                />
                            )}
                            {type === 'data_assets' && (
                                <DataAssetsPopupTable
                                    onClickRow={gotoSingleBucket}
                                    data={data}
                                    isLoading={loading}
                                    translate={t}
                                    resourceType={idType}
                                />
                            )}
                            {type === 'applications' && (
                                <ApplicationsPopupTable
                                    onClickRow={gotoApplications}
                                    data={data}
                                    idType={idType}
                                    isLoading={loading}
                                    translate={t}
                                />
                            )}
                        </div>
                    </CModalBody>
                </div>
            </CModal>
        </>
    );
};

export default SummaryDetailsTable;
