import { Note } from "../models/notes.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import cloudinary from "../utils/cloudniary.js";

export const createNote = asyncHandler(async (req, res) => {
  const { title, description, subject, branch, year } = req.body;

  if (!title || !subject || !branch || !year) {
    throw new ApiError(400, "All required fields missing");
  }

  if (!req.file) {
    throw new ApiError(400, "PDF file is required");
  }

  const note = await Note.create({
    title,
    description,
    subject,
    branch,
    year,
    fileUrl: req.file.path,
    filePublicId: req.file.filename,
    teacherId: req.user._id,
  });


  return res
    .status(201)
    .json(new ApiResponse(201, note, "Note created successfully"));
});


export const getNotes = asyncHandler(async (req, res) => {
  const user = req.user;
  let filter = {};

  if (user.role === "student") {
    filter = {
      branch: user.branch,
      year: user.year,
    };
  }

  if (user.role === "teacher") {
    filter = {
      teacherId: user._id,
    };
  }

  const notes = await Note.find(filter)
    .populate("teacherId", "name email")
    .sort({ createdAt: -1 });

  return res
    .status(200)
    .json(new ApiResponse(200, notes, "Notes fetched"));
});


export const updateNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);

  if (!note) throw new ApiError(404, "Note not found");

  if (note.teacherId.toString() !== req.user._id.toString()) {
    throw new ApiError(403, "Unauthorized");
  }


  if (req.file) {
    await cloudinary.uploader.destroy(note.filePublicId, {
      resource_type: "raw",
    });

    note.fileUrl = req.file.path;
    note.filePublicId = req.file.filename;
  }

  Object.assign(note, req.body);
  await note.save();

  return res
    .status(200)
    .json(new ApiResponse(200, note, "Note updated"));
});


export const deleteNote = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const note = await Note.findById(id);

  if (!note) throw new ApiError(404, "Note not found");
  console.log("Note teacher:", note.teacherId.toString());
  console.log("Logged user:", req.user._id.toString());
  console.log("Role:", req.user.role);
  if (
    note.teacherId.toString() !== req.user._id.toString() &&
    req.user.role !== "admin" && req.user.role !== "HOD"
  ) {
    throw new ApiError(403, "Unauthorized");
  }

  await cloudinary.uploader.destroy(note.filePublicId, {
    resource_type: "raw",
  });

  await note.deleteOne();

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Note deleted successfully"));
});