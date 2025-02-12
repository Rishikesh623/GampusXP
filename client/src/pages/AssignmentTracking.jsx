import React, { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

const AssignmentTracking = () => {
    const [assignments, setAssignments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [assignmentForm, setAssignmentForm] = useState({
        assignment_id: "",
        title: "",
        description: "",
        due_date: "",
        status: ""
    });

    const fetchAssignments = async () => {
        try {
            const res = await axios.get(`${process.env.BASE_URL}/assignment`, { withCredentials: true });
            setAssignments(res.data.assignments.reverse() || []);
        } catch (error) {
            console.error("Error fetching assignments:", error.response?.message || error.message);
        }
    };

    useEffect(() => { fetchAssignments(); }, []);

    const toggleModal = (assignment = null) => {
        setEditMode(!!assignment);
        setAssignmentForm(
            assignment ? { ...assignment, assignment_id: assignment._id } : { title: "", description: "", due_date: "", status: "pending" }
        );
        setShowModal(!showModal);
    };

    const handleChange = (e) => {
        setAssignmentForm({ ...assignmentForm, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editMode) {
                await axios.patch(`${process.env.BASE_URL}/assignment/edit`, assignmentForm, { withCredentials: true });
            } else {
                await axios.post(`${process.env.BASE_URL}/assignment/add`, assignmentForm, { withCredentials: true });
            }
            fetchAssignments();
            toggleModal();
        } catch (error) {
            console.error("Error saving assignment:", error.message);
        }
    };

    const handleRemove = async (assignment_id) => {
        try {
            await axios.delete(`${process.env.BASE_URL}/assignment/remove/${assignment_id}`, { withCredentials: true });
            setAssignments(assignments.filter(a => a._id !== assignment_id));
        } catch (error) {
            console.error("Error removing assignment:", error.message);
        }
    };

    const markAsCompleted = async (assignment) => {
        try {
            const updatedAssignment = {
                assignment_id: assignment._id,
                title: assignment.title,
                description: assignment.description,
                due_date: assignment.due_date,
                status: 'completed',
            };
            await axios.patch(`${process.env.BASE_URL}/assignment/edit`, updatedAssignment, { withCredentials: true });
            fetchAssignments();
        } catch (error) {
            console.error("Error marking assignment as completed:", error.message);
        }
    };

    return (

        <Layout title="📑 Assignment Tracking" additionalHeaderElement={<button onClick={() => toggleModal()} className="btn btn-outline btn-primary mt-4">➕ Add Assignment</button>}>
            {
                assignments.length === 0 ? (
                    <p className="text-gray-500 text-center">No assignments available.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {assignments.map(assignment => (
                            <div key={assignment._id} className={`p-4 border rounded-lg shadow-sm ${assignment.status === 'completed' ? 'bg-green-100 border-green-500' : 'bg-white'}`}>
                                <h2 className="text-lg font-semibold">{assignment.title}</h2>
                                <p className="text-sm text-gray-600">📅 Due Date: {new Date(assignment.due_date).toLocaleDateString()}</p>
                                <p className="text-sm text-gray-700">📝 {assignment.description}</p>
                                <p className={`text-sm font-semibold ${assignment.status === 'completed' ? 'text-green-600' : 'text-red-600'}`}>🔹 Status: {assignment.status}</p>
                                <div className="flex space-x-2 mt-2">
                                    <button className="btn btn-sm btn-outline btn-primary" onClick={() => toggleModal(assignment)}>✏️ Edit</button>
                                    <button className="btn btn-sm btn-outline btn-error" onClick={() => handleRemove(assignment._id)}>🗑 Remove</button>
                                    {assignment.status !== 'completed' && (
                                        <button className="btn btn-sm btn-outline btn-success" onClick={() => markAsCompleted(assignment)}>✅ Mark as Completed</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )
            }

            {
                showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                        <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                            <h2 className="text-2xl font-bold mb-4">{editMode ? "Edit Assignment" : "Add Assignment"}</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold">Title</label>
                                    <input type="text" name="title" value={assignmentForm.title} onChange={handleChange} required className="input input-bordered w-full" />
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold">Description</label>
                                    <textarea name="description" value={assignmentForm.description} onChange={handleChange} className="textarea textarea-bordered w-full" required></textarea>
                                </div>
                                <div className="mb-4">
                                    <label className="block text-sm font-semibold">Due Date</label>
                                    <input type="date" name="due_date" value={assignmentForm.due_date} onChange={handleChange} required className="input input-bordered w-full" />
                                </div>
                                <div className="flex justify-end space-x-2">
                                    <button type="button" className="btn btn-outline btn-error" onClick={() => toggleModal()}>Cancel</button>
                                    <button type="submit" className="btn btn-outline btn-success">{editMode ? "Save Changes" : "Add"}</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )
            }

        </Layout >

    );
};

export default AssignmentTracking;