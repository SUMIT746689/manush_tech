import deleteFee from "controllers/fee/single_fee/delete";
import patchFee from "controllers/fee/single_fee/patch";
import { academicYearVerify, authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

function userHandler(req, res, refresh_token, dcryptAcademicYear) {
  const { method } = req;

  switch (method) {
    case 'PATCH':
      patchFee(req, res);
      break;
    case 'DELETE':
      deleteFee(req, res, refresh_token, dcryptAcademicYear);
      break;
    default:
      res.setHeader('Allow', ['PATCH', 'DELETE']);
      logFile.error(`Method ${method} Not Allowed`);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}

export default authenticate(academicYearVerify(userHandler))