import { Grid, TextField, Typography, Alert } from '@mui/material';
import { AutoCompleteWrapperWithDebounce } from '@/components/AutoCompleteWrapper';
import { DatePickerWrapper } from '@/components/DatePickerWrapper';
import { SearchingButtonWrapper } from '@/components/ButtonWrapper';
import { ChangeEvent } from 'react';

const LeftBox = ({
  selected_month,
  setSelectMonth,
  debounceTimeout,
  handleDebounce,
  searchHandleUpdate,
  searchData,
  searchValue,
  searchHandleChange,
  datePickerHandleChange,
  monthData,
  btnHandleClick,
  setStudentId,
  student_id,
  collectionDate,
  setCollectionDate
}) => {
  const handleChangeStudentId = (event: ChangeEvent<HTMLInputElement>) => {
    setStudentId(event.target.value);
  };

  const monthHandleChange = (event: ChangeEvent<HTMLInputElement>, v): void => {
    setSelectMonth(v);
  };

  return (
    <Grid
      sx={{
        borderRadius: 0.5,
        overflow: 'hidden',
        border: (themes) => `1px dashed ${themes.colors.primary.dark}`,
        backgroundColor: '#fff'
      }}
    >
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
        Search
      </Grid>
      <form>
        <Grid
          sx={{
            p: 2
          }}
        >
          <AutoCompleteWrapperWithDebounce
            debounceTimeout={debounceTimeout}
            handleDebounce={handleDebounce}
            searchHandleUpdate={searchHandleUpdate}
            options={searchData}
            value={searchValue}
            handleChange={searchHandleChange}
            label=""
            placeholder="Search Student Id - Name - Roll - Class - Section - G"
          />
          <Grid
            sx={{
              paddingBottom: '9px'
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
              Student Id{' '}
              <Typography component="span" sx={{ color: '#fc0303' }}>
                *
              </Typography>
            </Typography>

            <TextField
              size="small"
              sx={{
                m: 0
              }}
              placeholder="Student Id"
              fullWidth
              variant="outlined"
              onChange={handleChangeStudentId}
              value={student_id}
            />
          </Grid>
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
                Collection Date{' '}
                <Typography component="span" sx={{ color: '#fc0303' }}>
                  *
                </Typography>
              </Typography>
              <DatePickerWrapper
                label={''}
                date={collectionDate}
                handleChange={datePickerHandleChange}
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
                Month To{' '}
                <Typography component="span" sx={{ color: '#fc0303' }}>
                  *
                </Typography>
              </Typography>

              <AutoCompleteWrapperWithDebounce
                debounceTimeout=""
                options={monthData}
                value={selected_month}
                // value={undefined}
                handleChange={monthHandleChange}
                label=""
                placeholder="Month To"
              />
            </Grid>
          </Grid>

          <Grid
            sx={{
              paddingTop: '9px'
            }}
          >
            <SearchingButtonWrapper
              isLoading={false}
              handleClick={btnHandleClick}
              disabled={false}
              children={'Search'}
            />
          </Grid>
        </Grid>
      </form>
    </Grid>
  );
};

export default LeftBox;
