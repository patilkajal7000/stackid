import type { Action } from 'redux';
import { ToastVariant } from 'shared/utils/Constants';
import {
    REMOVE_SELECTED_RHS_DATA,
    SET_LEFT_SIDEBAR,
    SET_RHS_JSON_DATA,
    SET_RIGHT_SIDEBAR,
    SET_SELECTED_BUCKET,
    SET_SELECTED_RHS_DATA,
    SHOW_HIDE_RHSPANEL,
    SET_TOKEN,
    REMOVE_TOKEN,
    SET_CLOUD_ACCOUNTS,
    SET_SELECTED_CLOUD_ACCOUNT,
    CLEAR_CLOUD_ACCOUNTS,
    SET_SCREEN_NAME,
    SET_BREADCRUMB_DATA,
    SET_TOAST_MESSAGE,
    UPDATE_DISCOVERY_CLOUD_ACCOUNTS,
    UPDATE_TOKEN,
    UPDATE_USER,
    SET_BPI_DETAILS,
    SET_GRAPH_DATA,
    SET_SELECTED_GRAPH_DATA,
    SHOW_IDENTITIES_DETAILS,
    SET_SELECTED_RISK,
    SET_RISK_GRAPH_DATA,
    SET_GRAPH_ALL_DATA,
    SET_IDENTITIES_ROLES,
} from 'store/actions/ActionConstants';
import { User } from '../AuthModel';
import { BPIModel } from '../BPIModel';
import { SIBreadcrumbItem } from '../BreadcrumModel';
import { CloudAccountModel } from '../CloudAccountModel';
import { DiscoveryStatusModel } from '../DiscoveryStatusModel';
import { Link, Node } from '../GraphModels';
import { BodyDetail, RHSModel } from '../RHSModel';
import { RiskCardModel } from '../RiskModel';

export interface LHSOpenCloseAction extends Action {
    type: typeof SET_LEFT_SIDEBAR;
    sidebarShow: true | false | 'responsive';
}

export interface RHSPanelOpenCloseAction extends Action {
    type: typeof SET_RIGHT_SIDEBAR;
    sidebarShow: true | false | 'responsive';
}

export interface SidebarDataAction extends Action {
    type: typeof SET_RHS_JSON_DATA;
    sidebarJSON: RHSModel;
}

export interface SidebarSelectedDataAction extends Action {
    type: typeof SET_SELECTED_RHS_DATA;
    selectedCard: BodyDetail[];
}

export interface RemoveSidebarSelectedDataAction extends Action {
    type: typeof REMOVE_SELECTED_RHS_DATA;
}

export interface ShowSidebarSelectedToggleAction extends Action {
    type: typeof SHOW_HIDE_RHSPANEL;
    showPanelToggler: boolean;
}

export interface SelectedBucketDetailsAction extends Action {
    type: typeof SET_SELECTED_BUCKET;
    selectedBucket: any;
}

export type SidebarActions =
    | RHSPanelOpenCloseAction
    | SidebarDataAction
    | SidebarSelectedDataAction
    | RemoveSidebarSelectedDataAction
    | ShowSidebarSelectedToggleAction
    | SelectedBucketDetailsAction;

export interface GraphDataAction extends Action {
    type: typeof SET_GRAPH_DATA;
    data: { nodes: Node[]; links: Link[]; tabSelected: boolean };
}
export interface GraphAllDataAction extends Action {
    type: typeof SET_GRAPH_ALL_DATA;
    data: {
        selectedList: any;
        allData: [];
        parent: [];
        trevalList: [];
    };
    trevalList: [];
}
export interface GraphRiskDataAction extends Action {
    data: any;
    type: typeof SET_RISK_GRAPH_DATA;
    riskData: [];
}
export interface GraphSelectedDataAction extends Action {
    type: typeof SET_SELECTED_GRAPH_DATA;
    selectedData: Node;
}

export interface ShowIdentitiesDetails extends Action {
    type: typeof SHOW_IDENTITIES_DETAILS;
    selectedData?: Node;
    isShowModal: boolean;
}

export type GraphAction =
    | GraphDataAction
    | GraphAllDataAction
    | GraphRiskDataAction
    | GraphSelectedDataAction
    | ShowIdentitiesDetails;

export interface AuthAction extends Action {
    type: typeof SET_TOKEN;
    accessToken: string;
    refreshToken: string;
    user: User;
}

export interface AuthRemoveAction extends Action {
    type: typeof REMOVE_TOKEN;
}

export interface AuthUpdateTokenAction extends Action {
    type: typeof UPDATE_TOKEN;
    accessToken: string;
    refreshToken: string;
}
export interface AuthUpdateUserAction extends Action {
    type: typeof UPDATE_USER;
    user: User;
}
export type AuthActions = AuthAction | AuthRemoveAction | AuthUpdateTokenAction | AuthUpdateUserAction;

export interface AddCloudAccountsAction extends Action {
    type: typeof SET_CLOUD_ACCOUNTS;
    cloudAccounts: CloudAccountModel[];
}

export interface SelectedCloudClountAction extends Action {
    type: typeof SET_SELECTED_CLOUD_ACCOUNT;
    selectedCloudAccountId: string;
}

export interface ClearCloudAccounts extends Action {
    type: typeof CLEAR_CLOUD_ACCOUNTS;
}

export interface UpdateDiscoveryCloudAccounts extends Action {
    type: typeof UPDATE_DISCOVERY_CLOUD_ACCOUNTS;
    discoveryStatus: DiscoveryStatusModel[];
}

export type CloudAccountActions =
    | AddCloudAccountsAction
    | SelectedCloudClountAction
    | ClearCloudAccounts
    | UpdateDiscoveryCloudAccounts;

export interface SetTabScreenName extends Action {
    type: typeof SET_SCREEN_NAME;
    screenName: string;
    activeTab: string;
    parentTab: string;
}

export type SetTabScreenAction = SetTabScreenName;

export interface SetBreadcrumbData extends Action {
    type: typeof SET_BREADCRUMB_DATA;
    breadcrumbData: SIBreadcrumbItem[] | [];
}

export type SetBreadcrumbAction = SetBreadcrumbData;

export interface SetToastMessage extends Action {
    type: typeof SET_TOAST_MESSAGE;
    variant: ToastVariant;
    message: string;
}

export type SetToastMessageAction = SetToastMessage;

export interface SetBPIDetails extends Action {
    type: typeof SET_BPI_DETAILS;
    bpiDetails: BPIModel;
}

export type SetBPIDetailsAction = SetBPIDetails;

export interface SetSelectedRisk extends Action {
    type: typeof SET_SELECTED_RISK;
    selectedRisk: RiskCardModel | null;
}
export type SetSelectedRiskAction = SetSelectedRisk;

export interface SetIdentitiesRolesData extends Action {
    type: typeof SET_IDENTITIES_ROLES;
    data: any | null;
}
