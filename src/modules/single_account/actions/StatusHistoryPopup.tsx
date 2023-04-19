import React from 'react';
import { CModal, CModalBody, CModalHeader, CModalTitle } from '@coreui/react';
import dayjs from 'dayjs';
import Skeleton from 'react-loading-skeleton';
import { t } from 'i18next';
import { useQuery } from '@tanstack/react-query';
import { riskIdAPI } from 'core/services/userManagementAPIService';
type HistoryPopoverProps = {
    show: boolean;
    handleClose: any;
    singleID: any;
    isLoading?: boolean;
    orgId?: any;
};
const StatusHistoryPopup = ({ show, handleClose, singleID, orgId }: HistoryPopoverProps) => {
    const assignDate = (assignDate: any) => {
        return dayjs(assignDate).format('DD MMM YYYY | hh:mm a');
    };

    const { isLoading, data: historyData } = useQuery<any>({
        queryKey: [`historyAPI`, orgId, singleID],
        queryFn: async () => {
            return riskIdAPI(orgId, singleID);
        },

        onError: (error) => {
            console.log('Risk history API Error: ', error);
        },
    });
    return (
        <>
            <CModal size="xl" visible={show} onClose={handleClose}>
                <CModalHeader closeButton>
                    <CModalTitle className="h1">History</CModalTitle>
                </CModalHeader>
                <CModalBody>
                    <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                        <thead className="border-bottom font-small-semibold">
                            <tr>
                                <th className="no-pointer px-3">Status</th>
                                <th className="no-pointer px-3">Assigned to</th>
                                <th className="no-pointer px-3">Link</th>
                                <th className="no-pointer px-3">Date</th>
                                <th className="no-pointer px-3">Note</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading && (
                                <tr>
                                    <td colSpan={5}>
                                        <Skeleton count={5} height={48} />
                                    </td>
                                </tr>
                            )}
                            {historyData &&
                                historyData?.length > 0 &&
                                historyData?.map((item: any, ind: number) => {
                                    return (
                                        <tr key={ind}>
                                            <td className="no-pointer px-3">{item?.state}</td>
                                            <td className="no-pointer px-3">{item?.assigned_to}</td>
                                            <td className="no-pointer px-3">{item?.link}</td>
                                            <td className="no-pointer px-3">{assignDate(item?.si_time)}</td>
                                            <td className="no-pointer px-3">{item?.notes}</td>
                                        </tr>
                                    );
                                })}
                            {historyData && historyData?.length === 0 && (
                                <tr>
                                    <td align="center" colSpan={5}>
                                        {t('no_records_available')}
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </CModalBody>
            </CModal>
        </>
    );
};

export default StatusHistoryPopup;
