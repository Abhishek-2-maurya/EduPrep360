import { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { api } from './api/axios';
import { setCredentials, setLoading } from './store/authSlice';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { CreateTest } from './pages/CreateTest';
import { ManageTests } from './pages/ManageTest';
import { AvailableTests } from './pages/teacher/AvailableTest';
import { TakeTest } from './pages/TakeTest';
import { AdminDashboard } from './components/AdminDashboard';
// import { HodDashboard } from './components/HodDashboard';
import { TeacherDashboard } from './components/TeacherDashboard';
import { StudentDashboard } from './components/StudentDashboard';
import { AdminUsers } from './pages/admin/AdminUsers';
import { HodDashboard } from './components/HodDashboard';
import { HodUsers } from './pages/HodUsers';
import { HodTests } from './pages/HodTests';
import { StudentNotes } from './pages/student/StudentNotes';
import { TeacherNotes } from './pages/teacher/TeacherNotes';
import { HodNotes } from './pages/HOD/HodNotes';
import { AdminNotes } from './pages/admin/AdminNotes';
import { TeacherTestAnalytics } from './pages/teacher/TeacherTestAnalytics';
import { TeacherTestResults } from './pages/teacher/TeacherTestResult';
import { LandingPage } from './components/LandingPage';
import { StudentResultHistory } from './pages/student/StudentResultHistory';
import { HodTestAnalytics } from './pages/HOD/HodTestAnalytics';
const Placeholder = ({ title }) => (
  <div>
    <h1 className="text-2xl font-bold text-gray-800">{title}</h1>
    <p className="text-gray-500 mt-2">Content coming soon...</p>
  </div>
);

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await api.get('/user/profile');
        dispatch(setCredentials(res.data.data));
      } catch (error) {
        dispatch(setLoading(false));
      }
    };
    fetchProfile();
  }, [dispatch]);

  return (
    <>
      <Toaster position="top-right" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />


          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/test/:testId" element={<TakeTest />} />
          </Route>


          <Route element={<Layout />}>

            {/* Admin Routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/notes" element={<AdminNotes />} />
              <Route path="/admin/settings" element={<Placeholder title="Admin Settings" />} />

            </Route>

            {/* HOD Routes */}
            <Route element={<ProtectedRoute allowedRoles={['HOD']} />}>
              <Route path="/hod/dashboard" element={<HodDashboard />} />
              <Route path="/hod/users" element={<HodUsers />} />
              <Route path="/hod/tests" element={<HodTests />} />
              <Route path="/hod/notes" element={<HodNotes />} />
              <Route path="/hod/test/:testId/analytics" element={<HodTestAnalytics/>}/>
            </Route>

            {/* Teacher Routes */}
            <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
              <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
              <Route path="/teacher/tests/manage" element={<ManageTests />} />
              <Route path="/teacher/tests/create" element={<CreateTest />} />
              <Route
                path="/teacher/tests/:testId/analytics"
                element={<TeacherTestAnalytics />}
              />
              <Route
                path="/teacher/tests/:testId/results"
                element={<TeacherTestResults />}
              />
              <Route
                path="/teacher/notes"
                element={<TeacherNotes />}
              />

            </Route>

            {/* Student Routes */}
            <Route element={<ProtectedRoute allowedRoles={['student']} />}>
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              <Route path="/student/tests" element={<AvailableTests />} />
              {/* Note: TakeTest was moved up to the Full Screen section */}
              <Route
                path="/student/history"
                element={<StudentResultHistory />}
              />
              <Route path="/student/notes" element={<StudentNotes />} />
            </Route>

          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;