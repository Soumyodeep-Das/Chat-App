const UserModel = require("../models/UserModel");

async function searchUser(request, response) {
  try {
    const { search } = request.body;

    // Creating a case-insensitive regex query
    const query = new RegExp(search, "i", "g");
    // Using $or to search for name or email

    // Using the correct MongoDB $or operator
    const users = await UserModel.find({
      $or: [{ name: query }, { email: query }],
    }).select("-password ");

    return response.json({
      message: "All users",
      data: users,
      success: true,
    });
  } catch (error) {
    return response.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}

module.exports = searchUser;
