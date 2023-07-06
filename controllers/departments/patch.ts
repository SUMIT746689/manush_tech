import { PrismaClient } from '@prisma/client';
import { refresh_token_varify } from 'utilities_api/jwtVerify';


const prisma = new PrismaClient();

export default async function patch(req, res) {
    try {
        if (!req.cookies.refresh_token) throw new Error('refresh token not founds');

        const refresh_token: any = refresh_token_varify(req.cookies.refresh_token);

        if (!refresh_token) throw new Error('invalid user');
        console.log({ refresh_token });
        
        if (req.query.department_id && req.body.title) {

            await prisma.department.update({
                where: {
                    id: parseInt(req.query.department_id),
                    
                },
                data: {
                    title: req.body.title
                }
            });

            res.status(200).json({ success: true, message: 'Department title updated successfully !' });
        }
        else {
            throw new Error('provide all valid information');
        }

    } catch (err) {
        console.log(err.message);
        res.status(404).json({ err: err.message });
    }
}
