import React from 'react';
import { Popover } from 'react-bootstrap';
import { ApplicationPopover } from 'shared/models/GraphModels';
import { GraphNode } from '../graph_node';

export class Resources extends GraphNode {
    popoverDetails: ApplicationPopover | undefined;
    constructor(id: string, name: string, type: string, public details: any) {
        super(id, name, type, details);
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
            return <this.ResourcePopoverTemplate {...this.popoverDetails} />;
        }
        return <> Data not found </>;
    }

    private ResourcePopoverTemplate = (props: any) => {
        return (
            <>
                <Popover.Header as="h3" className="text-value text-dark text-truncate" title={props.title}>
                    {props?.resources.subType}
                </Popover.Header>
                <Popover.Body>
                    <div className="text-value text-dark text-break mt-0">permission </div>
                    <hr className="mt-0" />
                    <ul style={{ marginLeft: '-1.5rem' }}>
                        {props?.resources?.permission?.map((item: any, index: any) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </Popover.Body>
            </>
        );
    };
}
