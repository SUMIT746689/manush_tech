import Head from 'next/head';

import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';

import DashboardReportsContent from 'src/content/DashboardPages/reports';
import { SSRHTTPClient } from 'repositories/base';
import { useEffect } from 'react';

export async function getServerSideProps(context: any) {

  let blockCount: object = {};
  try {
    const client = SSRHTTPClient(context)
    const res = await client.get(`${process.env.NEXT_PUBLIC_BASE_API}/api/dashboard`)
    blockCount = res.data;
    
  } catch (err) {
    console.log(err)
  }
  return {
    props: { blockCount },
  }
}

function DashboardReports({ blockCount }) {
  return (
    <>
      <Head>
        <title>Dashboard</title>
      </Head>
      <DashboardReportsContent blockCount={blockCount} />
    </>
  );
}

DashboardReports.getLayout = (page) => (
  <Authenticated>
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default DashboardReports;
