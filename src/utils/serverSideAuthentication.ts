import { refresh_token_varify } from "utilities_api/jwtVerify";

export const serverSideAuthentication = (context) => {

  const cookie = context.req.headers.cookie.startsWith('refresh_token=') ? context.req.headers.cookie.replace('refresh_token=', '') : null;

  return refresh_token_varify(cookie);

}
