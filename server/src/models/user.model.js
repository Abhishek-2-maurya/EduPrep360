import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt"
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin","HOD", "teacher", "student"],
      required: true,
    },

    branch: {
      type: String,
      required: function () {
        return this.role !== "admin";
      },
      enum: ["BCA", "BTECH", "BBA"],
    },

    year: {
      type: String,
      required: function () {
        return this.role === "student";
      },
      enum: ["1st", "2nd", "3rd", "4th"],
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next;

    this.password = await bcrypt.hash(this.password,10);
    // next();
})

userSchema.methods.ispasswordCorrect = async function(password){
  return await bcrypt.compare(password,this.password);
}

userSchema.methods.toJSON = function () {
  const user = this.toObject();
  delete user.password;
  return user;
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      id: this._id,
      role: this.role,
      branch: this.branch,
      year: this.year,
    },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    }
  );
};

const User = mongoose.model("User", userSchema);
export {User}