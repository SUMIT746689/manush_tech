import prisma from "@/lib/prisma_client";

const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'PATCH':
        const { id } = req.query;
        const { title } = req.body;
        const data = {};

        if(title) data["title"]= title;

        await prisma.addtionalMarkingCategories.update({
          where: { id: parseInt(id) },
          data
        });

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

export default index;
