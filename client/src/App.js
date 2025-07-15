import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import 'material-icons/iconfont/material-icons.css';
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
import Achievements from './pages/Achievements';
import OtherUserProfile from './pages/OtherUserProfile'
import './style.css';
import Profile from './pages/Profile';
import axios from 'axios';
import { logout, setUserProfile, updateShowRecentActivityFlag } from '../src/redux/user/userSlice';
import PrivateRoute from './components/PrivateRouter';
import CoordinatorPrivateRouter from './components/CoordinatorPrivateRouter';
import Welcome from './pages/Welcome';
import NotFound from './pages/NotFound';
import Coordinator from './pages/Coordinator';
import Activity from './pages/Activity';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const App = () => {
  const queryClient = new QueryClient();
  const theme = useSelector((state) => state.theme);

  const dispatch = useDispatch();

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/profile`, {
          withCredentials: true, // Include cookies in the request
        });
        const data = res.data;

        if (data && data.reg_no) {
          dispatch(setUserProfile({
            name: data.name,
            reg_no: data.reg_no,
            email: data.email,
            aura_points: data.aura_points,
            showRecentActivity: data.showRecentActivity
          }));
        }

      } catch (error) {
        dispatch(logout());
        // console.error('Error fetching profile:', error);
      }
    }

    fetchProfile();
  }, [dispatch]);

  // console.log(theme);


  return (
    <QueryClientProvider client={queryClient}>
      <div className={`app-container theme-${theme}`}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/welcome" element={<Welcome />} />
          <Route path="/main" element={<PrivateRoute><Main /></PrivateRoute>} />
          <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
          <Route path="/activity" element={<PrivateRoute><Activity /></PrivateRoute>} />
          <Route path="/profile/u/:reg_no" element={<PrivateRoute><OtherUserProfile /></PrivateRoute>} />
          <Route path="/course-management-user" element={<PrivateRoute><CourseManagementUser /></PrivateRoute>} />
          <Route path="/assignment-tracking" element={<PrivateRoute><AssignmentTracking /></PrivateRoute>} />
          <Route path="/achievements" element={<PrivateRoute><Achievements /></PrivateRoute>} />
          <Route path="/leaderboards" element={<PrivateRoute><Leaderboards /></PrivateRoute>} />
          <Route path="/rewards-challenges" element={<PrivateRoute><RewardsAndChallenges /></PrivateRoute>} />
          <Route path="/proposed-challenges" element={<PrivateRoute><ProposedChallenges /></PrivateRoute>} />
          <Route path="/accepted-challenges" element={<PrivateRoute><AcceptedChallenges /></PrivateRoute>} />
          <Route path="/timetable" element={<PrivateRoute><Timetable /></PrivateRoute>} />
          <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
          <Route path="/coordinator" element={<CoordinatorPrivateRouter><Coordinator /></CoordinatorPrivateRouter>} />
          <Route path="/coordinator/challenges-management" element={<CoordinatorPrivateRouter><CoordinatorChallenges /></CoordinatorPrivateRouter>} />
          <Route path="/coordinator/course-management" element={<CoordinatorPrivateRouter><CourseManagementCoordinator /></CoordinatorPrivateRouter>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
    </QueryClientProvider>

  );
}

export default App;
