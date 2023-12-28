import get from 'controllers/banners/get';
import { logFile } from 'utilities_api/handleLogFile';

// export const config = {
//     api: {
//         bodyParser: false
//     }
// };

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                get(req, res);
                break;
            default:
                res.setHeader('Allow', ['GET']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        logFile.error(err.message);
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export default index;
