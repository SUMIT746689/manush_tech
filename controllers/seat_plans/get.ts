import prisma from '@/lib/prisma_client';
import { authenticate } from 'middleware/authenticate';

// @ts-ignore
async function get(req, res, refresh_token) {
    try {
        const { school_id } = refresh_token;

        if (!school_id) throw new Error('invalid user');

        const { exam_details_id, room_id } = req.query;
        console.log({exam_details_id,room_id})

        const response = await prisma.seatPlan.findFirst({
            where: {
                exam_details_id: parseInt(exam_details_id),
                room_id: parseInt(room_id)
            }
        });

        if (response) return res.json({ success: true, seat_plan: response });
        else throw new Error('Invalid to create school');

        // } else throw new Error('provide valid data');
    } catch (err) {
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(get)
