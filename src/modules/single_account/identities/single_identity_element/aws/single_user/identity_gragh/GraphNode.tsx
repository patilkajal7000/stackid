import React, { useEffect, useState } from 'react';
import { Node } from 'shared/models/GraphModels';

import { getActualSeverityColor, getBpiScoreSeverity } from 'shared/service/Severity.service';
import CustomModalForRisk from 'shared/components/custom_modal/CustomModalForRisk';
import { CImage } from '@coreui/react';
import ApplicationDetailsModal from 'modules/single_account/data_endpoints/single_data_assets_application/ApplicationDetailModal';

type BPISeverity = {
    bpiPercentage: number;
    severity: string;
    severityColor: string;
};
export const getNodeByTypeIdenity = (nodeDetails: Node) => {
    return <GraphNode {...nodeDetails} />;
};

const GraphNode = (props: Node) => {
    const { riskScore, identityRisk, nodeType, graphType, ApplicationCount, statements, title } = props;

    const [bpiSeverity, setBPISeverity] = useState<BPISeverity>();
    const [riskPopup, setRiskPopup] = useState<boolean>(false);

    const [allstatements, setAllStatements] = useState<any>([]);
    const [showApplicationDetail, setShowApplicationDetail] = useState<boolean>(false);
    useEffect(() => {
        const bpiPercentage = riskScore | 0;
        const severity = getBpiScoreSeverity(bpiPercentage);

        const severityColor = getActualSeverityColor(severity);

        setBPISeverity({ bpiPercentage, severity, severityColor });
    }, []);

    const openMoreNode = (e: any) => {
        e.stopPropagation();
        setShowApplicationDetail(!showApplicationDetail);
    };

    return (
        <>
            <div
                style={{ width: 'auto' }}
                onClick={(e) => {
                    props.subType == 'truncated_node,'
                        ? openMoreNode(e)
                        : nodeType.includes('identity_placeholder') || nodeType.includes('instance_placeholder')
                        ? setShowApplicationDetail(true)
                        : setShowApplicationDetail(false);
                }}
                role="presentation"
            >
                <div role="presentation" className="card custom-node m-0 p-0 border-0">
                    {graphType == 'application' ? null : nodeType == 'resource' ? null : (
                        <div
                            onClick={(e: any) => {
                                e.stopPropagation();

                                identityRisk?.length > 0 && setRiskPopup(true);
                                if (props.subType == 'truncated_node') {
                                    const allstatement: any = [];
                                    setRiskPopup(true);
                                    if (ApplicationCount.length > 0) {
                                        ApplicationCount.map((item: any) => {
                                            allstatement.push(item?.statements);
                                        });
                                        setAllStatements(allstatement);
                                    }
                                } else if (props.subType == 'Statement') {
                                    setRiskPopup(true);
                                }
                            }}
                            className="position-top-right"
                            role="presentation"
                        >
                            <div
                                className="risk-icon d-flex justify-content-center align-items-center "
                                style={{ backgroundColor: bpiSeverity?.severityColor }}
                            >
                                {bpiSeverity?.bpiPercentage}
                            </div>
                        </div>
                    )}
                    <div
                        className={
                            props.subType == 'truncated_node,'
                                ? 'card-body mulinode-card p-0 d-flex flex-row'
                                : 'card-body p-0 d-flex flex-row'
                        }
                    >
                        <div
                            className="icon-section p-2 d-flex flex-column align-align-items-center justify-content-center"
                            title={props.type}
                        >
                            {props.iconURL ? <CImage className="me-1 node-icon" src={props.iconURL} /> : ''}

                            {graphType == 'application' ? null : (
                                <div className="font-caption text-truncate mt-1"> {nodeType}</div>
                            )}
                        </div>
                        <div className="text-section py-2 px-2 flex-fill" title={props.title}>
                            <div className={props.iconURL ? '' : 'w-100 text-center'}>
                                <div className="text-truncate font-small-semibold"> {props.title} </div>
                                {graphType == 'application' && !nodeType.includes('_placeholder') ? (
                                    <div className="text-truncate pl-2">
                                        {' '}
                                        <b>Type: </b>
                                        {props.nodeType} <div className="text-truncate pl-2"> </div>
                                    </div>
                                ) : (
                                    <div className="text-truncate pl-2">
                                        {graphType == 'application' && (
                                            <>
                                                {' '}
                                                <b>Count: </b>
                                                {ApplicationCount?.length}{' '}
                                            </>
                                        )}
                                    </div>
                                )}
                                {props.subType !== 'truncated_node,' && (
                                    <div className="text-truncate pl-2"> Type:{props.subType} </div>
                                )}
                            </div>
                        </div>
                        {props.subType == 'truncated_node,' && (
                            <div className="position-bottom-right">show More ...</div>
                        )}
                    </div>
                </div>
            </div>
            {/* {props.subType == 'truncated_node' && <div>show more</div>} */}
            {riskPopup && (
                <CustomModalForRisk
                    show={riskPopup}
                    onHide={() => setRiskPopup(false)}
                    IdentityRiskData={identityRisk}
                    StatementData={statements}
                    subType={props.subType}
                    data={allstatements}
                    nodeType={nodeType}
                />
            )}

            {showApplicationDetail && (
                <ApplicationDetailsModal
                    data={ApplicationCount}
                    type={nodeType}
                    subType={props.subType}
                    appname={title}
                    show={showApplicationDetail}
                    onHide={() => setShowApplicationDetail(false)}
                />
            )}
        </>
    );
};

export default GraphNode;
