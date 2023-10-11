export const msalConfig = {
    auth: {
        clientId: '5d2f4288-f82a-465e-8617-05eec47d831e',
        authority: 'https://login.microsoftonline.com/7919f319-6639-492e-9220-0e48e9023e27',
        redirectUri: process.env.REACT_APP_UI_URL,
        postLogoutRedirectUri: process.env.REACT_APP_UI_URL
    },
    cache: {
        cacheLocation: 'sessionStorage', // This configures where your cache will be stored
        storeAuthStateInCookie: false // Set this to "true" if you are having issues on IE11 or Edge
    }
};

// Add scopes here for ID token to be used at Microsoft identity platform endpoints.
export const loginRequest = {
    scopes: ['User.Read']
};

// Add the endpoints here for Microsoft Graph API services you'd like to use.
export const currentUserConfig = {
    graphMeEndpoint: 'https://graph.microsoft.com/v1.0/me'
};
