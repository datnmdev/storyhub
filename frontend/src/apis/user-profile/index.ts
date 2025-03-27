import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const userApi = {
  getProfile: () => {
    return axiosInstance().get('/user-profile/get-profile');
  },
  getUserProfileInfo: (options: RequestInit) => {
    return axiosInstance().get(`/user-profile/${options.params.id}/get-info`);
  },
  updateProfile: (options: RequestInit) => {
    return axiosInstance().put('/user-profile', options.body);
  },
};

export default userApi;
