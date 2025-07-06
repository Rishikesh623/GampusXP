import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { setUserProfile } from "../redux/user/userSlice";
import { useToast } from "../components/ToastProvider";

const SignUp = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { showToast } = useToast();

    const [formData, setFormData] = useState({
        name: "",
        reg_no: "",
        email: "",
        password: "",
        confirm_password: ""
    });

    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    const validateForm = () => {
        const { name, reg_no, email, password, confirm_password } = formData;
        if (!name.trim()) return "Name is required.";
        if (!/^\d+$/.test(reg_no)) return "Registration number must be numeric.";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return "Invalid email format.";
        if (password.length < 8) return "Password must be at least 8 characters.";
        if (confirm_password !== password) return "Passwords do not match.";
        return true;
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();
        const result = validateForm();
        if (result !== true) {
            showToast({ message: result, type: "error" });
            return;
        }

        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}/user/register`, formData);
            if (res) {
                showToast({ message: "Registration successful", type: "success" });
                dispatch(setUserProfile({
                    name: formData.name,
                    reg_no: formData.reg_no,
                    email: formData.email,
                }));
                navigate('/welcome', { state: { fromRegister: true } });
            }
        } catch (err) {
            showToast({ message: err.response?.data?.message || "An error occurred", type: "error" });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white logo_bg">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg relative">
                <div className="absolute top-4 left-4 bg-white p-2 rounded-lg shadow text-sm font-semibold">
                    XP: {xp} | Level {level}
                </div>

                 <h2 className="text-2xl font-bold text-black flex items-center justify-center gap-2">
                    Sign Up to
                    <a href="/" className="inline-block">
                        <img
                            src="/logo.png"
                            alt="CampusXP"
                            className="h-16 w-auto relative top-[1px]"
                        />
                    </a>
                </h2>


                <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div className="bg-primary h-full transition-all duration-300" style={{ width: `${xp}%` }} />
                </div>

                <form onSubmit={onSubmitForm} className="space-y-4 pt-2">
                    <div className="form-control">
                        <label className="flex items-center gap-2 input input-bordered bg-white w-full text-black">
                            <span className="material-icons text-sm">person</span>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={onChangeForm}
                                placeholder="Name"
                                className="w-full"
                            />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="flex items-center gap-2 input input-bordered bg-white w-full text-black">
                            <span className="material-icons text-sm">badge</span>
                            <input
                                type="text"
                                name="reg_no"
                                value={formData.reg_no}
                                onChange={onChangeForm}
                                placeholder="Registration No"
                                className="w-full"
                            />
                        </label>
                    </div>

                    <div className="form-control">
                        <label className="flex items-center gap-2 input input-bordered bg-white w-full text-black">
                            <span className="material-icons text-sm">email</span>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={onChangeForm}
                                placeholder="Email"
                                className="w-full"
                            />
                        </label>
                    </div>

                    <div className="form-control relative">
                        <label className="flex items-center gap-2 input input-bordered bg-white w-full text-black relative">
                            <span className="material-icons text-sm">lock</span>
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={onChangeForm}
                                placeholder="Password"
                                className="w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                tabIndex={-1}
                            >
                                <span className="material-icons text-[18px]">
                                    {showPassword ? "visibility_off" : "visibility"}
                                </span>

                            </button>
                        </label>
                    </div>

                    <div className="form-control relative">
                        <label className="flex items-center gap-2 input input-bordered bg-white w-full text-black relative">
                            <span className="material-icons text-sm">lock</span>
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                name="confirm_password"
                                value={formData.confirm_password}
                                onChange={onChangeForm}
                                placeholder="Confirm Password"
                                className="w-full"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                                tabIndex={-1}
                            >
                                <span className="material-icons text-[18px]">
                                    {showConfirmPassword ? "visibility_off" : "visibility"}
                                </span>
                            </button>
                        </label>
                    </div>

                    <button type="submit" className="btn btn-primary w-full mt-2">
                        Sign Up
                    </button>

                    <p className="text-center text-sm pt-2">
                        Already have an account? <a href="/signin" className="text-primary">Sign In</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignUp;
