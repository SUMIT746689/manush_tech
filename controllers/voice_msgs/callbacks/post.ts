import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function post(req, res, refresh_token) {
    try {
        logFile.info(req.body)
        console.log({ body: req.body });
        res.end();
    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(post)
