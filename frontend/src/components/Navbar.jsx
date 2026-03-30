import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import 'bootstrap/dist/css/bootstrap.min.css';

const Navbar = () => {
    const { currentUser, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark sticky-top">
            <div className="container-fluid">
                <Link to={currentUser ? "/dashboard" : "/login"} className="navbar-brand">
                    PaySecure
                </Link>
                <div className="navbar-nav mr-auto">
                    {currentUser && (
                        <>
                            <li className="nav-item">
                                <span className="nav-link text-white font-weight-bold">
                                    {currentUser.username} ({currentUser.roles.includes("ROLE_ADMIN") ? "Admin" : "User"})
                                </span>
                            </li>
                        </>
                    )}
                    {currentUser && currentUser.roles.includes("ROLE_ADMIN") && (
                        <li className="nav-item">
                            <Link to={"/admin"} className="nav-link">
                                Admin
                            </Link>
                        </li>
                    )}
                </div>

                <div className="d-flex">
                    {currentUser ? (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <button className="btn btn-link nav-link" onClick={handleLogout}>
                                    Logout
                                </button>
                            </li>
                        </div>
                    ) : (
                        <div className="navbar-nav ml-auto">
                            <li className="nav-item">
                                <Link to={"/login"} className="nav-link">
                                    Login
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link to={"/register"} className="nav-link">
                                    Sign Up
                                </Link>
                            </li>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
