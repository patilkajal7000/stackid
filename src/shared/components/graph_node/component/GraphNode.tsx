import React, { useEffect, useState } from 'react';
import { Node } from 'shared/models/GraphModels';
import { useDispatch, useSelector } from 'react-redux';
import { showIdentitiesDetailsAction } from 'store/actions/GraphActions';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate } from 'react-router-dom';
import { NAV_TABS_VALUE } from 'shared/utils/Constants';
import { BPIModel } from 'shared/models/BPIModel';
import { AppState } from 'store/store';
import { getActualSeverityColor, getBpiScoreSeverity } from 'shared/service/Severity.service';
import CustomModalForRisk from 'shared/components/custom_modal/CustomModalForRisk';
import CIcon from '@coreui/icons-react';
import { cilChevronRight, cilPlus, cilWarning } from '@coreui/icons';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { CAvatar, CImage } from '@coreui/react';
import ApplicationDetailsModal from 'modules/single_account/data_endpoints/single_data_assets_application/ApplicationDetailModal';
type BPISeverity = {
    bpiPercentage: number;
    severity: string;
    severityColor: string;
};
export const getNodeByType = (nodeDetails: Node) => {
    return <GraphNode {...nodeDetails} />;
};

const GraphNode = (props: Node) => {
    const { isPartial, setNodeId, isExpend, firstNodes, groupedNodes, ApplicationCount, nodeType, title } = props;

    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();

    const [, setBPISeverity] = useState<BPISeverity>();
    const bpiState = useSelector((state: AppState) => state.bpiState);
    const bpiDetailsState: BPIModel = bpiState.bpiDetails;

    const [riskPopup, setRiskPopup] = useState<boolean>(false);
    const [expand, setExpand] = useState<boolean>(false);
    const [nodeNames, setNodeNames] = useState<any>([]);
    const [showMoreDetail, setShowMoreDetail] = useState<boolean>(false);
    const location = useLocation();
    const openMoreNode = (e: any) => {
        e.stopPropagation();
        setShowMoreDetail(!showMoreDetail);
    };
    useEffect(() => {
        if (bpiState && bpiState.bpiDetails) {
            const bpiPercentage = bpiDetailsState?.bpi | 0;
            const severity = getBpiScoreSeverity(bpiPercentage);
            const severityColor = getActualSeverityColor(severity);

            setBPISeverity({ bpiPercentage, severity, severityColor });
        }
    }, [bpiState.bpiDetails]);

    const showIdentitiesDetails = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        evt.stopPropagation();
        dispatch(showIdentitiesDetailsAction(false, props));
        const path: any = location.pathname.replace(`risk_map`, NAV_TABS_VALUE.ACCESS_DETAILS);
        navigate(path, {
            state: { stack: true, nodeType: props.nodeType, id: props.id },
        });
    };

    const getNodeDetails = (nodeId: any) => {
        const names: any = [];
        groupedNodes.map((node: any) => {
            if (node[0].id === nodeId) {
                for (let i = 1; i < node.length; i++) names.push({ id: i, nodeId: node[i].id, name: node[i].name });
            }
        });
        setNodeNames(names);
    };

    return (
        <>
            <div>
                {firstNodes?.map((n: any, firstIndex: number) => {
                    if (n.node === props.id && n.grouped) {
                        return (
                            <React.Fragment key={firstIndex}>
                                <OverlayTrigger
                                    trigger="click"
                                    key="left"
                                    rootClose
                                    placement="left"
                                    overlay={
                                        <Popover id="resource-details">
                                            <Popover.Header as="h2" className="text-value text-dark text-truncate">
                                                Applications using same identity:
                                            </Popover.Header>
                                            <Popover.Body>
                                                <div style={{ height: '150px', overflow: 'scroll' }}>
                                                    {nodeNames.length ? (
                                                        <ul style={{ marginLeft: '-1.5rem' }}>
                                                            {nodeNames?.map((name: any, index: any) => (
                                                                <div key={index}>
                                                                    <li>{name?.name}</li>
                                                                    <hr className="mt-0" />
                                                                </div>
                                                            ))}
                                                        </ul>
                                                    ) : (
                                                        <p>No Resources</p>
                                                    )}
                                                </div>
                                            </Popover.Body>
                                        </Popover>
                                    }
                                >
                                    <div
                                        role="presentation"
                                        style={{ float: 'left' }}
                                        onClick={(e: any) => {
                                            e.stopPropagation();

                                            getNodeDetails(props.id);
                                        }}
                                    >
                                        <CIcon icon={cilPlus} style={{ cursor: 'pointer' }} />
                                    </div>
                                </OverlayTrigger>
                            </React.Fragment>
                        );
                    }
                })}
            </div>

            <div
                className={`${props.isSelectedRisk ? 'risk-highlight-circle' : ''}`}
                style={{ width: firstNodes ? '307px' : 'auto' }}
            >
                <div
                    role="presentation"
                    className="card custom-node m-0 p-0 border-0"
                    onClick={(e: any) => {
                        props.nodeType == 'truncated_node' && openMoreNode(e);
                        // setShow(!show);
                    }}
                >
                    {
                        props.isRisky && (
                            <div onClick={() => setRiskPopup(true)} className="position-top-right" role="presentation">
                                <div className="risk-icon">
                                    <CIcon icon={cilWarning} size="xl" />
                                </div>
                            </div>
                        )
                        // (props.isSelectedRisk ? (
                        //     <div
                        //         className="position-top-right risk-icon-long font-small-semibold d-flex flex-row align-content-center align-items-center"
                        //         style={{ backgroundColor: bpiSeverity?.severityColor }}
                        //     >
                        //         <div className="risk-icon"></div>
                        //         <div className="flex-grow-1 align-content-center me-2">{t('view_details')}</div>
                        //     </div>
                        // ) : (
                        //     <div className="position-top-right">
                        //         <div
                        //             className="risk-icon me-1 "
                        //             style={{ backgroundColor: bpiSeverity?.severityColor }}
                        //         >
                        //             <ReportProblemOutlined />
                        //         </div>
                        //     </div>
                        // )
                        // )
                    }
                    {/* {props.isRisky &&
                        (props.isSelectedRisk ? (
                            <div
                                className="position-top-right risk-icon-long font-small-semibold d-flex flex-row align-content-center align-items-center"
                                style={{ backgroundColor: bpiSeverity?.severityColor }}
                            >
                                <div className="risk-icon"></div>
                                <div className="flex-grow-1 align-content-center me-2">{t('view_details')}</div>
                            </div>
                        ) : (
                            <div className="position-top-right">
                                <div
                                    className="risk-icon me-1 "
                                    style={{ backgroundColor: bpiSeverity?.severityColor }}
                                >
                                    <ReportProblemOutlined />
                                </div>
                            </div>
                        ))} */}

                    <div
                        // className="card-body p-0 d-flex flex-row"
                        className={
                            props.nodeType == 'truncated_node'
                                ? 'card-body mulinode-card p-0 d-flex flex-row'
                                : 'card-body p-0 d-flex flex-row'
                        }
                    >
                        <div
                            className="icon-section p-2 d-flex flex-column align-align-items-center justify-content-center"
                            title={props.type}
                        >
                            {props.iconURL ? <CImage className="me-1 node-icon" src={props.iconURL} /> : ''}
                            <div className="font-caption text-truncate mt-1"> {props.type} </div>
                        </div>
                        <div className="text-section py-2 flex-fill" title={props.title}>
                            <div className={props.iconURL ? '' : 'w-100 text-center'}>
                                <div className="text-truncate font-small-semibold px-2 pb-4"> {props.title} </div>
                            </div>
                            {nodeType == 'aws_S3' || nodeType == 'userDefinedGroup'
                                ? props.type != 'Internet' &&
                                  props.type !== 'S3 bucket' &&
                                  props.nodeType !== 'aws_RedshiftCluster' && (
                                      <>
                                          {props.nodeType !== 'snowflake_Account' && (
                                              <div
                                                  className="card-footer secondary-section d-flex justify-content-end font-medium-semibold p-0 align-items-center pt-1"
                                                  title={t('access_details') + ''}
                                              >
                                                  {props.isRiskyIdentities && (
                                                      <div className="risk-icon me-1">
                                                          <CIcon icon={cilWarning} size="xl" />
                                                      </div>
                                                  )}
                                                  {
                                                      <div onClick={showIdentitiesDetails} role="presentation">
                                                          {t('access_details')}
                                                          <CIcon icon={cilChevronRight} size="sm" />
                                                      </div>
                                                  }
                                              </div>
                                          )}
                                      </>
                                  )
                                : null}
                        </div>
                    </div>
                </div>

                {isPartial && props?.id !== 'internet' && props.type !== 'S3 bucket' && (
                    <div
                        role="presentation"
                        onClick={() => {
                            setExpand(!expand);
                            isExpend(true);
                            setNodeId?.(props.id);
                        }}
                    >
                        {expand ? (
                            <CAvatar color="secondary" size="sm" textColor="white" className={`fs-3 p-0 pointer`}>
                                -
                            </CAvatar>
                        ) : (
                            <CAvatar color="secondary" size="sm" textColor="white" className={`fs-3 p-0 pointer`}>
                                +
                            </CAvatar>
                        )}
                    </div>
                )}
            </div>
            <CustomModalForRisk
                show={riskPopup}
                onHide={() => setRiskPopup(false)}
                riskData={undefined}
                nodeType="risk"
            />
            {showMoreDetail && (
                <ApplicationDetailsModal
                    data={ApplicationCount}
                    type={nodeType}
                    subType={'dataAssets'}
                    appname={title}
                    show={showMoreDetail}
                    onHide={() => setShowMoreDetail(false)}
                />
            )}
            {/* <CModal className="show d-block position-static" backdrop={false} portal={false} visible>
                <CModalHeader>
                    <CModalTitle>React Modal title</CModalTitle>
                </CModalHeader>
                <CModalBody>React Modal body text goes here.</CModalBody>
            </CModal> */}
        </>
    );
};

export default GraphNode;
