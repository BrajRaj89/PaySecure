import api from './api';

const createOrder = (items) => {
    return api.post('/orders', { items });
};

const getMyOrders = () => {
    return api.get('/orders/my-orders');
};

const getAllOrders = () => {
    return api.get('/orders/all');
};

const getOrderById = (id) => {
    return api.get(`/orders/${id}`);
};

const getOrdersByUserId = (userId) => {
    return api.get(`/orders/user/${userId}`);
};

const OrderService = {
    createOrder,
    getMyOrders,
    getAllOrders,
    getOrderById,
    getOrdersByUserId
};

export default OrderService;
