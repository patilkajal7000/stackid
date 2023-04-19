export interface RuleOutput {
    aws_cis_benchmark: AwsCisBenchmark;
}

export interface AwsCisBenchmark {
    category: string;
    description: string;
    ruleoutputs: S3BucketEncryption[];
    ruleset: string[];
}

export interface S3BucketEncryption {
    account_id: string;
    data_type: string;
    org_id: string;
    parent_id: string;
    name: string;
    reason: S3BucketEncryptionReason | S3BucketHTTPSReason;
    resource_id: string;
    resource_name: string;
    resource_type: string;
    rule_id: string;
    rule_name: string;
    updated: string;
}

export interface S3BucketEncryptionReason {
    algorithm_state: string;
    encrypted: string;
}

export interface S3BucketHTTPSReason {
    bucket_policy_configured: string;
    s3_transport_secured: string;
}
