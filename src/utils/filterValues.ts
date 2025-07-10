export const sumValues = (values: number []) => {
    const reducer = (acc: number, current: number) => acc + current;
    const totalValue = values.reduce(reducer, 0);
    return totalValue;
}


export const filterValuesBelowOnePercent = (data: number[]) => {
    const totalValues = sumValues(data);
    const dataFilted = data.filter((d) => {
        const percent = Math.round((100 * d) / totalValues);
        if (percent >= 1) {
            return true;
        }
        return false;
    });
    return dataFilted
}