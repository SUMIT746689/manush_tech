import prisma from "@/lib/prisma_client";

export default async function patchSchool(req, res, refresh_token) {
  try {
    const { id } = req.query;
    const { name, phone, email, address, admin_ids, currency, domain, main_balance, masking_sms_count, non_masking_sms_count, masking_sms_price, non_masking_sms_price } = req.body;

    let data = {};
    if (name) data['name'] = name;
    if (phone) data['phone'] = phone;
    if (email) data['email'] = email;
    if (address) data['address'] = address;
    if (currency) data['currency'] = currency;
    if (domain) data['domain'] = domain;
    if (main_balance) data['main_balance'] = main_balance;
    if (masking_sms_count) data['masking_sms_count'] = masking_sms_count;
    if (non_masking_sms_count) data['non_masking_sms_count'] = non_masking_sms_count;

    if (masking_sms_price) data['masking_sms_price'] = masking_sms_price;
    if (non_masking_sms_price) data['non_masking_sms_price'] = non_masking_sms_price;

    const existingSchoolIdList = await prisma.user.findMany({
      where: {
        school_id: Number(id),
        user_role: {
          title: 'ADMIN'
        },
      },
      select: {
        id: true
      }
    })

    const connectIdList = []
    const disconnectIdList = []

    for (const i of admin_ids) {
      const found = existingSchoolIdList.find(j => j.id == i);
      if (!found) {
        connectIdList.push({ id: i })
      }
    }
    for (const i of existingSchoolIdList) {
      const found = admin_ids.find(j => j == i.id);
      if (!found) {
        disconnectIdList.push({ id: i.id })
      }
    }
    const query = {}
    if (connectIdList.length) {
      query['connect'] = connectIdList
    }
    if (disconnectIdList.length) {
      query['disconnect'] = disconnectIdList
    }
    if (admin_ids)
      data['admins'] = {
        ...query
      };

    if (name || phone || email || address) {
      const response = await prisma.school.update({
        where: { id: Number(id) },
        data
      });
      if (!response) throw new Error('Failed to update school');
      // const userSddSchool = await prisma.user.update({
      //   where: { id: admin_id },
      //   data: { school_id: response.id }
      // });
      // if (userSddSchool)
      res.json({ school: response, success: true });
      // else throw new Error('Invalid to create school');
    } else throw new Error('provide valid data');
  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}
