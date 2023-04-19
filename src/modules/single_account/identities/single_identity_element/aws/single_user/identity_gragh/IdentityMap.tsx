import React, { useEffect, useState } from 'react';
import { Container } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import 'translation/i18n';
import Skeleton from 'react-loading-skeleton';
import Graph from 'modules/single_account/data_endpoints/single_data_element/aws_s3_bucket/components/graph/Graph';
import { prepareGraphData } from 'modules/single_account/data_endpoints/single_data_element/aws_s3_bucket/components/graph/Graph.service';
import { getIdentityConnectionsMap } from 'core/services/IdentitiesAPIService';
import { useSelector } from 'react-redux';
import { AppState } from 'store/store';

const IdentityMap = () => {
    const params = useParams<any>();
    const resourceId: string | undefined | any = params?.rid;
    const [graphData, setGraphData] = useState<any>();
    const [isError, setIsError] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [render, setRender] = useState(false);
    const [, setGraphPreparing] = useState(false);
    const [expend, setIsExpend] = useState<any>(false);
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;

    const PrepareIdentityGraph = (nodes: any, links: any, expend: boolean, setIsExpend: any) => {
        const data = prepareGraphData(
            {
                nodes: nodes,
                links: links,
                identity: true,
                isExpend: setIsExpend,
            },

            null,
            '',
            '',
        );
        return data;
    };
    // useEffect(() => {
    //
    //     dispatch(
    //         setTabsAction(SCREEN_NAME.SINGLE_IDENTITY_ELEMENT, NAV_TABS_VALUE.IDENTITY_MAP, NAV_TABS_VALUE.IDENTITIES),
    //     );
    // }, []);

    useEffect(() => {
        setGraphData([]);
        setIsLoading(true);
        setGraphPreparing(true);
        setRender(false);
        getIdentityConnectionsMap(cloudAccountId, resourceId, discoveryId)
            .then((response: any) => {
                setRender(true);
                setIsLoading(false);
                let data;
                const nodes = response?.nodes;
                const links = response?.links;
                PrepareIdentityGraph(nodes, links, expend, setIsExpend);
                if (expend) {
                    data = PrepareIdentityGraph(nodes, links, expend, setIsExpend);
                } else {
                    data = PrepareIdentityGraph(nodes, links, expend, setIsExpend);
                }
                setGraphData(data);
            })
            .catch((error: any) => {
                console.log('in error', error);
                setIsError(true);
                setIsLoading(false);
                setRender(false);
                setGraphPreparing(false);
            });
        // setRender(true);
        // setIsLoading(false);
        // let data;
        // const nodes = abc?.nodes;
        // const links = abc?.links;
        // PrepareIdentityGraph(nodes, links, expend, setIsExpend);
        // if (expend) {
        //     data = PrepareIdentityGraph(nodes, links, expend, setIsExpend);
        // } else {
        //     data = PrepareIdentityGraph(nodes, links, expend, setIsExpend);
        // }
        // setGraphData(data);
        // setRender(true);
    }, [resourceId, expend, discoveryId]);

    return (
        <Container fluid>
            <div>
                <div className="card-body d-flex">
                    {isLoading ? (
                        getSkeletonLoader()
                    ) : !isError && render && graphData ? (
                        <Graph {...graphData} identity={true} />
                    ) : (
                        getSkeletonLoader()
                    )}
                </div>
            </div>
        </Container>
    );
};

export default IdentityMap;

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
