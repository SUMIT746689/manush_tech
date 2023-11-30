import { get } from 'controllers/teachers/get';
import deleteTeacher from 'controllers/teachers/teacher/delete';
import adminCheck from 'middleware/adminCheck';
import { authenticate } from 'middleware/authenticate';


const id = async (req, res, refresh_token) => {
  try {
    const { method } = req;

    switch (method) {
      case 'DELETE':
        deleteTeacher(req, res, refresh_token);
        break;
      default:
        res.setHeader('Allow', ['GET', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default authenticate(adminCheck(id));
