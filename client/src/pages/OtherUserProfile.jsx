import React from 'react';
import { useLocation } from 'react-router-dom';
import ProfileView from '../components/ProfileView';
import axios from "axios";
import { useQuery } from '@tanstack/react-query';

const fetchUserProfile = async (regNo) => {
    const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/profile/${regNo}`);
    return res.data;
};

const OtherUserProfile = () => {
    const location = useLocation();
    const regNo = location.state?.reg_no;

    const {
        data,
        isLoading,
        isError,
        error,
    } = useQuery({
        queryKey: ['userProfile', regNo], // Caches per regNo!
        queryFn: () => fetchUserProfile(regNo),
        enabled: !!regNo, // Only run query if regNo is available
    });

    if (isLoading) return <div>Loading...</div>;
    if (isError) return <div className="text-center text-red-600 py-8">{error?.message || "Error loading profile."}</div>;

    return (
        <ProfileView
            other={true}
            currentUser={data?.userProfile || {}}
            achievements={data?.achievements || []}
            recentActivities={data?.activities || []}
            hiddenActivityMsg={!data.showRecentActivity}
        />
    );
};

export default OtherUserProfile;
