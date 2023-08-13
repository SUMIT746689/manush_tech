import { PrismaClient } from "@prisma/client"
import { authenticate } from "middleware/authenticate";

const prisma = new PrismaClient()

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'POST':

                const { date, status, school_id, section_id, exam_id } = req.query;
                const { sectionAttendence } = req.body;

                const fullSectionStudents = await prisma.student.findMany({
                    where: {
                        section_id: parseInt(section_id)
                    },
                    select: {
                        id: true
                    }
                })
                const exam_id_query = {};
                if (exam_id) {
                    exam_id_query['exam_id'] = parseInt(exam_id)
                }

                const fullSectionStudentAttendence = await prisma.attendance.findMany({
                    where: {
                        school_id: parseInt(school_id),
                        section_id: parseInt(section_id),
                        date: new Date(date),
                        ...exam_id_query
                    },
                    select: {
                        id: true,
                        student_id: true
                    }
                })

                if (sectionAttendence) {
                    console.log({ sectionAttendence });

                    for (const i of sectionAttendence) {

                        const updatequery = {
                            status: i.status,
                        }
                        if (i?.remark) {
                            updatequery['remark'] = i.remark
                        }
                        const found = fullSectionStudentAttendence.find(j => j.student_id === i.student_id)
                        if (found) {
                            await prisma.attendance.update({
                                where: {
                                    id: found.id

                                },
                                data: updatequery
                            })
                        }
                        else {
                            await prisma.attendance.create({
                                data: {
                                    student_id: i.student_id,
                                    date: new Date(date),
                                    status: i.status,
                                    school_id: parseInt(school_id),
                                    section_id: parseInt(section_id),
                                    exam_id: exam_id ? parseInt(exam_id) : null
                                }
                            })
                        }
                    }

                }
                else if (status) {
                    for (const i of fullSectionStudents) {
                        const found = fullSectionStudentAttendence.find(j => j.student_id === i.id)
                        if (found) {
                            await prisma.attendance.update({
                                where: {
                                    id: found.id

                                },
                                data: {
                                    status
                                }
                            })
                        }
                        else {
                            await prisma.attendance.create({
                                data: {
                                    student_id: i.id,
                                    date: new Date(date),
                                    status,
                                    school_id: parseInt(school_id),
                                    section_id: parseInt(section_id),
                                    exam_id: exam_id ? parseInt(exam_id) : null
                                }
                            })
                        }

                    }
                }



                res.status(200).json({ message: "attendence updated" })

                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });

    }

}

export default authenticate(index) 