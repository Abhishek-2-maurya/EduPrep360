import { Test } from "../models/test.model.js";
import { Question } from "../models/question.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Result } from "../models/result.model.js"

export const createTest = asyncHandler(async (req, res) => {
  const { title,
    subject,
    duration,
    branch,
    year,
    passingMarks,
    availabilityHours,
    questions, } = req.body;

  if (!title || !subject || !duration || !year || !passingMarks || !availabilityHours || !questions?.length) {
    throw new ApiError(400, "All fields including questions are required");
  }
  console.log(availabilityHours)
  if(availabilityHours <= 0){
    throw new ApiError(400, "Availability hours must be greater than 0");
  }

  // const startTime = new Date();
  // const endTime = new Date(
  //   startTime.getTime() + availabilityHours * 60 * 60 * 1000
  // );

  const test = await Test.create({
    title,
    subject,
    duration,
    year,
    passingMarks,
    availabilityHours,
    branch: req.user.branch,
    teacherId: req.user._id,
    isActive: false,
  });

  const createdQuestions = await Question.insertMany(questions);


  test.questions = createdQuestions.map((q) => q._id);
  await test.save();

  return res
    .status(201)
    .json(new ApiResponse(201, test, "Test created successfully"));
});


export const getTestQuestions = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const test = await Test.findById(id)
    .populate("questions")
    .populate("teacherId", "name");

  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  // Authorization
  if (
    test.teacherId._id.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "HOD"
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, test.questions, "Questions fetched"));
});

export const updateQuestion = asyncHandler(async (req, res) => {
  const { questionId } = req.params;
  const { questionText, options, correctAnswer} = req.body;

  const question = await Question.findById(questionId);
  if (!question) {
    throw new ApiError(404, "Question not found");
  }

  question.questionText = questionText || question.questionText;
  question.options = options || question.options;
  question.correctAnswer = correctAnswer || question.correctAnswer;
  // question.marks = marks || question.marks;

  await question.save();

  return res
    .status(200)
    .json(new ApiResponse(200, question, "Question updated"));
});

export const activateTest = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const test = await Test.findById(id);
  if (!test) throw new ApiError(404, "Test not found");

  if (
    test.teacherId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" &&
    req.user.role !== "HOD"
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  if (!test.isActive) {
    const startTime = new Date();
    const endTime = new Date(
      startTime.getTime() + test.availabilityHours * 60 * 60 * 1000
    );

    test.startTime = startTime;
    test.endTime = endTime;
    test.isActive = true;

    await test.save();
  }

  return res
    .status(200)
    .json(new ApiResponse(200, test, "Test activated"));
});

// export const getBranchTests = asyncHandler(async (req, res) => {

//   const tests = await Test.find({ branch: req.user.branch })
//     .populate("teacherId", "name")
//     .populate("questions");

//   return res
//     .status(200)
//     .json(new ApiResponse(200, tests, "Branch tests fetched successfully"));
// });


export const getTeacherTests = asyncHandler(async (req, res) => {
  const user =  req.user;
  let test;
  if(user.role == "HOD"){
    test = await Test.find({branch:user.branch})
  }
  else if(user.role == "admin"){
      test = await Test.find();
  }
  else if(user.role == "teacher"){
     test = await Test.find({teacherId:user._id});
  } 
  else{
    return res.status(403).json({
      success: false,
      message: "Unauthorized access",
    })
  } 
  return res
    .status(200)
    .json(new ApiResponse(200, test, "Teacher tests fetched"));
});



export const getAvailableTests = asyncHandler(async (req, res) => {
  const student = req.user;
  const now = new Date();


  const attemptedTestIds = await Result.find({
    studentId: student._id,
  }).distinct("testId");

  const tests = await Test.find({
    branch: student.branch,
    year: student.year,
    isActive: true,
    _id: { $nin: attemptedTestIds },
    startTime: { $ne: null, $lte: now },
    endTime: { $ne: null, $gte: now },
  }).populate("teacherId", "name")
    .populate("questions");

  return res
    .status(200)
    .json(new ApiResponse(200, tests, "Active tests fetched"));
});


export const deleteTest = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const test = await Test.findById(id);
  console.log(test);
  if (!test) throw new ApiError(404, "Test is Not Found");
  // console.log("Test teacher:", test.teacherId.toString());
  // console.log("Logged user:", req.user._id.toString());
  // console.log("Role:", req.user.role);
  if (
    test.teacherId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" && req.user.role !== "HOD"
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  await test.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Note deleted successfully"));
});








