const User = require("../models/userSchema");
const catchAsync = require("../utility/catchAsync");

// Get  all Users
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const user = await User.find();

  res.status(201).json({
    status: "success",
    result: user.length,
    data: {
      user,
    },
  });
});
