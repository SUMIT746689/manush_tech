// import prisma from "@/lib/prisma_client";
// import { authenticate } from "middleware/authenticate";

// async function get(req, res) {
//   try {
//     const { id } = req.query;

//     // if (name) {
//     const response = await prisma.room.findFirst({
//       where: { id: Number(id) }
//     });

//     if (response) return res.json({ success: true, rooms: response });
//     else throw new Error('Invalid to found room');

//     // } else throw new Error('provide valid data');
//   } catch (err) {
//     res.status(404).json({ error: err.message });
//   }
// }

// export default authenticate(get);