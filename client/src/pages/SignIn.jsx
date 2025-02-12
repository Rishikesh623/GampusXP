import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserProfile } from "../redux/user/userSlice";
import axios from "axios"

const SignIn = () => {
    const [formData, setFormData] = useState({
        id: "",//id can be email or reg_no
        password: "",
        rememberMe: true
    });

    const dispatch = useDispatch();

    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [isCoordinator, setIsCoordinator] = useState(false);

    const onChangeForm = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value
        });

    }

    const onSubmitForm = async (e) => {
        e.preventDefault();

        if (isCoordinator) {
            try {
                const res = await axios.post(`${process.env.BASE_URL}/user/coordinator-login`, formData);
                const data = res.data;

                if (res) {
                    setSuccess("Login Successfull");
                    dispatch(setUserProfile({
                        reg_no: formData.id,
                        name: "Co-ordinator",
                        email: "coordinator@gmail.com"
                    }));

                    navigate("/course-management-coordinator");
                }
                else {
                    setError(data.message || "Login Failed");
                }
            }
            catch (err) {
                console.log("Error in isCoordinator block", err);
                setError(err.response.data.message || "An error occurred")
            }
        }
        else {
            try {
                const res = await axios.post(`${process.env.BASE_URL}/user/login`, formData, {
                    withCredentials: true, // Include cookies in the request
                });
                const data = res.data;

                console.log(data);

                if (res) {
                    setSuccess("Login Successfull");

                    dispatch(setUserProfile({
                        name: data.name,
                        reg_no: data.reg_no,
                        email: data.email,
                        password: data.password,
                        aura_points: data.aura_points
                    }));

                    navigate("/main");
                }
                else {
                    setError(data.message || "Login Failed");
                }
            }
            catch (err) {
                setError(err.response.data.message || "An error occurred")
            }
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-white logo_bg">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold text-black text-center">Sign In</h2>
                <form className="space-y-4" onSubmit={onSubmitForm}>

                    {/* ID Input */}
                    <div className="form-control">
                        <label className="flex items-center gap-2 input input-bordered bg-white w-full text-black">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M2.5 3A1.5 1.5 0 0 0 1 4.5v.793c.026.009.051.02.076.032L7.674 8.51c.206.1.446.1.652 0l6.598-3.185A.755.755 0 0 1 15 5.293V4.5A1.5 1.5 0 0 0 13.5 3h-11Z" />
                                <path
                                    d="M15 6.954 8.978 9.86a2.25 2.25 0 0 1-1.956 0L1 6.954V11.5A1.5 1.5 0 0 0 2.5 13h11a1.5 1.5 0 0 0 1.5-1.5V6.954Z" />
                            </svg>
                            <input type="text"
                                
                                name="id"
                                onChange={onChangeForm}
                                value={formData.id}
                                placeholder="Registration no." />
                        </label>
                    </div>

                    {/* Password Input */}
                    <div className="form-control">
                        <label className="flex items-center gap-2 input input-bordered bg-white w-full text-black">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    fillRule="evenodd"
                                    d="M14 6a4 4 0 0 1-4.899 3.899l-1.955 1.955a.5.5 0 0 1-.353.146H5v1.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-2.293a.5.5 0 0 1 .146-.353l3.955-3.955A4 4 0 1 1 14 6Zm-4-2a.75.75 0 0 0 0 1.5.5.5 0 0 1 .5.5.75.75 0 0 0 1.5 0 2 2 0 0 0-2-2Z"
                                    clipRule="evenodd" />
                            </svg>
                            <input type="password"
                                name="password"
                                onChange={onChangeForm}
                                value={formData.password}
                                placeholder="Password" />
                        </label>
                    </div>
                    <label className="label cursor-pointer">
                        <span className="label-text">Remember me</span>
                        <input type="checkbox" name="rememberMe" onChange={onChangeForm}
                            value={formData.rememberMe} className="toggle" defaultChecked />
                    </label>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}

                    {/* Submit Button */}
                    <button type="submit" onClick={() => { setIsCoordinator(false) }} className="btn btn-primary w-full mt-4">Sign In</button>
                    <button type="submit" onClick={() => { setIsCoordinator(true) }} className="btn btn-primary w-full mt-4">Co-ordinator Login</button>
                </form>

                <p className="text-center">
                    Don’t have an account? <a href="/signup" className="text-primary">Sign Up</a>
                </p>
            </div>
        </div>
    );
};

export default SignIn;
