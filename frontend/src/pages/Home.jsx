import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div className="container text-center mt-5">
            <div className="jumbotron">
                <h1 className="display-4">Welcome to OrderPay</h1>
                <p className="lead">The best place to manage your orders and payments.</p>
                <hr className="my-4" />
                <p>Get started by logging in or registering an account.</p>
                <Link className="btn btn-primary btn-lg me-2" to="/login" role="button">Login</Link>
                <Link className="btn btn-secondary btn-lg" to="/register" role="button">Register</Link>
            </div>
        </div>
    );
};

export default Home;
