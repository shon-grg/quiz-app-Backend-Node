const express = require("express");
const quizController = require("../controller/quizController");
// const authController = require('../controller/authController');

const router = express.Router();

// router.use(authController.protect);

router
  .route("/")
  .get(quizController.getAllTQuizzes)
  .post(quizController.createQuiz);

router
  .route("/:id")
  .get(quizController.getQuiz)
  .patch(quizController.updateQuiz)
  .delete(quizController.deleteQuiz);

router
  .route("/api/quizzes/:id/submit")
  .post(quizController.calculateFinalScore);

module.exports = router;
