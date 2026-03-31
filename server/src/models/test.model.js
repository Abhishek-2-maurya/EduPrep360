import mongoose from "mongoose";

const testSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  subject: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
    min: 1,
  },
  teacherId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  branch: {
    type: String,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  passingMarks: {
    type: Number,
    required: true,
    default: 40
  },
  startTime: {
    type: Date,
    default: null
  },
  endTime: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: false
  },
  availabilityHours: {
    type: Number,
    required: true
  },
   questions: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true
    }
  ],
},
  { timestamps: true }
)

const Test = mongoose.model("Test", testSchema);
export { Test };