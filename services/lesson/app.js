const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
require("dotenv").config();

require("../../config/firebase");

const lessonRoutes = require("./lesson.route");

const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));

app.use("/lesson", lessonRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "Classroom Management Lesson Service is running." });
});

app.use((req, res) => {
  res.status(404).json({ success: false, message: "API endpoint not found." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
