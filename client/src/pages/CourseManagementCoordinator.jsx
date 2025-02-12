import React, { useEffect, useState } from 'react';
import { logout } from '../redux/user/userSlice';
import { persistor } from '../redux/store';
import { useSelector } from 'react-redux'
import { setTheme } from '../redux/theme/themeSlice';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);
    const [editCourseForm, setEditCourseForm] = useState(false);

    const [addNewCourseForm, setAddNewCourseForm] = useState({
        name: "",
        description: "",
        credits: "",
        coures_no: ""
    });

    const fetchCourses = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BASE_URL}/course/`, {
                headers: {
                    coordinator: "true" // Include the required header
                }
            });
            setCourses(res.data); // Assuming the API response is an array of courses
        } catch (err) {
            console.error("Error fetching courses:", err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const currentTheme = useSelector((state) => state.theme);

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const onAddNewCourseHandler = () => {
        setShowAddCourseForm(!showAddCourseForm);
        setEditCourseForm(false);
        setAddNewCourseForm({
            name: "",
            description: "",
            credits: "",
            coures_no: ""
        });
    }

    const onEditCourseButton = (course) => {
        setShowAddCourseForm(!showAddCourseForm);
        setEditCourseForm(true);
        setAddNewCourseForm({
            name: course.name,
            description: course.description,
            credits: course.credits,
            course_code: course.course_code,
        });
    }

    const onChangeEditForm = (e) => {
        setAddNewCourseForm({
            ...addNewCourseForm, [e.target.name]: e.target.value
        })
    }

    const onSubmitEditForm = async (e) => {
        e.preventDefault();

        if (!editCourseForm) {
            try {
                const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/course/create`, addNewCourseForm, {
                    headers: {
                        coordinator: true
                    }
                })

                const data = res.data;

                console.log("Course created successfully", data.message);

                fetchCourses();
                onAddNewCourseHandler();
                setAddNewCourseForm({
                    name: "",
                    description: "",
                    credits: "",
                    coures_no: ""
                })
            }
            catch (err) {
                console.log("Error in onSubmitEditForm in Course creation", err.response?.data?.message || err.message);
            }
        }
        else {
            try {
                const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/course/edit`, addNewCourseForm, {
                    headers: {
                        coordinator: true
                    }
                })

                const data = res.data;

                console.log("Course edited successfully", data.message);

                fetchCourses();
                setShowAddCourseForm(!showAddCourseForm);
                setEditCourseForm(false);
                setAddNewCourseForm({
                    name: "",
                    description: "",
                    credits: "",
                    coures_no: ""
                })
            }
            catch (err) {
                console.log("Error in onSubmitEditForm in Course edit", err.response?.data?.message || err.message);
            }
        }
    }

    const onRemoveCourse = async (id) => {
        try {
            const res = await axios.delete(`${process.env.REACT_APP_BASE_URL}/course/delete`, {
                headers: { coordinator: true },
                data: { _id: id }
            });

            const data = res.data;

            console.log(data);
            fetchCourses();
        }
        catch (err) {
            alert(err.response.data.message);
            console.log("Error in onRemoveCourses function", err.response.data.message)
        }
    }

    const handleThemeChange = (event) => {
        dispatch(setTheme(event.target.value));
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
                                onClick={() => navigate("/course-management-coordinator")}
                                className={`mt-6 px-4 py-2 rounded-lg mb-6 ${window.location.pathname === "/course-management-coordinator"
                                    ? "bg-blue-300 text-white"
                                    : "bg-blue-600 text-white hover:bg-blue-400"
                                    }`}
                            >
                                Course Management
                            </button>
                        </div>

                        <div className="flex space-x-2 items-center justify-center h-16 border-b">
                            <button
                                onClick={() => navigate("/coordinator-challenges")}
                                className={`mt-6 px-4 py-2 rounded-lg mb-6 ${window.location.pathname === "/coordinator-challenges"
                                    ? "bg-blue-300 text-white"
                                    : "bg-blue-600 text-white hover:bg-blue-400"
                                    }`}
                            >
                                Challenges Management
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

                        <button onClick={logoutHandler} className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">Logout</button>
                    </div>
                </header >
            </div>
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">Course Management</h1>
                <button onClick={onAddNewCourseHandler} className="px-4 py-2 bg-blue-600 text-white rounded-lg mb-6">Add New Course</button>

                <div className="space-y-4">
                    {courses.length > 0 ? (
                        courses.map((course) => (
                            <div
                                key={course.course_code}
                                className="p-4 border rounded-lg shadow-sm bg-gray-50"
                            >
                                <h2 className="text-lg font-semibold">{course.name}</h2>
                                <p className="text-sm text-gray-600">{course.description}</p>
                                <p className="text-sm text-gray-500">Credits: {course.credits}</p>
                                <p className="text-sm text-gray-500">Course Code: {course.course_code}</p>

                                <button onClick={() => onEditCourseButton(course)} className="mt-2 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg">Edit Course</button>
                                <button
                                    onClick={() => onRemoveCourse(course._id)}
                                    className="mt-2 mx-1 px-4 py-2 bg-blue-100 text-blue-600 rounded-lg"
                                >
                                    Remove Course
                                </button>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No courses available.</p>
                    )}
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
                                        <label className="block text-gray-600 font-semibold">Course Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={addNewCourseForm.name}
                                            onChange={onChangeEditForm}
                                            className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                            placeholder={"Course Name"}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-semibold">Course Description</label>
                                        <input
                                            type="text"
                                            name="description"
                                            value={addNewCourseForm.description}
                                            onChange={onChangeEditForm}
                                            className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                            placeholder={"Course Description"}
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-semibold">Course Credits</label>
                                        <input
                                            type="text"
                                            name="credits"
                                            value={addNewCourseForm.credits}
                                            onChange={onChangeEditForm}
                                            placeholder="Course Credits"
                                            className="w-full p-2 border border-gray-300 rounded text-black bg-white"
                                        />
                                    </div>
                                    <div className="mb-4">
                                        <label className="block text-gray-600 font-semibold">Course Code</label>
                                        <input
                                            type="text"
                                            name="course_code"
                                            value={addNewCourseForm.course_code}
                                            onChange={onChangeEditForm}
                                            placeholder="Course_Code"
                                            className="w-full p-2 border border-gray-300 rounded text-black bg-white"
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
