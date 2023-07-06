import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import formidable from "formidable";
import path from "path";
import fs from "fs/promises";
import { mySqlDateConverter } from 'utilities_api/mysqlDateConverter';

const prisma = new PrismaClient();
const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'DELETE':
                const uniqueOne = await prisma.examDetails.findFirst({
                    where: {
                        exam_id: parseInt(req.query.exam_id),
                        subject_id: parseInt(req.query.subject_id)
                    }
                })
                if (uniqueOne) {
                    await prisma.examDetails.delete({
                        where: {
                            id: uniqueOne.id
                        }
                    })
                }

                res.status(200).json({ message: "deleted!" })
                break;
            case 'POST':
                await prisma.examDetails.createMany({
                    data: req.body.exam_list
                })

                res.status(200).json({ message: "added!" })
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export default index;
