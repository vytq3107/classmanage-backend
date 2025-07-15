const express = require("express");
const router = express.Router();
const {
  addStudentHandler,
  deleteStudentHandler,
  getAllStudentsHandler,
  getStudentByPhoneHandler,
  editProfile,
  getUserByPhoneHandler
} = require("./user.controller");

const verifyJWT = require("../../middleware/verifyJWT");
const checkRole = require("../../middleware/checkRole");
const checkOwn = require("../../middleware/checkOwn");
const { validatePhone } = require("../../middleware/validatePhone");
const validateBody = require("../../middleware/validateBody");
const Joi = require("joi");

const studentSchema = Joi.object({
  name: Joi.string().required(),
  phone: Joi.string().required(),
  email: Joi.string().email().required()
});

const profileSchema = Joi.object({
  name: Joi.string().required(),
  email: Joi.string().email().required()
});

const credentialsSchema = Joi.object({
  phone: Joi.string().required(),
  username: Joi.string().required(),
  password: Joi.string().min(6).required()
});
router.post("/addStudent", verifyJWT, checkRole("ins", "adm"), validateBody(studentSchema), validatePhone("phone"), addStudentHandler);
router.put("/editStudent/:phone", verifyJWT, checkRole("ins", "adm"), validatePhone("phone", "params"), editProfile);
router.delete("/student/:phone", verifyJWT, checkRole("ins", "adm"), validatePhone("phone", "params"), deleteStudentHandler);
router.get("/students", verifyJWT, checkRole("ins", "adm"), getAllStudentsHandler);
router.get("/student/:phone", verifyJWT, checkRole("ins", "adm"), validatePhone("phone", "params"), getStudentByPhoneHandler);

router.put("/editProfile/:phone", verifyJWT, checkRole("adm", "stu", "ins"), checkOwn("phone", "params"), validatePhone("phone", "params"), validateBody(profileSchema), editProfile);
router.get("/me/:phone", verifyJWT, checkOwn("phone", "params"), validatePhone("phone", "params"), getUserByPhoneHandler);

module.exports = router;
