import express from "express";
import upload from "../middleware/upload.Middleware.js";
import {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
} from "../controllers/note.controller.js";
import { verifyToken } from "../middleware/auth.Middleware.js";
import { authorizeRoles } from "../middleware/role.Middleware.js";

const router = express.Router();

router.post(
  "/",
  verifyToken,
  authorizeRoles("teacher"),
  upload.single("file"),
  createNote
);

router.get(
  "/",
  verifyToken,
  authorizeRoles("student", "teacher", "HOD", "admin"),
  getNotes
);

router.put(
  "/:id",
  verifyToken,
  authorizeRoles("teacher"),
  upload.single("file"),
  updateNote
);

router.delete(
  "/:id",
  verifyToken,
  authorizeRoles("teacher", "admin"),
  deleteNote
);

export default router;