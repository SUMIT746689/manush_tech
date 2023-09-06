import prisma from "@/lib/prisma_client";

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'POST':

                // const { date, status, school_id, section_id, exam_id } = req.query;
                // const { sectionAttendence } = req.body;

                // const fullSectionStudents = await prisma.student.findMany({
                //     where: {
                //         section_id: parseInt(section_id)
                //     },
                //     select: {
                //         id: true
                //     }
                // })
                // const exam_id_query = {};
                // if (exam_id) {
                //     exam_id_query['exam_id'] = parseInt(exam_id)
                // }

                // const fullSectionStudentAttendence = await prisma.attendance.findMany({
                //     where: {
                //         school_id: parseInt(school_id),
                //         section_id: parseInt(section_id),
                //         date: new Date(date),
                //         ...exam_id_query
                //     },
                //     select: {
                //         id: true,
                //         student_id: true
                //     }
                // })

                // if (sectionAttendence) {
                //     console.log({ sectionAttendence });

                //     for (const i of sectionAttendence) {

                //         const updatequery = {
                //             status: i.status,
                //         }
                //         if (i?.remark) {
                //             updatequery['remark'] = i.remark
                //         }
                //         const found = fullSectionStudentAttendence.find(j => j.student_id === i.student_id)
                //         if (found) {
                //             await prisma.attendance.update({
                //                 where: {
                //                     id: found.id

                //                 },
                //                 data: updatequery
                //             })
                //         }
                //         else {
                //             await prisma.attendance.create({
                //                 data: {
                //                     student_id: i.student_id,
                //                     date: new Date(date),
                //                     status: i.status,
                //                     school_id: parseInt(school_id),
                //                     section_id: parseInt(section_id),
                //                     exam_id: exam_id ? parseInt(exam_id) : null
                //                 }
                //             })
                //         }
                //     }

                // }
                // else if (status) {
                //     for (const i of fullSectionStudents) {
                //         const found = fullSectionStudentAttendence.find(j => j.student_id === i.id)
                //         if (found) {
                //             await prisma.attendance.update({
                //                 where: {
                //                     id: found.id

                //                 },
                //                 data: {
                //                     status
                //                 }
                //             })
                //         }
                //         else {
                //             await prisma.attendance.create({
                //                 data: {
                //                     student_id: i.id,
                //                     date: new Date(date),
                //                     status,
                //                     school_id: parseInt(school_id),
                //                     section_id: parseInt(section_id),
                //                     exam_id: exam_id ? parseInt(exam_id) : null
                //                 }
                //             })
                //         }

                //     }
                // }

                console.log("req.body___", req.body, typeof (req.body));
                const body = JSON.parse(req.body);

                const data2 = body.map(i => ({
                    user_id: 6 || parseInt(i.userID),
                    school_id: i.schoolID,
                    submission_time: new Date(i.timestamp),
                    status: i.status,
                    machine_id: i.machineID,
                }))

                await prisma.tbl_attendance_queue.createMany({
                    data: data2
                })

                res.status(200).json({ statusCode: '200', message: 'success' })

                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: '500', message: err.message });
    }

}

export default (index) 