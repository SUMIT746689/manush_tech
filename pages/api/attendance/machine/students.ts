import { PrismaClient } from "@prisma/client"
import { authenticate } from "middleware/authenticate";
import fs from 'fs';
const prisma = new PrismaClient()

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

                // fs.appendFile('mynewfile.txt', (req.body), (err) => {
                //     if (err) {
                //         console.log(err);
                //     } else {
                //         console.log('file written !');
                //     }
                // });

                // {
                //     "schoolID": 6,
                //         "machineID": "COAW220860397",
                //             "userID": "1",
                //                 "timestamp": "2022-10-24 13:02:28",
                //                     "status": 4,
                //                         "punch": 255
                // },

                const data = req.body.map(i => ({
                    sms_shoot_id: 'ecwc',
                    user_id: i.userID,
                    submission_time: i.timestamp,
                    status: i.status,
                    route_id: 1,
                    sender_id: 1,
                    coverage_id: 1,
                    contacts: '0186786',
                    pushed_via: 'wrgve',
                    charges_per_sms: 0.25,
                    total_count: 4,
                    sms_type: 'masking',
                    sms_text: 'eqfretrh rwgvebttrynt',
                    is_black_list: 2,
                    fail_count: 3,
                    priority: 4

                }))
                await prisma.tbl_queued_sms.createMany({
                    data
                })


                res.status(200).json({ statusCode: '0000', message: 'success' })

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