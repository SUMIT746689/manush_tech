import post from "controllers/students/bulk-admission/post";
import { logFile } from "utilities_api/handleLogFile";

export const config = {
    api: {
        bodyParser: false
    }
};


const index = async (req, res) => {
    // try {
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
    // } catch (err) {
    //     console.log(err);
    //     res.status(401).json({ message: err.message });
    // }
};

export default index;
