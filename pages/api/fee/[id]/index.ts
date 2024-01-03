import patchFee from "controllers/fee/single_fee/patch";
import { logFile } from "utilities_api/handleLogFile";

export default function userHandler(req, res) {
  const { method } = req;

  switch (method) {
    // case 'GET':
    //   // get(req, res);
    //   break;
    // case 'POST':
    //   // post(req, res);
    //   break;
    case 'PATCH':
      patchFee(req, res);
      break;
    default:
      res.setHeader('Allow', ['PATCH']);
      logFile.error(`Method ${method} Not Allowed`);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
