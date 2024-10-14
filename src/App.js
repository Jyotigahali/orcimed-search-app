// App.js
import React from 'react';
import SharePointFiles from './SharePointFiles';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfigFile';
import { PublicClientApplication } from '@azure/msal-browser';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RowDetails from './components/RowDetails';

const msalInstance = new PublicClientApplication(msalConfig);
function App() {
    return (
        <div className="App">
            <MsalProvider instance={msalInstance}>
                <BrowserRouter>
                <Routes>
                    <Route path='/'  Component={SharePointFiles}/>
                    <Route path='detailedView' Component={RowDetails}/>
                </Routes>
                </BrowserRouter>
            </MsalProvider>
        </div>
    );
}

export default App;
