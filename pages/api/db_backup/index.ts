import { PrismaClient } from '@prisma/client';
import { exec } from 'child_process'

const prisma = new PrismaClient();

const index = async (req, res) => {
    try {
        const { method } = req;

        switch (method) {
            case 'POST':
                // backup from hard dick
                // exec(' mysqldump -u root -p[root_password] [database_name] > dumpfilename.sql');

                // Backup from docker container
                exec('docker exec mysql /usr/bin/mysqldump -u root school > backup.sql', (err, stdout, stderr) => {
                    if (err) {
                        throw new Error('Database backup failed !')

                    }
                    res.status(200).json({ message: 'Database backup success !!' });
                })


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
