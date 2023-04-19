import { BadgeData } from './GenericModel';

export enum IdentityType {
    AwsIAMRole = 'aws_IAMRole',
    AwsIAMUser = 'aws_IAMUser',
    AwsIAMUserHuman = 'aws_IAMUserHuman',
    AwsIAMUserApplication = 'aws_IAMUserApplication',
    AwsIAMGroup = 'aws_IAMGroup',
    AWsIAMPolicy = 'aws_IAMPolicy',
    AwsFederated = 'AwsFederated',
    AwsFedOkta = 'aws_FedOkta',
    GCPUserHuman = 'gcp_IAMUser',
    GCPUserApplication = 'gcp_IAMServiceAccount',
    GCPRole = 'Role',
}

export enum AccessType {
    IndirectAccess = 'indirect_access',
    DirectAccess = 'direct_access',
    ResourcesAttached = 'resource_attached',
}

export enum PolicySubTab {
    Identities = 'identities',
    Permissions = 'permissions',
}

export type IdentitiesInsightDetail = {
    title: string;
    badgeData: BadgeData[];
};

export interface IdentitiesInsights {
    [key: string]: IdentitiesInsightDetail;
}

export type SingleIdentityInsightDetails = {
    identityDetails: any;
    identityName: string;
    createdOn: number;
    isMFAEnabled: boolean;
    isProgramaticAccess: boolean;
    isConsoleAccess: boolean;
    isCanAssumeRole: boolean;
    isCanAssumeRoleSameAccount: boolean;
    isCanAssumeRoleOtherAccount: boolean;
    identityType: IdentityType;
    accessTypes: Array<SingleIndirectAccess>;
    CanAssumeRole: Array<CanAssumeRole>;
};

export type CanAssumeRole = {
    assumed_role_name: string;
    aws_account_id: string;
    policy_name: string;
    si_account_id: number;
};

export type SingleIndirectAccess = {
    account_id?: string;
    resource?: string;
    resource_path?: string;
    type: string;
};

export type IdentityResourceDetails = {
    resource_id: string;
    resource_name: string;
    resource_type: string;
    permissions?: Array<string>;
    si_account_id?: number; /// in case of other account resource
    last_activity?: number;
};

export type SinglePolicyInsightsDetails = {
    policyName: string;
    policyType: string;
    identities: {
        [key: string]: string;
    };
    permissions: {
        [key: string]: string;
    };
};

export type Identity = {
    id: string;
    name: string;
    identity_type: string;
    is_admin_permission: boolean;
};

export type Permissions = {
    [key: string]: {
        [key: string]: Array<LevelOfAccess>;
    };
};

// Todo - Check if below models are used or not
export interface IdentityAccessModel {
    identified_from: IdentifiedFrom;
    level_of_access: LevelOfAccess;
    resource_details: ResourceDetails;
    who_details: WhoDetails;
}

export interface IdentifiedFrom {
    allow: Allow[];
    deny: any[];
}

export interface Allow {
    Action?: string;
    Effect?: string;
    PolicyName?: string;
    Statement?: Statement[];
    Version?: string;
}

export interface Statement {
    Action: string;
    Effect: string;
    Resource: string;
}

export enum LevelOfAccess {
    All = 'ALL',
    Admin = 'Admin',
    List = 'List',
    PermissionsManagement = 'Permissions management',
    Read = 'Read',
    Tagging = 'Tagging',
    Write = 'Write',
}

export interface ResourceDetails {
    id: string;
    name: string;
    resource_type: string;
}

export interface WhoDetails {
    identity_id: string;
    identity_name: string;
    identity_type: IdentityType;
}

export const LevelOfAccessView: any = {
    ALL: 'Full Access',
    'Permissions management': 'Permissions Management',
    Write: 'Write',
    Tagging: 'Tagging',
    Read: 'Read',
    List: 'List',
};

export const LevelOfAccessSortOrder = [
    LevelOfAccess.All,
    LevelOfAccess.PermissionsManagement,
    LevelOfAccess.Write,
    LevelOfAccess.Tagging,
    LevelOfAccess.Read,
    LevelOfAccess.List,
];

