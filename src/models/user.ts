export interface School {
  address: String;
  currency: String;
  domain: String;
  email: String;
  id: Number;
  name: String;
  phone: String;

}
export interface User {
  id: string;
  avatar: string;
  email: string;
  name: string;
  jobtitle: string;
  username: string;
  location: string;
  role: string;
  posts: string;
  coverImg: string;
  followers: string;
  description: string;
  [key: string]: any;
  permissions?: [object];
  school: School;
}
