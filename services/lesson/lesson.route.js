const express = require("express");
const router = express.Router();
const lessonController = require("./lesson.controller");

router.post("/assignLesson", lessonController.assignLesson);
router.get("/myLessons", lessonController.getStudentLessons);
router.post("/markLessonDone", lessonController.markLessonDone);
router.get("/all", lessonController.getAllLessons);
router.get("/students/with-lessons", lessonController.getAllStudentsWithLessons);
router.get("/student/:phone", lessonController.getStudentLessonStatus);
router.get("/:id", lessonController.getLessonById);

module.exports = router;
