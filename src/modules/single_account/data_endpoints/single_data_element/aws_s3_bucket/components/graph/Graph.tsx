import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
    ReactFlow,
    MiniMap,
    Controls,
    useNodesState,
    useEdgesState,
    ConnectionLineType,
    addEdge,
    ReactFlowProvider,
} from 'reactflow';

import 'reactflow/dist/style.css';
import 'reactflow/dist/base.css';
import '../../risk_map/RiskMap.scss';
import { SelectedLink } from 'shared/models/GraphModels';

import { getLayoutedElements, mergeDuplicatedEntries } from './Graph.service';
import { GraphNode } from 'shared/components/graph_node/graph_node';
import CustomEdge from 'shared/components/graph_link/component/CustomEdge';
import GraphPopover from './graph_popover';
import CustomModal from 'shared/components/custom_modal/CustomModal';
import { AppState } from 'store/store';
import { useDispatch, useSelector } from 'react-redux';
import { Pattern } from 'shared/models/RiskModel';
import { setSelectedRiskAction } from 'store/actions/RiskActions';
import LinkDetails from '../link_details/LinkDetails';

import CustomModalForRisk from 'shared/components/custom_modal/CustomModalForRisk';
import { setGraphAllDataAction, setGraphRiskDataAction, setGraphSelectedDataAction } from 'store/actions/GraphActions';

export type Props = {
    nodes: any;
    links: any;
    graphRisks: Pattern[];
    onLinkClick: any;
    onIdentitiesClick: any;
    onNodeClick: {
        onAppicationNodeClick: any;
        onResourceNodeClick: any;
    };
    application?: any;
    identity?: any;
    subGraphData: any;
    newGraphData: any;
    nodeID: any;
    expend: any;
    check: any;
    isExpend: any;
    show: any;
    firstNodes: any;
    groupedNodes: any;
    count: any;
    setParentId: any;
    goBackData: any;
    page?: any;
    type?: any;
};

