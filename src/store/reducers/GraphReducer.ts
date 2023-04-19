import { GraphState } from 'shared/models/GraphModels';
import { GraphAction } from 'shared/models/ReduxModels/ActionModels';
import {
    SET_GRAPH_DATA,
    SET_RISK_GRAPH_DATA,
    SET_SELECTED_GRAPH_DATA,
    SHOW_IDENTITIES_DETAILS,
    SET_GRAPH_ALL_DATA,
} from '../actions/ActionConstants';

const initialState: GraphState = {
    data: { nodes: [], links: [], risk: [], tabSelected: false },
    riskData: [],
    showIdentitiesDetails: false,
    allData: { data: [], trevalList: [], selectedList: [], parent: [], lastSelectedNode: '' },
    parent: [],
    trevalList: [],
    selectedList: [],
};

export const graphReducer = (state = initialState, action: GraphAction): GraphState => {
    switch (action.type) {
        case SET_GRAPH_DATA:
            return Object.assign(state, { data: action.data, tabSelected: action.data.tabSelected });
        case SET_GRAPH_ALL_DATA:
            return {
                ...state,
                allData: {
                    data: action.data.allData,
                    trevalList: action.data.trevalList,
                    selectedList: action.data.selectedList,
                    parent: action.data.parent,
                },
            };

        case SET_RISK_GRAPH_DATA:
            return Object.assign(state, { data: action.data?.risk });
        // return { ...state, data: action.data?.risk };

        case SET_SELECTED_GRAPH_DATA:
            // const index = state.data.nodes.findIndex((node: any) => node.id === action.selectedData);
            return {
                ...state,

                selectedData: action?.selectedData,
            };
        // if (index >= 0) {
        //     return Object.assign(state, { selectedData: state.data.nodes[index] });
        // } else {
        //     return state;
        // }

        case SHOW_IDENTITIES_DETAILS:
            return {
                ...state,
                showIdentitiesDetails: action.isShowModal,
                selectedData: action?.selectedData,
            };

        default:
            return state;
    }
};
