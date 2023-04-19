export interface AuthModel {
    user: User;
    accessToken: string;
    refreshToken: string;
    status: string;
}
export interface User {
    id: number;
    name: string;
    email: string;
    org: Org;
    last_login: string;
    oidc_user: boolean;
    status_text: string;
    roles: string[];
    responsibilities: Array<string> | null;
}

export interface Org {
    organisation_id: string;
    name: string;
    sub_plan: string;
    sandbox: boolean;
}
