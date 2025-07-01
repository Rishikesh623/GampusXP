import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Home from './pages/Home';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Main from './pages/Main';
import CourseManagementUser from './pages/CourseManagementUser';
import CourseManagementCoordinator from './pages/CourseManagementCoordinator';
import AssignmentTracking from './pages/AssignmentTracking';
import Leaderboards from './pages/Leaderboards';
import RewardsAndChallenges from './pages/RewardsChallenges';
import Timetable from './pages/Timetable';
import Settings from './pages/Settings';
import CoordinatorChallenges from './pages/CoordinatorChallenges';
import ProposedChallenges from './pages/ProposedChallenges';
import AcceptedChallenges from './pages/AcceptedChallenges';
import Achievement from './pages/Achievements';
import OtherUserProfile from './pages/OtherUserProfile'
import './style.css';
import Profile from './pages/Profile';
import axios from 'axios';
import { setUserProfile } from '../src/redux/user/userSlice';
import PrivateRoute from './components/PrivateRouter';

const App = () => {
  const theme = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/profile`, {
          withCredentials: true, // Include cookies in the request
        });
        const data = res.data;

        if (!res) {
          // console.log(data.message);
          return;
        }

        if (data && data.reg_no) {
          dispatch(setUserProfile({
            name: data.name,
            reg_no: data.reg_no,
            email: data.email,
            aura_points: data.aura_points
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
        <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/other-user-profile" element={<PrivateRoute><OtherUserProfile /></PrivateRoute>} />
        <Route path="/course-management-user" element={<PrivateRoute><CourseManagementUser /></PrivateRoute>} />
        <Route path="/course-management-coordinator" element={<PrivateRoute><CourseManagementCoordinator /></PrivateRoute>} />
        <Route path="/assignment-tracking" element={<PrivateRoute><AssignmentTracking /></PrivateRoute>} />
        <Route path="/achievement-tracking" element={<PrivateRoute><Achievement /></PrivateRoute>} />
        <Route path="/leaderboards" element={<PrivateRoute><Leaderboards /></PrivateRoute>} />
        <Route path="/rewards-challenges" element={<PrivateRoute><RewardsAndChallenges /></PrivateRoute>} />
        <Route path="/proposed-challenges" element={<PrivateRoute><ProposedChallenges /></PrivateRoute>} />
        <Route path="/accepted-challenges" element={<PrivateRoute><AcceptedChallenges /></PrivateRoute>} />
        <Route path="/coordinator-challenges" element={<PrivateRoute><CoordinatorChallenges /></PrivateRoute>} />
        <Route path="/timetable" element={<PrivateRoute><Timetable /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      </Routes>
    </div>
  );
}

export default App;
