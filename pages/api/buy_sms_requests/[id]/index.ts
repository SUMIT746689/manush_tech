import type { NextApiRequest, NextApiResponse } from 'next/types';
import patch from 'controllers/buy_sms_requests/patch';

const index = async (req: NextApiRequest, res: NextApiResponse) => {
  const { method } = req;
  switch (method) {

    case 'PATCH':
      patch(req, res);
      break;

    default:
      res.setHeader('Allow', ['PATCH']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default index;
