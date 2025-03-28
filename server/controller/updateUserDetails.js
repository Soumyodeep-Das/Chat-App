const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require('../models/UserModel'); 

async function updateUserDetails(request, response) {
    try {
        const token = request.cookies.token || "";
        const user = await getUserDetailsFromToken(token);

        if (!user || !user._id) {
            return response.status(401).json({
                message: "Unauthorized: Invalid or expired token",
                error: true
            });
        }

        const { name, profile_pic } = request.body;

        // Ensure at least one field is provided for update
        if (!name && !profile_pic) {
            return response.status(400).json({
                message: "At least one field (name or profile_pic) is required",
                error: true
            });
        }

        // Update user details and return the new updated document
        const updatedUser = await UserModel.findByIdAndUpdate(
            user._id, 
            { $set: { name, profile_pic } }, 
            { new: true, select: "-password" } // Return the updated user and exclude password
        );

        return response.status(200).json({
            message: "User details updated successfully",
            data: updatedUser,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message: error.message || "Internal Server Error",
            error: true
        });
    }
}

module.exports = updateUserDetails;
