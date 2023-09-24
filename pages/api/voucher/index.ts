import get from "controllers/voucher/get";
import post from "controllers/voucher/post";

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                get(req, res);
                break;
            case 'POST':
                post(req, res);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });

    }

}

export default (index) 