import { userRoleType } from "./users";

export interface AuthLogIn {
  env: string;
  token: string;
}


export interface AuthUser {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: userRoleType;
  photo?: string;
}
