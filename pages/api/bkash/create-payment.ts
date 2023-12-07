import prisma from '@/lib/prisma_client';
import { unique_tracking_number } from '@/utils/utilitY-functions';
import axios from 'axios';
import { authenticate } from 'middleware/authenticate';

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'POST':
                const { data } = await axios.post('https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/token/grant', {
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
                // console.log("data__", data);
    
    
                const payment = await axios.post('https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/create', {
                    mode: '0011',
                    payerReference: " ",
                    callbackURL: 'http://localhost:3000/api/bkash/execute_payment',
                    amount: 50,
                    currency: "BDT",
                    intent: 'sale',
                    merchantInvoiceNumber: 'Inv' + '134235'
                }, {
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json",
                        authorization: data?.id_token,
                        'x-app-key': '4f6o0cjiki2rfm34kfdadl1eqq',
                    }
                })
                console.log("payment__", payment.data);
                return res.status(200).json({ bkashURL: payment.data.bkashURL })
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

export default (index);
