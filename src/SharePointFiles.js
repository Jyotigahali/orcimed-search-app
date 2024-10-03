// SharePointFiles.js
import React, { useEffect, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { loginRequest, msalConfig } from './authConfigFile';
import { MsalProvider, useMsal } from '@azure/msal-react';
import axios from 'axios';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

const SharePointFiles = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [userName, setUserName] = useState("");
    const [error, setError] = useState(null);
    const {instance, accounts} = useMsal();
 const apiCall = async (token) => {
    const apiUrl = `https://graph.microsoft.com/v1.0/sites/e2198835-654d-418c-830f-97303ae5b25e/drives/b!NYgZ4k1ljEGDD5cwOuWyXqagOUfN8KBLhXC8Fj-LnbOYys0eNiKwSYPqabU3psXn/root/children/Product Lists/children`;
   await axios.get(apiUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
        },
      }).catch(err => console.error(err)).then((res) => console.log(res)
      );
    //   console.log(response);
 }
    const login = async () => {
        try {
            // const siteUrl = 'https://orcimedlifesciences.sharepoint.com/sites/MedTrackProject';
           
            await msalInstance.initialize()
            //await msalInstance.initialize(); // Ensure the MSAL instance is initialized
            const accessTokenRequest = {
                scopes: ["user.read"],
                account: accounts[0],
              };
            await instance.loginPopup()
            .catch((err) => console.error(err))
            .then((res) => console.log(res));
            setIsAuthenticated(true);
           await instance.acquireTokenSilent(accessTokenRequest)
            .then((res) => apiCall(res.accessToken))
      
            setUserName(accounts[0]?.username); // Set the user name after successful login
            //console.log("Login successful!", loginResponse);
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
