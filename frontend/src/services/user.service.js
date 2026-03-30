import api from './api';

const getAllUsers = () => {
    return api.get('/users');
};

const UserService = {
    getAllUsers,
};

export default UserService;
