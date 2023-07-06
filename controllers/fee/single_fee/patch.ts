import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function patchSchool(req, res) {
  try {
    const { id } = req.query;
    const { title, _for, amount, last_date, session_id, class_id, school_id,late_fee } =
      req.body;

    const data = {};
    if (title) data['title'] = title;
    if (_for) data['for'] = _for;
    if (amount) data['amount'] = amount;
    if (last_date) data['last_date'] = new Date(last_date);
    if (session_id) data['session_id'] = session_id;
    if (class_id) data['class_id'] = class_id;
    if (school_id) data['school_id'] = school_id;
    if (late_fee) data['late_fee'] = parseFloat(late_fee) ;

    if (Object.keys(data)?.length > 0) {
      // @ts-ignore
      const response = await prisma.fee.update({
        where: { id: Number(id) },
        data
      });
    
      if (response) return res.json({ fee: response, success: true });
      else throw new Error('Invalid to create school');

    } else throw new Error('provide valid data');

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