export type RiskChartDetails = {
    total_access: number;
    unused_access: number;
    user_id: string;
};

export type RiskChartMap = {
    [key: string]: RiskChartDetails;
};

// ------------ Identities Overview ---------------

export type IdentityDetails = {
    resource_id?: string;
    identity_id: string;
    identity_name: string;
    identity_type: IdentityType;
    permissions: Array<string>;
    accessTypes: Array<string>;
    resource_ids?: Array<string>;
    is_admin_permission?: boolean;
    is_permission_management?: boolean;
    resource_ids_count?: number;
    last_activity?: number;
    policy_tags?: any;
    Tags?: Array<any> | null;
    // Used in case of Single Data asset Screen (Cross and Assume role access account )
    assumed_role_name?: Array<string>;
    aws_account_id?: string;
    // Used in case of GCP dataset/table identities tab
    permission_details?: any;
    risk_type?: string[];
    platformTags?: any;
    risk_score?: number;
    si_risk?: any;
};

export type PolicyDetails = {
    policy_id: string;
    name: string;
    type: IdentityType;
    identity_count: any;
    si_resource_types: string;
    si_permission_types: string;
    si_risk_score: number;
};
export type ResourcePermissions = {
    permission_name: string;
    permission_type: string;
    policies: string[];
};

export interface InsightOverview {
    application_identities: NIdentities;
    human_identities: NIdentities;
}

export interface NIdentities {
    insight_details: IdentitiesInsights;
    overview_data: IdentityDetails[];
}

export interface SingleBucketAccess {
    direct: SingleBucketDirectAccess;
    indirect: SingleBucketInDirectAccess;
}

export interface SingleBucketDirectAccess {
    application_identities: IdentityDetails[];
    human_identities: IdentityDetails[];
    roles: IdentityDetails[];
}

export interface SingleBucketInDirectAccess {
    users: IdentityDetails[];
    roles: IdentityDetails[];
    fed_okta_users: IdentityDetails[];
    application_identities: IdentityDetails[];
    human_identities: IdentityDetails[];
}

// want to make activity log interface generic
export type IdentityActivityLog = {
    IsConfigChangeEvent: string;
    account_id: number;
    event_name: string;
    event_source: string;
    start_time: string;
    org_id: string;
    user_identity_principal_id: string;
};

//---------------- GCP Identities ------------------
export type GCPIdentityDetails = {
    name: string;
    permission_type: string;
    last_activity: number;
    permission_details: GCPPermissionDetails;
};

export type GCPPermissionDetails = {
    permissions: {
        [key: string]: string[];
    };
    role_name: string;
};

export type GCPRoleDetails = {
    role_id: string;
    role_name: string;
    management: string;
    identities: { [identityType: string]: number };
    resource_type: string;
    permission_type: string;
};

export type GCPSingleIdentityInsights = {
    identity_id: string;
    identity_name: string;
    last_created_on: number;
    last_activity: number;
    programmatic_access: boolean;
    console_access: boolean;
    can_impersonate_service_account: boolean;
};

export type GCPIdentityResourceDetails = {
    resource_id: string;
    resource_name: string;
    resource_type: string;
    permission_type: string;
    classification: string;
    last_activity?: number;
};

export type GCPIdentityActivityLog = {
    activity: string;
    event_name: string;
    event_details: string;
    date: number;
};

export type GCPSingleRoleInsightsDetails = {
    role_name: string;
    role_type: string;
    identities: {
        [key: string]: string;
    };
    permissions: {
        [key: string]: string;
    };
};

export type GCPRoleIdentity = {
    identity_name: string;
    identity_type: string;
};

export type PermissionDetails = {
    permission_name: string;
    last_used_on: number;
    last_used_by: string;
};

export type GCPRolePermissions = {
    [key: string]: {
        [key: string]: Array<PermissionDetails>;
    };
};

export type ResourcePermissionDetails = {
    permission_name: string;
    permission_type: string;
    role: string[];
};

export type GCPIdentityResourcePermissions = {
    resource_name: string;
    resource_type: string;
    permissions?: ResourcePermissionDetails[];
};
