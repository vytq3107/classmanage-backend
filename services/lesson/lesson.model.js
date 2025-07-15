const admin = require("firebase-admin");
const db = admin.database();

function generateLessonId() {
  return "lessonId" + Date.now();
}

function convertToEmbedUrl(videoUrl) {
  const match = videoUrl.match(/(?:youtu\.be\/|v=)([^&]+)/);
  if (!match) return null;
  return `https://www.youtube.com/embed/${match[1]}`;
}

module.exports = {
  async createLesson({ title, description, videoUrl }) {
    const lessonId = generateLessonId();
    const embedUrl = convertToEmbedUrl(videoUrl);
    const createdAt = Date.now();

    const newLesson = {
      title,
      description,
      videoUrl,
      embedUrl,
      createdAt
    };

    await db.ref(`lesson/${lessonId}`).set(newLesson);
    return { lessonId, ...newLesson };
  },

  async assignLessonToStudent({ studentPhone, lessonId }) {
    const assignedAt = Date.now();
    const lessonRef = db.ref("user").orderByChild("phone").equalTo(studentPhone);
    const snapshot = await lessonRef.once("value");

    if (!snapshot.exists()) throw new Error("Student not found");

    let studentId = null;
    snapshot.forEach((child) => {
      studentId = child.key;
    });

    await db.ref(`user/${studentId}/lessons/${lessonId}`).set({
      done: false,
      assignedAt
    });
  },

  async getLessonsOfStudent(phone) {
    const allUsersSnap = await db.ref("user").once("value");
    const allUsers = allUsersSnap.val() || {};

    const match = Object.entries(allUsers).find(([_, user]) => user.phone === phone);
    if (!match) return [];

    const [studentId, studentData] = match;
    const lessonIds = studentData.lessons || {};

    const allLessonsSnap = await db.ref("lesson").once("value");
    const allLessons = allLessonsSnap.val() || {};

    return Object.entries(lessonIds).map(([id, meta]) => {
      const lessonData = allLessons[id] || {};
      return {
        id,
        ...lessonData,
        done: meta.done,
        assignedAt: meta.assignedAt,
        completedAt: meta.completedAt || null
      };
    });
  },

  async markLessonDone({ phone, lessonId }) {
    const userSnap = await db.ref("user").orderByChild("phone").equalTo(phone).once("value");
    if (!userSnap.exists()) throw new Error("Student not found");

    const studentId = Object.keys(userSnap.val())[0];
    const lessonPath = `user/${studentId}/lessons/${lessonId}`;

    await db.ref(lessonPath).update({
      done: true,
      completedAt: Date.now()
    });
  },

  async getAllLessons() {
    const snapshot = await db.ref("lesson").once("value");
    return snapshot.val() || {};
  },

  async getLessonById(id) {
    const snap = await db.ref(`lesson/${id}`).once("value");
    if (!snap.exists()) throw new Error("Lesson not found");
    return snap.val();
  },

  async getStudentLessonStatus(phone) {
    const allUsersSnap = await db.ref("user").once("value");
    const allUsers = allUsersSnap.val() || {};

    const match = Object.entries(allUsers).find(([_, user]) => user.phone === phone);
    if (!match) return [];

    const [studentId, studentData] = match;
    const lessonIds = studentData.lessons || {};

    const allLessonsSnap = await db.ref("lesson").once("value");
    const allLessons = allLessonsSnap.val() || {};

    return Object.entries(lessonIds).map(([id, meta]) => {
      const lessonData = allLessons[id] || {};
      return {
        title: lessonData.title,
        description: lessonData.description,
        videoUrl: lessonData.videoUrl,
        status: meta.done ? "Completed" : "Pending",
        assignedAt: new Date(meta.assignedAt).toLocaleString(),
        completedAt: meta.completedAt
          ? new Date(meta.completedAt).toLocaleString()
          : "Not completed yet"
      };
    });
  },

  async getAllStudentsWithLessons() {
    const usersSnap = await db.ref("user").once("value");
    const users = usersSnap.val() || {};

    const lessonsSnap = await db.ref("lesson").once("value");
    const lessons = lessonsSnap.val() || {};

    return Object.entries(users)
      .filter(([_, userData]) => userData.role === "stu")
      .map(([userId, userData]) => {
        const lessonEntries = userData.lessons || {};

        const studentLessons = Object.entries(lessonEntries).map(([lessonId, meta]) => {
          const lessonData = lessons[lessonId] || {};
          return {
            id: lessonId,
            title: lessonData.title || "Unknown",
            description: lessonData.description || "",
            videoUrl: lessonData.videoUrl || "",
            embedUrl: lessonData.embedUrl || "",
            assignedAt: meta.assignedAt,
            done: meta.done,
            completedAt: meta.completedAt || null
          };
        });

        return {
          studentId: userId,
          name: userData.name || "",
          phone: userData.phone || "",
          email: userData.email || "",
          lessons: studentLessons
        };
      });
  }
};
