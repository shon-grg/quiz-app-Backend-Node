const jwt = require("jsonwebtoken");
const User = require("../models/userSchema");
const catchAsync = require("../utility/catchAsync");

// create Token
const signToken = (id) => {
  return jwt.sign({ id: id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// signup
exports.signup = catchAsync(async (req, res, next) => {
  const newUser = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });
  const existingUser = await User.findOne({ email });

  if (existingUser === newUser) {
    return res.status(409).send({ error: "Email already in use" });
  }

  const token = signToken(newUser._id);

  res.status(201).json({
    status: "success",
    token,
    data: {
      user: newUser,
    },
  });
});

// login with token
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //1)check if email and password exist
  if (!email || !password) {
    return console.log("please provide email and password");
  }

  // 2)check if user exists& password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return console.log("incorrect email or password");
  }

  // 3)send to token
  const token = signToken(user._id);
  res.status(200).json({
    status: "success",
    token,
  });
});
