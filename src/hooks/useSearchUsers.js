import { useEffect, useState } from 'react';
import axios from 'axios';

export const useSearchUsers = (limit = 10) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  const searchUsers = async ({ by = null, token = null }) => {
    let url = `/api/user/search_users?`;
    if (by) url += `by=${by}&`;
    if (token) url += `token=${token}&`;
    if (limit) url += `limit=${limit}`;

    try {
      const response = await axios.get(url);
      setUsers(response.data);
      return [response.data, null]
    } catch (err) {
      setError(err.message);
      throw [null,err]
    }
  };

  useEffect(() => {
    searchUsers({ by: null, token: null });
  }, []);

  return { users, setUsers, error, searchUsers };
};
