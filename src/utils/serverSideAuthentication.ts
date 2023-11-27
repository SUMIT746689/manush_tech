import { dcrypt } from "utilities_api/hashing";
import { refresh_token_varify } from "utilities_api/jwtVerify";

export const serverSideAuthentication = (context: any) => {

  const { refresh_token } = context.req?.cookies;

  return refresh_token_varify(refresh_token);

}

export const serverSideAcademicYearVerification = (context: any) => {
  try {
    const { academic_year } = context.req?.cookies;
    if (!academic_year) return ['Academic year not founds', null];

    const [error, dcryptAcademicYear] = dcrypt(academic_year);
    if (error) return ['invalid academic year', null]

    return [null, dcryptAcademicYear];
  } catch (err) {
    return [err.message, null];
  }
}