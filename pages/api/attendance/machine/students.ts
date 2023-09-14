import prisma from "@/lib/prisma_client";

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'POST':
                // console.log("req.body___", req.body, typeof (req.body));
                const body = JSON.parse(req.body);

                // body.forEach(element => {
                //     console.log("element", element)
                // });

                const data2 = body.map(i => ({
                    user_id: 4 || parseInt(i.userID),
                    school_id: 1 || i.schoolID,
                    submission_time: new Date(Date.now()||i.timestamp),
                    status: i.status,
                    machine_id: i.machineID,
                }))

                await prisma.tbl_attendance_queue.createMany({
                    data: data2
                })

                res.status(200).json({ statusCode: '200', message: 'success' })

                break;
            default:
                res.setHeader('Allow', ['POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ statusCode: '500', message: err.message });
    }

}

export default (index) 