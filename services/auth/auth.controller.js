const authModel = require("./auth.model");
const { sendSMS } = require("../../config/twilio");
const { sendEmail } = require("./mailer");
const jwt = require("jsonwebtoken");

const generateCode = authModel.generateCode;

const authController = {
  createAccessCode: async (req, res) => {
    try {
      const { identifier, type } = req.body;
      if (type !== "phone") {
        return res.status(400).json({ success: false, message: "Only phone-based OTP is supported." });
      }

      const user = await authModel.findUserByIdentifier(identifier);
      if (user && user.setupCompleted) {
        return res.status(400).json({ success: false, message: "Account has already been set up." });
      }

      const code = generateCode();
      await authModel.saveAccessCode(identifier, code, type, "register");
      await sendSMS(identifier, `Your verification code is: ${code}`);
      console.log("OTP code: ", code);
      
      res.status(200).json({ success: true, message: "OTP has been sent via SMS." });
    } catch (err) {
      console.error("createAccessCode error:", err);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  },

  validateAccessCode: async (req, res) => {
    try {
      const { identifier, accessCode } = req.body;
      const success = await authModel.verifyAccessCode(identifier, accessCode, "register");
      if (!success) {
        return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
      }

      const user = await authModel.findUserByIdentifier(identifier);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      if (user.setupCompleted) {
        return res.status(400).json({ success: false, message: "Account has already been set up." });
      }

      res.status(200).json({ success: true, role: user.role });
    } catch (err) {
      console.error("validateAccessCode error:", err);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  },

  setCredentials: async (req, res) => {
    try {
      const { identifier, username, password } = req.body;

      const taken = await authModel.isUsernameTaken(username);
      if (taken) {
        return res.status(400).json({ success: false, message: "Username already exists." });
      }

      const success = await authModel.setCredentials(identifier, username, password);
      if (!success) {
        return res.status(403).json({
          success: false,
          message: "Unable to set up account. It may have been already set up or the user is not a student."
        });
      }

      res.status(200).json({ success: true, message: "Account setup completed successfully." });
    } catch (err) {
      console.error("setCredentials error:", err);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  },

  login: async (req, res) => {
    try {
      const { username, password } = req.body;
      const user = await authModel.verifyUsernamePassword(username, password);

      if (!user) {
        return res.status(401).json({ success: false, message: "Login failed. Invalid credentials." });
      }

      const token = jwt.sign({
        userId: user.userId,
        role: user.role,
        name: user.name,
        phone: user.phone
      }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({ success: true, message: "Login successful.", token });
    } catch (err) {
      console.error("login error:", err);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  },

    loginOtp: async (req, res) => {
    try {
      const { identifier, type } = req.body;
      const user = await authModel.findUserByIdentifier(identifier);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      const code = generateCode();
      console.log("OTP code: ", code);
      await authModel.saveAccessCode(identifier, code, type, "login");

      if (type === "phone") {
        await sendSMS(identifier, `Your login code is: ${code}`);
        res.status(200).json({ success: true, message: "Login OTP sent via SMS." });
      } else if (type === "email") {
        const html = `<p>From EClass,</p><p>Your login OTP is: <strong>${code}</strong></p>`;
        await sendEmail(identifier, "Login OTP", html);
        res.status(200).json({ success: true, message: "Login OTP sent via email." });
      } else {
        res.status(400).json({ success: false, message: "Invalid verification type." });
      }
    } catch (err) {
      console.error("loginOtp error:", err);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  },

  verifyLoginOtp: async (req, res) => {
    try {
      const { identifier, accessCode } = req.body;
      const success = await authModel.verifyAccessCode(identifier, accessCode, "login");
      if (!success) {
        return res.status(400).json({ success: false, message: "Invalid or expired verification code." });
      }

      const user = await authModel.findUserByIdentifier(identifier);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found." });
      }

      const token = jwt.sign({
        userId: user.userId,
        role: user.role,
        name: user.name,
        phone: user.phone
      }, process.env.JWT_SECRET, { expiresIn: "1h" });

      res.status(200).json({ success: true, message: "Login successful.", token });
    } catch (err) {
      console.error("verifyLoginOtp error:", err);
      res.status(500).json({ success: false, message: "Internal server error." });
    }
  }
};

module.exports = authController;
