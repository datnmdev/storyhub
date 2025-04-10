import { RequestInit } from '@apis/api.type';
import axios from 'axios';
import axiosInstance from 'libs/axios';

const uploadApi = {
  getUploadUrl: (options: RequestInit) => {
    return axiosInstance().get('/aws-s3/generate-upload-url', {
      params: options.queries,
    });
  },
  upload: (options: RequestInit) => {
    return axios.put(options.uri!, options.body, {
      headers: options.headers,
    });
  },
};

export default uploadApi;
