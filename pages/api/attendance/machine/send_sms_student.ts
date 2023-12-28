import post from "controllers/attendence/machine/send_sms_student/post";
import { logFile } from "utilities_api/handleLogFile";

const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'POST':
        post(req, res);        
        break;
        
      default:
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    logFile.error(err.message);
    console.log(err);
    res.status(500).json({ statusCode: '500', message: err.message });
  }

}

export default index