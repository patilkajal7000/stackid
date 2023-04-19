import React, { useEffect, useState } from 'react';

import { getBezierPath, getMarkerEnd } from 'reactflow';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import { AppState } from 'store/store';
import { BPIModel } from 'shared/models/BPIModel';
import { getActualSeverityColor, getBpiScoreSeverity } from 'shared/service/Severity.service';

import CIcon from '@coreui/icons-react';
import { cilInfo, cilWarning } from '@coreui/icons';
import { RiskCardModel } from 'shared/models/RiskModel';
type BPISeverity = {
    bpiPercentage: number;
    severity: string;
    severityColor: string;
};
const CustomEdge = ({
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    data,
    arrowHeadType,
    markerEndId,
}: any) => {
    const selectedNode: any = useSelector((state: AppState) => state.graphState.selectedData);

    const { t } = useTranslation();
    const [bpiSeverity, setBPISeverity] = useState<BPISeverity>();
    const rhsState = useSelector((state: AppState) => state.rightSidebarState);
    const risks: RiskCardModel[] = rhsState.sidebarJSON?.risks || [];
    const bpiState = useSelector((state: AppState) => state.bpiState);
    const bpiDetailsState: BPIModel = bpiState.bpiDetails;
    const dataIAM: any = [];
    if (risks.length > 0) {
        risks.map((item: any) => item?.risk_dimension === 'IAM' && dataIAM.push(item));
    }
    useEffect(() => {
        if (bpiState && bpiState.bpiDetails) {
            const bpiPercentage = bpiDetailsState?.bpi | 0;
            const severity = getBpiScoreSeverity(bpiPercentage);
            const severityColor = getActualSeverityColor(severity);

            setBPISeverity({ bpiPercentage, severity, severityColor });
        }
    }, [bpiState.bpiDetails]);

    // const onRiskClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, id: any) => {
    const onRiskClick = (evt: any, id: any) => {
        // evt.stopPropagation();

        console.log(`risk link id ${id}`);
    };

    const onEdgeClick = (evt: React.MouseEvent<HTMLDivElement, MouseEvent>, id: any) => {
        //evt.stopPropagation();
        console.log(`edge id:  ${id}`);
    };

    // const [labelX, labelY] = getEdgeCenter({
    //     sourceX,
    //     sourceY,
    //     targetX,
    //     targetY,
    // });
    const [, labelX, labelY] = getBezierPath({ sourceX, sourceY, targetX, targetY });
    const [edgePath] = getBezierPath({
        sourceX,
        sourceY,
        sourcePosition,
        targetX,
        targetY,
        targetPosition,
    });
    // const edgePath = getBezierPath({ sourceX, sourceY, sourcePosition, targetX, targetY, targetPosition });
    const markerEnd = getMarkerEnd(arrowHeadType, markerEndId);

    const foreignObjectSize = data.selectedRiskId ? 155 : 30;
    return (
        <>
            {data.isShowSpotlight && <circle r="221" cx={labelX} cy={labelY} fill="#FFF0F2" />}
            <path
                fill="none"
                id={id}
                style={{ stroke: bpiSeverity?.severityColor }}
                className={
                    dataIAM?.length > 0
                        ? data.isRiskyOnly
                            ? `react-flow__edge-path_normal`
                            : data?.identityMap
                            ? data.targetObj.id == selectedNode?.id || data.sourceObj.id == selectedNode?.id
                                ? 'react-flow__edge-path1'
                                : 'react-flow__edge-path'
                            : 'react-flow__edge-path'
                        : data?.identityMap
                        ? data.targetObj.id == selectedNode?.id || data.sourceObj.id == selectedNode?.id
                            ? 'react-flow__edge-path1'
                            : 'react-flow__edge-path'
                        : 'react-flow__edge-path'
                }
                d={edgePath}
                markerEnd={markerEnd}
            />

            {data.isRisky && (
                <foreignObject
                    width={foreignObjectSize}
                    height={foreignObjectSize}
                    x={labelX - foreignObjectSize / 2}
                    y={labelY - foreignObjectSize / 2}
                    className="edgebutton-foreignobject"
                    requiredExtensions="http://www.w3.org/1999/xhtml"
                >
                    <>
                        {data.selectedRiskId ? (
                            <div className="risk-icon-long font-small-semibold d-flex flex-row align-content-center align-items-center">
                                <div
                                    className="risk-icon"
                                    onClick={(event) => onRiskClick(event, id)}
                                    role="presentation"
                                >
                                    <CIcon icon={cilWarning} size="xl" />
                                </div>
                                <div className="flex-grow-1 align-content-center me-2">{t('view_details')}</div>
                            </div>
                        ) : (
                            <div
                                className="risk-icon"
                                role="presentation"
                                style={{ backgroundColor: bpiSeverity?.severityColor }}
                                onClick={(event) => onRiskClick(event, id)}
                            >
                                <CIcon icon={cilWarning} size="xl" />
                            </div>
                            // </Tooltip>
                        )}
                    </>
                </foreignObject>
            )}
            {}
            {!data?.identityMap && !data.isRisky && (
                <foreignObject
                    width={foreignObjectSize}
                    height={foreignObjectSize}
                    x={labelX - foreignObjectSize / 2}
                    y={labelY - foreignObjectSize / 2}
                    className="edgebutton-foreignobject"
                    requiredExtensions="http://www.w3.org/1999/xhtml"
                >
                    <div className="edge-icon" onClick={(event) => onEdgeClick(event, id)} role="presentation">
                        <CIcon icon={cilInfo} />
                    </div>
                </foreignObject>
            )}

            {/* <EdgeText
                x={labelX}
                y={labelY}
                label={label}
                labelStyle={labelStyle}
                labelShowBg
                labelBgStyle={labelBgStyle}
                labelBgPadding={[2, 4]}
                labelBgBorderRadius={2}
            /> */}
            {/* <g transform={`translate(${labelX}, ${labelY})`}>
                <rect style={labelBgStyle} x="-2" y="-4">
                </rect>
                <text href={`#${id}`} x="0" y="0" style={labelStyle} textAnchor="middle">
                    {label}
                </text>
            </g> */}
        </>
    );
};

export default CustomEdge;
