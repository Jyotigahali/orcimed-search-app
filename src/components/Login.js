// Login.js
import React from 'react';
import '../styles/Login.css'; // For styling
import MicrosoftLogo from  '../images/MicrosoftLogo.png'

const Login = ({ onLogin }) => {
    return (
        <div className="login-container">
            <h1 className="login-caption">Please log in to access the document library files</h1>
            <button className="login-button" onClick={onLogin}>
                <img src={MicrosoftLogo} alt='microsoftLogo' /> Microsoft Login</button>
        </div>
    );
};

export default Login;
