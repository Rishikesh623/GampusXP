import React, { useEffect } from 'react';
import { useNavigate, BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
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
import Profile from './pages/Profile';
import axios from 'axios';
import { setUserProfile } from '../src/redux/user/userSlice';

const App = () => {
  const theme = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get('http://localhost:5000/user/profile', {
          withCredentials: true, // Include cookies in the request
        });

        const data = res.data;

        if (!res) {
          console.log(data.message);
          return;
        }



        if (data && data.reg_no) {
          console.log(data);
          dispatch(setUserProfile({
            name: data.name,
            reg_no: data.reg_no,
            email: data.email
        }));
        }

      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    }

    fetchProfile();
  }, []);

  // console.log(theme);


  return (
    <div className={`app-container theme-${theme}`}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/main" element={<Main />} />
        <Route path="/profile" element={<Profile />} />
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
