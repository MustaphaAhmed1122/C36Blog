const { auth } = require("../../Middleware/auth");
const {
  AddPosts,
  getPost,
  likePost,
  creatComment,
} = require("./controller/post.controller");
const endPoint = require("./endPoint");
const router = require("express").Router();

router.post(`/post/addpost`, auth(endPoint.createPost), AddPosts);
router.get(`/post/:id`, getPost);
router.patch(`/post/likePost/:id`, auth(endPoint.likePost), likePost);
router.patch(`/post/:id/comment`, auth(endPoint.creatcomment), creatComment);


module.exports = router;
