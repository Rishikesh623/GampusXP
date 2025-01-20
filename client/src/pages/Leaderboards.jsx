import React, { useEffect, useState } from 'react';
import axios from "axios";

const Leaderboards = () => {
    const [allUser, setAllUsers] = useState([]);

    const getUsers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/user/");

            setAllUsers(res.data);
            // console.log(res.data);

        }
        catch (err) {
            console.log("Error in getUsers", err);
        }
    }

    useEffect(() => {
        getUsers();
    }, [])

    // console.log(allUser);
    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Leaderboards</h1>

            <div className="space-y-4">
                {allUser.length > 0 ? (
                    allUser.map((user, index) => (
                        <div key={user._id} className="p-4 bg-white rounded-lg shadow-sm">
                            <h2 className="text-lg font-semibold">Rank {index + 1} : {user.name}</h2>
                            <p>Aura Points: {user.aura_points}</p>
                        </div>
                    ))
                ) : (
                    <p>No users found.</p>
                )}
            </div>
        </div>
    );
};

export default Leaderboards;
