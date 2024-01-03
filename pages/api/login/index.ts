import { logFile } from 'utilities_api/handleLogFile';
import deleteRoute from '../../../controllers/login/deleteRoute';
import get from '../../../controllers/login/get';
import post from '../../../controllers/login/post';

export default function userHandler(req, res) {
  const { method } = req;

  switch (method) {
    case 'GET':
      get(req, res);
      break;
    case 'POST':
      post(req, res);
      break;
    case 'DELETE':
      deleteRoute(req, res);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST', 'DELETE']);
      logFile.error(`Method ${method} Not Allowed`);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
}
