import Paper from '@mui/material/Paper';
import { Grid, TextField, Typography } from '@mui/material';
import React, { useState, ChangeEvent } from 'react';

export default function RightFeesTable() {
  const [feesName, setFeesName] = useState<string>('');
  const [feesAmount, setFeesAmount] = useState<number>(0);

  const handleFeesName = (event: ChangeEvent<HTMLInputElement>) => {
    setFeesName(event.target.value);
  };

  const handleFeesAmount = (event: ChangeEvent<HTMLInputElement>) => {
    setFeesAmount(parseInt(event.target.value));
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
                size="small"
                sx={{
                  m: 0
                }}
                placeholder="Amount"
                fullWidth
                variant="outlined"
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
