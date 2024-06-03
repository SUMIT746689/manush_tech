import deleteholiday from 'controllers/holidays/holiday/deleteholiday';
import patch from 'controllers/holidays/holiday/patch';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res) => {
  // try {
    const { method } = req;

    switch (method) {
      case 'PATCH':
        patch(req, res);
        break;
      case 'DELETE':
        deleteholiday(req, res);
        break;
      default:
        res.setHeader('Allow', ['PATCH', 'DELETE']);
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
