import { CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle } from '@coreui/react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation, useParams } from 'react-router-dom';
import { CloudAccountProvider } from 'shared/models/CloudAccountModel';
import { DATA_ASSETS } from 'shared/utils/Constants';
const AWSViewItems: { id: string; resource_type: string }[] = [
    { id: DATA_ASSETS.S3_BUCKET, resource_type: 'aws_S3' },
    // { id: DATA_ASSETS.RDS, resource_type: 'aws_RelationalDatabaseService' },
    { id: DATA_ASSETS.RDS_INSTANCE, resource_type: 'aws_RDSInstance' },
    { id: DATA_ASSETS.RDS_CLUSTER, resource_type: 'aws_RDSCluster' },
    { id: DATA_ASSETS.RED_SHIFT, resource_type: 'aws_RedshiftCluster' },
    // { id: DATA_ASSETS.DYNAMODB, resource_type: 'aws_DynamoDB' },
    { id: DATA_ASSETS.DYNAMODB_TABLE, resource_type: 'aws_DynamoDBTable' },
    { id: DATA_ASSETS.DYNAMODB_EXPORT, resource_type: 'aws_DynamoDBExport' },
];

const GCPViewItems: { id: string; resource_type: string }[] = [
    { id: DATA_ASSETS.BIG_QUERY, resource_type: 'bq_Dataset' },
];
type DataEndpointHeaderProps = {
    resourceType: string;
    onDataAssestsChange: (selectedDataAssest: { id: string; resource_type: string }) => void;
};
const DataEndpointHeader = (props: DataEndpointHeaderProps) => {
    const [ViewItems, setViewItems] = useState<{ id: string; resource_type: string }[]>([]);
    const [selectedViewValue, setSelectedViewValue] = useState<{ id: string; resource_type: string }>();
    const { t } = useTranslation();
    const params = useParams<any>();
    const cloudAccountType = params?.cloudAccountType;
    const location = useLocation();

    useEffect(() => {
        if (cloudAccountType == CloudAccountProvider.AWS) {
            ViewItems.push(...AWSViewItems);
        } else if (cloudAccountType == CloudAccountProvider.GCP) {
            setViewItems(GCPViewItems);
            ViewItems.push(...GCPViewItems);
        }
    }, []);
    useEffect(() => {
        const path = location.pathname.includes('aws_RedshiftCluster')
            ? 'aws_RedshiftCluster'
            : location.pathname.includes('aws_RDSInstance')
            ? 'aws_RDSInstance'
            : location.pathname.includes('aws_RDSCluster')
            ? 'aws_RDSCluster'
            : location.pathname.includes('aws_DynamoDBTable')
            ? 'aws_DynamoDBTable'
            : location.pathname.includes('aws_DynamoDBExport')
            ? 'aws_DynamoDBExport'
            : location.pathname.includes('gcp_IAMUser') || location.pathname.includes('bq_Dataset')
            ? 'bq_Dataset'
            : location.pathname.includes('aws_S3')
            ? 'aws_S3'
            : 'aws_S3';
        const selectedItem = ViewItems.filter(
            (item: { id: string; resource_type: string }) => item.resource_type == path,
        );
        if (selectedItem && selectedItem.length > 0) {
            setSelectedViewValue(selectedItem[0]);
        }
    }, [location.pathname]);

    useEffect(() => {
        if (selectedViewValue) props.onDataAssestsChange(selectedViewValue);
    }, [selectedViewValue]);

    return (
        <div className="container py-2 d-flex justify-content-between align-items-center border-bottom px-0">
            <div className="h3">{selectedViewValue && t(selectedViewValue.id)}</div>

            <div className="d-flex align-items-center border-neutral-700 w-240 rounded">
                <div className="d-flex align-items-center px-2 w-100 ">
                    <div className="font-x-small-bold">{t('view')}</div>
                    <div className="input-group w-100">
                        <CDropdown placement="bottom" className=" p-1 w-100">
                            <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 w-100">
                                <div className="h6 pe-5 py-0 m-0">{selectedViewValue && t(selectedViewValue.id)}</div>
                            </CDropdownToggle>
                            <CDropdownMenu>
                                {ViewItems.map((item: any, index: number) => (
                                    <CDropdownItem
                                        key={index}
                                        onClick={() => {
                                            setSelectedViewValue(item);
                                        }}
                                    >
                                        {t(item.id)}
                                    </CDropdownItem>
                                ))}
                            </CDropdownMenu>
                        </CDropdown>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default React.memo(DataEndpointHeader);
