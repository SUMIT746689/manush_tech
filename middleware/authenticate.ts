import { dcrypt } from 'utilities_api/hashing';
import { refresh_token_varify } from 'utilities_api/jwtVerify';

export const authenticate = (handler: Function) => {
  return async (req, res) => {
    try {
      if (!req.cookies.refresh_token)
        throw new Error('refresh token not founds');

      const refresh_token: any = refresh_token_varify(
        req.cookies.refresh_token
      );

      if (!refresh_token) throw new Error('invalid user');

      return handler(req, res, refresh_token);
    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  };
};

export const academicYearVerify = (handler: Function) => {
  return async (req, res, refresh_token) => {
    try {
      const { academic_year } = req.cookies;
      if (!academic_year) throw new Error('Academic year not founds');

      const [error, dcryptAcademicYear] = dcrypt(academic_year);
      if (error) throw new Error('invalid academic year')

      return handler(req, res, refresh_token, dcryptAcademicYear);

    } catch (err) {
      res.status(401).json({ error: err.message });
    }
  };
};
