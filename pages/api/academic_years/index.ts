import get from 'controllers/academic_years/get';
import post from 'controllers/academic_years/post';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res) => {
  try {
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
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    logFile.error(err.message);
    console.log(err);
    res.status(500).json({ message: err.message });
    
  }
};

export default index;
