import express from "express";
import {
  createTest,
  getTeacherTests,
  getAvailableTests,
  deleteTest,
  activateTest,
} from "../controllers/test.controller.js";

import { verifyToken } from "../middleware/auth.Middleware.js";
import { authorizeRoles } from "../middleware/role.Middleware.js"; 

const router = express.Router();

router.post(
  "/create",
  verifyToken,
  authorizeRoles("teacher"),
  createTest
);

router.get(
  "/teacher",
  verifyToken,
  authorizeRoles("teacher", "HOD", "admin"),
  getTeacherTests
);

router.get(
  "/available",
  verifyToken,
  authorizeRoles("student"),
  getAvailableTests
);


router.put(
  "/activate/:id",
  verifyToken,
  authorizeRoles("teacher", "HOD", "admin"),
  activateTest
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("teacher","HOD"),
  deleteTest
)

export default router;