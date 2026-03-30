import api from './api';

const payOrder = (orderId) => {
    return api.post(`/payments/${orderId}`);
};

const getAllPayments = () => {
    return api.get('/payments/all');
};

const getMyPayments = () => {
    return api.get('/payments/my-payments');
};

const PaymentService = {
    payOrder,
    getAllPayments,
    getMyPayments
};

export default PaymentService;
