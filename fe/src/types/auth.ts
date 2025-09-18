export type ILogin = {
  username: string;
  password: string;
}

export type IResponseLogin = {
  accessToken: string;
  accessTokenExpired: number;
  statusCode: number
}

export type IAuthUser = {
  username: string,
  userId: string
}

export type IJwtBody = {
  exp: number;
  iat: number;
  username: string;
  userId: string;
}
