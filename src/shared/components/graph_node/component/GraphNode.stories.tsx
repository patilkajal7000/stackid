import React from 'react';
import GraphNode from './GraphNode';

export default {
    title: 'SingleDataElement/Node',
};

const props = {
    title: 'S3 bucket 1',
    iconURL: 'awsicons/aws_S3.svg',
    count: '5',
    id: 'story',
    nodeType: 'aws_S3',
    subType: '',
    data: {},
};
export const node = () => <GraphNode ApplicationCount={undefined} {...props} />;
