export interface School {
  address: String;
  currency: String;
  domain: String;
  email: String;
  id: Number;
  name: String;
  phone: String;
  masking_sms_price: number;
  masking_sms_count: number;
  non_masking_sms_price: number;
  non_masking_sms_count: number;
}
export interface User {
  id: string;
  name: string;
  avatar: string;
  email: string;
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
  school?: School;
}
