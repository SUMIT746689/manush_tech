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
            case 'GET':
                const examSubjects = await prisma.examDetails.findMany({
                    where: {
                       exam_id: parseInt(req.query.exam_id)
                    },
                    include:{
                        subject:true
                    }
                });
                res.status(200).json(examSubjects);
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
