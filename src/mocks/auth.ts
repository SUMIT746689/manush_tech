import type { User } from 'src/models/user';
import { randomId } from 'src/utils/randomId';
import { sign, decode, JWT_SECRET, JWT_EXPIRES_IN } from '../utils/jwt';
import { wait } from 'src/utils/wait';
import axios from 'axios';

const users = [
  {
    id: '1',
    avatar: '/static/images/avatars/3.jpg',
    location: 'San Francisco, USA',
    username: 'admin',
    email: 'demo@example.com',
    name: 'Rachael Simons',
    jobtitle: 'Lead Developer',
    password: 'TokyoPass1@',
    role: 'admin',
    posts: '27',
    coverImg: '/static/images/placeholders/covers/5.jpg',
    followers: '6513',
    description: 'Curabitur at ipsum ac tellus semper interdum.'
  }
];

class AuthApi {
  async login({ username, password }): Promise<string> {
    await wait(500);

    return new Promise(async (resolve, reject) => {
      try {
        const user: any = await fetch('/api/login', {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            username,
            password
          }),
          method: 'POST'
        })

        if (user.status === 200) {
          const response = await user.json();
          resolve(response);

        } else {
          const response = await user.json()
          if (response.err) {
            reject(new Error(`${response?.err}`));
          } else {
            reject(new Error('Error authenticating'));
          }
        }

        // const accessToken = sign({ userId: users[0].id }, JWT_SECRET, {
        //   expiresIn: JWT_EXPIRES_IN
        // });

        // resolve(accessToken);
      } catch (err) {
        // console.log("err_________________________", err);

        reject(new Error(`${err?.message}`));
      }
    });
  }

  async superAdminLogInAsAdmin({user_id }): Promise<string> {
    await wait(500);

    return new Promise(async (resolve, reject) => {
      try {
        const user: any = await fetch('/api/login', {
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            user_id
          }),
          method: 'POST'
        })

        if (user.status === 200) {
          const response = await user.json();
          resolve(response);

        } else {
          const response = await user.json()
          if (response.err) {
            reject(new Error(`${response?.err}`));
          } else {
            reject(new Error('Error authenticating'));
          }
        }

      } catch (err) {
        reject(new Error(`${err?.message}`));
      }
    });
  }

  async register({ email, name, password }): Promise<string> {
    await wait(1000);

    return new Promise((resolve, reject) => {
      try {
        let user = users.find((_user) => _user.email === email);

        if (user) {
          reject(new Error('Email address is already in use'));
          return;
        }

        user = {
          id: randomId(),
          avatar: null,
          jobtitle: 'Lead Developer',
          email,
          username: null,
          name,
          password,
          location: null,
          role: 'admin',
          posts: null,
          coverImg: null,
          followers: null,
          description: null
        };

        users.push(user);

        const accessToken = sign({ userId: user.id }, JWT_SECRET, {
          expiresIn: JWT_EXPIRES_IN
        });

        resolve(accessToken);
      } catch (err) {
        console.error(err);
        reject(new Error('Internal server error'));
      }
    });
  }

  me(): Promise<User> {
    return new Promise(async (resolve, reject) => {
      try {
        // const userId = decode(accessToken) as any;

        // const user = users.find((_user) => _user.id === userId);
        // console.log({ accessToken, userId });

        const response: any = await axios.get('/api/login');

        console.log('hi....................')
        console.log(response.data)
        if (!response.data?.user) {

          reject(new Error('Invalid username or password'));
          return;
        }
        resolve(response.data);
      } catch (err) {
        console.error(err);
        reject(new Error('Internal server error'));
      }
    });
  }
}

export const authApi = new AuthApi();
