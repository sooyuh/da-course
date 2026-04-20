import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Register from './pages/Register';
import Resources from './pages/Resources';
import LearningPaths from './pages/LearningPaths';
import LearningPathDetail from './pages/LearningPathDetail';
import PersonalizedPaths from './pages/PersonalizedPaths';

function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/projects/:id" element={<ProjectDetail />} />
            <Route path="/resources" element={<Resources />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/learning-paths" element={<LearningPaths />} />
            <Route path="/learning-paths/:id" element={<LearningPathDetail />} />
            <Route path="/personalized-paths" element={<PersonalizedPaths />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;