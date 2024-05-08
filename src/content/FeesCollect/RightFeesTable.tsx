import Paper from '@mui/material/Paper';
import { Grid, TextField, Typography, Button } from '@mui/material';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import useNotistick from '@/hooks/useNotistick';

export default function RightFeesTable({
  collect_other_fees_btn,
  setCollect_other_fees_btn,
  feesName,
  setFeesName,
  feesAmount,
  setFeesAmount,
  transID,
  feesUserData,
  selectedAccount,
  selectedGateway
}) {
  const { showNotification } = useNotistick();
  const { user } = useAuth();

  const handleFeesName = (event: ChangeEvent<HTMLInputElement>) => {
    setFeesName(event.target.value);
    setCollect_other_fees_btn(false);
  };

  const handleFeesAmount = (event: ChangeEvent<HTMLInputElement>) => {
    const int_value = parseInt(event.target.value);
    const value = Math.abs(int_value);
    setFeesAmount(value);
    setCollect_other_fees_btn(false);
  };

  // const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
  //   event.preventDefault();

  //   // handle bank account input field error message
  //   if (!feesUserData?.id) {
  //     showNotification('Please select a student.', 'error');
  //     return;
  //   }
  //   if (!selectedAccount?.id) {
  //     showNotification('Please select a bank account.', 'error');
  //     return;
  //   }
  //   // handle pay via input field error message
  //   if (!selectedGateway?.id) {
  //     showNotification('Please select a Pay via option.', 'error');
  //     return;
  //   }

  //   if (!feesName) {
  //     showNotification('please fill out feesName field.', 'error');
  //     return;
  //   } else if (!feesAmount) {
  //     showNotification('please fill out feesAmount field.', 'error');
  //     return;
  //   } else if (!feesName && !feesAmount) {
  //     showNotification(
  //       'please fill out feesName and feesAmount field.',
  //       'error'
  //     );
  //     return;
  //   }

  //   // other fees entry part
  //   let collect_filter_data = [
  //     {
  //       collected_amount: parseInt(feesAmount),
  //       total_payable: parseInt(feesAmount)
  //     }
  //   ];
  //   axios
  //     .post('/api/student_payment_collect/other_fees', {
  //       student_id: feesUserData.id,
  //       collected_by_user: user?.id,
  //       //  fee_id: selectedRows,  // optional
  //       account_id: selectedAccount?.id,
  //       payment_method_id: selectedGateway?.id,
  //       collected_amount: parseInt(feesAmount),
  //       transID: transID ? transID : null,
  //       total_payable: [parseInt(feesAmount)],
  //       sent_sms: false,
  //       collect_filter_data,
  //       fees_name: feesName
  //     })
  //     .then((res) => {
  //       if (res.data.success) {
  //         setFeesName('');
  //         setFeesAmount('');
  //         showNotification(
  //           `Congratulations! Payment Successfully Processed`,
  //           'success'
  //         );
  //       }
  //     })
  //     .catch((error) => {
  //       // console.log('Frontend catch block error message is here');
  //     });
  // };
  const handleClick = (
    event: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    setCollect_other_fees_btn(true);
  };

  return (
    <Grid component={Paper} sx={{ borderRadius: 0.5 }}>
      <Grid
        sx={{
          borderRadious: 0,
          background: (themes) => themes.colors.primary.dark,
          py: 1,
          px: 1,
          color: 'white',
          fontWeight: 700,
          textAlign: 'left'
        }}
      >
        Other Fees
      </Grid>
      <Grid
        sx={{
          p: 2
        }}
      >
        <Grid
          sx={{
            paddingBottom: '9px'
          }}
        >
          <form>
            <Grid
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '20px'
              }}
            >
              <Grid
                sx={{
                  flexBasis: '40%',
                  flexGrow: 1
                }}
              >
                <Typography
                  component="label"
                  sx={{
                    color: '#223354b3',
                    fontSize: '14px',
                    display: 'block',
                    paddingBottom: '9px'
                  }}
                >
                  Fee Name{' '}
                  <Typography component="span" sx={{ color: '#fc0303' }}>
                    *
                  </Typography>
                </Typography>

                <TextField
                  size="small"
                  sx={{
                    m: 0
                  }}
                  placeholder="Fee Name"
                  fullWidth
                  variant="outlined"
                  value={feesName}
                  onChange={handleFeesName}
                />
              </Grid>
              <Grid
                sx={{
                  flexBasis: '40%',
                  flexGrow: 1
                }}
              >
                <Typography
                  component="label"
                  sx={{
                    color: '#223354b3',
                    fontSize: '14px',
                    display: 'block',
                    paddingBottom: '9px'
                  }}
                >
                  Amount{' '}
                  <Typography component="span" sx={{ color: '#fc0303' }}>
                    *
                  </Typography>
                </Typography>

                <TextField
                  type="number"
                  size="small"
                  sx={{
                    m: 0
                  }}
                  placeholder="Amount"
                  fullWidth
                  variant="outlined"
                  value={feesAmount}
                  onChange={handleFeesAmount}
                />
              </Grid>
            </Grid>

            {/* <Grid mt={2}>
              <Button
                variant="contained"
                type="submit"
                onClick={handleClick}
                disabled={
                  feesName === '' ||
                  feesName === null ||
                  feesAmount === '' ||
                  feesAmount === null ||
                  collect_other_fees_btn === true
                    ? true
                    : false
                }
                sx={{ borderRadius: 0.5, padding: '6px', width: '100%' }}
              >
                Collect
              </Button>
            </Grid> */}
          </form>
        </Grid>
      </Grid>
    </Grid>
  );
}
