import React from 'react';
import { CSidebar } from '@coreui/react';
import RiskPanel from 'modules/single_account/data_endpoints/single_data_element/aws_s3_bucket/components/risk_panel/RiskPanel';
import { useDispatch, useSelector } from 'react-redux';
import { RiskCardModel } from 'shared/models/RiskModel';
import { changeRightSidebarAction } from '../../../store/actions/SidebarAction';
import { AppState } from '../../../store/store';

const RHSPanel = () => {
    const dispatch = useDispatch();
    const rhsState = useSelector((state: AppState) => state.rightSidebarState);
    const risks: RiskCardModel[] = rhsState.sidebarJSON?.risks || [];
    return (
        <CSidebar
            visible={!!rhsState.sidebarShow}
            onVisibleChange={(val: any) => dispatch(changeRightSidebarAction(val))}
            // aside={true}
            className={`sidebar_custom overflow-auto ${rhsState.sidebarShow ? 'open_sidebar' : ''}`}
            size="lg"
        >
            <RiskPanel risks={risks} riskData={undefined}></RiskPanel>
        </CSidebar>
    );
};

export default RHSPanel;
