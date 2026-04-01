import { Result } from "../models/result.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Test } from "../models/test.model.js";
import { User } from "../models/user.model.js";
import { sendResultEmail } from "../utils/sendResultEmail.js";

export const startTest = asyncHandler(async (req, res) => {
  const { testId } = req.body;
  const student = req.user;

  if (!testId) {
    throw new ApiError(400, "Test ID is required");
  }

  const test = await Test.findById(testId);

  if (!test) {
    throw new ApiError(404, "Test not found");
  }
  const now = new Date();
  if(now < test.startTime || now > test.endTime){
    throw new ApiError(400,"Test is not active");
  }

  
  if (
    test.branch !== student.branch ||
    test.year !== student.year
  ) {
    throw new ApiError(403, "Unauthorized access to this test");
  }

  
  const existingResult = await Result.findOne({
    studentId: student._id,
    testId,
  });

  if (existingResult) {
    if (existingResult.status === "in-progress") {
      return res.status(200).json(
        new ApiResponse(200, existingResult, "Test already started")
      );
    }

    throw new ApiError(400, "You have already completed this test");
  }

  
  const startedAt = new Date();
  const expiresAt = new Date(
    startedAt.getTime() + test.duration * 60 * 1000
  );

  const result = await Result.create({
    studentId: student._id,
    testId,
    status: "in-progress",
    startedAt,
    expiresAt,
  });

  return res.status(201).json(
    new ApiResponse(201, result, "Test started successfully")
  );
});

export const submitTest = asyncHandler(async (req, res) => {
  const { testId, answers } = req.body;
  const student = req.user;

  if (!testId || !answers?.length) {
    throw new ApiError(400, "Test ID and answers are required");
  }

  const test = await Test.findById(testId).populate("questions");

  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  if (test.branch !== student.branch || test.year !== student.year) {
    throw new ApiError(403, "Unauthorized access");
  }

  
  const result = await Result.findOne({
    studentId: student._id,
    testId,
  });

  if (!result) {
    throw new ApiError(400, "You have not started this test");
  }

  if (result.status !== "in-progress") {
    throw new ApiError(400, "Test already submitted");
  }

  
  if (result.expiresAt && new Date() > result.expiresAt) {
    result.status = "fail";
    result.submittedAt = new Date();
    await result.save();
    throw new ApiError(400,"Time expired. Test auto-submitted.")
  }

  
  let score = 0;

  answers.forEach((ans) => {
    const question = test.questions.find(
      (q) => q._id.toString() === ans.questionId
    );
    console.log("Selected:", ans.selectedOption);
    console.log("Correct:", question.correctAnswer);
    if (question && Number(ans.selectedOption) === question.correctAnswer) {
      score++;
    }
  });

  const totalMarks = test.questions.length;

  const percentage = Number(
    ((score / totalMarks) * 100).toFixed(2)
  );

  const status =
    percentage >= test.passingMarks ? "pass" : "fail";

  
  result.score = score;
  result.totalMarks = totalMarks;
  result.percentage = percentage;
  result.status = status;
  result.submittedAt = new Date();

  await result.save();
  // await sendResultEmail({
  //   email:student.email,
  //   name:student.name,
  //   testTitle:test.title,
  //   score,
  //   totalMarks,
  //   percentage,
  //   status,
  // }).catch(err => console.log("Email failed: ", err));
  return res.status(200).json(
    new ApiResponse(200, result, "Test submitted successfully")
  );
});


