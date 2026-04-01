import express from "express";
import {
  createTest,
  getTeacherTests,
  getAvailableTests,
  deleteTest,
  activateTest,
  getTestQuestions,
  updateQuestion
} from "../controllers/test.controller.js";

import { aiCreateTest } from "../controllers/ai.controller.js";
import { verifyToken } from "../middleware/auth.Middleware.js";
import { authorizeRoles } from "../middleware/role.Middleware.js";

const router = express.Router();

// Create Test
router.post(
  "/create",
  verifyToken,
  authorizeRoles("teacher"),
  createTest
);

// Teacher Tests
router.get(
  "/teacher",
  verifyToken,
  authorizeRoles("teacher", "HOD", "admin"),
  getTeacherTests
);

// Student Available Tests
router.get(
  "/available",
  verifyToken,
  authorizeRoles("student"),
  getAvailableTests
);

// Get Questions of a Test
router.get(
  "/:id/questions",
  verifyToken,
  authorizeRoles("teacher", "HOD", "admin"),
  getTestQuestions
);

// Update Question
router.put(
  "/question/:questionId",
  verifyToken,
  authorizeRoles("teacher", "HOD"),
  updateQuestion
);

// Activate Test
router.put(
  "/activate/:id",
  verifyToken,
  authorizeRoles("teacher", "HOD", "admin"),
  activateTest
);

// Delete Test
router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("teacher", "HOD"),
  deleteTest
);

// AI Create Test
router.post(
  "/ai-create",
  verifyToken,
  authorizeRoles("teacher"),
  aiCreateTest
);

export default router;