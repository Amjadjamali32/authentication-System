import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../app/features/authSlice';
import { Link, useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const AdminLogin = () => {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    const onSubmit = async (data) => {
        try {
            await dispatch(login(data)).unwrap();
            toast.success('Login successful');
        } catch (err) {
            console.error('Error during login:', err);
            toast.error(err.message || 'Error in Login!');
        }
    };

    useEffect(()=>{
        if (isAuthenticated) {
            console.log("Authentication status changed:", isAuthenticated);
            navigate('/admin');
        }
    }, [isAuthenticated, navigate])

    return (
        <div className="flex items-center justify-center min-h-screen pt-2 px-4">
            <ToastContainer /> 
            <div className="w-full max-w-md bg-white shadow-md rounded-lg p-8 mx-auto">
                <h1 className="text-4xl font-bold text-center text-gray-800 mb-6">Admin Login</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600" htmlFor="email">Email</label>
                        <input
                            type="email"
                            {...register('email', { required: 'Email is required' })}
                            className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#eaeaea] ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="Enter your email"
                        />
                        {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600" htmlFor="password">Password</label>
                        <input
                            type="password"
                            {...register('password', { required: 'Password is required' })}
                            className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#eaeaea] ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="Enter your password"
                        />
                        {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
                    </div>
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-600" htmlFor="adminSecret">Admin Secret</label>
                        <input
                            type="text"
                            {...register('adminSecret', { required: 'Admin secret is required' })}
                            className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#eaeaea] ${errors.adminSecret ? 'border-red-500' : ''}`}
                            placeholder="Enter admin secret"
                        />
                        {errors.adminSecret && <span className="text-red-500 text-sm">{errors.adminSecret.message}</span>}
                    </div>
                    <button
                        type="submit"
                        className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className="text-center mt-6">
                        <p className="text-sm text-black">
                            Don't have an account? <Link to="/register" className="text-blue-500 hover:underline">Register</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminLogin;
