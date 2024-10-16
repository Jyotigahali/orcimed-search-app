// App.js
import React from 'react';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfigFile';
import { PublicClientApplication } from '@azure/msal-browser';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import RowDetails from './components/RowDetails';
import Dashboard from './Dashboard';

const msalInstance = new PublicClientApplication(msalConfig);
function App() {
    return (
        <div className="App">
            <MsalProvider instance={msalInstance}>
                <BrowserRouter>
                <Routes>
                    <Route path='/'  Component={Dashboard}/>
                    <Route path='detailedView' Component={RowDetails}/>
                </Routes>
                </BrowserRouter>
            </MsalProvider>
        </div>
    );
}

export default App;
