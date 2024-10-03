


const msalConfig = {
    auth: {
        clientId: "8c7977b4-d4ff-4561-b53b-e9ca0e3f81a5", // Replace with your Azure AD Application (client) ID
        authority: "https://login.microsoftonline.com/b628a32b-cfe7-4127-9019-c80574af0265", // Replace with your Azure AD Tenant ID
        redirectUri: "http://localhost:3000", // Replace with your redirect URI
    }
};

const msalInstance = new PublicClientApplication(msalConfig);

async function login() {
    try {
        const loginResponse = await msalInstance.loginPopup({
            scopes: ["User.Read", "Files.Read.All"] // Scopes that your app will request
        });
        console.log("Login successful!", loginResponse);
    } catch (error) {
        console.error("Login error: ", error);
    }
}

// Call this function in a useEffect or wherever it's appropriate in your component lifecycle.
login();
