import {Api, BaseUrl} from '../Api';
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
};

const callApi1 = async (url, options = {}) => {
  const {method = 'GET', params = {}} = options;

  try {
    const response = await axios({
      url: `${BaseUrl}${url}`,
      method,
      headers: {
        'Content-Type': 'application/json',
      },
      params,
    });

    if (response.status < 400) {
      return response.data;
    } else {
      throw new Error(`API returned status ${response.status}`);
    }
  } catch (error) {
    throw error;
  }
};

const callPostApi = async (url, data) => {
  try {
    const response = await axios.post(`${BaseUrl}${url}`, data, {
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
};

export {callApi, callApi1,callPostApi};
