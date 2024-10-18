import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../app/features/authSlice.js';  

const Header = React.memo(() => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    const toggleMenu = useCallback(() => {
        setIsMenuOpen((prev) => !prev);
    }, []);

    const closeMenu = useCallback(() => {
        setIsMenuOpen(false);
    }, []);

    const handleLogout = () => {
        dispatch(logout()); 
        navigate("/login");  
    };

    return (
        <header className="p-4 fixed w-full z-10 bg-[#1a1a2e] text-[#f0f0f0]">
            <div className="container mx-auto flex items-center">
                <div className="text-white text-2xl font-bold">
                    <Link to="/">
                        <span className="transition duration-200">Authentication System</span>
                    </Link>
                </div>

                {/* Hamburger Icon for Mobile */}
                <div className="md:hidden ml-auto">
                    <button onClick={toggleMenu} className="text-white focus:outline-none">
                        {isMenuOpen ? (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg
                                className="w-6 h-6"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
                            </svg>
                        )}
                    </button>
                </div>

                {/* Static Navigation Links for Desktop */}
                <nav className="hidden md:flex md:ml-auto md:items-center space-x-4">
                    <Link to="/" className="text-white hover:text-[#00a8cc] transition duration-200 py-2">Home</Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/dashboard" className="text-white hover:text-[#00a8cc] transition duration-200 py-2">Dashboard</Link>
                            <Link to="/profile" className="text-white hover:text-[#00a8cc] transition duration-200 py-2">Profile</Link>
                        </>
                    )}
                    {isAuthenticated ? (
                        <button onClick={handleLogout} className="text-white hover:text-[#00a8cc] transition duration-200 py-2">
                            Log out
                        </button>
                    ) : (
                        <>
                            <Link to="/login" className="text-white hover:text-[#00a8cc] transition duration-200 py-2">Login</Link>
                            <Link to="/register" className="text-white hover:text-[#00a8cc] transition duration-200 py-2">Sign up</Link>
                        </>
                    )}
                </nav>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div ref={menuRef} className="md:hidden absolute top-16 left-0 right-0 bg-[#1a1a2e] text-[#f0f0f0]">
                    <nav className="flex flex-col items-start px-4">
                        <Link to="/" onClick={closeMenu} className="text-white hover:text-blue-300 transition duration-200 py-2">Home</Link>
                        {isAuthenticated && (
                            <>
                                <Link to="/dashboard" onClick={closeMenu} className="text-white hover:text-blue-300 transition duration-200 py-2">Dashboard</Link>
                                <Link to="/profile" onClick={closeMenu} className="text-white hover:text-blue-300 transition duration-200 py-2">Profile</Link>
                            </>
                        )}
                        {isAuthenticated ? (
                            <button onClick={handleLogout} className="text-white hover:text-blue-300 transition duration-200 py-2">
                                Log out
                            </button>
                        ) : (
                            <>
                                <Link to="/login" onClick={closeMenu} className="text-white hover:text-blue-300 transition duration-200 py-2">Login</Link>
                                <Link to="/register" onClick={closeMenu} className="text-white hover:text-blue-300 transition duration-200 py-2">Sign up</Link>
                            </>
                        )}
                    </nav>
                </div>
            )}
        </header>
    );
});

export default Header;
