const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config({ path: "../../.env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

const authRoutes = require("./auth.route");

app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is running." });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
