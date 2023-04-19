import {
    IdentitiyDetails,
    LinkPopup,
    NetworkDetails,
    Node,
    OrganisedAccessData,
    Resource,
} from 'shared/models/GraphModels';

import ELK from 'elkjs/lib/elk.bundled.js';
const elk = new ELK();
import { GraphNodeFactory } from 'shared/components/graph_node/graph_node_factory';
import { getNodeByType } from 'shared/components/graph_node/component/GraphNode';
import { Pattern, RiskCardModel } from 'shared/models/RiskModel';
import { IdentityType } from 'shared/models/IdentityAccessModel';
import { getNodeByTypeIdenity } from 'modules/single_account/identities/single_identity_element/aws/single_user/identity_gragh/GraphNode';
import { Position } from 'reactflow';

export const prepareGraphData = (data: any, selectedRisk: RiskCardModel | null, props: any, extraProps: any) => {
    const preparedData: any = {
        nodes: [],
        links: [],
    };

    // const preparedData: Array<any> = [];
    const nodeIDTypeMap: Map<string, string> = new Map();
    const nodeIDObjMap: Map<string, Node> = new Map();

    const selectedRiskyNodesLinksIds: string[] = getRiskyIdsToHighlight(
        data.graphRisks || props?.graphRisks,
        selectedRisk?.links,
    );

    if (data.nodes && data.nodes.length > 0) {
        //******remove duplicated nodes*/
        data.nodes = data.nodes.filter(
            (v: { id: any }, i: any, a: any[]) => a.findIndex((v2: { id: any }) => v2?.id === v?.id) === i,
        );

        data.nodes.forEach((el: any) => {
            if (el) {
                nodeIDTypeMap.set(el.id, el.resource_type);
                const newNode = GraphNodeFactory.getNode(el);
                const nodeDetails = newNode.getNodeDetails();
                // const nodeDetails = newNode.getNodeDetails();
                nodeIDObjMap.set(el.id, nodeDetails);
                // nodeDetails['isRiskyIdentities'] = nodeDetails.id == el.id ? true : false;

                /* Risk Check */
                const isRisky: boolean = riskyNodeCheck(data.graphRisks || props?.graphRisks, el.id);
                nodeDetails['isRisky'] = isRisky;
                nodeDetails['isSelectedRisk'] = selectedRiskyNodesLinksIds.indexOf(el.id) > -1;
                nodeDetails['setNodeId'] = data.setNodeId || props.setNodeId;
                nodeDetails['isExpend'] = data.isExpend || props.isExpend;
                nodeDetails['isPartial'] = data.partial_graph || props.partial_graph;
                nodeDetails['firstNodes'] = data?.firstNodes || props?.firstNodes;
                nodeDetails['groupedNodes'] = data?.groupedNodes || props?.firstNodes;
                nodeDetails['show'] = extraProps?.show;
                nodeDetails['ApplicationCount'] = el?.data;
                nodeDetails['setShow'] = extraProps?.setShow;
                nodeDetails['riskScore'] = el?.si_risk_score;
                nodeDetails['permission'] = el?.resource_permissions;
                nodeDetails['subType'] = el?.resource_subtype;
                nodeDetails['identityRisk'] = el?.si_risks;
                nodeDetails['statements'] = prepareStatement(el);

                nodeDetails['graphType'] = data?.type;
                nodeDetails['parentId'] =
                    data?.links.length > 0 ? data?.links[data?.links?.length - 1]?.target : data.nodes[0]?.id;

                const node = {
                    id: nodeDetails.id,
                    expand: props?.expend,
                    risk: isRisky,
                    targetParent: nodeDetails['parentId'],
                    graphType: data?.type || data.graphtype,

                    riskScore: el?.si_risk_score,
                    subType: el?.resource_subtype,
                    permission: el?.resource_permissions,
                    identityRisk: el.si_risks,
                    applicationCount: nodeDetails.ApplicationCount,
                    data: {
                        label: data?.identity ? getNodeByTypeIdenity(nodeDetails) : getNodeByType(nodeDetails),
                        appName: nodeDetails.title,

                        resourceType: nodeDetails.nodeType,
                        nodeObj: newNode,
                    },
                    position: { x: 0, y: 0 },
                    style: {},

                    sourcePosition: data?.graphtype == 'aws_S3' ? 'top' : 'bottom',
                    targetPosition: data?.graphtype == 'aws_S3' ? 'bottom' : 'top',
                };

                // preparedData.push(node);
                preparedData.nodes.push(node);
            }
        });
    }

    if (data.links && data.links?.length > 0) {
        //******remove duplicated links*/
        data.links = data.links.filter(
            (v: { id: any }, i: any, a: any[]) => a.findIndex((v2: { id: any }) => v2?.id === v?.id) === i,
        );

        data.links.forEach((el: any) => {
            if (el) {
                //this line commented  because  aws_ApplicationLoadBalancer not createing the links
                // const targetType = nodeIDTypeMap.get(el.target);

                // if (targetType == 'aws_ApplicationLoadBalancer' && el.source != 'internet') {
                //     const temp = el.target;
                //     el.tagrget = el.source;
                //     el.source = temp;
                // }

                const sourdeObj: Node | undefined = nodeIDObjMap.get(el.source);
                const targetObj: Node | undefined = nodeIDObjMap.get(el.target);

                /* Risk Check */
                const isRiskyLink = riskyLinkCheck(data?.graphRisks || props?.graphRisks, el.id);
                const isRiskyLinkOnly = riskyLinkCheckOnly(data?.graphAllRiskPath?.flat(), el.id);
                const isInfo = checkInfo(el?.data?.statements || []);
                const link = {
                    id: el?.id,
                    source: el.source,
                    target: el.target,
                    arrowHeadType: 'arrowclosed',
                    sourcePosition: Position.Top,
                    targetPosition: Position.Bottom,
                    animated: el.type == 'Network' ? true : false,

                    data: {
                        graphType: data?.graphtype,
                        identityMap: data?.identity,
                        accessType: el.mapping_type,
                        access: el.access,
                        sourceType: el.source_type,
                        targetType: el.target_type,
                        sourceObj: sourdeObj,
                        targetObj: targetObj,
                        isRisky: isRiskyLink,
                        isRiskyOnly: isRiskyLinkOnly,
                        isRiskyIdentities: false,
                        isShowSpotlight: selectedRiskyNodesLinksIds.indexOf(el.id) > -1,
                        selectedRiskId: selectedRiskyNodesLinksIds.indexOf(el.id) > -1,
                        statements: el.statements,
                        dataAssetsStatments: el?.data?.statements || [],
                        showInfo: isInfo,
                    },
                    type: 'custom',
                    style: { stroke: '#d76c41' },
                    labelBgStyle: { fill: '#d76c41', color: '#ffffff', opacity: '0.7', cursor: 'pointer' },
                    labelStyle: { fill: '#fff', fontWeight: 700, cursor: 'pointer' },
                };

                // preparedData.push(link);
                preparedData.links.push(link);
            }
        });
    }

    return preparedData;
};
const prepareStatement = (el: any) => {
    let statement: any = [];
    if (el.si_risks?.length > 0) {
        statement = el?.document?.Statement;
    }
    if (el?.si_vertex_type == 'Statement') {
        statement.push({ effect: el?.effect, action: el?.action, resource: el?.resource });
    }

    return statement;
};
const checkInfo = (statement: any) => {
    let isInfo = false;

    if (statement?.length > 0) {
        isInfo = true;
    }

    return isInfo;
};
export const getConnectedResources = (data: any, resId: string) => {
    const accessData: LinkPopup = {
        identity_access: [],
        network_access: [],
    };
    accessData.identity_access?.push(...getConnectedResourceIds(data.identity_access, resId));
    accessData.network_access?.push(...getConnectedResourceIds(data.network_access, resId));

    return accessData;
};

