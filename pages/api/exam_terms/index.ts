import get from 'controllers/exam_terms/get';
import post from 'controllers/exam_terms/post';
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
        res.setHeader('Allow', ['GET', 'POST']);
        logFile.error(`Method ${method} Not Allowed`)
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  // } catch (err) {
  //   console.log(err);
  //   logFile.error(err.message)
  //   res.status(500).json({ message: err.message });
  // }
};

export default index;
