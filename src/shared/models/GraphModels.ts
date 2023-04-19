import { GraphLink } from 'shared/components/graph_link/graph_link';
import { IdentityDetails } from './IdentityAccessModel';

export interface Node {
    id: string;
    title: string;
    type?: string; // to display on the node for eg. AWS S3 bucket insted of aws_S3
    nodeType: string;
    iconURL?: string;
    popoverDetails?: unknown;
    isRisky?: boolean;
    isSelectedRisk?: boolean;
    isPartial?: boolean;
    setNodeId?: any;
    isExpend?: any;
    firstNodes?: any;
    groupedNodes?: any;
    setShow?: any;
    show?: any;
    parentId?: any;
    isRiskyIdentities?: boolean;
    identitiesDetails?: IdentityDetails[];
    subType: string;
    data?: any;
    riskScore?: any;
    identityRisk?: any;
    identityMap?: any;
    permission?: any;
    statements?: any;
    graphType?: any;
    ApplicationCount: any;
}

export interface Link {
    id: string;
    source: string;
    target: string;
    type: string;
    label?: string;
    arrowHeadType?: string;
    animated?: boolean;
    style?: any;
    labelBgStyle?: any;
    labelStyle?: any;
    data?: {
        accessType: string;
        access: string;
        sourceType: string;
        targetType: string;
        linkObj: GraphLink;
    };
}

export interface Resource {
    id: string;
    name: string;
    resource_type: string;
}

export interface LinkPopup {
    network_access?: Array<Resource>;
    identity_access?: Array<Resource>;
    config?: any;
}

export interface GraphData {
    nodes: Array<Node>;
    links: Array<Link>;
    risk: any;
    tabSelected: boolean;
}

export interface GraphState {
    data: GraphData;
    riskData: [];
    selectedData?: Node;
    showIdentitiesDetails?: boolean;
    allData?: any;
    trevalList: any;
    selectedList: any;
    parent?: any;
}
/* =============== Link Details Modal =============== */
export interface OrganisedAccessData {
    identityAccess: IdentitiyDetails[];
    networkAccess: NetworkDetails[];
}

export interface SelectedLink {
    source: Node;
    target: Node;
    accessData: OrganisedAccessData;
}

export interface NetworkDetails {
    accessible_port: string;
    protocol: string;
    direction: string;
}

export interface IdentitiyDetails {
    identity_id: string;
    identity_name: string;
    identity_type: string;
    level_of_access: string;
    access_type_policies_mapping: { [key: string]: string[] };
}
/* ================ Popover ========================== */
export interface LoadBalancerPopover {
    title: string;
    DNSName: string;
    scheme: string;
}

export interface ApplicationPopover {
    title: string;
    resources: Array<{ name: string; resourceCategory: string; PlatformDetails: string }>;
}

export interface CloudFrontDistributionPopover {
    title: string;
    origins: any;
    domainName: string;
    lastModifiedTime: string;
}

export interface APIGatewayPopover {
    title: string;
    id: string;
    name: string;
}
