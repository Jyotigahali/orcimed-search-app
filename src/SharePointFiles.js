// SharePointFiles.js
import React, { useEffect, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { loginRequest, msalConfig } from './authConfigFile';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import HomeScreen from './Homescreen';
import axios from 'axios';
import { getFiles } from './ServiceFile';

// Initialize MSAL instance
const msalInstance = new PublicClientApplication(msalConfig);

const SharePointFiles = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [fileNames, setFileNames] = useState([]);
    const [files, setFiles] = useState([])
    const [userName, setUserName] = useState("");
    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState();
    const {instance, accounts} = useMsal();
 const apiCall = async (token) => {
    await getFiles(token).catch(err => console.error(err)).then((res) =>{
        setFileNames(res.data.value.map(file => file.name));
        setFiles(res.data.value.map(file => file))
    });
 }
    const login = async () => {
        try {           
            await msalInstance.initialize()
            //await msalInstance.initialize(); // Ensure the MSAL instance is initialized
            const accessTokenRequest = {
                scopes: ["user.read"],
                account: accounts[0],
              };
            await instance.loginPopup()
            .catch((err) => console.error(err))
           
           await instance.acquireTokenSilent(accessTokenRequest)
            .then((res) => {apiCall(res.accessToken);setAccessToken(res.accessToken)});
            setIsAuthenticated(true);
      
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
            <AuthenticatedTemplate>
            <HomeScreen fileNames={fileNames} error={error} files={files} token={accessToken} />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate >
                {/* {login()} */}
            <p>Please log in to access the document library files.</p> <button onClick={login} >Login</button>
            </UnauthenticatedTemplate>      
            
        </div>
    );
};

export default SharePointFiles;
