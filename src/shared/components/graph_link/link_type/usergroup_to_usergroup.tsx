import React from 'react';
import { Popover } from 'react-bootstrap';
import { LinkPopup, Resource } from 'shared/models/GraphModels';
import { GraphLink } from '../graph_link';

export class UserGroupToUserGroup extends GraphLink {
    popoverDetails: any;

    constructor(details: any) {
        super(details);
    }

    setPopoverDetails(details: LinkPopup): unknown {
        return (this.popoverDetails = this.getConnectedResources(details, this.source));
    }

    getPopoverTemplate(): JSX.Element {
        if (this.popoverDetails) {
            return <this.userGroupToUserGroupPopoverTemplate {...this.popoverDetails} />;
        }
        return <> Data not found </>;
    }

    private userGroupToUserGroupPopoverTemplate = (props: LinkPopup) => {
        return (
            <>
                <Popover.Header as="h3" className="text-value text-dark text-truncate">
                    Access Details
                </Popover.Header>
                <Popover.Body>
                    <div className="me-3">
                        {props?.network_access && props.network_access.length > 0 && (
                            <>
                                <div className="text-value text-dark text-break"> Network Access </div>
                                <hr className="mt-0" />
                                <ul style={{ marginLeft: '-1.5rem' }}>
                                    {props?.network_access?.map((item: any, index: any) => (
                                        <li key={index}>{item?.name}</li>
                                    ))}
                                </ul>
                            </>
                        )}
                        {props?.identity_access && props.identity_access.length > 0 && (
                            <>
                                <div className="text-value text-dark text-break"> Identity Access </div>
                                <hr className="mt-0" />
                                <ul style={{ marginLeft: '-1.5rem' }}>
                                    {props?.identity_access?.map((item: any, index: any) => (
                                        <li key={index}>{item?.name}</li>
                                    ))}
                                </ul>
                            </>
                        )}

                        {/* <div className="float-end m-2">
                            <CLink className="link"> See details</CLink>
                        </div> */}
                    </div>
                </Popover.Body>
            </>
        );
    };

    private getConnectedResources = (details: LinkPopup, resId: string) => {
        const accessData: LinkPopup = {
            identity_access: [],
            network_access: [],
        };
        if (details.identity_access) {
            accessData.identity_access?.push(...this.getConnectedResourceIds(details.identity_access, resId));
        }
        if (details.network_access) {
            accessData.network_access?.push(...this.getConnectedResourceIds(details.network_access, resId));
        }

        return accessData;
    };

    private getConnectedResourceIds(dataList: Resource[], resourceId: string) {
        const connectedResourceIdList: Array<Resource> = [];
        dataList.forEach((element: any) => {
            let connnectedResource: Resource | null = null;
            if (element && element.source_details && element.source_details.id == resourceId) {
                connnectedResource = element.target_details;
            } else {
                connnectedResource = element.source_details;
            }

            if (
                connnectedResource &&
                !connectedResourceIdList.some((resource) => resource.id == connnectedResource?.id)
            ) {
                connectedResourceIdList.push(connnectedResource);
            }
        });
        return connectedResourceIdList;
    }
}
