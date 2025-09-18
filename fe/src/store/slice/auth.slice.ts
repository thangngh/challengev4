import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { BASE_URL } from "../../config/constants";
import { setLocalStorage } from "../../lib/localstorage";
import { parseBodyJwt } from "../../lib/token";
import { onCheckRefreshToken, onLogin, onRefreshToken } from "../action/auth.action";
import { HttpResponseMessage } from "../../config/enum";
import Toast from "../../lib/toast";
import { IResponseLogin } from "../../types/auth";

interface IAuthState {
  user: any,
  isRefreshToken: boolean,
  isProcessing: boolean,
  isHttpRFError: boolean,
  locationUrl: string | null,
}

const initialState: IAuthState = {
  user: null,
  isRefreshToken: false,
  isProcessing: false,
  isHttpRFError: false,
  locationUrl: null,
}

const authSlice = createSlice({
    name: 'auth',
  initialState: initialState,
  reducers: {
    setLocationUrl: (state, action: PayloadAction<string>) => {
      const makeUrl = new URL(action.payload, BASE_URL).toString();
      state.locationUrl = makeUrl;
    },
    resetIsHttpRFError: (state) => {
      state.isHttpRFError = false;
    },
    setIsRefreshToken: (state, action) => {
      state.isRefreshToken = action.payload
    }
  },
  extraReducers: (builder) => {
    builder.addCase(onLogin.pending, (state, action) => {
      state.isProcessing = true;
    })
    builder.addCase(onLogin.fulfilled, (state, action) => {

      if (action.payload) {
        const { accessToken, accessTokenExpired, statusCode } = action.payload as IResponseLogin;
        if (statusCode === 202) {
          setLocalStorage('access_token', accessToken);
          setLocalStorage('access_token_expired', accessTokenExpired as unknown as string);
          state.isRefreshToken = true;
        }
      }

      state.isProcessing = false;
    })
    builder.addCase(onLogin.rejected, (state, action) => {
      if (action.error) {
        const error = action.error as Error;
        Toast.error(error.message);
      }
      state.user = null;
      state.isProcessing = false;
    })
    builder.addCase(onCheckRefreshToken.fulfilled, (state, action) => {
      if (action.payload || state.isHttpRFError) {
        const { rfToken } = (action.payload) as { rfToken: string };
        const { username, userId } = parseBodyJwt(rfToken);

        state.isRefreshToken = true;
        state.user = { username, userId };
      }
    })
    .addCase(onCheckRefreshToken.rejected, (state, action) => {
      if (action.error) {
        const error = (action.error.message as string);
        if (error === HttpResponseMessage['UN_AUTHORIZED']) {
          state.isRefreshToken = false;
        }
      }
    })
    builder
    .addCase(onRefreshToken.fulfilled, (state, action) => {
      console.log('onRefreshToken' ,action)
      if (action.payload) {
        const { accessToken, accessTokenExpired, statusCode } = action.payload as IResponseLogin;
        if (statusCode === 202) {
          setLocalStorage('access_token', accessToken);
          setLocalStorage('access_token_expired', accessTokenExpired as unknown as string);
          state.isRefreshToken = true;
        }
      }
    })
    .addCase(onRefreshToken.rejected, (state, action) => {
      console.log('on rj reject', action)
      const err = !!action.error;
      state.isHttpRFError = err;
    })
  }
})

export const { resetIsHttpRFError, setIsRefreshToken, setLocationUrl } = authSlice.actions;

export default authSlice.reducer;
