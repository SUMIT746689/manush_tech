import type { NextApiRequest, NextApiResponse } from 'next/types';
import get from 'controllers/packages/get';
import post from 'controllers/packages/post';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {
    case 'GET':
      get(req, res);
      break;

    case 'POST':
      post(req, res);
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST']);
      logFile.error(`Method ${method} Not Allowed`)
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default index;
