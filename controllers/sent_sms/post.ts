import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import { authenticate } from 'middleware/authenticate';

const prisma = new PrismaClient();

const insertDataToSentSmsDetails = ({ responseSentSms_id, status, user }) => {
  prisma.sentSmsDetail.create({
    //@
    data: {
      name: 'sfafafd',
      phone: user.phone || '',
      status: status,
      user: { connect: { id: user.id || user.user_id } },
      sentSms: {
        connect: {
          id: responseSentSms_id
        }
      }
    }
  }).then(res => {
    // console.log({ res });
  })
};

const sentSmsToUsers = async (user,sms_res_gatewayinfo, responseSentSms) => {
  let status = "pending"
  try {
    const name = [user?.first_name, user?.middle_name, user?.last_name].join(' ');
    const { data: sms_res } = await axios.post(`https://${sms_res_gatewayinfo?.details?.sms_gateway}/smsapi?api_key=${sms_res_gatewayinfo?.details?.sms_api_key}&type=text&contacts=${user?.phone}&senderid=${sms_res_gatewayinfo?.details?.sender_id}&msg=${encodeURIComponent(`Dear ${name}, ${responseSentSms?.custom_body}`)
      }`)
    if (typeof sms_res === "string" && sms_res?.startsWith("SMS SUBMITTED")) status = "success"
    else status = "failed"
    insertDataToSentSmsDetails({ responseSentSms_id: responseSentSms.id, status, user })
  }
  catch (err) {
    status = "failed"
    insertDataToSentSmsDetails({ responseSentSms_id: responseSentSms.id, status, user })
    console.log({ "send sms error": err.message })
  }
}

const sentSmsHandler = async ({ sentSmsUsers, school_id, responseSentSms }) => {
  console.log("responseSentSms__", responseSentSms);

  const sms_res_gatewayinfo: any = await prisma.smsGateway.findFirst({
    where: {
      school_id,
      is_active: true
    }
  })
  //individual user sent sms and insert response and data into sent sms details table
  sentSmsUsers.forEach((user) => {
    // if (user) 
    sentSmsToUsers(user,sms_res_gatewayinfo, responseSentSms)
  })
};

// insert data to sent sms table
const insertsentSms = async ({ recipient_type, campaign_name, sms_template_id, sms_gateway_id, school_id, custom_body, recipient_count = 0 }) => {

  const data = {
    name: campaign_name,
    smsGateway: { connect: { id: sms_gateway_id } },
    recipient_count,
    school: { connect: { id: Number(school_id) } }
  };

  if (recipient_type) data['recipient_type'] = recipient_type.toLowerCase();
  if (sms_template_id) data['smsTemplate'] = { connect: { id: sms_template_id } }
  else if (custom_body) data['custom_body'] = custom_body

  return await prisma.sentSms.create({
    data
  });

}

const updateSentSms = async ({ responseSentSms, sentSmsUsers }) => {
  const ss = await prisma.sentSms.update({
    where: { id: responseSentSms.id },
    data: {
      recipient_count: { increment: sentSmsUsers.length }
    }
  });
  console.log({ ss })
}

const getUsers = async ({ role, where }) => {
  switch (role.title) {
    case "TEACHER":
      return await prisma.teacher.findMany({ where: { ...where }, select: { phone: true, user_id: true, first_name: true, middle_name: true, last_name: true } });

    case "STUDENT":

      return await prisma.studentInformation.findMany({ where: { ...where }, select: { phone: true, user_id: true, first_name: true, middle_name: true, last_name: true } });

    default:
      where['user_role_id'] = role.id;

      return await prisma.user.findMany({
        where: { ...where },
      });
  };

}

async function post(req, res, refresh_token) {
  try {
    const { sms_gateway_id, campaign_name, recipient_type, role_id, class_id, section_id, name: individual_user_id, body: custom_body, sms_template_id } = req.body;
    const { school_id } = refresh_token;
    console.log({ body: req.body })
    if (!sms_gateway_id || !recipient_type) throw new Error("provide valid data")

    const data = {
      sms_gateway_id,
      school: { connect: { id: refresh_token.school_id } }
    }

    let sentSmsUsers = [];
    let responseSentSms = null;

    switch (recipient_type) {
      case "GROUP":
        if (!role_id) throw new Error("permission denied");
        const roles = await prisma.role.findMany({ where: { id: { in: role_id } }, select: { title: true, id: true } })
        console.log({ roles })
        // const roleArray = [];
        // get users persmissions
        // const user = await prisma.user.findFirst({ where: { id: refresh_token.id }, select: { role: { select: { permissions: { select: { value: true } } } }, permissions: { select: { value: true } } } })
        //get permissions
        // const permissions = user.role?.permissions ? user.role.permissions : user.permissions;

        // check user have that permission or not
        // const some = permissions.some(permission => permission.value === `create_${ role?.title?.toLowerCase() || '' } `)

        // if (!some) throw new Error("permissions denied");

        if (!Array.isArray(roles) || roles.length <= 0) throw new Error("Invalid role");
        let responseSentSms = null;

        // insert sent sms in sentsms table   
        responseSentSms = await insertsentSms({ recipient_type, campaign_name, sms_template_id, sms_gateway_id, school_id: refresh_token.school_id, custom_body });

        roles.forEach(async (role) => {

          let singleGroupUsers = null;

          //get users for sending sms 
          singleGroupUsers = await getUsers({ where: { school_id: Number(school_id) }, role })

          if (!singleGroupUsers) return;
          //udpate sentsms table
          updateSentSms({ sentSmsUsers: singleGroupUsers, responseSentSms });
          // every group individually sending sms handles
          sentSmsHandler({ sentSmsUsers: singleGroupUsers, school_id, responseSentSms });
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

        sentSmsUsers = await prisma.$queryRawUnsafe(`
        SELECT phone, student_informations.user_id as id,student_informations.first_name as first_name,student_informations.middle_name as middle_name,student_informations.last_name as last_name FROM students
        JOIN student_informations ON student_informations.id = students.student_information_id
        JOIN sections ON students.section_id = sections.id
        WHERE class_id = ${class_id} AND school_id = ${refresh_token.school_id} ${(Array.isArray(section_id) && section_id.length > 0) ? `AND section_id IN (${section_id})` : ''}
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
    responseSentSms = await insertsentSms({ recipient_type, campaign_name, sms_template_id, sms_gateway_id, school_id: refresh_token.school_id, custom_body, recipient_count: sentSmsUsers.length });
    // users sending sms handle 
    sentSmsUsers.length > 0 && sentSmsHandler({ sentSmsUsers, school_id, responseSentSms });

    return res.json({ message: 'success' });

  } catch (err) {
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)