export const copyARN = (nodeDetails: any, setShowRef: any) => {
    const s3ARN = 'arn:aws:s3:::' + nodeDetails.id;
    copyToClipboard(s3ARN);
    setShowRef(false);
};

export const mergeDuplicatedEntries = (accessData: Array<any>) => {
    const organisedAccessData: OrganisedAccessData = {
        identityAccess: [],
        networkAccess: [],
    };
    if (accessData) {
        const identityMap = new Map<string, IdentitiyDetails>();
        accessData.forEach((element) => {
            if (
                element.identified_from &&
                element.identified_from.identity_access &&
                element.identified_from.identity_access.length > 0
            ) {
                const identityAccessDetails = element.identified_from.identity_access;
                identityAccessDetails.forEach((identityDetails: IdentitiyDetails) => {
                    if (identityMap.has(identityDetails.identity_id)) {
                        const existingIdentityDetails = identityMap.get(identityDetails.identity_id);
                        const existingMappings = existingIdentityDetails?.access_type_policies_mapping;
                        const currentMapppings =
                            identityDetails.access_type_policies_mapping[identityDetails.level_of_access];
                        if (existingMappings) {
                            if (!existingMappings[identityDetails.level_of_access]) {
                                existingMappings[identityDetails.level_of_access] = [];
                            }
                            currentMapppings
                                .filter(
                                    (policy: string) =>
                                        existingMappings[identityDetails.level_of_access].indexOf(policy) == -1,
                                )
                                .forEach((policy: string) => {
                                    existingMappings[identityDetails.level_of_access].push(policy);
                                });
                        }
                    } else {
                        identityMap.set(identityDetails.identity_id, identityDetails);
                    }
                });
            }
            if (
                element.identified_from &&
                element.identified_from.network_access &&
                element.identified_from.network_access.length > 0
            ) {
                const networkAccessDetails = element.identified_from.network_access;
                networkAccessDetails.forEach((networkDetails: NetworkDetails) => {
                    const isDetailsPresent = organisedAccessData.networkAccess.some(function (el: {
                        accessible_port: string;
                        protocol: string;
                        direction: string;
                    }) {
                        return (
                            el.accessible_port === networkDetails.accessible_port &&
                            el.protocol == networkDetails.protocol &&
                            el.direction == networkDetails.direction
                        );
                    });
                    if (!isDetailsPresent) {
                        organisedAccessData.networkAccess.push(networkDetails);
                    }
                });
            }

            if (
                element.identified_from &&
                element.identified_from.config &&
                typeof element.identified_from.config == 'object' &&
                !Array.isArray(element.identified_from.config)
            ) {
                element.identified_from.config = [element.identified_from.config];
            }
            if (
                element.identified_from &&
                element.identified_from.config &&
                element.identified_from.config.length > 0
            ) {
                const configDetails = element.identified_from.config;
                configDetails.forEach((configDetails: any) => {
                    if (configDetails.port && configDetails.protocol) {
                        // For Loadbalancer case
                        const isDetailsPresent = organisedAccessData.networkAccess.some(function (el: {
                            accessible_port: string;
                            protocol: string;
                            direction: string;
                        }) {
                            return (
                                el.accessible_port === configDetails.port.toString() &&
                                el.protocol == configDetails.protocol &&
                                el.direction == configDetails.direction
                            );
                        });
                        if (!isDetailsPresent) {
                            const details = {
                                accessible_port: configDetails.port.toString(),
                                protocol: configDetails.protocol,
                                direction: configDetails.direction,
                            };
                            organisedAccessData.networkAccess.push(details);
                        }
                    } else if (configDetails.origin_id) {
                        // For Cloud Front case
                        /* SP-1638: Hide hard-coded cloud front data
                        const identityDetails: IdentitiyDetails = {
                            identity_id: configDetails.origin_id,
                            identity_name: configDetails.origin_id,
                            identity_type: IdentityType.AwsIAMUser,
                            level_of_access: 'Read',
                            access_type_policies_mapping: {
                                Read: ['Resource-policy'],
                            },
                        };
                        identityMap.set(identityDetails.identity_id, identityDetails);
                        */
                    } else if ('destination' in configDetails) {
                        // AWS Kinesis Firehose
                        const roleARN = configDetails['destination'].RoleARN;
                        let identityName = roleARN.split(':')[5]; // Get last part.
                        identityName = identityName.split('/');
                        identityName = identityName[identityName.length - 1];
                        const identityDetails: IdentitiyDetails = {
                            identity_id: roleARN,
                            identity_name: identityName,
                            identity_type: IdentityType.AWsIAMPolicy,
                            level_of_access: 'write',
                            access_type_policies_mapping: {
                                Write: ['AWS Customer Managed Policy'],
                            },
                        };
                        identityMap.set(identityDetails.identity_id, identityDetails);
                    }
                });
            }
        });
        organisedAccessData.identityAccess.push(...Array.from(identityMap.values()));
    }
    return organisedAccessData;
};
export const getLayoutedElements = (initialNodes: any, initialEdges: any, direction = 'UP') => {
    const nodeWidth = 300;
    const nodeHeight = 120;
    const nodesForElk = initialNodes.map((node: any) => {
        return {
            id: node.id,
            width: nodeWidth,
            height: nodeHeight,
        };
    });

    const elkIds: any = [];
    nodesForElk.map((item: any) => elkIds.push(item.id));
    const changeEdge = initialEdges.filter((item: any) => elkIds.includes(item.source));

    const graph = {
        id: 'root',
        layoutOptions: {
            'elk.algorithm': 'layered',
            'elk.direction': direction,
            'nodePlacement.strategy': 'SIMPLE',
        },

        children: nodesForElk,
        edges: changeEdge,
    };

    return elk.layout(graph);
};
// ------------------------- Graph Layout -----------------------------------

