import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

async function post(req, res, refresh_token) {
    try {
        const { title, account_number, description, balance } = req.body;

        await prisma.accounts.create({
            data: {
                title,
                account_number,
                description,
                balance: balance || 0,
                school_id: refresh_token?.school_id
            }
        })

        return res.json({ message: 'Account created successfully !' });

    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(post)