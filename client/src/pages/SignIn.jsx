import {  useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { setUserProfile } from "../redux/user/userSlice";
import axios from "axios";
import { useToast } from "../components/ToastProvider";

const SignIn = () => {
    const [formData, setFormData] = useState({
        id: "",
        password: "",
        rememberMe: true,
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isCoordinator, setIsCoordinator] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { showToast } = useToast();

    const onChangeForm = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.type === 'checkbox' ? e.target.checked : e.target.value,
        });
    };

    const validate = () => {
        if (!formData.id.trim()) {
            showToast({ message: "ID is required", type: "info" });
            return false;
        }
        if (!formData.password.trim()) {
            showToast({ message: "Password is required", type: "info" });
            return false;
        } else if (formData.password.length < 6) {
            showToast({ message: "Password must be at least 6 characters", type: "info" });
            return false;
        }
        return true;
    };

    const onSubmitForm = async (e) => {
        e.preventDefault();

        if (!validate())
            return;

        const endpoint = isCoordinator
            ? "/user/coordinator-login"
            : "/user/login";

        try {
            const res = await axios.post(`${process.env.REACT_APP_BASE_URL}${endpoint}`, formData, {
                withCredentials: true,
                credentials: 'include',
            });

            const data = res.data;

            if (isCoordinator) {
                dispatch(setUserProfile({
                    name: "Co-ordinator",
                    email: "coordinator@gmail.com",
                }));

                navigate("/coordinator");
            } else {
                dispatch(setUserProfile({
                    name: data.name,
                    reg_no: data.reg_no,
                    email: data.email,
                    about: data.about,
                    aura_points: data.aura_points,
                }));
                navigate("/main");
            }

            showToast({ message: "Login Successful", type: "success", duration: 1000 });

        } catch (err) {
            showToast({ message: err.response?.data?.message || "Login failed", type: "error" });
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-white logo_bg">
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-black flex items-center justify-center gap-2">
                    Sign In to
                    <a href="/" className="inline-block">
                        <img
                            src="/logo.png"
                            alt="CampusXP"
                            className="h-16 w-auto relative top-[1px]"
                        />
                    </a>
                </h2>

                <form onSubmit={onSubmitForm} className="space-y-4 pt-2">
                    <div className="form-control">
                        <label className="flex items-center gap-2 input input-bordered bg-white w-full text-black">
                            <span className="material-icons text-sm">mail</span>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={onChangeForm}
                                placeholder="Email or Registration No"
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

                    <label className="label cursor-pointer justify-between">
                        <span className="label-text">Remember me</span>
                        <input
                            type="checkbox"
                            name="rememberMe"
                            checked={formData.rememberMe}
                            onChange={onChangeForm}
                            className="toggle"
                        />
                    </label>

                    <div className="space-y-2 pt-2">
                        <button
                            type="submit"
                            onClick={() => setIsCoordinator(false)}
                            className="btn btn-primary w-full"
                        >
                            Sign In
                        </button>
                        <button
                            type="submit"
                            onClick={() => setIsCoordinator(true)}
                            className="btn btn-outline btn-primary w-full"
                        >
                            Co-ordinator Login
                        </button>
                    </div>

                    <p className="text-center text-sm pt-2">
                        Don’t have an account? <a href="/signup" className="text-primary">Sign Up</a>
                    </p>
                </form>
            </div>
        </div>
    );
};

export default SignIn;
