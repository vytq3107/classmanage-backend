const lessonModel = require("./lesson.model");

module.exports = {
  async assignLesson(req, res) {
    try {
      const { studentPhone, lessonId } = req.body;
      if (!studentPhone || !lessonId) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      const lesson = await lessonModel.getLessonById(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: "Lesson not found." });
      }

      await lessonModel.assignLessonToStudent({ studentPhone, lessonId });

      return res.status(201).json({ success: true, lessonId });
    } catch (error) {
      console.error("assignLesson error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getStudentLessons(req, res) {
    try {
      const { phone } = req.query;
      if (!phone) {
        return res.status(400).json({ message: "Phone number is required." });
      }

      const lessons = await lessonModel.getLessonsOfStudent(phone);
      return res.status(200).json({ success: true, lessons });
    } catch (error) {
      console.error("getStudentLessons error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async markLessonDone(req, res) {
    try {
      const { phone, lessonId } = req.body;
      if (!phone || !lessonId) {
        return res.status(400).json({ message: "Missing required fields." });
      }

      await lessonModel.markLessonDone({ phone, lessonId });
      return res.status(200).json({ success: true });
    } catch (error) {
      console.error("markLessonDone error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getLessonById(req, res) {
    try {
      const { id } = req.params;
      const lesson = await lessonModel.getLessonById(id);
      return res.status(200).json({ success: true, lesson });
    } catch (error) {
      console.error("getLessonById error:", error);
      return res.status(404).json({ success: false, message: error.message });
    }
  },

  async getAllLessons(req, res) {
    try {
      const lessons = await lessonModel.getAllLessons();
      return res.status(200).json({ success: true, lessons });
    } catch (error) {
      console.error("getAllLessons error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getStudentLessonStatus(req, res) {
    try {
      const { phone } = req.params;
      if (!phone) {
        return res.status(400).json({ message: "Phone number is required." });
      }

      const lessons = await lessonModel.getLessonsOfStudent(phone);
      if (lessons.length === 0) {
        return res.status(404).json({ message: "No lessons found for this student." });
      }

      const lessonStatus = lessons.map((lesson) => ({
        title: lesson.title,
        description: lesson.description,
        videoUrl: lesson.videoUrl,
        status: lesson.done ? "Completed" : "Pending",
        assignedAt: new Date(lesson.assignedAt).toLocaleString(),
        completedAt: lesson.completedAt
          ? new Date(lesson.completedAt).toLocaleString()
          : "Not completed yet"
      }));

      return res.status(200).json({ success: true, lessonStatus });
    } catch (error) {
      console.error("getStudentLessonStatus error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  },

  async getAllStudentsWithLessons(req, res) {
    try {
      const data = await lessonModel.getAllStudentsWithLessons();
      return res.status(200).json({ success: true, students: data });
    } catch (error) {
      console.error("getAllStudentsWithLessons error:", error);
      return res.status(500).json({ success: false, message: error.message });
    }
  }
};
