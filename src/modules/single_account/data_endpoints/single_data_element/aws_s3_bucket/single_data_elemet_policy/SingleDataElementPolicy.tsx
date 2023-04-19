import { getRules } from 'core/services/DataEndpointsAPIService';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ReactJson from 'react-json-view';
import { ResourceType } from 'shared/utils/Constants';
import CIcon from '@coreui/icons-react';
import { cilArrowThickBottom } from '@coreui/icons';
import { CImage, CTooltip } from '@coreui/react';

type SingleDataElementPolicyProps = {
    resourceId: string;
    cloudAccountId: any;
    type: typeof ResourceType;
};
const SingleDataElementPolicy = (props: SingleDataElementPolicyProps) => {
    const { t } = useTranslation();
    const [rules, setRules] = useState<any>();
    useEffect(() => {
        getRules(props.cloudAccountId, props.resourceId, props.type).then((res: any) => setRules(res));
    }, []);

    return (
        <div className="container-fluid mt-3">
            <table className="container custom-table table table-borderless table-hover shadow-6">
                <thead className="font-medium">
                    <tr className="border-bottom">
                        <th className="w-40" title={t('failed_rule') + ''}>
                            {t('failed_rule')}
                        </th>
                        <th className="w-20" title={t('policy') + ''}>
                            {t('policy')}
                        </th>
                        <th className="w-20" title={t('reasoning') + ''}>
                            {t('reasoning')}
                        </th>
                        <th className="w-20" title={t('action') + ''}>
                            {t('action')}
                        </th>
                    </tr>
                </thead>
                <tbody className="font-small">
                    {rules &&
                        rules?.aws_cis_benchmark &&
                        rules.aws_cis_benchmark?.ruleset.map((rule: any, index: number) => (
                            <tr className="border-bottom" key={index}>
                                <td>{rules.aws_cis_benchmark?.ruleoutputs?.[rule]?.rule_id}</td>
                                <td>AWS CIS Benchmark</td>
                                <td>
                                    <ReactJson src={rules.aws_cis_benchmark?.ruleoutputs?.[rule]?.reason} />
                                </td>
                                <td>
                                    <div className="d-flex">
                                        <div
                                            className="d-flex icon-sm-circle justify-content-center align-items-center"
                                            title="Policy as code"
                                        >
                                            <CIcon icon={cilArrowThickBottom} />
                                        </div>
                                        <div className="ms-3">
                                            <CTooltip trigger="hover" placement="bottom" content="Slack">
                                                <CImage src={require('assets/images/slack.svg')} />
                                            </CTooltip>
                                        </div>
                                        <div className="mx-1">
                                            <CTooltip trigger="hover" placement="bottom" content="Jira">
                                                <CImage src={require('assets/images/jira.svg')} />
                                            </CTooltip>
                                        </div>
                                        <div className="mx-1">
                                            <CTooltip trigger="hover" placement="bottom" content="PagerDuty">
                                                <CImage src={require('assets/images/pagerduty.svg')} />
                                            </CTooltip>
                                        </div>
                                    </div>
                                </td>
                            </tr>
                        ))}
                </tbody>
            </table>
            <div className="d-flex justify-content-between container mt-5">
                <div className="d-flex flex-column">
                    <div className="h4">3 Security best practice policies</div>
                    <div>ACM configured with unused certificates </div>
                    <div>ACM configured with unused certificates </div>
                    <div>ACM configured with unused certificates </div>
                </div>
                <div className="d-flex flex-column">
                    <div className="h4">3 Compliance policies</div>
                    <div>PCI DSS compliance </div>
                    <div>PCI DSS compliance </div>
                    <div>PCI DSS compliance </div>
                </div>
                <div></div>
            </div>
        </div>
    );
};

export default SingleDataElementPolicy;
