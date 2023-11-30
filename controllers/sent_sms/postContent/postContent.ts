import prisma from "@/lib/prisma_client";

export const sentSms = (dataObj) => {

  prisma.$transaction([
    prisma.tbl_queued_sms.create({
      data: {
        ...dataObj
      }
    }),
    prisma.tbl_sent_sms.create({
      data: {
        ...dataObj
      }
    })
  ])
};

export const createCampaign = async ({ recipient_type, campaign_name, sms_template_id, sms_gateway_id, school_id, custom_body, recipient_count = 0 }) => {

  const data = {
    name: campaign_name,
    smsGateway: { connect: { id: sms_gateway_id } },
    // recipient_count,
    school: { connect: { id: Number(school_id) } }
  };

  if (recipient_type) data['recipient_type'] = recipient_type.toLowerCase();
  if (sms_template_id) data['smsTemplate'] = { connect: { id: sms_template_id } }
  else if (custom_body) data['custom_body'] = custom_body

  return await prisma.smsCampaigns.create({
    data
  });

}

export const getUsers = async ({ role, where }) => {
  switch (role.title) {
    case "TEACHER":
      const teachers = await prisma.teacher.findMany({ where: { ...where,deleted_at:null }, select: { phone: true } });
      return teachers;
    // const teachers = await prisma.teacher.findMany({ where: { ...where }, select: { phone: true, user_id: true, first_name: true, middle_name: true, last_name: true, } });
    // const teachers = await prisma.$queryRaw`
    // SELECT phone , user_id ,CONCAT(IfNull(first_name,"") ," " , IfNull(middle_name," ") , IfNull(last_name,"")) AS name
    // FROM teachers
    // WHERE 
    // `;
    // return teachers.map(teacher =>({ ...teacher, name: teacher?.first_name ? teacher?.first_name : "" + teacher?.middle_name ? ` ${teacher.middle_name}` : " " + teacher?.last_name ? teacher.last_name : "" }));

    case "STUDENT":
      const students = await prisma.studentInformation.findMany({ where: { ...where }, select: { phone: true } });
      return students
    // const students = await prisma.studentInformation.findMany({ where: { ...where }, select: { phone: true, user_id: true, first_name: true, middle_name: true, last_name: true } });
    // return students.map(student =>({ ...student, name: student?.first_name ? student?.first_name : "" + student?.middle_name ? ` ${student.middle_name}` : " " + student?.last_name ? student.last_name : "" }));

    default:
      // where['user_role_id'] = role.id;
      // delete where?.NOT;
      // const users = await prisma.user.findMany({
      //   where: { ...where },
      // });
      const users = []
      return users;
  };
}


// export const sentSmsToUsers = async (user, responseSentSms, smsGatewayRes, schoolInfoRes, userRes) => {
//   try {
//     const name = [user?.first_name, user?.middle_name, user?.last_name].join(' ');
//     // const { data: sms_res } = await axios.post(`https://${sms_res_gatewayinfo?.details?.sms_gateway}/smsapi?api_key=${sms_res_gatewayinfo?.details?.sms_api_key}&type=text&contacts=${user?.phone}&senderid=${sms_res_gatewayinfo?.details?.sender_id}&msg=${encodeURIComponent(`Dear ${name}, ${responseSentSms?.custom_body}`)
//     // }`)
//     // if (typeof sms_res === "string" && sms_res?.startsWith("SMS SUBMITTED")) status = "success"
//     // else status = "failed"
//     sentSms({ name, responseSentSms, user, smsGatewayRes, schoolInfoRes, userRes })
//   }
//   catch (err) {
//     // status = "failed"
//     sentSms({ name: "", responseSentSms, user, smsGatewayRes, schoolInfoRes, userRes })
//     console.log({ "send sms error": err.message })
//   }
// }


// export const updateSentSms = async ({ responseSentSms, sentSmsUsers }) => {
//   const smsCampaigns = await prisma.smsCampaigns.update({
//     where: { id: responseSentSms.id },
//     data: {
//       recipient_count: { increment: sentSmsUsers.length }
//     }
//   });
// }

// export const sentSmsHandler = async ({ sentSmsUsers, school_id, responseSentSms, smsGatewayRes, schoolInfoRes, userRes }) => {

//   // const sms_res_gatewayinfo: any = await prisma.smsGateway.findFirst({
//   //   where: {
//   //     school_id,
//   //     is_active: true
//   //   }
//   // })

//   //individual user sent sms and insert response and data into sent sms details table
//   sentSmsUsers.forEach((user) => {
//     // if (user)
//     sentSmsToUsers(user, responseSentSms, smsGatewayRes, schoolInfoRes, userRes)
//   })
// };

// insert data to smsCompaigns table table
