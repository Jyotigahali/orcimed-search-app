// App.js
import React from 'react';
import SharePointFiles from './SharePointFiles';
import { MsalProvider } from '@azure/msal-react';
import { msalConfig } from './authConfigFile';
import { PublicClientApplication } from '@azure/msal-browser';
import 'bootstrap/dist/css/bootstrap.min.css';

const msalInstance = new PublicClientApplication(msalConfig);
function App() {
    return (
        <div className="App">
            <header className="App-header">

            </header>
            <main>
                
            <MsalProvider instance={msalInstance}><SharePointFiles /></MsalProvider>
                
            </main>
        </div>
    );
}

export default App;
