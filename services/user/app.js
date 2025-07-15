const express = require("express");
const cors = require("cors");
require("dotenv").config({ path: "../../.env" });

const app = express();

const userRoutes = require("./user.route");

app.use(cors());
app.use(express.json());

app.use("/user", userRoutes);
app.get("/", (req, res) => {
  res.status(200).json({ success: true, message: "API is running." });
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
