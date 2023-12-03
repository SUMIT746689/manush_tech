import prisma from "./utility/prisma_client.js";
import { stdAlreadyAttendance, empAlreadyAttendance } from './attendance_utility/findAlreadyAttendance.js'
import { student_attendence } from "./attendance_utility/createAttendance.js";
import { isUserAttend } from "./attendance_utility/verifyUserAttend.js";

const attendance = async () => {
    try {
        const today = new Date(Date.now());
        const std_min_attend_date_wise = new Date(today);
        std_min_attend_date_wise.setUTCHours(0);
        std_min_attend_date_wise.setUTCMinutes(0);
        std_min_attend_date_wise.setUTCSeconds(0);
        std_min_attend_date_wise.setUTCMilliseconds(0);

        const std_max_attend_date_wise = new Date(today);
        std_max_attend_date_wise.setUTCHours(23);
        std_max_attend_date_wise.setUTCMinutes(59);
        std_max_attend_date_wise.setUTCSeconds(59);
        std_max_attend_date_wise.setUTCMilliseconds(999);


        prisma.$queryRaw`
            WITH 
            user_role as (
                SELECT id, title FROM Role
                WHERE title="STUDENT"
            ),
            attendance_queue as (
                SELECT 
                users.user_role_id,
                user_id,MIN(submission_time) as entry_time ,Max(submission_time) AS exit_time
                FROM tbl_attendance_queue
                JOIN user_role
                JOIN users ON tbl_attendance_queue.user_id = users.id
                WHERE user_role.id = users.role_id
                GROUP BY tbl_attendance_queue.user_id
            )

            SELECT * FROM attendance_queue;

        `
            .then((res) => {
                // console.log({ res });
                if (!Array.isArray(res)) return console.log("tbl_attendance_queue response is not array");
                if (res.length === 0) return console.log("tbl_attendance_queue response array length is 0 ");

                res.forEach((userAttend) => {
                    // console.log({ userAttend })
                    const { user_id } = userAttend;
                    // prisma.studentInformation.findFirst({ where: { user_id: userAttend.user_id },include:{} })
                    prisma.student.findFirst({ where: { AND: [{ student_info: { user_id } }, { academic_year: { curr_active: true } }] }, select: { id: true, guardian_phone: true, section: { select: { id: true, std_entry_time: true, std_exit_time: true } }, student_info: { select: { first_name: true, middle_name: true, last_name: true, school_id: true } } } })
                        .then(async (resStudent) => {
                            const { id, guardian_phone, section, student_info } = resStudent ?? {};
                            // console.log({ id, guardian_phone, student_info, section });
                            if (!id || !section?.std_entry_time) return console.log(`user_id(${user_id}) is not found`);
                            const isAttend = await stdAlreadyAttendance({ student_id: id, today, last_time: section.std_entry_time })
                            console.log({ isAttend })
                            if (isAttend && isAttend?.id) {

                            }
                            else {
                                const res = await prisma.$queryRaw`
                                    SELECT
                                        id,
                                        MIN(submission_time) OVER() AS entry_time,
                                        MAX(submission_time) OVER() AS exit_time
                                    FROM tbl_attendance_queue
                                    WHERE user_id = ${user_id}
                                `;
                                // const 
                                console.log({ res })
                                let entry_time;
                                let exit_time;
                                if (Array.isArray(res) && res.length > 0) {
                                    entry_time = res[0].entry_time;
                                    exit_time = res[0].exit_time;
                                }
                                prisma.attendance.create({
                                    data: {
                                        student_id: id,
                                        date: new Date(Date.now()),
                                        status: "late",
                                        // status: "absent",
                                        section_id: section.id,
                                        school_id: student_info.school_id,
                                    }
                                })
                                    .then(res => { console.log({ "success_request": res }) })
                                    .catch((err) => {
                                        console.log(`error: create attendaance student_id(${id})`)
                                    })
                            }
                        })
                        .catch(err => { console.log(`student user_id(${user_id}) fetch error:`, err) })
                })

            })
            .catch((err) => { console.log("tbl_attendance_queue fetch error:", err) })

        console.log({ resAttendance })

        // const resAttendance = await prisma.tbl_attendance_queue.findMany({
        //     // where: {
        //     //     school_id
        //     // }
        //     include: {
        //         user: {
        //             include: {
        //                 student: {
        //                     include: {
        //                         variance: {
        //                             where: { academic_year: { curr_active: true } },
        //                             include: { section: true },
        //                             take: 1
        //                         }
        //                     }
        //                 },
        //                 teacher: true,
        //             }
        //         }
        //     }
        // });
        // console.log({ resAttendance });
        // resAttendance.forEach(async (attendance_) => {
        //     const { user } = attendance_;
        //     const { teacher, student } = user ?? {};
        //     const { variance } = student ?? {};
        //     console.log({ attendance_ })
        //     let haveAttendance;
        //     // const { }
        //     // console.log({ student, teacher });
        //     if (student && (!Array.isArray(variance) || !variance[0]?.section?.std_entry_time)) {
        //         console.log(`error:= section std_entry_time not found`)
        //         return;
        //     }
        //     if (student) {
        //         const { section } = Array.isArray(variance) ? variance[0] : [];
        //         console.log(section);

        //         const date = new Date(Date.now());
        //         // const entry_time =

        //         haveAttendance = await stdAlreadyAttendance({ student_id: student.id, today: date, last_time: section.std_entry_time, school_id: user.school_id, section_id: section.id })
        //         // .then((res) => { console.log({ res }) })
        //         // .catch((err) => { console.log({ err }) })

        //         if (!haveAttendance) {
        //             // const verify = await isUserAttend({ user_id: user.id, std_min_attend_date_wise: section?.std_entry_time, entry_time: section?.std_entry_time, today: date })
        //             // console.log({ verify })
        //             // student_attendence({ student: variance[0], last_time: section?.std_entry_time, user_id: student.user_id });
        //         }
        //     }
        //     else haveAttendance = await empAlreadyAttendance(user.id);
        //     console.log({ haveAttendance });
        // })
    }
    catch (err) {
        prisma.$disconnect();
        console.log({ "server": err.message })
    }
}

attendance();

