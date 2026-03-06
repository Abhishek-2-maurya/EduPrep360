import express from "express"

import { startTest, getStudentResults, deleteResult, getTestAnalytics, getTestResultsList, submitTest, getAdminDashboard, getHodDashboard, getStudentDashboardStats, getTeacherDashboardSummary, getHodTestAnalytics } from "../controllers/result.controller.js";

import { verifyToken } from "../middleware/auth.Middleware.js";
import { authorizeRoles } from "../middleware/role.Middleware.js";

const router = express.Router();

router.post(
  "/start",
  verifyToken,
  authorizeRoles("student"),
  startTest
)

router.post(
  "/submit",
  verifyToken,
  authorizeRoles("student"),
  submitTest
);

router.get(
  "/history",
  verifyToken,
  authorizeRoles("student"),
  getStudentResults
);

router.get("/teacher/dashboard-summary", 
  verifyToken,
  authorizeRoles("teacher"), 
  getTeacherDashboardSummary,
);

router.get("/student/stats", verifyToken, authorizeRoles("student"), getStudentDashboardStats);
  
router.delete(
  "/:resultId",
  verifyToken,
  authorizeRoles("student"),
  deleteResult
)



router.get(
  "/test/:testId",
  verifyToken,
  authorizeRoles("teacher", "HOD"),
  getTestResultsList
)

router.get(
  "/results/hod/test-analytics/:testId",
  verifyToken,
  authorizeRoles("HOD","admin"),
  getHodTestAnalytics
)

router.get(
  "/teacher/:testId",
  verifyToken,
  authorizeRoles("teacher", "HOD", "admin"),
  getTestAnalytics
);

router.get(
  "/hod-dashboard",
  verifyToken,
  authorizeRoles("HOD", "admin"),
  getHodDashboard
);

router.get(
  "/admin-dashboard",
  verifyToken,
  authorizeRoles("admin"),
  getAdminDashboard
);



export default router;

// GET    /api/tests/available
// POST   /api/results/start
// POST   /api/results/submit
// GET    /api/results/history
// GET    /api/results/test/:testId

// {
//   "message": "HOD Dashboard Data",
//   "data": {
//     "totalStudents": 120,
//     "totalTeachers": 8,
//     "totalTests": 15,
//     "totalAttempts": 300,
//     "overallPassPercentage": "72.33",
//     "overallAverageScore": "18.45"
//   }
// }