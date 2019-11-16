// Base url of the API
const baseUrl = "http://vps.skarzi.com"
const baseUsersUrl = "users";
const baseTokenUrl = "users/auth/tokens";
const baseQuestion = "questions/random";
const baseImageSubmit = "detect-objects";
const baseImageAdd = "detection-objects";
const baseListImages = "detection-objects";
const baseImageDelete = "detection-objects";

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

export const submitImage = async (token, imageDataBase64, width, height) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the submitImage function');
  }
  const localToken = token || cachedToken;

  let response = await fetch(`${baseUrl}/${baseImageSubmit}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    },
    body: JSON.stringify({ image: imageDataBase64 })
  });

  if (response.status == 200) {
    let responseJson = await response.json();  
    let objects = [];
    for (let object of responseJson) {
      objects.push({
        object: object.obj_name,
        x1: object.bb_vertices[0].x * width, 
        y1: object.bb_vertices[0].y * height,
        x2: object.bb_vertices[2].x * width,
        y2: object.bb_vertices[2].y * height,
      })
    }
    return objects;
  }
  
  throw new Error(`HTTP Request submitImage failed with status code ${response.status}`);  
}

export const addImage = async (token, imageDataBase64, price, label) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the addImage function');
  }
  const localToken = token || cachedToken;

  let response = await fetch(`${baseUrl}/${baseImageAdd}`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    },
    body: JSON.stringify({ image: imageDataBase64, price, label  })
  });

  if (response.status == 201) {
    let responseJson = await response.json();  
    return responseJson;
  }
  
  throw new Error(`HTTP Request addImage failed with status code ${response.status}`);  
}

export const getSavedImagesAndPrices = async (token) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the getQuestion function');
  }
  const localToken = token || cachedToken;

  let response = await fetch(`${baseUrl}/${baseListImages}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    },
  });
  if (response.status == 200) {
    let responseJson = await response.json();  
    return responseJson;
  }
  throw new Error(`HTTP Request getSavedImagesAndPrices failed with status code ${response.status}`);  
}

export const deleteImage = async (token, imageId) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the addImage function');
  }
  const localToken = token || cachedToken;

  let response = await fetch(`${baseUrl}/${baseImageDelete}/${imageId}`, {
    method: 'DELETE',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    }
  });

  if (response.status == 200) {
    return true;
  }
  
  throw new Error(`HTTP Request deleteImage failed with status code ${response.status}`);  
}