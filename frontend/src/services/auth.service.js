import api from './api';

const register = (username, email, password, role) => {
    return api.post('/auth/signup', {
        username,
        email,
        password,
        role
    });
};

const login = (username, password) => {
    return api.post('/auth/signin', {
        username,
        password,
    })
        .then((response) => {
            if (response.data.token) {
                sessionStorage.setItem('user', JSON.stringify(response.data));
            }
            return response.data;
        });
};

const logout = () => {
    sessionStorage.removeItem('user');
};

const getCurrentUser = () => {
    return JSON.parse(sessionStorage.getItem('user'));
};

const AuthService = {
    register,
    login,
    logout,
    getCurrentUser,
};

export default AuthService;
