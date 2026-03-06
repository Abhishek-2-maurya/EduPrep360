import { api } from "../api/axios";

//studetn service

// Start Test
export const startTest = async (data) => {
  const res = await api.post("/results/start", data);
  return res.data;
};

// Submit Test
export const submitTest = async (data) => {
  const res = await api.post("/results/submit", data);
  return res.data;
};

// Get Student Result History
export const getStudentResults = async () => {
  const res = await api.get("/results/history");
  return res.data;
};

export const deleteResult = async (resultId) => {
  const res = await api.delete(`/results/${resultId}`);
  return res.data;
};



//   TEACHER SERVICES


// Get all results of a specific test (student list + scores)
export const getTestResultsList = async (testId) => {
  const res = await api.get(`/results/test/${testId}`);
  return res.data;
};

// Get Test Analytics
export const getTestAnalytics = async (testId) => {
  const res = await api.get(`/results/teacher/${testId}`);
  return res.data;
};


/* =========================
   HOD SERVICES
========================= */

export const getHodDashboard = async () => {
  const res = await api.get("/results/hod-dashboard");
  return res.data;
};


/* =========================
   ADMIN SERVICES
========================= */

export const getAdminDashboard = async () => {
  const res = await api.get("/results/admin-dashboard");
  return res.data;
};