import get from 'controllers/rooms/get';
import post from 'controllers/rooms/post';
import adminCheck from 'middleware/adminCheck';
import { authenticate } from 'middleware/authenticate';


const index = async (req, res,refresh_token) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        get(req, res,refresh_token);
        break;
      case 'POST':
        post(req, res,refresh_token);
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

export default authenticate(adminCheck(index)) ;
