import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import OrderService from '../services/order.service';

const CreateOrder = () => {
    const [items, setItems] = useState([{ productName: '', quantity: 1, price: 0 }]);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleItemChange = (index, event) => {
        const values = [...items];
        values[index][event.target.name] = event.target.value;
        setItems(values);
    };

    const handleAddItem = () => {
        setItems([...items, { productName: '', quantity: 1, price: 0 }]);
    };

    const handleRemoveItem = (index) => {
        const values = [...items];
        values.splice(index, 1);
        setItems(values);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Price validation
        if (items.some(item => item.price <= 0 || item.quantity <= 0)) {
            setMessage("Price and quantity for all items must be greater than 0");
            return;
        }

        try {
            await OrderService.createOrder(items);
            navigate('/dashboard');
        } catch (error) {
            const resMessage =
                (error.response &&
                    error.response.data &&
                    error.response.data.message) ||
                error.message ||
                error.toString();
            setMessage(resMessage);
        }
    };

    return (
        <div className="container">
            <h3>Create New Order</h3>
            <form onSubmit={handleSubmit}>
                {items.map((item, index) => (
                    <div key={index} className="row mb-3 border p-3">
                        <div className="col-md-4">
                            <label>Product Name</label>
                            <input
                                type="text"
                                className="form-control"
                                name="productName"
                                value={item.productName}
                                onChange={(event) => handleItemChange(index, event)}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label>Quantity</label>
                            <input
                                type="number"
                                className="form-control"
                                name="quantity"
                                value={item.quantity}
                                min="1"
                                onChange={(event) => handleItemChange(index, event)}
                                required
                            />
                        </div>
                        <div className="col-md-3">
                            <label>Price (₹)</label>
                            <input
                                type="number"
                                className="form-control"
                                name="price"
                                value={item.price}
                                min="1"
                                onChange={(event) => handleItemChange(index, event)}
                                required
                            />
                        </div>
                        <div className="col-md-2 d-flex align-items-end">
                            {items.length > 1 && (
                                <button
                                    type="button"
                                    className="btn btn-danger"
                                    onClick={() => handleRemoveItem(index)}
                                >
                                    -
                                </button>
                            )}
                            <button
                                type="button"
                                className="btn btn-secondary ms-2"
                                onClick={handleAddItem}
                            >
                                +
                            </button>
                        </div>
                    </div>
                ))}

                {message && (
                    <div className="alert alert-danger" role="alert">
                        {message}
                    </div>
                )}

                <div className="d-flex gap-2 mt-3">
                    <button type="submit" className="btn btn-primary">Place Order</button>
                    <button type="button" className="btn btn-secondary" onClick={() => navigate('/dashboard')}>Back to Dashboard</button>
                </div>
            </form>
        </div>
    );
};

export default CreateOrder;
