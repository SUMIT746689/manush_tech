import prisma from '@/lib/prisma_client';
import { unique_tracking_number } from '@/utils/utilitY-functions';
import axios from 'axios';
import { authenticate } from 'middleware/authenticate';
import dayjs from 'dayjs';

const handleTransaction = ({ collected_amount, refresh_token }) => {
    return new Promise(async (resolve, reject) => {
        try {

            const token = await axios.post(process.env.bkash_grant_token_url, {
                app_key: process.env.bkash_app_key,
                app_secret: process.env.bkash_app_secret
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    username: process.env.bkash_username,
                    password: process.env.bkash_password,
                }
            })

            const payment = await axios.post(process.env.bkash_create_payment_url, {
                mode: '0011',
                payerReference: "fee payment",
                callbackURL: `${process.env.NEXT_PUBLIC_BASE_API}/api/package_requests/bkash/execute_payment`,
                amount: Number(collected_amount),
                currency: "BDT",
                intent: 'sale',
                merchantInvoiceNumber: Date.now().toString()
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    authorization: token.data.id_token,
                    'x-app-key': process.env.bkash_X_App_Key,
                }
            })
            console.log("payment__", payment.data);

            if (!payment.data?.paymentID || !token.data?.id_token) throw Error(payment.data.statusMessage)

            const prev_sub = await prisma.subscription.findFirstOrThrow({
                where: {
                    school_id: refresh_token.school_id,
                    is_active: true,
                },
                include: {
                    package: true
                }
            })

            await prisma.session_store.create({

                data: {
                    paymentID: payment.data.paymentID,
                    created_at: new Date(payment.data?.paymentCreateTime.slice(0, 19)) || new Date(),
                    user_id: refresh_token.id,
                    token: token.data.id_token,
                    data: {
                        collected_amount,
                        school_id: refresh_token.school_id,
                        subscription_id: prev_sub.id,
                        subscription_end: prev_sub.end_date,
                        subscription_duration: prev_sub.package.duration,
                    }
                }
            })

            resolve({ bkashURL: payment.data.bkashURL })

        } catch (err) {
            reject(new Error(`${err.message}`))
        }
    })
}


const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'POST':
                console.log("req.body__", req.body);

                if (!req.body.collected_amount || !refresh_token.id) {
                    throw new Error('student_id or collected_by_user or fee_id or collected_amount or total_payable missing !!')
                }
                const collected_amount = Number(req.body.collected_amount)

                const tr = await handleTransaction({
                    collected_amount,
                    refresh_token
                })
                //@ts-ignore
                return res.status(200).json({ bkashURL: tr.bkashURL })

                break;




            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export default authenticate(index);
