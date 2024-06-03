import get from 'controllers/fee/available_months';
import { academicYearVerify, authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const userHandler = async (req, res, refresh_token, dcryptAcademicYear) => {
    const { method } = req;

    switch (method) {
        case 'GET':
            get(req, res, refresh_token, dcryptAcademicYear)

            break;
        default:
            res.setHeader('Allow', ['GET']);
            logFile.error(`Method ${method} Not Allowed`)
            res.status(405).end(`Method ${method} Not Allowed`);
    }
}
export default authenticate(academicYearVerify(userHandler));