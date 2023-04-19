import { GraphData, Node } from './../../shared/models/GraphModels';
import {
    SET_GRAPH_ALL_DATA,
    SET_GRAPH_DATA,
    SET_RISK_GRAPH_DATA,
    SET_SELECTED_GRAPH_DATA,
    SHOW_IDENTITIES_DETAILS,
} from './ActionConstants';
import { ShowIdentitiesDetails } from 'shared/models/ReduxModels/ActionModels';

export const setGraphDataAction = (data: GraphData) => {
    return {
        type: SET_GRAPH_DATA,
        data,
    };
};
export const setGraphAllDataAction = (data: {
    allData?: any;
    trevalList?: any;
    selectedList?: any;
    parent?: any;
    lastselectedNode?: any;
}) => {
    return {
        type: SET_GRAPH_ALL_DATA,
        data,
    };
};
export const setGraphRiskDataAction = (data: { risk: any }) => {
    return {
        type: SET_RISK_GRAPH_DATA,
        data,
    };
};

export const setGraphSelectedDataAction = (selectedData: Node) => {
    return {
        type: SET_SELECTED_GRAPH_DATA,
        selectedData,
    };
};
export const setGraphSelectedNode = (selectedData: Node) => {
    return {
        type: SET_SELECTED_GRAPH_DATA,
        selectedData,
    };
};

export const showIdentitiesDetailsAction = (
    isShowModal: boolean,
    selectedData: Node | undefined,
): ShowIdentitiesDetails => {
    return {
        type: SHOW_IDENTITIES_DETAILS,
        selectedData,
        isShowModal,
    };
};
