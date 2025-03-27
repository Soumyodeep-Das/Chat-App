const UserModel = require('../models/UserModel');
// checkEmail function  to check if email already exists
async function checkEmail(request, response) {
    try {
        const { email } = request.body;
        const checkEmail = await UserModel
            .findOne({ email}).select("-password"); // check if email already exists
        if (!checkEmail) {
            return response.status(400).json({
                message: 'User not exists',
                error: true
            });
        }

        return response .status(200).json({
            message: 'Email verify',
            data : checkEmail,
            success: true
        });
    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        });
    } 
}
module.exports = checkEmail;