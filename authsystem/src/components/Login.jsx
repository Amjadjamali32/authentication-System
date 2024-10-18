import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../app/features/authSlice.js'; 
import { useNavigate, Link } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; // Correct import

const UserLogin = () => {
    const { register, handleSubmit, setValue, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);
    const [rememberMe, setRememberMe] = useState(false);

    // Load the saved email from localStorage on component mount
    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        if (savedEmail) {
            setValue('email', savedEmail); 
            setRememberMe(true); 
        }
    }, [setValue]);

    const onSubmit = async (data) => {
        try {
            const result = await dispatch(login(data)).unwrap();
            toast.success(result.message || "Successfully Logged in");
            if (rememberMe) {
                localStorage.setItem('email', data.email);
            } else {
                localStorage.removeItem('email');
            }
        } catch (err) {
            // Check if err has a response property
            const errorMessage = err.response?.data?.message || 'Login failed! Please try again.';
            toast.error(errorMessage);
        }
    };
    
    useEffect(() => {
        if (isAuthenticated) {
            navigate("/dashboard");
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen pt-2 px-4 md:pt-14">
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">User Login</h1>
                
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600" htmlFor="email">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#eaeaea]"
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600" htmlFor="password">Password</label>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required', minLength: { value: 6, message: 'Password must be at least 6 characters' } })}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#eaeaea]"
                            placeholder="Enter your password"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>
                    
                    <div className="flex items-center mb-4 md:justify-between">
                        <div>
                        <input
                            type="checkbox"
                            id="rememberMe"
                            checked={rememberMe}
                            onChange={() => setRememberMe(!rememberMe)}
                            className="mr-2 accent-blue-600"
                        />
                        <label htmlFor="rememberMe" className="text-sm text-gray-600">Remember Me</label>
                        </div>
                        <Link to="/forgot-password" className="text-blue-600 hover:underline ms-2">Forgot Password?</Link>
                    </div>

                    <div className="mb-4 flex font-semibold justify-center md:justify-center">
                        <Link to="/admin-login" className="text-blue-600">Login as Admin</Link>
                    </div>
                    
                    <button
                        type="submit"
                        className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <div>
                        <p className="text-center text-sm mt-4">
                            Don’t have an account? 
                            <Link to="/register" className="text-blue-600 hover:underline font-semibold"> Register</Link>
                        </p>
                    </div>
                </form>
            </div>
            <ToastContainer limit={5} />  {/* Ensure the ToastContainer is here */}
        </div>
    );
};

export default UserLogin;
