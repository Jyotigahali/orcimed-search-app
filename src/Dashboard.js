// SharePointFiles.js
import React, { useEffect, useState } from 'react';
import { PublicClientApplication } from '@azure/msal-browser';
import { msalConfig } from './authConfigFile';
import { AuthenticatedTemplate, UnauthenticatedTemplate, useMsal } from '@azure/msal-react';
import HomeScreen from './Homescreen';
import { getFiles, getSearchedFiles } from './ServiceFile';
import SearchBar from './SearchBar';
import Login from './components/Login';

// Initialize MSAL instance
export const msalInstance = new PublicClientApplication(msalConfig);

const Dashboard = () => {
    const [showModal, setShowModal] = useState(false);
    const [searcheItem, setSearchItem] = useState('');
    const [files, setFiles] = useState([])
    const [error, setError] = useState(null);
    const [accessToken, setAccessToken] = useState();
    const {instance, accounts} = useMsal();
 const apiCall = async (token) => {
    searcheItem ? await getSearchedFiles(token,searcheItem).then((res) =>{
        setFiles(res.filter((file) => !file.file.name.endsWith("pdf")))
    }).catch(err => console.error(err)) : await getFiles(token).catch(err => console.error(err)).then((res) =>{
        setFiles(res.filter((file) => !file.file.name.endsWith("pdf")))
    });
 }
    const login = async (event) => {
        try {
            await msalInstance.initialize() // Ensure the MSAL instance is initialized

            event && await instance.loginPopup()
            .catch((err) => console.error(err))
            .then((res) => {
                apiCall(res?.accessToken);
                setAccessToken(res?.accessToken);
                setError("")
               }); 
               
            const accessTokenRequest = {
                scopes:["user.read"],
                account: accounts[0],
              };
           
           !event && await instance.acquireTokenSilent(accessTokenRequest)
            .then((res) => {
                apiCall(res.accessToken);
                setAccessToken(res.accessToken);
                setError("");
            }); 

        } catch (err) {
            setError(err.message);
            console.error("Login error: ", err);
        }
    };

    useEffect(() => {        
        // Trigger the login process when the component is mounted
        searcheItem || accessToken ? apiCall(accessToken) : login(null)
    }, [accessToken, searcheItem]);

    return (
        <div>
            <AuthenticatedTemplate>
            <SearchBar setSearcheItem={setSearchItem} apiCall={apiCall} token={accessToken} setShowModal={setShowModal}/>
            <HomeScreen error={error} files={files} token={accessToken} searcheItem={searcheItem} showModal={showModal} />
            </AuthenticatedTemplate>
            <UnauthenticatedTemplate >
            <Login onLogin={login}/>
            </UnauthenticatedTemplate>
        </div>
    );
};

export default Dashboard;
