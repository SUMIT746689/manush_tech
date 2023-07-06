
import { Grid, TextField } from '@mui/material';
import { DatePicker, MobileDatePicker } from '@mui/lab';
import { useEffect, useState } from 'react';
import dayjs from 'dayjs';

export function DateRangePickerWrapper({ startDate, setStartDate, endDate, setEndDate }) {
  const handleStartDate = (e) => setStartDate(dayjs(e));
  const handleEndDate = (e) => setEndDate(dayjs(e));
  return (
    <Grid display={"grid"} gridTemplateColumns='1fr 1fr' pb={1} item gap={0.5}>
      <Grid >
        <MobileDatePicker
          label="Start Date"
          inputFormat='dd/MM/yyyy'
          value={startDate}
          onChange={handleStartDate}
          renderInput={
            (params) =>
              <TextField
                fullWidth
                size='small'
                sx={{
                  [`& fieldset`]: {
                    borderRadius: 0.6,
                  }
                }}
                {...params}
              />}
        />
      </Grid>
      <Grid>
        <MobileDatePicker
          label="End Date"
          inputFormat='dd/MM/yyyy'
          value={endDate}
          onChange={handleEndDate}
          renderInput={
            (params) =>
              <TextField
                fullWidth
                size='small'
                sx={{
                  [`& fieldset`]: {
                    borderRadius: 0.6,
                  }
                }}
                {...params} />}
        />

      </Grid>
    </Grid>
  );
}

export const DatePickerWrapper = ({ label, date, handleChange }) => {
  console.log({ date })
  return (
    <Grid item pb={1}>
      <DatePicker
        label={label}
        inputFormat='dd/MM/yyyy'
        value={date}
        onChange={handleChange}
        renderInput={
          (params) =>
            <TextField
              size='small'
              sx={{
                [`& fieldset`]: {
                  borderRadius: 0.6,
                }
              }}
              fullWidth
              {...params}
            />}
      />
    </Grid>
  )
}