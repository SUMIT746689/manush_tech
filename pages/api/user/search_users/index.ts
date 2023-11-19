import get from 'controllers/users/search_users/get';

const search_users = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        get(req, res);
        break;

      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default (search_users);
