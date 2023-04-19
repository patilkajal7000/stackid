export interface PolicyModel {
    category: string;
    display_name: string;
    failure: number;
    policy_name: string;
    success: number;
}

export interface SinglePolicyModel {
    description: string;
    display_name: string;
    rules: PolicyRule[];
}

export interface PolicyRule {
    failed_resources: number;
    resource_type: string[];
    rule_name: string;
    display_name: string;
    total_resources: number;
}
