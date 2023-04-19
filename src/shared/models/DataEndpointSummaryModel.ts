import { SEVERITY_CATEGORIES, SEVERITY_NAME } from '../utils/Constants';
import { SeverityType } from './RHSModel';

export interface DataEndpointSummaryModel {
    resources: DataEndpointResorceModel[];
    resourcesSeverity: ResourcesSeverity[];
}
export interface DataEndpointResorceModel {
    id: string;
    name: string;
    resource_category?: string;
    resource_details?: ResourceDetails;
    resource_type?: string;
    risk_score: number;
    classification?: string;
    native_tags?: any;
    data_classification_tags?: Array<any> | null;
    data_security: dataSecurity;
    platformTags?: any;
}

export interface ResourceDetails {
    AccessBlock: AccessBlock;
    Acl?: ACL;
    Details: Details;
    Encryption: Encryption;
    Location?: Location;
    Logging?: Logging;
    PolicyStatus: ResourceDetailsPolicyStatus;
    Versioning: Versioning;
    WebsiteHosting: WebsiteHosting;
}
export interface dataSecurity {
    is_encrypted: boolean;
    is_public: boolean;
    is_versioned: boolean;
}

export interface AccessBlock {
    PublicAccessBlockConfiguration?: PublicAccessBlockConfiguration;
}

export interface PublicAccessBlockConfiguration {
    BlockPublicAcls: boolean;
    BlockPublicPolicy: boolean;
    IgnorePublicAcls: boolean;
    RestrictPublicBuckets: boolean;
}

export interface ACL {
    Grants: Grant[];
    Owner: Owner;
}

export interface Grant {
    Grantee: Grantee;
    Permission: string;
}

export interface Grantee {
    DisplayName?: string;
    ID?: string;
    Type: string;
    URI?: string;
}

export interface Owner {
    DisplayName?: string;
    ID: string;
}

export interface Details {
    CreationDate: string;
    Name: string;
}

export interface Encryption {
    ServerSideEncryptionConfiguration?: ServerSideEncryptionConfiguration;
}

export interface ServerSideEncryptionConfiguration {
    Rules: Rule[];
}

export interface Rule {
    ApplyServerSideEncryptionByDefault: ApplyServerSideEncryptionByDefault;
}

export interface ApplyServerSideEncryptionByDefault {
    SSEAlgorithm: string;
    KMSMasterKeyID?: string;
}

export interface Location {
    LocationConstraint: string | null;
}

export interface Logging {
    LoggingEnabled?: LoggingEnabled;
}

export interface LoggingEnabled {
    TargetBucket: string;
    TargetPrefix: string;
}

export interface ResourceDetailsPolicyStatus {
    PolicyStatus?: PolicyStatusPolicyStatus;
}

export interface PolicyStatusPolicyStatus {
    IsPublic: boolean;
}

export interface Versioning {
    Status?: string;
}

export interface WebsiteHosting {
    IndexDocument?: IndexDocument;
}

export interface IndexDocument {
    Suffix: string;
}

export type Category = {
    severity: string;
    value: number;
};

export interface ResourcesSeverity {
    Name: string;
    category: typeof SEVERITY_CATEGORIES;
    id: string;
    severity: SeverityType;
    severityName: typeof SEVERITY_NAME;
}

export enum ViewTypes {
    CANVAS = 'Canvas',
    LIST = 'List',
}
