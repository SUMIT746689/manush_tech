import patch from 'controllers/voice_msgs/voice_templates/voice_template/patch';
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
      case 'PATCH':
        patch(req, res);
        
        break;
      default:
        res.setHeader('Allow', ['PATCH']);
        logFile.error(`Method ${method} Not Allowed`)
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: err.message });
  // }
};

export default index;
