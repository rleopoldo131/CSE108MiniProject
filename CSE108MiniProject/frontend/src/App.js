import React from 'react';
import {BrowserRouter as Router, Routes, Route} from 'react-router-dom';


//import pages
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import TeacherPage from './pages/TeacherPage/TeacherPage';

//global style

import './App.css';


function App() {
  return (
    <Router>
      <Routes>
        <Route path = "/" element ={<Home />} />
        <Route path = "/register" element ={<Register />} />
        <Route path = "/teacherpage" element ={<TeacherPage />} />


        {/* <Route path = "/" element ={<Home />} />
        <Route path = "/" element ={<Home />} />
        <Route path = "/" element ={<Home />} /> */}

      </Routes>
    </Router>
    
  );
}

export default App;
