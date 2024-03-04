import post from 'controllers/voice_msgs/group_contacts/post';
import { logFile } from 'utilities_api/handleLogFile';

export const config = {
    api: {
        bodyParser: false
    }
};

const index = async (req, res) => {
    const { method } = req;

    switch (method) {
        case 'POST':
            post(req, res);
            break;
        default:
            res.setHeader('Allow', ['POST']);
            logFile.error(`Method ${method} Not Allowed`)
            res.status(405).end(`Method ${method} Not Allowed`);
    }
};

export default index;
