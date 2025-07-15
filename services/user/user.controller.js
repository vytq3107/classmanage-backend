const {
  addStudent,
  deleteStudent,
  getAllStudents,
  getStudentByPhone,
  updateProfile,
  setCredentials,
  getUserByPhone,
} = require("./user.model");

const bcrypt = require("bcryptjs");
const { sendEmail } = require("./mailer");

const addStudentHandler = async (req, res) => {
  try {
    const { name, phone, email } = req.body;
    if (!name || !phone || !email) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newUser = await addStudent({ name, phone, email });
    sendEmail.emit("sendInviteEmail", email, name);

    res.status(201).json({ success: true, user: newUser });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const editProfile = async (req, res) => {
  try {
    const { phone } = req.params;
    const { name, email } = req.body;
    const requesterRole = req.user?.role;

    await updateProfile(phone, { name, email }, requesterRole);

    res.status(200).json({
      success: true,
      message: "User profile updated successfully."
    });
  } catch (err) {
    res.status(404).json({
      success: false,
      message: err.message
    });
  }
};

const deleteStudentHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    await deleteStudent(phone);

    res.status(200).json({ success: true, message: "Student deleted successfully." });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getAllStudentsHandler = async (req, res) => {
  try {
    const students = await getAllStudents();
    res.status(200).json({ success: true, students });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getStudentByPhoneHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const student = await getStudentByPhone(phone);

    res.status(200).json({ success: true, student });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const setCredentialsHandler = async (req, res) => {
  try {
    const { phone, username, password } = req.body;
    if (!phone || !username || !password) {
      return res.status(400).json({ message: "Missing credentials." });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    await setCredentials(phone, username, passwordHash);
    res.status(200).json({ success: true, message: "Credentials set successfully." });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

const getUserByPhoneHandler = async (req, res) => {
  try {
    const { phone } = req.params;
    const user = await getUserByPhone(phone);

    res.status(200).json({ success: true, user });
  } catch (err) {
    res.status(404).json({ success: false, message: err.message });
  }
};

module.exports = {
  addStudentHandler,
  deleteStudentHandler,
  getAllStudentsHandler,
  getStudentByPhoneHandler,
  editProfile,
  setCredentialsHandler,
  getUserByPhoneHandler
};
