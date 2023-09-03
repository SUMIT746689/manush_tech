import { exec } from 'child_process'
import dayjs from 'dayjs';
import { authenticate } from 'middleware/authenticate';
import path from "path";
import fsp from "fs/promises";
import fs from 'fs';
import archiver from 'archiver';

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'GET':
                if (refresh_token?.role?.title !== 'SUPER_ADMIN') {
                    throw new Error('Permission denied !')
                }
                try {
                    await fsp.readdir(path.join(process.cwd(), `${process.env.FILESFOLDER}`, "DB_backup"));
                } catch (error) {
                    await fsp.mkdir(path.join(process.cwd(), `${process.env.FILESFOLDER}`, "DB_backup"));
                }
                const backupPath = path.join(`${process.env.FILESFOLDER}`, "DB_backup", `${dayjs().format('DD-MM-YYYY')}_backup.sql`)

                //  Backup from docker container
                 const command = `docker exec mysql /usr/bin/mysqldump -u ${process.env.DB_USER} -p ${process.env.DB_PASSWORD} school > ${backupPath}`

                // backup from hard dick
                // const command = `mysqldump -u ${process.env.DB_USER} -p ${process.env.DB_PASSWORD} school > ${backupPath}`

                exec(command, async (err, stdout, stderr) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database backup failed !' })
                    }
                    const zipFileName = `Backup-${Date.now()}.zip`;
                    const zipFilePath = path.join(process.cwd(), zipFileName);
                    const folderToDownload = path.join(process.cwd(), `${process.env.FILESFOLDER}`);
                    // Create a writable stream to the zip file
                    const output = fs.createWriteStream(zipFilePath);

                    // Create a new archiver instance to create the zip file
                    const archive = archiver('zip', {
                        zlib: { level: 9 }, // Set compression level (optional)
                    });

                    // Pipe the output stream to the archive
                    await archive.pipe(output);

                    // Add the entire folder to the zip file
                    await archive.directory(folderToDownload, false);

                    // Once all files are added to the archive, finalize it
                    await archive.finalize();

                    // Set response headers for the zip file download
                    res.setHeader('Content-Type', 'application/zip');
                    res.setHeader('Content-Disposition', `attachment; filename=${zipFileName}`);

                    // Pipe the zip file to the response stream
                    fs.createReadStream(zipFilePath).pipe(res);

                    // Delete the temporary zip file after the response is sent
                    res.on('finish', () => {
                        fs.unlinkSync(zipFilePath);
                    });
                    // res.status(200).json({ message: 'Database backup success !!' });
                })


                break;
            default:
                res.setHeader('Allow', ['GET']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

export default authenticate(index);
