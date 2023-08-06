import bcrypt from 'bcrypt';
import path from 'path';
import fsp from 'fs/promises';
import fs from 'fs';
import formidable from 'formidable';
import prisma from '@/lib/prisma_client';
import { fileDelete, fileRename, fileUpload } from '@/utils/upload';
import patch from 'controllers/students/patch';

export const config = {
    api: {
        bodyParser: false
    }
};



const id = async (req, res) => {
    try {
        const { method } = req;
        const student_id = parseInt(req.query.id)
        if (!student_id) {
            return res.status(400).json({ message: 'valid id required' })

        }
        switch (method) {
            case 'GET':
                const user = await prisma.student.findUnique({
                    where: {
                        id: student_id
                    },
                    include: {
                        section: {
                            include: {
                                class_teacher: {
                                    include: {
                                        user: {
                                            select: {
                                                id: true,
                                                username: true,
                                            }

                                        }
                                    }
                                },
                                class: true,
                            }
                        }
                    }
                })
                res.status(200).json(user);
                break;

            case 'PATCH':
                patch(req, res)
                break;
            default:
                res.setHeader('Allow', ['GET', 'PATCH']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });

    }
}

export default id