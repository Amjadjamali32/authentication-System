import React from 'react';
import { useSelector } from 'react-redux';

const AdminDashboard = () => {
    const user = useSelector((state) => state.auth.user);  

    return (
        <div className='pt-20'>
            <h1 className='text-center text-3xl font-extrabold my-4'>Admin Dashboard</h1>
            {user ? (  
                <div className='mx-2'>
                    <p className='font-semibold text-2xl'>Name: <span className='text-xl'>{user.name}</span></p>
                    <p className='font-semibold text-2xl'>Email: <span className='text-xl'>{user.email}</span></p>
                    <p className='font-semibold text-2xl'>Role: <span className='text-xl'>{user.role}</span></p>
                </div>
            ) : (
                <p className='text-white'>No user data available.</p>
            )}
        </div>
    );
};

export default AdminDashboard;
