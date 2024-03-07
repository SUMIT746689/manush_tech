import deleteSchool from 'controllers/schools/single-school/delete-school';
import getSchool from 'controllers/schools/single-school/get-school';
import patchSchool from 'controllers/schools/single-school/patch-school';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const id = async (req, res, refresh_token) => {
  // try {
  const { method } = req;
  // const id = parseInt(req.query.id);
  switch (method) {
    case 'GET':
      getSchool(req, res, refresh_token);
      break;
    case 'DELETE':
      deleteSchool(req, res, refresh_token);
      break;
    case 'PATCH':
      patchSchool(req, res, refresh_token);
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

export default authenticate(id);
