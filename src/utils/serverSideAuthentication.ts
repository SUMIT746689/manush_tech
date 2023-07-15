import { refresh_token_varify } from "utilities_api/jwtVerify";

export const serverSideAuthentication = (context:any) => {

  const {refresh_token} = context.req?.cookies;
  
  return refresh_token_varify(refresh_token);

}
