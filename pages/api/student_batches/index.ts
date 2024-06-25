// import get from 'controllers/holidays/get';
import post from 'controllers/student_batches/post';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token) => {
  // try {
  const { method } = req;

  switch (method) {
    // case 'GET':
    //   get(req, res);
    //   break;
    case 'POST':
      post(req, res);
      break;

    default:
      res.setHeader('Allow', ['POST']);
      logFile.error(`Method ${method} Not Allowed`);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: err.message });
  // }
};

export default index;
