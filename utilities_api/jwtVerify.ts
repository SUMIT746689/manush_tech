import jwt from 'jsonwebtoken';

export const access_token_varify = (access_token: string) => {
  try {
    const access_token_verify = jwt.verify(
      access_token,
      process.env.JWT_ACCESS_TOKEN_SECRET
    );
    if (access_token_verify) return access_token_verify;
    else throw new Error();
  } catch (error) {
    return false;
  }
};

export const refresh_token_varify = (refresh_token: string) => {
  try {
    const refresh_token_verify = jwt.verify(
      refresh_token,
      process.env.JWT_REFRESH_TOKEN_SECRET
    );
    if (refresh_token_verify) return refresh_token_verify;
    else throw new Error();
  } catch (error) {
    return false;
  }
};
