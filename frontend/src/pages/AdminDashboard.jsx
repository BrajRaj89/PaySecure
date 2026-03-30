import React, { useEffect, useState } from 'react';
import UserService from '../services/user.service';
import OrderService from '../services/order.service';
import PaymentService from '../services/payment.service';

import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const [view, setView] = useState('users');
    const [data, setData] = useState([]);
    const [allOrders, setAllOrders] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        loadData(view);
    }, [view]);

    const loadData = async (currentView) => {
        setLoading(true);
        setData([]);
        setError('');
        try {
            let response;
            if (currentView === 'users') {
                response = await UserService.getAllUsers();
                const ordersResponse = await OrderService.getAllOrders();
                setAllOrders(ordersResponse.data || []);
            } else if (currentView === 'orders') {
                response = await OrderService.getAllOrders();
            } else if (currentView === 'payments') {
                response = await PaymentService.getAllPayments();
            }
            setData(response.data);
        } catch (err) {
            setError('Failed to load data.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container-fluid py-4">
            <div className="d-flex justify-content-between align-items-center mb-4 pb-2 border-bottom">
                <h2>Admin Dashboard</h2>
            </div>
            
            <div className="border bg-white p-4 shadow-sm rounded" style={{ minHeight: '80vh' }}>
                <div className="btn-group mb-4">
                    <button
                        className={`btn ${view === 'users' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setView('users')}
                        style={{ padding: '0.5rem 1.5rem', fontWeight: '500' }}
                    >
                        Users
                    </button>
                    <button
                        className={`btn ${view === 'orders' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setView('orders')}
                        style={{ padding: '0.5rem 1.5rem', fontWeight: '500' }}
                    >
                        Orders
                    </button>
                    <button
                        className={`btn ${view === 'payments' ? 'btn-primary' : 'btn-outline-primary'}`}
                        onClick={() => setView('payments')}
                        style={{ padding: '0.5rem 1.5rem', fontWeight: '500' }}
                    >
                        Payments
                    </button>
                </div>

            {loading && <p>Loading...</p>}
            {error && <div className="alert alert-danger">{error}</div>}

            {!loading && !error && (
                <div>
                    {view === 'users' && (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Order Count</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.filter(user => user.role !== 'ADMIN' && user.role !== 'ROLE_ADMIN').map(user => {
                                    const userOrderCount = allOrders.filter(o => o.user && o.user.id === user.id).length;
                                    return (
                                    <tr 
                                        key={user.id} 
                                        style={{ cursor: 'pointer' }}
                                        onClick={() => navigate(`/admin/user/${user.id}/orders`)}
                                        className="table-hover-row"
                                    >
                                        <td>{user.id}</td>
                                        <td>{user.username}</td>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{userOrderCount}</td>
                                    </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    )}

                    {view === 'orders' && (
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>User</th>
                                    <th>Order Name (Items)</th>
                                    <th>Total</th>
                                    <th>Status</th>
                                    <th>Created At</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data.map(order => (
                                    <tr key={order.id}>
                                        <td>{order.id}</td>
                                        <td>{order.user ? order.user.username : 'N/A'}</td>
                                        <td>{order.items && order.items.length > 0 ? order.items.map(item => `${item.productName} (x${item.quantity})`).join(', ') : 'N/A'}</td>
                                        <td>₹{order.totalAmount}</td>
                                        <td>{order.status}</td>
                                        <td>{new Date(order.createdAt).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}

                    {view === 'payments' && (
                        <div className="table-responsive">
                            <table className="table table-hover align-middle bg-white border-light rounded">
                                <thead className="bg-light">
                                    <tr>
                                        <th className="py-3">Payment ID</th>
                                        <th className="py-3">Order ID</th>
                                        <th className="py-3">User</th>
                                        <th className="py-3">Amount</th>
                                        <th className="py-3">Status</th>
                                        <th className="py-3">Date</th>
                                        <th className="py-3">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.map(payment => {
                                        const username = payment.order?.user?.username || 'Unknown';
                                        return (
                                            <tr key={payment.id} className="transition-all" style={{ cursor: 'pointer' }}>
                                                <td className="fw-bold text-muted">#{payment.id}</td>
                                                <td><span className="badge bg-secondary text-white">#{payment.order?.id || 'N/A'}</span></td>
                                                <td>
                                                    <div className="d-flex align-items-center">
                                                        <div className="bg-primary text-white rounded-circle d-flex justify-content-center align-items-center me-3 shadow-sm" style={{ width: '40px', height: '40px', fontSize: '1.2rem', fontWeight: 'bold' }}>
                                                            {username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <span className="fw-medium">{username}</span>
                                                    </div>
                                                </td>
                                                <td className="fw-bold text-success fs-5">₹{payment.amount?.toLocaleString() || payment.amount}</td>
                                                <td>
                                                    <span className={`badge rounded-pill ${payment.status === 'SUCCESS' ? 'bg-success' : payment.status === 'PENDING' ? 'bg-warning text-dark' : 'bg-danger'} px-3 py-2 shadow-sm`}>
                                                        {payment.status}
                                                    </span>
                                                </td>
                                                <td className="text-muted fw-medium">{new Date(payment.paymentDate).toLocaleString('en-IN')}</td>
                                                <td>
                                                    <button 
                                                        className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold shadow-sm"
                                                        onClick={(e) => { e.stopPropagation(); alert(`Checking payment #${payment.id} receipt for ${username}...`); }}
                                                    >
                                                        Details
                                                    </button>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            )}
            </div>
        </div>
    );
};

export default AdminDashboard;
