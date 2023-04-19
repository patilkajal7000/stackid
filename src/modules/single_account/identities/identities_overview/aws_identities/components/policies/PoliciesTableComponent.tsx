import React, { useEffect, useMemo, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { PolicyDetails } from 'shared/models/IdentityAccessModel';
import Pagination from 'shared/components/pagination/Pagination';
import { useNavigate } from 'react-router-dom';
import { CBadge, CTooltip } from '@coreui/react';
import PolicyPopUp from '../Modal/policyPopup';
import CIcon from '@coreui/icons-react';
import { cilList, cilTag, cilPencil, cilNotes, cilLockUnlocked, cilLockLocked } from '@coreui/icons';

type TableComponentProps = {
    data: PolicyDetails[];
    onClickRow: (data: PolicyDetails, e: any) => void;
    isLoading: boolean;
    translate: any;
    currentPageNo: number;
};

const PageSize = 15;

const PoliciesTableComponent = ({ data, onClickRow, isLoading, translate, currentPageNo }: TableComponentProps) => {
    const [currentPage, setCurrentPage] = useState(0);
    const [showAllResource, setShowAllResource] = useState(false);
    const [AllResource, setAllResource] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        if (data && data.length > 0) {
            currentPageNo ? setCurrentPage(currentPageNo) : setCurrentPage(1);
        }
    }, [data]);

    const currentTableData = useMemo(() => {
        const firstPageIndex = (currentPage - 1) * PageSize;
        const lastPageIndex = firstPageIndex + PageSize;
        return data.slice(firstPageIndex, lastPageIndex);
    }, [currentPage, data]);
    const handleShowresource = (event: any, res: any) => {
        event.stopPropagation();
        setAllResource(res);
        setShowAllResource(true);
    };
    return (
        <>
            <table className="table table-borderless table-hover custom-table  font-small shadow-6 mt-4">
                <thead className="border-bottom ">
                    <tr>
                        <th className="w-25 first-col"> {translate('policy_name')}</th>
                        <th className="w-10">{translate('risk_score')}</th>
                        <th className="w-10"> {translate('policy_type')}</th>
                        <CTooltip content="An identity is a unique name with which we can identify a human or a thing in a given system." placement='top'><th className="w-15">{translate('identities')}</th></CTooltip>
                        <th className="w-15"> {translate('resource_type')}</th>
                        <th className="w-25 "> {translate('permission_type')}</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan={6} className="p-0">
                                <Skeleton count={6} height={48} />
                            </td>
                        </tr>
                    ) : (
                        <>
                            {currentTableData.length > 0 &&
                                currentTableData?.map((item: PolicyDetails, index: number) => (
                                    <tr
                                        key={index}
                                        onClick={(e) => onClickRow(item, e)}
                                        className="font-small cursor-pointer"
                                    >
                                        <td className="w-30 text-truncate first-col px-2" title={item.name}>
                                            {item.name}
                                        </td>
                                        <td className="px-2">{item.si_risk_score}</td>
                                        <td className="px-2"> {translate(item.type)} </td>
                                        <td className="px-2">
                                            {Object.values(item?.identity_count).map((identity: any, i) => (
                                                <div key={i}>
                                                    {identity?.identity_type}:{identity?.count}
                                                </div>
                                            ))}
                                        </td>
                                        <td className="px-2">
                                            {Object.keys(item?.si_resource_types)
                                                .slice(0, 5)
                                                .map((resource: any, i: number) => (
                                                    <span key={i}>
                                                        <span>{item?.si_resource_types[resource]}</span> <br />{' '}
                                                    </span>
                                                ))}
                                            {Object.values(item?.si_resource_types) &&
                                                Object.values(item?.si_resource_types).length > 5 && (
                                                    <CTooltip trigger="hover" placement="bottom" content="Show more">
                                                        <CBadge
                                                            color="primary"
                                                            shape="rounded-pill"
                                                            className="me-1"
                                                            onClick={(e) => {
                                                                handleShowresource(
                                                                    e,
                                                                    Object.values(item?.si_resource_types),
                                                                );
                                                            }}
                                                        >
                                                            Show all {Object.values(item?.si_resource_types).length}
                                                        </CBadge>
                                                    </CTooltip>
                                                )}
                                        </td>
                                        <>
                                            <td className="px-2">
                                                <div className="d-flex">
                                                    {Object.values(item?.si_permission_types).includes('Tagging') ? (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Tagging Enabled"
                                                            >
                                                                <CIcon icon={cilTag} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    ) : (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Tagging Disabled"
                                                            >
                                                                <CIcon icon={cilTag} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    )}
                                                    {Object.values(item?.si_permission_types).includes('Write') ? (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Write Enabled"
                                                            >
                                                                <CIcon icon={cilPencil} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    ) : (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Write Disabled"
                                                            >
                                                                <CIcon icon={cilPencil} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    )}
                                                    {Object.values(item?.si_permission_types).includes('Read') ? (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Read Enabled"
                                                            >
                                                                <CIcon icon={cilNotes} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    ) : (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Read Disabled"
                                                            >
                                                                <CIcon icon={cilNotes} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    )}
                                                    {Object.values(item?.si_permission_types).includes('List') ? (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="List Enabled"
                                                            >
                                                                <CIcon icon={cilList} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    ) : (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="List Disabled"
                                                            >
                                                                <CIcon icon={cilList} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    )}
                                                    {Object.values(item?.si_permission_types).includes(
                                                        'Permissions management',
                                                    ) ? (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Permissions Management Enabled"
                                                            >
                                                                <CIcon icon={cilLockLocked} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    ) : (
                                                        <span className="mx-1 m-1 d-inline d-flex flex-row align-items-center justify-content-center icon-bg-circle icon-disabled td-cir">
                                                            <CTooltip
                                                                trigger="hover"
                                                                placement="bottom"
                                                                content="Permissions Management Disabled"
                                                            >
                                                                <CIcon icon={cilLockUnlocked} size="lg" />
                                                            </CTooltip>
                                                        </span>
                                                    )}
                                                </div>
                                            </td>
                                        </>
                                    </tr>
                                ))}
                            {currentTableData.length == 0 && (
                                <tr className="text-center">
                                    <td colSpan={5}>{translate('no_records_available')} </td>
                                </tr>
                            )}
                        </>
                    )}
                </tbody>
            </table>
            <Pagination
                className="pagination-bar justify-content-end"
                currentPage={currentPage}
                totalCount={data.length}
                pageSize={PageSize}
                siblingCount={1}
                onPageChange={(page: number) => {
                    setCurrentPage(page);
                    navigate('?pageNo=' + page);
                }}
            />
            {showAllResource && <PolicyPopUp data={AllResource} open={showAllResource} setOpen={setShowAllResource} />}
        </>
    );
};

export default React.memo(PoliciesTableComponent);
