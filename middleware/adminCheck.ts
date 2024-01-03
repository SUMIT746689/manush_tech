import { refresh_token_varify } from 'utilities_api/jwtVerify';
import { authenticate } from './authenticate';
import prisma from '@/lib/prisma_client';
import { logFile } from 'utilities_api/handleLogFile';

 const adminCheck = (handler: Function) => {
 
    return async (req, res,refresh_token) => {
        try {

            await prisma.user.findFirstOrThrow({
                where: {
                    id: refresh_token?.id,
                    username: refresh_token?.name,
                    role: {
                        id: refresh_token?.role?.id,
                        title: 'ADMIN',
                    }
                }
            })

            return handler(req, res, refresh_token);
        } catch (err) {
            logFile.error(err.message);
            console.log(err);
            res.status(401).json({ error: err.message });
        }
    };
};
export default adminCheck