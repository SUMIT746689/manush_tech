import prisma from "@/lib/prisma_client";

export default async function patchSchool(req, res) {
  try {
    const { id } = req.query;
    const { title, _for, amount, last_date, session_id, class_id, school_id, late_fee } =
      req.body;

    const data = {};
    const voucher_data = {};


    if (title) {
      data['title'] = title;
      voucher_data['title'] = `${title} exam fee`;
    }
    if (_for) data['for'] = _for;
    if (amount){
      data['amount'] = amount;
      voucher_data['amount'] = amount;
    } 
    if (last_date) data['last_date'] = new Date(last_date);
    if (session_id) data['session_id'] = session_id;
    if (class_id) data['class_id'] = class_id;
    if (school_id) data['school_id'] = school_id;
    if (late_fee) data['late_fee'] = parseFloat(late_fee);


    if (Object.keys(data)?.length > 0) {
      // @ts-ignore
      const response = await prisma.fee.update({
        where: { id: Number(id) },
        data
      });
      const targetVoucher = await prisma.voucher.findFirst({
        where: {
          resource_id: response.id,
          resource_type: 'fee'
        }
      })

      await prisma.voucher.update({
        where: {
          id: targetVoucher.id
        },
        data: voucher_data
      })

      if (response) return res.json({ fee: response, success: true });
      else throw new Error('Invalid to create school');

    } else throw new Error('provide valid data');

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
