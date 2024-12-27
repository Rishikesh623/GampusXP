import { useState } from "react";
import { useDispatch } from "react-redux";
// import { setUserProfile } from "../redux/user/userSlice";
import axios from "axios"
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        reg_no: "",
        email: "",
        password: "",
        confirmPassword: ""
    })

    const navigate = useNavigate();

    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const dispatch = useDispatch();

    const onChangeForm = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    }

    const onSubmitForm = async (e) => {
        e.preventDefault();

        // Check if passwords match
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const res = await axios.post('http://localhost:5000/user/register', formData);

            const data = res.data;

            // console.log(data);

            if (res) {
                setSuccess("Registration Successfull");
                setError(null);
                dispatch({
                    name: formData.name, reg_no: formData.reg_no, email: formData.email,
                    password: formData.password, token: data.token
                })

                // Cookies.set('token', data.token, { expires: 7 });
                navigate("/sigin");
                // console.log(data.token)
            }
            else {
                setError(data.message || "Registration Failed");
                setSuccess(null);
            }
        }
        catch (err) {
            // console.error("Error:", err.message);
            setError(err.response.data.message || "An error occurred");
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-base-200">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center">Create a CampusXP Account</h2>
                <form className="space-y-4" onSubmit={onSubmitForm}>

                    {/* Email Input */}
                    <div className="form-control">
                        <label className="flex items-center gap-2 input input-bordered">
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
                            <input type="email"
                                name="email"
                                className="grow"
                                onChange={onChangeForm}
                                value={formData.email}
                                placeholder="Email"
                                required />
                        </label>
                    </div>

                    {/* Username Input */}
                    <div className="form-control">
                        <label className="flex items-center gap-2 input input-bordered">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>
                            <input type="text"
                                className="grow"
                                placeholder="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={onChangeForm}
                                required />
                        </label>
                    </div>
                    {/* reg no. Input */}
                    <div className="form-control">
                        <label className="flex items-center gap-2 input input-bordered">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 16 16"
                                fill="currentColor"
                                className="h-4 w-4 opacity-70">
                                <path
                                    d="M8 8a3 3 0 1 0 0-6 3 3 0 0 0 0 6ZM12.735 14c.618 0 1.093-.561.872-1.139a6.002 6.002 0 0 0-11.215 0c-.22.578.254 1.139.872 1.139h9.47Z" />
                            </svg>
                            <input type="text"
                                className="grow"
                                placeholder="Registration number"
                                name="reg_no"
                                value={formData.reg_no}
                                onChange={onChangeForm}
                                required />
                        </label>
                    </div>

                    {/* Password Input */}
                    <div className="form-control">
                        <label className="flex items-center gap-2 input input-bordered">
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
                                className="grow"
                                placeholder="Password"
                                name="password"
                                value={formData.password}
                                onChange={onChangeForm}
                                required />
                        </label>
                    </div>

                    {/* Confirm Password Input */}
                    <div className="form-control">
                        <label className="flex items-center gap-2 input input-bordered">
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
                                className="grow"
                                placeholder="Confirm Password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={onChangeForm}
                                required />
                        </label>
                    </div>
                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}
                    {/* Submit Button */}
                    <button type="submit" className="btn btn-primary w-full mt-4">Sign Up</button>
                </form>

                <p className="text-center">
                    Already have an account? <a href="/signin" className="text-primary">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
