import React, { FC } from 'react';
import { CLink, CListGroup, CListGroupItem } from '@coreui/react';
import { copyARN } from './Graph.service';
import { LinkPopup } from 'shared/models/GraphModels';
import Overlay from 'react-bootstrap/Overlay';
import Popover from 'react-bootstrap/Popover';

type GraphPopoverProps = {
    show: boolean;
    target: any;
    container: any;
    setShowRef: any;
    linkDetails?: LinkPopup;
    nodeDetails?: any;
    popoverType: string;
    onClickRisk: any;
    onClickInfo: any;
};

const GraphPopover: FC<GraphPopoverProps> = ({
    show,
    target,
    container,
    setShowRef,
    linkDetails,
    nodeDetails,
    popoverType,
    onClickRisk,
    onClickInfo,
}: GraphPopoverProps) => {
    return (
        <React.Fragment>
            <Overlay
                show={show}
                target={target}
                placement="top-start"
                container={container}
                rootClose
                onHide={(e) => {
                    if (e.target != target) {
                        e.preventDefault();
                        e.stopImmediatePropagation();
                        e.stopPropagation();
                        setShowRef(false);
                    }
                }}
            >
                <Popover>
                    {popoverType == 'contextPopover' && (
                        <CListGroup className="text-dark">
                            <CListGroupItem className="btn" onClick={() => copyARN(nodeDetails, setShowRef)}>
                                Copy ARN
                            </CListGroupItem>
                        </CListGroup>
                    )}
                    {popoverType == 'identityPopover' && (
                        <Popover.Header style={{ alignContent: 'center' }}>{nodeDetails?.subType}</Popover.Header>
                    )}
                    {popoverType == 'Link' && (
                        <div style={{ maxHeight: '500px', overflow: 'auto' }}>
                            {' '}
                            <pre> {JSON.stringify(linkDetails, null, 2)}</pre>
                        </div>
                    )}
                    {popoverType == 'Risk' && (
                        <>
                            <CLink>
                                <Popover.Header as="h2" style={{ alignContent: 'center' }} onClick={onClickRisk}>
                                    Risk
                                </Popover.Header>
                            </CLink>
                            <CLink>
                                <Popover.Header as="h2" onClick={onClickInfo}>
                                    Information
                                </Popover.Header>
                            </CLink>
                        </>
                    )}
                    {popoverType == 'Node' && nodeDetails.getPopoverTemplate()}
                </Popover>
            </Overlay>
        </React.Fragment>
    );
};

export default React.memo(GraphPopover);
