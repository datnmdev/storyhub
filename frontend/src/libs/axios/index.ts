import authFeature from '@features/auth';
import socketFeature from '@features/socket';
import store from '@store/index';
import axios, { HttpStatusCode } from 'axios';
import Cookies from 'js-cookie';

export default function axiosInstance(token?: string) {
  const accessToken = Cookies.get('accessToken');
  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_HOST}${import.meta.env.VITE_BASE_URI}`,
    headers: {
      Authorization: `Bearer ${token || accessToken || import.meta.env.VITE_GUEST_TOKEN}`,
    },
    withCredentials: true,
  });

  // Cấu hình tự động gọi refresh token và gọi lại api nếu access token hết hạn
  axiosInstance.interceptors.response.use(
    async (response) => response,
    async (error) => {
      if (
        error.response &&
        error.response.status === HttpStatusCode.Unauthorized
      ) {
        const refreshToken = (
          await axios({
            url: `${import.meta.env.VITE_SERVER_HOST}${import.meta.env.VITE_BASE_URI}/auth/refresh-token`,
            method: 'post',
            withCredentials: true,
          })
        ).data;

        if (refreshToken) {
          Cookies.set('accessToken', refreshToken.accessToken, {
            httpOnly: false,
            secure: true,
            sameSite: 'None',
            expires: 7200 / (60 * 60 * 24),
          });
          Cookies.set('refreshToken', refreshToken.refreshToken, {
            httpOnly: false,
            secure: true,
            sameSite: 'None',
            expires: 2592000 / (60 * 60 * 24),
          });
          store.dispatch(
            socketFeature.socketAction.setCreateNewConnection({
              isCreateNewConnection: true,
            })
          );
          error.config.headers.Authorization = `Bearer ${Cookies.get('accessToken')}`;
          return await axios(error.config);
        } else {
          store.dispatch(authFeature.authAction.signOut());
        }
      }
      return await Promise.reject(error);
    }
  );

  return axiosInstance;
}
