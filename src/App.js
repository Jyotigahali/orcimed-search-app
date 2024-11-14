// App.js
import React from 'react';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfigFile';
import { PublicClientApplication } from '@azure/msal-browser';
import 'bootstrap/dist/css/bootstrap.min.css';
import { HashRouter, Route, Routes } from 'react-router-dom';
import RowDetails from './components/RowDetails';
import Dashboard from './Dashboard';

const msalInstance = new PublicClientApplication(msalConfig);
function App() {
    return (
        <div className="App">
            <MsalProvider instance={msalInstance}>
                <HashRouter>
                    <Routes>
                        <Route path='/' element={<Dashboard />} />
                        <Route path='detailedView' element={<RowDetails />} />
                    </Routes>
                </HashRouter>
            </MsalProvider>
        </div>
    );
}

export default App;
