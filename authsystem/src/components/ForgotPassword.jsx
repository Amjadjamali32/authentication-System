import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { requestPasswordReset } from '../app/features/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import the styles

const ForgotPassword = () => {
    const dispatch = useDispatch();
    const [email, setEmail] = useState('');
    const loading = useSelector((state) => state.auth.loading);
    const error = useSelector((state) => state.auth.error);
    const successMessage = useSelector((state) => state.auth.successMessage);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(requestPasswordReset(email));
    };

    // Use useEffect to show notifications
    useEffect(() => {
        if (error) {
            toast.error(error.successMessage); // Show error toast
        }
        if (successMessage) {
            toast.success(successMessage); // Show success toast
        }
    }, [error, successMessage]);

    return (
        <div className='pt-20'>
            <div className="container mx-auto w-5/6 pt-4 shadow-sm rounded-sm bg-white p-4 md:w-5/12 md:mt-8">
                <h2 className="text-2xl font-bold text-center">Forgot Password</h2>
                <form onSubmit={handleSubmit} className="mt-4">
                    <div>
                        <label htmlFor="email" className="block mb-2">Email:</label>
                        <input
                            type="email"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="p-2 w-full border-2"
                        />
                    </div>
                    <div className='text-center'>
                        <button
                            type="submit"
                            disabled={loading}
                            className={`mt-4 p-2 bg-blue-600 rounded-sm px-4 font-semibold hover:bg-blue-900 text-white ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            {loading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                    </div>
                </form>
                <ToastContainer /> 
            </div>
        </div>
    );
};

export default ForgotPassword;
