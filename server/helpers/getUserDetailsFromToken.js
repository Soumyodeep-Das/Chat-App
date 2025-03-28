const jwt = require("jsonwebtoken");
const UserModel = require("../models/UserModel"); 

const getUserDetailsFromToken = async (token) => {
    try {
        if (!token) {
            return {
                message: "Session expired. Please log in again.",
                logout: true
            };
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

        const user = await UserModel.findById(decoded.id).select("-password");

        if (!user) {
            return {
                message: "User not found",
                logout: true
            };
        }

        return user;
    } catch (error) {
        return {
            message: "Invalid or expired session. Please log in again.",
            logout: true
        };
    }
};

module.exports = getUserDetailsFromToken;