// In order to keep this example simple the node width and height are hardcoded.
// In a real world app you would use the correct width and height values of
// const nodes = useStoreState(state => state.nodes) and then node.__rf.width, node.__rf.height

// export const getLayoutedElements = (nodes: any, edges: any, direction = 'BT') => {
//     dagreGraph.setGraph({ rankdir: direction });

//     nodes.forEach((node: any) => {
//         dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
//     });

//     edges.forEach((edge: any) => {
//         dagreGraph.setEdge(edge.source, edge.target);
//     });

//     dagre.layout(dagreGraph);

//     nodes.forEach((node: any) => {
//         const nodeWithPosition = dagreGraph.node(node.id);
//         node.targetPosition = 'bottom';
//         node.sourcePosition = 'top';
//         if (direction == 'TB') {
//             node.targetPosition = 'top';
//             node.sourcePosition = 'bottom';
//         }

//         // We are shifting the dagre node position (anchor=center center) to the top left
//         // so it matches the React Flow node anchor point (top left).
//         node.position = {
//             x: nodeWithPosition.x - nodeWidth / 2,
//             y: nodeWithPosition.y - nodeHeight / 2,
//         };

//         return node;
//     });
//     console.log('*********', nodes, edges);
//     return { nodes, edges };
// };

/* =============================== Private methods ============================== */

