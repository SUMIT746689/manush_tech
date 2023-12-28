import prisma from "@/lib/prisma_client";
import { authenticate } from "middleware/authenticate";

const index = async (req, res, refresh_token) => {
  const { method } = req;

  switch (method) {
    case 'GET':
      const credentials = await prisma.payment_gateway_credential.findFirst({
        where: {
          school_id: refresh_token.school_id,
          title:'bkash',
          account: {
            school_id: refresh_token.school_id
          }
        }
      })
      
      res.status(200).json(credentials);
      break;

    case 'POST':
      const { account_id, username, password, app_key, app_secret, X_App_Key, grant_token_url, create_payment_url, execute_payment_url, is_active } = req.body;

      const data = {
        title: 'bkash',
        details: {
          username,
          password,
          app_key,
          app_secret,
          X_App_Key,
          grant_token_url,
          create_payment_url,
          execute_payment_url,
        },
        is_active,
        school: {
          connect: {
            id: refresh_token.school_id
          }
        },
        account: {
          connect: {
            id: account_id
          }
        },

      }

      const prev = await prisma.payment_gateway_credential.findFirst({
        where: {
          school_id: refresh_token.school_id,
          title: 'bkash',
        },
        select: {
          id: true
        }
      })
      if (!prev) {
        //@ts-ignore
        await prisma.payment_gateway_credential.create({ data })
      }
      else {
        await prisma.payment_gateway_credential.update({
          where: {
            id: prev.id
          },
          //@ts-ignore
          data
        })
      }

      res.status(200).json({ message: 'Bkash credential information updated!' });
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default authenticate(index);
