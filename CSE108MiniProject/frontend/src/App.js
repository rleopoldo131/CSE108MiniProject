import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


//import pages
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import Login from './pages/Login/Login';

import TeacherPage from './pages/TeacherPage/TeacherPage';
import TeacherCourse from './pages/TeacherPage/TeacherCourse';
import StudentPage from './pages/StudentPage/StudentPage';
import MyCourses from './pages/StudentPage/MyCourses';
import AvailableCourses from './pages/StudentPage/AvailableCourses';

import Admin from "./pages/Admin/Admin";



//global style
import ProtectedRoute from "./components/ProtectedRoutes";

import './App.css';


function App() {
  return (
    <Router>
      <Routes>
          <Route path="/" element={<Home />} />
        < Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route
            path="/studentpage"
            element={
              <ProtectedRoute allowedRole="student">
                <StudentPage />
              </ProtectedRoute>
            }
          />
            <Route
             path="/studentpage/mycourses"
              element={
            <ProtectedRoute allowedRole="student">
              <MyCourses />
            </ProtectedRoute>
          }
        />
        <Route
          path="/studentpage/available"
              element={
            <ProtectedRoute allowedRole="student">
              <AvailableCourses />
            </ProtectedRoute>
             }
          />
            
          <Route
            path="/teacherpage"
            element={
              <ProtectedRoute allowedRole="teacher">
                <TeacherPage />
              </ProtectedRoute>
            }
          />
          <Route
          path="/teacher/courses/:courseId"
          element={<TeacherCourse />}
        />
          <Route path="/admin" element={<Admin />} />

        </Routes>
    </Router> 
    
  );
}

export default App;
