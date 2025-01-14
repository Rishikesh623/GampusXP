import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setTheme } from '../redux/theme/themeSlice';
import { setChallengeS } from '../redux/challenges/challengesSlice';

const RewardsChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [newChallenge, setNewChallenge] = useState({
        title: '',
        description: '',
        aura_points: '',
        end_date: '',
        invitedUsers: [], // Stored as an array
        isPublic: false,
    });
    const [invitedUsersInput, setInvitedUsersInput] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setNewChallenge((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };

    const handleInvitedUsersChange = (e) => {
        setInvitedUsersInput(e.target.value);
    };

    const handleThemeChange = (event) => {
        dispatch(setTheme(event.target.value));
    }

    const currentTheme = useSelector((state) => state.theme);

    const proposeChallengeHandler = async (e) => {
        e.preventDefault();
        try {

            const response = await axios.post("http://localhost:5000/challenges/propose",
                newChallenge, {
                withCredentials: true
            }

            );
            console.log(response.data);
            alert("Challenge proposed successfully!");
            setShowModal(false);
            setNewChallenge({
                title: '',
                description: '',
                aura_points: '',
                end_date: '',
                invitedUsers: [],
                isPublic: false,
            });
            setInvitedUsersInput('');
        } catch (err) {
            console.error("Error proposing challenge:", err.response?.data?.message || err.message);
        }
    };

    const getChallenges = async () => {
        try {
            const res = await axios.get("http://localhost:5000/challenges/accepted", {
                headers: {
                    coordinator: "true" // Include the required header
                },
                withCredentials: true
            })

            setChallenges(res.data.challenges);
            dispatch(setChallengeS(res.data.challenges));
            console.log(res.data);
        }
        catch (err) {
            console.error("Error fetching courses:", err.response?.data?.message || err.message);
        }
    }

    useEffect(() => {
        getChallenges();
    }, [])

    const completeChallengeHandler = async (challenge) => {
        try {
            const res = await axios.patch("http://localhost:5000/challenges/complete", challenge, {
                withCredentials: true
            })

            if (res.status === 200)
                setSuccess(res.data.message)

            setError(null)

            getChallenges();

            console.log(res.data)
        }
        catch (err) {
            setError(err.response.data.message)
            setSuccess(null)
            console.log("Error in completeChallengeHandler", err.response?.data?.message || err.message)
        }
    }

    const handleInviteClick = async () => {

        try {
            const reg_no = invitedUsersInput;

            const res = await axios.get(`http://localhost:5000/user/profile/${reg_no}`, {
                withCredentials: true,
            });

            const data = res.data;

            let invitedUsers = [...newChallenge.invitedUsers];
            invitedUsers.push(data.userProfile._id);

            setNewChallenge((prev) => ({
                ...prev,
                invitedUsers,
            }));

        }
        catch (err) {
            console.log(err);
            if (err.response.status === 404) {
                alert("USer not found");
            }
        }


    }

    const handleRemoveUser = (_id) => {

        // console.log(invitedUsers)
        let invitedUsers = newChallenge.invitedUsers.filter((id) => id !== _id);
        console.log(invitedUsers)

        setNewChallenge((prev) => ({
            ...prev,
            invitedUsers,
        }));
        console.log(invitedUsers)

    }

    return (
        <div className="p-6">
            <div className="flex-1">
                {/* Top Navigation Bar */}
                <header className="flex items-center justify-between px-6 py-4 bg-white border-b">
                    <div className="flex items-center space-x-4">
                        <div className="flex items-center justify-center h-16 border-b">
                            <h1 className="text-xl font-bold text-blue-600">CampusXP</h1>
                        </div>
                    </div>

                    <div className="flex space-x-6 items-end justify-center">
                        <div className="flex space-x-2 items-center justify-center h-16 border-b">
                            <button
                                onClick={() => navigate("/rewards-challenges")}
                                className={`mt-6 px-4 py-2 rounded-lg mb-6 ${window.location.pathname === "/rewards-challenges"
                                    ? "bg-blue-300 text-white"
                                    : "bg-blue-600 text-white hover:bg-blue-400"
                                    }`}
                            >
                                Public Challenges
                            </button>
                        </div>

                        <div className="flex space-x-2 items-center justify-center h-16 border-b">
                            <button
                                onClick={() => navigate("/proposed-challenges")}
                                className={`mt-6 px-4 py-2 rounded-lg mb-6 ${window.location.pathname === "/proposed-challenges"
                                    ? "bg-blue-300 text-white"
                                    : "bg-blue-600 text-white hover:bg-blue-400"
                                    }`}
                            >
                                Proposed Challenges
                            </button>
                        </div>

                        <div className="flex space-x-2 items-center justify-center h-16 border-b">
                            <button
                                onClick={() => navigate("/accepted-challenges")}
                                className={`mt-6 px-4 py-2 rounded-lg mb-6 ${window.location.pathname === "/accepted-challenges"
                                    ? "bg-blue-300 text-white"
                                    : "bg-blue-600 text-white hover:bg-blue-400"
                                    }`}
                            >
                                Accepted Challenges
                            </button>
                        </div>
                    </div>


                    <div className="flex items-center space-x-4">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn m-1">
                                Theme
                                <svg
                                    width="12px"
                                    height="12px"
                                    className="inline-block h-2 w-2 fill-current opacity-60"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 2048 2048">
                                    <path d="M1799 349l242 241-1017 1017L7 590l242-241 775 775 775-775z"></path>
                                </svg>
                            </div>
                            <ul tabIndex={0} className="dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow-2xl">
                                <li>
                                    <input
                                        type="radio"
                                        name="theme-dropdown"
                                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                        aria-label="Default"
                                        value="default"
                                        onChange={handleThemeChange}
                                        checked={currentTheme === 'default'} />
                                </li>
                                <li>
                                    <input
                                        type="radio"
                                        name="theme-dropdown"
                                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                        aria-label="Retro"
                                        value="retro"
                                        onChange={handleThemeChange}
                                        checked={currentTheme === 'retro'} />
                                </li>
                                <li>
                                    <input
                                        type="radio"
                                        name="theme-dropdown"
                                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                        aria-label="Cyberpunk"
                                        value="cyberpunk"
                                        onChange={handleThemeChange}
                                        checked={currentTheme === 'cyberpunk'} />
                                </li>
                                <li>
                                    <input
                                        type="radio"
                                        name="theme-dropdown"
                                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                        aria-label="Valentine"
                                        value="valentine"
                                        onChange={handleThemeChange}
                                        checked={currentTheme === 'valentine'} />
                                </li>
                                <li>
                                    <input
                                        type="radio"
                                        name="theme-dropdown"
                                        className="theme-controller btn btn-sm btn-block btn-ghost justify-start"
                                        aria-label="Aqua"
                                        value="aqua"
                                        onChange={handleThemeChange}
                                        checked={currentTheme === 'aqua'} />
                                </li>
                            </ul>
                        </div>
                    </div>
                </header >
            </div>

            <div className="p-6">

                <div className="mt-5 space-y-4">
                    {challenges.length > 0 ? (
                        <>
                            {challenges.filter((challenge) => challenge.participantDetails?.status === 'in-progress').map((challenge) => (
                                <div
                                    key={challenge._id}
                                    className="p-4 border rounded-lg shadow-sm bg-gray-50"
                                >
                                    <h2 className="text-lg font-semibold">{challenge.title}</h2>
                                    <p className="text-sm text-gray-600">{challenge.description}</p>
                                    <p className="text-sm text-gray-500">Aura Points: {challenge.aura_points}</p>
                                    <p className="text-sm text-gray-500">Due Date: {new Date(challenge.end_date).toLocaleDateString()}</p>

                                    <button
                                        onClick={() => completeChallengeHandler(challenge)}
                                        className={`mt-2 mx-1 px-4 py-2 rounded-lg ${challenge.participantDetails?.status === 'completed'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-blue-100 text-blue-600'
                                            }`}
                                    >
                                        {challenge.participantDetails?.status === 'completed'
                                            ? 'Completed'
                                            : 'Complete'}
                                    </button>
                                </div>
                            ))}

                            {challenges.filter((challenge) => challenge.participantDetails?.status === 'completed').map((challenge) => (
                                <div
                                    key={challenge._id}
                                    className="p-4 border rounded-lg shadow-sm bg-gray-50"
                                >
                                    <h2 className="text-lg font-semibold">{challenge.title}</h2>
                                    <p className="text-sm text-gray-600">{challenge.description}</p>
                                    <p className="text-sm text-gray-500">Aura Points: {challenge.aura_points}</p>
                                    <p className="text-sm text-gray-500">Due Date: {new Date(challenge.end_date).toLocaleDateString()}</p>

                                    <button
                                        onClick={() => completeChallengeHandler(challenge)}
                                        className={`mt-2 mx-1 px-4 py-2 rounded-lg ${challenge.participantDetails?.status === 'completed'
                                            ? 'bg-green-500 text-white'
                                            : 'bg-blue-100 text-blue-600'
                                            }`}
                                    >
                                        {challenge.participantDetails?.status === 'completed'
                                            ? 'Completed'
                                            : 'Complete'}
                                    </button>
                                </div>
                            ))}
                        </>

                    ) : (
                        <p className="text-gray-500">No challenges available.</p>
                    )}


                </div>
                {error && <p className="mt-5 text-red-500 text-center">{error}</p>}
                {success && <p className="mt-5 text-green-500 text-center">{success}</p>}
            </div>

            <div>
                {showModal && (
                    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 className="text-xl font-semibold mb-4">Propose Challenge</h3>

                            <form onSubmit={proposeChallengeHandler}>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">Challenge Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={newChallenge.title}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        placeholder="Challenge Title"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">Challenge Description</label>
                                    <textarea
                                        name="description"
                                        value={newChallenge.description}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        placeholder="Challenge Description"
                                        rows="3"
                                        required
                                    ></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">Aura Points</label>
                                    <input
                                        type="number"
                                        name="aura_points"
                                        value={newChallenge.aura_points}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        placeholder="Aura Points"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">End Date</label>
                                    <input
                                        type="date"
                                        name="end_date"
                                        value={newChallenge.end_date}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        required
                                    />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold mb-2">
                                        Invite Users
                                    </label>
                                    <div className="flex items-center">
                                        <input
                                            type="text"
                                            value={invitedUsersInput}
                                            onChange={handleInvitedUsersChange}
                                            className="flex-grow p-2 border border-gray-300 rounded text-black bg-white"
                                            placeholder="e.g., user1,user2,user3"
                                        />
                                        <button
                                            onClick={handleInviteClick} // Replace with your function
                                            className="ml-2 px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600"
                                        >
                                            Invite
                                        </button>
                                    </div>
                                    <div className="mt-4 flex flex-wrap gap-2">
                                        {newChallenge?.invitedUsers.map((user, index) => (
                                            <span
                                                key={index}
                                                className="flex items-center bg-gray-200 text-gray-700 px-3 py-1 rounded-full text-sm"
                                            >
                                                {user}
                                                <button
                                                    onClick={() => handleRemoveUser(user)}
                                                    className="ml-2 text-red-500 hover:text-red-700"
                                                >

                                                </button>
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="block text-gray-600 font-semibold">Is Public</label>
                                    <input
                                        type="checkbox"
                                        name="isPublic"
                                        checked={newChallenge.isPublic}
                                        onChange={handleInputChange}
                                        className="ml-2"
                                    />
                                    <span className="ml-2 text-gray-600">Check if the challenge is public</span>
                                </div>
                                <div className="flex justify-end space-x-4">
                                    <button
                                        type="button"
                                        className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
                                        onClick={() => setShowModal(false)}
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="px-4 py-2 bg-blue-600 text-white rounded"
                                    >
                                        Propose Challenge
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div >
        </div>
    );
};

export default RewardsChallenges;
