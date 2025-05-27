import {BaseUrl} from '../Api';
import axios from 'axios';

const callApi = async url => {
  try {
    const response = await axios.get(`${BaseUrl}${url}`, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.status < 400) {
      return response.data;
    } else {
      throw new Error(`API returned status ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
  // return new Promise(async (resolve, reject) => {
  //   let config = {
  //     method: 'get',
  //     url: url,
  //     baseURL: `${BaseUrl}`,
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //   };

  //   try {
  //     const response = await axios(config);

  //     if (response.status < 400) {
  //       resolve(response.data);
  //     } else {
  //       reject(response);
  //     }
  //   } catch (error) {
  //     reject(error);
  //   }
  // });
};

export {callApi};
