export type userRoleType =  "ADMIN" | "GENERAL";

export interface User {
  id: number;
  fullName: string;
  username: string;
  email: string;
  role: userRoleType;
}

export interface CreateUser {
  username: string;
  fullName: string;
  email: string;
  password?: string;
  role: userRoleType;
}

export interface GetAllUsersInterface {
  users: User[] | []
}

export interface UpdateUserBody {
  username?: string;
  email?: string;
  role: userRoleType;
}
export interface UpdateUser {
  user_id: number;
  body: UpdateUserBody;
}
