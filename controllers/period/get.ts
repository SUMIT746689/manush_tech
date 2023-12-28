import prisma from "@/lib/prisma_client";
import { authenticate } from 'middleware/authenticate';
import { logFile } from "utilities_api/handleLogFile";

const Get = async (req, res, refresh_token) => {
    try {
        const periods = await prisma.period.findMany({
            where: {
                school_id: refresh_token?.school_id,
            },
            include: {
                room: {
                    select: {
                        id: true,
                        name: true,
                    }
                },
                section: {
                    select: {
                        id: true,
                        name: true,
                        class: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                },
                teacher: {
                    select: {
                        id: true,
                        first_name: true,
                        middle_name: true,
                        last_name: true
                    }
                },
                subject: {
                    select: {
                        id: true,
                        name: true
                    }
                }
            }
        })
        res.status(200).json(periods?.map(i => {
            return {
                id: i.id,
                room: i.room.name,
                teacher: [i.teacher.first_name, i.teacher.middle_name, i.teacher.last_name].join(' '),
                class: i.section.class.name,
                section: i.section.name,
                subject: i.subject.name,
                day: i.day,
                start_time: new Date(Date.parse(i.start_time + "+0000")),
                end_time: new Date(Date.parse(i.end_time + "+0000")),
            }
        }));

    } catch (err) {
        logFile.error(err.message)
        console.log(err.message);
        res.status(404).json({ error: err.message });
    }
};

export default authenticate(Get);