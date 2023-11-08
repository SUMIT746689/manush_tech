import { get } from 'controllers/users/get';
import { post } from 'controllers/users/post';
import { authenticate } from 'middleware/authenticate';
export const config = {
  api: {
    bodyParser: false
  }
};
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
};

export default authenticate(index) ;