const edgeTypes = {
    custom: CustomEdge,
};
const Graph = (props: Props) => {
    const [show, setShow] = useState(false);
    const [riskPopup, setRiskPopup] = useState<boolean>(false);
    const [showStatement, setShowStatement] = useState<boolean>(false);
    const [target, setTarget] = useState(null);
    const [popoverType, setPopoverType] = useState('linkpopover');
    const [nodeDetails, setNodeDetails] = useState<GraphNode>();
    const [linkModal, setLinkModal] = useState(false);
    const [selectedLink, setSelectedLink] = useState<SelectedLink>();
    const [graphRiskData, setgraphRiskData] = useState([]);
    const [allstatements, setAllStatements] = useState<any>([]);
    const dispatch = useDispatch();
    const graphAllData = useSelector((state: AppState) => state.graphState.allData?.trevalList);
    const selectedList = useSelector((state: AppState) => state.graphState.allData?.selectedList);
    const [nodes, setNodes, onNodesChange] = useNodesState([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState([]);

    const parentGraph = useSelector((state: AppState) => state.graphState.allData?.parent);
    const ref = useRef(null);
    const nodeWidth = 300;
    const nodeHeight = 120;

    useEffect(() => {
        if (props.links && props.nodes) {
            const type = props.type == 'aws_S3' ? 'UP' : 'DOWN';
            // const type = props?.identity ? 'DOWN' : 'UP';

            getLayoutedElements(props.nodes, props.links, type)
                .then((graph: any) => {
                    const prepareNode: any = [
                        ...graph.children.map((node: any) => {
                            return {
                                ...props.nodes.find((n: any) => n.id === node.id),
                                position: { x: node.x - nodeWidth / 2, y: node.y - nodeHeight / 2 },
                            };
                        }),
                    ];

                    setNodes(prepareNode);
                    setEdges(graph.edges);
                })
                .catch((err: any) => {
                    console.log('error elk', err);
                });
        }
    }, [props]);

    const onConnect = useCallback(
        (params: any) =>
            setEdges((eds) => addEdge({ ...params, type: ConnectionLineType.SmoothStep, animated: true }, eds)),
        [],
    );

    const onNodeContextMenu = (event: any, node: any) => {
        event.preventDefault();
        if (node?.data?.resourceType == 'aws_S3') {
            setShow(!show);
            setTarget(event?.target);
            setPopoverType('contextPopover');
            setNodeDetails(node);
        }
    };

    const onEdgeClick = (event: any, element: any) => {
        const { graphType } = element.data;
        if (
            graphType === 'aws_RDSInstance' ||
            graphType === 'aws_RDSCluster' ||
            graphType === 'aws_RedshiftCluster' ||
            graphType === 'aws_DynamoDBTable'
        ) {
            if (element?.data?.dataAssetsStatments?.length > 0) {
                setAllStatements(element?.data?.dataAssetsStatments);
            } else {
                setAllStatements([]);
            }
            setShowStatement(!showStatement);
            return;
        }
        if (element?.data?.isRisky) {
            const risk_obj: any = props?.graphRisks.filter((x: any) => {
                return x && element?.id == x?.id;
            });
            dispatch(
                setGraphRiskDataAction({
                    risk: risk_obj[0]?.risks || [],
                }),
            );
            setShow(!show);
            setTarget(event?.target);
            setPopoverType('Risk');
            // setNodeDetails(node);
            setLinkModal(false);
            props.onLinkClick(element?.id, (data: any) => {
                const accessData = mergeDuplicatedEntries(data.identified_from);
                setSelectedLink({
                    source: element?.data?.sourceObj,
                    target: element?.data?.targetObj,
                    accessData: accessData,
                });
            });
        } else {
            if (element?.source) {
                event.preventDefault();
                event.stopPropagation();
                props.onLinkClick(element?.id, (data: any) => {
                    const accessData = mergeDuplicatedEntries(data.identified_from);
                    setSelectedLink({
                        source: element?.data?.sourceObj,
                        target: element?.data?.targetObj,
                        accessData: accessData,
                    });
                    setLinkModal(true);
                });
            } else {
                dispatch(setSelectedRiskAction(null));
                if (element?.data?.resourceType == 'userDefinedGroup') {
                    props.onNodeClick.onAppicationNodeClick(event, element, (data: any) => {
                        showNodePopover(element?.data?.nodeObj, data, event);
                    });
                } else if (element?.data?.nodeObj?.nodeType !== 'snowflake_Account') {
                    props.onNodeClick.onResourceNodeClick(event, element, (data: any) => {
                        showNodePopover(element?.data?.nodeObj, data?.resource_details, event);
                    });
                }
            }
        }
    };
    const onElementClick = (event: any, element: any) => {
        if (
            element.graphType === 'aws_RDSInstance' ||
            element.graphType === 'aws_RDSCluster' ||
            element.graphType === 'aws_RedshiftCluster' ||
            element.graphType === 'aws_DynamoDBTable'
        ) {
            return;
        }

        if (props?.identity) {
            dispatch(setGraphSelectedDataAction(element));
            if (props?.application) {
                return;
            }
            if (element?.data?.resourceType == 'resource') {
                showNodePopover(element?.data?.nodeObj, element, event);
            } else {
                setShow(!show);
                setTarget(event.target);
                setPopoverType('identityPopover');
                setNodeDetails(element);
            }
            return;
        }

        dispatch(setGraphSelectedDataAction(element));
        selectedList.push(element);

        dispatch(
            setGraphAllDataAction({
                trevalList: graphAllData,
                selectedList: selectedList,
                parent: parentGraph,
            }),
        );

        if (props.graphRisks[0]?.target?.risks) {
            setgraphRiskData(element?.target?.risks);
            dispatch(
                setGraphRiskDataAction({
                    risk: props.graphRisks[0]?.target?.risks,
                }),
            );
        }

        if (element?.data?.isRisky) {
            dispatch(
                setGraphRiskDataAction({
                    risk: props.graphRisks[0]?.identities[0]?.risks,
                }),
            );
            setShow(!show);
            setTarget(event?.target);
            setPopoverType('contextPopover');
            // setNodeDetails(node);
            setLinkModal(false);
            props.onLinkClick(element?.id, (data: any) => {
                const accessData = mergeDuplicatedEntries(data.identified_from);
                setSelectedLink({
                    source: element?.data?.sourceObj,
                    target: element?.data?.targetObj,
                    accessData: accessData,
                });
            });
        } else {
            if (element?.source) {
                event.preventDefault();
                event.stopPropagation();
                props.onLinkClick(element?.id, (data: any) => {
                    const accessData = mergeDuplicatedEntries(data.identified_from);
                    setSelectedLink({
                        source: element?.data?.sourceObj,
                        target: element?.data?.targetObj,
                        accessData: accessData,
                    });
                    setLinkModal(true);
                });
            } else {
                dispatch(setSelectedRiskAction(null));
                if (element?.data?.resourceType == 'userDefinedGroup') {
                    props.onNodeClick.onAppicationNodeClick(event, element, (data: any) => {
                        showNodePopover(element?.data?.nodeObj, data, event);
                    });
                } else if (element?.data?.nodeObj?.nodeType !== 'snowflake_Account') {
                    props.onNodeClick.onResourceNodeClick(event, element, (data: any) => {
                        showNodePopover(element?.data?.nodeObj, data?.resource_details, event);
                    });
                }
            }
        }
    };

    const showNodePopover = (nodeObj: GraphNode, details: unknown, event: any) => {
        nodeObj.setPopoverDetails(details);
        setNodeDetails(nodeObj);
        setShow(!show);
        setTarget(event.target);
        setPopoverType('Node');
    };

    return (
        <>
            <div className="layoutflow" style={{ width: '100%', height: '60vh' }}>
                <ReactFlowProvider>
                    {edges || nodes ? (
                        <ReactFlow
                            fitView
                            nodes={nodes}
                            edges={edges}
                            snapToGrid={true}
                            edgeTypes={edgeTypes}
                            onConnect={onConnect}
                            onNodeClick={onElementClick}
                            onEdgeClick={onEdgeClick}
                            onEdgesChange={onEdgesChange}
                            onNodesChange={onNodesChange}
                            nodesDraggable={true}
                            draggable={true}
                            onNodeContextMenu={onNodeContextMenu}
                            connectionLineType={ConnectionLineType.SmoothStep}
                        >
                            <MiniMap />
                            <Controls />
                        </ReactFlow>
                    ) : (
                        <p>Nothing to display</p>
                    )}
                </ReactFlowProvider>

                <div ref={ref}>
                    <GraphPopover
                        show={show}
                        target={target}
                        container={ref.current}
                        setShowRef={setShow}
                        popoverType={popoverType}
                        nodeDetails={nodeDetails}
                        onClickRisk={() => setRiskPopup(true)}
                        onClickInfo={() => setLinkModal(true)}
                    />
                </div>
            </div>
            {showStatement && (
                <CustomModalForRisk
                    show={showStatement}
                    onHide={() => setShowStatement(false)}
                    IdentityRiskData={[]}
                    StatementData={allstatements}
                    subType={''}
                    data={allstatements}
                    nodeType={'policy'}
                />
            )}
            <CustomModal
                size="xl"
                className="square-corner align-content-center"
                show={linkModal}
                onHide={() => {
                    setLinkModal(false);
                }}
            >
                <LinkDetails data={selectedLink} isLoading={false}></LinkDetails>
            </CustomModal>
            {riskPopup && (
                <CustomModalForRisk
                    show={riskPopup}
                    onHide={() => setRiskPopup(false)}
                    riskData={graphRiskData}
                    nodeType="risk"
                />
            )}
        </>
    );
};

export default React.memo(Graph);
