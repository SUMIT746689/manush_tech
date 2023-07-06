import fs from 'fs';
import path from 'path';
const index = async (req, res) => {
  try {
    const { method } = req;

    switch (method) {
      case 'GET':
        const { file_path } = req.query;
        const updateFilePath = path.join(process.cwd(), ...file_path);
     
        if (!fs.existsSync(updateFilePath)) return res.json({ error: "no file found" });
        fs.createReadStream(updateFilePath).pipe(res);

        // fileReadSteam.on('data', (data) => {
        //   console.log(data);
        //   res.send(data)
        // })
        // res.on('end', () => res.end());

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

export default index;
