import React, { useEffect, useState } from 'react';
import { CloudAccountModel } from 'shared/models/CloudAccountModel';
import GaugeChart from 'react-gauge-chart';
import { getActualSeverityColor } from 'shared/service/Severity.service';
type RiskPostureProps = {
    cloudAccount: CloudAccountModel;
    t: any;
    showChart: boolean;
    top: string;
};
// const COLORS = [{ label: 'red' }, { label: 'red' }];
// const pieData = [
//     {
//         name: 'low',
//         value: 54.85,
//     },
//     {
//         name: 'high',
//         value: 47.91,
//     },
//     {
//         name: 'medium',
//         value: 16.85,
//     },
// ];
// const CustomTooltip = ({ active, payload, label }: TooltipData) => {
//     if (active) {
//         return (
//             <div
//                 className="custom-tooltip"
//                 style={{
//                     backgroundColor: '#ffff',
//                     padding: '5px',
//                     border: '1px solid #cccc',
//                 }}
//             >
//                 <label>{`${payload[0].name} : ${payload[0].value}%`}</label>
//             </div>
//         );
//     }
//     return null;
// };
const RiskPosture = ({ cloudAccount }: RiskPostureProps) => {
    const [currentRiskScore, setCurrentRiskScore] = useState(0);
    // const [postureColor, setPostureColor] = useState('#000');

    // useEffect(() => {
    //     const resourceType = cloudAccount.cloud_provider == 'GCP' ? 'bq_Dataset' : 'aws_S3';
    //     getDataEndpointsSummary(parseInt(cloudAccount.id), resourceType)
    //         .then((res: any) => {
    //             const data = res.resources.sort((a: any, b: any) => {
    //                 if (!a.risk_score) a.risk_score = 0;
    //                 if (!b.risk_score) b.risk_score = 0;
    //                 const risk_score1 = a.risk_score,
    //                     risk_score2 = b.risk_score;
    //                 return risk_score1 > risk_score2 ? -1 : 1;
    //             });
    //             const score = data.filter((data: DataEndpointResorceModel) => {
    //                 const risk_score_percentage = data.risk_score | 0;
    //                 return getSeverityScoreColor(risk_score_percentage) === SeverityType.CRITICAL;
    //             }).length;
    //             setriskScore(score);
    //         })
    //         .catch((e) => console.log('error', e));
    // }, []);

    //Current Risk Posture
    useEffect(() => {
        // if (cloudAccount?.account_risk_score > 90) {
        //     setPostureColor('#ff647c');
        // } else if (cloudAccount?.account_risk_score > 75) {
        //     setPostureColor('#ff9251');
        // } else if (cloudAccount?.account_risk_score > 50) {
        //     setPostureColor('#f2be42');
        // } else {
        //     setPostureColor('#00c48c');
        // }
        setCurrentRiskScore(cloudAccount?.account_risk_score);

        // risk trading color current_risk and last_risk
        // cloudAccount.current_risk_posture > cloudAccount.last_risk_posture
        //     ? setPostureColor('Red')
        //     : setPostureColor('Green');
        // setCurrentRiskScore(cloudAccount.current_risk_posture);
    }, [cloudAccount, setCurrentRiskScore]);

    // risk posture calculation current - last
    // const checkRiskPosture = (cloudAccount: CloudAccountModel) => {
    //     return cloudAccount.current_risk_posture - cloudAccount.last_risk_posture;
    // };

    // const riskPosture = (cloudAccount: CloudAccountModel) => {
    //     return cloudAccount.account_risk_score;
    // };

    return (
        <div className="card-dial" style={{ color: getActualSeverityColor(cloudAccount?.risk_label) }}>
            <GaugeChart
                style={{ height: 20, width: 70, fontSize: 20, marginTop: 10 }}
                nrOfLevels={30}
                colors={['green', 'red']}
                arcWidth={0.3}
                percent={currentRiskScore > 0 ? currentRiskScore / 100 : 0}
                hideText
                needleBaseColor={'#000'}
            />

            <div className="mt-2  text-center font-small-semibold">
                <span style={{ color: getActualSeverityColor(cloudAccount?.risk_label) }} className="">
                    {cloudAccount?.account_risk_score || 0} %
                </span>
            </div>
        </div>
    );
};

export default RiskPosture;

RiskPosture.defaultProps = {
    showChart: true,
};
