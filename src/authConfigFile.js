// src/authConfig.js
export const msalConfig = {
  auth: {
    clientId: "5c708616-ab51-4eb9-bbbd-7d31913eccae", 
    authority: "https://login.microsoftonline.com/46276774-ae30-44c1-bec3-a9b3d9c60fea",
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

