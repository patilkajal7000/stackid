import React from 'react';
import { ResourcesSeverity } from 'shared/models/DataEndpointSummaryModel';
import { SeverityType } from 'shared/models/RHSModel';
import { SEVERITY_CATEGORIES, SEVERITY_NAME } from 'shared/utils/Constants';
import InsightsDetails from './InsightsDetails';

export default {
    title: 'Applications/InsightsDetails',
};

const body: Record<typeof SEVERITY_NAME, ResourcesSeverity[]> = {
    S3_bucket_encryption: [
        {
            Name: 'SI Bucket',
            category: 'DATA_CONFIDENTIALITY',
            id: 'bucketId',
            severity: SeverityType.HIGH,
            severityName: 'S3_bucket_encryption',
        },
    ],
};

const keyMap = Object.keys(SEVERITY_CATEGORIES);
export const InsightsDetailsStory = () => (
    <div className="col-md-3">
        {keyMap.map((key: any, index: number) => (
            <InsightsDetails key={index} title={key} count={12} showCount index={index} body={body} />
        ))}
    </div>
);
