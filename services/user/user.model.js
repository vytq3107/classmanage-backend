const { admin, db } = require("../../config/firebase");
const userRef = db.ref("user");

const addStudent = async ({ name, phone, email }) => {
  const uid = `stu${Date.now()}`;
  await userRef.child(uid).set({
    name,
    phone,
    email,
    role: "stu"
  });
  return { id: uid, name, phone, email };
};

const updateProfile = async (phone, data, requesterRole) => {
  const snapshot = await userRef.once("value");
  let found = false;

  snapshot.forEach((child) => {
    const user = child.val();
    const userPhone = user.phone;

    if (userPhone === phone) {
      if (requesterRole === "adm") {
        userRef.child(child.key).update(data);
        found = true;
        return;
      }

      if (requesterRole === "ins" && user.role === "ins") {
        if (user.setupCompleted) {
          if (data.name) {
            userRef.child(child.key).update({ name: data.name });
            found = true;
          }
        } else {
          userRef.child(child.key).update(data);
          found = true;
        }
        return;
      }

      if (requesterRole === "ins" && user.role === "stu") {
        if (user.setupCompleted) {
          if (data.name) {
            userRef.child(child.key).update({ name: data.name });
            found = true;
          }
        } else {
          userRef.child(child.key).update(data);
          found = true;
        }
        return;
      }

      if (requesterRole === "stu" && user.role === "stu") {
        userRef.child(child.key).update(data);
        found = true;
        return;
      }
    }
  });

  if (!found) {
    throw new Error("User not found or access denied.");
  }
};

const deleteStudent = async (phone) => {
  const snapshot = await userRef.once("value");
  let deleted = false;

  snapshot.forEach((child) => {
    const user = child.val();
    if (user.phone === phone && user.role === "stu") {
      userRef.child(child.key).remove();
      deleted = true;
    }
  });

  if (!deleted) {
    throw new Error("Student not found.");
  }
};

const getAllStudents = async () => {
  const snapshot = await userRef.once("value");
  const students = [];

  snapshot.forEach((child) => {
    const user = child.val();
    if (user.role === "stu") {
      students.push({ id: child.key, ...user });
    }
  });

  return students;
};

const getStudentByPhone = async (phone) => {
  const snapshot = await userRef.once("value");
  let result = null;

  snapshot.forEach((child) => {
    const user = child.val();
    if (user.phone === phone && user.role === "stu") {
      result = { id: child.key, ...user };
    }
  });

  if (!result) {
    throw new Error("Student not found.");
  }

  return result;
};

const setCredentials = async (phone, username, passwordHash) => {
  const snapshot = await userRef.once("value");
  let updated = false;

  snapshot.forEach((child) => {
    const user = child.val();
    if (user.phone === phone && user.role === "stu") {
      userRef.child(child.key).update({ username, passwordHash });
      updated = true;
    }
  });

  if (!updated) {
    throw new Error("Student not found or invalid phone.");
  }
};

const getUserByPhone = async (phone) => {
  const snapshot = await userRef.once("value");
  let result = null;

  snapshot.forEach((child) => {
    const user = child.val();
    if (user.phone === phone) {
      result = { id: child.key, ...user };
    }
  });

  if (!result) {
    throw new Error("User not found.");
  }

  return result;
};

module.exports = {
  addStudent,
  updateProfile,
  deleteStudent,
  getAllStudents,
  getStudentByPhone,
  setCredentials,
  getUserByPhone
};
