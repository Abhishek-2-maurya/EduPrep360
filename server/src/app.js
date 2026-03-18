import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
// import dotenv from "dotenv";

// dotenv.config({path:"./.env"});

const app = express();

app.use(cors({
    origin:process.env.ORIGIN,
    credentials:true
}));

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true}));
app.use(express.static("public"));
app.use(cookieParser());



app.get("/",(req,res)=>{
    res.send("root is working")
})

import userRouter from "./routes/user.routes.js";
app.use("/api/user",userRouter);

import testRoutes from "./routes/test.routes.js";
app.use("/api/tests", testRoutes);

import resultRoute from "./routes/result.routes.js"
app.use("/api/results", resultRoute)

import noteRoute from "./routes/note.routes.js"
app.use("/api/note",noteRoute);

app.use((err, req, res, next) => {
  console.error("Global Error:", err);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || "Internal Server Error",
    errors: err.errors || [],
  });
});

export {app};