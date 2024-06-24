import get from 'controllers/fees_collection_settings/get';
import post from 'controllers/fees_collection_settings/post';
import { logFile } from 'utilities_api/handleLogFile';


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
        res.setHeader('Allow', ['GET','POST']);
        logFile.error(`Method ${method} Not Allowed`)
        res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default index;
