import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const get = async (req, res, refresh_token) => {
  try {
    const { type } = req.query;
    const where = {
      school_id: refresh_token.school_id,
      resource_id: null
    }
    if (type) where['type'] = type
    const voucher = await prisma.voucher.findMany({
      where
    })

    res.status(200).json(voucher);
  } catch (err) {
    console.log(err);
    res.status(400).json(err)

  }

};

export default authenticate(get) 