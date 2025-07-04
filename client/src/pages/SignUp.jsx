import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setUserProfile } from "../redux/user/userSlice";

const SignUp = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        name: "",
        reg_no: "",
        email: "",
        password: "",
        confirm_password: ""
    });

    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        setXp(Object.values(formData).filter(val => val !== "").length * 20);

    }, [formData]);

    useEffect(() => {
        setLevel(Math.floor(xp / 100) + 1);
    }, [xp]);

    const onChangeForm = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const validateForm = (formData) => {
        if (!formData.name.trim()) {
            return "Name is required.";
        }

        if (!/^\d+$/.test(formData.reg_no)) {
            return "Registration number must be numeric.";
        }

        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            return "Invalid email format.";
        }

        if (formData.password.length < 8) {
            return "Password must be at least 8 characters.";
        }

        if (formData.confirm_password !== formData.password) {
            return "Passwords do not match.";
        }

        return true;
    };


    const onSubmitForm = async (e) => {
        e.preventDefault();

        const result = validateForm(formData);
        if (result !== true) {
            setError(result);
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/register`, formData);
            console.log(res);
            if (res) {
                setSuccess("Registration Successful");
                setError(null);
                dispatch(setUserProfile({
                    name: formData.name, reg_no: formData.reg_no, email: formData.email,
                }));
                navigate('/welcome');
            }
        } catch (err) {
            console.log(err);
            setError(err.response?.data?.message || "An error occurred");
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen  bg-white logo_bg">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl relative signupform">
                {/* XP and Level Display */}
                <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow-md">
                    <p className="text-sm font-bold text-gray-700">XP: {xp}</p>
                </div>

                <h2 className="text-2xl font-bold text-black text-center">Sign Up</h2>

                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-primary h-full transition-all" style={{ width: `${xp}%` }}></div>
                </div>

                <form className="space-y-4" onSubmit={onSubmitForm}>
                    {['name', 'reg_no', 'email', 'password', 'confirm_password'].map((field, index) => (
                        <div className="form-control relative mb-4" key={index}>
                            <input
                                type={field.toLowerCase().includes("password") ? (showPassword ? "text" : "password") : "text"}
                                className="input input-bordered bg-white w-full text-black pr-10"
                                placeholder={field.replace(/_/g, ' ').toUpperCase()}
                                name={field}
                                value={formData[field]}
                                onChange={onChangeForm}
                                required
                            />

                            {field.toLowerCase().includes("password") && (
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(prev => !prev)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xl text-gray-600"
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                >
                                    {showPassword ? "🔓" : "🔒"}
                                </button>
                            )}
                        </div>
                    ))}


                    {error && <p className="text-red-500 text-center">{error}</p>}
                    {success && <p className="text-green-500 text-center">{success}</p>}
                    <button type="submit" className="btn btn-outline w-full btn-primary mt-4">Sign Up</button>


                </form>



                <p className="text-center">

                    Already have an account? <a href="/signin" className="text-primary">Sign In</a>
                </p>
            </div>
        </div>
    );
};

export default SignUp;
