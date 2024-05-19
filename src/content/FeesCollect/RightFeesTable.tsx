import Paper from '@mui/material/Paper';
import { Grid, TextField, Typography, Button } from '@mui/material';
import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useAuth } from '@/hooks/useAuth';
import useNotistick from '@/hooks/useNotistick';
import { TextFieldWrapper } from '@/components/TextFields';

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
      <Grid sx={{pt: 2,px: 1}}>
          <form>
            <Grid
              sx={{
                display: 'grid',
                gridTemplateColumns:"1fr",
              }}
            >
              
              <TextFieldWrapper
                minWidth="100%"
                label="Fee Name *"
                name="fee_name"
                placeholder="type other fee name"
                variant="outlined"
                handleChange={handleFeesName}
                value={feesName}
                touched={undefined}
                errors={undefined}
                handleBlur={undefined}
              />

              <TextFieldWrapper
                label="Amount *"
                name="amount"
                type='number'
                placeholder="type other fee amount..."
                variant="outlined"
                handleChange={handleFeesAmount}
                value={feesAmount}
                touched={undefined}
                errors={undefined}
                handleBlur={undefined}
              />
            </Grid>
          </form>
      </Grid>
    </Grid>
  );
}
