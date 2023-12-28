import { logFile } from 'utilities_api/handleLogFile';
import get from '../../../controllers/account/get';
import post from '../../../controllers/account/post';

const userHandler = (req, res) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      get(req, res);
      break;
    case 'POST':
      post(req, res);
      break;
    // case 'DELETE':
    // deleteRoute(req, res);
    // break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      logFile.error(`Method ${method} Not Allowed`);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
export default (userHandler)