
import { Grid, TextField } from '@mui/material';
import { DatePicker, MobileDatePicker, TimePicker } from '@mui/lab';
import dayjs from 'dayjs';

export function DateRangePickerWrapper({ startDate, setStartDate, endDate, setEndDate }) {
  const handleStartDate = (e) => {
    if (e) {
      setStartDate(dayjs(e));
    }
    else {
      setStartDate(null)
    }

    setEndDate(null)
  }
  const handleEndDate = (e) => {
    const temp = dayjs(e)
    if (e && startDate && temp >= startDate) {
      setEndDate(temp);
    }
    else {
      setEndDate(null)
    }
  }
  return (
    <Grid display={"grid"} gridTemplateColumns='1fr 1fr' pb={1} item gap={0.5}>
      <Grid >
        <MobileDatePicker
          label="Start Date"
          inputFormat='dd/MM/yyyy'
          value={startDate}
          clearable
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
          clearable
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
              onKeyDown={(e) => {
                e.preventDefault()
              }}
              fullWidth
              {...params}
            />}
      />
    </Grid>
  )
}

export const TimePickerWrapper = ({ label, value, handleChange, minWidth = "100%" }) => {
  return (
    <Grid minWidth={minWidth} item pb={1}>
      <TimePicker
        label={label}
        value={value}
        onChange={handleChange}
        renderInput={
          (params) =>
            <TextField
              size='small'
              sx={{
                [`& fieldset`]: {
                  borderRadius: 0.6,
                  minWidth: minWidth,
                }
              }}
              fullWidth
              {...params}
            />}
      />
    </Grid>
  )
}