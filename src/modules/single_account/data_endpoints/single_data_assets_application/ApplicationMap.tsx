import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import 'translation/i18n';
import Skeleton from 'react-loading-skeleton';
import Graph from 'modules/single_account/data_endpoints/single_data_element/aws_s3_bucket/components/graph/Graph';
import { prepareGraphData } from 'modules/single_account/data_endpoints/single_data_element/aws_s3_bucket/components/graph/Graph.service';
import { getApplicationGraph } from 'core/services/DataEndpointsAPIService';

const ApplicationMap = () => {
    const params = useParams<any>();
    const resourceId: string | undefined | any = params?.sid;
    const [graphData, setGraphData] = useState<any>();
    const [expend, setIsExpend] = useState<any>(false);
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;

    const {
        data: applicationGraph,
        isLoading: loading,
        isError: error,
    } = getApplicationGraph(cloudAccountId, resourceId);
    useEffect(() => {
        let graph;
        const nodes = applicationGraph?.nodes;
        const links = applicationGraph?.links;
        PrepareIdentityGraph(nodes, links, expend, setIsExpend);
        if (expend) {
            graph = PrepareIdentityGraph(nodes, links, expend, setIsExpend);
        } else {
            graph = PrepareIdentityGraph(nodes, links, expend, setIsExpend);
        }
        setGraphData(graph);
    }, [applicationGraph]);

    const PrepareIdentityGraph = (nodes: any, links: any, expend: boolean, setIsExpend: any) => {
        const data = prepareGraphData(
            {
                nodes: nodes,
                links: links,
                identity: true,
                type: 'application',
                isExpend: setIsExpend,
            },

            null,
            '',
            '',
        );
        return data;
    };
    return (
        <Container fluid>
            <div>
                <div className="card-body d-flex">
                    {loading ? (
                        getSkeletonLoader()
                    ) : !error && graphData ? (
                        <Graph {...graphData} identity={true} application={true} />
                    ) : (
                        getSkeletonLoader()
                    )}
                </div>
            </div>
        </Container>
    );
};

export default ApplicationMap;

const getSkeletonLoader = () => (
    <div className="container d-flex flex-column text-center pt-2 align-items-center justify-content-center">
        <div className="d-flex justify-content-center m-2 mt-5 pt-3">
            <Skeleton width={100} height={100} className="m-2" />
        </div>
        <div className="d-flex justify-content-center m-1">
            <Skeleton width={100} height={100} className="m-2" />
            <Skeleton width={100} height={100} className="m-2" />
        </div>
        <div className="d-flex justify-content-center m-1">
            <Skeleton width={100} height={100} className="m-2" />
            <Skeleton width={100} height={100} className="m-2" />
            <Skeleton width={100} height={100} className="m-2" />
        </div>
        <div className="d-flex justify-content-center m-1">
            <Skeleton width={100} height={100} className="m-2" />
            <Skeleton width={100} height={100} className="m-2" />
            <Skeleton width={100} height={100} className="m-2" />
            <Skeleton width={100} height={100} className="m-2" />
        </div>
    </div>
);
