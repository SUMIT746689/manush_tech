import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";
import { logFile } from "utilities_api/handleLogFile";

const id = async (req, res, refresh_token) => {
    try {
        const { method } = req;
        const { id } = req.query;

        switch (method) {
            case 'PATCH':
                const { from_date, to_date, status, remarks, Leave_type, academic_year_id } = req.body;

                const user_role = await prisma.leave.findFirstOrThrow({
                    where: {
                        id: Number(id)
                    },
                    select: {
                        user: {
                            select: {
                                id: true,
                                role: {
                                    select: {
                                        title: true
                                    }
                                }
                            }
                        }
                    }
                })

                console.log("user_role__", user_role);

                const prev = await prisma.leave.findFirst({
                    where: {
                        id: Number(id),
                    }
                })
                if (prev.status === 'approved' || prev.status === 'declined') throw new Error('Leave Already approved or declined');

                const data = {
                    approved_by_id: refresh_token.id,
                    status,
                }
                if (from_date) data['from_date'] = new Date(new Date(from_date).setUTCHours(0, 0, 0, 0))
                if (to_date) data['to_date'] = new Date(new Date(to_date).setUTCHours(23, 59, 59, 999))
                if (remarks) data['remarks'] = remarks
                if (Leave_type) data['Leave_type'] = Leave_type


                if (user_role.user.role.title === 'STUDENT') {
                    const query = {}
                    if (status === 'approved') {
                        query['status'] = 'present'
                    }
                    else if (status == 'declined') {
                        query['status'] = 'absent'
                    }
                    //@ts-ignore
                    if (query?.status) {
                        const student = await prisma.student.findFirstOrThrow({
                            where: {
                                student_info: {
                                    user_id: prev.user_id,
                                    school_id: refresh_token.school_id
                                },

                                academic_year_id: Number(academic_year_id),
                            },
                            select: {
                                id: true,
                                section_id: true,
                            }
                        })

                        console.log("student__", student);

                        const section_attendance = await prisma.attendance.findMany({
                            where: {
                                section_id: student.section_id,
                                date: {
                                    gte: new Date(new Date(from_date).setUTCHours(0, 0, 0, 0)),
                                    lte: new Date(new Date(to_date).setUTCHours(23, 59, 59, 999))
                                },

                            },
                            select: {
                                student_id: true,
                                date: true
                            },

                        })

                        console.log("section_attendance___", section_attendance);

                        const needToUpdate = section_attendance.filter(i => i.student_id === student.id)
                        console.log("needToUpdate__", needToUpdate);

                        const prev_attendance = await prisma.attendance.findMany({
                            where: {
                                student_id: student.id,
                                OR: needToUpdate.map(i => ({ date: i.date }))
                            },
                            select: {
                                id: true
                            }
                        })
                        console.log("prev_attendance__", prev_attendance);
                        console.log("data__", data);

                        await prisma.$transaction(async (trans) => {
                            await trans.leave.update({
                                where: {
                                    id: Number(id)
                                },
                                data
                            })

                            for (const i of prev_attendance) {
                                await trans.attendance.update({
                                    where: {
                                        id: i.id
                                    },
                                    data: {
                                        //@ts-ignore
                                        status: query?.status
                                    }
                                })
                            }

                            const needTocreate = [...new Set(section_attendance.filter(i => i.student_id !== student.id).map(j => new Date(new Date(j.date).setUTCHours(0, 0, 0, 0))))]
                            console.log("needTocreate__", needTocreate);

                            for (const i of needTocreate) {
                                const temp = await trans.attendance.create({
                                    data: {
                                        student_id: student.id,
                                        date: new Date(i),
                                        school_id: refresh_token.school_id,
                                        section_id: student.section_id,
                                        //@ts-ignore
                                        status: query?.status
                                    }
                                })
                                console.log("temp__", temp);

                            }
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
                        const to = new Date(to_date)
                        console.log(from, "  ", to);

                        await prisma.$transaction(async (trans) => {
                            await trans.leave.update({
                                where: {
                                    id: Number(id)
                                },
                                data
                            })

                            while (from <= to) {
                                const attendence = await trans.employeeAttendance.findFirst({
                                    where: {
                                        user_id: user_role.user.id,
                                        date: from
                                    }
                                })
                                if (attendence) {
                                    await trans.employeeAttendance.update({
                                        where: {
                                            id: attendence.id
                                        },
                                        data: {
                                            //@ts-ignore
                                            status: query?.status
                                        },
                                    })
                                }
                                else {
                                    await trans.employeeAttendance.create({
                                        data: {
                                            date: new Date(from),
                                            // @ts-ignore
                                            status: query?.status,
                                            school_id: refresh_token.school_id,
                                            user: {
                                                connect: {
                                                    id: user_role.user.id
                                                }
                                            }
                                        },
                                    })
                                }

                                from.setDate(from.getDate() + 1);
                                // console.log("change__", from)
                            }
                        })

                    }

                }

                res.status(200).json({ message: 'Leave application  updated!' })
                break;
            default:
                res.setHeader('Allow', ['PATCH']);
                logFile.error(`Method ${method} Not Allowed`)
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        logFile.error(err.message)
        res.status(500).json({ message: err.message });
    }
};

export default authenticate(id);
