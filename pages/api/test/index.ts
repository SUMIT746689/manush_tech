import prisma from '@/lib/prisma_client';
import { unique_tracking_number } from '@/utils/utilitY-functions';
import axios from 'axios';
import { authenticate } from 'middleware/authenticate';

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                const { paymentID, status } = req.query

                if (status === 'cancel' || status === 'failure') {
                    return res.redirect(`http://localhost:5173/error?message=${status}`)
                }
                if (status === 'success') {
                    try {
                        const { data } = await axios.post('https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/execute', { 
                            paymentID
                         }, 
                         {
                            headers: {
                                "Content-Type": "application/json",
                                Accept: "application/json",
                                // authorization: globals.get('id_token'),
                                'x-app-key': process.env.bkash_api_key,
                            }
                        })
                        if (data && data.statusCode === '0000') {
                            //const userId = globals.get('userId')

                            return res.redirect(`http://localhost:5173/success`)
                        } else {
                            return res.redirect(`http://localhost:5173/error?message=${data.statusMessage}`)
                        }
                    } catch (error) {
                        console.log(error)
                        return res.redirect(`http://localhost:5173/error?message=${error.message}`)
                    }
                }
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
