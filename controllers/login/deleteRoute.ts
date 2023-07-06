import { serialize } from 'cookie';
import { access_token_varify, refresh_token_varify } from 'utilities_api/jwtVerify';

export default function deleteRoute(req: any, res: any) {
  try {
    console.log(req.cookies.refresh_token);
    console.log(req.cookies.access_token);
    if (req.cookies.access_token) {
      const access_token = access_token_varify(req.cookies.access_token)
      console.log({ access_token });
    }
    if (req.cookies.refresh_token) {
      const refresh_token = refresh_token_varify(req.cookies.refresh_token);
      console.log({ refresh_token });
    }
    res.setHeader('Set-Cookie', [
      serialize('access_token', '', { maxAge: 0, httpOnly: true, path: '/' }),
      serialize('refresh_token', '', { maxAge: 0, httpOnly: true, path: '/' })
    ]);
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}
