import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

//register user

export const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, role, branch, year } = req.body;

    if (!name || !email || !password || !role) {
        throw new ApiError(400, "All required fields must be provided");
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
        throw new ApiError(409, "User already exists with this email");
    }

    const user = await User.create({
        name,
        email,
        password,
        role,
        branch,
        year,
    });

    return res
        .status(201)
        .json(new ApiResponse(201, user, "User registered successfully"));
});

//login user

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new ApiError(400, "Email and password are required");
    }

    const user = await User.findOne({ email });

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await user.ispasswordCorrect(password);

    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const accessToken = user.generateAccessToken();

    const options = {
        httpOnly: true,
        secure: false,
        sameSite:"lax",
        maxAge: 2*24*60*60*1000,
    };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .json(
            new ApiResponse(200, { user, accessToken }, "Login successful")
        );
});


// LOGOUT USER

export const logoutUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .clearCookie("accessToken")
        .json(new ApiResponse(200, null, "Logged out successfully"));
});

//getCurrentUser Profile
export const getProfile = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(200, req.user, "User profile fetched"));
});

//getAll users

export const getAllUsers = asyncHandler(async (req, res) => {
    let users;


    if (req.user.role === "admin") {
        users = await User.find().select("-password");
    }

    else if (req.user.role === "HOD") {
        users = await User.find({
            branch: req.user.branch
        }).select("-password");
    }

    else {
        throw new ApiError(403, "Access denied");
    }

    return res.status(200).json(
        new ApiResponse(200, users, "Users fetched successfully")
    );
});

//update User

export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const user = await User.findById(id);
    Object.assign(user, req.body);
    await user.save();

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, user, "User updated successfully"));
});

//Delete User

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const deletedUser = await User.findByIdAndDelete(id);

    if (!deletedUser) {
        throw new ApiError(404, "User not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, null, "User deleted successfully"));
});