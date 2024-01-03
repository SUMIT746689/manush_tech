import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;


        switch (method) {
            case 'POST':
                const { title, account_id } = req.body;

                await prisma.accounts.findFirstOrThrow({
                    where: {
                        id: account_id,
                        school_id:refresh_token.school_id   
                    }
                })
                await prisma.payment_method.createMany({
                    data: {
                        title,
                        account_id: parseInt(account_id)
                    }
                })
                res.status(200).json({ message: 'Payment gate way created successfull!!' });
                break;
            default:
                res.setHeader('Allow', [ 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        logFile.error(err.message);
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export default authenticate(index);
