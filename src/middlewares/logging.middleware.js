//some logging of request and resonse could have been done here

const users = require("../services/users.service");

const { verifyToken } = require("../utils/authToken.util");

async function verifyUser(req, res, next) {
    try {
        const authHeader = req.headers["cookie"]; // get the session cookie from request header
        console.log({ authHeader })
        if (!authHeader)
            return res.status(401)
                .json({ message: "User unauthorized. Please login" }); // if there is no cookie from request header, send an unauthorized response.
        const cookie = authHeader.split("=")[1]; // If there is, split the cookie string to get the actual jwt
        console.log({ cookie });
        // Verify using jwt to see if token has been tampered with or if it has expired.
        // that's like checking the integrity of the cookie
        const { isverified, decoded } = verifyToken(cookie);
        console.log({ isverified, decoded })
        if (!isverified)
            return res.status(401)
                .json({ message: "This session has expired. Please login" });

        const { id } = decoded; // get user id from the decoded token
        const user = await users.getSingle({ id }); // find user by that `id`
        // const { password, ...data } = user._doc; // return user object without the password
        req.user = user; // put the data object into req.user
        next();

    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}

async function verifyRole(req, res, next) {
    try {
        const user = req.user; // we have access to the user object from the request
        const { role } = user; // extract the user role
        // check if user has no advance privileges
        // return an unathorized response
        console.log({ role })
        if (role !== "ADMIN") {
            return res.status(401).json({
                status: "failed",
                message: "You are not authorized to view this page.",
            });
        }
        next(); // continue to the next middleware or function
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}

async function verifyBannedUser(req, res, next) {
    try {
        const user = req.user; // we have access to the user object from the request
        const { isBanned } = user; // extract the user role
        // check if user has no advance privileges
        // return an unathorized response
        if (isBanned) {
            return res.status(401).json({
                status: "failed",
                message: "You are banned",
            });
        }
        next(); // continue to the next middleware or function
    } catch (err) {
        res.status(500).json({
            status: "error",
            code: 500,
            data: [],
            message: "Internal Server Error",
        });
    }
}

// export async function Logout(req, res) {
//     try {
//       const authHeader = req.headers['cookie']; // get the session cookie from request header
//       if (!authHeader) return res.sendStatus(204); // No content
//       const cookie = authHeader.split('=')[1]; // If there is, split the cookie string to get the actual jwt token
//       const accessToken = cookie.split(';')[0];
//       const checkIfBlacklisted = await Blacklist.findOne({ token: accessToken }); // Check if that token is blacklisted
//       // if true, send a no content response.
//       if (checkIfBlacklisted) return res.sendStatus(204);
//       // otherwise blacklist token
//       const newBlacklist = new Blacklist({
//         token: accessToken,
//       });
//       await newBlacklist.save();
//       // Also clear request cookie on client
//       res.setHeader('Clear-Site-Data', '"cookies"');
//       res.status(200).json({ message: 'You are logged out!' });
//     } catch (err) {
//       res.status(500).json({
//         status: 'error',
//         message: 'Internal Server Error',
//       });
//     }
//     res.end();
//   }

module.exports = {
    verifyUser,
    verifyRole,
    verifyBannedUser,
}