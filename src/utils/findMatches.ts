export const findMatches = (inputString) => {
    let pattern = /#(.*?)#/g;
    let matches = [];
    let match;

    while ((match = pattern.exec(inputString)) !== null) {
        console.log(pattern.exec(inputString))
        matches.push(match);
    }

    return matches;
}