import { ofetch as ofetch_ } from "ofetch";

export const ofetch = ofetch_.create({baseURL: "http://localhost:8080/api/v1", credentials: 'include'})
