import React from 'react';
import { Popover } from 'react-bootstrap';
import { ApplicationPopover, Node } from 'shared/models/GraphModels';
import { GraphNode } from '../graph_node';

export class Application extends GraphNode {
    popoverDetails: ApplicationPopover | undefined;
    constructor(id: string, name: string, type: string, public details: any) {
        super(id, name, type, details);
    }

    getNodeDetails(): Node {
        const nodeDetails = { ...super.getNodeDetails() };

        nodeDetails['type'] = 'application';
        nodeDetails['nodeType'] === 'userDefinedGroup';
        if (nodeDetails['nodeType'] === 'userDefinedGroup' && nodeDetails['subType']) {
            nodeDetails['iconURL'] = 'awsicons/' + this.subType + '.svg';
        } else {
            nodeDetails['iconURL'] = 'awsicons/application.png';
        }
        return nodeDetails;
    }

    setPopoverDetails(details: any): ApplicationPopover | null {
        if (details) {
            this.popoverDetails = {
                title: this.name,
                resources: details,
            };
            return this.popoverDetails;
        }
        return null;
    }

    getPopoverTemplate(): JSX.Element {
        if (this.popoverDetails) {
            return <this.applicationPopoverTemplate {...this.popoverDetails} />;
        }
        return <> Data not found </>;
    }

    private applicationPopoverTemplate = (props: ApplicationPopover) => {
        return (
            <>
                <Popover.Header as="h3" className="text-value text-dark text-truncate" title={props.title}>
                    {props?.title}
                </Popover.Header>
                <Popover.Body>
                    <div className="me-3">
                        {props?.resources && props?.resources.length > 0 && props?.resources[0].PlatformDetails && (
                            <>
                                <div className="text-value text-dark text-break"> Platform Details </div>
                                <hr className="mt-0" />
                                <div> {props?.resources[0].PlatformDetails}</div>
                            </>
                        )}
                        <div className="text-value text-dark text-break mt-3"> Type</div>
                        <hr className="mt-0" />
                        <ul style={{ marginLeft: '-1.5rem' }}>
                            {props?.resources?.map((item: any, index: any) => (
                                <li key={index}>{item.resource_category}</li>
                            ))}
                        </ul>
                        <div className="text-value text-dark text-break mt-3">
                            {' '}
                            Resources({props?.resources.length}){' '}
                        </div>
                        <hr className="mt-0" />
                        <ul style={{ marginLeft: '-1.5rem' }}>
                            {props?.resources?.map((item: any, index: any) => (
                                <li key={index}>{item.name}</li>
                            ))}
                        </ul>
                        {/* <div className="float-end m-2">
                            <CLink className="link"> See details</CLink>
                        </div> */}
                    </div>
                </Popover.Body>
            </>
        );
    };
}
