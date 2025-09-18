export const parseJwt = (token: string) => {
  const decode = JSON.parse(atob(token.split('.')[1]));
  if (decode.exp * 1000 < new Date().getTime()) {

    return { isExpired: true, body: null };
  }

  return { isExpired: false, body: decode };
};

export const parseBodyJwt = (token: string) => {
  const isExpired = parseJwt(token);

  return !isExpired && JSON.parse(atob(token.split('.')[1]));
}
