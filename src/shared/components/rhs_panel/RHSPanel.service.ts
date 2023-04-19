// import { BodyDetail, ProgresBar, RHSModel, SeverityType, ViewDetail } from '../../models/RHSModel';
// import { INSIGHTTAB, SEVERITY_CATEGORIES } from '../../utils/Constants';

// export const perpareRHSPanel = (data: any, isShowCount = true): RHSModel[] => {
//     const categoryKeys = _.keyBy(data, 'category');
//     const severityKeys = _.keyBy(data, 'severity');
//     const severityByNameKeys = _.keyBy(data, 'severityName');
//     const severityKeyData: any = {};

//     //if (isShowCount) {
//     delete severityKeys['Zero'];
//     //}
//     Object.keys(severityKeys)
//         .sort()
//         .map((key: any) => {
//             severityKeyData[key] = data.filter((d: any) => d.severity === key);
//         });

//     const categoryKeysData: any = {};
//     Object.keys(categoryKeys).map((key: any) => {
//         categoryKeysData[key] = data.filter((d: any) => d.category === key);
//     });

//     const progressBarData: ProgresBar[] = [];
//     Object.keys(severityKeys)
//         .sort()
//         .map((key: any) => {
//             progressBarData.push({ severity: key, value: severityKeyData[key].length });
//         });
//     const viewDetailsData: ViewDetail[] = [];
//     const bodyDetailsData: BodyDetail[] = [];
//     Object.keys(SEVERITY_CATEGORIES).map((key: any, index: number) => {
//         viewDetailsData.push({ id: index, name: key });
//     });
//     Object.keys(severityByNameKeys).map((key: any) => {
//         const severityDetails = data.filter((d: any) => d.severityName === key);
//         Object.keys(severityKeys)
//             .sort()
//             .map((severityKey: string) => {
//                 const categoryKeysData = severityDetails.filter((detail: any) => detail.severity === severityKey);
//                 bodyDetailsData.push({
//                     title: key,
//                     severity: severityKey ? (severityKey as SeverityType) : SeverityType.HIGH,
//                     count: isShowCount ? categoryKeysData.length : '',
//                     category: categoryKeysData[0]?.category,
//                     showCount: false,
//                 });
//             });
//     });
//     return [
//         {
//             tabName: INSIGHTTAB,
//             progresBar: progressBarData,
//             bodyDetails: bodyDetailsData,
//             viewDetails: viewDetailsData,
//         },
//     ];
// };

// export const perpareRHSAccordionPanel = (data: any, showCount = true): RHSModel[] => {
//     const bodyDetailsData: BodyDetail[] = [];
//     Object.keys(SEVERITY_CATEGORIES).map((key: any) => {
//         const categoryKeysData = data.filter(
//             (detail: any) => detail.category === key && detail.severity !== SeverityType.ZERO,
//         );
//         const severityData = categoryKeysData.reduce((items: any, item: any) => {
//             const data = items[item['severityName']] || [];
//             items[item['severityName']] = [...data, item];
//             return items;
//         }, {});
//         bodyDetailsData.push({
//             title: key,
//             count: categoryKeysData.length,
//             body: severityData,
//             showCount,
//         });
//     });
//     return [
//         {
//             tabName: INSIGHTTAB,
//             bodyDetails: bodyDetailsData,
//         },
//     ];
// };
export {};
