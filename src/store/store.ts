import { rightSidebarState } from './reducers/RightSidebarState';
import { leftSidebarState } from './reducers/LeftSidebarState';
import { graphReducer } from './reducers/GraphReducer';
import { authReducer } from './reducers/AuthReducer';
import { cloudAccounReducer } from './reducers/CloudAccountReducer';
import { combineReducers, createStore } from 'redux';
import {
    AuthState,
    BPIState,
    BreadcrumbState,
    CloudAccountState,
    RHSPanelState,
    RiskState,
    SideBarState,
    TabsState,
    ToastState,
} from 'shared/models/ReduxModels/ReducerModels';
import { GraphState } from 'shared/models/GraphModels';
import { tabsStateReducer } from './reducers/TabsReducer';
import { breadcrumStateReducer } from './reducers/breadcrumStateReducer';
import { toastStateReducer } from './reducers/ToastReducer';
import { bpiStateReducer } from './reducers/BPIReducer';
import { riskStateReducer } from './reducers/RiskStateReducer';
import { identitiesRolesReducer } from './reducers/IdentitiesRolesReducer';
import { composeWithDevTools } from '@redux-devtools/extension';

export interface AppState {
    rightSidebarState: RHSPanelState;
    leftSidebarState: SideBarState;
    graphState: GraphState;
    authState: AuthState;
    cloudAccountState: CloudAccountState;
    tabsState: TabsState;
    breadcrumState: BreadcrumbState;
    toaster: ToastState;
    bpiState: BPIState;
    riskState: RiskState;
    identitiesRoles: any;
}
const rootReducers = combineReducers<AppState>({
    rightSidebarState,
    leftSidebarState,
    graphState: graphReducer,
    authState: authReducer,
    cloudAccountState: cloudAccounReducer,
    tabsState: tabsStateReducer,
    breadcrumState: breadcrumStateReducer,
    toaster: toastStateReducer,
    bpiState: bpiStateReducer,
    riskState: riskStateReducer,
    identitiesRoles: identitiesRolesReducer,
});

const store = createStore(rootReducers, composeWithDevTools());
export default store;
