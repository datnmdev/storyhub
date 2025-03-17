import { TOKEN_KEY } from '@constants/auth.constants';
import authFeature from '@features/auth';
import { Token } from '@features/auth/auth.type';
import store from '@store/index';
import axios, { HttpStatusCode } from 'axios';

export default function axiosInstance(token?: string) {
  const tokens = JSON.parse(localStorage.getItem(TOKEN_KEY) as string) as Token;
  const axiosInstance = axios.create({
    baseURL: `${import.meta.env.VITE_SERVER_HOST}${import.meta.env.VITE_BASE_URI}`,
    headers: {
      Authorization: `Bearer ${token || tokens?.accessToken}`,
    },
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
            data: JSON.parse(localStorage.getItem(TOKEN_KEY) as string),
          })
        ).data;

        if (refreshToken) {
          store.dispatch(authFeature.authAction.saveToken(refreshToken));
          error.config.headers.Authorization = `Bearer ${refreshToken.accessToken}`;
          return await axios(error.config);
        } else {
          store.dispatch(authFeature.authAction.signOut());
        }
      }
      return error;
    }
  );

  return axiosInstance;
}
