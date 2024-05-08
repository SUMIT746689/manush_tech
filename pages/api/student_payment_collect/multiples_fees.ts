import { post } from 'controllers/student_payment_collects/multipleFees/post';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token) => {
  // try {
  const { method } = req;

  switch (method) {
    case 'POST':
      post(req, res, refresh_token);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      logFile.error(`Method ${method} Not Allowed`);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: err.message });
  // }
};

export default authenticate(index);
