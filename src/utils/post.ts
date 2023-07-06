import axios from "axios";

export const fetchData = async(url,method="post",body) => {
  try {
    const response = await axios[method](url,body);
    return [null,response.data];
  } catch (err) {
    return [err.message,null];
  }    
}