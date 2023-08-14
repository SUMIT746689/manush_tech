import Notice from "../../components/NoticeContent";

import prisma from '../../../../src/lib/prisma_client';
import { headers } from 'next/headers';
import { redirect } from "next/navigation";


export default async function Home(props) {

  const headersList = headers();
  const domain = headersList.get('host')



  const school_info = await prisma.websiteUi.findFirst({
    where: {
      school: {
        domain: domain
      }
    },
    select: {
      latest_news: true
    }
  })

  console.log(school_info);

  return (
    <div>
      <Notice notice={school_info?.latest_news || []} />
    </div>
  )



}
