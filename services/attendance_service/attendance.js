import prisma from "./utility/prismaClient.js";
import { stdAlreadyAttendance, empAlreadyAttendance } from './utility/handleAttendance.js'
import { todayMinMaxDateTime } from "./utility/dateTime.js";
import { stdAttendance } from "./stdAttendance.js";
import { empAttendance } from "./empAttendance.js";
import { resEmpAttendanceQueues } from "./utility/handleAttendanceQueue.js";
// import cron from "node-cron"

const attendance = async () => {
    try {

        const { today, min_attend_datetime, max_attend_datetime } = todayMinMaxDateTime();

        // student attendance processing 
        stdAttendance({ min_attend_datetime, max_attend_datetime });

        // employees attendance processing
        empAttendance({ today, min_attend_datetime, max_attend_datetime });

    }
    catch (err) {
        prisma.$disconnect();
        console.log({ "server": err.message })
    }
}

// setInterval(()=>{
attendance();
// },60000)

// cron.schedule('* * * * *', () => {
// console.log('running every minute...');
//   });