import get from "controllers/fees_heads/fees_head/get";
import patch from "controllers/fees_heads/fees_head/patch";
import { logFile } from "utilities_api/handleLogFile";

const feesHead = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        get(req, res)
        break;
      case 'PATCH':
        patch(req, res)
        break;

      default:
        res.setHeader('Allow', ['PATCH']);
        logFile.error(`Method ${method} Not Allowed`)
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    logFile.error(err.message)
    res.status(500).json({ message: err.message });
  }
};

export default feesHead;
