const { roles } = require("../../Middleware/auth");

const endPoint = {
  createPost: [roles.Admin, roles.User],
  likePost: [roles.Admin, roles.User],
  creatcomment: [roles.Admin, roles.User],
};

module.exports = endPoint;
