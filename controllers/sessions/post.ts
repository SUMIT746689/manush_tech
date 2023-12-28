import { logFile } from "utilities_api/handleLogFile";

export default async function post(req, res) {
  try {
    const { title } = req.body;

    if (title) {
      const response = '';
      //  await prisma.session.create({
      //   data: {
      //     title
      //   }
      // });

      if (response) return res.json({ success: true });
      else throw new Error('Invalid to create session');
    } else throw new Error('provide valid data');
  } catch (err) {
    logFile.error(err.message)
    res.status(404).json({ error: err.message });
  }
}
