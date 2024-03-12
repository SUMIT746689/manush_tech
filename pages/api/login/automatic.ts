import { logFile } from 'utilities_api/handleLogFile';
import post from '../../../controllers/login/automatic/post';

export default function userHandler(req, res) {
    const { method } = req;

    switch (method) {
        case 'POST':
            post(req, res);
            break;
        default:
            res.setHeader('Allow', ['POST']);
            logFile.error(`Method ${method} Not Allowed`);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
