import React, { useEffect, useState } from 'react';
import axios from "axios";
import { Link } from 'react-router-dom';
import Layout from "../components/Layout";
import { useToast } from '../components/ToastProvider';
import OverlayLoader from "../components/OverlayLoader";

const Leaderboards = () => {
    const { showToast } = useToast();

    const [allUsers, setAllUsers] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const usersPerPage = 10;

    const getUsers = async () => {
        try {
            setLoading(true)
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/user/`);
            const sortedUsers = res.data.sort((a, b) => b.aura_points - a.aura_points); // Sort by aura points (descending)
            setAllUsers(sortedUsers);
            setLoading(false)
        } catch (err) {
            setLoading(false)
            showToast({ message: err.response?.data?.message || err.message || "Something went wrong while fetching leaderboards data . Please contact on help.", type: "error" });
        }
    };

    useEffect(() => { getUsers(); }, []);

    // Pagination logic
    const indexOfLastUser = currentPage * usersPerPage;
    const indexOfFirstUser = indexOfLastUser - usersPerPage;
    const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

    const nextPage = () => {
        if (currentPage < Math.ceil(allUsers.length / usersPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const prevPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Layout title="🏆 Leaderboards">
            <OverlayLoader loading={loading}>
                <div className="bg-white shadow-md rounded-lg  p-6">

                    {allUsers.length > 0 ? (
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
                                <thead className="bg-blue-500 text-white">
                                    <tr>
                                        <th className="py-3 px-6 text-left">Rank</th>
                                        <th className="py-3 px-6 text-left">Name</th>
                                        <th className="py-3 px-6 text-left">Reg No</th>
                                        <th className="py-3 px-6 text-left">Aura Points</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {currentUsers.map((user, index) => (
                                        <tr key={user._id} className={`border-b hover:bg-gray-100 ${index < 3 ? 'bg-yellow-100 font-bold' : ''}`}>
                                            <td className="py-3 px-6">{indexOfFirstUser + index + 1}</td>
                                            <td className="py-3 px-6">
                                                <Link
                                                    to="/other-user-profile"
                                                    state={{ reg_no: user.reg_no }}
                                                    className="text-blue-600 hover:underline">
                                                    {user.name}
                                                </Link>
                                            </td>
                                            <td className="py-3 px-6">{user.reg_no}</td>
                                            <td className="py-3 px-6">{user.aura_points}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p className="text-center text-gray-500 mt-4">No users found.</p>
                    )}

                    {/* Pagination Controls */}
                    {allUsers.length > usersPerPage && (
                        <div className="flex justify-between items-center mt-4">
                            <button
                                onClick={prevPage}
                                className="btn btn-outline btn-primary"
                                disabled={currentPage === 1}>
                                ◀ Previous
                            </button>
                            <span className="text-gray-700">Page {currentPage} of {Math.ceil(allUsers.length / usersPerPage)}</span>
                            <button
                                onClick={nextPage}
                                className="btn btn-outline btn-primary"
                                disabled={currentPage === Math.ceil(allUsers.length / usersPerPage)}>
                                Next ▶
                            </button>
                        </div>
                    )}
                </div>
            </OverlayLoader>
        </Layout>
    );
};

export default Leaderboards;
