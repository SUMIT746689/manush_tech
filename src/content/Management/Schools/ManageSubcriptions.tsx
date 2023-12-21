import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import { Formik } from 'formik';
import { useTranslation } from 'react-i18next';
import 'react-quill/dist/quill.snow.css';

import {
  Grid,
  Dialog,
  DialogTitle,
  DialogContent,
  Box,
  Typography,
  TextField,
  CircularProgress,
  Autocomplete,
  Button,
  useTheme
} from '@mui/material';
import axios from 'axios';
import { useClientFetch } from '@/hooks/useClientFetch';
import { useSearchUsers } from '@/hooks/useSearchUsers';
import useNotistick from '@/hooks/useNotistick';
import { TextFieldWrapper } from '@/components/TextFields';
import { ButtonWrapper } from '@/components/ButtonWrapper';
import { DialogActionWrapper } from '@/components/DialogWrapper';
import MobileDatePicker from '@mui/lab/MobileDatePicker';

function ManageSubcriptions({ open, setOpen, reFetchData }): any {

  console.log({ open });

  const { t }: { t: any } = useTranslation();
  const { showNotification } = useNotistick();
  const theme = useTheme();

  const handleCreateProjectClose = () => {
    setOpen(false);
  };

  const handleCreateProjectSuccess = (message) => {
    showNotification(message);
    setOpen(false);
  };


  const handleFormSubmit = async (
    _values,
    resetForm,
    setErrors,
    setStatus,
    setSubmitting
  ) => {
    try {
      console.log("_values__", _values);

      const handleSubmitSuccess = async (message) => {
        resetForm();
        setStatus({ success: true });
        setSubmitting(false);
        handleCreateProjectSuccess(message);
        setOpen(null);
        reFetchData();
      };

      const res = await axios.post('/api/subscriptions', {
        school_id: open?.id,
        subscription_id: open?.subscription[0]?.id,
        ..._values
      });
      if (res.data?.success) {
        handleSubmitSuccess(t('School package added successfully'));
      }
    } catch (err) {
      console.log(err);

      setStatus({ success: false });
      setErrors({ submit: err.message });
      setSubmitting(false);
      showNotification(err?.response?.data?.message, 'error')
    }
  };
  const subscriptionLength = open?.subscription?.length > 0
  return (
    <>
      <Dialog
        fullWidth
        maxWidth="sm"
        open={open}
        onClose={handleCreateProjectClose}
      >
        <DialogTitle
          sx={{
            p: 3
          }}
        >
          <Typography variant="h4" gutterBottom>
            {t('Manage school subscriptions')}
          </Typography>
          <Typography variant="subtitle2">
            {t('Use this dialog window to add or change school')}
          </Typography>
        </DialogTitle>
        <Formik
          initialValues={{
            name: open?.name,
            end_date: subscriptionLength && open?.subscription[0].end_date,
            submit: null
          }}

          onSubmit={async (
            _values,
            { resetForm, setErrors, setStatus, setSubmitting }
          ) => {
            handleFormSubmit(
              _values,
              resetForm,
              setErrors,
              setStatus,
              setSubmitting
            );
          }}
        >
          {({
            errors,
            handleBlur,
            handleChange,
            handleSubmit,
            isSubmitting,
            touched,
            values,
            setFieldValue
          }) => (
            <form onSubmit={handleSubmit}>
              <DialogContent
                dividers
                sx={{
                  p: 3
                }}
              >
                <Grid container spacing={2}>

                 <Typography variant='h4' width={'100%'} pl={2}>{values.name}</Typography>



                  <Grid
                    display={"grid"}
                    item
                    width={"100%"}
                  >
                    <MobileDatePicker
                      label="Select End Date"
                      inputFormat='dd/MM/yyyy'
                      value={values.end_date || null}
                      onChange={(newValue) => {
                        setFieldValue('end_date', newValue);
                      }}
                      renderInput={(params) => <TextField
                        size='small'
                        sx={{
                          mb: 1,
                          [`& fieldset`]: {
                            borderRadius: 0.6,
                          }
                        }}
                        fullWidth
                        {...params}
                      />}
                    />
                  </Grid>
                </Grid>
              </DialogContent>

              <DialogActionWrapper
                handleCreateClassClose={handleCreateProjectClose}
                errors={errors}
                editData={undefined}
                title="Subscription"
                titleFront="Add "
                isSubmitting={isSubmitting}
              />
            </form>
          )}
        </Formik>
      </Dialog>
    </>
  );
}

export default ManageSubcriptions;

function AdminSelect({ setFieldValue, oldSelectedAdminID }) {
  const [searchToken, setSearchToken] = useState('');
  // todo: now options is showing user with wny role, but we need users with only admin role
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const { searchUsers } = useSearchUsers(10);

  const getNsetOptions = async () => {
    const [users, err] = await searchUsers({ by: null, token: null });
    if (err) return;

    setOptions(
      users.map((user) => {
        return {
          id: user.id,
          label: user.username
        };
      })
    );
    if (oldSelectedAdminID) {
      const user = users.find((user) => user.id === oldSelectedAdminID);
      setSelectedOption({ id: user.id, label: user.username });
    }
  };

  const handleSelect = (value) => {
    setSelectedOption(value);
    if (value) setFieldValue('admin_id', value.id);
  };

  useEffect(() => {
    getNsetOptions();
  }, []);
  //
  useEffect(() => {
    if (searchToken.length > 3) {
      getNsetOptions();
    }
  }, [searchToken]);
  return (
    <>
      <Autocomplete
        renderInput={(params) => <TextField {...params} label="Select admin" />}
        options={options}
        onChange={(e, v) => handleSelect(v)}
        filterOptions={(x) => x}
        onInputChange={(e, v) => setSearchToken(v)}
        value={selectedOption}
      />
    </>
  );
}
