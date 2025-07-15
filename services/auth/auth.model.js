const { db } = require("../../config/firebase");
const bcrypt = require("bcrypt");

const authModel = {
  generateCode: () => Math.floor(100000 + Math.random() * 900000).toString(),

  async saveAccessCode(identifier, code, type, purpose = "register") {
    const snapshot = await db.ref("accessCode").once("value");
    const codes = snapshot.val();

    if (codes) {
      for (const key in codes) {
        const entry = codes[key];
        if (entry.identifier === identifier && entry.purpose === purpose) {
          await db.ref(`accessCode/${key}`).remove();
        }
      }
    }

    const codeData = {
      code: Number(code),
      createdAt: Date.now(),
      identifier,
      type,
      purpose
    };

    await db.ref("accessCode").push(codeData);
  },

  async clearExpiredCodes() {
    const snapshot = await db.ref("accessCode").once("value");
    const codes = snapshot.val();
    const now = Date.now();

    for (const key in codes) {
      if (!codes[key].createdAt || now - codes[key].createdAt > 3 * 60 * 1000) {
        await db.ref(`accessCode/${key}`).remove();
      }
    }
  },

  async verifyAccessCode(identifier, code, purpose = null) {
    const snapshot = await db.ref("accessCode").once("value");
    const codes = snapshot.val();
    const now = Date.now();
    let matchedKey = null;

    for (const key in codes) {
      const entry = codes[key];
      if (!entry || !entry.code || !entry.createdAt || !entry.identifier) continue;

      const isExpired = now - entry.createdAt > 3 * 60 * 1000;
      if (isExpired) {
        await db.ref(`accessCode/${key}`).remove();
        continue;
      }

      const isMatch =
        entry.identifier === identifier &&
        entry.code === Number(code) &&
        (!purpose || entry.purpose === purpose);

      if (isMatch) {
        matchedKey = key;
        break;
      }
    }

    if (matchedKey) {
      await db.ref(`accessCode/${matchedKey}`).remove();
      return true;
    }

    return false;
  },

  async isUsernameTaken(username) {
    const snapshot = await db.ref("user").once("value");
    const users = snapshot.val();

    for (const key in users) {
      if (users[key].username === username) {
        return true;
      }
    }

    return false;
  },

  async setCredentials(identifier, username, plainPassword) {
    const snapshot = await db.ref("user").once("value");
    const users = snapshot.val();

    for (const key in users) {
      const user = users[key];
      if ((user.phone === identifier || user.email === identifier) && user.role === "stu") {
        if (user.setupCompleted) return false;

        const passwordHash = await bcrypt.hash(plainPassword, 10);
        await db.ref(`user/${key}`).update({
          username,
          passwordHash,
          setupCompleted: true
        });

        return true;
      }
    }

    return false;
  },

  async verifyUsernamePassword(username, plainPassword) {
    const snapshot = await db.ref("user").once("value");
    const users = snapshot.val();

    for (const key in users) {
      const user = users[key];
      if (user.username === username && user.passwordHash) {
        const isMatch = await bcrypt.compare(plainPassword, user.passwordHash);
        if (isMatch) {
          return {
            userId: key,
            role: user.role,
            name: user.name,
            phone: user.phone
          };
        }
      }
    }

    return null;
  },

  async findUserByIdentifier(identifier) {
    const snapshot = await db.ref("user").once("value");
    const users = snapshot.val();

    for (const key in users) {
      const user = users[key];
      if (user.phone === identifier || user.email === identifier) {
        return {
          userId: key,
          ...user
        };
      }
    }

    return null;
  }
};

module.exports = authModel;
