import fs from 'fs';
import path from 'path';

export async function GET (req) {
  try {
    const { method } = req;
console.log("Response__",Response);

        const { file } = req.query;
        const updateFilePath = path.join(process.cwd(), `${process.env.FILESFOLDER}`, ...file);
        console.log("updateFilePath__",updateFilePath);
        if (!fs.existsSync(updateFilePath)) return Response.json({ error: "no file found" });
        fs.createReadStream(updateFilePath).pipe(Response);

        // fileReadSteam.on('data', (data) => {
        //   console.log(data);
        //   res.send(data)
        // })
        // res.on('end', () => res.end());

       
        // Response.setHeader('Allow', ['GET']);
        // Response.status(405).end(`Method ${method} Not Allowed`);
    
  } catch (err) {
    console.log(err);
    // Response.status(500).json({ message: err.message });
  }
};

