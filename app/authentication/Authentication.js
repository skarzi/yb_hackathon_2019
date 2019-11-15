// Base url of the API
const baseUrl = "http://vps.skarzi.com"
const baseUsersUrl = "users";
const baseTokenUrl = "users/auth/tokens";
const baseQuestion = "questions/random";
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

export const getQuestion = async (token) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the getQuestion function');
  }
  const localToken = token || cachedToken;

  let response = await fetch(`${baseUrl}/${baseQuestion}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    },
  });

  if (response.status == 200) {
    let responseJson = await response.json();  
    let options = [];
    for (let answer of responseJson.options) {
      options.push( { key: answer });
    }

    return { 
      correct_answer: responseJson.correct_answer,
      image_url: responseJson.image_url,
      options,
      reward: responseJson.reward,
      text: responseJson.text,
    };
  }
  
  throw new Error(`HTTP Request getToken failed with status code ${response.status}`);
}

export const getSavedImagesAndPrices = async (token) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the getQuestion function');
  }
  const localToken = token || cachedToken;

  let response = await fetch(`${baseUrl}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    },
  });
}