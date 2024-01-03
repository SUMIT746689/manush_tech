import get from "controllers/notes/get";
import post from "controllers/notes/post";
import { logFile } from "utilities_api/handleLogFile";
// import { authenticate } from "middleware/authenticate";

const notes = async (req, res) => {
    // try {
    const { method } = req;
    // const { subject_id } = req.query;

    switch (method) {
        case 'GET':
            get(req, res);
            break;
        // const resDailyNote = await prisma.dailyNote.findFirst({ where: { subject_id: parseInt(subject_id) } });

        // res.status(200).json(resDailyNote);

        // const { id, school_id, role } = refresh_token;subject_idsubject_id

        // if(!id || !school_id || role?.title !== "TEACHER") throw new Error("unauthorized user ")

        // const { day, section_id } = req.query;

        // if(!day || !section_id) throw new Error("required fields missing")

        // const schedule = await prisma.period.findMany({
        //     where: {
        //         section_id: parseInt(section_id),
        //         school_id: parseInt(school_id),
        //         teacher: { user_id: parseInt(id) },
        //         day,

        //     },
        //     include: {
        //         room: true,
        //         teacher: {
        //             select: {
        //                 id: true,
        //                 first_name: true
        //             }
        //         },
        //         section: {
        //             select: {
        //                 name: true,
        //                 class: {
        //                     select: {
        //                         name: true
        //                     }
        //                 }
        //             }
        //         }
        //     }
        // })
        // res.status(200).json(schedule);
        case 'POST':
            post(req, res);
            break;
        default:
            res.setHeader('Allow', ['GET', 'POST']);
            logFile.error(`Method ${method} Not Allowed`);
            res.status(405).end(`Method ${method} Not Allowed`);
    }
    // } catch (err) {
    //     console.log(err);
    //     res.status(500).json({ message: err.message });

    // }
}

export default notes