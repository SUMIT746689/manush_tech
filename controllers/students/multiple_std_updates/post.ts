import prisma from '@/lib/prisma_client';
import { Prisma } from '@prisma/client';
import { authenticate } from 'middleware/authenticate';
import { logFile } from 'utilities_api/handleLogFile';


const handlePost = async (req, res) => {
    try {

        const { students_datas, update_fields } = req.body;
        // const res = await prisma.
        if (!Array.isArray(students_datas) && !Array.isArray(update_fields)) throw new Error("required field missing")
        const studentFieldList = Prisma.StudentScalarFieldEnum;
        let success = 0;
        let failed = 0;
        const updateAllStds = students_datas.map(element => {
            return new Promise(async resolve => {
                const updateDatas = { student_info: { update: {} } }
                update_fields.forEach(field => {
                    if (studentFieldList[field]) return updateDatas[field] = element[field] || undefined;
                    updateDatas.student_info.update[field] = element[field] || undefined;
                });
                await prisma.student.update({
                    where: { id: element.id }, data: updateDatas
                })
                    .then(() => { success++ })
                    .catch(err => { logFile.error(err.message); failed++ })
                    .finally(() => resolve(''))
            });

        });

        const retults = Promise.all(updateAllStds);
        retults
            .then(() => {
                res.status(200).json({ message: `Students updated successfully ! success: ${success} | fail: ${failed}` })
            })
            .catch(resultErr => {
                logFile.error(resultErr.message)
                res.status(404).json({ error: resultErr.message });
            })



    } catch (err) {
        logFile.error(err.message)
        res.status(404).json({ error: err.message });
    }
}

export default authenticate(handlePost) 