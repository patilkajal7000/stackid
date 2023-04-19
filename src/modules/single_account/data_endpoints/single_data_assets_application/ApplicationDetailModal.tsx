import { CModal, CModalContent, CModalHeader } from '@coreui/react';
import React from 'react';
import '../../data_endpoints/data_endpoints_summary/components/ManageTags.scss';
function ApplicationDetailsModal({ show, onHide, data, type, appname, subType }: any) {
    return (
        <CModal alignment="center" visible={show} onClose={() => onHide(false)} size="xl">
            <CModalHeader className="border-0 pt-3 pb-2" closeButton>
                <div className="h4">{appname}</div>
            </CModalHeader>
            <CModalContent className="border-0 overflow-scroll mh-600">
                {subType == 'truncated_node,' ? (
                    <div className="container p-1 ">
                        <>
                            <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                                <thead>
                                    <tr className="header-background">
                                        <th className="px-4 no-pointer">Policy Id</th>
                                        <th className="px-4 no-pointer">Policy Name</th>
                                        <th className="px-3 no-pointer">Resource name</th>

                                        <th className="px-4 no-pointer">Resource Permissions</th>
                                        <th className="px-4 no-pointer">Resource Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.all_nodes?.map((item: any, index: any) => (
                                        <tr key={index}>
                                            <td className="px-4 no-pointer">
                                                {item.resource_type == 'Group'
                                                    ? item.group_id
                                                    : item.resource_type == 'Policy'
                                                    ? item.id
                                                    : item.policy_id}
                                            </td>
                                            <td className="px-4 no-pointer">
                                                {item.resource_type == 'Group'
                                                    ? item.group_name
                                                    : item.resource_type == 'Policy'
                                                    ? item.name
                                                    : item.policy_name}
                                            </td>

                                            <td className="px-4 no-pointer">{item.resource}</td>

                                            <td className="px-4 no-pointer">
                                                {item?.si_permission_types &&
                                                    item?.si_permission_types.map((item1: any, i: any) =>
                                                        item?.si_permission_types?.length - 1 === i
                                                            ? item1 + ''
                                                            : item1 + ',',
                                                    )}
                                            </td>

                                            <td className="px-4 no-pointer">{item.resource_type}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    </div>
                ) : type === 'instance_placeholder' ? (
                    <div className="container p-1 ">
                        <>
                            <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                                <thead>
                                    <tr className="header-background">
                                        <th className="px-3 no-pointer">Instance Id</th>
                                        <th className="px-4 no-pointer">Instance Name</th>
                                        <th className="px-4 no-pointer">VPC ID</th>
                                        <th className="px-4 no-pointer">SUBNET ID</th>
                                        <th className="px-4 no-pointer">Group Name</th>
                                        <th className="px-4 no-pointer">Group Id</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data?.instances.map((item: any, index: any) => (
                                        <tr key={index}>
                                            <td className="px-4 no-pointer">{item.instance_id}</td>
                                            <td className="px-4 no-pointer">{item.name}</td>
                                            <td className="px-4 no-pointer">{item.vpc_id}</td>
                                            <td className="px-4 no-pointer">{item.subnet_id}</td>

                                            <td className="px-4 no-pointer">
                                                {item?.security_groups &&
                                                    item?.security_groups.map((item1: any, i: any) => (
                                                        <p key={i}>{item1.GroupName}</p>
                                                    ))}
                                            </td>
                                            <td className="px-4 no-pointer">
                                                {item?.security_groups &&
                                                    item?.security_groups.map((item1: any, i: any) => (
                                                        <p key={i}>{item1.GroupId}</p>
                                                    ))}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </>
                    </div>
                ) : subType == 'dataAssets' ? (
                    <div className="container p-1 ">
                        <>
                            <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                                <thead>
                                    <tr className="header-background">
                                        <th className="px-3 no-pointer w-40">identity Id</th>
                                        <th className="px-3 no-pointer w-40">identity Name</th>
                                        <th className="px-4 no-pointer w-20">identity Type</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* <div className="manage-tags"> */}
                                    {data?.truncated_nodes[0]?.map((item: any, index: any) => (
                                        <tr key={index}>
                                            <td className="px-4 no-pointer w-50">{item?.data?.identity_id}</td>
                                            <td className="px-4 no-pointer w-50">{item?.name}</td>
                                            <td className="px-4 no-pointer w-20">{item?.resource_type}</td>
                                        </tr>
                                    ))}
                                    {/* </div> */}
                                </tbody>
                            </table>
                        </>
                    </div>
                ) : (
                    <div className="container p-1 ">
                        <>
                            <table className="table table-borderless table-hover custom-table shadow-6 rounded overflow-hidden">
                                <thead>
                                    <tr className="header-background">
                                        <th className="px-3 no-pointer w-40">identity Name</th>
                                        <th className="px-4 no-pointer w-20">identity Type</th>
                                        <th className="px-4 no-pointer w-20">admin permission</th>
                                        {type.includes('indirect') && <th className="px-4 no-pointer">Assume Role</th>}
                                        <th className="px-4 no-pointer w-20">permissions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* <div className="manage-tags"> */}
                                    {data?.identities?.map((item: any, index: any) => (
                                        <tr key={index}>
                                            <td className="px-4 no-pointer w-50">{item.identity_name}</td>
                                            <td className="px-4 no-pointer w-20">{item.identity_type}</td>
                                            <td className="px-4 no-pointer w-20">
                                                {item.is_admin_permission ? 'Yes' : 'No'}
                                            </td>
                                            {type.includes('indirect') && (
                                                <td className="px-4 no-pointer w-20">
                                                    {item?.permissions &&
                                                        Object.keys(item?.permissions).map((item1: any, i: any) =>
                                                            Object.keys(item?.permissions)?.length - 1 === i
                                                                ? item1 + ''
                                                                : item1 + ',',
                                                        )}
                                                </td>
                                            )}
                                            <td className="px-4 no-pointer w-20">
                                                {item?.permissions &&
                                                    Object.values(item?.permissions).map((item1: any, i: any) =>
                                                        Object.values(item?.permissions)?.length - 1 === i
                                                            ? item1 + ''
                                                            : item1 + ',',
                                                    )}
                                            </td>
                                        </tr>
                                    ))}
                                    {/* </div> */}
                                </tbody>
                            </table>
                        </>
                    </div>
                )}
            </CModalContent>
        </CModal>
    );
}

export default ApplicationDetailsModal;
