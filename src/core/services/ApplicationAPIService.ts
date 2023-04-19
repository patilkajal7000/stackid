import { useQuery } from '@tanstack/react-query';
import { GET_APPLICATION_URL } from '../../shared/utils/Constants';
import { http_get } from './BaseURLAxios';

const DASHBOARD_BPI = '/bpiadapter/org/';

export const applicationsData = async () => {
    return http_get(GET_APPLICATION_URL);
};

export const BpiTimeLine = async (org: any, cloudAccountId: number, resource_name: string) => {
    return http_get(DASHBOARD_BPI + org + '/account/' + cloudAccountId + '/resource' + '/' + resource_name + '/bpi');
};

export function dashboardBpi(orgId: string, accountId: number) {
    return useQuery({
        queryKey: [`dashboardBpi`, orgId, accountId],
        queryFn: async () => {
            const data: any = await http_get(`/bpiadapter/org/${orgId}/account/${accountId}/top-resource-bpi?size=5`);
            return data;
        },
        onError: (error) => {
            console.log('Dashboard BPI API Error: ', error);
        },
    });
}