export const getStudentDashboardStats = asyncHandler(async (req, res) => {
  const studentId = req.user._id;

  const stats = await Result.aggregate([
    {
      $match: {
        studentId: studentId,
        status: { $in: ["pass", "fail"] },
      },
    },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: "$percentage" },
        highestScore: { $max: "$percentage" },
        passCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "pass"] }, 1, 0],
          },
        },
      },
    },
  ]);

  let dashboardData = {
    totalAttempts: 0,
    averageScore: 0,
    highestScore: 0,
    passPercentage: 0,
  };

  if (stats.length > 0) {
    const data = stats[0];
    dashboardData.totalAttempts = data.totalAttempts;
    dashboardData.averageScore = data.averageScore?.toFixed(2) || 0;
    dashboardData.highestScore = data.highestScore || 0;
    dashboardData.passPercentage = (
      (data.passCount / data.totalAttempts) * 100
    ).toFixed(2);
  }

  return res
    .status(200)
    .json(new ApiResponse(200, dashboardData, "Student stats fetched"));
});


export const getStudentResults = asyncHandler(async (req, res) => {
  const results = await Result.find({
    studentId: req.user._id,
    status: {$in:["pass","fail"]},
  }).populate("testId", "title subject")
  .sort({submittedAt: -1});

  return res
    .status(200)
    .json(new ApiResponse(200, results, "Results fetched"));
});


export const deleteResult =  asyncHandler(async(req,res)=>{
   const{ resultId } = req.params;
  console.log(resultId)
   const result = await Result.findById(resultId);
   console.log(result)
   if(!result){
    throw new ApiError(404,"Result not Found");
   }
   await result.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Results dedleted"));   

})

export const getTestAnalytics = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  const test = await Test.findById(testId);

  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  if (test.teacherId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  const analytics = await Result.aggregate([
    {
      $match: {
        testId: test._id,
        status: { $in: ["pass", "fail"] },
      },
    },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: "$score" },
        highestScore: { $max: "$score" },
        lowestScore: { $min: "$score" },
        passCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "pass"] }, 1, 0],
          },
        },
        failCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "fail"] }, 1, 0],
          },
        },
      },
    },
  ]);

  if (!analytics.length) {
    return res.status(200).json({
      message: "No attempts yet",
      data: null,
    });
  }

  const data = analytics[0];

  const passPercentage = (
    (data.passCount / data.totalAttempts) *
    100
  ).toFixed(2);

  return res.status(200).json({
    testTitle: test.title,
    totalAttempts: data.totalAttempts,
    averageScore: data.averageScore.toFixed(2),
    highestScore: data.highestScore,
    lowestScore: data.lowestScore,
    passCount: data.passCount,
    failCount: data.failCount,
    passPercentage,
  });
});

export const getHodTestAnalytics = asyncHandler(async (req, res) => {
  const { testId } = req.params;
  const { branch, role } = req.user;

  // Security check: Only HOD or Admin
  if (role !== "HOD" && role !== "admin") {
    throw new ApiError(403, "Only HODs can access department-wide analytics");
  }

  const test = await Test.findById(testId).populate("teacherId", "name");

  if (!test) throw new ApiError(404, "Test not found");

  // Branch check for HOD
  if (role === "HOD" && test.branch !== branch) {
    throw new ApiError(403, "You can only view analytics for your own department");
  }

  const analytics = await Result.aggregate([
    { $match: { testId: test._id, status: { $in: ["pass", "fail"] } } },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: "$percentage" },
        highestScore: { $max: "$percentage" },
        lowestScore: { $min: "$percentage" },
        passCount: { $sum: { $cond: [{ $eq: ["$status", "pass"] }, 1, 0] } },
        failCount: { $sum: { $cond: [{ $eq: ["$status", "fail"] }, 1, 0] } },
      },
    },
  ]);

  if (!analytics.length) {
    return res.status(200).json(new ApiResponse(200, { testTitle: test.title, noAttempts: true }, "No attempts yet"));
  }

  const data = analytics[0];
  const passPercentage = ((data.passCount / data.totalAttempts) * 100).toFixed(2);

  return res.status(200).json(new ApiResponse(200, {
    testTitle: test.title,
    teacherName: test.teacherId.name,
    branch: test.branch,
    year: test.year,
    totalAttempts: data.totalAttempts,
    averageScore: data.averageScore.toFixed(2),
    highestScore: data.highestScore,
    lowestScore: data.lowestScore,
    passCount: data.passCount,
    failCount: data.failCount,
    passPercentage,
  }, "Department test analytics fetched"));
});

