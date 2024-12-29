import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AssignmentTracking = () => {
    const [assignments, setAssignments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [isEditAssignment, setIsEditAssignment] = useState(false);
    const [newAssignment, setNewAssignment] = useState({
        assignment_id: '',
        title: '',
        description: '',
        due_date: '',
        status: ''
    });

    const fetchAssignments = async () => {
        try {
            const res = await axios.get('http://localhost:5000/assignment', {
                withCredentials: true,
            });
            setAssignments(res.data.assignments || []);
        } catch (error) {
            if (error.response?.status === 404) {
                setAssignments([]);
            } else {
                console.error('Error fetching assignments:', error.response?.message);
            }
        }
    };

    useEffect(() => {
        fetchAssignments();
    }, []);

    const toggleEditAssignment = (assignment) => {
        setIsEditAssignment(true);
        setNewAssignment({
            assignment_id: assignment._id,
            title: assignment.title,
            description: assignment.description,
            due_date: assignment.due_date,
            status: assignment.status
        });
    };

    const handleAddAssignment = async () => {
        try {
            await axios.post(
                'http://localhost:5000/assignment/add',
                newAssignment,
                { withCredentials: true }
            );
            fetchAssignments();
            setShowModal(false);
            setNewAssignment({ title: '', description: '', due_date: '', status: '' });
        } catch (error) {
            console.error('Error adding assignment:', error);
        }
    };

    const handleEditAssignment = async (assignmentToUpdate) => {
        try {
            await axios.patch(
                'http://localhost:5000/assignment/edit',
                assignmentToUpdate,
                { withCredentials: true }
            );
            fetchAssignments();
            setIsEditAssignment(false);
            setNewAssignment({ title: '', description: '', due_date: '', status: '' });
        } catch (error) {
            console.error('Error editing assignment:', error);
        }
    };

    const handleRemoveAssignment = async (assignment_id) => {
        try {
            await axios.delete(
                `http://localhost:5000/assignment/remove/${assignment_id}`,
                { withCredentials: true }
            );
            setAssignments(assignments.filter(assignment => assignment._id !== assignment_id));
        } catch (error) {
            console.error('Error removing assignment:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewAssignment((prev) => ({ ...prev, [name]: value }));
    };

    const assignmentSubmitHandler = async (assignment) => {
        const updatedAssignment = {
            assignment_id: assignment._id,
            title: assignment.title,
            description: assignment.description,
            due_date: assignment.due_date,
            status: 'Completed',
        };

        try {
            await handleEditAssignment(updatedAssignment);
        } catch (error) {
            console.error('Error submitting assignment:', error);
        }
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

            {/* Assignments List */}
            {assignments.length === 0 ? (
                <div className="text-center text-gray-500">
                    <p>No assignments available.</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {assignments.map((assignment) => (
                        <div
                            key={assignment._id}
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
                                        onClick={() => toggleEditAssignment(assignment)}
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
                                Due Date: {new Date(assignment.due_date).toLocaleDateString()}
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
                                <button
                                    onClick={() => assignmentSubmitHandler(assignment)}
                                    className="btn btn-sm btn-primary"
                                >
                                    Submit
                                </button>
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

            {/* Modal for Editing Assignment */}
            {isEditAssignment && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                        <h2 className="text-2xl font-bold mb-4">Edit Assignment</h2>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleEditAssignment(newAssignment);
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
                                    onClick={() => setIsEditAssignment(false)}
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

export default AssignmentTracking;
