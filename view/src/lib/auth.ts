import { ofetch } from "ofetch"
// import { redirect } from "react-router-dom"


export const isLoggedIn = async () => {
  try {
    await ofetch("/api/auth/verify", {baseURL: "http://localhost:3000", credentials: "include"}).catch(err=>{console.log({err})})
    return true  
  } catch (err) {
    return false
  }
  return false 
}
