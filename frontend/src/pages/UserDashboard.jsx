import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import OrderService from '../services/order.service';
import PaymentService from '../services/payment.service';

const UserDashboard = () => {
    const [view, setView] = useState('orders'); // 'orders' or 'payments'
    const [orders, setOrders] = useState([]);
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingPaymentId, setProcessingPaymentId] = useState(null);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        loadData();
    }, [view]);

    const loadData = async () => {
        setLoading(true);
        setError('');
        try {
            if (view === 'orders') {
                const response = await OrderService.getMyOrders();
                setOrders(response.data);
            } else if (view === 'payments') {
                const response = await PaymentService.getMyPayments();
                setPayments(response.data);
            }
        } catch (err) {
            setError("Failed to load data: " + (err.response?.data?.message || err.message));
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (orderId) => {
        try {
            setProcessingPaymentId(orderId);
            setMessage('');
            setError('');
            await PaymentService.payOrder(orderId);
            setMessage(`Payment successful for Order #${orderId}`);
            loadData(); // Reload to update status
        } catch (err) {
            setError(err.response?.data?.message || err.response?.data || err.message);
        } finally {
            setProcessingPaymentId(null);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="row">
                <div className="col-md-3 bg-light p-4 shadow-sm rounded" style={{ minHeight: '80vh' }}>
                    <h4 className="mb-4 text-primary">Menu</h4>
                    <div className="list-group">
                        <Link to="/create-order" className="list-group-item list-group-item-action mb-2 border-primary fw-bold text-primary">
                            + Create New Order
                        </Link>
                        <div 
                            className={`list-group-item list-group-item-action mb-2 ${view === 'orders' ? 'active' : ''}`} 
                            style={{ cursor: 'pointer' }}
                            onClick={() => setView('orders')}
                        >
                            My Orders
                        </div>
                        <div 
                            className={`list-group-item list-group-item-action ${view === 'payments' ? 'active' : ''}`} 
                            style={{ cursor: 'pointer' }}
                            onClick={() => setView('payments')}
                        >
                            Payment History
                        </div>
                    </div>
                </div>
                
                <div className="col-md-9 p-4">
                    <div className="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
                        <h2>{view === 'orders' ? 'My Orders' : 'My Payments'}</h2>
                    </div>

                    {message && <div className="alert alert-success">{message}</div>}
                    {error && <div className="alert alert-danger">{error}</div>}

                    {loading ? (
                        <div>Loading...</div>
                    ) : (
                        <>
                            {view === 'orders' && (
                                orders.length === 0 ? (
                                    <p>No orders found.</p>
                                ) : (
                                    <table className="table table-striped table-hover shadow-sm rounded">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>ID</th>
                                                <th>Date</th>
                                                <th>Items</th>
                                                <th>Total Amount</th>
                                                <th>Status</th>
                                                <th>Actions</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {orders.map(order => (
                                                <tr key={order.id}>
                                                    <td>#{order.id}</td>
                                                    <td>{new Date(order.createdAt).toLocaleString()}</td>
                                                    <td>{order.items && order.items.map(i => i.productName).join(', ')}</td>
                                                    <td className="fw-bold">₹{order.totalAmount}</td>
                                                    <td>
                                                        <span className={`badge ${order.status === 'PAID' ? 'bg-success' : 'bg-warning text-dark'}`}>
                                                            {order.status}
                                                        </span>
                                                    </td>
                                                    <td>
                                                        {order.status === 'CREATED' && (
                                                            <button
                                                                className="btn btn-sm btn-success fw-bold"
                                                                onClick={() => handlePay(order.id)}
                                                                disabled={processingPaymentId === order.id}
                                                            >
                                                                {processingPaymentId === order.id ? 'Processing...' : 'Pay Now'}
                                                            </button>
                                                        )}
                                                        {order.status === 'PAID' && (
                                                            <span className="text-success fw-bold">✓ Paid</span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )
                            )}

                            {view === 'payments' && (
                                payments.length === 0 ? (
                                    <p>No payments found.</p>
                                ) : (
                                    <table className="table table-striped table-hover shadow-sm rounded">
                                        <thead className="table-dark">
                                            <tr>
                                                <th>Payment ID</th>
                                                <th>Order Details</th>
                                                <th>Amount</th>
                                                <th>Date & Time</th>
                                                <th>Status</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {payments.map(payment => {
                                                const productNames = payment.order?.items?.map(i => i.productName).join(', ') || 'N/A';
                                                return (
                                                    <tr key={payment.id}>
                                                        <td>#{payment.id}</td>
                                                        <td>
                                                            <div><strong>Order #{payment.order?.id}</strong></div>
                                                            <small className="text-muted">{productNames}</small>
                                                        </td>
                                                        <td className="fw-bold text-success">₹{payment.amount}</td>
                                                        <td>{new Date(payment.paymentDate).toLocaleString()}</td>
                                                        <td>
                                                            <span className="badge bg-success">{payment.status}</span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                )
                            )}
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;
