import { ofetch } from "@/lib/ofetch"

export const userList = async () => {
  
  try {
    const {users} = await ofetch("/users")

    return {users: users}
  } catch (error) {
    
  }
  return {users: []}
}
