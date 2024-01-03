import get from 'controllers/certificate_templates/get';
import post from 'controllers/certificate_templates/post';
import { logFile } from 'utilities_api/handleLogFile';


export const config = {
  api: {
    bodyParser: false,
  },
};


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
    console.log(err);
    logFile.error(err.message);
    res.status(500).json({ message: err.message });
  }
};

export default index;
