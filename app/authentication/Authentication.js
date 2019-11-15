// Base url of the API
const baseUrl = "http://vps.skarzi.com"
const baseUsersUrl = "users";
const baseTokenUrl = "users/auth/tokens";

let cachedToken = "";
// Create a user through the API
export const createUser = async (username, password) => {
  let response = await fetch(`${baseUrl}/${baseUsersUrl}/`, { 
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  });

  if (response.status == 200) {
    let responeJson = await response.json();  
    return responeJson.username;
  }
  
  throw new Error(`HTTP Request createUser failed with status code ${response.status}`);
}

// Request a token by logging in
export const getToken = async (username, password) => {
  if (cachedToken.length > 0) {
    return cachedToken;
  }

  let response = await fetch(`${baseUrl}/${baseTokenUrl}`, { 
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ username, password })
  });

  if (response.status == 200) {
    let responseJson = await response.json();  
    cachedToken = responseJson.access_token;
    return responseJson.access_token;
  }
  
  throw new Error(`HTTP Request getToken failed with status code ${response.status}`);
}