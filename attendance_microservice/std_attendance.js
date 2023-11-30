import prisma from "./utility/prisma_client.js";
import { stdAlreadyAttendance, empAlreadyAttendance } from './attendance_utility/findAlreadyAttendance.js'
import { student_attendence } from "./attendance_utility/createAttendance.js";
import { isUserAttend } from "./attendance_utility/verifyUserAttend.js";

const attendance = async () => {
    try {
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
        
        const resAttendance = await prisma.tbl_attendance_queue.findMany({
            // where: {
            //     school_id
            // }
            include: {
                user: {
                    include: {
                        student: {
                            include: {
                                variance: {
                                    where: { academic_year: { curr_active: true } },
                                    include: { section: true },
                                    take: 1
                                }
                            }
                        },
                        teacher: true,
                    }
                }
            }
        });
        resAttendance.forEach(async (attendance_) => {
            const { user } = attendance_;
            const { teacher, student } = user ?? {};
            const { variance } = student ?? {};

            let haveAttendance;
            // const { }
            // console.log({ student, teacher });
            if (student && (!Array.isArray(variance) || !variance[0]?.section?.std_entry_time)) {
                console.log(`error:= section std_entry_time not found`)
                return;
            }
            if (student) {
                const { section } = Array.isArray(variance) ? variance[0] : [];
                console.log(section);

                const date = new Date(Date.now());

                haveAttendance = await stdAlreadyAttendance({ student_id: student.id, today: date })
                // .then((res) => { console.log({ res }) })
                // .catch((err) => { console.log({ err }) })

                if (!haveAttendance) {
                    const verify = await isUserAttend({ user_id: user.id, std_min_attend_date_wise: section?.std_entry_time, entry_time: section?.std_entry_time, today: date })
                    console.log({ verify })
                    // student_attendence({ student: variance[0], last_time: section?.std_entry_time, user_id: student.user_id });
                }
            }
            else haveAttendance = await empAlreadyAttendance(user.id);
            console.log({ haveAttendance });
        })
    }
    catch (err) {
        prisma.$disconnect();
        console.log({ "server": err.message })
    }
}

attendance();

