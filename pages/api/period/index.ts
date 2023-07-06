import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const periods = await prisma.period.findMany({
                    where: {
                        school_id: {
                            equals: req.body.school_id
                        }
                    }
                })
                res.status(200).json(periods?.map(period => {
                    return {
                        id: period.id,
                        room_id: period.room_id,
                        day: period.day,
                        start_time: new Date(Date.parse(period.start_time + "+0000")),
                        end_time: new Date(Date.parse(period.end_time + "+0000")),
                        school_id: period.school_id,
                    }
                }));
                break;

            case 'POST':
                /*
                request format
                -----------------
                {
                    "day": "Friday",
                    "room_id":2,
                    "start_time":"1970-05-02 22:29:00+0000",
                    "end_time":"1970-05-02 23:30:00+0000",
                    "school_id":2,
                    "section_id":23,
                    "teacher_id":2
                }
                
                
                */
               console.log(req.body);
               
                if (req.body.start_time == req.body.end_time) {
                    return res.status(406).send({ message: "start and end times should not be equel" });
                }
                // const start_time = new Date(Date.parse(req.body.start_time + "+0000"));
                const start_time = new Date(req.body.start_time);
                // const end_time = new Date(Date.parse(req.body.end_time + "+0000"));
                const end_time = new Date(req.body.end_time);

                if (start_time > end_time) {
                    return res.status(406).send({ message: "start time must be smaller then end time" })
                }
                // filter period for perticular day and room

                const filteredPeriod = await prisma.period.findMany({
                    where: {
                        AND: [
                            {
                                school_id: {
                                    equals: req.body.school_id
                                }
                            },
                            {
                                day: {
                                    equals: req.body.day
                                }
                            },
                            {
                                room_id: {
                                    equals: req.body.room_id
                                }
                            },
                        ]
                    },

                })

                const formattedFilteredPeriod = filteredPeriod.map(period => {
                    return {
                        id: period.id,
                        room_id: period.room_id,
                        day: period.day,
                        start_time: new Date((period.start_time)),
                        end_time: new Date((period.end_time)),
                        school_id: period.school_id,
                        teacher_id: period.teacher_id,
                        section_id: period.section_id
                    }
                })
                
                const reqStartTime = start_time.getHours() * 60 + start_time.getMinutes()
                const reqEndTime = end_time.getHours() * 60 + end_time.getMinutes()

                
                for (let period of formattedFilteredPeriod) {

                    const storedStartTime = period.start_time.getHours()* 60 +period.start_time.getMinutes();
                    const storedEndTime = period.end_time.getHours()* 60 + period.end_time.getMinutes();

                  
                    // period overlap checking
                    if ((reqStartTime >= storedStartTime && reqStartTime <= storedEndTime) || (reqEndTime >= storedStartTime && reqEndTime <= storedEndTime)) {
                        return res.status(409).send({ message: "schedule booked. choose another" })
                    }
                }

                const filterTeacherClassTime = await prisma.period.findMany({
                    where: {
                        school_id: parseInt(req.body.school_id),
                        day: req.body.day,
                        teacher_id: parseInt(req.body.teacher_id)
                    },

                })
                const formattedFilteredPeriodForTeacher = filterTeacherClassTime.map(period => {
                    return {
                        day: period.day,
                        start_time: new Date((period.start_time)),
                        end_time: new Date((period.end_time))
                    }
                })

                for (let period of formattedFilteredPeriodForTeacher) {

                    const storedStartTime = period.start_time.getHours()* 60 +period.start_time.getMinutes();
                    const storedEndTime = period.end_time.getHours()* 60 +period.end_time.getMinutes();

                    console.log("stored-> ", storedStartTime, " ", storedEndTime);

                    // period overlap checking
                    if ((reqStartTime >= storedStartTime && reqStartTime <= storedEndTime) || (reqEndTime >= storedStartTime && reqEndTime <= storedEndTime)) {
                        return res.status(409).send({ message: "This teacher has another calss in this time !!" })
                    }


                }

                await prisma.period.create({
                    data: {
                        day: req.body.day,
                        room_id: req.body.room_id,
                        start_time: new Date(req.body.start_time),
                        end_time: new Date(req.body.end_time),
                        school_id: req.body.school_id,
                        section_id: req.body.section_id,
                        teacher_id: req.body.teacher_id
                    }
                })
                res.status(200).json({ message: "period created successfull!!" });


                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });

    }

}

export default index