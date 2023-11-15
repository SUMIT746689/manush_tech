export const getSheetHeaders = (data: any) => {
    // console.log({data})
    const uniqueList = [];
    const headerNames = [];
    const regex = /^[a-zA-Z].*/g;
    // const found = paragraph.match(regex);
    for (const property in data) {
        if (!property.match(regex) || uniqueList.includes(property[0])) continue;
        uniqueList.push(property[0]);
        const { v } = data[property];
        headerNames.push(v);
        console.log({ property });
    }
    console.log({ uniqueList, headerNames });
    return headerNames;
}

export const getSheetBodies = (data: any) => {
    try {
        // console.log({data})
        const uniqueList = [];
        const bodyNames = {};
        const regex = /^[a-zA-Z].*/g;
        // const found = paragraph.match(regex);
        for (const property in data) {
            console.log(property, data[property]);
            // if(!property.match(regex) || uniqueList.includes(property[0])) continue;
            // uniqueList.push(property[0]);

            if (!property.match(regex)) continue;

            const { v } = data[property];
            const value = property[0];
            // console.log({ v, value });
            if (uniqueList.includes(property[0])) {
                bodyNames[value].push(v)
                continue;
            };
            uniqueList.push(property[0]);
            // const { v } = data[property];
            bodyNames[property[0]] = [v];
        }
        // console.log({ uniqueList, bodyNames });
        return bodyNames
    }
    catch (err_) {
        console.log({ err_ })
    }
}