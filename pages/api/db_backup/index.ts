import { exec } from 'child_process'
import dayjs from 'dayjs';
import { authenticate } from 'middleware/authenticate';
import path from "path";
import fsp from "fs/promises";

const index = async (req, res, refresh_token) => {
    try {
        const { method } = req;

        switch (method) {
            case 'POST':
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
                // const command = `docker exec mysql /usr/bin/mysqldump -u ${process.env.DB_USER} -p ${process.env.DB_PASSWORD} school > ${backupPath}`

                // backup from hard dick
                const command = `mysqldump -u ${process.env.DB_USER} -p ${process.env.DB_PASSWORD} school > ${backupPath}`

                exec(command, (err, stdout, stderr) => {
                    if (err) {
                        return res.status(500).json({ message: 'Database backup failed !' })
                    }
                    res.status(200).json({ message: 'Database backup success !!' });
                })


                break;
            default:
                res.setHeader('Allow', ['POST']);
                res.status(405).end(`Method ${method} Not Allowed`);
        }
    } catch (err) {
        console.log(err);
        res.status(500).send(err);
    }
};

export default authenticate(index);
