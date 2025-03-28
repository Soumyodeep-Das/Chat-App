const mongoose = require('mongoose');

// Define the schema for the User collection
const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name'] // Name is required
    },
    email: {
        type: String,
        required: [true, 'Please provide an email'], // Email is required
        unique: true // Ensures email is unique
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'] // Password is required
    },
    profile_pic: {
        type: String,
        default: " " // Default profile picture if none is provided
    }
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// Create the User model from the schema
const UserModel = mongoose.model('User', UserSchema);

// Export the model for use in other parts of the application
module.exports = UserModel;
