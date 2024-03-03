import patch from 'controllers/voice_gateways/voice_gateway/patch';
import { logFile } from 'utilities_api/handleLogFile';


const index = async (req, res) => {

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
};

export default index;
