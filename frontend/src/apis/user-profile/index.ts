import { RequestInit } from '@apis/api.type';
import axiosInstance from 'libs/axios';

const userApi = {
  getProfile: () => {
    return axiosInstance().get('/user-profile/get-profile');
  },
  getUserProfileInfo: (options: RequestInit) => {
    return axiosInstance().get(`/user-profile/${options.params.id}/get-info`);
  },
};

export default userApi;
