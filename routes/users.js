const express = require("express");
const User = require("../models/User");
const appError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

const router = express.Router();

//Update user
router.put(
  "/:id",
  catchAsync(async (req, res, next) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }

      const user = await User.findByIdAndUpdate(req.params.id, {
        $set: req.body,
      });
      res.status(200).json("Account has been updated");
    } else {
      return next(new appError("you can only Update your account", 403));
    }
  })
);
//delete user
router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    if (req.body.userId === req.params.id || req.body.isAdmin) {
      const user = await User.findById(req.params.id);
      if (!user) return next(new appError("User does not exist", 403));

      await user.deleteOne({ _id: req.params.id });

      res.status(200).json("Account has been deleted");
    } else {
      return next(new appError("You can delete only your account!", 403));
    }
  })
);

//get a user
router.get("/:id", async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new appError("User not Found", 404));
  }
  const { password, updatedAt, ...other } = user._doc;
  res.status(200).json(other);
});
//follow a user
router.put(
  "/:id/follow",
  catchAsync(async (req, res) => {
    if (req.body.userId === req.params.id) {
      return next(new appError("You can't follow yourself"));
    }
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);

    if (user.followers.includes(req.body.userId)) {
      return next(new appError("You have already followed this user", 403));
    }

    await user.updateOne({
      $push: {
        followers: req.body.userId,
      },
    });
    await currentUser.updateOne({
      $push: {
        followings: req.params.id,
      },
    });
    res.status(200).json("User has been follwed");
  })
);
//unfollow a user
router.put(
  "/:id/unfollow",
  catchAsync(async (req, res, next) => {
    if (req.body.userId === req.params.id) {
      return next(new appError("You can't unfollow Yourself", 403));
    }
    const user = await User.findById(req.params.id);
    const currentUser = await User.findById(req.body.userId);
    if (!user.followers.includes(req.body.userId)) {
      return next(new appError("You don't follow this user"));
    }
    await user.updateOne({
      $pull: {
        followers: req.body.userId,
      },
    });
    await currentUser.updateOne({
      $pull: {
        followings: req.params.id,
      },
    });
    res.status(200).json("User has been unfollwed");
  })
);
module.exports = router;
