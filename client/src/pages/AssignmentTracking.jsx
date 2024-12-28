import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignmentTracking = () => {
    const [assignments, setAssignments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        title: '',
        description: '',
        due_date: '',
    });

    useEffect(() => {
        async function fetchAssignments() {
            try {
                const res = await axios.get('http://localhost:5000/assignment', {
                    withCredentials: true,
                });
                setAssignments(res.data.assignments);
            } catch (error) {
                if (error.response?.status === 404) {
                    setAssignments([]);
                } else {
                    alert('Error fetching assignments:', error.response?.message);
                }
            }
        }
        fetchAssignments();
    }, []);

    const handleAddAssignment = async () => {
        try {
            const res = await axios.post(
                'http://localhost:5000/assignment/add',
                newAssignment,
                { withCredentials: true }
            );
            setAssignments([...assignments, newAssignment]);
            setShowModal(false);
            setNewAssignment({ title: '', description: '', due_date: '' });
        } catch (error) {
            console.log('Error adding assignment:', error);
        }
    };
    const handleEditAssignment = async () => {
        try {
            const res = await axios.post(
                'http://localhost:5000/assignment/edit',
                newAssignment,
                { withCredentials: true }
            );
            // setAssignments([...assignments, newAssignment]);
            setShowModal(false);
            setNewAssignment({ title: '', description: '', due_date: '' });
        } catch (error) {
            console.log('Error adding assignment:', error);
        }
    };
    const handleRemoveAssignment = async (assignment_id) => {
        try {
            const res = await axios.delete(
                `http://localhost:5000/assignment/remove/${assignment_id}`, // Send ID in the URL
                { withCredentials: true }
            );
            // Optionally update the state after the assignment is removed
            setAssignments(assignments.filter(assignment => assignment._id !== assignment_id));
        } catch (error) {
            console.log('Error while removing assignment:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAssignment((prev) => ({ ...prev, [name]: value }));
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6 text-center">Assignment Tracking</h1>

            {/* Add Assignment Button */}
            <div className="mb-6 text-center">
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    Add Assignment
                </button>
            </div>

            {/* Conditional Rendering */}
            {!assignments || assignments.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>No assignments available.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {assignments.map((assignment, index) => (
                        <div
                            key={index}
                            className={`p-5 rounded-lg shadow-md transition-transform transform hover:scale-105 ${assignment.status === 'Completed'
                                ? 'bg-green-100 border border-green-500'
                                : 'bg-white border border-gray-300'
                                }`}
                        >
                            <div className="flex justify-between items-center">
                                <h2 className="text-xl font-semibold">{assignment.title}</h2>
                                <div className="space-x-2">
                                    <button
                                        className="btn btn-sm btn-outline btn-primary"
                                        onClick={() => alert('Edit functionality not yet implemented')}
                                    >
                                        ✏️ Edit
                                    </button>
                                    <button
                                        className="btn btn-sm btn-outline btn-error"
                                        onClick={() => handleRemoveAssignment(assignment._id)}
                                    >
                                        🗑 Remove
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">
                                Due Date: {assignment.due_date}
                            </p>
                            <p
                                className={`text-sm font-semibold mb-2 ${assignment.status === 'Completed'
                                    ? 'text-green-600'
                                    : 'text-red-600'
                                    }`}
                            >
                                Status: {assignment.status}
                            </p>
                            {assignment.status === 'Pending' && (
                                <button className="btn btn-sm btn-primary">Submit</button>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* Modal for Adding Assignment */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">Add Assignment</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleAddAssignment();
                            }}
                        >
                            <div className="mb-4">
                                <label className="block text-sm font-semibold mb-1" htmlFor="title">
                                    Title
                                </label>
                                <input
                                    type="text"
                                    id="title"
                                    name="title"
                                    value={newAssignment.title}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full bg-white text-black dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-sm font-semibold mb-1"
                                    htmlFor="description"
                                >
                                    Description
                                </label>
                                <textarea
                                    id="description"
                                    name="description"
                                    value={newAssignment.description}
                                    onChange={handleInputChange}
                                    className="textarea textarea-bordered w-full bg-white text-black dark:bg-gray-700 dark:text-white"
                                    rows="3"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label
                                    className="block text-sm font-semibold mb-1"
                                    htmlFor="due_date"
                                >
                                    Due Date
                                </label>
                                <input
                                    type="date"
                                    id="due_date"
                                    name="due_date"
                                    value={newAssignment.due_date}
                                    onChange={handleInputChange}
                                    className="input input-bordered w-full bg-white text-black dark:bg-gray-700 dark:text-white"
                                    required
                                />
                            </div>
                            <div className="flex justify-end space-x-2">
                                <button
                                    type="button"
                                    className="btn btn-ghost"
                                    onClick={() => setShowModal(false)}
                                >
                                    Cancel
                                </button>
                                <button type="submit" className="btn btn-primary">
                                    Add
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AssignmentTracking;
