import deleteRoom from 'controllers/rooms/room/deleteRoom';
import get from 'controllers/rooms/room/get';
import patch from 'controllers/rooms/room/patch';
import adminCheck from 'middleware/adminCheck';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';


const index = async (req, res, refresh_token) => {
  // try {
  const { method } = req;

  switch (method) {
    case 'GET':
      get(req, res, refresh_token);
      break;
    case 'PATCH':
      patch(req, res, refresh_token);
      break;
    case 'DELETE':
      deleteRoom(req, res, refresh_token);
      break;
    default:
      res.setHeader('Allow', ['GET', 'PATCH', 'DELETE']);
      logFile.error(`Method ${method} Not Allowed`)
      res.status(405).end(`Method ${method} Not Allowed`);
  }
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: err.message });
  // }
};

export default authenticate(adminCheck(index));
