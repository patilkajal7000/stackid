export interface DiscoveryStatusModel {
    application_discovery_error_details?: any;
    application_discovery_progress?: { [key: string]: ApplicationDiscoveryProgress };
    cloud_account_id?: string;
    end_time?: Time;
    isDiscoveryComplete?: boolean;
    policy_manager_error_details?: any;
    policy_manager_progress?: { [key: string]: any };
    resource_discovery_error_details?: { [key: string]: any };
    resource_discovery_progress?: { [key: string]: ApplicationDiscoveryProgress };
    start_time?: Time;
}

export interface ApplicationDiscoveryProgress {
    finished_processing: string;
    sent_msg: string;
    started_processing: string;
}

export interface Time {
    APPLICATION_DISCOVERY: string;
    POLICY_MANAGER: string;
    RESOURCE_DISCOVERY: string;
}
