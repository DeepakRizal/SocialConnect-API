const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const appError = require("./../utils/appError");
const catchAsync = require("./../utils/catchAsync");

const router = express.Router();

//create a post
router.post(
  "/",
  catchAsync(async (req, res) => {
    const newPost = new Post(req.body);

    const savedPost = await newPost.save();
    res.status(200).json(savedPost);
  })
);
//update a post
router.put(
  "/:id",
  catchAsync(async (req, res, next) => {
    console.log(req.params.id);
    const post = await Post.findById(req.params.id);
    console.log(post.userId);
    if (!(post.userId === req.body.userId)) {
      next(new appError("you can only update your post", 403));
    }
    await post.updateOne({ $set: req.body });
    res.status(200).json({
      message: "The post has been updated",
    });
  })
);

//delete a post
router.delete(
  "/:id",
  catchAsync(async (req, res, next) => {
    const post = await Post.findById(req.params.id);
    if (!(post.userId === req.body.userId)) {
      next(new appError("You can delete only your post.", 403));
    }
    await post.deleteOne({ _id: req.params.id });
    res.status(200).json("The post has been deleted");
  })
);
//like/dislike a post

router.put(
  "/:id/like",
  catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post.likes.includes(req.body.userId)) {
      await post.updateOne({ $push: { likes: req.body.userId } });
      res.status(200).json("The post has been liked");
    } else {
      await post.updateOne({ $pull: { likes: req.body.userId } });
      res.status(200).json("The post has been disliked");
    }
  })
);

//get a post
router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const post = await Post.findById(req.params.id);
    res.status(200).json(post);
  })
);

//get timeline posts
router.get(
  "/timeline/all",
  catchAsync(async (req, res) => {
    const currentUser = await User.findById(req.body.userId);
    const userPosts = await Post.find({ userId: currentUser._id });
    const friendPosts = await Promise.all(
      currentUser.followings.map((friendId) => {
        return Post.find({ userId: friendId });
      })
    );
    res.json(userPosts.concat(...friendPosts));
  })
);

module.exports = router;
