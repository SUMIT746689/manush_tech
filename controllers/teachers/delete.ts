import prisma from "@/lib/prisma_client";

export const deleteTeacher = async (req, res, refresh_token) => {
  try {
    const { id } = req.query;
    await prisma.teacher.update({
      where: {
        id: Number(id),
        // school_id: refresh_token?.school_id
      },
      data: {
        deleted_at: new Date()
      }
    })
    res.status(200).json({ success: true });
  } catch (err) {
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
};
