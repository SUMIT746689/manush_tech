import HomeContent from "../components/HomeContent";

import prisma from '../../../src/lib/prisma_client';
import { headers } from 'next/headers';

export default async function Home() {

  try {
    const headersList = headers();
    const domain = headersList.get('referer')?.slice(0, -1)

    const school = await prisma.school.findFirstOrThrow({
      where: {
        domain: domain
      }
    })

    const school_info = await prisma.websiteUi.findFirstOrThrow({
      where: {
        school_id: school.id
      }
    })

    const speechDatas = [
      {
        title: 'প্রতিষ্ঠানের ইতিহাস',
        image: `${process.env.SERVER_HOST}/${school_info?.history_photo?.replace(/\\/g, '/')}`,
        description: school_info?.school_history
      },
      {
        title: 'সভাপতির বাণী',
        image: `${process.env.SERVER_HOST}/${school_info?.chairman_photo?.replace(/\\/g, '/')}`,
        description: school_info?.chairman_speech
      },
      {
        title: 'অধ্যক্ষের বাণী',
        image: `${process.env.SERVER_HOST}/${school_info?.principal_photo?.replace(/\\/g, '/')}`,
        description: school_info?.principal_speech
      },

    ]
    // console.log("domain___",domain,school,school_info);
    return (
      <div>
        <HomeContent school_info={school_info} carousel_image={school_info?.carousel_image} speechDatas={speechDatas || []} />
      </div>
    )

  } catch (err) {
    console.log(err);
    return (
      <div className=' grid place-content-center h-screen border-2 text-4xl'>

        <h1 className=" text-center font-bold">
          Your domain is not registered !!
        </h1>

      </div>
    )
  }

}