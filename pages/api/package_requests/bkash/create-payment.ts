import prisma from '@/lib/prisma_client';
import { unique_tracking_number } from '@/utils/utilitY-functions';
import axios from 'axios';
import { authenticate } from 'middleware/authenticate';
import dayjs from 'dayjs';

const handleTransaction = ({ collected_amount, refresh_token }) => {
    return new Promise(async (resolve, reject) => {
        try {

            const token = await axios.post('https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
                app_key: "4f6o0cjiki2rfm34kfdadl1eqq",
                app_secret: "2is7hdktrekvrbljjh44ll3d9l1dtjo4pasmjvs5vl5qr3fug4b"
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    username: 'sandboxTokenizedUser02',
                    password: 'sandboxTokenizedUser02@12345',
                }
            })

            const payment = await axios.post('https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create', {
                mode: '0011',
                payerReference: "fee payment",
                callbackURL: `${process.env.NEXT_PUBLIC_BASE_API}/api/package_requests/bkash/execute_payment`,
                amount: Number(collected_amount),
                currency: "BDT",
                intent: 'sale',
                merchantInvoiceNumber: 'Inv' + '134235'
            }, {
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                    authorization: token.data.id_token,
                    'x-app-key': '4f6o0cjiki2rfm34kfdadl1eqq',
                }
            })
            console.log("payment__", payment.data);

            if (!payment.data?.paymentID || !token.data?.id_token) throw Error(payment.data.statusMessage)

            await prisma.session_store.create({

                data: {
                    paymentID: payment.data.paymentID,
                    created_at: new Date(payment.data?.paymentCreateTime.slice(0, 19)) || new Date(),
                    user_id: refresh_token.id,
                    token: token.data.id_token,
                    data: {
                        collected_amount,
                        school_id: refresh_token.school_id
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
