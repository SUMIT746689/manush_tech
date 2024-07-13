const jwt = require("jsonwebtoken");
const jwtConfig = require("../configs/encryption.config");
// const generateToken = jwt.sign(
//     { name: user.username, id: user.id, school_id: user.school_id, role: user.role, admin_panel_id: user.admin_panel_id },
//     process.env.JWT_REFRESH_TOKEN_SECRET,
//     {
//         expiresIn: '1d'
//     }
// );

function generateToken(user) {
    const payload = {
        id: user.id,
        email: user.email,
        role: user.role
    };
    return jwt.sign(payload, jwtConfig.jwtSecretKey, { expiresIn: '1d' });
}

function verifyToken(token) {
    let returnDatas = {};
    jwt.verify(token, jwtConfig.jwtSecretKey, (err, decoded) => {
        if (err) return returnDatas = { isverified: false, decoded: null }
        // req.user = decoded;
        returnDatas = { isverified: true, decoded: decoded }
    });
    return returnDatas;
}

module.exports = {
    generateToken,
    verifyToken
}
