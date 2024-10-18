import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../app/features/authSlice';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Profile = () => {
    const dispatch = useDispatch();
    const { profile, loading, error } = useSelector((state) => state.auth);
    const [editMode, setEditMode] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        profileImage: null,
    });

    useEffect(() => {
        dispatch(fetchUserProfile());
    }, [dispatch]);

    useEffect(() => {
        if (profile) {
            setFormData({
                name: profile.name || '',
                email: profile.email || '',
                profileImage: null,
            });
        }
    }, [profile]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData((prevData) => ({ ...prevData, profileImage: file }));
        }
    };

    const handleUpdateProfile = (e) => {
        e.preventDefault();
        const updatedData = new FormData();
        updatedData.append('name', formData.name);
        updatedData.append('email', formData.email);
        if (formData.profileImage) {
            updatedData.append('profileImage', formData.profileImage);
        }

        dispatch(updateUserProfile(updatedData)).unwrap()
            .then(() => {
                setEditMode(false);
                dispatch(fetchUserProfile()); 
                toast.success('Profile updated successfully!'); 
            })
            .catch((err) => {
                console.error(err);
                toast.error(err.message || 'Failed to update profile.'); n
            });
    };

    if (loading) return <p className="text-center text-lg">Loading...</p>;

    if (!profile) {
        return <p className="text-center text-lg">No profile data found.</p>;
    }

    return (
        <>
            <div className='pt-6'>
                <div className="flex items-center justify-center min-h-screen p-4 text-black">
                    <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md">
                        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">User Profile</h1>

                        {editMode ? (
                            <form onSubmit={handleUpdateProfile} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-600" htmlFor="name">Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600" htmlFor="email">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-600" htmlFor="profileImage">Profile Image</label>
                                    <input
                                        type="file"
                                        name="profileImage"
                                        id="profileImage"
                                        onChange={handleImageChange}
                                        className="mt-1 w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                </div>
                                {error && <p className="text-red-500 text-sm">{error}</p>}
                                <button
                                    type="submit"
                                    className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200"
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Profile'}
                                </button>
                            </form>
                        ) : (
                            <div className="space-y-4">
                                <div className="mt-4">
                                    <img src={profile.profileImage || 'default-image-url'} alt="Profile" className="w-9/12 mx-auto rounded sm:w-3/6 sm:mx-auto" />
                                    <p className="text-lg font-medium text-gray-700">
                                        <span className="font-bold">Name:</span> {profile.name}
                                    </p>
                                    <p className="text-lg font-medium text-gray-700">
                                        <span className="font-bold">Email:</span> {profile.email}
                                    </p>
                                    <p className="text-lg font-medium text-gray-700">
                                        <span className="font-bold">Role:</span> {profile.role || 'N/A'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setEditMode(true)}
                                    className="mt-4 w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200"
                                >
                                    Edit Profile
                                </button>
                            </div>
                        )}
                    </div>
                    <ToastContainer /> 
                </div>
            </div>
        </>
    );
};

export default Profile;
