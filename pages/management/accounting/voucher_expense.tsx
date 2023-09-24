import { useState } from 'react';
import Head from 'next/head';
import ExtendedSidebarLayout from 'src/layouts/ExtendedSidebarLayout';
import { Authenticated } from 'src/components/Authenticated';
import PageHeader from 'src/content/Management/Voucher/Expense/PageHeader';
import Footer from 'src/components/Footer';
import { Grid } from '@mui/material';
import PageTitleWrapper from 'src/components/PageTitleWrapper';
import Results from 'src/content/Management/Voucher/Expense/Results';
import { useClientFetch } from '@/hooks/useClientFetch';

function ManagementClasses() {
  const [editClass, setEditClass] = useState(null);
  const { data: accounts } = useClientFetch(`/api/account`);
  const { data: voucher } = useClientFetch(`/api/voucher?type=debit`);
  const { data: expense, reFetchData: reFetchExpense } = useClientFetch(`/api/transaction?type=debit`);

  return (
    <>
      <Head>
        <title>Expense - Management</title>
      </Head>
      <PageTitleWrapper>
        <PageHeader
          accounts={accounts}
          accountsOption={accounts?.map(i => ({
            label: i.title,
            id: i.id
          })) || []}
          editClass={editClass}
          reFetchExpense={reFetchExpense}
          voucher={voucher?.map(i => ({
            label: i.title,
            id: i.id
          })) || []}
          setEditClass={setEditClass}
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
          <Results users={expense || []} setEditClass={setEditClass} />
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
