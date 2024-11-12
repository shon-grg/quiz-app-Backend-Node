const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

const AppError = require("./utility/appError");
const userRoutes = require("./routes/userRoutes");
const quizRoutes = require("./routes/quizeRoutes");
const globalErrorHandler = require("./controller/errorController");

process.on("uncaughtException", (err) => {
  console.log("UNCAUGHT EXCEPTION! Shouting down....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

const app = express();
dotenv.config({ path: "./config.env" });
const DB = process.env.DATABASE_LOCAL;

app.use(express.json);
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString;
  next();
});

app.use("/user", userRoutes);
app.use("/quiz", quizRoutes);

app.all("*", (req, res, next) => {
  next(new AppError("`Can't find ${req.originalUrl}on this server!`"));
});

app.use(globalErrorHandler);

// SERVER
mongoose
  .connect(DB, {
    useNewUrlParser: true,
    family: 4,
  })
  .then(() => {
    console.log("DB connection successful!");
  })
  .catch((err) => {
    console.error("DB connection error:", err);
  });

const port = process.env.PORT || 3000;
const server = app.listen(port, () => {
  console.log(`App running on port ${port}...`);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! Shouting down....");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
