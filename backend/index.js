const express = require("express");
require("dotenv").config();
const port = process.env.PORT || 5000;
const errorHandler = require("./middleware/errorMiddleware");
const connectDB = require("./config/db");
const cors = require("cors");

connectDB();

const app = express();
// app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use("/api/goals", require("./routes/goalRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => console.log(`Server started on port ${port}`));
