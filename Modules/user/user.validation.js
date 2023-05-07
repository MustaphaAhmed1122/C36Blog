const Joi = require("joi");

const signUPValidation = {
  body: Joi.object()
    .required()
    .keys({
      userName: Joi.string().required().min(10).max(20).messages({
        "string.empty": "Display name cannot be empty",
        "string.min": "Min 10 characters",
        "string.max": "Min 20 characters",
      }),
      email: Joi.string().required().email().messages({
        "string.email": "wrong email format",
      }),
      password: Joi.string()
        .required()
        .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
      cpassword: Joi.ref("password"),
      age: Joi.number().integer().min(18).max(80).messages({
        "number.max": "the age must be between 18 and 80",
      }),
      phone: Joi.string()
        .pattern(new RegExp(/^(002|\+2)?01[0125][0-9]{8}$/))
        .required()
        .messages({
          "string.pattern.base": "Wrong Format",
        }),
      address: Joi.string().min(5).max(30).messages({
        "string.min": "Min 5 characters",
        "string.max": "Min 30 characters",
      }),
    }),
};

module.exports = {
  signUPValidation,
};
