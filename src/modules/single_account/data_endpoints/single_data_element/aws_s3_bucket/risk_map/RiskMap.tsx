import React, { useCallback, useEffect, useState } from 'react';
import { CContainer, CDropdown, CDropdownItem, CDropdownMenu, CDropdownToggle, CFormSwitch } from '@coreui/react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import {
    getAccessIdentities,
    getAllRiskPath,
    getApplicationConnections,
    getApplicationDetails,
    getAtteckMap,
    getEndPath,
    getIdentityMappings,
    getMappingsDetails,
    getResourceDetails,
    getRisks,
} from 'core/services/DataEndpointsAPIService';
import { changeRightSidebarAction, setRightSidebarJSONAction, toggleRHSPanelAction } from 'store/actions/SidebarAction';
import Graph from '../components/graph/Graph';
import 'translation/i18n';
import Skeleton from 'react-loading-skeleton';
import { Pattern, PreparedRiskData } from 'shared/models/RiskModel';
import { prepareRiskData } from '../services/SingleDataElementService';
import { setBPIDetailsAction } from 'store/actions/BPIAction';
import { BPIModel } from 'shared/models/BPIModel';
import useInput from 'shared/hooks/use-input';
import { emptyStringValidation } from 'shared/service/ValidationService';
import { AppState } from 'store/store';
import { setGraphAllDataAction } from 'store/actions/GraphActions';
import { CLOUDACCOUNT } from 'modules/cloud_accounts';
import { NAV_TABS_VALUE, SCREEN_NAME } from 'shared/utils/Constants';
import { prepareGraphData } from '../components/graph/Graph.service';
import { setTabsAction } from 'store/actions/TabsStateActions';
const MAX_RISK_API = 1;
export type BucketDetails = {
    name: string;
    createdBy: string;
    creationDate: string;
    resourceDetails: any;
    native_tags?: any;
    data_security?: any;
};

