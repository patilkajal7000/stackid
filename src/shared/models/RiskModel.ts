// ----------- UI component model --------------

export interface RiskCardModel {
    rule_id: string;
    risk_dimension: string;
    rule_name: string;
    attribution?: number;
    found_on: string;
    frequency?: number;
    links: string[]; // list of link ids from patterns
    accessPath?: string;
    sub_resource: string;
    sub_resource_name?: string;
    entity_pattern_type?: string;
    risk_occurence_reason: string;
    priority_label: string;
    pattern_description: string;
    patternName: string;
    account_id: string;
    root_resource: string;
}

export interface PreparedRiskData {
    riskPanelData: RiskCardModel[];
    graphRisks: Pattern[];
    allLinks: string[];
}
//------------------------ data model -------------
export interface Risk {
    rule_id: string;
    risk_dimension: string;
    rule_name: string;
    attribution: number;
    found_on: number;
    passed?: boolean;
    condition?: string;
    key?: string;
    sub_resource?: string;
    sub_resource_name?: string;
    entity_pattern_type?: string;
    risk_occurence_reason: string;
}

export interface Attribution {
    attribution: number;
    found_on: string;
    frequency: number;
    links: string[]; // list of link ids from patterns
    risk_dimension: string;
    rule_name: string;
}

export interface Attributions {
    [key: string]: Attribution;
}

export interface PATH_RISK {
    priority_label: string;
    risk_occurence_reason: string;
    condition: string;
    found_on: string;
    key: string;
    link_id: string;
    passed: boolean;
    priority: string;
    risk_dimension: string;
    rule_id: string;
    rule_name: string;
    sub_resource: string;
    sub_resource_name?: string;
    entity_pattern_type?: string;
    pattern_description: string;
    patternName: string;
    root_resource: string;
    accountId: string;
}

export interface Pattern {
    all_Links: any;
    identities: any;
    network: any;
    linkId: string;
    patternId: string;
    patternDescription: string;
    patternName: string;
    source: {
        failure_frequency?: any;
        risks?: Risk[];
        rulesets?: string[];
        id: string;
    };
    target: {
        failure_frequency?: any;
        all_links?: any;
        risks?: Risk[];
        rulesets?: string[];
        id: string;
    };
}

export interface AccessPath {
    all_links: any;
    attributions: Attributions;
    patterns: Pattern[];
    path_risks: PATH_RISK[];
}

export interface AccessPaths {
    [key: string]: AccessPath;
}
