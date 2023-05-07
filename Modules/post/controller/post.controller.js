const {
  ReasonPhrases,
  StatusCodes,
  getReasonPhrase,
  getStatusCode,
} = require("http-status-codes");
const userModel = require("../../../DB/Models/user");
const postModel = require("../../../DB/Models/post");
const sendEmail = require("../../../Helper/mail");

const populateList = [
  {
    path: "userID",
    select: "email  userName profilePic",
  },
  {
    path: "likes",
    select: "email  userName profilePic",
  },
  {
    path: "comment.userID",
    select: "email  userName profilePic",
  },
];

const AddPosts = async (req, res) => {
  try {
    let imageURL = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        let imagepath = `${req.protocol}://${req.headers.host}/${req.files[i].destination}/${req.files[i].filename}`;
        imageURL.push(imagepath);
      }
    }
    const { desc, tagsList } = req.body;
    console.log(tagsList);
    let tagsEmail = "";
    let validTagsIDS = [];
    for (let i = 0; i < tagsList.length; i++) {
      const findUser = await userModel
        .findOne({ _id: tagsList[i] })
        .select("email");
      if (findUser) {
        validTagsIDS.push(findUser._id);
        if (tagsEmail.length > 0) {
          tagsEmail = tagsEmail + " , " + findUser.email;
        } else {
          tagsEmail = findUser.email;
        }
      }
    }
    const newPost = new postModel({
      desc,
      images: imageURL,
      userID: req.user._id,
      tags: validTagsIDS,
    });
    const savedPost = await newPost.save();
    console.log(tagsEmail);
    if (tagsEmail.length > 0) {
      await sendEmail(
        tagsEmail,
        `<p>hi you have been mintioned in ${req.user.userName}
                  </p>  <br> 
                  <a href='${req.protocol}://${req.headers.host}/post/${savedPost._id}'> please follow me to see it </a>`
      );
    }
    res.status(201).json({ message: "Done", savedPost });
  } catch (error) {
    res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ message: "catch error", error });
  }
};

const getPost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findOne({ _id: id }).populate(populateList);
    if (post) {
      res.status(200).json({ message: "Done", post });
    } else {
      res.status(400).json({ message: "postID Wrong " });
    }
  } catch (error) {
    res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ message: "catch error", error });
  }
};

const likePost = async (req, res) => {
  try {
    const { id } = req.params;
    const post = await postModel.findOne({ _id: id });
    if (post) {
      const finduser = post.likes.find((ele) => {
        return ele.toString() == req.user._id.toString();
      });
      if (req.user._id.toString() == post.userID.toString()) {
        res
          .status(400)
          .json({ message: "sorry you cannot like your own post" });
      } else {
        if (finduser) {
          res.status(400).json({ message: "sorry you cannot like this twice" });
        } else {
          post.likes.push(req.user._id);
          const updatePost = await postModel.findByIdAndUpdate(
            post._id,
            { likes: post.likes },
            { new: true }
          );
          res.status(200).json({ message: "Done", updatePost });
        }
      }
    } else {
      res.status(400).json({ message: "not found", status: 400 });
    }
  } catch (error) {
    res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ message: "catch error", error });
  }
};

const creatComment = async (req, res) => {
  try {
    const { id } = req.params;
    let imageURL = [];
    if (req.files) {
      for (let i = 0; i < req.files.length; i++) {
        let imagepath = `${req.protocol}://${req.headers.host}/${req.files[i].destination}/${req.files[i].filename}`;
        imageURL.push(imagepath);
      }
    }
    const { desc, tagsList } = req.body;
    let tagsEmail = "";
    let validTagsIDS = [];
    for (let i = 0; i < tagsList.length; i++) {
      const findUser = await userModel
        .findOne({ _id: tagsList[i] })
        .select("email");
      if (findUser) {
        validTagsIDS.push(findUser._id);
        if (tagsEmail.length > 0) {
          tagsEmail = tagsEmail + " , " + findUser.email;
        } else {
          tagsEmail = findUser.email;
        }
      }
    }
    if (!desc) {
      desc = "";
    }
    const post = await postModel.findOne({ _id: id });
    if (post) {
      post.comment.push({
        userID: req.user._id,
        desc,
        images: imageURL,
        tags: validTagsIDS,
      });
      const updatePost = await postModel
        .findByIdAndUpdate(post._id, { comment: post.comment }, { new: true })
        .populate(populateList);
      await sendEmail(
        tagsEmail,
        `<p>hi you have been comment on your post in ${updatePost.userID.userName}
                    </p>  <br> 
                    <a href='${req.protocol}://${req.headers.host}/post/${updatePost._id}'> please follow me to see it </a>`
      );
      res.status(StatusCodes.ACCEPTED).json({ message: "Done", updatePost });
    } else {
      res.status(StatusCodes.BAD_REQUEST).json({ message: "wrong postID" });
    }
  } catch (error) {
    res
      .status(StatusCodes.SERVICE_UNAVAILABLE)
      .json({ message: "catch error", error });
  }
};

module.exports = {
  AddPosts,
  getPost,
  likePost,
  creatComment,
};
