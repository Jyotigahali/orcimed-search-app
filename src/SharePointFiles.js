// SharePointFiles.js
import React, { useEffect, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';

const msalConfig = {
    auth: {
        clientId: "8c7977b4-d4ff-4561-b53b-e9ca0e3f81a5", 
        authority: "https://login.microsoftonline.com/b628a32b-cfe7-4127-9019-c80574af0265",
        redirectUri: "http://localhost:3000", 
    }
};

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

const SharePointFiles = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const [error, setError] = useState(null);

    const login = async () => {
        try {
            await msalInstance.initialize(); // Ensure the MSAL instance is initialized
            const loginResponse = await msalInstance.loginPopup({
                scopes: ["User.Read", "Files.Read.All"] // Scopes that your app will request
            });
            setIsAuthenticated(true);
            setUserName(loginResponse.account.username); // Set the user name after successful login
            console.log("Login successful!", loginResponse);
        } catch (err) {
            setError(err.message);
            console.error("Login error: ", err);
        }
    };

    useEffect(() => {
        login(); // Trigger the login process when the component is mounted
    }, []);

    return (
        <div>
            <h2>SharePoint Document Library Files</h2>
            {isAuthenticated ? (
                <div>
                    <p>Welcome, {userName}!</p>
                    {/* Here you will render your SharePoint file list */}
                </div>
            ) : (
                <p>Please log in to access the document library files.</p>
            )}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
        </div>
    );
};

export default SharePointFiles;
