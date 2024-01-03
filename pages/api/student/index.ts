import get from 'controllers/students/get';
import post from 'controllers/students/post';
import { logFile } from 'utilities_api/handleLogFile';

export const config = {
  api: {
    bodyParser: false
  }
};

const index = async (req, res) => {
  // try {
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
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: err.message });
  // }
};

export default index;
