import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setMessage('');
        setLoading(true);
        try {
            const data = await login(username, password);
            if (data && data.roles && data.roles.includes("ROLE_ADMIN")) {
                navigate('/admin');
            } else {
                navigate('/dashboard');
            }
        } catch (error) {
            let resMessage = "";
            if (error.response && error.response.data) {
                if (error.response.data.message) {
                    resMessage = error.response.data.message;
                } else if (typeof error.response.data === 'object') {
                    const validationErrors = Object.values(error.response.data);
                    if (validationErrors.length > 0) {
                        resMessage = validationErrors.join(", ");
                    }
                }
            }

            if (!resMessage) {
                resMessage = error.message || error.toString();
            }
            setMessage(resMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card">
                <h2 className="auth-title">PaySecure</h2>
                <p className="auth-subtitle">Welcome back! Please login to your account.</p>

                {message && (
                    <div className="alert-custom alert-error" role="alert">
                        {message}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="Enter username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            autoComplete="off"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control form-input"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="new-password"
                                required
                                style={{ paddingRight: '4rem' }}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.875rem' }}
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                    </div>

                    <button
                        type="submit"
                        className="btn-primary-custom"
                        disabled={loading}
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>

                    <Link to="/register" className="auth-link">
                        Don't have an account? Sign Up
                    </Link>
                </form>
            </div>
        </div>
    );
};

export default Login;
