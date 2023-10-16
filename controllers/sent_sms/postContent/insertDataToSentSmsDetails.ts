import prisma from "@/lib/prisma_client";

export const insertDataToSentSmsDetails = ({ name, responseSentSms, user, smsGatewayRes }) => {

  const user_id = user.id || user.user_id;
  const { id: campaign_id, name: campaign_name, custom_body, school_id } = responseSentSms;
  const { details } = {} = smsGatewayRes;
  const { sender_id, sms_api_key: api_key } = details;

  console.log({ details });
  prisma.$transaction([
    prisma.smsCampaignDetails.create({
      data: {
        name: name,
        campaign_name,
        body: custom_body,
        phone: user.phone || '',
        api_key,
        sender_id,
        status: "pending",
        user_id,
        school_id,
        campaign_id,
        // user: { connect: { id: user.id || user.user_id } },
        // school: { connect: { id: school_id } },
        // smsCampaign: {
        //   connect: {
        //     id: responseSentSms.id
        //   }
        // }
      }
    }),
    prisma.tbl_sms_campaign_queued.create({
      data: {
        name,
        campaign_name,
        body: custom_body,
        phone: user.phone || '',
        sender_id,
        api_key,
        user_id,
        school_id
        // user: { connect: { id: user.id || user.user_id } },
        // school:{connect: { id: user.school_id }}
      }
    })
  ])

};

export const sentSmsToUsers = async (user, responseSentSms, smsGatewayRes) => {
  try {
    const name = [user?.first_name, user?.middle_name, user?.last_name].join(' ');
    // const { data: sms_res } = await axios.post(`https://${sms_res_gatewayinfo?.details?.sms_gateway}/smsapi?api_key=${sms_res_gatewayinfo?.details?.sms_api_key}&type=text&contacts=${user?.phone}&senderid=${sms_res_gatewayinfo?.details?.sender_id}&msg=${encodeURIComponent(`Dear ${name}, ${responseSentSms?.custom_body}`)
    // }`)
    // if (typeof sms_res === "string" && sms_res?.startsWith("SMS SUBMITTED")) status = "success"
    // else status = "failed"
    insertDataToSentSmsDetails({ name, responseSentSms, user, smsGatewayRes })
  }
  catch (err) {
    // status = "failed"
    insertDataToSentSmsDetails({ name: "", responseSentSms, user, smsGatewayRes })
    console.log({ "send sms error": err.message })
  }
}

export const sentSmsHandler = async ({ sentSmsUsers, school_id, responseSentSms, smsGatewayRes }) => {

  // const sms_res_gatewayinfo: any = await prisma.smsGateway.findFirst({
  //   where: {
  //     school_id,
  //     is_active: true
  //   }
  // })

  //individual user sent sms and insert response and data into sent sms details table
  sentSmsUsers.forEach((user) => {
  // if (user) 
  sentSmsToUsers(user, responseSentSms, smsGatewayRes)
  }) 
};

// insert data to smsCompaigns table table
export const insertsentSms = async ({ recipient_type, campaign_name, sms_template_id, sms_gateway_id, school_id, custom_body, recipient_count = 0 }) => {

  const data = {
    name: campaign_name,
    smsGateway: { connect: { id: sms_gateway_id } },
    recipient_count,
    school: { connect: { id: Number(school_id) } }
  };

  if (recipient_type) data['recipient_type'] = recipient_type.toLowerCase();
  if (sms_template_id) data['smsTemplate'] = { connect: { id: sms_template_id } }
  else if (custom_body) data['custom_body'] = custom_body

  return await prisma.smsCampaigns.create({
    data
  });

}

export const updateSentSms = async ({ responseSentSms, sentSmsUsers }) => {
  const smsCampaigns = await prisma.smsCampaigns.update({
    where: { id: responseSentSms.id },
    data: {
      recipient_count: { increment: sentSmsUsers.length }
    }
  });
  console.log({ smsCampaigns })
}

export const getUsers = async ({ role, where }) => {
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