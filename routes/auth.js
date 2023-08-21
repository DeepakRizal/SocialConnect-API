const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const appError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");
const jwt = require("jsonwebtoken");

const router = express.Router();

const signToken = (id) => {
  return jwt.sign(
    {
      id,
    },
    process.env.API_SECRET,
    {
      expiresIn: process.env.EXPIRES_IN,
    }
  );
};

creatSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);

  // Remove password from output
  // Remove password and passwordConfirm from output
  user.password = undefined;

  res.status(statusCode).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
};

//Register a user
router.post(
  "/register",
  catchAsync(async (req, res, next) => {
    const isuser = await User.findOne({ email: req.body.email });

    if (isuser) {
      return next(new appError("This email has been already used ", 409));
    }

    if (req.body.passwordConfirm !== req.body.password) {
      return next(
        new appError("The passwords provided above do not match", 400)
      );
    }
    passwordConfirm = undefined;

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create new User and return response
    const newUser = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      passwordConfirm: req.body.password,
    });

    creatSendToken(newUser, 201, res);
  })
);

//Logging in the user
router.post(
  "/login",
  catchAsync(async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return next(new appError("Invalid email or Password", 400));
    }

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );

    if (!validPassword) {
      return next(new appError("Invalid email or Password", 400));
    }

    creatSendToken(user, 200, res);
  })
);

module.exports = router;
