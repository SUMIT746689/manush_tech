import { useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Voucher/PageHeader';
import Footer from 'src/components/Footer';
import { Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/Voucher/Results';
import { useClientFetch } from '@/hooks/useClientFetch';

function ManagementClasses() {
  const [editVoucher, setEditVoucher] = useState(null);
  const { data: voucher, reFetchData } = useClientFetch(`/api/voucher`);
  const VoucherTypes = [
    {
      label: 'Income',
      value: 'credit'
    },
    {
      label: 'Expense',
      value: 'debit'
    },
  ]
  return (
    <>
      <Head>
        <title>Voucher - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          VoucherTypes={VoucherTypes}
          editVoucher={editVoucher}
          reFetchData={reFetchData}
          setEditVoucher={setEditVoucher}
        />
      </PageTitleWrapper>

      <Grid
        sx={{ px: 4 }}
        container
        direction="row"
        justifyContent="center"
        alignItems="stretch"
        spacing={3}
      >
        <Grid item xs={12}>
          <Results users={voucher || []}
            setEditClass={setEditVoucher}
            VoucherTypes={VoucherTypes}
          />
        </Grid>
      </Grid>
      <Footer />
    </>
  );
}

ManagementClasses.getLayout = (page) => (
  <Authenticated name="class">
    <ExtendedSidebarLayout>{page}</ExtendedSidebarLayout>
  </Authenticated>
);

export default ManagementClasses;
