import React from 'react';
import { CloudFrontDistributionPopover, Node } from 'shared/models/GraphModels';
import { GraphNode } from '../graph_node';
import { Popover } from 'react-bootstrap';
import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
dayjs.extend(advancedFormat);

export class CloudFrontDistribution extends GraphNode {
    popoverDetails: CloudFrontDistributionPopover | undefined;

    constructor(id: string, name: string, type: string, public details: any) {
        super(id, name, type, details);
    }

    getNodeDetails(): Node {
        const nodeDetails = { ...super.getNodeDetails() };
        nodeDetails['type'] = 'CloudFront';
        return nodeDetails;
    }

    setPopoverDetails(details: any): CloudFrontDistributionPopover | null {
        if (details) {
            const origins: any = [];
            details?.Origins?.Items.forEach((x: any) => {
                x?.S3OriginConfig?.OriginAccessIdentity &&
                    origins.push({ id: x?.id, name: x?.S3OriginConfig?.OriginAccessIdentity });
            });
            this.popoverDetails = {
                title: this.name,
                origins: origins,
                lastModifiedTime: details?.LastModifiedTime,
                domainName: (details?.Aliases?.Items?.length && details?.Aliases?.Items[0]) || details?.DomainName,
            };
            return this.popoverDetails;
        }
        return null;
    }

    getPopoverTemplate(): JSX.Element {
        if (this.popoverDetails) {
            return <this.CloudFrontDistributionPopoverTemplate {...this.popoverDetails} />;
        }
        return <> Data not found </>;
    }

    private CloudFrontDistributionPopoverTemplate = (props: CloudFrontDistributionPopover) => {
        return (
            <>
                <Popover.Header as="h3" className="text-value text-dark text-truncate" title={props.title}>
                    {props.title}
                </Popover.Header>
                <Popover.Body>
                    <div className="me-3">
                        <div className="text-value text-dark text-break"> Domain Name </div>
                        <hr className="mt-0 mb-1" />
                        <div> {props.domainName}</div>
                        <div className="text-value text-dark text-break mt-3"> Origin Access Identities </div>
                        <hr className="mt-0 mb-1" />
                        {props.origins?.length > 0
                            ? props.origins.map((x: any, index: number) => (
                                  <div key={index}>{x?.name ? index + 1 + '] ' + x?.name : ''}</div>
                              ))
                            : '-'}
                        <div className="text-value text-dark text-break mt-3"> Last Modified Time </div>
                        <hr className="mt-0 mb-1" />
                        <div>
                            {props.lastModifiedTime && dayjs(props.lastModifiedTime).format('MMM Do, YYYY').toString()}
                        </div>
                        {/* <div className="float-end m-2">
                            <CLink className="link"> See details</CLink>
                        </div> */}
                    </div>
                </Popover.Body>
            </>
        );
    };
}
