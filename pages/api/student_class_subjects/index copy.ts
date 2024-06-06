import prisma from '@/lib/prisma_client';
import get from 'controllers/holidays/get';
import post from 'controllers/holidays/post';
import { connect } from 'http2';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';

const index = async (req, res, refresh_token) => {
  // try {
  const { method } = req;

  switch (method) {
    // case 'GET':
    //   get(req, res);
    //   break;
    case 'POST':
      // post(req, res);
      const { subjects, student_id } = req.body;
      const { school_id } = refresh_token;

      // if (!student_id || !Array.isArray(subjects)) throw new Error('student field is required');
      // subjects.forEach(({ subject_id, teacher_id }) => {
      //   if (!subject_id || !teacher_id) throw new Error('subject or teacher not founds ');
      // })

      // const promisses = subjects.map(({ subject_id, teacher_id }) => {

      //   return new Promise((resolve, reject) => {

      //     prisma.studentClassSubjects.findFirst({
      //       where: {
      //         school_id,
      //         student_id,
      //         subject_id,
      //         teacher_id
      //       },
      //       select: {
      //         id: true
      //       }
      //     })
      //       .then(res => {
      //         if (res?.id) return resolve({ status: "already created" });

      //         prisma.studentClassSubjects.create({
      //           data: {
      //             student_id,
      //             subject_id,
      //             teacher_id,
      //             school_id
      //           }
      //         })
      //           .then(res => { resolve({ status: "success" }) })
      //           .catch(err => { resolve({ status: "failed create" }) })

      //       })
      //       .catch((err) => {
      //         console.log({ err })
      //         resolve({ status: "failed" })
      //       })

      //   })
      // });

      // Promise.all(promisses)
      //   .then((response) => {
      //     console.log({ response })
      //     res.status(200).json({ message: "process successfull" });
      //   })
      //   .catch((err) => {
      //     logFile.error(`Method ${method} Not Allowed`);
      //     res.status(405).json({ message: err.message })
      //   })

      // await prisma.studentClassSubjects.findFirst({where: {id}}); 
      // return 
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      logFile.error(`Method ${method} Not Allowed`);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
  // } catch (err) {
  //   console.log(err);
  //   res.status(500).json({ message: err.message });
  // }
};

export default authenticate(index);
