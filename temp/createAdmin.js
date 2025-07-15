const { db } = require("../config/firebase");
const bcrypt = require("bcrypt");

async function createAdminAccount() {
  try {
    const username = "admin";
    const plainPassword = "admin";
    const role = "adm";

    const passwordHash = await bcrypt.hash(plainPassword, 10);

    const timestamp = Date.now();
    const adminId = `adm${timestamp}`;

    const adminData = {
      username,
      passwordHash,
      role,
      name: "Admin",
      setupCompleted: true,
    };

    await db.ref(`user/${adminId}`).set(adminData);

    console.log(`Admin account created successfully. ID: ${adminId}`);
  } catch (error) {
    console.error("Failed to create admin account:", error.message);
  }
}

createAdminAccount();
