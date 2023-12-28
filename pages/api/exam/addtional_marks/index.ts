import prisma from '@/lib/prisma_client';
import get from 'controllers/exams/addtional_marks/get';
import post from 'controllers/exams/addtional_marks/post';
import patch from 'controllers/exams/addtional_marks/patch';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token) => {
  // try {
  const { method } = req;

  switch (method) {
    case 'GET':
      get(req, res, refresh_token)
      break;

    case 'POST':
      post(req, res, refresh_token);
      break;

    case 'PATCH':
      patch(req, res, refresh_token);
      break;

    default:
      res.setHeader('Allow', ['GET', 'POST', 'PATCH']);
      logFile.error(`Method ${method} Not Allowed`)
      res.status(405).end(`Method ${method} Not Allowed`);
  }
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: err.message });
  // }
};

export default authenticate(index);