export const getTestResultsList = asyncHandler(async (req, res) => {
  const { testId } = req.params;

  const test = await Test.findById(testId);

  if (!test) {
    throw new ApiError(404, "Test not found");
  }

  if (test.teacherId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized access");
  }

  const results = await Result.find({
    testId,
    status: { $in: ["pass", "fail"] },
  })
    .populate("studentId", "name email")
    .sort({ score: -1 });

  
  const rankedResults = results.map((result, index) => ({
    rank: index + 1,
    studentName: result.studentId.name,
    email: result.studentId.email,
    score: result.score,
    percentage: result.percentage,
    status: result.status,
    submittedAt: result.submittedAt,
  }));

  return res.status(200).json({
    testTitle: test.title,
    totalStudents: rankedResults.length,
    results: rankedResults,
  });
});


export const getHodDashboard = asyncHandler(async (req, res) => {
  const branch = req.user.branch;

  
  const totalStudents = await User.countDocuments({
    role: "student",
    branch,
  });

  
  const totalTeachers = await User.countDocuments({
    role: "teacher",
    branch,
  });

  
  const totalTests = await Test.countDocuments({
    branch,
  });

  
  const resultStats = await Result.aggregate([
    {
      $lookup: {
        from: "tests",
        localField: "testId",
        foreignField: "_id",
        as: "test",
      },
    },
    { $unwind: "$test" },
    {
      $match: {
        "test.branch": branch,
        status: { $in: ["pass", "fail"] },
      },
    },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: "$score" },
        passCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "pass"] }, 1, 0],
          },
        },
      },
    },
  ]);

  let dashboardStats = {
    totalStudents,
    totalTeachers,
    totalTests,
    totalAttempts: 0,
    overallPassPercentage: 0,
    overallAverageScore: 0,
  };

  if (resultStats.length > 0) {
    const stats = resultStats[0];

    dashboardStats.totalAttempts = stats.totalAttempts;
    dashboardStats.overallAverageScore =
      stats.averageScore?.toFixed(2) || 0;

    dashboardStats.overallPassPercentage = (
      (stats.passCount / stats.totalAttempts) *
      100
    ).toFixed(2);
  }

  return res.status(200).json({
    message: "HOD Dashboard Data",
    data: dashboardStats,
  });
});



export const getAdminDashboard = asyncHandler(async (req, res) => {

  
  const totalStudents = await User.countDocuments({ role: "student" });
  const totalTeachers = await User.countDocuments({ role: "teacher" });
  const totalHODs = await User.countDocuments({ role: "HOD" });

  
  const totalTests = await Test.countDocuments();

 
  const overallStats = await Result.aggregate([
    {
      $match: { status: { $in: ["pass", "fail"] } }
    },
    {
      $group: {
        _id: null,
        totalAttempts: { $sum: 1 },
        averageScore: { $avg: "$score" },
        passCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "pass"] }, 1, 0]
          }
        }
      }
    }
  ]);

  let totalAttempts = 0;
  let overallAverageScore = 0;
  let overallPassPercentage = 0;

  if (overallStats.length > 0) {
    const stats = overallStats[0];
    totalAttempts = stats.totalAttempts;
    overallAverageScore = stats.averageScore?.toFixed(2) || 0;
    overallPassPercentage = (
      (stats.passCount / stats.totalAttempts) * 100
    ).toFixed(2);
  }

  
  const topBranch = await Result.aggregate([
    {
      $lookup: {
        from: "tests",
        localField: "testId",
        foreignField: "_id",
        as: "test"
      }
    },
    { $unwind: "$test" },
    { $match: { status: { $in: ["pass", "fail"] } } },
    {
      $group: {
        _id: "$test.branch",
        avgScore: { $avg: "$score" }
      }
    },
    { $sort: { avgScore: -1 } },
    { $limit: 1 }
  ]);

  
  const hardestTest = await Result.aggregate([
    {
      $match: { status: { $in: ["pass", "fail"] } }
    },
    {
      $group: {
        _id: "$testId",
        total: { $sum: 1 },
        passCount: {
          $sum: {
            $cond: [{ $eq: ["$status", "pass"] }, 1, 0]
          }
        }
      }
    },
    {
      $project: {
        passPercentage: {
          $multiply: [
            { $divide: ["$passCount", "$total"] },
            100
          ]
        }
      }
    },
    { $sort: { passPercentage: 1 } },
    { $limit: 1 }
  ]);

  return res.status(200).json({
    message: "Admin Dashboard Data",
    data: {
      totalStudents,
      totalTeachers,
      totalHODs,
      totalTests,
      totalAttempts,
      overallAverageScore,
      overallPassPercentage,
      topBranch: topBranch[0]?._id || null,
      hardestTestId: hardestTest[0]?._id || null
    }
  });
});


