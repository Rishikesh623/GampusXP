import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from "axios";
import ProfileView from '../components/ProfileView';

const Profile = () => {
    const currentUser = useSelector((state) => state.user);
    const achievements = useSelector((state) => state.achievement.achievement);
    const [recentActivities, setRecentActivities] = useState([]);

    useEffect(() => {

        const getRecentActivities = async () => {
            if (!recentActivities || recentActivities.length === 0) {
                try {
                    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/activity`, {
                        withCredentials: true,
                    });
                    if (res.data) {
                        setRecentActivities(res.data.activities);
                    }
                }
                catch (err) {
                    if (err?.response?.status === 404) {
                        return;
                    }
                    setRecentActivities([]);
                }
            }
        }
        getRecentActivities();

    }, [currentUser]);

    return (
        <ProfileView other={false} currentUser={currentUser}
            achievements={achievements} recentActivities={recentActivities} />
    );
};


export default Profile;
