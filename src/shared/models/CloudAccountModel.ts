import { DiscoveryStatusModel } from './DiscoveryStatusModel';

export interface CloudAccountModel {
    risk_label: string;
    account_details: AccountDetails;
    assume_role_account: boolean;
    cloud_provider: string;
    id: string;
    last_scan_event_ts: string;
    name: string;
    discovery_status: DiscoveryStatusModel;
    current_risk_posture: number;
    last_risk_posture: number;
    discover_continuously: boolean;
    discovery_interval: number;
    latest_discovery_id: number | null;
    account_risk_score: number;
    org_id: string;
    retain_discoveries: number;
}
export interface TooltipData {
    active: any;
    payload: any;
    label: string;
}

export interface AccountDetails {
    Account: any;
    cloud_provider: any;
    Organization: Organization;
    credential_report: { [key: string]: string }[];
}

export interface Organization {
    Arn: string;
    AvailablePolicyTypes: AvailablePolicyType[];
    FeatureSet: string;
    Id: string;
    MasterAccountArn: string;
    MasterAccountEmail: string;
    MasterAccountId: string;
}

export interface AvailablePolicyType {
    Status: string;
    Type: string;
}

export interface AddCloudAccountPayload {
    name: string;
    cloud_provider: string;
    connection_details: IAMCredentials | AssumeRole | SnowflakeCredentials;
    configs?: {
        [key: string]: any;
    };
}

export interface IAMCredentials {
    accesskeyid: string;
    secretaccesskey: string;
}

export interface SnowflakeCredentials {
    userName: string;
    password: string;
    accountIdentifier: string;
    defaultRole: string;
    warehouse: string;
}

export interface AssumeRole {
    assume_role: string;
}

//cloud account setting screen
export interface AccountConfig {
    id: number;
    config_name: string;
    config_value: any;
}

export interface BasicCofigPayload {
    discovery_interval?: number;
    cloud_provider?: 'AWS' | 'GCP';
    connection_details?: { accesskeyid: string; secretaccesskey: string };
}

export enum ConfigType {
    OKTA_IDP_CONFIG = 'OKTA_IDP_CONFIG',
    LOG_GROUP_DETAILS = 'LOG_GROUP_DETAILS',
    SECRET_ACCESS_KEY = 'SECRET_ACCESS_KEY',
    SCANNING_INTERVAL = 'SCANNING_INTERVAL',
    APP_NAME_TAG_CONFIG = 'APP_NAME_TAG_CONFIG',
    SLACK_WEB_HOOK = 'SLACK_WEB_HOOK',
    DATA_CLASSIFICATION_TAG = 'DATA_CLASSIFICATION_TAG',
    GCP_PUB_SUB = 'GCP_PUB_SUB',
    GCP_TAG_KEY = 'GCP_TAG_KEY',
    CLOUDTRAIL_S3_BUCKET = 'CLOUDTRAIL_S3_BUCKET',
    JIRA_INTEGRATION = 'JIRA_INTEGRATION',
    PAGERDUTY_AUTH_INFO = 'PAGERDUTY_AUTH_INFO',
    PAGERDUTY_SETTINGS = 'PAGERDUTY_SETTINGS',
    RISK_ASSESMENT_REPORT_CONFIGURATION = 'RISK_ASSESMENT_REPORT_CONFIGURATION',
    SLACK_WORKFLOW_WEB_HOOK = 'SLACK_WORKFLOW_WEB_HOOK',
    SLACK_WORKSPACE_NAME = 'SLACK_WORKSPACE_NAME',
}

export enum CloudAccountProvider {
    AWS = 'AWS',
    GCP = 'GCP',
    AZURE = 'AZURE',
    KUBERNETES = 'KUBERNETES',
    SNOWFLAKE = 'SNOWFLAKE',
    GIT = 'GIT',
}
