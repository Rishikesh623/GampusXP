import React, { useEffect, useState } from 'react';
import { logout } from '../redux/user/userSlice';
import { persistor } from '../redux/store';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    // const [editCourseForm, setEditCourseForm] = useState(false);

    const [addNewCourseForm, setAddNewCourseForm] = useState({
        semester: "",
        course_code: "",
        professor_name: ""
    });


    const fetchCourses = async () => {
        try {
            const res = await axios.get('http://localhost:5000/user/profile', {
                withCredentials: true
            });

            setCourses(res.data.courses);
        } catch (err) {
            console.error("Error fetching courses:", err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    // console.log(courses.courses.course_code);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const onAddNewCourseHandler = () => {
        setShowAddCourseForm(!showAddCourseForm);
    }

    // const onEditCourseButton = (course) => {
    //     setShowAddCourseForm(!showAddCourseForm);
    //     setEditCourseForm(true);

    //     setAddNewCourseForm(({
    //         course_code: course.course_code,
    //         professor_name: course.professor_name
    //     }));
    // }

    const onChangeEditForm = (e) => {
        setAddNewCourseForm({
            ...addNewCourseForm, [e.target.name]: e.target.value
        })
    }

    const onSubmitEditForm = async (e) => {
        e.preventDefault();

        try {
            const res = await axios.patch('http://localhost:5000/course/add', addNewCourseForm, {
                withCredentials: true
            })

            const data = res.data;

            console.log("Course created successfully", data.message);

            fetchCourses();
            onAddNewCourseHandler();
            setAddNewCourseForm({
                semester: "",
                course_code: "",
                professor_name: ""
            })
        }
        catch (err) {
            alert(err.response.data.message);
            // console.log("Error in onSubmitEditForm in Course creation", err || err.message);
        }
    }

    const onRemoveCourse = async (course, semester) => {
        try {
            const res = await axios.patch('http://localhost:5000/course/remove', { course_code: course.course_code, semester }, {
                withCredentials: true
            })

            const data = res.data;

            console.log(data);
            fetchCourses();
        }
        catch (err) {
            alert(err.response.data.message);
            console.log("Error in onRemoveCourses function", err.response.data.message)
        }
    }

    const logoutHandler = () => {
        // Clear Redux state
        dispatch(logout());

        // Purge persisted data
        persistor.purge();

        navigate("/signin")
    }

    return (
        <>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Course Management</h1>
                <button onClick={onAddNewCourseHandler} className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-6">Add New Course</button>

                <div className="space-y-4">
                    {courses.length > 0 ? (
                        courses.map((semesterData) => (
                            <div key={semesterData.semester} className="p-4 border rounded-lg shadow-sm bg-gray-50">
                                {/* Display the semester */}
                                <p className="text-lg font-semibold">Semester : {semesterData.semester}</p>

                                {/* Loop through the courses within each semester */}
                                {semesterData.courses.map((course) => (
                                    <div key={course._id} className="mt-2">
                                        {/* Display course details */}
                                        <h1 > {course.course_name}</h1>
                                        <p className="text-sm text-gray-600">Course Code: {course.course_code}</p>
                                        <p className="text-sm text-gray-500">Professor: {course.professor_name}</p>
                                        <button
                                            onClick={() => onRemoveCourse(course, semesterData.semester)}
                                            className="mt-2 mx-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
                                        >
                                            Remove Course
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No courses available.</p>
                    )}
                    <button
                        onClick={logoutHandler}
                        className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
                    >
                        Logout
                    </button>
                </div>

            </div>
            <div>
                {
                    showAddCourseForm && (
                        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex justify-center items-center z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg w-96">
                                <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

                                <form onSubmit={onSubmitEditForm}>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-semibold">Semester</label>
                                        <input
                                            type="text"
                                            name="semester"
                                            value={addNewCourseForm.semester}
                                            onChange={onChangeEditForm}
                                            required
                                            className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                            placeholder={"Semester"}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-semibold">Course Code</label>
                                        <input
                                            type="text"
                                            name="course_code"
                                            value={addNewCourseForm.course_code}
                                            onChange={onChangeEditForm}
                                            required
                                            className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                            placeholder={"Course Code"}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-semibold">Professor Name</label>
                                        <input
                                            type="text"
                                            name="professor_name"
                                            value={addNewCourseForm.professor_name}
                                            onChange={onChangeEditForm}
                                            className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                            placeholder={"Professor Name"}
                                        />
                                    </div>
                                    <div className="flex justify-end space-x-4">
                                        <button
                                            type="button"
                                            className="px-4 py-2 bg-gray-200 text-gray-600 rounded"
                                            onClick={onAddNewCourseHandler}
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 bg-blue-600 text-white rounded"
                                        >
                                            Save Changes
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )
                }
            </div >
        </>
    );
};

export default CourseManagement;
