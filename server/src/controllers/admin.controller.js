import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";


export const updateUserRole = asyncHandler(async (req, res) => {
  const { userId, role } = req.body;

  if (!["teacher", "HOD"].includes(role)) {
    throw new ApiError(400, "Invalid role");
  }

  const user = await User.findById(userId);
  if (!user) throw new ApiError(404, "User not found");

  user.role = role;
  user.status = "approved";

  await user.save();

  return res.json(
    new ApiResponse(200, user, "User role updated")
  );
});