const handelvalidation = require("../../Middleware/HandelValidation");
const { signUPValidation } = require("./user.validation");
const { auth } = require("../../Middleware/auth");
const {
  signup,
  confirmEmail,
  signin,
  profile,
  uploadPIC,
  editcoverPIC,
  alluser,
  resendconfirmation,
  loginWithGmail,
  showAllPDF,
  searchuser,
} = require("./controller/user.controller");
const { endPoint } = require("./endPoint");

const router = require("express").Router();

router.post("/user/signup", handelvalidation(signUPValidation), signup);
router.get(`/user/confirm/:token`, confirmEmail);
router.get(`/user/email/resend/:token`, resendconfirmation);
router.post(`/user/signin`, signin);
router.post(`/loginWithGmail`, loginWithGmail);

router.get(`/user/profile`, auth(endPoint.profile), profile);
router.patch(`/user/pic`, auth(endPoint.uploadPIC), uploadPIC);
router.patch(`/user/coverPic`, auth(endPoint.coverPic), editcoverPIC);
router.get(`/user/allusers`, auth(endPoint.alluser), alluser);
router.get(`/getall/PDF`, showAllPDF);

router.get(`/user/search/:searchkey`, searchuser);

module.exports = router;
