// src/authConfig.js
export const msalConfig = {
  auth: {
    clientId:process.env.REACT_APP_CLIENT_ID, 
    authority: `https://login.microsoftonline.com/${process.env.REACT_APP_TENANT_ID}`,
    redirectUri: "https://jyotigahali.github.io/orcimed-search-app/",// Adjust for production
  },
  cache: {
    cacheLocation: "sessionStorage", // You can change this
    storeAuthStateInCookie: false,
  },
};

export const protectedResources = {
  apiList: {
    endpoint: "http://localhost:3000",
    scopes: {
      read: ["https://orcimedlifesciences.sharepoint.com"],
      write: ["https://orcimedlifesciences.sharepoint.com"],
    },
  },
};

export const loginRequest = {
  scopes: [
    "Sites.Read.All",  // Microsoft Graph permissions for sites
    "Files.Read.All",
    "Files.ReadWrite.All"  // Permission to read & write files
  ], // Ensure SharePoint scope is present
};

