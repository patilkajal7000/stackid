import React, { useCallback, useEffect, useState } from 'react';
import { CCard, CCardBody, CContainer } from '@coreui/react';
import SearchInput from 'shared/components/search_input/SearchInput';
import RiskCard from '../risk_card/RiskCard';
import { RiskCardModel } from 'shared/models/RiskModel';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedRiskAction } from 'store/actions/RiskActions';
import { AppState } from 'store/store';
import { MIN_SEARCH_LENGTH } from 'shared/utils/Constants';
import { setGraphDataAction } from 'store/actions/GraphActions';
import ActionPopup from './ActionPopup';

type RiskPanelProps = {
    riskData: any;
    risks: RiskCardModel[];
    identityRisk?: any;
    statementData?: any;
    nodeType?: any;
    data?: any;
    subType?: any;
};

const RiskPanel = (props: RiskPanelProps) => {
    const { t } = useTranslation();
    const [, setRiskDisplayList] = useState<RiskCardModel[]>([]);
    const [riskByTagList, setRiskByTagList] = useState<any>([]);

    const [actionPopupData, setActionPopupData] = useState<any>([]);

    const [actionPopup, setActionPopup] = useState<boolean>(false);
    const dispatch = useDispatch();
    const riskState = useSelector((state: AppState) => state.riskState);
    const graphState = useSelector((state: AppState) => state.graphState.data);
    const { identityRisk, statementData, data } = props;
    const [statetments, setStatements] = useState<any>(statementData);
    console.log('KKKKKKK', statetments);
    useEffect(() => {
        if (data?.length > 0) {
            setStatements(data.flat());
        } else {
            setStatements(statementData);
        }
    }, [data, statementData]);

    useEffect(() => {
        setRiskDisplayList(props.risks);

        setRiskByTagList(graphState);
    }, [props.risks]);

    const onSearchRisk = useCallback(
        (searchString: string, callback?: (message: string) => void) => {
            if (searchString.length >= MIN_SEARCH_LENGTH) {
                const selectedRisks = props.risks?.filter((data: RiskCardModel) =>
                    Object.keys(data).some(() => data.rule_name.toLowerCase().includes(searchString.toLowerCase())),
                );
                if (selectedRisks && selectedRisks.length > 0) {
                    setRiskDisplayList(selectedRisks);
                    setRiskByTagList(selectedRisks);
                    callback && callback('');
                } else {
                    setRiskDisplayList([]);
                    setRiskByTagList([]);
                    callback && callback('No Items found');
                }
            } else {
                setRiskByTagList(graphState);
                setRiskDisplayList(props.risks);
            }
        },
        [props.risks],
    );

    const onCardClick = (selectedRisk: RiskCardModel) => {
        dispatch(
            setGraphDataAction({
                tabSelected: true,
                nodes: [],
                links: [],
                risk: props.risks,
            }),
        );
        dispatch(setSelectedRiskAction(selectedRisk));
    };
    const handleActionpopup = (event: any, action: any) => {
        event.stopPropagation();
        action?.length > 0 && setActionPopup(true);
        setActionPopupData(action);
    };

    return (
        <CContainer>
            {statementData?.length > 0 || (data?.length > 0 && props.subType == 'Policy') ? (
                <>
                    {' '}
                    <div className="h3 my-3">
                        {t('risky_statements')} ({statetments?.length | 0})
                    </div>
                    <div className="overflow-auto">
                        <table className="table table-borderless table-hover custom-table shadow-6 mt-3 overflow-auto">
                            <thead className="border-bottom font-small-semibold">
                                <tr>
                                    <th className="no-pointer px-2 w-30">Risks</th>
                                    <th className="no-pointer px-2 w-30">Policy Id</th>
                                    <th className="no-pointer px-2 w-30">Policy Name</th>
                                    <th className="no-pointer px-2 w-30">Policy Arn</th>
                                    <th className="no-pointer px-2 w-30">Action</th>
                                    <th className="no-pointer px-2 w-50">Not Action</th>
                                    <th className="no-pointer px-2 w-30">Principal</th>
                                    <th className="no-pointer px-2 w-30">Not Principal</th>
                                    <th className="no-pointer px-2 w-30">Resource</th>
                                    <th className="no-pointer px-2 w-30">Not Resource</th>
                                    <th className="no-pointer px-2 w-30">Effect</th>
                                    <th className="no-pointer px-2 w-30">Condition</th>
                                </tr>
                            </thead>
                            <tbody>
                                {statetments &&
                                    statetments?.map((statements: any, i: number) => {
                                        // const action = statements?.action && JSON.parse(statements?.action);
                                        return (
                                            <tr key={i}>
                                                <td className="no-pointer px-2">{statements?.si_risk}</td>
                                                <td className="no-pointer px-2">{statements?.policy_id}</td>
                                                <td className="no-pointer px-2">{statements?.policy_name}</td>
                                                <td className="no-pointer px-2">{statements?.policy_arn}</td>
                                                <td
                                                    className="pointer px-2 text-nowrap"
                                                    role="presentation"
                                                    onClick={(e) => handleActionpopup(e, statements?.action)}
                                                >
                                                    {statements?.action?.length
                                                        ? `(${statements?.action?.length}) ${statements?.action[0]}`
                                                        : statements?.action || statements?.Action}
                                                </td>
                                                <td className="no-pointer px-2">
                                                    {statements?.not_action && JSON.stringify(statements?.not_action)}
                                                </td>
                                                <td className="no-pointer px-2">
                                                    {statements?.principal ? null : 'N/A'}
                                                </td>
                                                <td className="no-pointer px-2">
                                                    {statements?.not_principal &&
                                                        JSON.stringify(statements?.not_principal)}
                                                </td>
                                                <td className="no-pointer px-2">
                                                    {statements?.resource || statements?.Resource}
                                                </td>
                                                <td className="no-pointer px-2">
                                                    {statements?.not_resource &&
                                                        JSON.stringify(statements?.not_resource)}
                                                </td>
                                                <td className="no-pointer px-2">
                                                    {statements?.effect || statements?.Effect}
                                                </td>
                                                <td className="no-pointer px-2">
                                                    {statements?.condition ? null : 'N/A'}
                                                </td>
                                            </tr>
                                        );
                                    })}
                            </tbody>
                        </table>
                    </div>
                </>
            ) : identityRisk?.length > 0 && props.nodeType == 'identity' ? (
                <>
                    {' '}
                    <div className="h3 my-3">
                        {t('risks')} ({identityRisk.length | 0})
                    </div>
                    <div className="my-3">
                        {identityRisk?.length == 0 ? (
                            <div> {t('no_risk_found')} </div>
                        ) : Array.isArray(identityRisk) ? (
                            identityRisk?.map((risk: any, index: number) => (
                                <React.Fragment key={index}>
                                    <CCard className={`custom-card risk-card pointer mb-3`}>
                                        <CCardBody className="card-body-details pt-1 pb-1">
                                            <div className="font-medium"> {risk}</div>
                                        </CCardBody>
                                    </CCard>
                                </React.Fragment>
                            ))
                        ) : null}
                    </div>{' '}
                </>
            ) : statementData?.length == 0 ? (
                <>
                    <div className="h3 my-3">
                        {t('risky_statements')} ({statetments.length | 0})
                    </div>
                </>
            ) : (
                <>
                    <div className="h2 my-3">{/* {t('risks')} ({riskByTagList.length}) */}</div>
                    <SearchInput onSearch={onSearchRisk} customClass={'w-100'} placeholder="Search" />
                    <div className="my-3">
                        {riskByTagList?.length == 0 ? (
                            <div> {t('no_risk_found')} </div>
                        ) : Array.isArray(riskByTagList) ? (
                            riskByTagList?.map((risk: RiskCardModel, index: number) => (
                                <React.Fragment key={index}>
                                    <RiskCard
                                        color={''}
                                        risk={risk}
                                        onCardClick={onCardClick}
                                        className={`${
                                            riskState.selectedRisk?.rule_id == risk.rule_id ? 'selected' : ''
                                        }`}
                                    ></RiskCard>
                                </React.Fragment>
                            ))
                        ) : null}
                    </div>{' '}
                </>
            )}

            {actionPopup && (
                <ActionPopup
                    actionPopupData={actionPopupData}
                    translte={t}
                    open={actionPopup}
                    setOpen={setActionPopup}
                />
            )}
        </CContainer>
    );
};

export default RiskPanel;
