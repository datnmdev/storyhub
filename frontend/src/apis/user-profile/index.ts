import axiosInstance from 'libs/axios';

const userApi = {
  getProfile: () => {
    return axiosInstance().get('/user-profile/get-profile');
  },
};

export default userApi;
