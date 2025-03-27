const UserModel = require('../models/UserModel'); 
const bcrypt = require('bcryptjs');

async function registerUser(request, response) {
    try {
        const { name, email, password, profile_pic } = request.body;
        const checkEmail = await UserModel
            .findOne({ email: email }); // check if email already exists
        if (checkEmail) {
            return response.status(400).json({
                message: 'User already exists',
                error: true
            });
        }

        //password encryption into hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const payLoad = {
            name,
            email,
            profile_pic,
            password: hashedPassword
        };
        const user = new UserModel(payLoad);
        const userSave = await user.save();

        return response.status(201).json({
            message: 'User registered successfully',
            data : userSave,
            success: true
        });

    } catch (error) {
        return response.status(500).json({
            message : error.message || error,
            error : true
        });
    }
}
module.exports = registerUser;