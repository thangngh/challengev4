import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from "axios";
import { API_PREFIX } from "../config/constants";
import { getLocalStorage } from "./localstorage";
import { parseJwt } from "./token";
import { EHttpRequest } from "../config/enum";

const axiosConfig = axios.create({
  baseURL: API_PREFIX,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
})


axiosConfig.interceptors.request.use((request) => {
  console.log('[axios request]', request);
  const accessToken = getLocalStorage('access_token');
  const accessTokenExpired = getLocalStorage('access_token_expired');
  console.log('accessToken', accessToken);
  console.log('accessTokenExpired', accessTokenExpired);

  if (accessToken) {
    const isExpired = parseJwt(accessToken);

    if (!isExpired) {
      request.headers['Authorization'] = `Bearer ${accessToken}`
    } else {
      return Promise.reject('Unauthenticated');
    }
  }


  return request;
}, (error: AxiosError) => {
  console.log('[axios request error]', error);

  return Promise.reject(error)
})

axiosConfig.interceptors.response.use((response) => {
  console.log('[axios response]', response);

  return response;
}, (error) => {
  console.log('[axios response error]', error.response.data);

  const errorData = { ...error.response.data };

  return Promise.reject(errorData.message);
})


const makeRequest = async <T>(
  method: AxiosRequestConfig['method'],
  url: string,
  data?: any,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> => {
  try {
    const response = await axiosConfig.request<T>({
      method,
      url,
      data,
      ...config,
    });
    return response;
  } catch (error: any) {
    throw new Error(error);
  }
};

const get = <T>(url: string, config?: AxiosRequestConfig, ..._arr: string[]) => {
  return makeRequest<T>(EHttpRequest['GET'], url, undefined, config)
};

const post = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return makeRequest<T>(EHttpRequest['POST'], url, data, config)
};

const put = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return makeRequest<T>(EHttpRequest['PUT'], url, data, config)
};

const del = <T>(url: string, config?: AxiosRequestConfig) => {
  return makeRequest<T>(EHttpRequest['DELETE'], url, undefined, config)
};

const patch = <T>(url: string, data?: any, config?: AxiosRequestConfig) => {
  return makeRequest<T>(EHttpRequest['PATCH'], url, data, config)
};

export { get, post, put, del, patch };
export default axiosConfig;
