import type { NextApiRequest, NextApiResponse } from 'next/types';
import patch from 'controllers/buy_sms_requests/buy_sms_request/patch';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {

    case 'PATCH':
      patch(req, res);
      break;

    default:
      res.setHeader('Allow', ['PATCH']);
      logFile.error(`Method ${method} Not Allowed`);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default index;
