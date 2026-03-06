import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    testId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Test",
      required: true,
    },

    score: {
      type: Number,
     
    },

    totalMarks: {
      type: Number,
      
    },

    percentage: {
      type: Number,
      
    },

    status: {
      type: String,
      enum: ["in-progress","pass", "fail"],
      default:"in-progress",
    },
    startedAt: {
      type: Date,
    },

    submittedAt: {
      type: Date,
    },
    expiresAt: {
      type: Date,
    },
    // resultPdfUrl: String,
    // resultPdfPublicId: String,
  },
  { timestamps: true }
);


resultSchema.index({ studentId: 1, testId: 1 }, { unique: true });

export const Result = mongoose.model("Result", resultSchema);