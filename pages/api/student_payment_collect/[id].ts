import { get } from 'controllers/student_payment_collects/student_payment_collect/get';
import { patch } from 'controllers/student_payment_collects/student_payment_collect/patch';

const id = async (req, res) => {
  try {
    const { method } = req;
    const id = parseInt(req.query.id);
    if (!id) return res.status(400).json({ message: 'valid id required' });

    switch (method) {
      case 'GET':
        get(req, res);
        break;
      case 'PATCH':
        patch(req, res);
        break;
      default:
        res.setHeader('Allow', ['PATCH']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

export default id;
