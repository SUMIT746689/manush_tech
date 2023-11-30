import prisma from '@/lib/prisma_client';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { authenticate } from 'middleware/authenticate';


const insertDataToSentSmsDetails = ({ responseSentSms_id, status, user }) => {
  // prisma.sentEmailDetail.create({
  //   //@
  //   data: {
  //     name: 'sfafafd',
  //     phone: user.phone || '',
  //     status: status,
  //     user: { connect: { id: user.id || user.user_id } },
  //     sentEmail: {
  //       connect: {
  //         id: responseSentSms_id
  //       }
  //     }
  //   }
  // }).then(res => {
  //   // console.log({ res });
  // })
};

const sentSmsToUsers = async (user, responseSentSms, sms_res_gatewayinfo) => {
  let status = "pending"
  try {
    const { data: sms_res } = await axios.post(`https://${sms_res_gatewayinfo?.details?.sms_gateway}/smsapi?api_key=${sms_res_gatewayinfo?.details?.sms_api_key}&type=text&contacts=${user?.phone}&senderid=${sms_res_gatewayinfo?.details?.sender_id}&msg=${encodeURIComponent(`Dear ${name}, ${responseSentSms?.custom_body}`)}`)
    if (typeof sms_res === "string" && sms_res?.startsWith("SMS SUBMITTED")) status = "success"
    else status = "failed"
    insertDataToSentSmsDetails({ responseSentSms_id: responseSentSms.id, status, user })
  }
  catch (err) {
    status = "failed"
    insertDataToSentSmsDetails({ responseSentSms_id: responseSentSms.id, status, user })
  }
}

const sentSmsHandler = async ({ sentSmsUsers, responseSentSms, school_id }) => {
  //individual user sent sms and insert response and data into sent sms details table
  const sms_res_gatewayinfo: any = await prisma.smsGateway.findFirst({
    where: {
      school_id,
      is_active: true
    }
  })
  sentSmsUsers.forEach((user) => {
    // if (user) 
    sentSmsToUsers(user, responseSentSms, sms_res_gatewayinfo)
  })
};

// insert data to sent sms table
const insertsentSms = async ({ recipient_type, campaign_name, sms_template_id, subject, school_id, custom_body, recipient_count = 0 }) => {

  const data = {
    name: campaign_name,
    subject,
    recipient_count,
    school: { connect: { id: Number(school_id) } }
  };

  if (recipient_type) data['recipient_type'] = recipient_type.toLowerCase();
  if (sms_template_id) data['smsTemplate'] = { connect: { id: sms_template_id } }
  else if (custom_body) data['custom_body'] = custom_body

  // return await prisma.sentEmail.create({
  //   data
  // });

}

const updateSentSms = async ({ responseSentSms, sentSmsUsers }) => {
  // const ss = await prisma.sentSms.update({
  //   where: { id: responseSentSms.id },
  //   data: {
  //     recipient_count: { increment: sentSmsUsers.length }
  //   }
  // });
}

const getUsers = async ({ role, where }) => {
  switch (role.title) {
    case "TEACHER":
      return await prisma.teacher.findMany({
        where: {
          deleted_at: null,
          ...where
        },
        select: { phone: true, user_id: true }
      });

    case "STUDENT":

      return await prisma.studentInformation.findMany({ where: { ...where }, select: { phone: true, user_id: true } });

    default:
      where['user_role_id'] = role.id;

      return await prisma.user.findMany({
        where: { ...where },
      });
  };

}

async function post(req, res, refresh_token) {
  try {
    const { subject, campaign_name, recipient_type, role_id, class_id, section_id, name: individual_user_id, body: custom_body, sms_template_id } = req.body;
    const { school_id } = refresh_token;

    if (!subject || !recipient_type) throw new Error("provide valid data")

    const data = {
      subject,
      school: { connect: { id: refresh_token.school_id } }
    }

    let sentSmsUsers = [];
    let responseSentSms = null;

    switch (recipient_type) {
      case "GROUP":
        if (!role_id) throw new Error("permission denied");
        const roles = await prisma.role.findMany({ where: { id: { in: role_id } }, select: { title: true, id: true } })

        // const roleArray = [];
        // get users persmissions
        // const user = await prisma.user.findFirst({ where: { id: refresh_token.id }, select: { role: { select: { permissions: { select: { value: true } } } }, permissions: { select: { value: true } } } })
        //get permissions
        // const permissions = user.role?.permissions ? user.role.permissions : user.permissions;

        // check user have that permission or not
        // const some = permissions.some(permission => permission.value === `create_${role?.title?.toLowerCase() || ''}`)

        // if (!some) throw new Error("permissions denied");

        if (!Array.isArray(roles) || roles.length <= 0) throw new Error("Invalid role");
        let responseSentSms = null;

        // insert sent sms in sentsms table   
        responseSentSms = await insertsentSms({ recipient_type, campaign_name, sms_template_id, subject, school_id: refresh_token.school_id, custom_body });

        roles.forEach(async (role) => {

          let singleGroupUsers = null;

          //get users for sending sms 
          singleGroupUsers = await getUsers({ where: { school_id: Number(school_id) }, role })

          if (!singleGroupUsers) return;
          //udpate sentsms table
          updateSentSms({ sentSmsUsers: singleGroupUsers, responseSentSms });
          // every group individually sending sms handles
          sentSmsHandler({ sentSmsUsers: singleGroupUsers, responseSentSms, school_id });
        })

        return res.status(200).json({ message: "successfull" });
        break;

      case "CLASS":
        // const responseAllUSer = await prisma.student.findMany({
        //   where: {
        //     section: {
        //       class_id: class_id || 1,
        //     }
        //     // id: Number(refresh_token.school_id) 
        //   },
        //   select: {
        //     student_info: {
        //       select: {
        //         phone: true
        //       }
        //     }
        //   }
        // });

        // sentSmsUsers = await prisma.$queryRawUnsafe(`
        // SELECT phone,student_informations.user_id as id FROM students
        // JOIN student_informations ON student_informations.id = students.student_information_id
        // JOIN sections ON students.section_id = sections.id
        // WHERE class_id = ${class_id} AND school_id = ${refresh_token.school_id} ${(Array.isArray(section_id) && section_id.length > 0) ? `AND section_id IN (${section_id})` : ''}
        // `);

        const sectionId = (Array.isArray(section_id) && section_id.length > 0) ? Prisma.sql`AND section_id IN (${section_id.join(',')})` : Prisma.sql``;

        sentSmsUsers = await prisma.$queryRaw(Prisma.sql`
        SELECT phone,student_informations.user_id as id FROM students
        JOIN student_informations ON student_informations.id = students.student_information_id
        JOIN sections ON students.section_id = sections.id
        WHERE class_id = ${class_id} AND school_id = ${refresh_token.school_id} ${sectionId}
        `);

        break;

      case "INDIVIDUAL":

        const role = await prisma.role.findFirstOrThrow({ where: { id: req.body.role_id } });

        sentSmsUsers = await getUsers({ where: { school_id: Number(refresh_token.school_id), user: { id: { in: individual_user_id } } }, role })

        break;

      default:
        throw new Error("invalid recipient type ")
    }

    // insert sent sms in sentsms table   
    responseSentSms = await insertsentSms({ recipient_type, campaign_name, sms_template_id, subject, school_id: refresh_token.school_id, custom_body, recipient_count: sentSmsUsers.length });
    // users sending sms handle 
    sentSmsUsers.length > 0 && sentSmsHandler({ sentSmsUsers, responseSentSms, school_id });

    return res.json({ message: 'success' });

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}



export default authenticate(post)