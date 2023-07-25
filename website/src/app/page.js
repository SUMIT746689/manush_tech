import HomeContent from "../components/HomeContent";

import prisma from '../../../src/lib/prisma_client';
import { headers } from 'next/headers';

export default async function Home() {
  const headersList = headers();
  const domain = headersList.get('host')

  const school = await prisma.school.findFirst({
    where: {
      domain: domain
    }
  })

  const school_info = await prisma.websiteUi.findFirst({
    where: {
      school_id: school?.id
    }
  })
  console.log("aaaaaaaaaaaa school_info__", domain, school_info);

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
  return (
    <div>
      <HomeContent carousel_image={school_info?.carousel_image} speechDatas={speechDatas || []} />
    </div>
  );
}