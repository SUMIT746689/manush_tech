import prisma from '@/lib/prisma_client';
import { lastDateOfMonth, monthList } from '@/utils/getDay';
import { logFile } from 'utilities_api/handleLogFile';

export default async function post(req, res, refresh_token, dcryptAcademicYear) {
  try {
    const { id: academic_year_id } = dcryptAcademicYear;
    const { fees_head_id, amount, last_date, class_ids, school_id, late_fee, months, subject_ids } = req.body;

    console.log(subject_ids);
    if (!subject_ids || !fees_head_id || !amount || !last_date || !academic_year_id || !class_ids || !school_id)
      throw new Error('provide all valid information');
    // old code
    if (!Array.isArray(class_ids)) throw new Error('invalid class ids field');

    const data = { fees_head_id, amount, last_date: new Date(last_date), academic_year_id, school_id };

    if (req.body.for) data['for'] = req.body.for;
    if (late_fee) data['late_fee'] = late_fee;

    let haveInvalidClsId = false;

    // old code
    class_ids.forEach((cls_id) => {
      if (typeof cls_id !== 'number') haveInvalidClsId = true;
    });

    if (haveInvalidClsId) throw new Error('provide number on class_ids field');

    if (months?.length === 0) throw new Error('provide valid month field information');

    for (const month of months) {
      if (!monthList.includes(month)) throw new Error('provide valid months !');
    }
    const today = new Date();

    const resAlreadyCreatedFees = await prisma.fee.findMany({
      where: {
        AND: [{ fees_head_id }, { academic_year_id }, { class_id: { in: class_ids } }, { fees_month: { in: months } }, { subject_id: subject_ids }, { deleted_at: null }]
      },
      select: { fees_month: true }
    });

    if (resAlreadyCreatedFees.length !== 0) {
      const alreadyCreatedFeesMonths = resAlreadyCreatedFees.map((fee) => fee.fees_month).join(',');
      throw new Error(`month: ${alreadyCreatedFeesMonths} fees already created...`);
    }
    for (const class_id of class_ids) {
      for (const month of months) {
        const monthIndex = monthList.indexOf(month);
        const last_date = lastDateOfMonth({ monthInt: monthIndex, date: today });
        const fee = await prisma.fee.create({
          data: {
            ...data,
            class_id,
            subject_id: subject_ids,
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
    }
    res.status(200).json({ success: true });
  } catch (err) {
    logFile.error(err.message);
    res.status(404).json({ error: err.message });
  }
}
