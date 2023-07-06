import { get } from "controllers/teachers/get";
import { post } from "controllers/teachers/post";
import { patch } from "controllers/teachers/patch";
export const config = {
  api: {
    bodyParser: false,
  },
};
const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                get(req,res);
                break;
            case 'POST':
                post(req,res);
                break;
            case 'PATCH':
                patch(req,res);
                break;
            default:
                res.setHeader('Allow', ['GET', 'POST','PATCH']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: err.message });

    }

}

export default index