/* This function return the Risky Node Ids or Link id from the selected Risk*/
function getRiskyIdsToHighlight(graphRisks: Pattern[], riskyPatternIds: string[] | undefined) {
    const riskyIds: string[] = [];
    if (riskyPatternIds && riskyPatternIds.length > 0) {
        const riskyPatterns: Pattern[] = graphRisks.filter(
            (pattern: Pattern) => riskyPatternIds.indexOf(pattern.linkId) > -1,
        );

        riskyPatterns.forEach((pattern: Pattern) => {
            if (pattern.source && pattern.source.risks && pattern.source.risks.length > 0) {
                riskyIds.push(pattern.source.id);
            }
            if (pattern.target && pattern.target.risks && pattern.target.risks.length > 0) {
                riskyIds.push(pattern.target.id);
            }
            if (pattern.network && pattern.network.risks && pattern.network.risks.length > 0) {
                riskyIds.push(pattern.linkId);
            }
            if (pattern.identities) {
                pattern.identities.forEach((identity: any) => {
                    if (
                        identity &&
                        identity.risks &&
                        identity.risks.length > 0 &&
                        riskyIds.indexOf(pattern.linkId) == -1
                    ) {
                        riskyIds.push(pattern.linkId);
                    }
                });
            }
        });
    }
    return riskyIds;
}

