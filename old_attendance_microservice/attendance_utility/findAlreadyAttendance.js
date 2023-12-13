import prisma from "./prisma_client.js"

export const stdAlreadyAttendance = async ({ student_id, std_min_attend_date_wise, std_max_attend_date_wise }) => {

    const haveAttendance = await prisma.attendance.findFirst({
        where: { AND: [{ student_id }, { date: { gte: std_min_attend_date_wise, lte: std_max_attend_date_wise } }] },
        select: {
            id: true
        }
    });

    return haveAttendance;
}

export const empAlreadyAttendance = async (user_id) => {
    const haveAttendance = await prisma.employeeAttendance.findFirst({
        where: { user_id }
    });
    return haveAttendance;
} 