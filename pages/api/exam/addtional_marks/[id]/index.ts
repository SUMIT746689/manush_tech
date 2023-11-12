import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const index = async (req, res, refresh_token) => {
  try {
    const { method } = req;

    switch (method) {
      case 'PATCH':
        // const { id } = req.query;
        // const { title } = req.body;
        // const data = {};

        // if(title) data["title"]= title;

        // await prisma.addtionalMarkingCategories.update({
        //   where: { id: parseInt(id) },
        //   data
        // });

        const { school_id } = refresh_token;
        if (!school_id) throw new Error("permission denied")

        const { exam_id, addtional_marks } = req.body;
        console.log({addtional_marks})

        if (!exam_id || !addtional_marks) throw new Error("required field missing")
        const datas = addtional_marks?.map(({ addtional_mark_id, total_mark }) => {
          if (!addtional_mark_id || !total_mark) throw new Error("addtional marks fields missing")
          return ({ addtional_mark_id, total_mark, exam_id })
        })

        await prisma.examAddtionalMark.createMany({
          data: datas
        });

        res.status(200).json({ message: 'Addtional marking catagory created successfully' });


        res.status(200).json({ message: 'updeated successfully' });
        break;
      default:
        res.setHeader('Allow', ['PATCH']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default authenticate(index);
