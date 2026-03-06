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

  const startTime = new Date();
  const endTime = new Date(
    startTime.getTime() + availabilityHours * 60 * 60 * 1000
  );

  const test = await Test.create({
    title,
    subject,
    duration,
    year,
    passingMarks,
    branch: req.user.branch,
    teacherId: req.user._id,
    startTime,
    endTime,
  });

  const createdQuestions = await Question.insertMany(questions);


  test.questions = createdQuestions.map((q) => q._id);
  await test.save();

  return res
    .status(201)
    .json(new ApiResponse(201, test, "Test created successfully"));
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
    _id: { $nin: attemptedTestIds },
    startTime: { $lte: now },
    endTime: { $gte: now },
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
  console.log("Test teacher:", test.teacherId.toString());
  console.log("Logged user:", req.user._id.toString());
  console.log("Role:", req.user.role);
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








