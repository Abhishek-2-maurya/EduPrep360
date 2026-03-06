import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getProfile,
  getAllUsers,
  updateUser,
  deleteUser,
} from "../controllers/user.controller.js";

import { verifyToken } from "../middleware/auth.Middleware.js";
import { authorizeRoles } from "../middleware/role.Middleware.js";

const router = express.Router();



router.post("/register", registerUser);
router.post("/login", loginUser);




router.post("/logout", verifyToken, logoutUser);
router.get("/profile", verifyToken, getProfile);




router.get(
  "/all-users",
  verifyToken,
  authorizeRoles("admin","HOD"),
  getAllUsers
);

router.put(
  "/update/:id",
  verifyToken,
  authorizeRoles("admin"),
  updateUser
);

router.delete(
  "/delete/:id",
  verifyToken,
  authorizeRoles("admin"),
  deleteUser
);




router.get(
  "/hod-dashboard",
  verifyToken,
  authorizeRoles("HOD"),
  (req, res) => {
    res.json({ message: "Welcome HOD" });
  }
);



router.get(
  "/teacher-dashboard",
  verifyToken,
  authorizeRoles("teacher"),
  (req, res) => {
    res.json({ message: "Welcome Teacher" });
  }
);




router.get(
  "/student-dashboard",
  verifyToken,
  authorizeRoles("student"),
  (req, res) => {
    res.json({ message: "Welcome Student" });
  }
);

export default router;