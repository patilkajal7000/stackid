export const compareMonthsData = (totalData: { [key: string]: any }, previous: { [key: string]: any }) => {
    // setOldData(props.previousMonth);

    const total = Object.values(totalData);

    const prevData = Object.values(previous);
    const newData = [];

    for (let index = 0; index < total.length; index++) {
        // if (prevData[index] <= currData[index]) {
        const value = total[index] - prevData[index];

        newData.push(value > 0 ? '+' + value : value);
        // }
    }

    return newData;
};
