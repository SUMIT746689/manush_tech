import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const id = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const { id } = req.query;

        switch (method) {
            case 'PATCH':
                const { from_date, to_date, status, remarks, Leave_type, academic_year_id } = req.body;

                const user_role = await prisma.user.findFirstOrThrow({
                    where: {
                        id: Number(id)
                    },
                    select: {
                        role: {
                            select: {
                                title: true
                            }
                        }
                    }
                })



                const prev = await prisma.leave.findFirst({
                    where: {
                        id: Number(id),
                        OR: [
                            {
                                status: 'approved'
                            },
                            {
                                status: 'declined'
                            }
                        ]
                    }
                })
                if (prev) throw new Error('Leave Already approved or declined');

                const data = {
                    approved_by_id: refresh_token.id,
                    status,
                }
                if (from_date) data['from_date'] = new Date(from_date)
                if (to_date) data['to_date'] = new Date(to_date)
                if (remarks) data['remarks'] = remarks
                if (Leave_type) data['Leave_type'] = Leave_type

                await prisma.leave.update({
                    where: {
                        id: Number(id)
                    },
                    data
                })

                if (user_role.role.title === 'STUDENT') {

                    const student = await prisma.student.findFirstOrThrow({
                        where: {
                            student_info: {
                                user_id: Number(id),
                                school_id: refresh_token.school_id
                            },

                            academic_year_id: Number(academic_year_id),
                        },
                        select: {
                            id: true,
                            section_id: true,
                        }
                    })

                    const prev_attendance = await prisma.attendance.findMany({
                        where: {
                            section_id: student.section_id,
                            date: {
                                gte: new Date(new Date(from_date).setUTCHours(0, 0, 0, 0)),
                                lte: new Date(new Date(to_date).setUTCHours(23, 59, 59, 999))
                            }

                        },
                        distinct: ['date'],
                        select: {
                            date: true
                        }

                    })
                    const query = {}
                    if (status === 'approved') {
                        query['status'] = 'present'
                    }
                    else if (status == 'declined') {
                        query['status'] = 'absent'
                    }
                    //@ts-ignore
                    if (query?.status) {
                        await prisma.attendance.updateMany({
                            where: {
                                student_id: student.id
                            },
                            data: prev_attendance.map(i => ({
                                date: new Date(new Date(i.date).setUTCHours(0, 0, 0, 0)),
                                ...query
                            }))
                        })
                    }

                }
                else {
                    const query = {}
                    if (status === 'approved') {
                        query['status'] = 'present'
                    }
                    else if (status == 'declined') {
                        query['status'] = 'absent'
                    }
                    //@ts-ignore
                    if (query?.status) {
                        const from = new Date(from_date);
                        const to = new Date(new Date(to_date).setUTCHours(23, 59, 59, 999))
                        console.log(from, "  ", to);

                        while (from <= to) {
                            const attendence = await prisma.employeeAttendance.findFirst({
                                where: {
                                    user_id: Number(id),
                                    date: {
                                        gte: new Date(from.setUTCHours(0, 0, 0, 0)),
                                        lte: new Date(from.setUTCHours(23, 59, 59, 999))
                                    }
                                }
                            })
                            if (attendence) {
                                await prisma.employeeAttendance.update({
                                    where: {
                                        id: attendence.id
                                    },
                                    data: {
                                        status: 'present'
                                    },
                                })
                            }
                            else {
                                await prisma.employeeAttendance.create({
                                    data: {
                                        date: new Date(from.setUTCHours(0, 0, 0, 0)),
                                        status: 'present',
                                        school_id: refresh_token.school_id,
                                        user: {
                                            connect: {
                                                id: Number(id)
                                            }
                                        }
                                    },
                                })
                            }

                            from.setDate(from.getDate() + 1);
                            console.log("change__", from)
                        }
                    }

                }

                res.status(200).json({ message: 'Leave application  updated!' })
                break;
            default:
                res.setHeader('Allow', ['PATCH']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export default authenticate(id);
