// Base url of the API
const baseUrl = "http://vps.skarzi.com"
const baseUsersUrl = "users";
const baseTokenUrl = "users/auth/tokens";
const baseQuestion = "questions/random";
const baseImageSubmit = "detect-objects";
const baseImageAdd = "detection-objects";

let cachedToken = "";

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

export const getFirstChild = async (token) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the getFirstChild function');
  }
  const localToken = token || cachedToken;

  let response = await fetch(`${baseUrl}/users/self`, { 
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    },
  });

  if (response.status == 200) {
    let responseJson = await response.json(); 
    return responseJson.children[0].id;
  }
  
  throw new Error(`HTTP Request getFirstChild failed with status code ${response.status}`);
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

export const getBalance = async (token, child_id) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the getBalance function');
  }
  const localToken = token || cachedToken;

  let response = await fetch(`${baseUrl}/users/${child_id}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    }
  });

  if (response.status == 200) {
    let responseJson = await response.json();  
    return responseJson.balance;
  }
  
  throw new Error(`HTTP Request getBalance failed with status code ${response.status}`); 

  // GET /users/id
}

export const setBalance = async(token, balance) => {
  let response = await fetch(`${baseUrl}/detection-objects?label=${objectName}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    }
  });

  if (response.status == 200) {
    let responseJson = await response.json();  
    return { price: responseJson.price };
  }
  
  throw new Error(`HTTP Request getObject failed with status code ${response.status}`); 
}

export const getObject = async (token, objectName) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the getObject function');
  }
  const localToken = token || cachedToken;

  let response = await fetch(`${baseUrl}/detection-objects?label=${objectName}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    }
  });

  if (response.status == 200) {
    let responseJson = await response.json(); 
    if (responseJson.length == 0) {
      return { price: 0.0, id: -1 }
    } 

    return { price: responseJson[0].price, id: responseJson[0].id };
  }
  
  throw new Error(`HTTP Request getObject failed with status code ${response.status}`); 
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

export const doTransaction = async(token, userId, objectId) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the doTransaction function');
  }
  const localToken = token || cachedToken;

  let response = await fetch(`${baseUrl}/users/${userId}/transactions`, {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    },
    body: JSON.stringify({ type: "EXPENSE", detection_object_id: objectId })
  });

  if (response.status == 201) {
    return;
  }
  
  throw new Error(`HTTP Request doTransaction failed with status code ${response.status}`);
}