import React from 'react';
import DividedBar from '../divided_bar/DividedBar';

type Category = {
    severity: string;
    value: number;
    color: string;
};

export type Props = {
    title: string;
    value: number;
    data: Array<Category>;
    showValue?: boolean;
    onClick: (resource_type: string) => void;
};

const SummaryCard = (props: Props) => {
    const getTitleText = (key: string) => {
        const resource: any = {
            aws_S3: 'S3 Buckets',
            aws_RelationalDatabaseService: 'RDS',
        };
        return resource[key];
    };
    return (
        <div
            className="btn card px-0"
            style={{ width: '10rem' }}
            onClick={() => props.onClick(props.title)}
            role="presentation"
        >
            <div className="card-header h4 text-center text-truncate" title={props.title}>
                {getTitleText(props.title)}
            </div>
            <div className="card-body px-0 py-2 text-center">
                <div className="text-value-xl mb-3 text-muted">{props.value}</div>
                <div className="p-2">
                    <DividedBar data={props.data} showValue={false} />
                </div>
            </div>
        </div>
    );
};

export default SummaryCard;
