import prisma from '../../../../src/lib/prisma_client';
import { headers } from 'next/headers';
import { redirect } from "next/navigation";
import OnlineAdmission from "../../components/OnlineAdmission";


export default async function Admission() {

    const headersList = headers();
    const domain = headersList.get('host')

    const classes = await prisma.class.findMany({
        where: {
            school: {
                domain: domain
            }
        },
        include: {
            sections: {
                select: {
                    id: true,
                    name: true
                }
            },
            Group: true
        }
    })

    const academicYear = await prisma.academicYear.findMany({
        where: { school: { domain: domain },deleted_at:null }
    });
  
    console.log(classes, academicYear);
    return (
        <div>
            <OnlineAdmission
                classes={classes || []}
                academicYears={academicYear || []}
                serverHost={`${process.env.SERVER_HOST}`}
            />
        </div>
    )



}
