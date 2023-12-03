import prisma from "./prisma_client.js"

export const stdAlreadyAttendance = async ({ student_id, today, last_time }) => {
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
    console.log({ std_min_attend_date_wise, std_max_attend_date_wise })

    const std_attend_date_ = new Date(last_time);
    const entry_time = new Date(last_time);
    entry_time.setFullYear(std_attend_date_.getFullYear());
    entry_time.setMonth(std_attend_date_.getMonth());
    entry_time.setDate(std_attend_date_.getDate());


    // const std_attend_date_ = new Date(last_time);
    // const entry_time = new Date(std_entry_time);
    // entry_time.setFullYear(std_attend_date_.getFullYear());
    // entry_time.setMonth(std_attend_date_.getMonth());
    // entry_time.setDate(std_attend_date_.getDate());

    const haveAttendance = await prisma.attendance.findFirst({
        where: { AND: [{ student_id }, { date: { gte: std_min_attend_date_wise, lte: std_max_attend_date_wise } }] },
        select: {
            id: true
        }
        // update: { status: "bunk" },
        // create: {
        //     student_id,
        //     date: new Date(last_time),
        //     status: "late",
        //     // status: "absent",
        //     section_id,
        //     school_id,
        // }
    });

    // const haveAttendance = await prisma.attendance.upsert({
    //     where: { AND: [{ student_id }, { date: { gte: std_min_attend_date_wise, lte: std_max_attend_date_wise } }] },
    //     update: { status: "bunk" },
    //     create: {
    //         student_id,
    //         date: new Date(last_time),
    //         status: "late",
    //         // status: "absent",
    //         section_id,
    //         school_id,
    //     }
    // });
    return haveAttendance;
}

export const empAlreadyAttendance = async (user_id) => {
    const haveAttendance = await prisma.employeeAttendance.findFirst({
        where: { user_id }
    });
    return haveAttendance;
} 