const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const path = require("path");
const cors = require("cors");

connectDB();

const app = express();
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/build")));
  app.get("*", (req, res) => {
    res.sendFile(
      path.resolve(__dirname, "../", "frontend", "build", "index.html")
    );
  });
} else {
  app.get("/", (req, res) => res.send("Please set to production"));
}
app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));