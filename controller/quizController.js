const Quiz = require("../models/quizModel");
const catchAsync = require("../utility/catchAsync");
const AppError = require("../utility/appError");
// get  all Quiz
exports.getAllTQuizzes = catchAsync(async (req, res, next) => {
  const quizzes = await Quiz.find();
  res.status(200).json({
    status: "success",
    results: quizzes.length,
    data: {
      quizzes,
    },
  });
});
// Create quiz list
exports.createQuiz = catchAsync(async (req, res) => {
  const newQuiz = await Quiz.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      quiz: newQuiz,
    },
  });
});

// get one quiz list
exports.getQuiz = catchAsync(async (req, res) => {
  const quiz = await Quiz.findById(req.params.id);

  if (!quiz) {
    return next(new AppError("No quiz found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      quiz,
    },
  });
});

// Update quiz list
exports.updateQuiz = catchAsync(async (req, res) => {
  const quiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!quiz) {
    return next(new AppError("No quiz found with that ID", 404));
  }
  res.status(200).json({
    status: "success",
    data: {
      quiz,
    },
  });
});

// delete quiz list
exports.deleteQuiz = catchAsync(async (req, res) => {
  const quiz = await Quiz.findByIdAndDelete(req.params.id);
  if (!quiz) {
    return next(new AppError("No quiz found with that ID", 404));
  }
  res.status(204).json({
    status: "success",
    data: null,
  });
});

// calculate Final score
exports.calculateFinalScore = catchAsync(async (req, res) => {
  const { answers } = req.body;

  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) {
    return res.status(404).send({ error: "Quiz not found" });
  }

  let score = 0;
  quiz.questions.forEach((question, index) => {
    if (
      answers[question._id] &&
      answers[question._id] === question.correctAnswer
    ) {
      score++;
    }
  });

  res.status(200).send({ score, totalQuestions: quiz.questions.length });
});
