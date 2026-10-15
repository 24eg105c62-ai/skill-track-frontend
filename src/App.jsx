import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';

// Public Pages
import Login from './pages/Login';
import Register from './pages/Register';

// Protected Student Pages
import Dashboard from './pages/Dashboard';
import Courses from './pages/Courses';
import CourseDetail from './pages/CourseDetail';
import Quizzes from './pages/Quizzes';
import QuizPlayer from './pages/QuizPlayer';
import Results from './pages/Results';
import Predictions from './pages/Predictions';
import PdfSummarizer from './pages/PdfSummarizer';
import Achievements from './pages/Achievements';
import Profile from './pages/Profile';

// Protected Admin Pages
import AdminOverview from './pages/AdminOverview';
import AdminStudents from './pages/AdminStudents';
import AdminCourses from './pages/AdminCourses';
import AdminQuizzes from './pages/AdminQuizzes';
import AdminAnalytics from './pages/AdminAnalytics';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public authentication routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected authenticated routes with persistent layout */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="courses" element={<Courses />} />
              <Route path="courses/:id" element={<CourseDetail />} />
              <Route path="quizzes" element={<Quizzes />} />
              <Route path="quiz/:id" element={<QuizPlayer />} />
              <Route path="results" element={<Results />} />
              <Route path="predictions" element={<Predictions />} />
              <Route path="pdf-summarizer" element={<PdfSummarizer />} />
              <Route path="achievements" element={<Achievements />} />
              <Route path="profile" element={<Profile />} />

              {/* Admin Panel routes (Requires ROLE_ADMIN) */}
              <Route
                path="admin"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminOverview />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/students"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminStudents />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/courses"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminCourses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/quizzes"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminQuizzes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="admin/analytics"
                element={
                  <ProtectedRoute requireAdmin={true}>
                    <AdminAnalytics />
                  </ProtectedRoute>
                }
              />
            </Route>

            {/* Fallback route */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
