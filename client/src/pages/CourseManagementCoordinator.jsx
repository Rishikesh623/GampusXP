import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../redux/user/userSlice';
import { persistor } from '../redux/store';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [filteredCourses, setFilteredCourses] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    const [editCourseForm, setEditCourseForm] = useState(false);

    const [addNewCourseForm, setAddNewCourseForm] = useState({
        name: '',
        description: '',
        credits: '',
        course_code: ''
    });

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/course/`, {
                headers: { coordinator: 'true' }
            });
            setCourses(res.data);
            setFilteredCourses(res.data);
        } catch (err) {
            console.error('Error fetching courses:', err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    useEffect(() => {
        const filtered = courses.filter((course) =>
            course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            course.course_code.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCourses(filtered);
    }, [searchQuery, courses]);

    const onAddNewCourseHandler = () => {
        setShowAddCourseForm(!showAddCourseForm);
        setEditCourseForm(false);
        setAddNewCourseForm({ name: '', description: '', credits: '', course_code: '' });
    };

    const onEditCourseButton = (course) => {
        setShowAddCourseForm(true);
        setEditCourseForm(true);
        setAddNewCourseForm({ ...course });
    };

    const onChangeEditForm = (e) => {
        setAddNewCourseForm({ ...addNewCourseForm, [e.target.name]: e.target.value });
    };

    const onSubmitEditForm = async (e) => {
        e.preventDefault();
        const url = editCourseForm
            ? `${process.env.REACT_APP_BASE_URL}/course/edit`
            : `${process.env.REACT_APP_BASE_URL}/course/create`;

        try {
            await axios.post(url, addNewCourseForm, { headers: { coordinator: true } });
            fetchCourses();
            setShowAddCourseForm(false);
            setEditCourseForm(false);
        } catch (err) {
            console.log('Error submitting form:', err.response?.data?.message || err.message);
        }
    };

    const onRemoveCourse = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}/course/delete`, {
                headers: { coordinator: true },
                data: { _id: id }
            });
            fetchCourses();
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
            <div className="flex items-center justify-between mb-6">
                <div className="bg-white p-2 rounded shadow-sm">
                    <img src="/logo.png" alt="GampusXP" className="h-16 w-auto" />
                </div>

                <h1 className="text-3xl font-semibold text-center flex-1 -ml-16">
                    Course Management
                </h1>

                <button onClick={logoutHandler} className="btn btn-sm btn-outline">
                    Logout
                </button>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                <div className="flex gap-2 items-center">
                    <input
                        type="text"
                        placeholder="Search by name or course code..."
                        className="input input-bordered w-64"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <button onClick={onAddNewCourseHandler} className="btn btn-outline">
                        ➕ Add Course
                    </button>
                </div>
                <button onClick={() => navigate('/coordinator')} className="btn btn-outline">
                    Go Back
                </button>
            </div>

            <div className="overflow-x-auto">
                <table className="table table-sm w-full">
                    <thead>
                        <tr>
                            <th>Course Name</th>
                            <th>Code</th>
                            <th>Credits</th>
                            <th>Description</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCourses.length > 0 ? (
                            filteredCourses.map((course) => (
                                <tr key={course.course_code}>
                                    <td>{course.name}</td>
                                    <td>{course.course_code}</td>
                                    <td>{course.credits}</td>
                                    <td className="max-w-xs truncate">{course.description}</td>
                                    <td className="flex flex-wrap gap-2">
                                        <button
                                            onClick={() => onEditCourseButton(course)}
                                            className="btn btn-outline btn-xs"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => onRemoveCourse(course._id)}
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
                                    No courses available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {showAddCourseForm && (
                <div className="fixed inset-0 bg-gray-500 bg-opacity-40 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded w-full max-w-md">
                        <h3 className="text-lg font-semibold mb-4">
                            {editCourseForm ? 'Edit Course' : 'Add New Course'}
                        </h3>
                        <form onSubmit={onSubmitEditForm} className="space-y-4">
                            {['name', 'description', 'credits', 'course_code'].map((field) => (
                                <div key={field}>
                                    <label className="block text-sm font-medium capitalize">
                                        {field.replace('_', ' ')}
                                    </label>
                                    <input
                                        type="text"
                                        name={field}
                                        value={addNewCourseForm[field] || ''}
                                        onChange={onChangeEditForm}
                                        className="input input-bordered w-full"
                                        placeholder={field}
                                    />
                                </div>
                            ))}
                            <div className="flex justify-end gap-2 pt-2">
                                <button
                                    type="button"
                                    onClick={onAddNewCourseHandler}
                                    className="btn btn-outline"
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

export default CourseManagement;
