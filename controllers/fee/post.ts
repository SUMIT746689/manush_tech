import prisma from '@/lib/prisma_client';
import { lastDateOfMonth, monthList } from '@/utils/getDay';
import { logFile } from 'utilities_api/handleLogFile';

export default async function post(req, res, refresh_token, dcryptAcademicYear) {
  try {
    console.log({ dcryptAcademicYear })
    const { id: academic_year_id } = dcryptAcademicYear;
    const { fees_head_id, frequency, amount, last_date, class_id, school_id, late_fee, months } = req.body;

    if (!fees_head_id || !amount || !last_date || !academic_year_id || !class_id || !school_id) throw new Error('provide all valid information');
    const data = { fees_head_id, amount, last_date: new Date(last_date), academic_year_id, class_id, school_id };

    if (req.body.for) data['for'] = req.body.for;
    if (late_fee) data['late_fee'] = late_fee;
    console.log({ months })

    if (months?.length === 0) throw new Error('provide valid month field information');
    // if (months && months.length) {
    for (const month of months) {
      // if (!month.value || !month.last_date)
      if (!monthList.includes(month)) throw new Error('provide valid months !');
    }
    // const lastDateOfMonth = (date = new Date()) => new Date(date.getFullYear(), date.getMonth() + 1, 0);
    // console.log(lastDateOfMonth())
    const today = new Date();

    for (const month of months) {
      const monthIndex = monthList.indexOf(month);
      const last_date = lastDateOfMonth({ monthInt: monthIndex, date: today })
      const fee = await prisma.fee.create({
        data: {
          ...data,
          title: month,
          last_date,
          fees_month: month
        }
      });
      await prisma.voucher.create({
        data: {
          title: `${month} fee`,
          description: month,
          amount: data.amount,
          reference: `${refresh_token.name}, ${refresh_token.role.title.toUpperCase()}`,
          type: 'credit',
          resource_type: 'fee',
          resource_id: fee.id,
          school_id: refresh_token.school_id
        }
      });
    }

    res.status(200).json({ success: true });
  } catch (err) {
    logFile.error(err.message);
    console.log(err.message);
    res.status(404).json({ err: err.message });
  }
}
