import { useEffect, useState } from 'react';
import { logout } from '../redux/user/userSlice';
import { persistor } from '../redux/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CoordinatorChallenges = () => {
    const [challenges, setChallenges] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddChallengeForm, setShowAddChallengeForm] = useState(false);
    const [editChallengeForm, setEditChallengeForm] = useState(false);

    const [addNewChallengeForm, setAddNewChallengeForm] = useState({
        challenge_id: '',
        title: '',
        description: '',
        aura_points: '',
        end_date: ''
    });

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchChallenges = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/challenges/`, {
                headers: { coordinator: 'true' },
                withCredentials: true
            });
            setChallenges(res.data.challenges);
        } catch (err) {
            console.error("Error fetching challenges:",err);
        }
    };

    useEffect(() => {
        fetchChallenges();
    }, []);

    const filteredChallenges = challenges.filter((challenge) =>
        challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        challenge.aura_points.toString().includes(searchQuery)
    );

    const onAddNewChallengeHandler = () => {
        setShowAddChallengeForm(!showAddChallengeForm);
        setEditChallengeForm(false);
        setAddNewChallengeForm({
            challenge_id: '',
            title: '',
            description: '',
            aura_points: '',
            end_date: ''
        });
    };

    const onEditChallengeButton = (challenge) => {
        setShowAddChallengeForm(true);
        setEditChallengeForm(true);
        setAddNewChallengeForm({
            challenge_id: challenge._id,
            title: challenge.title,
            description: challenge.description,
            aura_points: challenge.aura_points,
            end_date: challenge.end_date?.split('T')[0] || ''
        });
    };

    const onChangeEditForm = (e) => {
        setAddNewChallengeForm({
            ...addNewChallengeForm,
            [e.target.name]: e.target.value
        });
    };

    const onSubmitEditForm = async (e) => {
        e.preventDefault();
        const url = editChallengeForm
            ? `${process.env.REACT_APP_BASE_URL}/challenges/edit`
            : `${process.env.REACT_APP_BASE_URL}/challenges/create`;

        try {
            await axios({
                method: editChallengeForm ? 'patch' : 'post',
                url,
                headers: { coordinator: true },
                data: addNewChallengeForm
            });

            fetchChallenges();
            setShowAddChallengeForm(false);
            setEditChallengeForm(false);
        } catch (err) {
            console.error("Error submitting challenge:", err.response?.data?.message || err.message);
        }
    };

    const onRemoveChallenge = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/challenges/delete`, {
                headers: { coordinator: true },
                data: { _id: id }
            });
            fetchChallenges();
        } catch (err) {
            alert(err.response?.data?.message || err.message);
        }
    };

    const logoutHandler = () => {
        dispatch(logout());
        persistor.purge();
        navigate("/signin");
    };

    return (
        <div data-theme="light" className="min-h-screen bg-base-100 px-8 py-6 space-y-10">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <img src="/logo.png" alt="GampusXP" className="h-16 w-auto bg-white rounded p-1" />
                </div>

                <h1 className="text-2xl font-semibold text-center flex-1 -ml-12">Challenge Management</h1>

                <button onClick={logoutHandler} className="btn btn-sm btn-outline">
                    Logout
                </button>
            </div>

            {/* Action Controls */}
            <div className="flex flex-wrap justify-between items-center gap-4">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Search by title or points..."
                        className="input input-bordered w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={onAddNewChallengeHandler} className="btn btn-outline">
                        ➕ Create Challenge
                    </button>
                </div>
                <button onClick={() => navigate('/coordinator')} className="btn btn-outline">
                   Go Back
                </button>
            </div>

            {/* Challenge Table */}
            <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Aura Points</th>
                            <th>End Date</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredChallenges.length > 0 ? (
                            filteredChallenges.map((c) => (
                                <tr key={c._id}>
                                    <td>{c.title}</td>
                                    <td>{c.aura_points}</td>
                                    <td>{new Date(c.end_date).toLocaleDateString()}</td>
                                    <td className="max-w-xs truncate">{c.description}</td>
                                    <td className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => onEditChallengeButton(c)}
                                            className="btn btn-outline btn-xs"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onRemoveChallenge(c._id)}
                                            className="btn btn-outline btn-xs"
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={5} className="text-center text-gray-500 py-4">
                                    No challenges available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {showAddChallengeForm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {editChallengeForm ? 'Edit Challenge' : 'Create Challenge'}
                        </h3>
                        <form onSubmit={onSubmitEditForm} className="space-y-4">
                            {[
                                { name: 'title', label: 'Title' },
                                { name: 'description', label: 'Description' },
                                { name: 'aura_points', label: 'Aura Points' },
                                { name: 'end_date', label: 'End Date', type: 'date' }
                            ].map(({ name, label, type = 'text' }) => (
                                <div key={name}>
                                    <label className="block text-sm font-medium">{label}</label>
                                    <input
                                        type={type}
                                        name={name}
                                        value={addNewChallengeForm[name]}
                                        onChange={onChangeEditForm}
                                        className="input input-bordered w-full"
                                    />
                                </div>
                            ))}

                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    className="btn btn-outline"
                                    onClick={() => setShowAddChallengeForm(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Save
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CoordinatorChallenges;
