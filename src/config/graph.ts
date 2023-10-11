import { currentUserConfig } from './authConfig';

export async function callMeMsGraph(accessToken: string) {
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    headers.append('Authorization', bearer);

    const options = {
        method: 'GET',
        headers: headers
    };

    return fetch(currentUserConfig.graphMeEndpoint, options)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}

export async function callProfilesMsGraph(accessToken: string) {
    const graphProfilesTop200Endpoint = 'https://graph.microsoft.com/v1.0/users?&$top=200&$count=true&$filter=surname ne null and givenName ne null&$orderBy=displayName&$select=id,displayName,userPrincipalName';
    const headers = new Headers();
    const bearer = `Bearer ${accessToken}`;
    headers.append('Authorization', bearer);
    headers.append('ConsistencyLevel', 'eventual');

    const options = {
        method: 'GET',
        headers: headers
    };

    return fetch(graphProfilesTop200Endpoint, options)
        .then((response) => response.json())
        .catch((error) => console.error(error));
}
