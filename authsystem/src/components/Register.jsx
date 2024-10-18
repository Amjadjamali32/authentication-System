import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../app/features/authSlice.js';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
    const { register, handleSubmit, watch, formState: { errors }, setError, clearErrors } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading } = useSelector((state) => state.auth);

    const [isAdmin, setIsAdmin] = useState(false);
    const [profileImage, setProfileImage] = useState(null);

    const password = watch('password');

    const onSubmit = async (data) => {
        // creating a form object
        const formData = new FormData();
        Object.entries(data).forEach(([key, value]) => {
            formData.append(key, value);
        });

        formData.append('profileImage', profileImage);

        try {
            const result = await dispatch(registerUser(formData)).unwrap();
            toast.success(result.message || 'Registration successful');

            // Ensure correct role-based navigation
            const role = data.role;
            setTimeout(() => {
                if (role === 'User') {
                    navigate('/login');
                } 
                else {
                    navigate("/admin-login")
                }
            }, 3000);   
            
        } catch (err) {
            console.error("Registration failed:", err);
            toast.error(err.message || "Registration failed! Please try again.");
        }
    };

    const handleRoleChange = (e) => {
        const selectedRole = e.target.value;
        setIsAdmin(selectedRole === 'admin');
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (!file.type.includes('image')) {
                setError('profileImage', { type: 'manual', message: 'Only image files are allowed' });
            } else if (file.size > 5 * 1024 * 1024) { // 5MB size limit
                setError('profileImage', { type: 'manual', message: 'File size should be less than 5MB' });
            } else {
                clearErrors('profileImage');
                setProfileImage(file);
            }
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen pt-20 mb-4">
            <div className="w-full max-w-lg bg-white shadow-md rounded-lg p-8 mx-2">
                <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Register</h1>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className='my-4'>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="name">Name</label>
                        <input
                            type="text"
                            name="name"
                            {...register('name', {
                                required: 'Name is required',
                                minLength: { value: 5, message: 'Name must be at least 5 characters long' },
                                maxLength: { value: 30, message: 'Name must not exceed 30 characters' }
                            })}
                            className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#eaeaea] ${errors.name ? 'border-red-500' : ''}`}
                            placeholder="Enter your name"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}

                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="email">Email</label>
                        <input
                            type="email"
                            name='email'
                            {...register('email', {
                                required: 'Email is required',
                                pattern: { value: /^\S+@\S+$/i, message: 'Email is not valid' },
                            })}
                            className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#eaeaea] ${errors.email ? 'border-red-500' : ''}`}
                            placeholder="Enter your email"
                        />
                        {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
                    </div>

                    <div className='my-4'>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="password">Password</label>
                        <input
                            type="password"
                            name='password'
                            {...register('password', {
                                required: 'Password is required',
                                minLength: { value: 8, message: 'Password must be at least 6 characters long' },
                                maxLength: { value: 20, message: 'Password must not exceed 20 characters' },
                            })}
                            className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#eaeaea] ${errors.password ? 'border-red-500' : ''}`}
                            placeholder="Enter your password"
                        />
                        {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
                    </div>

                    <div className='my-4'>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="confirmPassword">Confirm Password</label>
                        <input
                            type="password"
                            name='confirmPassword'
                            {...register('confirmPassword', {
                                required: 'Please confirm your password',
                                validate: value => value === password || 'Passwords do not match',
                            })}
                            className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#eaeaea] ${errors.confirmPassword ? 'border-red-500' : ''}`}
                            placeholder="Confirm your password"
                        />
                        {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword.message}</p>}
                    </div>

                    <div className='my-4'>
                        <label className="block text-sm font-medium text-gray-600" htmlFor="profileImage">Profile Image</label>
                        <input
                            type="file"
                            name='profileImage'
                            {...register('profileImage', {
                                required: 'Profile image is required'
                            })}
                            onChange={handleImageChange}
                            className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#eaeaea]"
                            accept="image/*"
                        />
                        {errors.profileImage && <p className="text-red-500 text-sm">{errors.profileImage.message}</p>}
                    </div>

                    <div className="my-4">
                        <label className="block text-sm font-medium text-gray-700" htmlFor="role">Role</label>
                        <select
                            id="role"
                            name='role'
                            {...register('role', {
                                required: 'Role is required',
                            })}
                            onChange={handleRoleChange}
                            className={`mt-1 block w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-[#eaeaea] ${errors.role ? 'border-red-500' : ''}`}
                        >
                            <option value="">Select Role</option>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>
                        {errors.role && <p className="text-red-500 text-sm">{errors.role.message}</p>}
                    </div>

                    {isAdmin && (
                        <div className='my-4'>
                            <label className="block text-sm font-medium text-gray-600" htmlFor="adminSecret">Admin Secret</label>
                            <input
                                type="password"
                                name='adminSecret'
                                {...register('adminSecret', {
                                    required: isAdmin ? 'Admin secret is required' : false,
                                })}
                                className={`mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none bg-[#eaeaea] ${errors.adminSecret ? 'border-red-500' : ''}`}
                                placeholder="Enter admin secret"
                            />
                            {isAdmin && errors.adminSecret && <p className="text-red-500 text-sm">{errors.adminSecret.message}</p>}
                        </div>
                    )}

                    <button
                        type="submit"
                        className={`w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
                        disabled={loading}
                    >
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
            </div>

            <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick pauseOnHover draggable pauseOnFocusLoss />
        </div>
    );
};

export default Register;
