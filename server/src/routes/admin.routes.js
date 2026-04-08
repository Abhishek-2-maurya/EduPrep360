import express from "express";
import {
  getAllUsers,
  updateUser,
  deleteUser
} from "../controllers/user.controller.js";

import { updateUserRole } from "../controllers/admin.controller.js";

import { verifyToken } from "../middleware/auth.Middleware.js";
import { isAdmin } from "../middleware/admin.Middleware.js";

const router = express.Router();

router.get("/users", verifyToken, getAllUsers);

router.post("/update-role", verifyToken, isAdmin, updateUserRole);

router.put("/update-user/:id", verifyToken, isAdmin, updateUser);

router.delete("/delete-user/:id", verifyToken, isAdmin, deleteUser);

export default router;