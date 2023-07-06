import get from 'controllers/rooms/room/get';
import patch from 'controllers/rooms/room/patch';


const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        get(req, res);
        break;
      case 'PATCH':
        patch(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'PATCH']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default index;