function riskyNodeCheck(graphRisks: Pattern[], nodeId: string) {
    let isRiskyNode = false;
    let isRiskyLink = false;
    if (graphRisks) {
        if (graphRisks) {
            const riskyPattern: Pattern | undefined = graphRisks.find((pattern: Pattern) => pattern.linkId == nodeId);

            if (riskyPattern) {
                // if link - network is Risky
                if (riskyPattern.network && riskyPattern.network.risks && riskyPattern.network.risks.length > 0) {
                    // eslint-disable-next-line @typescript-eslint/no-unused-vars
                    isRiskyLink = true;
                }
                if (riskyPattern.identities) {
                    riskyPattern.identities.forEach((identity: any) => {
                        if (identity && identity.risks && identity.risks.length > 0) {
                            isRiskyLink = true;
                        }
                    });
                }
            }
        }

        const riskyPattern: Pattern[] = graphRisks.filter(
            (pattern: Pattern) =>
                // if source node or target node in the pattern is Risky then return that pattern
                (pattern.source &&
                    pattern.source.id == nodeId &&
                    pattern.source.risks &&
                    pattern.source.risks.length > 0) ||
                (pattern.target &&
                    pattern.target.id == nodeId &&
                    pattern.target.risks &&
                    pattern.target.risks.length > 0),
        );

        if (riskyPattern.length > 0) {
            isRiskyNode = true;
        }
    }
    return isRiskyNode;
}

function riskyLinkCheck(graphRisks: Pattern[], linkId: string) {
    let isRiskyLink = false;

    if (graphRisks) {
        const riskyPattern: Pattern | undefined = graphRisks.find((pattern: Pattern) => pattern?.linkId == linkId);

        if (riskyPattern) {
            // if link - network is Risky
            if (riskyPattern.network && riskyPattern.network.risks && riskyPattern.network.risks.length > 0) {
                isRiskyLink = true;
            }
            if (riskyPattern.identities) {
                riskyPattern.identities.forEach((identity: any) => {
                    if (identity && identity.risks && identity.risks.length > 0) {
                        isRiskyLink = true;
                    }
                });
            }
        }
    }
    return isRiskyLink;
}
function riskyLinkCheckOnly(links: string[], linkId: string) {
    let isRiskyLink = false;
    if (links?.length > 0) {
        const riskyPattern1: any = links?.find((pattern: any) => pattern == linkId);

        if (riskyPattern1) {
            isRiskyLink = true;
        }
    }

    return isRiskyLink;
}
function getConnectedResourceIds(dataList: any, resourceId: string) {
    const connectedResourceIdList: Array<Resource> = [];
    dataList.forEach((element: any) => {
        let connnectedResource: Resource | null = null;
        if (element && element.source_details && element.source_details.id == resourceId) {
            connnectedResource = element.target_details;
        } else {
            connnectedResource = element.source_details;
        }

        if (connnectedResource && !connectedResourceIdList.some((resource) => resource.id == connnectedResource?.id)) {
            connectedResourceIdList.push(connnectedResource);
        }
    });
    return connectedResourceIdList;
}

function copyToClipboard(text: string) {
    const dummy = document.createElement('textarea');
    // to avoid breaking orgain page when copying more words
    // cant copy when adding below this code
    // dummy.style.display = 'none'
    document.body.appendChild(dummy);
    //Be careful if you use texarea. setAttribute('value', value), which works with "input" does not work with "textarea". – Eduard
    dummy.value = text;
    dummy.select();
    document.execCommand('copy');
    document.body.removeChild(dummy);
}
