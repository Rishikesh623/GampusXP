import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Main from './pages/Main';
import CourseManagement from './pages/CourseManagement';
import AssignmentTracking from './pages/AssignmentTracking';
import Leaderboards from './pages/Leaderboards';
import RewardsAndChallenges from './pages/RewardsChallenges';
import Timetable from './pages/Timetable';
import Settings from './pages/Settings';
import './style.css';

const App = () => {
  const theme = useSelector((state) => state.theme);
  console.log(theme);
  return (
    <div className={`app-container theme-${theme}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Main />} />
        <Route path="/course-management" element={<CourseManagement />} />
        <Route path="/assignment-tracking" element={<AssignmentTracking />} />
        <Route path="/leaderboards" element={<Leaderboards />} />
        <Route path="/rewards-challenges" element={<RewardsAndChallenges />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </div>
  );
}

export default App;
