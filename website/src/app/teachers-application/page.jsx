import prisma from '../../../../src/lib/prisma_client';
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import TeachersApplication from "../../components/TeachersApplication";


export default async function Admission() {

    const headersList = headers();
    const domain = headersList.get('host')

    const departments = await prisma.department.findMany({
        where: {
            school: {
                domain
            }
        }
    })
    return (
        <div>
            <TeachersApplication
                serverHost={`${process.env.SERVER_HOST}`}
                departments={departments?.map(i => ({
                    label: i.title,
                    value: i.id
                })) || []}
            />
        </div>
    )



}
