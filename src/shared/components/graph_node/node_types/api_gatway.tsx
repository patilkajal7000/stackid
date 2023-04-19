import React from 'react';
import { APIGatewayPopover, Node } from 'shared/models/GraphModels';
import { GraphNode } from '../graph_node';
import { Popover } from 'react-bootstrap';

export class APIGateway extends GraphNode {
    popoverDetails: APIGatewayPopover | undefined;

    constructor(id: string, name: string, type: string, public details: any) {
        super(id, name, type, details);
    }

    getNodeDetails(): Node {
        const nodeDetails = { ...super.getNodeDetails() };
        nodeDetails['type'] = 'API Gateway';
        return nodeDetails;
    }

    setPopoverDetails(details: any): APIGatewayPopover | null {
        if (details) {
            this.popoverDetails = {
                title: this.name,
                id: details?.rest_apis?.id,
                name: details?.rest_apis?.name,
            };
            return this.popoverDetails;
        }
        return null;
    }

    getPopoverTemplate(): JSX.Element {
        if (this.popoverDetails) {
            return <this.APIGatewayPopoverTemplate {...this.popoverDetails} />;
        }
        return <> Data not found </>;
    }

    private APIGatewayPopoverTemplate = (props: APIGatewayPopover) => {
        return (
            <>
                <Popover.Header as="h3" className="text-value text-dark text-truncate" title={props.title}>
                    {props.title}
                </Popover.Header>
                <Popover.Body>
                    <div className="me-3">
                        <div className="text-value text-dark text-break"> API Gateway Id </div>
                        <hr className="mt-0 mb-1" />
                        <div> {props.id}</div>
                        <div className="text-value text-dark text-break mt-3"> API Gateway Name </div>
                        <hr className="mt-0 mb-1" />
                        <div> {props.name}</div>
                        {/* <div className="float-end m-2">
                            <CLink className="link"> See details</CLink>
                        </div> */}
                    </div>
                </Popover.Body>
            </>
        );
    };
}
