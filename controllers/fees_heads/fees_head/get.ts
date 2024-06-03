import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';


// @ts-ignore
const get = async (req, res, refresh_token) => {
    try {
        const { school_id } = refresh_token;
        const { id } = req.query
        const parseId = parseInt(id);

        if (!Number.isInteger(parseId)) throw new Error('invalid fees head id')

        const resp = await prisma.fee.findMany({
            where: { fees_head_id: parseId, school_id },
            select: {
                fees_month: true,
                class: {
                    select: {
                        id: true,
                        name: true,
                        has_section: true,
                        sections: {
                            select: {
                                id: true,
                                name: true
                            }
                        }
                    }
                }
            },
            orderBy: { class_id: "desc" }
        });

        const classes = resp.map(cls => cls.class);

        let mapClasss = new Map(
            classes.map((obj) => {
                return [JSON.stringify(obj), obj];
            })
        );

        const uniqueClsLists = Array.from(mapClasss.values());

        res.status(200).json(uniqueClsLists);
    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
};

export default authenticate(get);
