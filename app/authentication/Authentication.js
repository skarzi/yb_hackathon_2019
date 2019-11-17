// Base url of the API
//const baseUrl = "http://vps.skarzi.com"
const baseUrl = "http://92778af4.ngrok.io"
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

export const createChild = async (token, username) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the getChildren function');
  }
  const localToken = token || cachedToken;

  let response = await fetch(`${baseUrl}/users/self/children`, { 
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      Authorization: `Bearer ${localToken}`,
    },
    body: JSON.stringify({ username })
  });

  if (response.status == 201) {
    let responseJson = await response.json();
    console.log(responseJson);
    return responseJson.username;
  }
  
  throw new Error(`HTTP Request createChild failed with status code ${response.status}`);
}

export const getChildren = async (token) => {
  if (cachedToken.length == "" && token == undefined) {
    throw new Error('Please provide a token for the getChildren function');
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
    return responseJson.username;
  }
  
  throw new Error(`HTTP Request getChildren failed with status code ${response.status}`);
}

export const getFirstChild = async (token, retry) => {
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
    if(responseJson.children.length == 0 && retry !== true) {
      await createChild(token, "Lukas");
      return await getFirstChild(token, true);
    }
    return responseJson.children[0].id;
  }
  
  throw new Error(`HTTP Request getFirstChild failed with status code ${response.status}`);
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
  console.log(await response.json());
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
  
  throw new Error(`HTTP Request setBalance failed with status code ${response.status}`); 
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

export const addBalanceTransaction = async(token, userId, amount) => {
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
    body: JSON.stringify({ type: "INCOME", detection_object_id: objectId })
  });

  if (response.status == 201) {
    return;
  }
  
  throw new Error(`HTTP Request doTransaction failed with status code ${response.status}`);
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