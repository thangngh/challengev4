import { AUTH } from "../config/api";
import { get, post } from "../lib/axios";
import { ILogin } from "../types/auth";


const authApi = {
  Login: async (data: ILogin) => {
    const response = await post(AUTH.LOGIN, data);
    return response.data;
  },
  CheckRefreshToken: async () => {
    const response = await get(
      AUTH.CHECK_REFRESH_TOKEN,
      {
        withCredentials: true
      }
    );
    return response.data;
  },
  RefreshToken: async () => {
    const response = await post(
      AUTH.REFRESH_TOKEN,
      {},
      {
        withCredentials: true
      }
    );
    return response.data;
  }
};

export default authApi;
