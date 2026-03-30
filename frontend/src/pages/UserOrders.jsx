import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import OrderService from '../services/order.service';

const UserOrders = () => {
    const { userId } = useParams();
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadUserOrders();
    }, [userId]);

    const loadUserOrders = async () => {
        try {
            const response = await OrderService.getOrdersByUserId(userId);
            setOrders(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to load user orders. ' + (err.response?.data?.message || err.message));
            setLoading(false);
        }
    };

    if (loading) return <div className="container mt-4">Loading user orders...</div>;

    return (
        <div className="container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                <h2>User Orders (ID: {userId})</h2>
                <button className="btn btn-outline-secondary" onClick={() => navigate('/admin')}>
                    Back to Admin Dashboard
                </button>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            {orders.length === 0 ? (
                <p className="text-muted">No orders found for this user.</p>
            ) : (
                <div className="table-responsive">
                    <table className="table table-striped table-hover mt-3 shadow-sm rounded">
                        <thead className="table-dark">
                            <tr>
                                <th>Order ID</th>
                                <th>Date & Time</th>
                                <th>Product Details</th>
                                <th>Amount</th>
                                <th>Payment Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map(order => {
                                const orderDate = new Date(order.createdAt);
                                const dateFormatted = orderDate.toLocaleDateString();
                                const timeFormatted = orderDate.toLocaleTimeString();
                                const productNames = order.items && order.items.length > 0 
                                    ? order.items.map(item => item.productName).join(', ') 
                                    : 'N/A';
                                
                                return (
                                    <tr key={order.id}>
                                        <td>#{order.id}</td>
                                        <td>
                                            <div>{dateFormatted}</div>
                                            <small className="text-muted">{timeFormatted}</small>
                                        </td>
                                        <td>{productNames}</td>
                                        <td className="fw-bold">₹{order.totalAmount}</td>
                                        <td>
                                            <span className={`badge ${order.status === 'PAID' ? 'bg-success' : (order.status === 'CREATED' ? 'bg-warning text-dark' : 'bg-secondary')}`}>
                                                {order.status === 'CREATED' ? 'PENDING / UNPAID' : order.status}
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default UserOrders;
