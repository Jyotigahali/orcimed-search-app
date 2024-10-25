// Login.js
import React from 'react';
import './Login.css'; // For styling

const Login = ({ onLogin }) => {
    return (
        <div className="login-container">
            <h1 className="login-caption">Please log in to access the document library files</h1>
            <button className="login-button" onClick={onLogin}>Login</button>
        </div>
    );
};

export default Login;
