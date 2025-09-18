import { createAsyncThunk } from "@reduxjs/toolkit";
import authApi from "../../api/auth";
import { AUTH } from "../../config/api";
import { ILogin } from "../../types/auth";

const onLogin = createAsyncThunk(
  AUTH.LOGIN,
  async (data: ILogin) => {
    const response = await authApi.Login(data);
    console.log('call action')
    return response;
  });

const onCheckRefreshToken = createAsyncThunk(
  AUTH.CHECK_REFRESH_TOKEN,
  async () => {
    const response = await authApi.CheckRefreshToken();
    return response;
  });

const onRefreshToken = createAsyncThunk(
  AUTH.REFRESH_TOKEN,
  async () => {
    const response = await authApi.RefreshToken();
    return response;
  });

export {
  onLogin,
  onCheckRefreshToken,
  onRefreshToken,
};
