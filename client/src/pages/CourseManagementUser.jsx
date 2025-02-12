import React, { useEffect, useState } from "react";
import { logout } from "../redux/user/userSlice";
import { persistor } from "../redux/store";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Layout from "../components/Layout";

const CourseManagement = () => {
    const [courses, setCourses] = useState([]);
    const [showAddCourseForm, setShowAddCourseForm] = useState(false);

    const [addNewCourseForm, setAddNewCourseForm] = useState({
        semester: "",
        course_code: "",
        professor_name: "",
    });

    const fetchCourses = async () => {
        try {
            const res = await axios.get("http://localhost:5000/user/profile", {
                withCredentials: true,
            });
            setCourses(res.data.courses.reverse()); // Reverse order to show latest semester first
        } catch (err) {
            console.error("Error fetching courses:", err.response?.data?.message || err.message);
        }
    };

    useEffect(() => {
        fetchCourses();
    }, []);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onAddNewCourseHandler = () => {
        setShowAddCourseForm(!showAddCourseForm);
    };

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
            ...addNewCourseForm,
            [e.target.name]: e.target.value,
        });
    };

    const onSubmitEditForm = async (e) => {
        e.preventDefault();
        try {
            await axios.patch("http://localhost:5000/course/add", addNewCourseForm, { withCredentials: true });
            fetchCourses();
            onAddNewCourseHandler();
            setAddNewCourseForm({
                semester: "",
                course_code: "",
                professor_name: "",
            });
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    const onRemoveCourse = async (course, semester) => {
        try {
            await axios.patch("http://localhost:5000/course/remove", { course_code: course.course_code, semester }, { withCredentials: true });
            fetchCourses();
        } catch (err) {
            alert(err.response.data.message);
        }
    };

    const logoutHandler = () => {
        dispatch(logout());
        persistor.purge();
        navigate("/signin");
    };

    return (
        <>
            <Layout title="📚 Course Management" additionalHeaderElement={<button onClick={onAddNewCourseHandler} className="btn btn-outline btn-primary">➕ Add Course</button>}>
                <div >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {courses.length > 0 ? (
                            courses.map((semesterData) => (
                                <div key={semesterData.semester} className="card bg-white shadow-md p-5 border rounded-lg">
                                    <h3 className="text-lg font-semibold text-accent border-b pb-2">📅 Semester: {semesterData.semester}</h3>
                                    <div className="mt-3 space-y-3">
                                        {semesterData.courses.map((course) => (
                                            <div key={course._id} className="p-3 bg-gray-50 rounded-lg shadow-sm">
                                                <h4 className="text-md font-semibold">{course.course_name}</h4>
                                                <p className="text-sm text-gray-600">📖 Code: {course.course_code}</p>
                                                <p className="text-sm text-gray-500">👨‍🏫 Professor: {course.professor_name}</p>
                                                <button
                                                    onClick={() => onRemoveCourse(course, semesterData.semester)}
                                                    className="btn btn-sm btn-outline btn-error mt-2"
                                                >❌ Remove Course</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center">No courses available.</p>
                        )}
                    </div>


                </div>

                {showAddCourseForm && (
                    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
                        <div className="card bg-white p-6 rounded-lg shadow-lg w-96">
                            <h3 className="text-xl font-semibold text-primary border-b pb-2">✏️ Add New Course</h3>
                            <form onSubmit={onSubmitEditForm} className="mt-4 space-y-4">
                                <div>
                                    <label className="block text-gray-600 font-semibold">📅 Semester</label>
                                    <input type="text" name="semester" value={addNewCourseForm.semester} onChange={onChangeEditForm} required className="input input-bordered w-full" placeholder="Enter semester" />
                                </div>
                                <div>
                                    <label className="block text-gray-600 font-semibold">📖 Course Code</label>
                                    <input type="text" name="course_code" value={addNewCourseForm.course_code} onChange={onChangeEditForm} required className="input input-bordered w-full" placeholder="Enter course code" />
                                </div>
                                <div>
                                    <label className="block text-gray-600 font-semibold">👨‍🏫 Professor Name</label>
                                    <input type="text" name="professor_name" value={addNewCourseForm.professor_name} onChange={onChangeEditForm} className="input input-bordered w-full" placeholder="Enter professor name" />
                                </div>
                                <div className="flex justify-end space-x-4 mt-4">
                                    <button type="button" className="btn btn-outline btn-error" onClick={onAddNewCourseHandler}>Cancel</button>
                                    <button type="submit" className="btn btn-outline btn-success">✅ Save</button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </Layout>
        </>
    );
};

export default CourseManagement;
