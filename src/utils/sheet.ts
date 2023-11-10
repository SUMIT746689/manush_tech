export const getSheetHeaders= (data: any) =>{
    // console.log({data})
    const uniqueList = [];
    const headerNames = [];
    const regex = /^[a-zA-Z].*/g;
// const found = paragraph.match(regex);
    for (const property in data) {
        if(!property.match(regex) || uniqueList.includes(property[0])) continue;
        uniqueList.push(property[0]);
        const {v} = data[property];
        headerNames.push(v);
        console.log({property});
      }
      console.log({uniqueList,headerNames});
      return headerNames
}