import prisma from '@/lib/prisma_client';
import { Prisma } from '@prisma/client';
import axios from 'axios';
import { authenticate } from 'middleware/authenticate';
import { getUsers, insertDataToSentSmsDetails, insertsentSms, sentSmsHandler, updateSentSms } from './postContent/postContent';


async function post(req, res, refresh_token) {
  try {
    const { sms_gateway_id, campaign_name, recipient_type, role_id, class_id, section_id, name: individual_user_id, body: custom_body, sms_template_id } = req.body;
    const { school_id, id } = refresh_token;
    
    console.log({ body: req.body });

    if (!sms_gateway_id || !recipient_type) throw new Error("required valid datas")

    const data = {
      sms_gateway_id,
      school: { connect: { id: refresh_token.school_id } }
    }

    let sentSmsUsers = [];
    let responseSentSms = null;
    console.log({ school_id })

    // response from sms gateway response
    const smsGatewayRes = await prisma.smsGateway.findFirst({ where: { school_id: school_id } })

    // school information
    const schoolInfoRes = await prisma.school.findFirst({ where: { id: school_id }, select: { name: true } })
    console.log({ smsGatewayRes })

    // school information
    const userRes = await prisma.user.findFirst({ where: { id: parseInt(id) }, select: { username: true } })
    console.log({ smsGatewayRes })

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
          sentSmsHandler({ sentSmsUsers: singleGroupUsers, school_id, responseSentSms, smsGatewayRes, schoolInfoRes, userRes });
        })

        return res.status(200).json({ message: "successfull" });
      // break;

      case "CLASS":

        const sections = section_id.join(", ")

        sentSmsUsers = await prisma.$queryRaw`
          SELECT phone, student_informations.user_id as id,student_informations.first_name as first_name,student_informations.middle_name as middle_name,student_informations.last_name as last_name FROM students
          JOIN student_informations ON student_informations.id = students.student_information_id
          JOIN sections ON students.section_id = sections.id
          WHERE class_id = ${class_id} AND school_id = ${refresh_token.school_id}
          ${(Array.isArray(section_id) && section_id.length > 0) ? Prisma.sql`AND section_id IN (${sections})` : Prisma.empty}
        `
        // .catch(err=>{console.log({err})})
        console.log({ sentSmsUsers })
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
    sentSmsUsers.length > 0 && sentSmsHandler({ sentSmsUsers, school_id, responseSentSms, smsGatewayRes, schoolInfoRes, userRes });

    return res.json({ message: 'success' });

  } catch (err) {
    console.log({ err: err.message })
    res.status(404).json({ error: err.message });
  }
}

export default authenticate(post)