export const getTeacherDashboardSummary = asyncHandler(async (req, res) => {
  const teacherId = req.user._id;
  const branch = req.user.branch;

  // 1. Get Teacher's Stats (Total students in their branch, active tests they created)
  const totalStudents = await User.countDocuments({ role: "student", branch });
  const activeTests = await Test.countDocuments({ 
    teacherId, 
    endTime: { $gt: new Date() } // Only tests that haven't expired
  });

  // 2. Get Average Score and Activity for tests created by THIS teacher
  const stats = await Result.aggregate([
    {
      $lookup: {
        from: "tests",
        localField: "testId",
        foreignField: "_id",
        as: "test",
      },
    },
    { $unwind: "$test" },
    {
      $match: {
        "test.teacherId": teacherId,
        status: { $in: ["pass", "fail"] },
      },
    },
    {
      $group: {
        _id: null,
        avgScore: { $avg: "$percentage" },
      },
    },
  ]);

  // 3. Get Recent Activity (The last 5 submissions for this teacher's tests)
  const recentResults = await Result.find()
    .populate({
      path: "testId",
      match: { teacherId: teacherId }, // Only results for this teacher's tests
      select: "title"
    })
    .populate("studentId", "name")
    .sort({ submittedAt: -1 })
    .limit(5);

  // Filter out nulls if populate didn't match (tests not belonging to teacher)
  const filteredActivity = recentResults
    .filter(r => r.testId !== null)
    .map(r => ({
      testName: r.testId.title,
      message: `${r.studentId.name} submitted the assessment.`,
      score: r.percentage,
      status: r.status,
      timeAgo: formatTimeAgo(r.submittedAt) // Standardizes the time display
    }));

  return res.status(200).json(
    new ApiResponse(200, {
      stats: {
        activeTests,
        avgScore: stats[0]?.avgScore?.toFixed(2) || 0,
        totalStudents
      },
      recentActivity: filteredActivity
    }, "Teacher dashboard summary fetched")
  );
});

// Helper function for the "Time Ago" logic
function formatTimeAgo(date) {
  const seconds = Math.floor((new Date() - new Date(date)) / 1000);
  if (seconds < 60) return "Just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  return new Date(date).toLocaleDateString();
}

// {
//   "message": "Admin Dashboard Data",
//   "data": {
//     "totalStudents": 350,
//     "totalTeachers": 25,
//     "totalHODs": 5,
//     "totalTests": 40,
//     "totalAttempts": 1200,
//     "overallAverageScore": "17.42",
//     "overallPassPercentage": "68.90",
//     "topBranch": "BCA",
//     "hardestTestId": "67bc91e4c2d9a8e6f5a1b234"
//   }
// }