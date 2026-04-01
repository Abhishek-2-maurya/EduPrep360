import OpenAI from "openai";
import { Test } from "../models/test.model.js";
import { Question } from "../models/question.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const client = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
    baseURL: "https://api.groq.com/openai/v1",
});

export const aiCreateTest = asyncHandler(async (req, res) => {
  const { prompt } = req.body;

  const completion = await client.chat.completions.create({
    model: "meta-llama/llama-4-scout-17b-16e-instruct",
    messages: [
      {
        role: "system",
        content: `
You are an AI teacher assistant.

Generate MCQ test in JSON format only.

Format:
{
  "title": "",
  "subject": "",
  "duration": 30,
  "year": "2nd",
  "passingMarks": 40,
  "questions": [
    {
      "question": "",
      "options": ["", "", "", ""],
      "correctAnswer": 0
    }
  ]
}

Return ONLY JSON.
`
      },
      { role: "user", content: prompt },
    ],
    temperature: 0.7,
  });

  const aiText = completion.choices[0].message.content;

  const cleanedText = aiText
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  let aiData;
  try {
    aiData = JSON.parse(cleanedText);
  } catch (err) {
    console.log("AI RAW:", aiText);
    return res.status(500).json({ message: "AI returned invalid JSON" });
  }

  const test = await Test.create({
    title: aiData.title,
    subject: aiData.subject,
    duration: aiData.duration,
    year: aiData.year,
    passingMarks: aiData.passingMarks,
    branch: req.user.branch,
    teacherId: req.user._id,
    availabilityHours: 12, 
    startTime: null,
    endTime: null,
    isActive: false,
  });
  console.log(test);
  const createdQuestions = await Question.insertMany(aiData.questions);
  test.questions = createdQuestions.map((q) => q._id);
  await test.save();

  return res.status(201).json({
    success: true,
    message: "AI Test Created Successfully",
    test,
  });
});