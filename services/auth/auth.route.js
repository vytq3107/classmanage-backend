const express = require("express");
const router = express.Router();
const Joi = require("joi");

const authController = require("./auth.controller");
const validateBody = require("../../middleware/validateBody");
const { validatePhone } = require("../../middleware/validatePhone");

const schemaCreateAccessCode = Joi.object({
  identifier: Joi.string().required(),
  type: Joi.string().required()
});

const schemaValidateAccessCode = Joi.object({
  identifier: Joi.string().required(),
  accessCode: Joi.number().required()
});

const schemaSetCredentials = Joi.object({
  identifier: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().min(3).required()
});

const schemaLogin = Joi.object({
  username: Joi.string().required(),
  password: Joi.string().required()
});

const schemaLoginOtp = Joi.object({
  identifier: Joi.string().required(),
  type: Joi.string().valid("phone", "email").required()
});

const schemaVerifyLoginOtp = Joi.object({
  identifier: Joi.string().required(),
  accessCode: Joi.number().required()
});

const use = (path, schema, handler) =>
  router.post(path, validateBody(schema), validatePhone("identifier"), handler);

use("/createAccessCode", schemaCreateAccessCode, authController.createAccessCode);
use("/validateAccessCode", schemaValidateAccessCode, authController.validateAccessCode);
use("/setCredentials", schemaSetCredentials, authController.setCredentials);

router.post("/login", validateBody(schemaLogin), authController.login);
router.post("/loginOtp", validateBody(schemaLoginOtp), validatePhone("identifier"), authController.loginOtp);
router.post("/verifyLoginOtp", validateBody(schemaVerifyLoginOtp), validatePhone("identifier"), authController.verifyLoginOtp);

module.exports = router;
