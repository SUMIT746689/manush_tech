import { get } from 'controllers/teachers/get';
import { deleteTeacher } from 'controllers/teachers/teacher/delete';

const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        get(req, res);
        break;
      case 'DELETE':
        deleteTeacher(req, res);
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

export default index;
