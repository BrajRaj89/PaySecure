import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [role, setRole] = useState('user');
    const [message, setMessage] = useState('');
    const [successful, setSuccessful] = useState(false);
    const [loading, setLoading] = useState(false);

    const { register } = useContext(AuthContext);

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');
        setSuccessful(false);
        setLoading(true);

        try {
            const roles = [role];
            await register(username, email, password, roles);
            setSuccessful(true);
            setMessage("Registration successful! You can now login.");
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
            setSuccessful(false);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card">
                <h2 className="auth-title">OrderPay</h2>
                <p className="auth-subtitle">Create your account to start managing orders.</p>

                {message && (
                    <div className={`alert-custom ${successful ? 'alert-success' : 'alert-error'}`} role="alert">
                        {message}
                    </div>
                )}

                {!successful && (
                    <form onSubmit={handleRegister}>
                        <div className="form-group">
                            <label className="form-label">Username</label>
                            <input
                                type="text"
                                className="form-input"
                                placeholder="Choose a username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                autoComplete="off"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Email Address</label>
                            <input
                                type="email"
                                className="form-input"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
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

                        <div className="form-group">
                            <label className="form-label">Role</label>
                            <select 
                                className="form-select form-input" 
                                value={role} 
                                onChange={(e) => setRole(e.target.value)}
                                style={{ backgroundColor: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1', padding: '0.75rem', borderRadius: '0.375rem', width: '100%' }}
                            >
                                <option value="user" style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>User</option>
                                <option value="admin" style={{ backgroundColor: '#ffffff', color: '#1e293b' }}>Admin</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            className="btn-primary-custom"
                            disabled={loading}
                        >
                            {loading ? 'Creating account...' : 'Sign Up'}
                        </button>
                    </form>
                )}

                {successful ? (
                    <Link to="/login" className="btn-primary-custom" style={{ display: 'block', textAlign: 'center', textDecoration: 'none' }}>
                        Go to Login
                    </Link>
                ) : (
                    <Link to="/login" className="auth-link">
                        Already have an account? Login
                    </Link>
                )}
            </div>
        </div>
    );
};

export default Register;