const RiskMap = () => {
    const params = useParams<any>();
    const resourceId: string | undefined | any = params?.rid;
    const type: any = params?.type;
    const cloudAccountType = params?.cloudAccountType;
    const [graphData, setGraphData] = useState<any>();

    const [, setIdentityDetails] = useState<any>();

    const [graphRisks, setgraphRisks] = useState<Pattern[]>();
    const [graphAllRiskPath, setgraphAllRiskPath] = useState<string[]>();

    const [isError, setIsError] = useState(false);
    const [nodeId, setNodeId] = useState<any>();

    const [groupedLinks, setGroupedLinks] = useState<any>();

    const [, setFirstNode] = useState<any>('');

    const [expend, setIsExpend] = useState<any>(false);
    const [isLoading, setIsLoading] = useState(false);
    const [render, setRender] = useState(false);
    const [graphPreparing, setGraphPreparing] = useState(false);
    const [RiskygraphPreparing, setRiskyGraphPreparing] = useState(false);
    const [riskLoadCount, setRiskLoadCount] = useState(0);

    const [graphCheck, setGraphCheck] = useState(false);
    const [switchDisble, setSwitchDisable] = useState(false);
    const [parentsDataLocal, setParentDataLocal] = useState({});
    const graphAllData = useSelector((state: AppState) => state.graphState.allData?.trevalList);
    const graphAll = useSelector((state: AppState) => state.graphState);
    const parentGraph = useSelector((state: AppState) => state.graphState.allData?.parent);
    const dispatch = useDispatch();
    const userDetails = useSelector((state: AppState) => state.authState.user);
    const selectedList = useSelector((state: AppState) => state.graphState.allData?.selectedList);
    const [selectedListNew, setSelectedListNew] = useState<any>([]);
    const orgId: any = userDetails?.org.organisation_id;
    const riskState = useSelector((state: AppState) => state.riskState);
    const selectedRisk = riskState.selectedRisk;
    const selectedcloudAccounts = useSelector((state: AppState) => state.cloudAccountState.selectedCloudAccount);
    const discoveryId: number | null | undefined = selectedcloudAccounts?.latest_discovery_id
        ? selectedcloudAccounts?.latest_discovery_id
        : 0;
    const navigate = useNavigate();
    const cloudAccountId: number | undefined = params?.cloudAccountId ? parseInt(params?.cloudAccountId) : 0;
    const { value: configType } = useInput(emptyStringValidation);

    useEffect(() => {
        setSelectedListNew(selectedList);
    }, [selectedList]);
    useEffect(() => {
        dispatch(
            setTabsAction(SCREEN_NAME.SINGLE_DATA_ELEMENT, NAV_TABS_VALUE.RISK_MAP, NAV_TABS_VALUE.DATA_ENDPOINTS),
        );
        dispatch(toggleRHSPanelAction(true));
        dispatch(setRightSidebarJSONAction({ risks: [] }));
    }, []);
    function calculateRisk(AllRisk: any, page_end: boolean, count: number) {
        let risks: PreparedRiskData;
        const arr: any = [];
        AllRisk.map((item: any) => {
            const bpiDetails: BPIModel = {
                bpi: item.bpi_score,
                last_checked_on: item?.updated,
            };

            dispatch(setBPIDetailsAction(bpiDetails));
            risks = prepareRiskData(item.path_bpi, item.path_id, 'all');
            dispatch(setRightSidebarJSONAction({ risks: risks.riskPanelData }));
            arr.push(risks);
        });

        const graphRisksAll: any = [];
        const graphRisksAllLink: any = [];
        arr.map((item: any) => {
            graphRisksAll.push(item.graphRisks);
            graphRisksAllLink.push(item.allLinks);
        });
        const riskLoadPercentage = Math.round((count / MAX_RISK_API) * 100);
        setRiskLoadCount(riskLoadPercentage >= 100 ? 95 : riskLoadPercentage);

        if (page_end || count >= MAX_RISK_API) {
            setRiskyGraphPreparing(true);
            setIsLoading(true);
            setgraphRisks(graphRisksAll.flat());
            setgraphAllRiskPath(graphRisksAllLink?.flat());
        }

        return;
    }
    useEffect(() => {
        if (type == 'aws_S3') {
            if (!graphCheck) {
                setIsLoading(true);
                getRisks(cloudAccountId, resourceId)
                    .then((response: any) => {
                        const bpiDetails: BPIModel = {
                            bpi: response.bpi,
                            last_checked_on: response?.last_checked_on,
                        };
                        const accessPaths: any = response.access_paths;
                        let bpiPathKey = '';
                        if (response.bpi_path_keys && response.bpi_path_keys.length > 0) {
                            bpiPathKey = response.bpi_path_keys[0];
                        }
                        const risks: PreparedRiskData = prepareRiskData(accessPaths, bpiPathKey);
                        dispatch(setRightSidebarJSONAction({ risks: risks.riskPanelData }));
                        dispatch(setBPIDetailsAction(bpiDetails));
                        setgraphAllRiskPath(risks.allLinks.flat());
                        setgraphRisks(risks.graphRisks);
                    })
                    .catch((error: any) => {
                        setSwitchDisable(true);
                        setGraphCheck(false);
                        setgraphRisks([]);
                        console.log('in error', error);
                    });
            } else {
                const AllRisk: any = [];
                let count = 0;
                getAllRiskPath(orgId, cloudAccountId, discoveryId, resourceId)
                    .then((res: any) => {
                        setIsLoading(true);
                        if (res.page_end) {
                            setIsLoading(false);
                            setRiskyGraphPreparing(true);

                            setgraphRisks(() => graphRisks?.concat([]));
                            return;
                        } else {
                            res.paths.map((item: any) => {
                                item.path_bpi = JSON.parse(item.path_bpi);
                                AllRisk.push(item);
                            });
                            const link = res?.link;
                            if (!res.page_end) {
                                recursive(link);
                            } else {
                                calculateRisk(AllRisk, res.page_end, count);
                            }
                        }
                        function recursive(link: any) {
                            link &&
                                getEndPath(orgId, cloudAccountId, discoveryId, resourceId, link).then((resp: any) => {
                                    if (!resp.page_end) {
                                        resp?.paths &&
                                            resp?.paths?.map((item: any) => {
                                                item.path_bpi = JSON.parse(item.path_bpi);
                                                AllRisk.push(item);
                                            });
                                        calculateRisk(AllRisk, resp.page_end, count);
                                        if (count <= MAX_RISK_API) {
                                            recursive(resp.link);
                                            count++;
                                        } else {
                                            return;
                                        }
                                    } else {
                                        calculateRisk(AllRisk, resp.page_end, count);
                                    }
                                    // AllRisk.push(resp.paths);
                                });
                        }
                    })
                    .catch((err: any) => {
                        console.log('error', err);
                    });
            }
        } else {
            setSwitchDisable(true);
            setGraphCheck(false);
            setgraphRisks([]);
        }
        return () => {
            dispatch(changeRightSidebarAction(false));
            dispatch(toggleRHSPanelAction(false));
            // dispatch(
            //     setGraphAllDataAction({
            //         allData: [],
            //         trevalList: [],
            //     }),
            // );
        };
    }, [graphCheck]);

    const PrepareGraphComman = (
        groupnodes: any,
        grouplinks: any,
        expend: any,
        graphAllData: any,
        parentGraph: any,
        nodes: any,
        links: any,
        response: any,
        firstNodes?: any,
        groupedNodes?: any,
    ) => {
        let data;
        if (expend) {
            //********parents node and links filter by selected nodes  */
            const parentNodes = parentGraph?.nodes?.filter((item: any) => item?.id == nodeId);
            const parentsLinks = parentGraph?.links?.filter((item: any) => item?.source == nodeId);

            /************** add data in store data in current data */
            graphAllData?.nodes?.map((item: any) => {
                nodes.unshift(item);
            });
            graphAllData?.links?.map((item: any) => {
                links.unshift(item);
            });

            /************** add data in parents data in current data */
            const trevalNodes = graphAllData.nodes.concat(parentNodes);
            const trevalLinks = graphAllData.links.concat(parentsLinks);
            setParentDataLocal({ nodes, links });
            const allNodes = nodes.concat(parentNodes);
            const allLinks = links.concat(parentsLinks);
            //***********  store data in redux travel data*/
            dispatch(
                setGraphAllDataAction({
                    trevalList: { nodes: trevalNodes, links: trevalLinks },
                    parent: { nodes, links },
                    allData: { nodes: allNodes, links: allLinks },
                    selectedList: selectedList,
                }),
            );

            data = prepareGraphData(
                {
                    nodes: nodes.concat(parentNodes),
                    links: links.concat(parentsLinks),
                    firstNodes: firstNodes,
                    groupedNodes: groupedNodes,
                    graphRisks: graphRisks,
                    parentGraphData: graphData,
                    partial_graph: response.partial_graph,
                    isExpend: setIsExpend,
                    setNodeId,
                    nodeId,
                    graphAllRiskPath,
                    graphtype: type,
                },
                selectedRisk,
                '',
                '',
            );
        } else {
            if (graphAllData.length == 0) {
                data = prepareGraphData(
                    {
                        nodes: groupnodes,
                        links: grouplinks,
                        firstNodes: firstNodes,
                        groupedNodes: groupedNodes,
                        graphRisks: graphRisks,
                        partial_graph: response.partial_graph,
                        isExpend: setIsExpend,
                        setNodeId,
                        nodeId,
                        graphAllRiskPath,
                        graphtype: type,
                    },
                    selectedRisk,
                    '',
                    '',
                );
            } else {
                let combineNodes, combineLinks;
                if (nodeId) {
                    combineNodes = groupnodes.concat(graphAllData.nodes);
                    combineLinks = grouplinks.concat(graphAllData.links);
                } else {
                    combineNodes = graphAll.allData.data.nodes;
                    combineLinks = graphAll.allData.data.links;
                }

                data = prepareGraphData(
                    {
                        nodes: combineNodes,
                        links: combineLinks,
                        graphRisks: graphRisks,
                        firstNodes: firstNodes,
                        groupedNodes: groupedNodes,
                        partial_graph: response.partial_graph,
                        isExpend: setIsExpend,
                        setNodeId,
                        nodeId,
                        graphAllRiskPath,
                        graphtype: type,
                    },
                    selectedRisk,
                    '',
                    '',
                );
                dispatch(
                    setGraphAllDataAction({
                        lastselectedNode: nodeId || resourceId,
                        trevalList: graphAllData,
                        parent: {
                            nodes: combineNodes,
                            links: combineLinks,
                        },
                        allData: { nodes: combineNodes, links: combineLinks },
                        selectedList: selectedList,
                    }),
                );
            }
        }
        if (graphAllData.length == 0) {
            const allNodes = groupnodes.concat(graphAllData.nodes);
            const allLinks = grouplinks.concat(graphAllData.links);
            const nodes1 = groupnodes.filter(
                (item: any) => item?.id == groupnodes[0]?.id || item?.source == groupnodes[0]?.id,
            );
            const links1 = grouplinks.filter(
                (item: any) => item?.id == grouplinks[0]?.id || item?.source == grouplinks[0]?.id,
            );
            const nodes = groupnodes;
            const links = grouplinks;
            setParentDataLocal({ nodes, links });

            dispatch(
                setGraphAllDataAction({
                    lastselectedNode: nodeId || resourceId,
                    trevalList: { nodes: nodes1, links: links1 },
                    parent: { nodes, links },
                    allData: { nodes: allNodes, links: allLinks },
                    // selectedList: selectedList && selectedList.length > 0 ? [selectedList[0]] : [data.nodes[0]],
                    selectedList: selectedList && selectedList.length > 0 ? [selectedList[0]] : [data.nodes[0]],
                }),
            );
        }

        if (RiskygraphPreparing == true) {
            setRender(true);
            const sourceArray: any = [];
            //catch only risky link and node
            const n = data.nodes.filter((item: any) => item.risk);
            const l = data.links.filter((item: any) => item.data.isRiskyOnly);

            // push intermidate source id  node in risky link
            data.links.map((item: any) => {
                if (item.data.isRiskyOnly) {
                    sourceArray.push(item.source);
                }
            });
            // push intermidate target id  node in risky link
            data.links.map((item: any) => {
                if (item.data.isRiskyOnly) {
                    sourceArray.push(item.target);
                }
            });
            // push nodes in risky graph
            data.nodes.map((item: any) => {
                sourceArray.map((item2: any) => {
                    if (item.id == item2) {
                        n.push(item);
                    }
                });
            });
            setIsLoading(false);
            setGraphData({ nodes: n, links: l });
        } else {
            setIsLoading(false);
            setRender(true);
            setGraphData(data);
        }
        // setGraphData(data);
    };

    useEffect(() => {
        if (!graphRisks || graphPreparing) {
            return;
        }

        setIsLoading(true);
        setGraphPreparing(true);
        dispatch(toggleRHSPanelAction(true));

        const id = expend ? nodeId : resourceId;

        if (type == 'aws_S3') {
            getApplicationConnections(id, cloudAccountId, 'All')
                .then((response: any) => {
                    setIsLoading(true);
                    setGraphPreparing(false);
                    if (response && response.links) {
                        response.links = response.links.filter(
                            (v: { id: any }, i: any, a: any[]) =>
                                a.findIndex((v2: { id: any }) => v2.id === v.id) === i,
                        );
                    }

                    const nodes = response.nodes;
                    const links = (response && response.links) || [];

                    if (links.length >= 50) {
                        getNodesGrouping(response);
                        return;
                    } else {
                        PrepareGraphComman(nodes, links, expend, graphAllData, parentGraph, nodes, links, response);
                    }
                })
                .catch((error: any) => {
                    console.log('in error', error);
                    setIsError(true);
                    setIsLoading(false);
                    setGraphPreparing(false);
                });
        } else {
            getAtteckMap(cloudAccountId, resourceId, discoveryId, type)
                .then((response: any) => {
                    setIsLoading(true);
                    setGraphPreparing(false);
                    if (response && response.links) {
                        response.links = response.links.filter(
                            (v: { id: any }, i: any, a: any[]) =>
                                a.findIndex((v2: { id: any }) => v2.id === v.id) === i,
                        );
                    }

                    const nodes = response.nodes;
                    const links = (response && response.links) || [];

                    if (links.length >= 50) {
                        getNodesGrouping(response);
                        return;
                    } else {
                        PrepareGraphComman(nodes, links, expend, graphAllData, parentGraph, nodes, links, response);
                    }
                })
                .catch((error: any) => {
                    console.log('in error', error);
                    setIsError(true);
                    setIsLoading(false);
                    setGraphPreparing(false);
                });
        }
        // dispatch(setRightSidebarJSONAction({ risks: [] }));

        return () => {
            dispatch(changeRightSidebarAction(false));
            dispatch(toggleRHSPanelAction(false));
            // dispatch(setGraphAllDataAction({ trevalList: [], parent: [] }));
        };
    }, [resourceId, graphRisks, expend, nodeId]);

    const getNodesGrouping = (data: any) => {
        setFirstNode(data.nodes[0]);
        // get array of Link ids
        const linksArray: any[] = [];
        let resDetails: any;
        data.links.map((data: any) => {
            linksArray.push(data.id);
        });

        if (linksArray.length > 0) {
            getIdentityMappings(orgId, cloudAccountId, { link_ids: linksArray })
                .then((response: any) => {
                    const unique = groupByKey(response, 'identity_name');

                    let arr: any = [];
                    const arr1: any = [];
                    Object.values(unique)?.map((identity: any) => {
                        for (let i = 0; i < identity.length; i++) arr.push(identity[i].link_id);

                        arr1.push(arr);
                        //reset array
                        arr = [];
                    });

                    const arr2: any = [];
                    response?.map((identity: any) => {
                        if (!identity.identity_name) arr2.push([identity?.link_id]);
                    });

                    resDetails = arr1.concat(arr2);
                    const arrnew: any = [];
                    const arr1new: any = [];
                    resDetails.map((identity: any) => {
                        for (let i = 0; i < identity.length; i++) {
                            i === 0 ? arrnew.push(identity[i]) : arr1new.push(identity[i]);
                        }
                    });
                    const firstLinks = arrnew;

                    setGroupedLinks(arr1new);

                    setIdentityDetails(unique);
                    let nodes: any = [];
                    let nodes1: any = [];
                    const nodesArray: any = [];
                    const nodesArray1: any = [];

                    if (resDetails) {
                        resDetails?.map((resource: any) => {
                            if (resource.length > 1) {
                                resource?.map((r: any) => {
                                    data?.links.map((data: any, i: any) => {
                                        if (data?.id === r) {
                                            nodes.push(data?.source);
                                            nodes1.push({ id: data?.id, node: data?.source, grouped: true, i: i });
                                        }
                                    });
                                });
                            } else {
                                resource?.map((r: any) => {
                                    data?.links.map((data: any, i: any) => {
                                        if (data?.id === r) {
                                            nodes.push(data?.source);
                                            nodes1.push({ id: data?.id, node: data?.source, grouped: false, i: i });
                                        }
                                    });
                                });
                            }

                            nodesArray.push(nodes);
                            nodesArray1.push(nodes1);

                            nodes = [];
                            nodes1 = [];
                        });
                    }
                    let names: any = [];
                    const namesArray: any = [];
                    nodesArray?.map((n: any) => {
                        if (n.length > 1) {
                            n?.map((id: any) => {
                                data?.nodes.map((data: any) => {
                                    if (data?.id === id) {
                                        names.push({ id: id, name: data?.name });
                                    }
                                });
                            });
                        } else {
                            n?.map((id: any) => {
                                data?.nodes.map((data: any) => {
                                    if (data?.id === id) {
                                        names.push({ id: id, name: data?.name });
                                    }
                                });
                            });
                        }
                        namesArray.push(names);
                        names = [];
                    });
                    // setGroupedNodes(namesArray);
                    const groupedNodes = namesArray;
                    // setting the first nodes
                    const na: any = [];

                    nodesArray1.map((node: any) => {
                        na.push(node[0]);
                    });

                    // setting the first nodes info
                    const flags: any = [];
                    const output: any = [];
                    for (let i = 0; i < na.length; i++) {
                        if (flags[na[i].node]) continue;
                        flags[na[i].node] = true;
                        output.push(na[i]);
                    }

                    const firstNodes = output;

                    const sources: any = [];
                    const newLinks: any = [];
                    newLinks.push(data?.links[0]);
                    data?.links.map((link: any) => {
                        if (firstLinks?.includes(link.id) && !sources?.includes(link.source)) {
                            sources.push(link.source);
                            newLinks.push(link);
                        }
                    });

                    // remove grouped nodes from nodes Array
                    const sourceIds: any = [];
                    data?.links.map((link: any) => {
                        groupedLinks?.map((glink: any) => {
                            if (glink === link?.id) {
                                sourceIds.push(link.source);
                                const index = sources.indexOf(link.source);
                                if (index > -1) sources.splice(index, 1);
                            }
                        });
                        //newLinks.map((l: any) => {
                        /*if (sourceIds?.includes(link?.source)) {
                                    console.log(link?.source)
                                    const index1 = newLinks.indexOf(link?.id);
                                        if (index1 > -1)
                                            newLinks.splice(index1, 1);
                                }*/
                        //})
                    });

                    const newNodes: any = [];
                    newNodes.push(data?.nodes[0]);

                    data.nodes.map((node: any) => {
                        if (sources?.includes(node.id)) newNodes.push(node);
                    });
                    const uniqueIds: any = [];
                    const unique1 = newLinks.filter((element: any) => {
                        const isDuplicate = uniqueIds.includes(element.id);

                        if (!isDuplicate) {
                            uniqueIds.push(element.id);

                            return true;
                        }

                        return false;
                    });

                    PrepareGraphComman(
                        newNodes,
                        unique1,
                        expend,
                        graphAllData,
                        parentGraph,
                        newNodes,
                        unique1,
                        data,
                        firstNodes,
                        groupedNodes,
                    );
                })
                .catch((error: any) => {
                    console.log('in error', error);
                    setIsError(true);
                    setIsLoading(false);
                });
        }
        // setLinks({ link_ids: linksArray });

        // setting the grouped nodes info
    };

    // group by identity_name
    function groupByKey(array: [], key: string) {
        return array.reduce((hash: any, obj: any) => {
            if (obj[key] === undefined) return hash;
            return Object.assign(hash, { [obj[key]]: (hash[obj[key]] || []).concat(obj) });
        }, {});
    }

    const navigateTo = (id: any, item: any) => {
        if (!selectedListNew || (selectedListNew && selectedListNew.length <= 1)) {
            return false;
        }
        selectedListNew.indexOf(id);

        const removeSelectedBelow = selectedListNew.splice(0, selectedListNew.indexOf(item) + 1);

        setSelectedListNew(removeSelectedBelow);
        //**************logic of collapse  */
        const remainIds: any = [];
        removeSelectedBelow.map((item: any) => remainIds.push(item.id));

        const N = graphAllData.nodes.filter((val: any) => remainIds.includes(val?.id));
        const L = graphAllData.links.filter((val: any) => remainIds.includes(val?.source));

        dispatch(
            setGraphAllDataAction({
                lastselectedNode: nodeId || resourceId,
                trevalList: { nodes: N, links: L },
                allData: graphAllData,
                selectedList: removeSelectedBelow,
                parent: parentsDataLocal,
            }),
        );

        setIsExpend(false);
        setGraphData([]);
        setNodeId(id);
        navigate(
            CLOUDACCOUNT +
                '/' +
                cloudAccountId +
                '/' +
                cloudAccountType +
                '/' +
                NAV_TABS_VALUE.DATA_ENDPOINTS +
                '/' +
                type +
                '/' +
                id +
                '/' +
                NAV_TABS_VALUE.RISK_MAP,
        );
    };

    const getApplicationInfoForPopover = useCallback((event: any, element: any, callback: any) => {
        const appId = element?.id;
        if (cloudAccountId && appId) {
            getApplicationDetails(cloudAccountId, appId)
                .then((response: any) => {
                    callback(response);
                })
                .catch((error: any) => {
                    console.log('in error', error);
                });
        }
    }, []);

    const getResourceInfoForPopover = useCallback((event: any, element: any, callback: any) => {
        const resId = element?.id;
        if (cloudAccountId && resId && resId != 'nodeIdentities') {
            getResourceDetails(cloudAccountId, resId)
                .then((response: any) => {
                    callback(response);
                })
                .catch((error: any) => {
                    console.log('in error', error);
                });
        }
    }, []);

    const onLinkClick = useCallback((linkId: number, callback: any) => {
        if (linkId) {
            getMappingsDetails(cloudAccountId, linkId)
                .then((response: any) => {
                    callback(response);
                })
                .catch((error: any) => {
                    console.log('in error', error);
                });
        }
    }, []);

    const onIdentitiesClick = useCallback((nodeId: string, nodeType: string, callback: any) => {
        getAccessIdentities(cloudAccountId, nodeId, nodeType)
            .then((response: any) => {
                callback(response);
            })
            .catch((error: any) => {
                console.log('in error', error);
            });
    }, []);

    useEffect(() => {
        if (configType) {
            // getApplicationConnections(resourceId, cloudAccountId, configType as 'Identity' | 'Network' | 'All')
            getApplicationConnections(resourceId, cloudAccountId, 'All')
                .then((response: any) => {
                    setIsLoading(false);
                    if (response && response.links) {
                        response.links = response.links.filter(
                            (v: { id: any }, i: any, a: any[]) =>
                                a.findIndex((v2: { id: any }) => v2.id === v.id) === i,
                        );
                    }
                    const data = prepareGraphData(
                        {
                            nodes: response.nodes,
                            links: response.links,
                            graphRisks: graphRisks,
                            isExpend: setIsExpend,
                            setNodeId,
                            nodeId,
                            graphAllRiskPath,
                            graphtype: type,
                        },
                        selectedRisk,
                        '',
                        '',
                    );

                    setGraphData(data);
                    // setGraphData(response);
                })
                .catch((error: any) => {
                    console.log('in error', error);
                    setIsError(true);
                    setIsLoading(false);
                });
        }
    }, [configType]);

    const onClickSwitch = () => {
        setGraphCheck(!graphCheck);
        setIsLoading(true);
        navigate(
            CLOUDACCOUNT +
                '/' +
                cloudAccountId +
                '/' +
                cloudAccountType +
                '/' +
                NAV_TABS_VALUE.DATA_ENDPOINTS +
                '/' +
                type +
                '/' +
                selectedList[0].id +
                '/' +
                NAV_TABS_VALUE.RISK_MAP,
        );
        setRiskyGraphPreparing(!RiskygraphPreparing);
        setRiskLoadCount(0);
        dispatch(
            setGraphAllDataAction({
                trevalList: [],
                allData: [],
                selectedList: selectedList,
                parent: [],
            }),
        );
        // setgraphRisks([]);
        setNodeId(undefined);
        setIsExpend(false);
        setGraphData([]);
        setGraphPreparing(false);
    };
    return (
        <CContainer fluid>
            <div>
                <div className="card-body d-flex">
                    <div className="" style={{ marginTop: 10 }}>
                        <div className="d-flex align-items-center ms-2 px-2 shadow-6 border-neutral-700">
                            <div className="font-x-small-medium me-2">Level</div>
                            <div>
                                <CDropdown placement="bottom" className="p-2 w-100">
                                    <CDropdownToggle className="d-flex font-x-small-bold justify-content-between align-items-center neutral-700 py-1 w-100">
                                        <div className="pe-2  m-0">Select Level</div>
                                    </CDropdownToggle>
                                    <CDropdownMenu>
                                        {selectedListNew?.length > 0 &&
                                            selectedListNew.map((breadcrumItem: any, index: number) => {
                                                return (
                                                    <React.Fragment key={index}>
                                                        <CDropdownItem
                                                            onClick={() => navigateTo(breadcrumItem?.id, breadcrumItem)}
                                                        >
                                                            {breadcrumItem?.data?.appName}
                                                        </CDropdownItem>
                                                    </React.Fragment>
                                                );
                                            })}
                                    </CDropdownMenu>
                                </CDropdown>
                            </div>
                        </div>
                    </div>

                    {!isLoading ? (
                        <div className="d-flex mt-2 m-2">
                            <div className="mt-2"> All paths </div>
                            <div className="m-2">
                                <CFormSwitch
                                    label="Risky paths"
                                    disabled={switchDisble}
                                    id="formSwitchCheckDefault"
                                    defaultChecked={graphCheck}
                                    onClick={onClickSwitch}
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="custom-count-badge  mt-3 m-2">
                            <Skeleton height={10} />
                        </div>
                    )}
                </div>

                {/* below commented part is 'select connection' option do not delete */}
                {/* <CustomInputWithLabel
                    autoComplete="configType"
                    value={configType}
                    onChange={configTypeChagehandler}
                    placeHolder={'Select Connection'}
                    errorMessage={'required'}
                    label={'*' + 'Select Connection'}
                    customClass={'mb-2'}
                    customDropdownClass={'md-label'}
                    isDropdown
                    dropdownValues={['Identity', 'Network', 'All']}
                /> */}
                {isLoading || !graphRisks || !graphData ? (
                    <div className="d-flex flex-column pt-2  text-center align-items-center justify-content-center">
                        <h6> {`${riskLoadCount}%`}</h6>
                        {getSkeletonLoader()}
                    </div>
                ) : (
                    !isError &&
                    graphRisks &&
                    graphData.nodes &&
                    graphData.links &&
                    render && (
                        <Graph
                            {...graphData}
                            graphRisks={graphRisks}
                            onLinkClick={onLinkClick}
                            onIdentitiesClick={onIdentitiesClick}
                            onNodeClick={{
                                onAppicationNodeClick: getApplicationInfoForPopover,
                                onResourceNodeClick: getResourceInfoForPopover,
                            }}
                            type={type}
                            setNodeId={setNodeId}
                            isExpend={setIsExpend}
                            nodeID={nodeId}
                            expend={expend}
                        />
                    )
                )}
                {isError && (
                    <div className="text-center p-4">
                        <p className="lead text-danger"> Something went wrong!!! </p>
                    </div>
                )}
            </div>
        </CContainer>
    );
};

export default RiskMap;

const getSkeletonLoader = () => (
    <div className="d-flex flex-column text-center align-items-center justify-content-center">
        <div className="d-flex justify-content-center  pt-3">
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
