import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

const prisma = new PrismaClient();

export default async function post(req, res) {
  try {
    let query = {}
    const { user_id, username, password } = req.body;
    
    const request_refresh_token: any = (req.cookies.refresh_token && user_id) ? refresh_token_varify(req.cookies.refresh_token) : null;
    
    if (request_refresh_token && request_refresh_token) {
      //for super admin and admin login there available users 
      // if (request_refresh_token && (request_refresh_token.role?.title === 'ADMIN' || request_refresh_token.role?.title === 'SUPER_ADMIN')) {
      console.log(request_refresh_token);
      //superadmin login as admin
      if (request_refresh_token &&  (request_refresh_token.role?.title === 'SUPER_ADMIN' || request_refresh_token.role?.title === 'ADMIN'))  query = { id: user_id } ;
      
      else throw new Error('invalid user');
      
    }
    else {
      if (!username || !password) throw new Error(`provide username and password`);
      else query = { username,is_enabled:true }
    }

    const user = await prisma.user.findFirst({
      where: { ...query },
      include: {
        permissions: true,
        role: {
          include: {
            permissions: true
          }
        },
        school: {
          include: {
            subscription: {
              where: { is_active: true },
              include: { package: true }
            }
          }
        }
      }
    });

    if (user_id) {
      if (user.role_id) {
        if (user.role.title === 'SUPER_ADMIN' && request_refresh_token.role?.title === 'ADMIN') {
          throw new Error('Bad request !');
        }
        else if ((user.role.title == 'ADMIN'  && request_refresh_token.role?.title !== 'SUPER_ADMIN')) {
          throw new Error('Bad request !');
        }
      }
      else{
        if(request_refresh_token.role?.title !== 'ADMIN'){
          throw new Error('Bad request !');
        }
      }

    }


    if (user.role_id) {
      user['permissions'] = user.role?.permissions;
      delete user['role']['permissions'];
    }


    if (!user) throw new Error(`Invalid Authorization`);

    if (user?.role?.title !== 'SUPER_ADMIN') {
      let isSubscriptionActive = false;
      console.log(user.school?.subscription[0]?.end_date.getTime() + 86400000 > new Date().getTime());
      if (
        user?.school?.subscription?.length > 0 &&
        user.school?.subscription[0]?.end_date.getTime() + 86400000 > new Date().getTime()
      )
        isSubscriptionActive = true;
      if (!isSubscriptionActive)
        throw new Error('Your subscription has expired or not active');
    }


    //   bcrypt.hash(user.password, Number(process.env.SALTROUNDS), function(err, hash) {
    //     console.log({err,hash})
    // });
    if (req.body.username && req.body.password) {
      const result = await bcrypt.compare(req.body.password, user.password);

      if (!result) throw new Error(`Invalid username or password`);

      console.log(process.env.JWT_ACCESS_TOKEN_SECRET);
    }


    const access_token = jwt.sign(
      { name: user.username, id: user.id, school_id: user.school_id, role: user.role },
      process.env.JWT_ACCESS_TOKEN_SECRET,
      {
        expiresIn: '5000ms'
      }
    );
    const refresh_token = jwt.sign(
      { name: user.username, id: user.id, school_id: user.school_id, role: user.role },
      process.env.JWT_REFRESH_TOKEN_SECRET,
      {
        expiresIn: '1d'
      }
    );
    res.setHeader('Set-Cookie', [
      serialize('access_token', access_token, {
        path: '/',
        maxAge: 5,
        // secure: process.env.NODE_ENV === 'production'
        secure: false
      }),
      serialize('refresh_token', refresh_token, {
        path: '/',
        maxAge: 60 * 60 * 24,
        // secure: process.env.NODE_ENV === 'production'
        secure: false
      })
    ]);
    delete user['password'];
    res.status(200).json({ user });
  } catch (err) {
    console.log(err);
    res.status(404).json({ err: err.message });
  }
}
