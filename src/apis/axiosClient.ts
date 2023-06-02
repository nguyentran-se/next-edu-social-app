import { Callback } from '@types';
import axios, { AxiosError } from 'axios';
import { InternalAxiosRequestConfig } from 'axios';
import qs from 'query-string';
import { DecodedToken, __DEV__, appCookies } from 'utils';

const axiosClient = axios.create({
  headers: {
    'Content-Type': 'application/json',
    // withCredentials: true,
    // credentials: 'include',
  },
  baseURL: undefined,
  paramsSerializer: { serialize: (params) => qs.stringify(params) },
});
let isRefreshing = false;
let failedQueue: { resolve: Callback; reject: Callback }[] = [];
function processQueue(error: any, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
}

axiosClient.interceptors.request.use(
  async (config) => {
    const accessToken = appCookies.getAccessToken();
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
      if (!config.baseURL) {
        const tokenData = appCookies.getDecodedAccessToken() as DecodedToken;
        const workspace = tokenData.domain.split('.')[0];
        if (!location.hostname.includes(workspace) && !__DEV__) {
          appCookies.clearAll();
          window.location.href = __DEV__
            ? 'http://localhost:8000/verify'
            : process.env.NEXT_PUBLIC_LANDING_URL + 'verify';
        }
        const baseURL = `http://api.${workspace}.funiverse.world`;
        axiosClient.defaults.baseURL = baseURL;
        config.baseURL = baseURL;
      }
    }
    return config;
  },
  (error) => {},
);

axiosClient.interceptors.response.use(
  (response) => {
    isRefreshing = false;
    if (failedQueue.length > 0) {
      const token = appCookies.getAccessToken();
      processQueue(null, token);
    }
    return response?.data;
  },
  (error: AxiosError) => {
    switch (error.response?.status) {
      case 401:
        return handle401Error(error);
      default:
        return Promise.reject(error);
    }
  },
);

export default axiosClient;

async function handle401Error(error: AxiosError) {
  const originalRequest = error.config as InternalAxiosRequestConfig<any>;
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    }).then(() => {
      return axiosClient.request(originalRequest);
    });
  }

  isRefreshing = true;
  const refreshToken = appCookies.getRefreshToken();

  const authApiURL = 'http://authen.system.funiverse.world/auth/refresh-token';
  try {
    const { accessToken } = await axios.post<{ accessToken: string }>(authApiURL, { refreshToken });
    appCookies.setAccessToken(accessToken);
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
  } catch (error) {
    appCookies.clearAll();
    window.location.href = __DEV__
      ? 'http://localhost:8000/verify'
      : process.env.NEXT_PUBLIC_LANDING_URL + 'verify';
  }

  processQueue(null, null);

  return axiosClient.request(originalRequest);
}
