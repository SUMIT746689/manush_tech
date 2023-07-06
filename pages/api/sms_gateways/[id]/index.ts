import patch from 'controllers/sms_gateways/sms_gateway/patch';


const index = async (req, res) => {

  const { method } = req;

  switch (method) {
    case 'PATCH':
      patch(req, res);

      break;
    default:
      res.setHeader('Allow', ['PATCH']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default index;
