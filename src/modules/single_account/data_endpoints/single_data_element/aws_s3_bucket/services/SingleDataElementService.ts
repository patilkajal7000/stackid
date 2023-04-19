import { AccessPaths, PATH_RISK, PreparedRiskData, RiskCardModel } from 'shared/models/RiskModel';

export const prepareRiskData = (accessPaths: AccessPaths, bpiPathKey: string, type?: any) => {
    const riskData: PreparedRiskData = {
        riskPanelData: [],
        graphRisks: [],
        allLinks: [],
    };

    if ((accessPaths && bpiPathKey in accessPaths) || bpiPathKey) {
        //Object.keys(accessPaths).forEach(key => {
        // let accessPath: AccessPath;
        let accessPath: any;
        accessPath = accessPaths[bpiPathKey];
        if (type == 'all') {
            accessPath = accessPaths;
        }

        const path_risks: PATH_RISK[] = accessPath.path_risks;
        const RiskyLinks: any = [];

        accessPath?.all_links?.map((item: any) => {
            RiskyLinks.push(item);
        });

        riskData.graphRisks.push(...accessPath.patterns);
        riskData.allLinks.push(RiskyLinks);
        const patternDescription: any = accessPath?.patterns[0]?.patternDescription;
        const patternName: any = accessPath?.patterns[0]?.patternName;
        path_risks.forEach((path_risk) => {
            const riskCardData: RiskCardModel = {
                rule_id: path_risk.rule_id,
                risk_dimension: path_risk.risk_dimension,
                rule_name: path_risk.rule_name,
                found_on: path_risk.found_on,
                links: [path_risk.link_id], // list of link ids from patterns
                // links: [RiskyLinks], // list of link ids from patterns
                accessPath: bpiPathKey,
                sub_resource: path_risk.sub_resource,
                sub_resource_name: path_risk.sub_resource_name || '',
                entity_pattern_type: path_risk.entity_pattern_type || '',
                risk_occurence_reason: path_risk?.risk_occurence_reason,
                priority_label: path_risk?.priority_label,
                pattern_description: patternDescription,
                patternName: patternName,
                account_id: path_risk.accountId,
                root_resource: path_risk.root_resource,
            };
            riskData.riskPanelData.push(riskCardData);
        });

        // const attributions: Attributions = accessPath.attributions;
        // Object.keys(attributions).forEach(attrKey => {
        //     const attribution: Attribution = attributions[attrKey];
        //     const riskCardData: RiskCardModel = {
        //         ...attribution,
        //         "rule_id": attrKey,
        //         accessPath: bpiPathKey
        //     }
        //     riskData.riskPanelData.push(riskCardData);
        // });

        //});
    }

    return riskData;
};
