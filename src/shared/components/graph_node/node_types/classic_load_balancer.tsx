import React from 'react';
import { LoadBalancerPopover, Node } from 'shared/models/GraphModels';
import { GraphNode } from '../graph_node';
import { Popover } from 'react-bootstrap';

export class ClassicLoadBalancer extends GraphNode {
    popoverDetails: LoadBalancerPopover | undefined;

    constructor(id: string, name: string, type: string, public details: any) {
        super(id, name, type, details);
    }

    getNodeDetails(): Node {
        const nodeDetails = { ...super.getNodeDetails() };
        nodeDetails['type'] = 'Classic Load Balancer';
        return nodeDetails;
    }

    setPopoverDetails(details: any): LoadBalancerPopover | null {
        if (details) {
            this.popoverDetails = {
                title: this.name,
                DNSName: details?.DNSName,
                scheme: details?.Scheme,
            };
            return this.popoverDetails;
        }
        return null;
    }

    getPopoverTemplate(): JSX.Element {
        if (this.popoverDetails) {
            return <this.LoadBalancerPopoverTemplate {...this.popoverDetails} />;
        }
        return <> Data not found </>;
    }

    private LoadBalancerPopoverTemplate = (props: LoadBalancerPopover) => {
        return (
            <>
                <Popover.Header as="h3" className="text-value text-dark text-truncate" title={props.title}>
                    {props.title}
                </Popover.Header>
                <Popover.Body>
                    <div className="me-3">
                        <div className="text-value text-dark text-break"> DNS Name </div>
                        <hr className="mt-0 mb-1" />
                        <div> {props.DNSName}</div>

                        <div className="text-value text-dark text-break mt-2"> Scheme </div>
                        <hr className="mt-0" />
                        <div> {props.scheme}</div>
                        {/* <div className="float-end m-2">
                            <CLink className="link"> See details</CLink>
                        </div> */}
                    </div>
                </Popover.Body>
            </>
        );
    };
}
