import axiosInstance from 'libs/axios';

const walletApi = {
  getWallet: () => {
    return axiosInstance().get('/wallet');
  },
};

export default walletApi;
