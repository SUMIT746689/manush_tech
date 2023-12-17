import post from 'controllers/banners/right_banners/post';
import delete_ from 'controllers/banners/right_banners/delete_';

export const config = {
    api: {
        bodyParser: false
    }
};

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'POST':
                post(req, res);
                break;
            case 'DELETE':
                delete_(req, res);
                break;
            default:
                res.setHeader('Allow', ['POST', 'DELETE']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });
    }
};

export default index;
