import prisma from '@/lib/prisma_client';
import { unique_tracking_number } from '@/utils/utilitY-functions';
import axios from 'axios';
import { authenticate } from 'middleware/authenticate';

const index = async (req, res, refresh_token) => {

    const { method } = req;


    const { paymentID, status } = req.query
    console.log(req.query);

    if (status === 'cancel' || status === 'failure') {
        return res.redirect(`http://localhost:3000/error?message=${status}`)
    }
    if (status === 'success') {
        try {
            switch (method) {
                case 'GET':
                    const session = await prisma.session_store.findFirst({
                        where: {
                            paymentID
                        },
                    })
                    const { data } = await axios.post('https://tokenized.sandbox.bka.sh/v1.2.0-beta/tokenized/checkout/execute', { paymentID }, {
                        headers: {
                            "Content-Type": "application/json",
                            Accept: "application/json",
                            authorization: session.token,
                            'x-app-key': '4f6o0cjiki2rfm34kfdadl1eqq'
                        }
                    })
                    await prisma.session_store.delete({ where: { paymentID: session.paymentID } })
                    
                    if (data && data.statusCode === '0000') {

                        return res.redirect(`http://localhost:3000/management/student_fees_collection`)
                    } else {
                        return res.redirect(`http://localhost:3000/error?message=${data.statusMessage}`)
                    }
                    break;
                default:
                    res.setHeader('Allow', ['GET', 'POST']);
                    res.status(405).end(`Method ${method} Not Allowed`);
            }
        }
        catch (error) {
            console.log(error)
            return res.redirect(`http://localhost:3000/error?message=${error.message}`)
        }

    }
}

export default (index);
