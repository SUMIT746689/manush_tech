import { API_KEY } from "@/secret"
import { ofetch } from "ofetch"
// import { redirect } from "react-router-dom"


export const isLoggedIn = async () => {
  try {
    await ofetch("/auth/verify", { baseURL: API_KEY, credentials: "include" })
    // .catch(err => { console.log({ err }) })
    return true
  } catch (err) {
    return false
  }
  // return false
}
