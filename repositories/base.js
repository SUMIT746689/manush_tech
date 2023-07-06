import axios from "axios";

export const SSRHTTPClient = (context) => {
   // console.log("log", context.req.cookies);
    const client = axios
    client.defaults.headers.Cookie = context.req.headers.cookie;
   // console.log(context.req.cookies.jwt)
    return client
}