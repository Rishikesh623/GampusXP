import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        reg_no: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const [xp, setXp] = useState(0);
    const [level, setLevel] = useState(1);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const onSubmitForm = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const res = await axios.post(`${process.env.BASE_URL}/user/register`, formData);
            if (res) {
                setSuccess("Registration Successful");
                setError(null);
                dispatch({
                    name: formData.name, reg_no: formData.reg_no, email: formData.email,
                    password: formData.password, token: res.data.token
                });
                navigate("/signin");
            }
        } catch (err) {
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
                    {['name', 'reg_no', 'email', 'password', 'confirmPassword'].map((field, index) => (
                        <div className="form-control" key={index}>
                            <input type={field.includes("password") ? "password" : "text"}
                                className="input input-bordered bg-white w-full text-black"
                                placeholder={field.replace(/_/g, ' ').toUpperCase()}
                                name={field}
                                value={formData[field]}
                                onChange={onChangeForm}
                                required />
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
