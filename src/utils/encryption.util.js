const bcrypt = require("bcrypt") 

const handleHashed = async (value) => {
    return await bcrypt.hash(value, 10);
}

const verifyHashed = async (unverifiedValue, orginalValue) => {
    return await bcrypt.compare(unverifiedValue, orginalValue);
}

module.exports = {
    handleHashed,
    verifyHashed
}
