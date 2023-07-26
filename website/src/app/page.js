import HomeContent from "../components/HomeContent";

import prisma from '../../../src/lib/prisma_client';
import { headers } from 'next/headers';
import { redirect } from "next/navigation";


export default async function Home(props) {

  const headersList = headers();
  const domain = headersList.get('host')
  
 console.log("path___",headersList.get('x-url'));

  const school_info = await prisma.websiteUi.findFirst({
    where: {
      school: {
        domain: domain
      }
    },
  })
 
  // if (!school_info) {
  //   redirect('/school-not-found')
  // }
 
  props['params']['school_info'] = "testing"

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

  const carousel_image = school_info?.carousel_image.map(i => ({
    path: `${process.env.SERVER_HOST}/${i?.path?.replace(/\\/g, '/')}`
  }))
  // console.log("domain___",domain,school,school_info);
  return (
    <div>
      <HomeContent carousel_image={carousel_image || []} speechDatas={speechDatas || []} />
    </div>
  )



}